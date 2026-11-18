import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeIO = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const easeOut = (k: number) => 1 - Math.pow(1 - k, 4);

export function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el); setW(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** Плавный переход массива чисел от прошлого значения к новому (числа, точки графика) */
export function useTween(target: number[], ms = 700, ease = easeIO) {
  const [cur, setCur] = useState(target);
  const from = useRef(target);
  const live = useRef(target);
  useEffect(() => {
    if (reduce() || from.current.length !== target.length) { from.current = target; live.current = target; setCur(target); return; }
    const a = live.current.slice(), t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms), e = ease(k);
      const v = target.map((x, i) => a[i] + (x - a[i]) * e);
      live.current = v; setCur(v);
      if (k < 1) raf = requestAnimationFrame(step); else from.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
  return cur;
}

/** Число, которое перетекает к новому значению; при первом показе досчитывается с нуля */
export function Num({ value, fmt, ms = 900 }: { value: number; fmt: (v: number) => string; ms?: number }) {
  const [target, setTarget] = useState(() => (reduce() ? value : 0));
  useEffect(() => { setTarget(value); }, [value]);
  const v = useTween([target], ms, easeOut)[0];
  return <span className="num">{fmt(v)}</span>;
}

/** Монотонная кубическая интерполяция (без выбросов за точки) — для гладкой линии и перехода между разным числом точек */
function monotone(ys: number[]) {
  const n = ys.length;
  if (n < 2) return () => ys[0] ?? 0;
  const d = ys.slice(1).map((y, i) => y - ys[i]);
  const m = ys.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return (x: number) => {
    const u = Math.min(n - 1, Math.max(0, x * (n - 1))), i = Math.min(n - 2, Math.floor(u)), t = u - i, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * m[i + 1];
  };
}
const SAMPLES = 72;
const resample = (ys: number[]) => { const f = monotone(ys); return Array.from({ length: SAMPLES }, (_, k) => f(k / (SAMPLES - 1))); };
const niceMax = (v: number) => { const p = Math.pow(10, Math.floor(Math.log10(Math.max(1, v)))); for (const s of [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (s * p >= v) return s * p; return 10 * p; };

export type Series = { key: string; name: string; values: number[]; cls: string; area?: boolean };
/**
 * Линейный график/область: одна шкала, тонкие линии, перекрестие ищет ближайшую точку, подсказка со всеми рядами.
 * При смене данных линии перетекают (в том числе 7 → 30 точек).
 */
export function LineChart({ series, labels, fmtY, fmtTip, height = 260, showLegend = true, endLabel }: {
  series: Series[]; labels: string[]; fmtY: (v: number) => string; fmtTip: (v: number) => string; height?: number; showLegend?: boolean; endLabel?: string;
}) {
  const [box, w] = useSize<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const n = series[0].values.length;
  const max = niceMax(Math.max(...series.flatMap((s) => s.values)) * 1.08);
  const flat = useTween(series.flatMap((s) => resample(s.values.map((v) => v / max))), 750);
  const tmax = useTween([max], 750)[0];
  const padL = 56, padR = endLabel ? 64 : 16, padT = 14, padB = 30;
  const iw = Math.max(10, w - padL - padR), ih = height - padT - padB;
  const X = (u: number) => padL + u * iw, Y = (r: number) => padT + ih - r * ih;
  const paths = series.map((s, si) => {
    const ys = flat.slice(si * SAMPLES, (si + 1) * SAMPLES).map((r) => (r * max) / tmax);
    const line = ys.map((r, k) => `${k ? 'L' : 'M'}${X(k / (SAMPLES - 1)).toFixed(1)},${Y(r).toFixed(1)}`).join('');
    return { s, line, area: `${line}L${X(1)},${Y(0)}L${X(0)},${Y(0)}Z`, end: Y(ys[SAMPLES - 1]) };
  });
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const lx = labels.length <= 8 ? labels.map((_, i) => i) : Array.from({ length: 6 }, (_, k) => Math.round((k * (labels.length - 1)) / 5));
  const hx = hover === null ? 0 : X(n === 1 ? 0.5 : hover / (n - 1));
  const onMove = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const u = (e.clientX - r.left - padL) / iw;
    setHover(Math.max(0, Math.min(n - 1, Math.round(u * (n - 1)))));
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); setHover((h) => Math.max(0, Math.min(n - 1, (h ?? n - 1) + (e.key === 'ArrowRight' ? 1 : -1)))); }
    if (e.key === 'Escape') setHover(null);
  };
  return (
    <div className="lc">
      {showLegend && series.length > 1 && (
        <div className="legend">{series.map((s) => <span key={s.key}><i className={`key-line ${s.cls}`} />{s.name}</span>)}</div>
      )}
      <div ref={box} className="lc-plot" style={{ height }} tabIndex={0} role="img" aria-label={series.map((s) => s.name).join(', ')}
        onPointerMove={onMove} onPointerLeave={() => setHover(null)} onFocus={() => setHover(n - 1)} onBlur={() => setHover(null)} onKeyDown={onKey}>
        {w > 0 && (
          <svg width={w} height={height}>
            {ticks.map((t) => (
              <g key={t}>
                <line className={t === 0 ? 'axis' : 'grid'} x1={padL} x2={padL + iw} y1={Y(t)} y2={Y(t)} />
                <text className="tick" x={padL - 10} y={Y(t) + 4} textAnchor="end">{fmtY(t * tmax)}</text>
              </g>
            ))}
            {lx.map((i) => <text key={i} className="tick" x={X(n === 1 ? 0.5 : i / (n - 1))} y={height - 8} textAnchor="middle">{labels[i]}</text>)}
            {paths.map(({ s, area }) => s.area && <path key={s.key + 'a'} className={`area ${s.cls}`} d={area} />)}
            {paths.slice().reverse().map(({ s, line }) => <path key={s.key} className={`line ${s.cls}`} d={line} />)}
            {endLabel && <text className="end-label" x={X(1) + 10} y={paths[0].end + 4}>{endLabel}</text>}
            {hover !== null && (
              <g>
                <line className="crosshair" x1={hx} x2={hx} y1={padT} y2={padT + ih} />
                {series.map((s) => <circle key={s.key} className={`dot ${s.cls}`} cx={hx} cy={Y(s.values[hover] / max)} r={5} />)}
              </g>
            )}
          </svg>
        )}
        {hover !== null && w > 0 && (
          <div className="tip" style={{ left: Math.min(Math.max(hx, 90), w - 90), top: 0 }}>
            <div className="tip-h">{labels[hover]}</div>
            {series.map((s) => (
              <div key={s.key} className="tip-r"><i className={`key-line ${s.cls}`} /><b>{fmtTip(s.values[hover])}</b><span>{s.name}</span></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Мини-график показателя: прорисовывается при первом показе, потом перетекает */
export function Spark({ values, cls = 's1' }: { values: number[]; cls?: string }) {
  const path = useRef<SVGPathElement>(null);
  const max = Math.max(...values), min = Math.min(...values);
  const t = useTween(resample(values.map((v) => (v - min) / Math.max(1, max - min))), 700);
  const W = 120, H = 36;
  const d = t.map((r, k) => `${k ? 'L' : 'M'}${((k / (SAMPLES - 1)) * W).toFixed(1)},${(H - 3 - r * (H - 6)).toFixed(1)}`).join('');
  useEffect(() => {
    const p = path.current; if (!p || reduce()) return;
    const L = p.getTotalLength();
    p.animate([{ strokeDasharray: `${L}`, strokeDashoffset: `${L}` }, { strokeDasharray: `${L}`, strokeDashoffset: '0' }], { duration: 1100, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', delay: 250 });
  }, []);
  return <svg className="spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true"><path ref={path} className={`line ${cls}`} d={d} /></svg>;
}

export type Seg = { id: string; name: string; share: number; cls: string };
/** Высокая сегментированная полоса: одно целое на части, доля внутри блока, если помещается; подсказка на каждом блоке */
export function SegBar({ items, fmt }: { items: Seg[]; fmt: (v: number) => string }) {
  const [box, w] = useSize<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const total = items.reduce((s, x) => s + x.share, 0);
  return (
    <div className="segbar-wrap">
      <div ref={box} className="segbar" role="list">
        {items.map((it, i) => {
          const share = it.share / total, px = share * w;
          return (
            <div key={it.id} role="listitem" tabIndex={0} aria-label={`${it.name}: ${fmt(share)}`} className={`seg ${it.cls} ${hover === i ? 'is-hover' : ''}`}
              style={{ flexGrow: share }} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
              {px > 46 && <span>{fmt(share)}</span>}
            </div>
          );
        })}
        {hover !== null && (
          <div className="tip tip-seg">
            <div className="tip-r"><i className={`key-box ${items[hover].cls}`} /><b>{fmt(items[hover].share / total)}</b><span>{items[hover].name}</span></div>
          </div>
        )}
      </div>
      <div className="legend legend-seg">
        {items.map((it) => <span key={it.id}><i className={`key-box ${it.cls}`} />{it.name}{(it.share / total) * w <= 46 ? ` ${fmt(it.share / total)}` : ''}</span>)}
      </div>
    </div>
  );
}

/** Ранжированные горизонтальные столбцы: один цвет, значение у конца, столбец вырастает при появлении */
export function BarList({ items, fmt, cls = 's1', ramp }: { items: { id: string; name: string; v: number; sub?: string }[]; fmt: (v: number) => string; cls?: string; ramp?: string[] }) {
  const max = Math.max(...items.map((x) => x.v));
  const ref = useRef<HTMLUListElement>(null);
  const [shown, setShown] = useState(reduce());
  useEffect(() => {
    const el = ref.current; if (!el || shown) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el); return () => io.disconnect();
  }, [shown]);
  return (
    <ul ref={ref} className="barlist">
      {items.map((it, i) => (
        <li key={it.id} tabIndex={0} title={`${it.name}: ${fmt(it.v)}`}>
          <div className="bl-top"><span className="bl-name">{it.name}</span><span className="bl-v">{fmt(it.v)}{it.sub && <em>{it.sub}</em>}</span></div>
          <div className="bl-track"><div className={`bl-bar ${ramp ? ramp[i] : cls}`} style={{ transform: `scaleX(${shown ? it.v / max : 0})`, transitionDelay: `${i * 70}ms` }} /></div>
        </li>
      ))}
    </ul>
  );
}

/** Таблица значений графика (доступный двойник) */
export function DataTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="dt-wrap"><table className="dt"><thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table></div>
  );
}
