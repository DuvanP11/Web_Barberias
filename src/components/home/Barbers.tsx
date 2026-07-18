import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Scissors } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getPublicBarbers } from "@/lib/public-data";

/** Iniciales para el avatar de marcador de posición (aún sin foto de barbero). */
export function barberInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

/** Avatar del barbero: usa su foto si existe; si no, un marcador con iniciales. */
export function BarberAvatar({
  avatar,
  first,
  last,
  className = "",
}: {
  avatar?: string | null;
  first: string;
  last: string;
  className?: string;
}) {
  if (avatar) {
    return (
      <Image src={avatar} alt={`${first} ${last}`} fill sizes="400px" className={`object-cover ${className}`} />
    );
  }
  return (
    <div className={`grid h-full w-full place-items-center bg-gradient-to-br from-surface-2 to-ink-soft ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-morado to-naranja font-display text-2xl font-bold text-white">
          {barberInitials(first, last)}
        </span>
        <Scissors className="h-5 w-5 text-morado-light/60" />
      </div>
    </div>
  );
}

export async function Barbers() {
  const barbers = await getPublicBarbers();
  if (barbers.length === 0) return null;

  return (
    <section id="barberos" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow="Nuestro equipo"
          title="Conoce a nuestros barberos"
          subtitle="Profesionales con oficio y estilo propio. Elige tu barbero de confianza."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((b, i) => (
            <Reveal key={b.id} delay={(i % 3) * 0.08}>
              <Link
                href={`/barberos/${b.id}`}
                className="card-premium group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-morado/50"
              >
                <div className="relative aspect-[4/5] overflow-hidden border-b border-line/60">
                  <BarberAvatar avatar={b.user.avatar} first={b.user.firstName} last={b.user.lastName} />
                  <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-medium text-cloud backdrop-blur">
                    {b.specialty}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-cloud">
                      {b.user.firstName} {b.user.lastName}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm text-naranja-light">
                      <Star className="h-3.5 w-3.5 fill-naranja text-naranja" /> {b.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-mist">
                    {b.experienceYears} años de experiencia · {b.totalCuts.toLocaleString("es-CO")} cortes
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-morado-light transition-colors group-hover:text-cloud">
                    Ver perfil <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
