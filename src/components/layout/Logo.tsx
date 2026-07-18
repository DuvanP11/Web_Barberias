import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * LOGO — PLANTILLA.
 *
 * Placa con monograma (iniciales del nombre) + wordmark. Es un marcador de
 * posición neutro: reemplázalo por el logo real del cliente (un SVG propio o un
 * <Image/>) cuando lo tengas. El texto usa `text-cloud`, que se adapta al tema:
 *   · oscuro → letra clara   · claro → letra oscura
 */

/** Toma las iniciales del nombre del negocio (máx. 2 letras). */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "");
  return letters.join("") || "•";
}

function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-2xl bg-gradient-to-br from-morado to-naranja font-display font-bold text-white shadow-lg shadow-morado/30",
        className,
      )}
      aria-hidden="true"
    >
      {initials(siteConfig.name)}
    </span>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [first, ...rest] = siteConfig.name.trim().split(/\s+/);
  const second = rest.join(" ");

  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)} aria-label={siteConfig.name}>
      <BrandMark className="h-10 w-10 shrink-0 text-base transition-transform duration-300 group-hover:scale-105" />

      {!compact && (
        <span className="flex flex-col leading-none text-cloud">
          <span className="text-lg font-extrabold uppercase tracking-[0.02em]">{first}</span>
          {second && (
            <span className="mt-1 text-[13px] font-medium uppercase tracking-[0.40em] text-cloud/85">
              {second}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
