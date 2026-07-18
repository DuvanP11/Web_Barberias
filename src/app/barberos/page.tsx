import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BarberAvatar } from "@/components/home/Barbers";
import { getPublicBarbers } from "@/lib/public-data";

export const metadata = { title: "Nuestros barberos" };

export default async function BarberosPage() {
  const barbers = await getPublicBarbers();

  return (
    <div className="container-app pb-24 pt-28 md:pt-36">
      <SectionHeading
        eyebrow="Nuestro equipo"
        title="Nuestros barberos"
        subtitle="Conoce a los profesionales que harán tu próximo corte. Elige tu barbero y agenda."
      />

      {barbers.length === 0 ? (
        <p className="mt-12 text-center text-mist">Aún no hay barberos publicados.</p>
      ) : (
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
                    {b.experienceYears} años · {b.totalCuts.toLocaleString("es-CO")} cortes
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-morado-light transition-colors group-hover:text-cloud">
                    Ver perfil <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
