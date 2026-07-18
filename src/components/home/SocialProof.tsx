import Image from "next/image";
import { Star, Quote, ImageIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getApprovedReviews } from "@/lib/public-data";
import { WORK_IMAGES } from "@/lib/gallery";

/**
 * REFERENCIAS Y CALIFICACIONES — reseñas leídas desde la base (rating, comentario,
 * fecha y cliente). Si no hay, cae a testimonios de ejemplo. La galería usa las
 * fotos de trabajos.
 */
const FALLBACK = [
  { id: "f1", comment: "El mejor fade que me han hecho en Bogotá. Vuelvo sin duda.", author: "Andrés M.", rating: 5, date: null as string | null },
  { id: "f2", comment: "Ambiente increíble y la barba me quedó perfecta.", author: "Carlos R.", rating: 5, date: null },
  { id: "f3", comment: "Puntuales, profesionales y buen precio. Recomendados.", author: "Julián P.", rating: 5, date: null },
];

export async function SocialProof() {
  const reviews = await getApprovedReviews(6);

  const items =
    reviews.length > 0
      ? reviews.map((r) => ({
          id: r.id,
          comment: r.comment ?? "",
          author: `${r.author.firstName} ${r.author.lastName[0]}.`,
          rating: r.rating,
          date: new Date(r.createdAt).toLocaleDateString("es-CO"),
        }))
      : FALLBACK;

  const count = reviews.length;
  const average =
    count > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / count : null;

  return (
    <section id="referencias" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow="Referencias y calificaciones"
          title="Lo que dicen nuestros clientes"
          subtitle="Opiniones reales de quienes ya confían en la barbería."
        />

        {count > 0 && average != null && (
          <Reveal className="mt-12">
            <div id="calificaciones" className="card-premium mx-auto flex max-w-lg scroll-mt-24 flex-col items-center gap-3 p-8 text-center">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={i < Math.round(average) ? "h-6 w-6 fill-naranja text-naranja" : "h-6 w-6 text-mist-2"} />
                ))}
              </div>
              <p className="font-display text-4xl font-semibold text-cloud">{average.toFixed(1)}</p>
              <p className="text-sm text-mist">
                Calificación promedio · {count} {count === 1 ? "reseña" : "reseñas"}
              </p>
            </div>
          </Reveal>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.08}>
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
                {t.date && <p className="mt-2 text-xs text-mist-2">{t.date}</p>}
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Galería de trabajos */}
        <div className="mt-16">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-morado/15 text-morado-light">
              <ImageIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold text-cloud">Galería de trabajos</h3>
              <p className="text-sm text-mist">Cortes y estilos realizados por nuestro equipo.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WORK_IMAGES.map((src, i) => (
              <Reveal key={src} delay={(i % 3) * 0.06}>
                <figure className="card-premium group relative aspect-[3/4] overflow-hidden">
                  <Image src={src} alt={`Trabajo realizado ${i + 1}`} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
