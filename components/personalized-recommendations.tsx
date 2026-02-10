"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/store"
import Image from "next/image"
import { usePromoActive } from "@/components/header/scarcity-banner"

// Tallas disponibles
const sizes = ["M", "L", "XL", "XXL", "3XL"]

// Colores para shorts
const shortColors = [
  { name: "Azul oscuro", value: "bg-blue-900", index: 1 },
  { name: "Negro", value: "bg-gray-900", index: 2 },
  { name: "Azul claro", value: "bg-blue-300", index: 3 },
  { name: "Verde oscuro", value: "bg-green-900", index: 4 },
  { name: "Marron", value: "bg-amber-900", index: 5 },
]

// Colores para camiseta
const shirtColors = [
  { name: "Black", value: "bg-gray-900", index: 1 },
  { name: "Blue Light", value: "bg-blue-300", index: 4 },
  { name: "Blue", value: "bg-blue-600", index: 5 },
  { name: "Green", value: "bg-green-500", index: 6 },
  { name: "Gray", value: "bg-gray-400", index: 7 },
]

interface ShortProductProps {
  id: string
  name: string
  basePrice: number
  imageBase: string
  image?: string
  colors: typeof shortColors
  onAddToCart: (product: Product, quantity: number, color: string, size: string, brand: string) => void
  brands: { name: string }[]
}

