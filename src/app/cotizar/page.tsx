"use client";

import { useState } from "react";
import { CalendarPlus, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppUrl, contactToWhatsAppMessage } from "@/lib/whatsapp";

/**
 * AGENDAR / CONTACTO — plantilla sin base de datos.
 *
 * El formulario no guarda nada en servidor: arma un mensaje y abre WhatsApp con
 * los datos prellenados. Si más adelante quieres registrar las solicitudes,
 * conecta un endpoint en `src/app/api/` antes de abrir el enlace.
 */

const inputClass =
  "w-full rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-cloud placeholder:text-mist-2 " +
  "transition-colors focus:border-morado/60 focus:outline-none focus:ring-2 focus:ring-morado/30";
const labelClass = "mb-1.5 block text-sm font-medium text-cloud";

export default function CotizarPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Trampa antispam: campo oculto que un humano nunca llena.
    if ((data.get("website") as string)?.trim()) {
      setSent(true);
      return;
    }

    const url = buildWhatsAppUrl(
      contactToWhatsAppMessage({
        nombre: (data.get("nombre") as string) || "",
        telefono: (data.get("telefono") as string) || "",
        servicio: (data.get("servicio") as string) || "",
        fecha: (data.get("fecha") as string) || undefined,
        mensaje: (data.get("mensaje") as string) || undefined,
      }),
    );

    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <div className="container-app min-h-[80vh] pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-morado-light">
            <CalendarPlus className="h-3.5 w-3.5" /> Agenda tu cita
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold text-cloud sm:text-4xl md:text-5xl">
            Reserva en <span className="text-gradient-brand">{siteConfig.name}</span>
          </h1>
          <p className="mt-4 text-mist">
            Déjanos tus datos y te confirmamos el turno por WhatsApp. También puedes escribirnos
            directamente.
          </p>
        </div>

        {sent ? (
          <div className="card-premium mt-10 flex flex-col items-center gap-4 p-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-emerald-400" />
            <h2 className="font-display text-2xl font-semibold text-cloud">¡Solicitud lista!</h2>
            <p className="max-w-md text-sm text-mist">
              Abrimos WhatsApp con tu mensaje. Si no se abrió automáticamente, escríbenos por el
              botón de abajo y te atendemos enseguida.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button
                href={buildWhatsAppUrl(`Hola, *${siteConfig.name}*. Quiero agendar una cita.`)}
                external
                variant="whatsapp"
                size="md"
              >
                <WhatsAppIcon className="h-4 w-4" /> Escribir por WhatsApp
              </Button>
              <Button href="/" variant="outline" size="md" onClick={() => setSent(false)}>
                Volver al inicio
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-premium mt-10 space-y-5 p-6 md:p-8">
            {/* Honeypot: oculto para humanos, tentador para bots */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="nombre">
                  Nombre <span className="text-morado-light">*</span>
                </label>
                <input id="nombre" name="nombre" required placeholder="Tu nombre" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="telefono">
                  Teléfono <span className="text-morado-light">*</span>
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  required
                  inputMode="tel"
                  placeholder="300 000 0000"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="servicio">
                  Servicio <span className="text-morado-light">*</span>
                </label>
                <select id="servicio" name="servicio" required defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Elige un servicio
                  </option>
                  {siteConfig.services.map((s) => (
                    <option key={s.title} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="fecha">
                  Fecha y hora preferida
                </label>
                <input id="fecha" name="fecha" type="datetime-local" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="mensaje">
                Mensaje (opcional)
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={4}
                placeholder="Cuéntanos qué necesitas..."
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-morado to-naranja px-8 py-4 text-base font-medium text-white shadow-lg shadow-morado/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-morado/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-morado/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <Send className="h-4 w-4" /> Enviar por WhatsApp
            </button>

            <p className="text-center text-xs text-mist-2">
              Al enviar, se abrirá WhatsApp con tu solicitud prellenada.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
