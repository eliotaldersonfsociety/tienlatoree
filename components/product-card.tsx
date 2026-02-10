// components/product-card.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, Truck, Lock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Product } from "@/lib/store";
import { DynamicPricing } from "@/components/dynamic-pricing";
import { useCart } from "@/context/cart-context";
import { usePromoActive } from "@/components/header/scarcity-banner";

// Colores disponibles (n1 a n7)
const colors = [
  { name: "Negro", value: "bg-gray-900", index: 1 },
  { name: "Blanco", value: "bg-gray-100", index: 2 },
  { name: "Rosado", value: "bg-pink-300", index: 3 },
  { name: "Azul claro", value: "bg-blue-300", index: 4 },
  { name: "Azul", value: "bg-blue-600", index: 5 },
  { name: "Verde", value: "bg-green-500", index: 6 },
  { name: "Gris", value: "bg-gray-400", index: 7 },
]

// Tallas disponibles
const sizes = ["L", "XL", "XXL", "XXXL"]

// Marcas disponibles
const brands = [
  { name: "Adidas", logo: "/adidas.svg" },
  { name: "Nike", logo: "/nike.svg" },
  { name: "Under", logo: "/under-armour.svg" },
]

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedBrand, setSelectedBrand] = useState(brands[0]);
  const { addToCart } = useCart();
  const promoActive = usePromoActive();

  // Generar la ruta de la imagen basada en el color y marca
  const getProductImage = () => {
    const brandLower = selectedBrand.name.toLowerCase().replace(/\s+/g, '-');
    return `/camiseta-n${selectedColor.index}-${brandLower}.webp`;
  };

  /* ===============================
     OBSERVER: PRODUCT IN VIEW
  =============================== */
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref}>
      <Card
        className={`group overflow-hidden transition-all duration-300 ${
          inView ? "ring-[0.5px] ring-green-400 shadow-lg" : ""
        }`}
      >
        <CardContent className="p-0">
          <div className="relative h-[500px] overflow-hidden bg-muted">
            <Image
              src={getProductImage()}
              alt={`${product.name} - ${selectedColor.name} - ${selectedBrand.name}`}
              width={768}
              height={1360}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <Badge className="absolute top-2 right-2 text-xs bg-amber-400">
              {product.category}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-2 p-3">
          <div className="flex-1 w-full text-center">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2 px-1">
              {product.description}
            </p>

            {/* Selector de marca */}
            <div className="mb-3 bg-white rounded-lg p-2 shadow-sm">
              <label className="text-xs text-muted-foreground mb-1 block">Marca</label>
              <div className="flex flex-wrap justify-center gap-1">
                {brands.map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-2 py-1 text-xs rounded border-2 transition-all ${
                      selectedBrand.name === brand.name
                        ? "border-yellow-500 bg-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={16}
                      height={16}
                      className="inline-block w-4 h-4 mr-1"
                    />
                    <span className="text-black dark:text-white">
                      {brand.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de colores */}
            <div className="mb-3">
              <label className="text-xs text-muted-foreground mb-1 block">Color</label>
              <div className="flex flex-wrap justify-center gap-1">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full ${color.value} border-2 transition-all ${
                      selectedColor.name === color.name
                        ? "border-yellow-500 scale-110"
                        : "border-gray-300 hover:scale-105"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Selector de talla */}
            <div className="mb-3">
              <label className="text-xs text-muted-foreground mb-1 block">Talla</label>
              <div className="flex flex-wrap justify-center gap-1">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-2 py-1 text-xs rounded border-2 transition-all ${
                      selectedSize === size
                        ? "border-yellow-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2 text-green-600 font-semibold">
              <DynamicPricing basePrice={product.price} productId={product.id} />
            </div>

            {/* Payment Logos Ribbon */}
            <div className="mt-2 flex justify-center gap-2 p-1 bg-gray-100 rounded-lg">
              <Image src="/nequi.svg" alt="Nequi" width={32} height={32} className="w-8 h-8" />
              <Image src="/bancolombia.svg" alt="Bancolombia" width={32} height={32} className="w-8 h-8" />
              <Image src="/daviplata.svg" alt="Daviplata" width={32} height={32} className="w-8 h-8" />
            </div>

            <div className={`mt-2 grid grid-cols-1 gap-1 ${promoActive ? '' : 'opacity-50'}`}>
              <Button
                onClick={() => addToCart({ ...product, image: getProductImage() }, 2, selectedColor.name, selectedSize, selectedBrand.name)}
                className={`group relative transition-all hover:scale-105 hover:bg-green-500 hover:text-white text-xs ${promoActive ? (inView ? "bg-yellow-500 hover:bg-orange-500 text-black" : "bg-primary hover:bg-primary/90") : "bg-gray-400 cursor-not-allowed"}`}
                size="sm"
                disabled={!promoActive}
              >
                {promoActive ? (
                  <>
                    <span className="opacity-100 transition-opacity group-hover:opacity-0">x2 - 5% off - ${(product.price * 2 * 0.95).toLocaleString()}</span>
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 font-bold">Agregar x2</span>
                  </>
                ) : (
                  "x2 - $ " + (product.price * 2).toLocaleString()
                )}
              </Button>
              <Button
                onClick={() => addToCart({ ...product, image: getProductImage() }, 3, selectedColor.name, selectedSize, selectedBrand.name)}
                className={`group w-full relative transition-all hover:scale-105 hover:bg-green-500 hover:text-white text-xs ${promoActive ? (inView ? "bg-yellow-500 hover:bg-orange-500 text-black" : "bg-primary hover:bg-primary/90") : "bg-gray-400 cursor-not-allowed"}`}
                size="sm"
                disabled={!promoActive}
              >
                {promoActive ? (
                  <>
                    <span className="opacity-100 transition-opacity group-hover:opacity-0">x3 - 8% off - ${(product.price * 3 * 0.92).toLocaleString()}</span>
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 font-bold">Agregar x3</span>
                  </>
                ) : (
                  "x3 - $ " + (product.price * 3).toLocaleString()
                )}
              </Button>
              <Button
                onClick={() => addToCart({ ...product, image: getProductImage() }, 4, selectedColor.name, selectedSize, selectedBrand.name)}
                className={`group w-full relative transition-all hover:scale-105 animate-pulse hover:bg-green-500 hover:text-white text-xs ${promoActive ? (inView ? "bg-yellow-500 hover:bg-orange-500 text-black" : "bg-primary hover:bg-primary/90") : "bg-gray-400 cursor-not-allowed"}`}
                size="sm"
                disabled={!promoActive}
              >
                {promoActive ? (
                  <>
                    <span className="opacity-100 transition-opacity group-hover:opacity-0">x4 - 10% off - ${(product.price * 4 * 0.9).toLocaleString()}</span>
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 font-bold">Agregar x4</span>
                  </>
                ) : (
                  "x4 - $ " + (product.price * 4).toLocaleString()
                )}
              </Button>
              {!promoActive && (
                <p className="text-[10px] text-center text-red-500 mt-1">
                  ¡Oferta expirada!
                </p>
              )}
            </div>

            {/* Security and Trust Elements */}
            {inView && (
              <>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                  <Shield className="h-3 w-3 text-green-500" />
                  <span>Pago seguro</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                  <Truck className="h-3 w-3 text-green-500" />
                  <span>Envío 1-3 días</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                  <Lock className="h-3 w-3 text-green-500" />
                  <span>Garantía 30 días</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground text-center">
                  ✓ Sin cargos ocultos · ✓ Soporte 24/7
                </div>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
