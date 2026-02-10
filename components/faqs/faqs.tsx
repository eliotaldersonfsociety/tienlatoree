import Image from "next/image"
import { FAQAccordionClient } from "./faq-accordion-client"

const faqs = [
  {
    question: "📦 ¿Cómo puedo comprar mis camisetas deportivas?",
    answer:
      "¡Es muy fácil! Navega por nuestra colección, selecciona las camisetas que te gusten, agrega al carrito y completa tu pedido. Te contactaremos directamente para coordinar la entrega en Cúcuta.",
  },
  {
    question: "🚚 ¿Hacen envíos a Cúcuta?",
    answer:
      "¡Sí! Somos de Cúcuta y entregamos en toda la ciudad. El envío es gratuito en pedidos mayores a $50.000 COP. También puedes retirar en punto de encuentro si prefieres.",
  },
  {
    question: "⏰ ¿Cuánto tarda la entrega en Cúcuta?",
    answer:
      "En Cúcuta entregamos en 24 a 48 horas hábiles. Para zonas metropolitanas puedes recibir el mismo día si compras antes del mediodía.",
  },
  {
    question: "👕 ¿Qué tallas tienen disponibles?",
    answer:
      "Contamos con tallas desde XS hasta XXL para dama y caballero. Todas nuestras camisetas tienen tela transpirable de alta calidad, perfecta para deportivo o uso diario.",
  },
  {
    question: "💳 ¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos transferencias bancarias, Nequi, Daviplata y pago en efectivo contraentrega en Cúcuta. También puedes pagar con tarjeta de crédito/débito mediante nuestro checkout seguro.",
  },
  {
    question: "🔄 ¿Puedo cambiar mi camiseta si no me queda?",
    answer:
      "¡Claro! Si la talla no te queda bien, podemos cambiarla sin costo adicional. Solo contáctanos y coordinamos el cambio.",
  },
]

export function FAQs() {
  return (
    <section id="faqs" className="py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-8">
          {/* ICON */}
          <Image
            src="/interrogacion.webp"
            alt="Frequently Asked Questions"
            width={60}
            height={80}
            sizes="60px"
            className="mr-4"
          />

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-left">
            PREGUNTAS <br />
            <span className="text-[#FF8A00] font-black">
              FRECUENTES
            </span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <FAQAccordionClient faqs={faqs} />
        </div>
      </div>
    </section>
  )
}
