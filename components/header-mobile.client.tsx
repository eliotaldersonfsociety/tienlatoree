"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart, Sun, Moon, User as UserIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useLanguage } from "@/context/language-context"

export function HeaderMobile() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { resolvedTheme, setTheme } = useTheme()
  const { user, logout, isLoading } = useAuth()
  const { itemCount } = useCart()
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) return <div className="flex items-center gap-2" />

  const toggleTheme = () => {
    if (!mounted) return
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex items-center gap-2">
      {/* THEME TOGGLE */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        disabled={!mounted}
      >
        {!mounted ? (
          <Moon className="w-5 h-5 opacity-50" />
        ) : resolvedTheme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </Button>

      {/* CART */}
      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href="/checkout">
          <ShoppingCart className="w-5 h-5" />
          {mounted && itemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </Button>

      {/* USER QUICK ACCESS */}
      {user ? (
        <Button variant="ghost" size="icon" asChild className="rounded-full h-8 w-8 p-0">
          <Link href="/dashboard">
            <div className="w-full h-full bg-green-500 text-white flex items-center justify-center text-xs font-bold uppercase rounded-full">
              {user.name?.charAt(0) || user.email?.charAt(0)}
            </div>
          </Link>
        </Button>
      ) : (
        <Button variant="ghost" size="icon" asChild className="rounded-full h-8 w-8 p-0">
          <Link href="/login">
            <UserIcon className="w-5 h-5" />
          </Link>
        </Button>
      )}

      {/* MENU BUTTON */}
      <button
        className="p-2 text-white"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* MOBILE MENU */}
      {open && (
        <div className="absolute top-16 right-4 w-64 bg-[#111] border border-zinc-800 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
          <nav className="flex flex-col p-2">
            {/* NAV LINKS */}
            {[
              [t.nav.benefits, "/#beneficios"],
              [t.nav.howItWorks, "/#como-funciona"],
              [t.nav.services, "/#servicios"],
              [t.nav.faq, "/#faq"],
              [t.nav.contact, "/contacto"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}

            <div className="mt-2 pt-2 border-t border-zinc-800 flex flex-col gap-1 p-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold uppercase border border-green-500/20">
                      {user.name?.charAt(0) || user.email?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-zinc-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" asChild>
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      {t.nav.dashboard}
                    </Link>
                  </Button>

                  {user.role === "admin" && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
                        {t.nav.adminPanel}
                      </Link>
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                  >
                    {t.nav.logout}
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      {t.nav.login}
                    </Link>
                  </Button>

                  <Button size="sm" asChild className="bg-green-500 hover:bg-green-600">
                    <Link href="/register" onClick={() => setOpen(false)}>
                      {t.nav.createAccount}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
