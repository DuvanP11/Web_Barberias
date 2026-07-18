import { Settings } from "lucide-react";
import { requireRole, ROLES } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { ConfigForm } from "@/components/panel/ConfigForm";

export default async function ConfiguracionPage() {
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  const tenant = await prisma.tenant.findUnique({ where: { id: session.tenantId } });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white"><Settings className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Configuración</h1>
          <p className="text-sm text-mist">Datos generales del negocio.</p>
        </div>
      </div>

      <div className="mt-6">
        <ConfigForm name={tenant?.name ?? ""} primaryColor={tenant?.primaryColor ?? "#c9a227"} />
      </div>

      <p className="mt-4 text-xs text-mist-2">
        Horarios, métodos de pago, políticas y notificaciones se gestionan en sus módulos
        respectivos. Las comisiones se configuran en el módulo Comisiones.
      </p>
    </div>
  );
}
