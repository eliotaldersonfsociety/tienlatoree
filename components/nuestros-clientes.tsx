"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const clients = [
  "/cliente1.webp",
  "/cliente2.webp",
  "/cliente3.webp",
  "/cliente4.webp"
]

export function NuestrosClientes() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % clients.length)
    }, 5000) // 5 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <h2 className="text-3xl font-bold text-center mb-8">NUESTROS <span className="text-orange-500">CLIENTES</span></h2>
        <p className="text-center mb-8">Clientes satisfechos con nuestros productos</p>

        {/* Desktop: 3 imágenes lado a lado */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {clients.map((client, index) => (
            <div key={index} className="flex justify-center">
              <Image
                src={client}
                alt={`Cliente ${index + 1}`}
                width={200}
                height={100}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* Mobile: Carrusel automático cada 5 segundos */}
        <div className="md:hidden relative w-full max-w-xs mx-auto">
          <div className="overflow-hidden rounded-lg">
            <Image
              src={clients[currentIndex]}
              alt={`Cliente ${currentIndex + 1}`}
              width={200}
              height={100}
              className="object-contain w-full h-auto"
            />
          </div>
          {/* Indicadores */}
          <div className="flex justify-center gap-2 mt-4">
            {clients.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-orange-500" : "bg-zinc-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}