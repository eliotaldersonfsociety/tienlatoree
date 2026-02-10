"use client";

import { useState, useRef } from "react";

const shirts = [
  "/shirts/camiseta-n1-adidas.webp",
  "/shirts/camiseta-n2-adidas.webp",
  "/shirts/camiseta-n3-adidas.webp",
  "/shirts/camiseta-n4-adidas.webp",
  "/shirts/camiseta-n5-adidas.webp",
  "/shirts/camiseta-n6-adidas.webp",
  "/shirts/camiseta-n7-adidas.webp",
];

// APIs de IA gratuitas para generar imágenes realistas
const AI_APIS = {
  REPLICATE: "replicate", // 500 inferencias gratis/mes
  HUGGING_FACE: "huggingface", // 30k inferencias gratis/mes
  STABILITY_AI: "stability", // Free tier
  FAL_AI: "fal", // Free tier
};

export default function AIVirtualTryOn() {
  const [selectedShirt, setSelectedShirt] = useState(shirts[0]);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState(AI_APIS.REPLICATE);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Manejar subida de imagen del usuario
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageBase64 = event.target?.result as string;
      setUserImage(imageBase64);
      setGeneratedImage(null); // Resetear imagen generada
    };
    reader.readAsDataURL(file);
  };

  // 2. Enviar a API de IA para generar imagen realista
  const generateVirtualTryOn = async () => {
    if (!userImage) {
      alert("Por favor, sube una foto primero");
      return;
    }

    setIsGenerating(true);
    setProgress(10);

    try {
      let resultImageUrl: string | null = null;

      switch (selectedAPI) {
        case AI_APIS.REPLICATE:
          resultImageUrl = await generateWithReplicate();
          break;
        case AI_APIS.HUGGING_FACE:
          resultImageUrl = await generateWithHuggingFace();
          break;
        case AI_APIS.STABILITY_AI:
          resultImageUrl = await generateWithStabilityAI();
          break;
        case AI_APIS.FAL_AI:
          resultImageUrl = await generateWithFalAI();
          break;
        default:
          resultImageUrl = await generateWithReplicate();
      }

      if (resultImageUrl) {
        setGeneratedImage(resultImageUrl);
      } else {
        throw new Error("No se pudo generar la imagen");
      }

    } catch (error) {
      console.error("Error generating image:", error);
      alert("Error al generar la imagen. Intenta con otra API o foto.");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  // 3. API: Replicate (500 inferencias gratis/mes)
  const generateWithReplicate = async (): Promise<string> => {
    setProgress(30);
    
    // Modelo: Stable Diffusion + ControlNet para try-on
    const response = await fetch("/api/generate/replicate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userImage: userImage?.split(',')[1], // Base64 sin header
        shirtImage: selectedShirt,
        prompt: "professional photography of a person wearing a t-shirt, realistic, high quality, detailed clothing, natural lighting",
        negative_prompt: "ugly, deformed, blurry, low quality, watermark",
        num_inference_steps: 30,
        guidance_scale: 7.5,
      }),
    });

    setProgress(60);

    if (!response.ok) {
      throw new Error("Replicate API error");
    }

    const data = await response.json();
    
    if (data.output && data.output.length > 0) {
      setProgress(90);
      return data.output[0]; // URL de la imagen generada
    } else {
      throw new Error("No image generated");
    }
  };

  // 4. API: Hugging Face (30k inferencias gratis/mes)
  const generateWithHuggingFace = async (): Promise<string> => {
    setProgress(30);
    
    // Usar modelo Stable Diffusion
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `realistic photo of a person wearing ${selectedShirt.split('/').pop()}, professional photography, high quality, detailed clothing`,
          parameters: {
            negative_prompt: "ugly, deformed, blurry",
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }),
      }
    );

    setProgress(60);

    if (!response.ok) {
      throw new Error("Hugging Face API error");
    }

    const blob = await response.blob();
    setProgress(90);
    return URL.createObjectURL(blob);
  };

  // 5. API: Stability AI (free tier)
  const generateWithStabilityAI = async (): Promise<string> => {
    setProgress(30);
    
    const response = await fetch("/api/generate/stability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userImage,
        shirtImage: selectedShirt,
        engine_id: "stable-diffusion-xl-1024-v1-0",
        height: 1024,
        width: 1024,
        cfg_scale: 7,
        samples: 1,
        steps: 30,
      }),
    });

    setProgress(60);

    if (!response.ok) {
      throw new Error("Stability AI API error");
    }

    const data = await response.json();
    setProgress(90);
    return data.artifacts[0].base64;
  };

  // 6. API: Fal.ai (free tier)
  const generateWithFalAI = async (): Promise<string> => {
    setProgress(30);
    
    const response = await fetch("/api/generate/fal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userImage,
        shirtImage: selectedShirt,
        model: "fast-sdxl",
        prompt: "realistic person wearing the provided t-shirt, professional photography",
      }),
    });

    setProgress(60);

    if (!response.ok) {
      throw new Error("Fal.ai API error");
    }

    const data = await response.json();
    setProgress(90);
    return data.image.url;
  };

  // 7. Descargar imagen generada
  const downloadGeneratedImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `virtual-try-on-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Virtual Try-On Generator
          </h1>
          <p className="text-gray-600">
            Sube tu foto, elige una camiseta, y la IA generará una imagen realista
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel izquierdo: Controles */}
          <div className="space-y-6">
            {/* Paso 1: Subir foto */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                1. Tu Foto
              </h3>
              <div className="text-center">
                {userImage ? (
                  <div className="relative">
                    <img
                      src={userImage}
                      alt="Tu foto"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <button
                      onClick={() => setUserImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      Haz clic para subir tu foto
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG (rostro frontal recomendado)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Paso 2: Seleccionar camiseta */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                2. Elige Camiseta
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {shirts.map((shirt, index) => (
                  <button
                    key={shirt}
                    onClick={() => setSelectedShirt(shirt)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedShirt === shirt
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                      <div className="text-lg font-bold text-gray-700">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      Modelo {index + 1}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Paso 3: Seleccionar API */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                3. Motor de IA
              </h3>
              <div className="space-y-3">
                {Object.entries(AI_APIS).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedAPI(value)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedAPI === value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedAPI === value
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}>
                        {value === AI_APIS.REPLICATE ? "500/mes gratis" :
                         value === AI_APIS.HUGGING_FACE ? "30k/mes gratis" :
                         "Free Tier"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Botón de generar */}
            <button
              onClick={generateVirtualTryOn}
              disabled={!userImage || isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                !userImage || isGenerating
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generando con IA ({progress}%)</span>
                </div>
              ) : (
                "✨ Generar con IA"
              )}
            </button>
          </div>

          {/* Panel derecho: Resultado */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 min-h-[600px]">
              <h3 className="text-xl font-bold text-white mb-6">
                Resultado Generado por IA
              </h3>
              
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 h-[500px] flex items-center justify-center">
                {generatedImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={generatedImage}
                      alt="Virtual try-on generado por IA"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                      <p className="text-sm text-white">
                        Generado con <span className="font-medium text-blue-300">{selectedAPI.toUpperCase()}</span>
                      </p>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={downloadGeneratedImage}
                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descargar
                      </button>
                      <button
                        onClick={generateVirtualTryOn}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                      >
                        Regenerar
                      </button>
                    </div>
                  </div>
                ) : isGenerating ? (
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl mb-2">{progress}%</span>
                        <span className="text-sm text-gray-400">IA generando...</span>
                      </div>
                    </div>
                    <div className="w-64 bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 mt-4 text-sm">
                      La IA está creando una imagen realista con la camiseta seleccionada
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-6 text-gray-600">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl text-gray-300 mb-3">
                      Esperando para generar
                    </h4>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Sube tu foto, selecciona una camiseta y haz clic en "Generar con IA" para crear una imagen realista usando inteligencia artificial.
                    </p>
                  </div>
                )}
              </div>

              {/* Información de la API */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {selectedAPI === AI_APIS.REPLICATE ? "500" :
                     selectedAPI === AI_APIS.HUGGING_FACE ? "30,000" : "∞"}
                  </div>
                  <div className="text-sm text-gray-400">Inferencias gratis/mes</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {selectedAPI === AI_APIS.REPLICATE ? "10-30s" :
                     selectedAPI === AI_APIS.HUGGING_FACE ? "5-15s" : "3-10s"}
                  </div>
                  <div className="text-sm text-gray-400">Tiempo de generación</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">1024px</div>
                  <div className="text-sm text-gray-400">Resolución máxima</div>
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-800 mb-4">
                ¿Cómo funciona la IA?
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4">
                  <div className="text-3xl text-blue-600 mb-2">1</div>
                  <h5 className="font-semibold text-gray-800 mb-1">Analiza</h5>
                  <p className="text-sm text-gray-600">
                    La IA analiza tu pose y cuerpo
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-3xl text-blue-600 mb-2">2</div>
                  <h5 className="font-semibold text-gray-800 mb-1">Combina</h5>
                  <p className="text-sm text-gray-600">
                    Fusiona la camiseta con tu imagen
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-3xl text-blue-600 mb-2">3</div>
                  <h5 className="font-semibold text-gray-800 mb-1">Genera</h5>
                  <p className="text-sm text-gray-600">
                    Crea una imagen realista nueva
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}