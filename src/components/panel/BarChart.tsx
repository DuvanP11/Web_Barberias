/**
 * Gráfico de barras en SVG puro (sin dependencias). Responsive vía viewBox.
 * `data`: etiquetas + valores. `formatValue` opcional para el tooltip/eje.
 */
export function BarChart({
  data,
  height = 220,
  suffix = "",
}: {
  data: { label: string; value: number }[];
  height?: number;
  suffix?: string;
}) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-mist">Sin datos para mostrar.</p>;
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = 100 / data.length;
  const chartH = 100;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 100 ${chartH + 4}`} preserveAspectRatio="none" style={{ width: "100%", height }} role="img">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-morado)" />
            <stop offset="1" stopColor="var(--color-naranja)" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const h = (d.value / max) * chartH;
          const x = i * barW + barW * 0.18;
          const w = barW * 0.64;
          return (
            <g key={i}>
              <rect x={x} y={chartH - h} width={w} height={h} rx="1.2" fill="url(#barGrad)">
                <title>{`${d.label}: ${d.value}${suffix}`}</title>
              </rect>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex" style={{ fontSize: 11 }}>
        {data.map((d, i) => (
          <div key={i} className="truncate px-0.5 text-center text-mist-2" style={{ width: `${barW}%` }} title={d.label}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}
