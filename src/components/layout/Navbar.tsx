"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Logo } from "./Logo";
import { buildWhatsAppUrl, quickQuoteMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 print:hidden",
        scrolled
          ? "border-b border-line/70 bg-ink/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="container-app flex h-16 items-center justify-between gap-3 md:h-20">
        <div className="shrink-0">
          <Logo />
        </div>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="whitespace-nowrap rounded-full px-3 py-2 text-sm text-mist transition-colors hover:bg-white/[0.05] hover:text-cloud"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Button href="/cotizar" variant="outline" size="sm">
            Agendar
          </Button>
          <Button
            href={buildWhatsAppUrl(quickQuoteMessage())}
            external
            variant="whatsapp"
            size="sm"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </Button>
          <ThemeSwitcher />
        </div>

        {/* Tema + menú compacto en pantallas pequeñas */}
        <div className="flex shrink-0 items-center gap-0.5 lg:hidden">
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white shadow-lg shadow-morado/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-morado/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-morado/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-line/60 bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-app flex flex-col gap-1 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base text-cloud transition-colors hover:bg-white/[0.05]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex gap-2 px-1">
                <Button href="/cotizar" variant="outline" size="sm" className="flex-1" onClick={() => setOpen(false)}>
                  Agendar
                </Button>
                <Button
                  href={buildWhatsAppUrl(quickQuoteMessage())}
                  external
                  variant="whatsapp"
                  size="sm"
                  className="flex-1"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
