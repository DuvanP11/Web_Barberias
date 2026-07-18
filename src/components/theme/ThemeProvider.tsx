"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_MODE,
  DEFAULT_STYLE,
  STYLE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  styleDefaultMode,
  type StyleId,
  type ThemeMode,
} from "@/lib/theme";

interface ThemeContextValue {
  mode: ThemeMode;
  style: StyleId;
  hydrated: boolean;
  setMode: (m: ThemeMode) => void;
  toggleMode: () => void;
  setStyle: (s: StyleId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* modo privado: se ignora */
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);
  const [style, setStyleState] = useState<StyleId>(DEFAULT_STYLE);
  const [hydrated, setHydrated] = useState(false);

  // Sincroniza el estado de React con lo que el script previo ya aplicó al DOM.
  useEffect(() => {
    const d = document.documentElement;
    const t = d.dataset.theme;
    const s = d.dataset.style;
    if (t === "light" || t === "dark") setModeState(t);
    if (s) setStyleState(s as StyleId);
    setHydrated(true);
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    document.documentElement.dataset.theme = m;
    persist(THEME_STORAGE_KEY, m);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      persist(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Al elegir un estilo se aplica también su modo recomendado (el visitante
  // puede cambiarlo luego con el interruptor claro/oscuro).
  const setStyle = useCallback((s: StyleId) => {
    setStyleState(s);
    document.documentElement.dataset.style = s;
    persist(STYLE_STORAGE_KEY, s);

    const m = styleDefaultMode(s);
    setModeState(m);
    document.documentElement.dataset.theme = m;
    persist(THEME_STORAGE_KEY, m);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, style, hydrated, setMode, toggleMode, setStyle }),
    [mode, style, hydrated, setMode, toggleMode, setStyle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}
