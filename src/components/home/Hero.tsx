"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useTheme } from "@/components/theme/ThemeProvider";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppUrl, quickQuoteMessage } from "@/lib/whatsapp";
import type { StyleId } from "@/lib/theme";

/**
 * HERO — foto de fondo a sangre completa que CAMBIA según el estilo activo, con
 * PARALLAX interactivo: la imagen se desplaza suavemente con el cursor (en
 * sentido contrario) y el contenido, levemente a favor; además respira con un
 * zoom lento (Ken Burns). Todo se desactiva con `prefers-reduced-motion`.
 *
 * Imágenes en /public/hero (alta resolución). El overlay usa el token `ink`, así
 * que se oscurece en los estilos oscuros y se aclara en minimalista (modo claro).
 */
const HERO_IMAGES: Record<StyleId, string> = {
  premium: "/hero/premium.jpg",
  clasico: "/hero/clasico.jpg",
  urbano: "/hero/urbano.jpg",
  minimalista: "/hero/minimalista.jpg",
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { style } = useTheme();
  const heroImage = HERO_IMAGES[style] ?? HERO_IMAGES.premium;

  // Posición normalizada del cursor dentro del hero (-0.5 … 0.5).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 55, damping: 18, mass: 0.4 });

  // La foto se desplaza en sentido contrario al cursor; el contenido, a favor.
  const imgX = useTransform(sx, [-0.5, 0.5], [28, -28]);
  const imgY = useTransform(sy, [-0.5, 0.5], [20, -20]);
  const contentX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const contentY = useTransform(sy, [-0.5, 0.5], [-7, 7]);

  function handleMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative isolate flex min-h-[92vh] items-center overflow-hidden"
    >
      {/* Capa de foto (parallax + Ken Burns), cambia con el estilo */}
      <motion.div style={reduce ? undefined : { x: imgX, y: imgY }} className="absolute inset-0 z-0">
        <motion.div
          key={heroImage}
          className="absolute inset-[-7%]"
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: [1.06, 1.14, 1.06] }}
          transition={{
            opacity: { duration: 0.6 },
            scale: { duration: 26, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Image
            src={heroImage}
            alt={`Interior de ${siteConfig.name}`}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Overlays para legibilidad (usan `ink`: oscuro en estilos oscuros, claro
          en minimalista). Fuertes a la izquierda, sueltan la foto a la derecha. */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
      <div className="absolute inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-ink/80 to-transparent" />

      {/* Contenido */}
      <motion.div
        style={reduce ? undefined : { x: contentX, y: contentY }}
        className="container-app relative z-10 w-full pb-16 pt-32 md:pt-40"
      >
        <motion.div variants={container} initial="hidden" animate="visible" className="max-w-2xl">
          {/* Motivo de poste de barbería (solo visible en el estilo Clásico) */}
          <div className="barber-pole mb-6 w-28" />

          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-cloud backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-morado-light" />
            {siteConfig.slogan}
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-4xl font-semibold leading-[1.03] tracking-tight text-cloud drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Tu mejor versión
            <br />
            <span className="text-gradient-morado">empieza por un buen corte.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-cloud/85">
            En <span className="text-cloud">{siteConfig.name}</span> unimos la barbería clásica con
            las tendencias de hoy: cortes, barba y afeitado a navaja, con la atención que mereces.{" "}
            <span className="italic text-morado-light">“{siteConfig.tagline}”.</span>
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/cotizar" variant="primary" size="lg">
              Agendar una cita <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href={buildWhatsAppUrl(quickQuoteMessage())} external variant="whatsapp" size="lg">
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
            </Button>
          </motion.div>

          {/* Prueba social */}
          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-naranja text-naranja" />
              ))}
              <span className="ml-1.5 text-sm text-cloud/80">Clientes satisfechos</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <p className="text-sm text-cloud/80">
              <span className="font-display text-lg font-semibold text-cloud">+10</span> años de experiencia
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
