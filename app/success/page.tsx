"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Package, Clock, MessageCircle } from "lucide-react"
import { cartStorage } from "@/lib/store"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  // Limpiar el carrito al montar el componente
  useEffect(() => {
    cartStorage.clear()
    // Disparar evento para actualizar otros componentes
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cart-cleared'))
    }
  }, [])

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">¡Pedido Completado!</h1>
          <p className="text-zinc-400">
            Gracias por tu compra. Tu pedido ha sido recibido y está siendo procesado.
          </p>
          {orderId && (
            <p className="mt-2 text-sm text-zinc-500">
              Número de pedido: <span className="font-mono text-white">{orderId}</span>
            </p>
          )}
        </div>

        <Card className="border-zinc-800 bg-[#111] mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Package className="w-5 h-5" />
              Próximos Pasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-green-500">1</span>
                </div>
                <div>
                  <p className="font-medium text-white">Confirmación por Email</p>
                  <p className="text-sm text-zinc-400">
                    Recibirás un email de confirmación con los detalles de tu pedido.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-green-500">2</span>
                </div>
                <div>
                  <p className="font-medium text-white">Contacto del Equipo</p>
                  <p className="text-sm text-zinc-400">
                    Un miembro de nuestro equipo te contactará en las próximas 24 horas para coordinar la entrega.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-green-500">3</span>
                </div>
                <div>
                  <p className="font-medium text-white">Entrega</p>
                  <p className="text-sm text-zinc-400">
                    Una vez coordinado, procederemos con la entrega de tu pedido.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-[#111] mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-white">¿Necesitas ayuda inmediata?</p>
                  <p className="text-sm text-zinc-400">
                    Contáctanos por WhatsApp para agilizar el proceso.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="shrink-0 border-green-500 text-green-500 hover:bg-green-500 hover:text-black" asChild>
                <a 
                  href={`https://wa.me/573161744421?text=Hola,%20acabó%20de%20realizar%20un pedido (ID: ${orderId || 'N/A'})%20y%20quiero%20confirmar%20los%20próximos%20pasos.`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contactar por WhatsApp
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-green-500 text-white hover:bg-green-600">
            <Link href="/dashboard" className="gap-2">
              Ir a Mi Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="border-zinc-700 text-white hover:bg-zinc-800">
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
