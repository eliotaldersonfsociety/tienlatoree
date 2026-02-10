"use client"

import { useEffect, useState, useRef } from "react"
import * as tf from "@tensorflow/tfjs"

const getScrollPercent = () => {
  const scrollTop = window.scrollY
  const docHeight = document.body.scrollHeight - window.innerHeight
  return docHeight > 0 ? scrollTop / docHeight : 0
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export default function SmartScarcity() {
  const [model, setModel] = useState<tf.LayersModel | null>(null)
  const [showScarcity, setShowScarcity] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(15 * 60)

  const startTimeRef = useRef(Date.now())
  const clicksRef = useRef(0)
  const lastProbabilityRef = useRef(0)

  // 🖱️ Click tracker
  useEffect(() => {
    const handleClick = () => clicksRef.current++
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  // ⏱️ Countdown
  useEffect(() => {
    if (!showScarcity) return
    const timer = setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [showScarcity])

  // 📦 Load model
  useEffect(() => {
    tf.loadLayersModel("/scarcity/model/model.json")
      .then(m => {
        console.log("✅ Modelo cargado correctamente")
        setModel(m)
      })
      .catch(console.error)
  }, [])

  // 🔔 Solicitar permiso para notificaciones
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  // 🧠 Re-evaluación continua
  useEffect(() => {
    if (!model || showScarcity) return

    const evaluateUser = async () => {
      const timeOnPage = (Date.now() - startTimeRef.current) / 1000 / 60

      const X = tf.tensor2d([[
        getScrollPercent(),
        Math.min(timeOnPage / 10, 1),
        Math.min(clicksRef.current / 30, 1),
        0,
        0,
      ]])

      const prediction = model.predict(X) as tf.Tensor
      const probability = (await prediction.data())[0]

      X.dispose()
      prediction.dispose()

      // 📈 Nunca permitir que baje
      if (probability > lastProbabilityRef.current) {
        lastProbabilityRef.current = probability
      }

      console.log("🔥 Probabilidad compra:", lastProbabilityRef.current)

      if (lastProbabilityRef.current >= 0.1) {
        setShowScarcity(true)

        // 🔔 Mostrar notificación del navegador
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("¡Última oportunidad!", {
            body: "Quedan solo 3 unidades disponibles. ¡No pierdas la oportunidad!",
            icon: "/icon.png",
            tag: "scarcity",
          })
        }
      }
    }

    const interval = setInterval(evaluateUser, 8000)
    return () => clearInterval(interval)
  }, [model, showScarcity])

  if (!showScarcity) return null

  return (
    <div className="fixed top-[60px] sm:top-[64px] left-0 right-0 z-[9998] bg-red-600 text-white py-1 px-2 sm:px-4 shadow-md animate-pulse border-b border-red-700">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-1 sm:gap-3 text-[10px] sm:text-xs md:text-sm overflow-x-auto">
        <p className="font-bold shrink-0">🔥 ¡Última!</p>
        <span className="text-red-200 hidden sm:inline shrink-0">|</span>
        <p className="shrink-0">⏳ 3 unidades</p>
        <span className="text-red-200 hidden md:inline shrink-0">|</span>
        <p className="shrink-0">⏱️ {formatTime(secondsLeft)}</p>
      </div>
    </div>
  )
}
