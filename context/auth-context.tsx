"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getCurrentUser } from "@/lib/actions/login"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser()
      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name || "",
          role: userData.role,
        })
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error loading user:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  // Escuchar cambios en auth (cookies/localStorage)
  useEffect(() => {
    const handleAuthChange = () => {
      loadUser()
    }

    window.addEventListener('storage', handleAuthChange)
    window.addEventListener('auth-change', handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [])

  const logout = async () => {
    try {
      const { logoutAction } = await import("@/lib/actions/logout")
      await logoutAction()
      setUser(null)
      // Disparar evento para actualizar otros componentes
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-change'))
      }
      router.push('/login')
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
