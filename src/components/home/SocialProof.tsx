import Image from "next/image";
import { Star, Quote, ImageIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { WORK_IMAGES } from "@/lib/gallery";

/**
 * REFERENCIAS Y CALIFICACIONES — plantilla (sin base de datos, sin fotos).
 *
 * Testimonios de marcador de posición + una galería de marcos vacíos listos
 * para tus fotos. Reemplaza los textos por reseñas reales y los marcos por
 * <Image/> cuando tengas el material.
 */

const TESTIMONIALS = [
  { comment: "El mejor fade que me han hecho en Bogotá. Vuelvo sin duda.", author: "Andrés M.", rating: 5 },
  { comment: "Ambiente increíble y la barba me quedó perfecta. Muy recomendados.", author: "Carlos R.", rating: 5 },
  { comment: "Puntuales, profesionales y a buen precio. Ya soy cliente fijo.", author: "Julián P.", rating: 5 },
];


export function SocialProof() {
  return (
    <section id="referencias" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow="Referencias y calificaciones"
          title="Lo que dicen nuestros clientes"
          subtitle="Testimonios y trabajos realizados de quienes ya confían en el negocio."
        />

        {/* Resumen de calificación */}
        <Reveal className="mt-12">
          <div id="calificaciones" className="card-premium mx-auto flex max-w-lg scroll-mt-24 flex-col items-center gap-3 p-8 text-center">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-naranja text-naranja" />
              ))}
            </div>
            <p className="font-display text-4xl font-semibold text-cloud">4.9</p>
            <p className="text-sm text-mist">Calificación promedio · +200 reseñas de clientes</p>
          </div>
        </Reveal>

        {/* Testimonios */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <figure className="card-premium h-full p-6">
                <Quote className="h-7 w-7 text-morado-light/60" />
                <blockquote className="mt-4 text-sm leading-relaxed text-mist">“{t.comment}”</blockquote>
                <figcaption className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-medium text-cloud">{t.author}</span>
                  <span className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-naranja text-naranja" />
                    ))}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Galería de trabajos — marcos vacíos para tus fotos */}
        <div className="mt-16">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-morado/15 text-morado-light">
              <ImageIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold text-cloud">Galería de trabajos</h3>
              <p className="text-sm text-mist">Espacio listo para tus fotos reales.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WORK_IMAGES.map((src, i) => (
              <Reveal key={src} delay={(i % 3) * 0.06}>
                <figure className="card-premium group relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={src}
                    alt={`Trabajo realizado ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
