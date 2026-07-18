import { Award, Clock3, HeartHandshake, Sparkles, ShieldCheck, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

// Beneficios / diferenciales. Edita el texto según el negocio real.
const benefits = [
  {
    icon: Award,
    title: "Profesionales con experiencia",
    text: "Un equipo capacitado que cuida cada detalle de tu experiencia.",
  },
  {
    icon: Sparkles,
    title: "Resultados que se notan",
    text: "Acabados de calidad pensados para que salgas satisfecho cada vez.",
  },
  {
    icon: Clock3,
    title: "Puntualidad y agenda ágil",
    text: "Reserva fácil y atención a tiempo, respetando tu horario.",
  },
  {
    icon: HeartHandshake,
    title: "Atención cercana",
    text: "Te asesoramos y escuchamos para darte justo lo que buscas.",
  },
  {
    icon: ShieldCheck,
    title: "Higiene y seguridad",
    text: "Ambiente limpio y protocolos cuidados en cada servicio.",
  },
  {
    icon: MapPin,
    title: "Ubicación conveniente",
    text: "Fácil de llegar, en una zona cómoda para ti.",
  },
];

export function WhyUs() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow="¿Por qué elegirnos?"
          title="Más que un corte, una experiencia"
          subtitle="Oficio, ambiente y buen trato: esto es lo que hace que nuestros clientes siempre vuelvan."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={(i % 3) * 0.08}>
              <div className="card-premium group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-morado/50">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-morado/20 to-naranja/20 text-morado-light transition-transform duration-300 group-hover:scale-110">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-cloud">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
