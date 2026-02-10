import dynamic from "next/dynamic"
import { Hero } from "@/components/hero"
import { OrderProcess } from "@/components/order-process"
import { ProductsWrapper } from "@/components/products-wrapper"
import { defaultProducts } from "@/lib/store"
import { TrustBadges } from "@/components/trust-badges"

/* =======================
   Dynamic components
   ======================= */

const SocialNotificationsWrapper = dynamic(
  () =>
    import("@/components/social-notifications-wrapper").then(m => ({
      default: m.SocialNotificationsWrapper
    })),
  { ssr: false }
)

const ProductShowcase = dynamic(
  () =>
    import("@/components/product-showcase").then(m => ({
      default: m.ProductShowcase
    })),
  { ssr: false }
)

const CustomerReviews = dynamic(
  () =>
    import("@/components/customer-reviews").then(m => ({
      default: m.CustomerReviews
    })),
  { ssr: false }
)

const AlternatingContents = dynamic(
  () => import("@/components/alternativecontent/page"),
  { ssr: false }
)

const ResultsCarouselClient = dynamic(
  () => import("@/components/result-carrousel/results-carousel.client"),
  { ssr: false }
)

const NuestrosClientes = dynamic(
  () =>
    import("@/components/nuestros-clientes").then(m => ({
      default: m.NuestrosClientes
    })),
  { ssr: false }
)

const AITestimonials = dynamic(
  () => import("@/components/ai-testimonials"),
  { ssr: false }
)

const PersonalizedRecommendations = dynamic(
  () =>
    import("@/components/personalized-recommendations").then(m => ({
      default: m.PersonalizedRecommendations
    })),
  { ssr: false }
)

const DeliveryInfo = dynamic(
  () =>
    import("@/components/delivery-info").then(m => ({
      default: m.DeliveryInfo
    })),
  { ssr: false }
)

const FAQs = dynamic(
  () =>
    import("@/components/faqs/faqs").then(m => ({
      default: m.FAQs
    })),
  { ssr: false }
)

const AIChat = dynamic(
  () => import("@/components/ai-chat"),
  { ssr: false }
)

const WhatsAppButton = dynamic(
  () => import("@/components/whatsapp-button"),
  { ssr: false }
)

/* =======================
   Page
   ======================= */

export default function HomePage() {
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-3 sm:px-4 text-center">
      {/* No bloquea render */}
      <SocialNotificationsWrapper />

      {/* LCP */}
      <Hero />

      <div className="py-4 px-2">
        <ProductShowcase />
      </div>

      <OrderProcess />

      <CustomerReviews />

      {/* Pricing */}
      <div className="flex flex-wrap items-center justify-center gap-2 font-sans text-center pt-4 px-2">
        <span className="text-red-600 font-bold text-xs line-through">
          Antes 95.000$
        </span>

        <span className="bg-orange-500 text-white font-extrabold text-xs px-3 py-1 rounded-lg shadow-md">
          ahora 68.000$
        </span>

        <span className="hidden text-green-600 font-semibold text-lg">
          28% descuento
        </span>
      </div>

      {/* Below the fold */}
      <AlternatingContents />
      <ResultsCarouselClient />
      <NuestrosClientes />
      <AITestimonials />

      <ProductsWrapper products={defaultProducts.slice(0, 1)} />

      <PersonalizedRecommendations />

      <div className="grid grid-cols-1 gap-4 p-4">
        <DeliveryInfo />
        <FAQs />
      </div>

      <AIChat />

      <OrderProcess />

      <WhatsAppButton />
    </div>
  )
}
