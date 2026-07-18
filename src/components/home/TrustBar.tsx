import { Reveal } from "@/components/ui/Reveal";

// Cifras destacadas. Ajústalas a los datos reales del negocio.
const stats = [
  { value: "+10", label: "Años de experiencia" },
  { value: "100%", label: "Clientes satisfechos" },
  { value: "6", label: "Servicios disponibles" },
  { value: "★ 5.0", label: "Calificación" },
];

export function TrustBar() {
  return (
    <section className="border-y border-line/60 bg-ink-soft/40">
      <div className="container-app grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <p className="font-display text-3xl font-semibold text-gradient-brand md:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-mist">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
