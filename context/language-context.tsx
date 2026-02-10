"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface LanguageContextType {
  language: "es" | "en"
  setLanguage: (lang: "es" | "en") => void
  t: typeof es
}

const translations = {
  es: {
    nav: {
      services: "Servicios",
      faq: "Preguntas Frecuentes",
      contact: "Contacto",
      toggleLanguage: "Cambiar idioma",
      toggleTheme: "Cambiar tema",
      userMenu: "Menú de usuario",
      dashboard: "Mi Dashboard",
      adminPanel: "Panel de Admin",
      logout: "Cerrar sesión",
      login: "Iniciar Sesión",
      createAccount: "Crear Cuenta",
      benefits: "Beneficios",
      howItWorks: "Cómo Funciona",
      cart: "Carrito",
    },
    header: {
      brand: "La Torre Imperial",
    },
  },
  en: {
    nav: {
      services: "Services",
      faq: "FAQ",
      contact: "Contact",
      toggleLanguage: "Toggle language",
      toggleTheme: "Toggle theme",
      userMenu: "User menu",
      dashboard: "My Dashboard",
      adminPanel: "Admin Panel",
      logout: "Log Out",
      login: "Login",
      createAccount: "Create Account",
      benefits: "Benefits",
      howItWorks: "How It Works",
      cart: "Cart",
    },
    header: {
      brand: "La Torre Imperial",
    },
  },
}

const es = translations.es
const en = translations.en

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<"es" | "en">("es")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("language") as "es" | "en" | null
    if (saved) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: "es" | "en") => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: "es", setLanguage: () => {}, t: es }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: language === "es" ? es : en }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
