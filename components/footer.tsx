import { Dumbbell, Facebook, Instagram, Music2} from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col space-y-8">

          {/* Logo and description section */}
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <img
                src="/logo.png"
                alt="Latorreimperial logo"
                className="h-6 w-6"
              />

              <span className="font-bold text-xl text-yellow-300">La Torre Imperial</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              La Torre Imperial es una empresa líder en la venta en línea de ropa y accesorios. Ubicada en Colombia, ofrecemos una amplia gama de ropa y accesorios de calidad con envío a nivel nacional. Nuestra misión es proporcionar una experiencia de compra excepcional con servicio al cliente de primera clase.
            </p>
          </div>

          {/* Social Media */}
          <div className="space-y-4 text-center">
            <h3 className="font-semibold text-lg">Síguenos en nuestras redes sociales</h3>
            <div className="flex items-center justify-center gap-4">
              <Link href="https://web.facebook.com/latorreimperial" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://instagram.com/torreimperialoficial" aria-label="Instagram">
                <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="https://tiktok.com/@la.torre.imperial" aria-label="TikTok">
                <Music2 className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

          {/* Links to Terms, Privacy and Contact */}
          <div className="space-y-4 text-center">
            <h3 className="font-semibold text-lg">Información</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms-and-conditions" className="hover:underline">Términos de Servicio</Link></li>
              <li><Link href="/privacy-policy" className="hover:underline">Política de Privacidad</Link></li>
              <li><Link href="/contact" className="hover:underline">Contacto</Link></li>
            </ul>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © 2026 La Torre Imperial. Todos los derechos reservados.
          </p>

        </div>
      </div>
    </footer>
  )
}