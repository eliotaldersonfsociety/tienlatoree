import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/store"

interface ProductsProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
}

export function Products({ products }: ProductsProps) {
  return (
    <section id="products" className="py-4 px-2">
      <div className="container">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-balance px-2">
            ENTRENA CÓMODO, <span className="text-yellow-500 font-black">LUCE FUERTE</span>
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground text-pretty mt-3 px-2">
            ¿Cansado de camisetas que incomodan? Descubre nuestras camisetas deportivas.
            
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 px-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}