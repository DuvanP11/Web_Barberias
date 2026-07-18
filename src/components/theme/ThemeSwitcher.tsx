"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Moon, SwatchBook, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { STYLES } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Selector de apariencia: modo claro/oscuro + ESTILO visual completo.
 * El estilo reestiliza toda la página (tipografía, colores, superficies y
 * motivos). Accesible para cualquier visitante desde la barra superior.
 */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { mode, style, setMode, setStyle } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Cambiar estilo y apariencia del sitio"
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-3 text-cloud transition-colors hover:bg-white/[0.06]"
      >
        <SwatchBook className="h-5 w-5" />
        <span className="hidden text-sm font-medium sm:inline">Estilo</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-label="Apariencia"
            className="card-premium absolute right-0 top-full z-50 mt-3 w-72 origin-top-right p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-mist-2">Estilo</p>
            <div className="mt-2 grid gap-2">
              {STYLES.map((s) => {
                const active = style === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-2.5 text-left transition-colors",
                      active
                        ? "border-morado/60 bg-morado/10"
                        : "border-line bg-white/[0.02] hover:border-morado/40",
                    )}
                  >
                    {/* Muestra de 3 colores del estilo */}
                    <span className="flex shrink-0 overflow-hidden rounded-lg ring-1 ring-line">
                      {s.swatch.map((c) => (
                        <span key={c} className="h-9 w-3.5" style={{ background: c }} />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-cloud">{s.label}</span>
                        {active && <Check className="h-3.5 w-3.5 text-morado-light" />}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-mist">{s.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-mist-2">Modo</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("light")}
                aria-pressed={mode === "light"}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                  mode === "light"
                    ? "border-morado/60 bg-morado/10 text-cloud"
                    : "border-line bg-white/[0.02] text-mist hover:text-cloud",
                )}
              >
                <Sun className="h-4 w-4" /> Claro
              </button>
              <button
                type="button"
                onClick={() => setMode("dark")}
                aria-pressed={mode === "dark"}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                  mode === "dark"
                    ? "border-morado/60 bg-morado/10 text-cloud"
                    : "border-line bg-white/[0.02] text-mist hover:text-cloud",
                )}
              >
                <Moon className="h-4 w-4" /> Oscuro
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
