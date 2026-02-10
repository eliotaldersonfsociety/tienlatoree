import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"


export function Hero() {
  return (
    <section className="relative overflow-hidden py-6 px-2">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 items-center">
          <div className="space-y-4 text-center order-2">
            <h1 className="text-[30px] font-bold tracking-tight text-balance">
                <b>CAMISETAS DEPORTIVAS <span className="text-yellow-500">IDEAL PARA GYM</span></b>
            </h1>

            <p className="text-[10px] text-muted-foreground text-pretty px-2">
              Envío rápido desde Cúcuta 🇨🇴. Confiado por clientes en toda Colombia
            </p>
          </div>
          <div className="relative h-[280px] order-1">
            <div className="absolute rounded-2xl bg-gradient-to-r from-blue-500 to-blue-900 opacity-40" />
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <video
                autoPlay
                loop
                muted
                className="w-full h-full object-cover mask-hero"
              >
                <source src="/modelo.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Pricing overlay */}
            <div className="absolute top-2 right-2 backdrop-blur-sm rounded-lg p-2 shadow-lg">
              <div className="text-orange-500 line-through text-xs">Antes <br />$95.000</div>
              <div className="text-white font-bold text-base">Ahora <br />$68.000</div>
            </div>

            {/* Discount badge */}
            <div className="absolute bottom-2 left-2 bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-lg font-bold">28%</div>
                <div className="text-[10px]">Descuento</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}