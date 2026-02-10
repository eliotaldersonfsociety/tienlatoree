"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, ShoppingBag, Truck, CreditCard, RotateCcw, Shirt, Ruler, MapPin } from "lucide-react";

const MAX_LEN = 10;

// Respuestas del bot organizadas por categoría
const responses = {
  // Saludos
  greeting: "¡Hola! 👋 Soy el asistente de La Torre Imperial. Somos especialistas en camisetas deportivas para gym de la mejor calidad en Cúcuta. ¿En qué puedo ayudarte hoy?",
  greeting_alt: "¡Hey! ¡Bienvenido a La Torre Imperial! 🏋️‍♂️ ¿Buscas camisetas deportivas cómodas y de calidad? ¡Yo te ayudo!",

  // Productos y camisetas
  products: "Nuestras camisetas deportivas son ideales para gym: tela respirable, secado rápido, muy cómodas para entrenar. Precio especial $68.000 COP. ¿Te cuento más?",
  product_details: "Nuestras camisetas tienen:\n✅ Tela premium respirable\n✅ Secado rápido\n✅ Corte cómodo para entrenar\n✅ Colores: Negro, Blanco, Azul, Rojo\n✅ Tallas: S, M, L, XL",
  material: "Nuestras camisetas son 100% polyester de alta calidad, específicamente diseñadas para entrenamiento. Secado rápido, resistentes y cómodas. ¡La mejor tela para gym!",
  sizes: "Tallas disponibles: S, M, L, XL. ¿Qué talla usas normalmente? Te recomiendo la tuya para que te quede perfecta.",

  // Precios y descuentos
  price: "¡Excelente pregunta! Nuestra camiseta deportiva tiene un precio especial de $68.000 COP. Pero espera, tenemos descuentos por volumen: 📦 2 = 5% OFF, 3 = 8% OFF, 4 = 10% OFF. ¡Entre más compras, más ahorras!",
  discount: "🎉 ¡Descuentos exclusivos por volumen!\n• 2 unidades = 5% de descuento\n• 3 unidades = 8% de descuento\n• 4 unidades = 10% de descuento\n¡Perfecto para entrenar toda la semana!",

  // Envíos y ubicación
  shipping: "📍 Estamos en Cúcuta, Colombia. Enviamos a TODO EL PAÍS:\n🚚 1-3 días hábiles a principales ciudades\n📦 Envío gratis en compras acima de $200.000 COP",
  delivery_time: "⏱️ Tiempos de entrega:\n• Cúcuta ciudad: 1-2 días\n• Ciudades principales: 2-3 días\n• Otras zonas: 3-5 días\n¡Rápido y seguro!",
  location: "📍 La Torre Imperial - Cúcuta, Colombia\n🇨🇴 Envíos a todo el país\n¡Desde el nororiente de Colombia para todo el país!",

  // Pagos
  payment: "💳 Aceptamos varios métodos de pago:\n• Nequi\n• Bancolombia\n• Daviplata\n• Pago contra entrega (pagas cuando recibes)\n• Transferencia bancaria\n¿Qué método prefieres?",
  cash_on_delivery: "✅ Pago contra entrega disponible\nPagas cuando el paquete llega a tus manos. Así de sencillo y seguro. ¿Te animas?",

  // Tallas y colores
  colors: "🎨 Colores disponibles:\n• Negro\n• Blanco\n• Azul\n• Rojo\n¿Qué color te gusta más para entrenar?",

  // Comprar
  how_to_buy: "🛒 Cómo comprar es muy fácil:\n1. Elige tus camisetas\n2. Selecciona talla y color\n3. Agrega al carrito\n4. Elige método de pago\n5. ¡Listo! Te enviamos a casa",
  add_to_cart: "Para agregar al carrito, simplemente haz clic en el botón 'Agregar' en la camiseta que te guste. ¿Ya viste nuestros colores disponibles?",
  checkout: "Para finalizar tu compra, ve al carrito y completa tu pedido. ¡Pago contra entrega disponible para tu comodidad!",

  // Devoluciones
  returns: "🔄 Nuestra garantía de satisfacción:\n• 30 días para devoluciones\n• Si no te queda, te cambiamos la talla\n• Producto defectuoso, reembolso total\n¡Tu satisfacción es nuestra prioridad!",
  warranty: "🛡️ Garantía La Torre Imperial:\n• 30 días de garantía en todos los productos\n• Cambio de talla sin costo\n• Devolución si no estás satisfecho\n¡Compra con confianza total!",

  // Contacto y WhatsApp
  contact: "📞 Contáctanos:\n• WhatsApp: 57 300 975612\n• Instagram: @latorreimperial\n• Email: contacto@latorreimperial.com\n¡Estamos para ayudarte!",

  // Preguntas específicas
  gym: "🏋️ Nuestras camisetas son perfectas para gym porque:\n• Tela respirable que evacua el sudor\n• No incomodan al hacer ejercicio\n• Secado rapidísimo\n• Corte deportivo moderno\n¿Te interessan?",

  running: "🏃 Para running también son excelentes:\n• Ultra ligeras\n• Secado super rápido\n• No generan rozaduras\n• Cómodas para kilómetros largos\n¿Prefieres algún color en especial?",

  training: "💪 Para entrenamiento son ideales:\n• Libertad total de movimiento\n• Tela que no obstaculiza\n• Resistentes a muchas lavadas\n• Estilo moderno\n¿Te cuento sobre las tallas?",

  // Urgencia y escasez
  stock: "⚠️ ¡Stock limitado por color!\nLos colores más populares se agotan rápido. ¿Ya elegiste el tuyo antes de que se agote?",
  buy_now: "🛒 ¡No te quedes sin tus camisetas!\nStock limitado. Compara ahora y entrena cómodo desde mañana. ¿Te ayudo con algo más?",

  // Agradecimientos
  thanks: "🙏 ¡Gracias a ti por tu interés en La Torre Imperial! 🏋️‍♂️ ¿Hay algo más en lo que pueda ayudarte hoy?",
  thanks_alt: "¡De nada! 😊 Nos encanta ayudar. ¿Tienes más preguntas sobre nuestras camisetas o el proceso de compra?",

  // Despedidas
  goodbye: "¡Adiós! 👋 ¡Entrena cómodo con La Torre Imperial! 🏋️‍♂️ Recuerda que tenemos los mejores precios y descuentos por volumen. ¡Vuelve cuando quieras!",

  // Respuestas por insultos (manejo de situaciones difíciles)
  insult: "Lamento que te sientas así. 😔 Estoy aquí para ayudarte con cualquier duda sobre nuestras camisetas. ¿Hay algo en lo que pueda asistirte?",

  // Información general
  about: "🏭 La Torre Imperial es tu tienda especializada en ropa deportiva de Cúcuta, Colombia. Nos enfocamos en camisetas deportivas de la más alta calidad para que entrenes cómodo y luzcas increíble.",
  social_media: "📱 Síguenos en redes sociales:\n• Instagram: @latorreimperial\n• Facebook: La Torre Imperial\n• TikTok: @latorreimperial\n¡Mira nuestras historias de clientes satisfechos!",

  // Tarifas de envío
  shipping_cost: "🚚 Costos de envío:\n• Compras acima de $200.000 = ¡GRATIS!\n• Compras menores = Solo $15.000 COP\n¡Entre más compras, más ahorras!",

  // Guía de tallas
  size_guide: "📏 Guía de tallas:\n• S: Para pecho 90-95cm\n• M: Para pecho 96-100cm\n• L: Para pecho 101-105cm\n• XL: Para pecho 106-110cm\n¿Qué medida tienes?",

  // Lavado y cuidado
  washing: "🧺 Cuidado de tu camiseta:\n• Lavar en máquina con agua fría\n• No usar blanqueador\n• Secar en sombra\n• Planchar a temperatura baja\n¡Así te dura muchisimo!",

  // Default para preguntas no reconocidas
  default: "¡Entiendo! 😊 En La Torre Imperial nos especializamos en camisetas deportivas de la mejor calidad. ¿Te gustaría saber sobre:\n• Precios y descuentos\n• Tallas y colores\n• Envíos a todo Colombia\n• Métodos de pago\n• ¿Cómo comprar?\n¡Pregúntame lo que quieras!",

  // Origen
  origin: "🇨�opherol Nuestras camisetas son fabricadas en Colombia con materiales de primera calidad. ¡Apoyamos lo nacional y tú también puedes!",
};

