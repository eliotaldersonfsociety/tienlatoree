"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

// Colores disponibles para las camisetas
const colors = [
  { name: "Negro", value: "bg-black", text: "text-white" },
  { name: "Blanco", value: "bg-white", text: "text-black", border: "border border-gray-300" },
  { name: "Rosado", value: "bg-pink-300", text: "text-black" },
  { name: "Azul claro", value: "bg-blue-200", text: "text-black" },
  { name: "Azul", value: "bg-blue-600", text: "text-white" },
  { name: "Verde", value: "bg-green-600", text: "text-white" },
  { name: "Gris", value: "bg-gray-400", text: "text-black" },
]

// Marcas disponibles
const brands = [
  { name: "Adidas", logo: "/adidas.svg" },
  { name: "Nike", logo: "/nike.svg" },
  { name: "Under", logo: "/under-armour.svg" },
]

interface Section {
  type: "image" | "video"
  titlePart1: string
  titlePart2: string
  description: string
  media: string
  poster?: string
}

const sections: Section[] = [
  {
    type: "video",
    titlePart1: "👕 CAMISETAS DEPORTIVAS",
    titlePart2: "PARA CADA OCASIÓN 🏃‍♂️",
    description: `
Cada camiseta incluye:
• Tela ligera y transpirable — ¡ideal para entrenar!
• Secado rápido para entrenamientos intensos
• Ajuste cómodo que resalta tu físico

Disponibles en múltiples colores y marcas
    `,
    media: "/modelo2.webm",
    poster: "/modelo2.webp",
  },
  {
    type: "image",
    titlePart1: "EL REGALO PERFECTO",
    titlePart2: "QUE RECORDARÁN 🎁",
    description:
      "Empacadas con cuidado y listas para sorprender.\n🎁 Ideales para cumpleaños y eventos deportivos\n📦 Empaque premium\n😊 Sonrisas garantizadas",
    media: "/camiseta1.webp",
  },
  {
    type: "image",
    titlePart1: "MÁS QUE CAMISETAS",
    titlePart2: "TU MEJOR ALIADO 💛",
    description:
      "Suaves, cómodas y diseñadas para brindar confort en cualquier actividad.\nUn acompañante que no querrás dejar de usar.",
    media: "/camiseta2.webp",
  },
  {
    type: "image",
    titlePart1: "AMADAS POR TODOS",
    titlePart2: "CONFIABLES PARA SIEMPRE ✅",
    description:
      "Perfectas para el trabajo, el deporte y aventuras diarias.\n✔ Materiales seguros\n✔ Fáciles de lavar\n✔ Comodidad aprobada",
    media: "/camiseta3.webp",
  },
  {
    type: "image",
    titlePart1: "ENVÍO RÁPIDO DESDE",
    titlePart2: "CÚCUTA 🚚",
    description:
      "Cumplimos en toda Colombia.\nEnvío rápido desde Cúcuta\nSin esperas largas\n\n🔒 Pago seguro · Paga con Bancolombia, Nequi o Daviplata\nTu pago está 100% protegido",
    media: "/servientrega.avif",
  },
]

