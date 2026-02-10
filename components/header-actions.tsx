"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useLanguage } from "@/context/language-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function HeaderActions() {
  const { resolvedTheme, setTheme } = useTheme()
  const { user, logout, isLoading } = useAuth()
  const { itemCount } = useCart()
  const { language, setLanguage, t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) return <div className="hidden md:flex items-center gap-2 w-32" />

  return (
    <div className="hidden md:flex items-center gap-2">
      {/* LANGUAGE TOGGLE */}
      <Button
        variant="ghost"
        size="sm"
        className="font-bold w-10 h-10 rounded-full"
        onClick={() => setLanguage(language === "es" ? "en" : "es")}
      >
        {language === "es" ? "EN" : "ES"}
      </Button>

      {/* THEME */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
      >
        {resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>

      {/* CART */}
      <Button variant="ghost" size="icon" asChild className="relative">
        <Link href="/checkout">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 text-xs flex items-center justify-center font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </Button>

      {/* USER */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative p-0 overflow-hidden rounded-full h-9 w-9 border border-green-500/20">
              <div className="w-full h-full bg-green-500 text-white flex items-center justify-center text-sm font-bold uppercase shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                {user.name?.charAt(0) || user.email?.charAt(0)}
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 bg-[#111] border-zinc-800">
            <div className="px-2 py-1.5 border-b border-zinc-800 mb-1">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-zinc-400 truncate">{user.email}</p>
            </div>

            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex gap-2">
                <LayoutDashboard className="w-4 h-4" /> {t.nav.dashboard}
              </Link>
            </DropdownMenuItem>

            {user.role === "admin" && (
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard" className="flex gap-2 text-green-500">
                  <LayoutDashboard className="w-4 h-4" /> {t.nav.adminPanel}
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="text-red-500 flex gap-2 focus:bg-red-500/10 focus:text-red-500"
            >
              <LogOut className="w-4 h-4" /> {t.nav.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/login">
            <UserIcon className="w-5 h-5" />
          </Link>
        </Button>
      )}
    </div>
  )
}
