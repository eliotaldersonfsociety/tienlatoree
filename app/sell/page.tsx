import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function SellPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Landing Page con IA Personalizada</h1>
          <p className="text-xl mb-8">
            Una landing page completa con inteligencia artificial integrada para maximizar conversiones,
            engagement y ventas. Nos ajustamos a cualquier nicho y optimizamos la IA para vender más.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Comprar Ahora - 99.000 COP
          </Button>
        </div>
      </section>

      {/* Características de IA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Características de IA Incluidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Behavior Tracking</h3>
              <p className="text-gray-600">
                Rastrea automáticamente el comportamiento del usuario: porcentaje de scroll, número de clicks,
                tiempo en página y más. Almacena datos para análisis posteriores.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">AI Testimonials</h3>
              <p className="text-gray-600">
                Genera testimonios dinámicos usando IA para mostrar reseñas personalizadas basadas
                en el comportamiento del usuario.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Personalized Recommendations</h3>
              <p className="text-gray-600">
                Recomienda productos personalizados usando algoritmos de IA basados en el historial
                de navegación y comportamiento del usuario.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Predictive Heatmap</h3>
              <p className="text-gray-600">
                Muestra un mapa de calor predictivo que indica dónde los usuarios hacen click,
                ayudando a optimizar la conversión.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Dynamic Pricing</h3>
              <p className="text-gray-600">
                Ajusta precios dinámicamente basado en cantidad: descuentos por volumen (5% off x2,
                8% off x3, 10% off x4).
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Conversion Score</h3>
              <p className="text-gray-600">
                Calcula un puntaje de conversión en tiempo real basado en métricas de comportamiento,
                mostrando urgencia cuando es bajo.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Urgency Notifications</h3>
              <p className="text-gray-600">
                Muestra notificaciones de urgencia dinámicas cuando el stock es bajo o la demanda alta.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Social Notifications</h3>
              <p className="text-gray-600">
                Simula notificaciones sociales para crear FOMO (fear of missing out) y aumentar conversiones.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">AI Intent Model</h3>
              <p className="text-gray-600">
                Modelo de IA que predice la intención del usuario basado en su comportamiento,
                ajustando el contenido dinámicamente.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Realtime Behavior Panel</h3>
              <p className="text-gray-600">
                Panel en tiempo real que muestra métricas de comportamiento de usuarios activos.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Chat de IA Interactivo</h3>
              <p className="text-gray-600">
                Asistente virtual con reglas contextuales, delay de typing basado en longitud de respuesta,
                y conexión directa a WhatsApp para conversiones.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Checkout con Acordeón de Pagos</h3>
              <p className="text-gray-600">
                Sistema de pagos con acordeón mostrando logos de Nequi, Bancolombia, Daviplata,
                y QR codes al abrir. Incluye subida de comprobantes.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Botón de WhatsApp con Pulso</h3>
              <p className="text-gray-600">
                Botón llamativo al final de la página con animación de pulso para maximizar
                conversiones a WhatsApp.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Sistema de Pagos Completo</h3>
              <p className="text-gray-600">
                Integración con PayPal y métodos alternativos (Nequi, Bancolombia, Daviplata)
                con subida de comprobantes a ImageKit.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Dashboard Administrativo</h3>
              <p className="text-gray-600">
                Panel completo para gestionar pedidos, ver estadísticas y administrar usuarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Demo en Acción</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <Image
                src="/screenshot-chat.png"
                alt="Chat de IA"
                width={400}
                height={300}
                className="rounded-lg shadow-lg mx-auto"
              />
              <p className="mt-4 text-gray-600">Chat de IA interactivo con reglas contextuales</p>
            </div>
            <div className="text-center">
              <Image
                src="/screenshot-checkout.png"
                alt="Checkout con pagos"
                width={400}
                height={300}
                className="rounded-lg shadow-lg mx-auto"
              />
              <p className="mt-4 text-gray-600">Checkout con acordeón de pagos y QR codes</p>
            </div>
            <div className="text-center">
              <Image
                src="/screenshot-whatsapp.png"
                alt="Botón WhatsApp"
                width={400}
                height={300}
                className="rounded-lg shadow-lg mx-auto"
              />
              <p className="mt-4 text-gray-600">Botón de WhatsApp con animación de pulso</p>
            </div>
          </div>
        </div>
      </section>

      {/* Precio */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Precio Especial de Lanzamiento</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <p className="text-6xl font-bold text-green-600 mb-4">99.000 COP</p>
            <p className="text-gray-600 mb-6">Código fuente completo con todas las características de IA, personalizado para tu negocio</p>
            <ul className="text-left mb-6 space-y-2">
              <li>✅ Landing page completa con diseño moderno</li>
              <li>✅ Todas las funciones de IA implementadas</li>
              <li>✅ Chat de IA interactivo con WhatsApp</li>
              <li>✅ Checkout con acordeón de pagos y QR</li>
              <li>✅ Botón de WhatsApp con animación</li>
              <li>✅ Personalización completa para tu nicho</li>
              <li>✅ Optimización de IA para maximizar ventas</li>
              <li>✅ Integración con PayPal y métodos locales</li>
              <li>✅ Dashboard administrativo completo</li>
              <li>✅ Soporte técnico incluido</li>
            </ul>
            <Button size="lg" className="w-full">
              Comprar Ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Landing Page con IA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}