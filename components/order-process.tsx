import { Receipt, CheckCircle, FileCheck, Truck, Smile } from "lucide-react"

export function OrderProcess() {
  const steps = [
    { icon: Receipt, label: "Pedido" },
    { icon: CheckCircle, label: "Pago" },
    { icon: FileCheck, label: "Procesado" },
    { icon: Truck, label: "Enviado" },
    { icon: Smile, label: "Entregado" },
  ]

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 py-2 overflow-x-auto px-2">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center gap-1 min-w-[60px]">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white dark:bg-white dark:text-black shrink-0">
            <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-center whitespace-nowrap">{step.label}</span>
          {index < steps.length - 1 && (
            <div className="absolute top-5 sm:top-6 left-full w-4 sm:w-6 h-0.5 bg-yellow-500 transform hidden sm:block"></div>
          )}
        </div>
      ))}
    </div>
  )
}