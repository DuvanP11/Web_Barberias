/**
 * Tematización del sitio — Barbería.
 *
 * Dos ejes independientes que se guardan en localStorage y se aplican como
 * atributos en <html>:
 *   · `data-theme`  → modo claro / oscuro
 *   · `data-style`  → ESTILO visual completo (premium, clásico, urbano, minimalista)
 *
 * El estilo no cambia solo el color: reescribe tipografías, superficies, radios,
 * tratamiento de tarjetas, fondo y motivos. Todo vive en `globals.css` bajo los
 * selectores [data-style]; los componentes no se tocan.
 */

export type ThemeMode = "dark" | "light";
export type StyleId = "premium" | "clasico" | "urbano" | "minimalista";

export const THEME_STORAGE_KEY = "tpl_theme";
export const STYLE_STORAGE_KEY = "tpl_style";

export const DEFAULT_STYLE: StyleId = "premium";
export const DEFAULT_MODE: ThemeMode = "dark";

/**
 * Catálogo de estilos. `defaultMode` es el modo con el que cada estilo luce
 * mejor (se aplica al elegirlo, aunque el visitante puede cambiarlo después).
 * `swatch` son 3 colores de muestra para el selector.
 */
export const STYLES: {
  id: StyleId;
  label: string;
  desc: string;
  defaultMode: ThemeMode;
  swatch: [string, string, string];
}[] = [
  {
    id: "premium",
    label: "Premium",
    desc: "Lujo, mucho espacio, serif elegante y pocos colores.",
    defaultMode: "dark",
    swatch: ["#0c0c0d", "#c9a227", "#f4f2ee"],
  },
  {
    id: "clasico",
    label: "Clásico",
    desc: "Negro, dorado, madera y cuero. Tipografía vintage.",
    defaultMode: "dark",
    swatch: ["#14100c", "#c9a23a", "#9a4230"],
  },
  {
    id: "urbano",
    label: "Urbano",
    desc: "Neón, colores fuertes y tipografía bold. Público joven.",
    defaultMode: "dark",
    swatch: ["#0a0a0f", "#ff2d7e", "#18d9d9"],
  },
  {
    id: "minimalista",
    label: "Minimalista",
    desc: "Limpio, monocromo y plano. Máximo espacio en blanco.",
    defaultMode: "light",
    swatch: ["#ffffff", "#3f3f46", "#111111"],
  },
];

/** Modo con el que luce mejor cada estilo. */
export function styleDefaultMode(style: StyleId): ThemeMode {
  return STYLES.find((s) => s.id === style)?.defaultMode ?? DEFAULT_MODE;
}

/**
 * Script que corre ANTES de pintar (se inyecta en el <body>) para aplicar el
 * tema guardado y evitar el parpadeo (FOUC). Minúsculo y tolerante a fallos.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('${THEME_STORAGE_KEY}');var s=localStorage.getItem('${STYLE_STORAGE_KEY}');d.dataset.theme=(t==='light'||t==='dark')?t:'${DEFAULT_MODE}';d.dataset.style=s||'${DEFAULT_STYLE}';}catch(e){var d2=document.documentElement;d2.dataset.theme='${DEFAULT_MODE}';d2.dataset.style='${DEFAULT_STYLE}';}})();`;