// Keywords para cada intent
const keywords: Record<string, string[]> = {
  greeting: ["hola", "buenos", "buenas", "hey", "hi", "saludos", "epa", "qué más", "qué hubo", "buen día", "buena tarde", "buena noche", "hello", "buenas tardes", "buenas noches"],
  thanks: ["gracias", "thank", "thanks", "agradecido", "thank you", "te agradezco"],
  goodbye: ["adios", "bye", "chau", "hasta luego", "nos vemos", "me voy", "hasta pronto"],
  products: ["camiseta", "camisetas", "producto", "productos", "ropa", "sport", "deportivo", "gym", "training", "fit", "fitness"],
  product_details: ["características", "caracteristicas", "qué tiene", "tiene", "especificaciones", "detalles", "cómo son"],
  material: ["tela", "material", "tejido", "de qué está hecho", "composición", "qualidad"],
  sizes: ["talla", "tallas", "qué talla", "qué número", "size", "medida", "qué me sirve", "guía de tallas"],
  price: ["precio", "costo", "cuánto", "cuanto cuesta", "valor", "price", "cuánto vale", "precio unidad"],
  discount: ["descuento", "descuentos", "promoción", "oferta", "promo", "off", "porcentaje", "barato", "barata"],
  shipping: ["envío", "envios", "envian", "entrega", "entregar", "shipping", "domicilio", "delivery"],
  delivery_time: ["tiempo", "cuánto tarda", "cuanto tarda", "días", "demora", "cuando llega", "pronto", "rápido"],
  location: ["dónde están", "ubicados", "ubicación", "ciudad", "donde queda", "dirección", "address", "dónde queda"],
  payment: ["pago", "pagar", "método", "forma de pago", "pagos", "nequi", "bancolombia", "daviplata", "transferencia", "visa", "mastercard"],
  cash_on_delivery: ["contra entrega", "pago contra entrega", "pago al recibir", "pagas cuando llega"],
  colors: ["color", "colores", "qué color", "negro", "blanco", "azul", "rojo", "verde", "amarillo"],
  how_to_buy: ["cómo comprar", "como comprar", "procedimiento", "pasos", "proceso", "comprar", "compra"],
  add_to_cart: ["agregar carrito", "carrito", "añadir", "agregar al carrito", "añadir al carrito"],
  checkout: ["finalizar compra", "terminar compra", "pagar", "completar pedido", "hacer pedido"],
  returns: ["devolver", "devolución", "retorno", "cambiar", "cambio", "reembolso", "dinero back"],
  warranty: ["garantía", "garantia", "seguro", "protección", "proteccion", "confianza"],
  contact: ["contacto", "contactar", "whatsapp", "teléfono", "telefono", "email", "llamar", "hablar"],
  gym: ["gym", "gimnasio", "entrenar", "entrenamiento", "ejercicio", "ejercicios", "pesas"],
  running: ["correr", "running", "corredor", "cardio", "trotar"],
  training: ["entrenamiento", "training", "entreno", "workout"],
  stock: ["stock", "hay", "disponible", "existencia", "quedan", "agotado", "agotada"],
  buy_now: ["comprar ahora", "comprar ya", "ya quiero", "lo quiero", "me lo llevo", "ahora mismo"],
  about: ["quiénes son", "quién es", "empresa", "tienda", "más sobre", "sobre ustedes", "sobre la tienda"],
  social_media: ["instagram", "facebook", "redes", "red social", "tiktok", "seguir"],
  shipping_cost: ["costo envío", "costo de envío", "precio envío", "cuánto cuesta enviar", "flete"],
  size_guide: ["guía tallas", "guia tallas", "tabla tallas", "medidas", "cómo saber mi talla"],
  washing: ["lavar", "lavado", "cuidado", "cómo lavar", "secadora", "plancha"],
  origin: ["dóndefabricado", "fabricado", "país", "origen", "hecho en", "importado", "nacional", "colombiano"],
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: responses.greeting, isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [vocab, setVocab] = useState<Record<string, number>>({});
  const [intents, setIntents] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<string>("initial");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar vocabulario
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const vocabResponse = await fetch("/chat/model/vocab.json");
        const vocabData = await vocabResponse.json();
        setVocab(vocabData);

        const intentsResponse = await fetch("/chat/model/intents.json");
        const intentsData = await intentsResponse.json();
        setIntents(intentsData);
      } catch (error) {
        console.log("Metadatos no disponibles, usando solo reglas");
      }
    };

    loadMetadata();
  }, []);

  // Scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Tokenizar texto
  function tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean);
  }

  // Vectorizar texto
  function vectorize(text: string): number[] {
    const tokens = tokenize(text);
    const vector = new Array(MAX_LEN).fill(0);

    tokens.slice(0, MAX_LEN).forEach((word, i) => {
      vector[i] = vocab[word] || 0;
    });

    return vector;
  }

  // Predecir intent usando reglas
  const predictIntent = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // Buscar keywords coincidentes
    for (const [intent, intentKeywords] of Object.entries(keywords)) {
      for (const keyword of intentKeywords) {
        if (lowerText.includes(keyword)) {
          return intent;
        }
      }
    }

    return "default";
  };

  // Manejar envío de mensaje
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const intent = predictIntent(input);
    let response = responses[intent as keyof typeof responses] || responses.default;

    // Respuestas alternativas para variedad
    if (intent === "greeting" && Math.random() > 0.5) {
      response = responses.greeting_alt;
    }

    // Lógica contextual mejorada
    if (intent === "products") {
      if (conversationState === "awaiting_topic") {
        response = "¡Genial! Nuestras camisetas son perfectas para gym. $68.000 COP con descuentos por volumen. ¿Te cuento sobre tallas y colores?";
        setConversationState("products_mentioned");
      } else {
        response = responses.products;
      }
    } else if (intent === "price" || intent === "discount") {
      if (conversationState !== "discount_mentioned") {
        response = responses.price;
        setConversationState("discount_mentioned");
      } else {
        response = "¡Eso es! ¿Cuántas quieres? Así te calculo el descuento exacto. 🎉";
      }
    } else if (intent === "sizes") {
      if (conversationState !== "size_mentioned") {
        response = responses.size_guide;
        setConversationState("size_mentioned");
      } else {
        response = "¿Ya sabes qué talla eres? 🤔 Contéstame y te confirmo disponibilidad.";
      }
    } else if (intent === "colors") {
      response = responses.colors;
      setConversationState("color_mentioned");
    } else if (intent === "payment") {
      response = responses.payment;
      setConversationState("payment_mentioned");
    } else if (intent === "greeting") {
      setConversationState("awaiting_topic");
    } else if (intent === "shipping") {
      setConversationState("shipping_mentioned");
    } else if (intent === "thanks") {
      response = responses.thanks;
    } else if (intent === "buy_now") {
      if (conversationState === "ready_to_buy") {
        response = "¡Perfecto! 🛒 Ya casi tienes tus camisetas. ¿Procedemos con la compra?";
      } else {
        response = responses.buy_now;
        setConversationState("ready_to_buy");
      }
    }

    // Simular delay de escritura
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, Math.max(800, response.length * 15));
  };

  // Abrir WhatsApp
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hola, vi su sitio web y quiero comprar camisetas deportivas de La Torre Imperial. ¿Me puedes ayudar?");
    window.open(`https://wa.me/57300975612?text=${message}`, "_blank");
  };

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg transition-all hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
          <Badge className="absolute -top-1 -right-1 bg-green-600 text-white text-xs px-1.5 py-0.5">
            IA
          </Badge>
        </Button>
      </div>

      {/* Diálogo del chat */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col bg-black border-zinc-800">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 rounded-t-lg -mx-6 -mt-6 mb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <DialogTitle className="text-lg font-bold">La Torre Imperial</DialogTitle>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                🏋️ Online
              </Badge>
            </div>
            <p className="text-xs opacity-90 mt-1">Tu asistente de camisetas deportivas</p>
          </div>

          {/* Banner de WhatsApp */}
          <div
            onClick={handleWhatsApp}
            className="w-full bg-green-500 text-white p-3 text-center cursor-pointer hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <span>💬</span>
            <span className="font-medium text-sm">¡Habla con nosotros por WhatsApp!</span>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 bg-[#0a0a0a]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.isUser
                      ? "bg-orange-500 text-white rounded-br-sm"
                      : "bg-[#1a1a1a] text-white border border-zinc-800 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1a1a1a] border border-zinc-800 p-3 rounded-2xl rounded-bl-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Botón de WhatsApp para estado final */}
          {conversationState === "ready_to_buy" && (
            <div className="p-3 border-t border-zinc-800">
              <Button onClick={handleWhatsApp} className="w-full bg-green-500 hover:bg-green-600 text-white">
                💬 Continuar en WhatsApp
              </Button>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-zinc-800 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-[#1a1a1a] border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500"
            />
            <Button onClick={handleSend} size="icon" className="bg-orange-500 hover:bg-orange-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
