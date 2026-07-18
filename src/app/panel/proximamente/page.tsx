import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";
import { requireSession, panelHome } from "@/lib/rbac";

/**
 * Placeholder de módulos que llegan en fases posteriores. El menú apunta aquí
 * para que la navegación funcione sin enlaces muertos, mostrando qué módulo es y
 * en qué fase se construye.
 */
export default async function ProximamentePage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; f?: string }>;
}) {
  const session = await requireSession();
  const { m, f } = await searchParams;
  const modulo = m ?? "Este módulo";
  const fase = f ?? "una próxima fase";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-morado/20 to-naranja/20 text-morado-light">
        <Construction className="h-8 w-8" />
      </span>
      <h1 className="mt-6 font-display text-2xl font-semibold text-cloud">{modulo}</h1>
      <p className="mt-2 text-sm text-mist">
        Este módulo hace parte de <span className="text-cloud">{fase}</span> del desarrollo. La
        fundación (base de datos multi-tenant, roles y accesos) ya está lista; aquí se conectará su
        funcionalidad completa.
      </p>
      <Link
        href={panelHome(session.role)}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-cloud transition-colors hover:border-morado/50"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al inicio del panel
      </Link>
    </div>
  );
}
