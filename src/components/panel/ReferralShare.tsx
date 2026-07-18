"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94Z" />
    </svg>
  );
}

export function ReferralShare({ code, url }: { code: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const message = `¡Te invito a Barbería Imperio! Regístrate con mi código ${code} y ambos ganamos beneficios: ${url}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignora */
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={url}
          className="w-full rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-cloud"
        />
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-cloud transition-colors hover:border-morado/50"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
        >
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
        >
          <FacebookIcon className="h-4 w-4" /> Facebook
        </a>
      </div>
    </div>
  );
}
