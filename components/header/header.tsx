"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { HeaderAuthClient } from "./header-auth-client"
import { HeaderCartClient } from "./header-cart-client"
import { getCurrentUser } from "@/lib/actions/login"

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [displayLetter, setDisplayLetter] = useState("U")

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getCurrentUser()
      setUser(userData)
      const letter = userData?.name
        ? userData.name.charAt(0).toUpperCase()
        : userData?.email
        ? userData.email.charAt(0).toUpperCase()
        : "U"
      setDisplayLetter(letter)
    }
    loadUser()
  }, [])

  const isLoggedIn = !!user

  return (
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between p-5">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <img
              src="/logo.png"
              alt="la-torre-imperial"
              className="h-6 w-6"
            />
            <span className="text-[#FFD700]">La Torre Imperial</span>
          </Link>


          <div className="flex items-center gap-2">
            <HeaderAuthClient isLoggedIn={isLoggedIn} displayLetter={displayLetter} />
            <HeaderCartClient />
          </div>
        </div>
      </div>
  )
}
