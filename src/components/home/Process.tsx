import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** Pasos del proceso de atención. Ajusta las etiquetas al flujo real. */
const steps = [
  { key: "reservas", label: "Reservas", color: "#8b5cf6" },
  { key: "confirmamos", label: "Confirmamos", color: "#a78bfa" },
  { key: "te-atendemos", label: "Te atendemos", color: "#fb923c" },
  { key: "disfrutas", label: "Disfrutas", color: "#22c55e" },
];

export function Process() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow="¿Cómo funciona?"
          title="Tu cita en pocos pasos"
          subtitle="Explica en pocas palabras cómo es de fácil agendar y ser atendido."
        />

        <Reveal className="mt-16">
          <ol className="relative flex flex-col gap-6 md:flex-row md:gap-0">
            {/* Línea conectora */}
            <span className="absolute left-4 top-4 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-morado via-naranja to-emerald-500 md:left-0 md:top-4 md:h-px md:w-full md:bg-gradient-to-r" />

            {steps.map((s, i) => (
              <li key={s.key} className="relative flex flex-1 items-center gap-4 md:flex-col md:items-start md:gap-3 md:px-2">
                <span
                  className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 bg-ink text-xs font-semibold"
                  style={{ borderColor: s.color, color: s.color }}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-cloud md:mt-1">{s.label}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