function ShortProduct({ id, name, basePrice, imageBase, image, colors, onAddToCart, brands }: ShortProductProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [selectedSize, setSelectedSize] = useState(sizes[0])
  const [selectedBrand, setSelectedBrand] = useState(brands[0])
  const [quantity, setQuantity] = useState(1)

  const getProductImage = () => {
    return image || `/${imageBase}-n${selectedColor.index}-${selectedBrand.name.toLowerCase()}.webp`
  }

  const handleAddToCart = () => {
    const product: Product = {
      id,
      name: `${name} ${selectedBrand.name} ${selectedColor.name} ${selectedSize}`,
      description: `${name} de alta calidad`,
      price: basePrice,
      image: getProductImage(),
      category: "Recomendados",
    }
    onAddToCart(product, quantity, selectedColor.name, selectedSize, selectedBrand.name)
  }

  return (
    <div className="border rounded-lg p-3">
      {/* Imagen */}
      <div className="relative w-full aspect-square rounded overflow-hidden bg-muted mb-2">
        <Image
          src={getProductImage()}
          alt={name}
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </div>
      
      <h3 className="font-semibold text-xs line-clamp-2 mb-1">{name}</h3>
      <p className="text-xs text-muted-foreground mb-2">${basePrice.toLocaleString()}</p>

      {/* Selector de marca */}
      <div className="mb-2">
        <label className="text-[10px] text-muted-foreground block">Marca</label>
        <div className="flex gap-1">
          {brands.map((brand) => (
            <button
              key={brand.name}
              onClick={() => setSelectedBrand(brand)}
              className={`px-2 py-0.5 text-[10px] rounded border transition-all ${
                selectedBrand.name === brand.name
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-300"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de color */}
      <div className="mb-2">
        <label className="text-[10px] text-muted-foreground block">Color</label>
        <div className="flex flex-wrap gap-1">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className={`w-5 h-5 rounded-full ${color.value} border-2 ${
                selectedColor.name === color.name ? "border-yellow-500 scale-110" : "border-gray-300"
              }`}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Selector de talla */}
      <div className="mb-2">
        <label className="text-[10px] text-muted-foreground block">Talla</label>
        <div className="flex flex-wrap gap-1">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-2 py-0.5 text-[10px] rounded border transition-all ${
                selectedSize === size
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Cantidad */}
      <div className="mb-2">
        <label className="text-[10px] text-muted-foreground block">Cantidad</label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-6 h-6 rounded border flex items-center justify-center text-xs"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-10 text-center text-xs border rounded py-0.5"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-6 h-6 rounded border flex items-center justify-center text-xs"
          >
            +
          </button>
        </div>
      </div>

      {/* Total */}
      <p className="text-xs font-semibold mb-2">Total: ${(basePrice * quantity).toLocaleString()}</p>

      <Button
        onClick={handleAddToCart}
        className="w-full bg-orange-500 text-white text-xs py-1 hover:bg-orange-600"
        size="sm"
      >
        Agregar
      </Button>
    </div>
  )
}

interface SimpleProductProps {
  id: string
  name: string
  basePrice: number
  image: string
  colors: typeof shirtColors
  brands: { name: string }[]
  onAddToCart: (product: Product, quantity: number, color: string, size: string, brand: string) => void
}

function SimpleProduct({ id, name, basePrice, image, colors, brands, onAddToCart }: SimpleProductProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [selectedSize, setSelectedSize] = useState(sizes[0])
  const [selectedBrand, setSelectedBrand] = useState(brands[0])
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    const product: Product = {
      id,
      name: `${name} ${selectedBrand.name} ${selectedColor.name} ${selectedSize}`,
      description: `${name} de alta calidad`,
      price: basePrice,
      image: image,
      category: "Recomendados",
    }
    onAddToCart(product, quantity, selectedColor.name, selectedSize, selectedBrand.name)
  }

  return (
    <div className="border rounded-lg p-3">
      {/* Imagen */}
      <div className="relative w-full aspect-square rounded overflow-hidden bg-muted mb-2">
        <Image
          src={image}
          alt={name}
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </div>
      
      <h3 className="font-semibold text-xs line-clamp-2 mb-1">{name}</h3>
      <p className="text-xs text-muted-foreground mb-2">${basePrice.toLocaleString()}</p>

      {/* Selector de marca */}
      <div className="mb-2">
        <label className="text-[10px] text-muted-foreground block">Marca</label>
        <div className="flex gap-1">
          {brands.map((brand) => (
            <button
              key={brand.name}
              onClick={() => setSelectedBrand(brand)}
              className={`px-2 py-0.5 text-[10px] rounded border transition-all ${
                selectedBrand.name === brand.name
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-300"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de color */}
      <div className="mb-2">
        <label className="text-[10px] text-muted-foreground block">Color</label>
        <div className="flex flex-wrap gap-1">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className={`w-5 h-5 rounded-full ${color.value} border-2 ${
                selectedColor.name === color.name ? "border-yellow-500 scale-110" : "border-gray-300"
              }`}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Selector de talla */}
      <div className="mb-2">
        <label className="text-[10px] text-muted-foreground block">Talla</label>
        <div className="flex flex-wrap gap-1">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-2 py-0.5 text-[10px] rounded border transition-all ${
                selectedSize === size
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Cantidad */}
      <div className="mb-2">
        <label className="text-[10px] text-muted-foreground block">Cantidad</label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-6 h-6 rounded border flex items-center justify-center text-xs"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-10 text-center text-xs border rounded py-0.5"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-6 h-6 rounded border flex items-center justify-center text-xs"
          >
            +
          </button>
        </div>
      </div>

      {/* Total */}
      <p className="text-xs font-semibold mb-2">Total: ${(basePrice * quantity).toLocaleString()}</p>

      <Button
        onClick={handleAddToCart}
        className="w-full bg-orange-500 text-white text-xs py-1 hover:bg-orange-600"
        size="sm"
      >
        Agregar
      </Button>
    </div>
  )
}

// Marcas disponibles
const brands = [
  { name: "Adidas" },
  { name: "Nike" },
  { name: "Under" },
]

export function PersonalizedRecommendations() {
  const { addToCart } = useCart()
  const promoActive = usePromoActive()

  if (!promoActive) return null

  const handleShortAddToCart = (product: Product, quantity: number, color: string, size: string, brand: string) => {
    addToCart(product, quantity, color, size, brand)
  }

  const handleShirtAddToCart = (product: Product, quantity: number, color: string, size: string, brand: string) => {
    addToCart(product, quantity, color, size, brand)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Completa tu compra</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <ShortProduct
            id="short-favorita"
            name="Short de tu marca favorita"
            basePrice={85000}
            imageBase="short"
            image="/producto2.webp"
            colors={shortColors}
            brands={brands}
            onAddToCart={handleShortAddToCart}
          />
          <SimpleProduct
            id="camiseta-manga"
            name="Camiseta manga deportiva"
            basePrice={68000}
            image="/producto3.webp"
            colors={shirtColors}
            brands={brands}
            onAddToCart={handleShirtAddToCart}
          />
        </div>
      </CardContent>
    </Card>
  )
}
