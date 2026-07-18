"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Scissors, Palette, ShoppingBag, RefreshCw, CalendarPlus } from "lucide-react";

const selectClass =
  "w-full rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-cloud " +
  "focus:border-morado/60 focus:outline-none focus:ring-2 focus:ring-morado/30";
const labelClass = "mb-1.5 block text-sm font-medium text-cloud";

const ROSTROS: Record<string, string> = {
  Ovalado: "Tienes un rostro versátil: casi cualquier corte te favorece. Prueba un fade medio o un texturizado.",
  Redondo: "Busca volumen arriba y lados cortos (pompadour o fade alto) para estilizar y alargar el rostro.",
  Cuadrado: "Un fade con textura o un undercut resaltan tu mandíbula. Evita lados muy voluminosos.",
  Alargado: "Mantén poco volumen arriba y algo más de pelo en los lados; un flequillo suave equilibra.",
  Corazón: "Un texturizado con flequillo ligero equilibra la frente. Evita rapados muy marcados.",
};

const CABELLOS: Record<string, { tip: string; productos: string[] }> = {
  Liso: { tip: "Peinado con raya y acabado prolijo.", productos: ["Pomada de fijación media", "Peine de bolsillo"] },
  Ondulado: { tip: "Realza tu movimiento natural sin apelmazar.", productos: ["Crema definidora", "Sea salt spray"] },
  Rizado: { tip: "Cortes que respeten la forma del rizo e hidratación.", productos: ["Crema para rizos", "Aceite hidratante"] },
  Afro: { tip: "Diseño, líneas e hidratación profunda.", productos: ["Manteca hidratante", "Cepillo de cerdas"] },
};

export function AsesoriaForm() {
  const [rostro, setRostro] = useState("");
  const [cabello, setCabello] = useState("");
  const [estilo, setEstilo] = useState("");
  const [frecuente, setFrecuente] = useState("");
  const [result, setResult] = useState<null | { corte: string; cabello: { tip: string; productos: string[] }; nota: string }>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult({
      corte: ROSTROS[rostro] ?? "",
      cabello: CABELLOS[cabello] ?? { tip: "", productos: [] },
      nota:
        frecuente === "Sí"
          ? `Como sales con frecuencia y tu estilo es ${estilo.toLowerCase()}, te recomendamos mantenimiento cada 2–3 semanas.`
          : `Para un estilo ${estilo.toLowerCase()}, un retoque mensual mantiene tu look impecable.`,
    });
  }

  if (result) {
    return (
      <div className="space-y-4">
        <div className="card-premium p-6">
          <div className="flex items-center gap-2 text-morado-light">
            <Scissors className="h-5 w-5" />
            <h3 className="font-display text-lg font-semibold text-cloud">Corte recomendado</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-mist">{result.corte}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 text-naranja-light">
              <Palette className="h-5 w-5" />
              <h3 className="font-display text-lg font-semibold text-cloud">Estilo y cuidado</h3>
            </div>
            <p className="mt-2 text-sm text-mist">{result.cabello.tip}</p>
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 text-morado-light">
              <ShoppingBag className="h-5 w-5" />
              <h3 className="font-display text-lg font-semibold text-cloud">Productos sugeridos</h3>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-mist">
              {result.cabello.productos.map((p) => (
                <li key={p}>· {p}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card-premium p-6">
          <p className="text-sm text-cloud">{result.nota}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/panel/cliente/agendar" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-morado to-naranja px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5">
            <CalendarPlus className="h-4 w-4" /> Agendar con esta recomendación
          </Link>
          <button type="button" onClick={() => setResult(null)} className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-cloud transition-colors hover:border-morado/50">
            <RefreshCw className="h-4 w-4" /> Repetir diagnóstico
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-premium space-y-5 p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Tipo de rostro</label>
          <select required className={selectClass} value={rostro} onChange={(e) => setRostro(e.target.value)}>
            <option value="" disabled>Elige…</option>
            {Object.keys(ROSTROS).map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Tipo de cabello</label>
          <select required className={selectClass} value={cabello} onChange={(e) => setCabello(e.target.value)}>
            <option value="" disabled>Elige…</option>
            {Object.keys(CABELLOS).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Estilo que te identifica</label>
          <select required className={selectClass} value={estilo} onChange={(e) => setEstilo(e.target.value)}>
            <option value="" disabled>Elige…</option>
            {["Clásico", "Moderno", "Urbano", "Elegante"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>¿Sales con frecuencia?</label>
          <select required className={selectClass} value={frecuente} onChange={(e) => setFrecuente(e.target.value)}>
            <option value="" disabled>Elige…</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-morado to-naranja px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-morado/25 transition-all hover:-translate-y-0.5">
        <Sparkles className="h-4 w-4" /> Ver mi recomendación
      </button>
    </form>
  );
}
