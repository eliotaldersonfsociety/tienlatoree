"use client"

import { useEffect, useState } from "react"

const PROMO_DURATION_MINUTES = 15

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

// Clave para localStorage
const PROMO_END_TIME_KEY = "tienda_promo_end_time"
const PROMO_CLAIMED_KEY = "tienda_promo_claimed"

export function ScarcityBanner() {
  const [showPromo, setShowPromo] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(PROMO_DURATION_MINUTES * 60)
  const [promoEnded, setPromoEnded] = useState(false)

  useEffect(() => {
    // Verificar estado del claim
    const claimed = localStorage.getItem(PROMO_CLAIMED_KEY) === "true"
    setIsClaimed(claimed)

    // Verificar si ya hay un tiempo establecido
    const checkTimer = () => {
      const endTime = localStorage.getItem(PROMO_END_TIME_KEY)

      if (endTime) {
        const remaining = Math.floor((parseInt(endTime) - Date.now()) / 1000)
        
        if (remaining > 0) {
          setSecondsLeft(remaining)
          setShowPromo(true)
          return
        }
      }
      
      // Si no hay tiempo o ya expiró, reiniciar
      const newEndTime = Date.now() + PROMO_DURATION_MINUTES * 60 * 1000
      localStorage.setItem(PROMO_END_TIME_KEY, newEndTime.toString())
      setSecondsLeft(PROMO_DURATION_MINUTES * 60)
      setShowPromo(true)
    }

    checkTimer()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          // Tiempo terminado - REINICIAR
          const newEndTime = Date.now() + PROMO_DURATION_MINUTES * 60 * 1000
          localStorage.setItem(PROMO_END_TIME_KEY, newEndTime.toString())
          return PROMO_DURATION_MINUTES * 60
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClaimPromo = () => {
    setIsClaimed(true)
    localStorage.setItem(PROMO_CLAIMED_KEY, "true")
    // Disparar evento para que otros componentes se enteren
    window.dispatchEvent(new Event("promo-claimed"))
  }

  // SIEMPRE MOSTRAR
  if (!showPromo && secondsLeft <= 0) return null 

  return (
    <div className="bg-red-600 text-white py-2 w-full animate-pulse">
      <div className="w-full flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm px-2">
        <p className="font-bold shrink-0">🔥 ¡DESCUENTO EXCLUSIVO!</p>
        <span className="text-red-200 hidden sm:inline shrink-0">|</span>
        <p className="shrink-0">⏱️ {formatTime(secondsLeft)}</p>
        <span className="text-red-200 hidden sm:inline shrink-0">|</span>
        <button 
          onClick={handleClaimPromo}
          disabled={isClaimed}
          className={`px-3 py-1 rounded font-bold text-xs sm:text-sm transition-colors ${
            isClaimed 
              ? "bg-green-500 text-white cursor-default" 
              : "bg-yellow-500 text-black hover:bg-yellow-400"
          }`}
        >
          {isClaimed ? "¡Descuento Activado!" : "¡Canjear 10% OFF!"}
        </button>
      </div>
    </div>
  )
}

// Hook para verificar si la promo está activa
export function usePromoActive() {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const checkActive = () => {
      // Verificar localStorage
      if (typeof window !== "undefined") {
        const claimed = localStorage.getItem("tienda_promo_claimed") === "true"
        setIsActive(claimed)
      }
    }

    // Chequeo inicial
    checkActive()

    // Escuchar eventos
    const handleEvent = () => checkActive()
    window.addEventListener("promo-claimed", handleEvent)
    window.addEventListener("storage", handleEvent)

    return () => {
      window.removeEventListener("promo-claimed", handleEvent)
      window.removeEventListener("storage", handleEvent)
    }
  }, [])

  return isActive
}
