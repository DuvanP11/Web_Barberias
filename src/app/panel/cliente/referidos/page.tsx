import { Share2, Gift, UserPlus, Sparkles } from "lucide-react";
import { requireRole, ROLES } from "@/lib/rbac";
import { ReferralShare } from "@/components/panel/ReferralShare";
import { siteConfig } from "@/lib/site-config";

const STEPS = [
  { icon: Share2, title: "Comparte tu enlace", text: "Envíaselo a tus amigos por WhatsApp, redes o copiando el link." },
  { icon: UserPlus, title: "Tu amigo se registra y agenda", text: "Al usar tu código y reservar su primera cita, se activa el beneficio." },
  { icon: Gift, title: "Ambos ganan", text: "Tú sumas 50 puntos y tu amigo recibe un descuento en su primer servicio." },
];

export default async function ReferidosPage() {
  const session = await requireRole(ROLES.CLIENT);
  const code = session.uid.slice(-6).toUpperCase();
  const base = siteConfig.url.replace(/\/$/, "");
  const url = `${base}/registro?ref=${code}`;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Refiere y gana</h1>
      <p className="mt-1 text-sm text-mist">Invita a tus amigos: cuando agenden, ambos reciben beneficios.</p>

      <div className="card-premium relative mt-6 overflow-hidden p-6 md:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-naranja/20 blur-3xl" />
        <div className="relative">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-morado-light">
            <Sparkles className="h-3.5 w-3.5" /> Tu código
          </p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-[0.2em] text-cloud">{code}</p>
          <div className="mt-5">
            <ReferralShare code={code} url={url} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.title} className="card-premium p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-morado/15 text-morado-light">
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-xs text-mist-2">Paso {i + 1}</p>
            <p className="mt-0.5 font-display text-base font-semibold text-cloud">{s.title}</p>
            <p className="mt-1 text-sm text-mist">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
