// app/layout.tsx
import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"
import { LanguageProvider } from "@/context/language-context"
import { Toaster } from "@/components/ui/toaster"
import { UrgencyNotification } from "@/components/UrgencyNotification"
import { LoadBehaviorAI } from "@/components/LoadBehaviorAI"

import { Header } from "@/components/header/header"
import { ScarcityBanner } from "@/components/header/scarcity-banner"
import { Footer } from "@/components/footer"

import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "La Torre Imperial | Ropa de calidad para hombres y mujeres",
  description:
    "Enfocados en productos deportivos para ir a gimnasio, ropa de calidad para hombres y mujeres",
  generator: "Bucaramarketing",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
    ],
    apple: "/apple-icon.png",
  },
  other: {
    "preconnect": "https://randomuser.me",
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geist.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <AuthProvider>
              <LanguageProvider>
                {/* 🔥 WRAPPER MÓVIL FORZADO CON SCROLL INTERNO */}
                <div className="max-w-md mx-auto h-[100dvh] overflow-y-auto bg-background shadow-2xl border-x relative">
                  {/* 🔥 BANNER DE ESCASEZ - ANCHO COMPLETO */}
                  <ScarcityBanner />

                  {/* 🔥 HEADER GLOBAL */}
                  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <Header />
                  </header>

                  {/* 📄 CONTENIDO DE CADA PÁGINA */}
                  <main className="min-h-[calc(100vh-160px)]">
                    {children}
                  </main>

                  {/* 🔻 FOOTER */}
                  <Footer />

                  {/* UI GLOBAL */}
                  <Toaster />
                  <UrgencyNotification />
                </div>
              </LanguageProvider>
            </AuthProvider>
          </CartProvider>
        </ThemeProvider>

        {/* 🤖 IA + TRACKING */}
        <LoadBehaviorAI />

        {/* 📊 ANALYTICS */}
        <Analytics />
      </body>
    </html>
  )
}
