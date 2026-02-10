import Image from "next/image"
import { Play } from "lucide-react"

interface ResultsCarouselProps {
  isPlaying: boolean
  onPlay: () => void
  onEnded: () => void
}

export function ResultsCarousel({
  isPlaying,
  onPlay,
  onEnded,
}: ResultsCarouselProps) {
  return (
    <section id="results" className="py-4">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        {/* TEXT */}
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold">
            DESCUBRE NUESTRAS{" "}
            <span className="text-[#FF8A00] font-black">
              CAMISETAS
            </span>
          </h2>

          <p className="text-muted-foreground">
            Comodidad, frescura y estilo en una sola prenda,
            perfectas para gym, running o uso diario.
          </p>
        </div>

        {/* MEDIA */}
        <div className="relative w-full max-w-md mx-auto aspect-[416/752]">
          {!isPlaying ? (
            <button
              onClick={onPlay}
              className="relative group w-full h-full rounded-lg overflow-hidden"
            >
              {/* PREVIEW IMAGE */}
              <Image
                src="/modelo3.png"
                alt="Labubu preview"
                width={416}
                height={752}
                className="w-full h-auto object-cover"
              />

              {/* OVERLAY */}
              <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="bg-black/50 p-4 rounded-full group-hover:scale-110 transition">
                  <Play className="w-8 h-8 text-white" />
                </span>
              </span>
            </button>
          ) : (
            <video
              src="/modelo3.webm"
              autoPlay
              controls
              playsInline
              preload="metadata"
              className="w-full max-w-md mx-auto rounded-xl shadow-lg aspect-[416/752] object-cover"
              onEnded={onEnded}
            />
          )}
        </div>
      </div>
    </section>
  )
}
