"use client"

import { Star } from "lucide-react"
import { useState, useEffect } from "react"

const reviews = [
  "¡Increíbles camisetas! Llegaron perfectamente. Son muy cómodas y de excelente calidad.",
  "¡Entrega rápida! Las camisetas superaron mis expectativas, la tela es ligera y fresca.",
  "¡Amo mis nuevas camisetas deportivas! Llegaron en perfectas condiciones y se sienten geniales.",
  "Las camisetas llegaron sin problemas. Muy buena confección y diseño moderno.",
  "¡Muy feliz con mi compra! Las camisetas son ideales para entrenar y usar a diario.",
  "Las camisetas son excelentes: cómodas, transpirables y bien hechas. Recomendadas.",
  "¡Envío rápido! La tela es suave y no da calor durante el entrenamiento.",
  "Recibí mis camisetas en perfecto estado. Comodidad total desde el primer uso.",
  "Las camisetas llegaron rápido. Buen ajuste y excelente calidad. Valen la pena.",
  "Encantado con mis camisetas deportivas. Llegaron seguras y cumplen lo prometido."
]


const users = [
  { name: "María G.", location: "Bogotá", gender: "women" },
  { name: "Carlos R.", location: "Medellín", gender: "men" },
  { name: "Ana L.", location: "Cali", gender: "women" },
  { name: "Juan P.", location: "Cartagena", gender: "men" },
  { name: "Sofia M.", location: "Barranquilla", gender: "women" },
  { name: "Diego S.", location: "Pereira", gender: "men" },
  { name: "Laura T.", location: "Manizales", gender: "women" },
  { name: "Andrés V.", location: "Bucaramanga", gender: "men" },
  { name: "Camila H.", location: "Ibagué", gender: "women" },
  { name: "Felipe W.", location: "Santa Marta", gender: "men" }
]

export function CustomerReviews() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const user = users[index % users.length]
  const avatarId = (index % 50) + 1

  return (
    <div className="flex items-start gap-3 mt-6">
      {/* Avatar */}
      <img
        src={`https://randomuser.me/api/portraits/${user.gender}/${avatarId}.jpg`}
        alt={user.name}
        className="w-10 h-10 rounded-full border-2 border-yellow-500 flex-shrink-0"
      />

      {/* Content */}
      <div className="flex flex-col gap-1">
        {/* Username + location */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {user.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {user.location}
          </span>
          <span className="text-sm">🇨🇴</span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((star) => (
            <Star
              key={star}
              className="h-4 w-4 fill-yellow-500 text-yellow-500"
            />
          ))}
          <Star className="h-4 w-4 fill-yellow-500/50 text-yellow-500" />
          <span className="ml-1 text-xs font-medium text-muted-foreground">
            4.5
          </span>
        </div>

        {/* Review text */}
        <p className="text-sm text-muted-foreground max-w-xs">
          {reviews[index]}
        </p>
      </div>
    </div>
  )
}
