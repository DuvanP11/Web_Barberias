import { MapPin, Clock, Phone, Car, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { getPublicLocations } from "@/lib/public-data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** SEDES — leídas desde la base. Soporta múltiples sedes; oculta la sección si no hay. */
export async function Locations() {
  const locations = await getPublicLocations();
  if (locations.length === 0) return null;

  return (
    <section id="sedes" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow="Dónde estamos"
          title={locations.length > 1 ? "Nuestras sedes" : "Nuestra sede"}
          subtitle="Encuéntranos, revisa horarios y escríbenos por WhatsApp para agendar."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {locations.map((loc, i) => (
            <Reveal key={loc.id} delay={(i % 2) * 0.08}>
              <div className="card-premium flex h-full flex-col overflow-hidden">
                {loc.mapQuery && (
                  <div className="border-b border-line/60">
                    <iframe
                      title={`Ubicación ${loc.name}`}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(loc.mapQuery)}&output=embed`}
                      width="100%"
                      height="220"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full grayscale-[0.3] contrast-110"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="font-display text-xl font-semibold text-cloud">{loc.name}</h3>
                  <ul className="space-y-2.5 text-sm text-mist">
                    {loc.address && (
                      <li className="flex gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-morado-light" /> {loc.address}
                      </li>
                    )}
                    {loc.schedule && (
                      <li className="flex gap-3">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-morado-light" /> {loc.schedule}
                      </li>
                    )}
                    {loc.phone && (
                      <li className="flex gap-3">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-morado-light" /> {loc.phone}
                      </li>
                    )}
                    <li className="flex gap-3">
                      <Car className="mt-0.5 h-4 w-4 shrink-0 text-morado-light" />
                      {loc.parking ? (
                        <span className="inline-flex items-center gap-1 text-cloud">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Con parqueadero
                        </span>
                      ) : (
                        "Sin parqueadero propio"
                      )}
                    </li>
                  </ul>
                  {loc.whatsapp && (
                    <a
                      href={buildWhatsAppUrl(`Hola, quiero agendar en la ${loc.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
                    >
                      <WhatsAppIcon className="h-4 w-4" /> Escribir a esta sede
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