export function AlternatingContent() {
  const [playing, setPlaying] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [selectedBrand, setSelectedBrand] = useState(brands[0])

  // Generar la ruta de la imagen basada en el color y marca seleccionados
  const getColorImagePath = (colorIndex: number, brand: string) => {
    const brandLower = brand.toLowerCase().replace(/\s+/g, '-')
    return `/camisetas-n${colorIndex + 1}-${brandLower}.webp`
  }

  // Obtener la imagen actual basada en la selección
  const currentImage = getColorImagePath(
    colors.findIndex(c => c.name === selectedColor.name),
    selectedBrand.name
  )

  return (
    <div className="py-4 md:py-12">
      {/* Sección de contenido alternado */}
      <section className="container mx-auto px-4">
        {sections.map((section, index) => (
          <div key={index} className="grid grid-cols-1 gap-6 md:gap-12 items-center mb-12 md:mb-20">
            {/* TEXT */}
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                {section.titlePart1}{" "}
                <span className="text-yellow-500">
                  {section.titlePart2}
                </span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.description}
              </p>
              {index === 0 && (
                <p className="text-[11px] text-gray-500 opacity-80">
                  🔒 Secure checkout · Bancolombia · Nequi · Daviplata
                </p>
              )}
            </div>

            {/* MEDIA */}
            <div className="relative">
              {section.type === "video" ? (
                playing === index ? (
                  <video
                    src={section.media}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-w-full mx-auto rounded-lg shadow-lg"
                    aria-label="Camisetas deportivas video"
                  />
                ) : (
                  <button
                    onClick={() => setPlaying(index)}
                    aria-label="Play camisetas video"
                    className="relative group w-full"
                  >
                    <Image
                      src={section.poster!}
                      alt="Camisetas video preview"
                      width={500}
                      height={900}
                      className="w-full max-w-lg mx-auto h-auto object-cover rounded-lg"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black/60 p-3 md:p-4 rounded-full group-hover:scale-110 transition">
                        <Play className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </span>
                    </span>
                  </button>
                )
              ) : (
                <Image
                  src={section.media}
                  alt={`${section.titlePart1} ${section.titlePart2}`}
                  width={500}
                  height={900}
                  className="w-full max-w-lg mx-auto h-auto object-cover rounded-lg shadow-md"
                />
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Sección de opciones de producto */}
      <section className="container mx-auto px-4 bg-white p-4 md:p-8 rounded-lg shadow-sm mb-8">
        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-black">Personaliza tu camiseta</h3>

        {/* Imagen de previsualización del producto */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Previsualización</h4>
          <div className="relative w-full max-w-md mx-auto">
            <Image
              src={currentImage}
              alt={`Camiseta ${selectedColor.name} - ${selectedBrand.name}`}
              width={400}
              height={400}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <p className="text-sm mt-2 text-gray-600 text-center">
            {selectedColor.name} · {selectedBrand.name}
          </p>
        </div>

        {/* Selector de colores */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Colores disponibles</h4>
          <div className="flex flex-wrap gap-2 md:gap-4">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`w-9 h-9 md:w-12 md:h-12 rounded-full ${color.value} ${color.border || ''} flex items-center justify-center ${selectedColor.name === color.name ? 'ring-2 ring-yellow-500 ring-offset-1' : ''}`}
                aria-label={`Seleccionar color ${color.name}`}
              >
                {selectedColor.name === color.name && (
                  <span className={`text-xs font-bold ${color.text}`}>✓</span>
                )}
              </button>
            ))}
          </div>
          <p className="text-sm mt-2 text-gray-600">Color seleccionado: <span className="font-medium">{selectedColor.name}</span></p>
        </div>

        {/* Selector de marcas */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Marcas disponibles</h4>
          <div className="flex flex-wrap gap-2 md:gap-4">
            {brands.map((brand) => (
              <button
                key={brand.name}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-2 md:px-6 md:py-3 border-2 rounded-lg flex items-center gap-2 transition-all text-sm ${selectedBrand.name === brand.name ? 'border-yellow-500 ring-2 ring-yellow-500 ring-offset-1' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={32}
                  height={32}
                  className={`w-8 h-8 md:w-10 md:h-10 object-contain ${brand.name === 'Nike' ? 'translate-x-0' : ''}`}
                />
                <span className="font-medium text-black">{brand.name}</span>
              </button>
            ))}
          </div>
          <p className="text-sm mt-2 text-gray-600">Marca seleccionada: <span className="font-medium">{selectedBrand.name}</span></p>
        </div>

        {/* Botón de acción */}
        <div className="flex justify-center">
          <button
            onClick={() => document.getElementById('product-showcase')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 md:py-3 md:px-8 rounded-lg transition-colors w-full md:w-auto cursor-pointer"
          >
            Ir a Comprar
          </button>
        </div>
      </section>
    </div>
  )
}
