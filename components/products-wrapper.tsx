"use client"

import { Products } from "@/components/products"
import type { Product } from "@/lib/store"
import { useAnalytics } from "@/hooks/use-analytics"
import { useCart } from "@/context/cart-context"

interface ProductsWrapperProps {
  products: Product[]
}

export function ProductsWrapper({ products }: ProductsWrapperProps) {
  const { trackEvent } = useAnalytics()

  // Note: ProductCard handles addToCart internally, but we can still track
  const handleAddToCart = (product: Product) => {
    trackEvent("add_to_cart", { productId: product.id, productName: product.name })
  }

  return <Products products={products} />
}