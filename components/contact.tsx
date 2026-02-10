"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MessageCircle, Clock } from "lucide-react"
import { sendContactEmail } from "@/lib/actions/contact"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('subject', formData.subject)
    formDataToSend.append('message', formData.message)

    const result = await sendContactEmail(formDataToSend)

    if (result.success) {
      setMessage("Message sent successfully!")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } else {
      setMessage(result.error || "Failed to send message")
    }

    setLoading(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <>
      {/* CONTACT SECTION */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white text-center">
              CONTACTANOS <span className="text-yellow-500">AHORA</span>
            </h1>
            <p className="mt-3 text-muted-foreground text-center">
              Ponte en contacto con nuestro equipo de soporte. ¡Estamos aquí para ayudarte!
            </p>
          </div>

          {/* Content */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left info */}
            <div className="space-y-6">
              <InfoCard
                icon={<Mail />}
                title="Soporte por correo electrónico"
                description="Obtén ayuda con tus pedidos y problemas técnicos"
              >
                <p className="font-medium text-white">
                  support@latorreimperial.com
                </p>
                <p className="text-xs text-muted-foreground">
                  Tiempo de respuesta: 24–48 horas
                </p>
              </InfoCard>

              <InfoCard
                icon={<MessageCircle />}
                title="Chat en vivo"
                description="Soporte instantáneo para problemas urgentes"
              >
                <p className="text-white">
                  Disponible 24/7 en nuestro servidor de Discord
                </p>
                <p className="text-xs text-muted-foreground">
                  Únete a nuestra comunidad para obtener ayuda en tiempo real
                </p>
              </InfoCard>

              <InfoCard
                icon={<Clock />}
                title="Horario de atención"
                description="Cuando nuestro equipo está disponible"
              >
                <p className="text-sm text-muted-foreground">
                  Lunes – Viernes: 9:00 AM – 6:00 PM EST
                </p>
                <p className="text-sm text-muted-foreground">
                  Sábado: 10:00 AM – 4:00 PM EST
                </p>
                <p className="text-sm text-muted-foreground">
                  Domingo: Soporte de emergencia solamente
                </p>
              </InfoCard>
            </div>

            {/* Right form */}
            <Card className="border-neutral-800 bg-neutral-900">
              <CardHeader>
                <CardTitle className="text-white">
                  Envíanos un mensaje
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Completa el formulario y te responderemos lo antes posible.
                </p>
              </CardHeader>

              <CardContent>
                {message && (
                  <p className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                    {message}
                  </p>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Name</Label>
                      <Input
                        name="name"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={handleChange}
                        className="focus-visible:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Tu correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        className="focus-visible:ring-orange-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Subject</Label>
                    <Input
                      name="subject"
                      placeholder="¿En qué podemos ayudarte?"
                      value={formData.subject}
                      onChange={handleChange}
                      className="focus-visible:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <Label>Message</Label>
                    <Textarea
                      name="message"
                      placeholder="Cuéntanos más sobre tu consulta..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="focus-visible:ring-orange-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-yellow-500 text-black hover:bg-orange-600"
                    disabled={loading}
                  >
                    {loading ? "Enviando..." : "Enviar Mensaje"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">
              PREGUNTAS <span className="text-orange-500">FRECUENTES</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Todo lo que necesitas saber sobre nuestros productos virales
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FaqCard
              title="¿Cuánto tiempo tarda el envío?"
              text="Los pedidos se procesan en 24–48 horas. La entrega suele tardar de 3 a 7 días hábiles dependiendo de tu ubicación."
            />
            <FaqCard
              title="¿Son originales los productos?"
              text="Sí. Todos los productos vendidos en Tienda Texas son 100% originales y artículos virales cuidadosamente seleccionados."
            />
            <FaqCard
              title="¿Puedo devolver o cambiar un producto?"
              text="Ofrecemos una política de devolución de 30 días para productos sin usar en su embalaje original."
            />
            <FaqCard
              title="¿Qué métodos de pago aceptan?"
              text="Aceptamos tarjetas de crédito y débito, Zelle, Cash App y pagos en efectivo dependiendo de la disponibilidad."
            />
            <FaqCard
              title="¿Son estos productos para niños y adultos?"
              text="Sí. Nuestros productos virales son perfectos tanto para niños como para adultos."
            />
            <FaqCard
              title="¿Es segura mi información?"
              text="Sí. Utilizamos prácticas de seguridad y cifrado estándar de la industria."
            />
          </div>

          <div className="pt-10 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Todavía tienes preguntas?
            </p>
            <p className="mt-2 font-semibold text-orange-500 hover:underline cursor-pointer">
              Contacta a nuestro equipo de soporte
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

/* INFO CARD */
function InfoCard({
  icon,
  title,
  description,
  children
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-500">
          {icon}
        </div>
        <div>
          <CardTitle className="text-white">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

/* FAQ CARD */
function FaqCard({
  title,
  text
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition hover:border-orange-500/40">
      <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
