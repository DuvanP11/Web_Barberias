"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Imprimir" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-cloud transition-colors hover:border-morado/50 print:hidden"
    >
      <Printer className="h-4 w-4" /> {label}
    </button>
  );
}
