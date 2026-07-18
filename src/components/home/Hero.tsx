"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles, Star, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppUrl, quickQuoteMessage } from "@/lib/whatsapp";

/**
 * HERO — sin foto (plantilla). El fondo lo pone <AnimatedBackground/> del layout.
 *
 * Cuando tengas la imagen del negocio, reemplaza el panel derecho "Espacio para
 * foto" por un <Image/> a sangre o dentro del marco. El texto sale de
 * site-config y de los marcadores de posición de aquí.
 */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden">
      {/* Realce superior para legibilidad de la barra */}
      <div className="absolute inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-ink/85 to-transparent" />

      <div className="container-app relative z-10 grid w-full items-center gap-12 pb-16 pt-32 md:pt-40 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Contenido */}
        <motion.div variants={container} initial="hidden" animate="visible" className="max-w-2xl">
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
            Un titular potente,
            <br />
            <span className="text-gradient-morado">que enamore a tu cliente.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-cloud/85">
            Aquí va un párrafo breve que explique qué hace{" "}
            <span className="text-cloud">{siteConfig.name}</span> y por qué elegirlo. Dos o tres
            líneas bastan.{" "}
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

        {/* Panel derecho — marcador de posición para la foto principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
        >
          <div className="card-premium relative grid aspect-[4/5] place-items-center overflow-hidden">
            <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-morado/20 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-naranja/20 blur-3xl" />
            <div className="relative flex flex-col items-center gap-3 text-mist">
              <ImageIcon className="h-10 w-10 text-morado-light" />
              <p className="text-sm">Espacio para foto principal</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
