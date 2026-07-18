import { Target, Eye, Building2, BadgeCheck, ImageIcon } from "lucide-react";
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
          title="Un poco sobre nosotros"
          subtitle="Cuenta la historia del negocio: quiénes son, qué los mueve y qué los diferencia."
        />

        {/* Historia + imagen */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-line">
              <div className="relative grid aspect-[4/3] place-items-center bg-ink-soft/60">
                <div className="absolute inset-0 bg-gradient-to-br from-morado/10 to-naranja/10" />
                <div className="relative flex flex-col items-center gap-2 text-mist">
                  <ImageIcon className="h-9 w-9 text-morado-light" />
                  <p className="text-sm">Espacio para foto del local o el equipo</p>
                </div>
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
                  Escribe aquí un par de párrafos sobre cómo nació {siteConfig.name}, qué buscan
                  ofrecer y por qué los clientes confían en el negocio.
                </p>
                <p>
                  Un segundo párrafo puede hablar del compromiso con la calidad, la atención cercana
                  y la experiencia del equipo.
                </p>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Atención personalizada",
                  "Profesionales capacitados",
                  "Ambiente cómodo",
                  "+10 años de experiencia",
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
                Describe el propósito del negocio: qué ofrece, a quién y con qué compromiso de
                calidad y servicio.
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
                Describe hacia dónde quiere llegar el negocio en los próximos años y cómo quiere que
                lo recuerden sus clientes.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
