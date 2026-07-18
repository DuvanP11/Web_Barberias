import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Scissors } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getPublicServices } from "@/lib/public-data";
import { WORK_IMAGES } from "@/lib/gallery";
import { formatCOP } from "@/lib/utils";

/**
 * SERVICIOS — leídos desde la base (precio, duración, descripción, foto). Si no
 * hay base de datos o servicios, cae a un conjunto de ejemplo para no dejar la
 * sección vacía.
 */
export async function Services() {
  const services = await getPublicServices();

  const items =
    services.length > 0
      ? services.map((s, i) => ({
          id: s.id,
          title: s.name,
          text: s.description ?? "",
          image: s.image ?? WORK_IMAGES[i % WORK_IMAGES.length],
          price: s.priceCents > 0 ? formatCOP(s.priceCents / 100) : null,
          duration: s.durationMin,
        }))
      : [
          { id: "corte", title: "Corte clásico", text: "Corte tradicional a tijera y máquina.", image: WORK_IMAGES[0], price: null, duration: 30 },
          { id: "fade", title: "Fade", text: "Degradado profesional a tu medida.", image: WORK_IMAGES[1], price: null, duration: 40 },
          { id: "barba", title: "Barba", text: "Perfilado y arreglo de barba.", image: WORK_IMAGES[2], price: null, duration: 20 },
        ];

  return (
    <section id="servicios" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow="Nuestros servicios"
          title="Cortes, barba y algo más"
          subtitle="Elige el servicio que buscas y agenda en segundos. Precio y duración de cada uno."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.08}>
              <article className="card-premium group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-morado/50">
                <div className="relative aspect-[4/3] overflow-hidden border-b border-line/60 bg-ink-soft/60">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {s.price && (
                    <span className="absolute right-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-sm font-semibold text-cloud backdrop-blur">
                      {s.price}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-cloud">{s.title}</h3>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-mist">
                      <Clock className="h-3.5 w-3.5" /> {s.duration} min
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">{s.text}</p>
                  <Link
                    href="/cotizar"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-morado-light transition-colors hover:text-cloud"
                  >
                    <Scissors className="h-4 w-4" /> Agendar <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
