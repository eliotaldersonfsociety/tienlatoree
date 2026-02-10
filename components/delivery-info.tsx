import Image from "next/image"

export function DeliveryInfo() {
  return (
    <section id="delivery-info" className="py-4">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance mb-8">
          ENVÍO RÁPIDO EN TODA <span className="text-[#FF8A00] font-black">COLOMBIA - CÚCUTA</span>
        </h2>
        <div className="relative w-full max-w-lg mx-auto h-64 rounded-lg overflow-hidden shadow-lg">
          {/* I'll use an example image, you can change it for a more suitable one */}
          <Image
            src="/servientrega.png" // Replace with a delivery image or Colombia map if you have
            alt="Envío rápido en Colombia"
            fill
            className="object-contain"
          />
        </div>
        <p className="mt-4 text-lg text-muted-foreground">
          Recibe tus productos en la puerta de tu casa.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Paga con Bancolombia, Nequi, Daviplata o pagos contra entrega.
        </p>
      </div>
    </section>
  )
}
