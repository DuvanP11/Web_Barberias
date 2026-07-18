import { ClipboardList } from "lucide-react";
import { requireRole, ROLES } from "@/lib/rbac";
import { AsesoriaForm } from "@/components/panel/AsesoriaForm";

export default async function AsesoriaPage() {
  await requireRole(ROLES.CLIENT);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white">
          <ClipboardList className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Asesoría de estilo</h1>
          <p className="text-sm text-mist">Cuéntanos sobre ti y te recomendamos corte, estilo y productos.</p>
        </div>
      </div>

      <div className="mt-8">
        <AsesoriaForm />
      </div>
    </div>
  );
}
