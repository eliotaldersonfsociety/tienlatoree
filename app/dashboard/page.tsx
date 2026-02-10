"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getUserOrdersAction } from "@/lib/actions/orders"
import { getCurrentUser } from "@/lib/actions/login"
import { useRouter } from "next/navigation"
import { Eye } from "lucide-react"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string | null
}

interface Order {
  id: number
  total: number
  status: string
  createdAt: string | null
  paymentProof?: string | null
  paymentMethod?: string | null
  additionalInfo?: string | null
  items: OrderItem[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      maximumFractionDigits: 0 
    }).format(price)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pendiente</Badge>
      case 'confirmed':
        return <Badge className="bg-blue-500">Confirmado</Badge>
      case 'completed':
        return <Badge className="bg-green-500">Completado</Badge>
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResult, ordersResult] = await Promise.all([
          getCurrentUser(),
          getUserOrdersAction()
        ])

        if (userResult) {
          setCurrentUser(userResult)
        } else {
          router.push('/login')
          return
        }

        if (ordersResult.success && ordersResult.data?.orders) {
          setOrders(ordersResult.data.orders)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Cargando tu panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Mi Dashboard</h1>
          <p className="text-xl text-zinc-400 mt-2">Bienvenido, {currentUser?.name?.split(' ')[0] || currentUser?.email?.split('@')[0]}</p>
        </div>

        {/* Mis Pedidos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Mis Pedidos</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-[#111] border border-zinc-800 rounded-xl">
              <p className="text-zinc-500">Aún no has realizado ninguna compra.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-[#111] border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:border-zinc-700 transition-colors"
                  onClick={() => {
                    setSelectedOrder(order)
                    setModalOpen(true)
                  }}
                >
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold">Orden #{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-zinc-400 text-sm">{formatDate(order.createdAt)}</p>
                  </div>

                  {/* Items */}
                  <div className="flex-1">
                    <p className="text-sm text-zinc-400">Items:</p>
                    <p className="font-medium">
                      {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-green-500 font-bold">{formatPrice(order.total)}</p>
                  </div>

                  {/* View Button */}
                  <Button size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Comprobante
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${modalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all`}
          onClick={() => setModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/80" onClick={() => setModalOpen(false)} />
          
          <div className="relative bg-[#111] border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Orden #{selectedOrder.id}</h3>
                <p className="text-zinc-400 text-sm">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              {getStatusBadge(selectedOrder.status)}
            </div>

            {/* Items */}
            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-zinc-400 text-sm">Items:</h4>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-black/50 rounded-lg p-3">
                  {item.image && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-zinc-400">Cantidad: {item.quantity}</p>
                    <p className="text-green-500 font-bold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
              <span className="font-bold">Total:</span>
              <span className="text-2xl font-bold text-green-500">{formatPrice(selectedOrder.total)}</span>
            </div>

            {/* Payment Proof */}
            {selectedOrder.paymentProof && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Comprobante de Pago:</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Image
                    src={selectedOrder.paymentProof}
                    alt="Comprobante de pago"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            <Button 
              className="w-full mt-6" 
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
