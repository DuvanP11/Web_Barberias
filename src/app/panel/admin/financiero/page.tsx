import { Wallet, TrendingUp, TrendingDown, Plus, Trash2, Percent } from "lucide-react";
import { requireRole, ROLES, APPOINTMENT_STATUS } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { formatCOP } from "@/lib/utils";
import { StatCard } from "@/components/panel/StatCard";
import { addExpense, deleteExpense } from "./actions";

const input = "w-full rounded-lg border border-line bg-surface/50 px-3 py-2 text-sm text-cloud focus:border-morado/60 focus:outline-none";

export default async function FinancieroPage() {
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  const [completed, expenses, locations] = await Promise.all([
    prisma.appointment.findMany({ where: { tenantId: session.tenantId, status: APPOINTMENT_STATUS.COMPLETED }, include: { barber: true } }),
    prisma.expense.findMany({ where: { tenantId: session.tenantId }, include: { location: true }, orderBy: { date: "desc" } }),
    prisma.location.findMany({ where: { tenantId: session.tenantId, active: true } }),
  ]);

  const income = completed.reduce((a, c) => a + c.priceCents, 0);
  const commissions = completed.reduce((a, c) => a + Math.round((c.priceCents * c.barber.commissionPct) / 100), 0);
  const expenseTotal = expenses.reduce((a, e) => a + e.amountCents, 0);
  const net = income - expenseTotal - commissions;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white"><Wallet className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Financiero</h1>
          <p className="text-sm text-mist">Caja: ingresos, comisiones y gastos.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Ingresos" value={formatCOP(income / 100)} accent="naranja" />
        <StatCard icon={Percent} label="Comisiones" value={formatCOP(commissions / 100)} />
        <StatCard icon={TrendingDown} label="Gastos" value={formatCOP(expenseTotal / 100)} />
        <StatCard icon={Wallet} label="Utilidad neta" value={formatCOP(net / 100)} accent="naranja" hint="Ingresos − comisiones − gastos" />
      </div>

      {/* Registrar gasto */}
      <form action={addExpense} className="card-premium mt-8 grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <input name="concept" required placeholder="Concepto del gasto" className={input} />
        <input name="category" placeholder="Categoría" className={input} />
        <input name="amount" type="number" min="0" step="1000" required placeholder="Monto $" className={input} />
        <select name="locationId" className={input} defaultValue="">
          <option value="">Todas las sedes</option>
          {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-morado to-naranja px-4 py-2 text-sm font-medium text-white sm:col-span-2 lg:col-span-4"><Plus className="h-4 w-4" /> Registrar gasto</button>
      </form>

      {/* Lista de gastos */}
      <h2 className="mt-8 font-display text-lg font-semibold text-cloud">Gastos registrados</h2>
      <div className="mt-3 space-y-2">
        {expenses.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface/30 px-4 py-6 text-center text-sm text-mist">Sin gastos registrados.</p>
        ) : expenses.map((e) => (
          <div key={e.id} className="card-premium flex items-center justify-between gap-3 p-4">
            <div className="min-w-0 text-sm">
              <p className="truncate font-medium text-cloud">{e.concept}</p>
              <p className="text-xs text-mist">{e.category ?? "General"} · {e.location?.name ?? "Todas"} · {new Date(e.date).toLocaleDateString("es-CO")}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-red-300">− {formatCOP(e.amountCents / 100)}</span>
              <form action={deleteExpense}>
                <input type="hidden" name="id" value={e.id} />
                <button className="grid h-8 w-8 place-items-center rounded-lg border border-line text-mist hover:border-red-500/40 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
