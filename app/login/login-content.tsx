"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import { loginAction } from "@/lib/actions/login"
import { useToast } from "@/hooks/use-toast"
import { Dumbbell } from "lucide-react"
import { NavigationMenu } from "@/components/ui/navigation-menu"

export default function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const [state, formAction, isPending] = useActionState(loginAction, { success: false, error: '' })

  useEffect(() => {
    if (state.error) {
      toast({
        title: 'Error',
        description: state.error
      })
    }
  }, [state.error, toast])

  useEffect(() => {
    const tokenCookie = document.cookie
      .split(";")
      .find(c => c.trim().startsWith("authToken="))
    if (tokenCookie) {
      router.push(redirect)
    }
  }, [router, redirect])



  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0 text-center">

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pt-16">
        
        <div className="w-full max-w-md space-y-8">

          <div className="flex justify-center">
            <img
                src="/logo.png"
                alt="Bull logo"
                className="h-10 w-10"
              />
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold dark:text-white">
                Bienvenido <span className="text-yellow-500">de vuelta</span>
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Ingrese su correo electronico para iniciar sesión
              </p>
            </div>

            <form action={formAction} className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dark:border-white/20 dark:bg-white/5 dark:text-white border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dark:border-white/20 dark:bg-white/5 dark:text-white border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>

              <input type="hidden" name="redirect" value={redirect} />

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-orange-500 hover:text-orange-600"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-500 text-white hover:bg-orange-600"
                disabled={isPending}
              >
                {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>

              {state.error && <p className="text-red-500 text-center">{state.error}</p>}

              <p className="text-center text-sm text-gray-400">
                No tienes una cuenta?{" "}
                <Link
                  href={`/register?redirect=${encodeURIComponent(redirect)}`}
                  className="font-medium text-orange-500 hover:text-orange-600"
                >
                  Registrate
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>


      <NavigationMenu />
    </div>
  )
}
