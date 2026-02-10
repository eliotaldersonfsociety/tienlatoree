"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { cartStorage, productsStorage, type Product, type CartItem } from "@/lib/store"

interface CartContextType {
  cart: CartItem[]
  itemCount: number
  total: number
  addToCart: (product: Product, quantity?: number, color?: string, size?: string, brand?: string) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateCartItem: (productId: string, color?: string, size?: string, brand?: string) => void
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const loadedCart = cartStorage.get()
    const updatedCart = loadedCart.map(item => {
      const currentProduct = productsStorage.get().find(p => p.id === item.id)
      if (currentProduct) {
        return { ...item, price: currentProduct.price }
      }
      return item
    })
    setCart(updatedCart)
    if (updatedCart.length !== loadedCart.length || updatedCart.some((item, i) => item.price !== loadedCart[i].price)) {
      cartStorage.set(updatedCart)
    }
  }, [])

  // Escuchar evento de carrito limpiado
  useEffect(() => {
    const handleCartCleared = () => {
      cartStorage.clear()
      setCart([])
    }

    window.addEventListener('cart-cleared', handleCartCleared)
    return () => {
      window.removeEventListener('cart-cleared', handleCartCleared)
    }
  }, [])

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string, brand?: string) => {
    const newCart = cartStorage.add(product, quantity, color, size, brand)
    setCart(newCart)
    setIsOpen(true)
  }

  const removeFromCart = (productId: string) => {
    const newCart = cartStorage.remove(productId)
    setCart(newCart)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const newCart = cartStorage.updateQuantity(productId, quantity)
    setCart(newCart)
  }

  const updateCartItem = (productId: string, color?: string, size?: string, brand?: string) => {
    const newCart = cartStorage.updateCartItem(productId, color, size, brand)
    setCart(newCart)
  }

  const clearCart = () => {
    const newCart = cartStorage.clear()
    setCart(newCart)
  }

  const getDiscountedPrice = (price: number, quantity: number) => {
    if (quantity === 2) return price * 0.95;
    if (quantity === 3) return price * 0.92;
    if (quantity === 4) return price * 0.9;
    return price;
  }

  const total = cart.reduce((sum, item) => sum + getDiscountedPrice(item.price, item.quantity) * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateCartItem,
        clearCart,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
