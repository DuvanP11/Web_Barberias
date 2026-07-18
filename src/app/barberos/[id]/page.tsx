import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Star, Scissors, Users, Award, GraduationCap, BadgeCheck, Languages,
  Target, ArrowLeft, CalendarPlus, Quote,
} from "lucide-react";

// lucide v1 removió los íconos de marca — SVG inline.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Reveal } from "@/components/ui/Reveal";
import { BarberAvatar } from "@/components/home/Barbers";
import { getPublicBarber } from "@/lib/public-data";
import { WORK_IMAGES } from "@/lib/gallery";
import { buildWhatsAppUrl, quickQuoteMessage } from "@/lib/whatsapp";

export default async function BarberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const barber = await getPublicBarber(id);
  if (!barber) notFound();

  const name = `${barber.user.firstName} ${barber.user.lastName}`;
  const indicators = [
    { icon: Star, label: "Calificación", value: barber.rating.toFixed(1) },
    { icon: Scissors, label: "Cortes realizados", value: barber.totalCuts.toLocaleString("es-CO") },
    { icon: Users, label: "Clientes atendidos", value: barber.clientsServed.toLocaleString("es-CO") },
    { icon: Award, label: "Años de experiencia", value: String(barber.experienceYears ?? "—") },
  ];

  const facts = [
    barber.studies && { icon: GraduationCap, label: "Estudios", value: barber.studies },
    barber.certifications && { icon: BadgeCheck, label: "Certificaciones", value: barber.certifications.split("|").map((c) => c.trim()).join(" · ") },
    barber.languages && { icon: Languages, label: "Idiomas", value: barber.languages },
  ].filter(Boolean) as { icon: typeof Award; label: string; value: string }[];

  return (
    <div className="container-app pb-24 pt-28 md:pt-36">
      <Link href="/barberos" className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-cloud">
        <ArrowLeft className="h-4 w-4" /> Todos los barberos
      </Link>

      {/* Encabezado */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="card-premium relative aspect-[4/5] overflow-hidden">
            <BarberAvatar avatar={barber.user.avatar} first={barber.user.firstName} last={barber.user.lastName} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-morado-light">
              {barber.specialty}
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold text-cloud md:text-4xl">{name}</h1>
            <div className="mt-2 flex items-center gap-2 text-naranja-light">
              <Star className="h-4 w-4 fill-naranja text-naranja" />
              <span className="text-sm">{barber.rating.toFixed(1)} · {barber.experienceYears} años de experiencia</span>
            </div>

            {barber.bio && <p className="mt-5 leading-relaxed text-mist">{barber.bio}</p>}

            {/* Indicadores */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {indicators.map((k) => (
                <div key={k.label} className="card-premium p-4 text-center">
                  <k.icon className="mx-auto h-4 w-4 text-morado-light" />
                  <p className="mt-2 font-display text-xl font-semibold text-cloud">{k.value}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-mist">{k.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/cotizar" variant="primary" size="md">
                <CalendarPlus className="h-4 w-4" /> Agendar con {barber.user.firstName}
              </Button>
              <Button href={buildWhatsAppUrl(quickQuoteMessage(`una cita con ${name}`))} external variant="whatsapp" size="md">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </Button>
              {barber.instagram && (
                <a
                  href={barber.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm text-cloud transition-colors hover:border-morado/50"
                >
                  <InstagramIcon className="h-4 w-4" /> Instagram
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Acerca de: estudios / certificaciones / idiomas / metas */}
      {(facts.length > 0 || barber.goals) && (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {facts.map((f) => (
            <div key={f.label} className="card-premium flex items-start gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-morado/15 text-morado-light">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-mist-2">{f.label}</p>
                <p className="mt-1 text-sm text-cloud">{f.value}</p>
              </div>
            </div>
          ))}
          {barber.goals && (
            <div className="card-premium flex items-start gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-naranja/15 text-naranja-light">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-mist-2">Metas</p>
                <p className="mt-1 text-sm text-cloud">{barber.goals}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Portafolio */}
      <div className="mt-16">
        <h2 className="font-display text-2xl font-semibold text-cloud">Portafolio</h2>
        <p className="mt-1 text-sm text-mist">Algunos trabajos realizados por {barber.user.firstName}.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORK_IMAGES.map((src, i) => (
            <Reveal key={src} delay={(i % 3) * 0.06}>
              <figure className="card-premium group relative aspect-[3/4] overflow-hidden">
                <Image src={src} alt={`Trabajo de ${name} ${i + 1}`} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Reseñas */}
      {barber.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-cloud">Reseñas</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {barber.reviews.map((r) => (
              <figure key={r.id} className="card-premium h-full p-6">
                <Quote className="h-6 w-6 text-morado-light/60" />
                <blockquote className="mt-3 text-sm leading-relaxed text-mist">“{r.comment}”</blockquote>
                <figcaption className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-cloud">
                    {r.author.firstName} {r.author.lastName[0]}.
                  </span>
                  <span className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-naranja text-naranja" />
                    ))}
                  </span>
                </figcaption>
                <p className="mt-2 text-xs text-mist-2">{new Date(r.createdAt).toLocaleDateString("es-CO")}</p>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
