import Image from "next/image";
import { Target, Eye, Building2, BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";

/**
 * NOSOTROS — sin foto (plantilla).
 * Reemplaza el marco "Espacio para foto" por un <Image/> cuando la tengas, y
 * ajusta el texto de historia / misión / visión al negocio real.
 */
export function About() {
  return (
    <section id="nosotros" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow="Quiénes somos"
          title="Sobre la barbería"
          subtitle="Una barbería con oficio, donde cada cliente sale sintiéndose como su mejor versión."
        />

        {/* Historia + imagen */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-line">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/nosotros/local.jpg"
                  alt={`Interior de ${siteConfig.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-morado/15 text-morado-light">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold text-cloud">Nuestra historia</h3>
              <div className="mt-4 space-y-4 leading-relaxed text-mist">
                <p>
                  {siteConfig.name} nació del gusto por la barbería de siempre: la navaja, la toalla
                  caliente y la conversación de barrio. Con los años sumamos las tendencias de hoy
                  para darte lo mejor de ambos mundos.
                </p>
                <p>
                  Nuestro equipo cuida cada detalle, desde el degradado hasta el perfilado de la
                  barba, para que salgas sintiéndote renovado. Aquí no atendemos clientes de paso:
                  cultivamos habituales.
                </p>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Barberos con experiencia",
                  "Afeitado clásico a navaja",
                  "Ambiente y buena música",
                  "+10 años de oficio",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-cloud">
                    <BadgeCheck className="h-4 w-4 shrink-0 text-morado-light" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Misión + Visión */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="card-premium h-full p-7">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-naranja/15 text-naranja-light">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-cloud">Misión</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Brindar cortes y arreglos de barba de la más alta calidad en un ambiente cercano,
                cuidando cada detalle para que cada cliente se vaya sintiéndose seguro y a gusto.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card-premium h-full p-7">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-morado/15 text-morado-light">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-cloud">Visión</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Ser la barbería de referencia de la zona, reconocida por su oficio, su ambiente y
                por convertir cada visita en una experiencia que los clientes quieran repetir.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
