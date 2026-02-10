"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/store"
import Image from "next/image"

const features = [
  "Tela ligera y transpirable",
  "Secado rápido para entrenamientos intensos",
  "Ajuste cómodo que resalta tu físico",
  "Ideal para gym, running o uso diario",
]

const colors = [
  { name: "Black", value: "bg-gray-900" },
  { name: "Pink", value: "bg-pink-400" },
  { name: "White", value: "bg-gray-100" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Blue Light", value: "bg-blue-400" },
  { name: "Gray", value: "bg-gray-500" }
]

const colorMap: Record<string, number> = {
  "Black": 1,
  "Pink": 3,
  "White": 2,
  "Blue": 5,
  "Green": 6,
  "Blue Light": 4,
  "Gray": 7,
}

const sizes = ["L", "XL", "XXL", "XXXL"]

const brands = [
  { name: "Adidas", logo: "/adidas.svg" },
  { name: "Nike", logo: "/nike.svg" },
  { name: "Under", logo: "/under-armour.svg" },
]

interface Brand {
  name: string
  logo: string
}

export function ProductShowcase() {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("Black")
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedBrand, setSelectedBrand] = useState<Brand>(brands[1])

  const increaseQuantity = () => setQuantity((q) => q + 1)
  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1))

  const getProductImage = () => {
    const colorIndex = colorMap[selectedColor as keyof typeof colorMap] || 1
    const brandLower = selectedBrand.name.toLowerCase().replace(/\s+/g, '-')
    return `/camiseta-n${colorIndex}-${brandLower}.webp`
  }

  const handleAddToCart = () => {
    const product: Product = {
      id: "showcase-1",
      name: `Camiseta ${selectedBrand.name} ${selectedColor}`,
      description: "Camiseta deportiva de alta calidad",
      price: 68000,
      image: getProductImage(),
      category: "Deportivos",
    }
    addToCart(product, quantity, selectedColor, selectedSize, selectedBrand.name)
  }

  return (
    <div id="product-showcase" className="w-full max-w-sm mx-auto">
      {/* Header con precio */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 sm:p-4 text-white">
        <div className="flex items-baseline gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl font-bold">$68.000 COP</span>
          <span className="text-base sm:text-lg line-through opacity-70">95.000 COP</span>
          <span className="bg-yellow-400 text-red-600 text-xs px-2 py-0.5 rounded font-bold">
            Oferta
          </span>
        </div>
      </div>

      {/* Imagen del producto */}
      <div className="relative w-full h-[600px] overflow-hidden rounded-lg bg-muted">
        <Image
          src={getProductImage()}
          alt={`Camiseta ${selectedColor} - ${selectedBrand.name}`}
          width={768}
          height={1360}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-white dark:bg-[#070707] p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Checkmarks de características */}
        <div className="space-y-2 sm:space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full shrink-0">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{feature}</span>
            </div>
          ))}
        </div>

        {/* Selector de color */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Color
          </label>
          <div className="flex gap-2 sm:gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all",
                  color.value,
                  selectedColor === color.name
                    ? "border-blue-500 ring-2 ring-blue-200 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                )}
                title={color.name}
              />
            ))}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedColor}</p>
        </div>

        {/* Selector de marca */}
        <div>
          <div className="flex gap-2">
            {brands.map((brand) => (
              <button
                key={brand.name}
                onClick={() => setSelectedBrand(brand)}
                className={cn(
                  "px-4 py-2 rounded-lg border-2 font-semibold transition-all text-sm",
                  selectedBrand.name === brand.name
                    ? "border-gray-500 bg-gray-600 text-white"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                )}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de talla */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Talla
          </label>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "w-14 h-10 rounded-lg border-2 font-semibold transition-all text-xs sm:text-sm",
                  selectedSize === size
                    ? "border-gray-500 bg-gray-600 text-white"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Control de cantidad */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Cantidad ({quantity} en el carrito)
          </label>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="h-9 w-9 sm:h-10 sm:w-10 border-gray-300 dark:border-gray-600"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 sm:w-20 text-center h-9 sm:h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              min={1}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={increaseQuantity}
              className="h-9 w-9 sm:h-10 sm:w-10 border-gray-300 dark:border-gray-600"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Botón agregar al carrito */}
        <div className="relative w-full">
          <div className="flex w-full h-11 sm:h-12 rounded-full overflow-hidden">
            {/* Sección del texto (fondo verde) */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-full bg-green-600 text-white flex items-center justify-center font-semibold text-base sm:text-lg"
            >
              Agregar al carrito
            </button>

            {/* Sección de los logos (fondo blanco) */}
            <div className="flex h-full bg-white">
              <Image
                src="/nequi.svg"
                alt="Nequi"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
              <Image
                src="/bancolombia.svg"
                alt="Bancolombia"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
              <Image
                src="/daviplata.svg"
                alt="Daviplata"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
