import dynamic from 'next/dynamic'
import { Hero } from "@/components/hero"
import { OrderProcess } from "@/components/order-process"
import { ProductsWrapper } from "@/components/products-wrapper"
import { defaultProducts, type Product } from "@/lib/store"
import { ProductShowcase } from "@/components/product-showcase"
import { TrustBadges } from "@/components/trust-badges"
import { CustomerReviews } from "@/components/customer-reviews" 
import VirtualTryOn from '@/components/VirtualTryOn'

const SocialNotificationsWrapper = dynamic(() => import('@/components/social-notifications-wrapper').then(mod => ({ default: mod.SocialNotificationsWrapper })))
const AlternatingContents = dynamic(() => import('@/components/alternativecontent/page'))
const Testimonials = dynamic(() => import('@/components/testimonials').then(mod => ({ default: mod.Testimonials })))
const FAQs = dynamic(() => import('@/components/faqs/faqs').then(mod => ({ default: mod.FAQs })))
const DeliveryInfo = dynamic(() => import('@/components/delivery-info').then(mod => ({ default: mod.DeliveryInfo })))
const NuestrosClientes = dynamic(() => import('@/components/nuestros-clientes').then(mod => ({ default: mod.NuestrosClientes })))
const WhatsAppButton = dynamic(() => import('@/components/whatsapp-button'))

const ResultsCarouselClient = dynamic(() => import('@/components/result-carrousel/results-carousel.client'))
const AITestimonials = dynamic(() => import('@/components/ai-testimonials'))
const AIChat = dynamic(() => import('@/components/ai-chat').then(mod => ({ default: mod.default })))
const PersonalizedRecommendations = dynamic(() => import('@/components/personalized-recommendations').then(mod => ({ default: mod.PersonalizedRecommendations })))
const PredictiveHeatmap = dynamic(() => import('@/components/predictive-heatmap').then(mod => ({ default: mod.PredictiveHeatmap })))
const RealtimeBehaviorPanel = dynamic(() => import('@/components/RealtimeBehaviorPanel').then(mod => ({ default: mod.RealtimeBehaviorPanel })))


export default function HomePage() {

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-3 sm:px-4 text-center">
      <SocialNotificationsWrapper />
      <Hero />
      <div className="py-4 px-2">
        <ProductShowcase />
      </div>
      <OrderProcess />

      <CustomerReviews />
      
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
