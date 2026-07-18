import Link from "next/link";
import { ArrowRight, Scissors } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";

/**
 * SERVICIOS — reemplaza al catálogo de la plantilla original.
 *
 * Las tarjetas salen de `siteConfig.services`. Cada una tiene un espacio de foto
 * (marcador de posición) que puedes cambiar por un <Image/> cuando tengas las
 * imágenes. Para precios, agrega un campo `price` a cada servicio en site-config.
 */
export function Services() {
  return (
    <section id="servicios" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow="Nuestros servicios"
          title="Lo que ofrecemos"
          subtitle="Describe brevemente la oferta del negocio. Cada tarjeta es un servicio; edítalos en site-config.ts."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08}>
              <article className="card-premium group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-morado/50">
                {/* Marcador de posición de foto del servicio */}
                <div className="relative grid aspect-[4/3] place-items-center border-b border-line/60 bg-ink-soft/60">
                  <div className="absolute inset-0 bg-gradient-to-br from-morado/10 to-naranja/10" />
                  <Scissors className="relative h-9 w-9 text-morado-light/70" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold text-cloud">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">{s.text}</p>
                  <Link
                    href="/cotizar"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-morado-light transition-colors hover:text-cloud"
                  >
                    Agendar <ArrowRight className="h-4 w-4" />
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
