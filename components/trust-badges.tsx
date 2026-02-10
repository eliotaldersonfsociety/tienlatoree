import { Truck, Package, ShieldCheck } from "lucide-react"

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4">
      <div className="flex flex-col items-center gap-1">
        <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
        <div className="text-xs sm:text-sm text-muted-foreground">Envío rápido</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Package className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
        <div className="text-xs sm:text-sm text-muted-foreground">Entrega 1 día</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
        <div className="text-xs sm:text-sm text-muted-foreground">Pago seguro</div>
      </div>
    </div>
  )
}
