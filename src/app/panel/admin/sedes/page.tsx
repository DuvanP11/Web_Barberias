import { MapPin, Plus, Save, Eye, EyeOff } from "lucide-react";
import { requireRole, ROLES } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { createLocation, updateLocation, toggleLocation } from "./actions";

const input = "w-full rounded-lg border border-line bg-surface/50 px-3 py-2 text-sm text-cloud focus:border-morado/60 focus:outline-none";

export default async function SedesAdminPage() {
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  const locations = await prisma.location.findMany({ where: { tenantId: session.tenantId }, orderBy: { createdAt: "asc" } });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white"><MapPin className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Sedes</h1>
          <p className="text-sm text-mist">Administra las sedes de la barbería.</p>
        </div>
      </div>

      {/* Crear */}
      <form action={createLocation} className="card-premium mt-6 grid gap-3 p-5 sm:grid-cols-2">
        <input name="name" required placeholder="Nombre de la sede" className={input} />
        <input name="address" placeholder="Dirección" className={input} />
        <input name="phone" placeholder="Teléfono" className={input} />
        <input name="whatsapp" placeholder="WhatsApp (573...)" className={input} />
        <input name="schedule" placeholder="Horario" className={input} />
        <input name="mapQuery" placeholder="Consulta de Google Maps" className={input} />
        <label className="flex items-center gap-2 text-sm text-cloud"><input type="checkbox" name="parking" /> Con parqueadero</label>
        <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-morado to-naranja px-4 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4" /> Crear sede</button>
      </form>

      {/* Lista editable */}
      <div className="mt-4 space-y-3">
        {locations.map((l) => (
          <div key={l.id} className={`card-premium p-5 ${!l.active ? "opacity-60" : ""}`}>
            <form action={updateLocation} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={l.id} />
              <input name="name" defaultValue={l.name} className={input} />
              <input name="address" defaultValue={l.address ?? ""} placeholder="Dirección" className={input} />
              <input name="phone" defaultValue={l.phone ?? ""} placeholder="Teléfono" className={input} />
              <input name="whatsapp" defaultValue={l.whatsapp ?? ""} placeholder="WhatsApp" className={input} />
              <input name="schedule" defaultValue={l.schedule ?? ""} placeholder="Horario" className={input} />
              <input name="mapQuery" defaultValue={l.mapQuery ?? ""} placeholder="Google Maps" className={input} />
              <label className="flex items-center gap-2 text-sm text-cloud"><input type="checkbox" name="parking" defaultChecked={l.parking} /> Con parqueadero</label>
              <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm text-cloud hover:border-morado/50"><Save className="h-4 w-4" /> Guardar</button>
            </form>
            <form action={toggleLocation} className="mt-2">
              <input type="hidden" name="id" value={l.id} />
              <button className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-mist hover:text-cloud">
                {l.active ? <><EyeOff className="h-3.5 w-3.5" /> Desactivar</> : <><Eye className="h-3.5 w-3.5" /> Activar</>}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
