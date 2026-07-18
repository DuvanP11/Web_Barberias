import { FileText, Download, CalendarDays, Wallet, Users } from "lucide-react";
import { requireRole, ROLES } from "@/lib/rbac";

const REPORTS = [
  { type: "citas", icon: CalendarDays, title: "Citas", desc: "Todas las citas con cliente, barbero, servicio, sede, estado y precio." },
  { type: "ingresos", icon: Wallet, title: "Ingresos", desc: "Pagos registrados con servicio, barbero, método y monto." },
  { type: "clientes", icon: Users, title: "Clientes", desc: "Base de clientes con contacto y puntos de fidelidad." },
];

export default async function ReportesPage() {
  await requireRole(ROLES.ADMIN, ROLES.OWNER);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white"><FileText className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Reportes</h1>
          <p className="text-sm text-mist">Exporta tus datos en formato CSV (compatible con Excel).</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {REPORTS.map((r) => (
          <div key={r.type} className="card-premium flex flex-col p-5">
            <r.icon className="h-6 w-6 text-morado-light" />
            <h3 className="mt-3 font-display text-base font-semibold text-cloud">{r.title}</h3>
            <p className="mt-1 flex-1 text-sm text-mist">{r.desc}</p>
            <a href={`/api/reportes?type=${r.type}`} className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-cloud transition-colors hover:border-morado/50">
              <Download className="h-4 w-4" /> Descargar CSV
            </a>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-mist-2">Los reportes en PDF y Excel nativo se habilitan en una fase posterior; el CSV abre directamente en Excel/Google Sheets.</p>
    </div>
  );
}
