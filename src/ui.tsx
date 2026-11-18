import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown, ArrowUp, ArrowUpRight, Bell, CaretLeft, CaretRight, ChartBar, ChartLineUp, CheckCircle, ClockCountdown, DownloadSimple, Gear,
  MagnifyingGlass, Moon, Package, SquaresFour, Sun, Users, X, XCircle, ArrowCounterClockwise, ChartPieSlice, Table,
} from '@phosphor-icons/react';
import { CLIENTS, PRODUCTS, TXS, type Client, type Status, type Tx } from './data';
import { dateFull, money, useT, type Dict } from './i18n';
import { reduce } from './charts';

export type Page = 'overview' | 'sales' | 'clients' | 'products' | 'analytics' | 'settings';
export const NAV: { id: Page; icon: typeof SquaresFour }[] = [
  { id: 'overview', icon: SquaresFour }, { id: 'sales', icon: ChartLineUp }, { id: 'clients', icon: Users },
  { id: 'products', icon: Package }, { id: 'analytics', icon: ChartPieSlice }, { id: 'settings', icon: Gear },
];

/** Меню слева: плашка активного пункта переезжает, меню сворачивается до значков */
export function Sidebar({ page, go, collapsed, toggle }: { page: Page; go: (p: Page) => void; collapsed: boolean; toggle: () => void }) {
  const { t } = useT();
  const list = useRef<HTMLUListElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = list.current?.querySelector<HTMLElement>(`[data-id="${page}"]`), p = pill.current;
    if (el && p) { p.style.transform = `translateY(${el.offsetTop}px)`; p.style.height = `${el.offsetHeight}px`; }
  }, [page, collapsed]);
  return (
    <aside className={`side ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="brand"><span className="brand-mark">SD</span><span className="brand-name">{t.brand}</span></div>
      <nav aria-label="Разделы">
        <ul ref={list} className="nav">
          <span ref={pill} className="nav-pill" aria-hidden="true" />
          {NAV.map((n) => (
            <li key={n.id} data-id={n.id}>
              <button type="button" className={page === n.id ? 'is-cur' : ''} aria-current={page === n.id ? 'page' : undefined} onClick={() => go(n.id)} title={collapsed ? t[n.id] : undefined}>
                <n.icon size={20} weight={page === n.id ? 'fill' : 'regular'} aria-hidden="true" /><span>{t[n.id]}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button type="button" className="side-toggle" onClick={toggle} aria-label={collapsed ? t.expand : t.collapse}>
        {collapsed ? <CaretRight size={16} weight="bold" /> : <CaretLeft size={16} weight="bold" />}
      </button>
    </aside>
  );
}

/** Верхняя панель: поиск (открывает командную строку), уведомления, тема */
export function Topbar({ title, onSearch, theme, onTheme, unread, onBell, bellOpen, children }: {
  title: string; onSearch: () => void; theme: 'light' | 'dark'; onTheme: (e: React.MouseEvent) => void; unread: number; onBell: () => void; bellOpen: boolean; children?: React.ReactNode;
}) {
  const { t } = useT();
  return (
    <header className="top">
      <h1 className="top-title">{title}</h1>
      <button type="button" className="search-btn" onClick={onSearch}>
        <MagnifyingGlass size={18} aria-hidden="true" /><span>{t.searchHint}</span><kbd>⌘K</kbd>
      </button>
      <div className="top-actions">
        <div className="rel">
          <button type="button" className={`icon-btn ${bellOpen ? 'is-on' : ''}`} onClick={onBell} aria-label={t.notifications} aria-expanded={bellOpen}>
            <Bell size={20} weight={bellOpen ? 'fill' : 'regular'} />{unread > 0 && <span className="badge">{unread}</span>}
          </button>
          {children}
        </div>
        <button type="button" className="icon-btn" onClick={onTheme} aria-label={theme === 'dark' ? t.light : t.dark}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <span className="avatar" aria-hidden="true">ИК</span>
      </div>
    </header>
  );
}

/** Сегментный переключатель: выбранная плашка переезжает к пункту */
export function Segmented<T extends string | number>({ value, options, onChange, label }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = box.current?.querySelector<HTMLElement>(`[data-v="${value}"]`), p = pill.current;
    if (el && p) { p.style.transform = `translateX(${el.offsetLeft}px)`; p.style.width = `${el.offsetWidth}px`; }
  });
  return (
    <div ref={box} className="segm" role="radiogroup" aria-label={label}>
      <span ref={pill} className="segm-pill" aria-hidden="true" />
      {options.map((o) => (
        <button key={String(o.v)} data-v={o.v} type="button" role="radio" aria-checked={o.v === value} className={o.v === value ? 'is-on' : ''} onClick={() => onChange(o.v)}>{o.l}</button>
      ))}
    </div>
  );
}

/** Карточка с мягкой подсветкой за курсором; у графиков — переключатель «график / таблица» */
export function Card({ title, sub, children, table, className = '', actions, delay = 0 }: {
  title?: string; sub?: React.ReactNode; children: React.ReactNode; table?: React.ReactNode; className?: string; actions?: React.ReactNode; delay?: number;
}) {
  const { t } = useT();
  const [asTable, setAsTable] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <section ref={ref} className={`card ${className}`} onPointerMove={move} style={{ '--d': `${delay}ms` } as React.CSSProperties}>
      {(title || table || actions) && (
        <div className="card-head">
          <div><h2>{title}</h2>{sub && <div className="card-sub">{sub}</div>}</div>
          <div className="card-actions">
            {actions}
            {table && (
              <button type="button" className="ghost-btn" onClick={() => setAsTable((x) => !x)} aria-pressed={asTable}>
                {asTable ? <ChartBar size={16} /> : <Table size={16} />}<span>{asTable ? t.chart : t.table}</span>
              </button>
            )}
          </div>
        </div>
      )}
      <div className="card-body">{asTable && table ? table : children}</div>
    </section>
  );
}

export function Delta({ v, fmt }: { v: number; fmt: (x: number) => string }) {
  const up = v >= 0;
  return <span className={`delta ${up ? 'up' : 'down'}`}>{up ? <ArrowUp size={12} weight="bold" /> : <ArrowDown size={12} weight="bold" />}{fmt(Math.abs(v))}</span>;
}

const ST: Record<Status, { icon: typeof CheckCircle; cls: string }> = {
  paid: { icon: CheckCircle, cls: 'good' }, pending: { icon: ClockCountdown, cls: 'warning' }, refund: { icon: ArrowCounterClockwise, cls: 'serious' }, canceled: { icon: XCircle, cls: 'critical' },
};
export function StatusChip({ s }: { s: Status }) {
  const { t } = useT();
  const I = ST[s].icon;
  return <span className={`chip ${ST[s].cls}`}><I size={14} weight="fill" aria-hidden="true" />{t[s]}</span>;
}

const hl = (text: string, q: string) => {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
};

type SortKey = 'date' | 'client' | 'product' | 'amount' | 'status' | 'manager';
/** Таблица сделок: поиск с подсветкой, сортировка (строки переезжают на новые места), страницы, экспорт CSV */
export function TxTable({ rows, pageSize = 8, compact, onClient, onExport }: { rows: Tx[]; pageSize?: number; compact?: boolean; onClient?: (c: Client) => void; onExport?: () => void }) {
  const { t, lang } = useT();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<{ k: SortKey; dir: 1 | -1 }>({ k: 'date', dir: -1 });
  const [page, setPage] = useState(0);
  const body = useRef<HTMLTableSectionElement>(null);
  const prevPos = useRef(new Map<string, number>());
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const f = s ? rows.filter((r) => `${r.client.name} ${r.client.company} ${r.product.name} ${r.manager}`.toLowerCase().includes(s)) : rows;
    const val = (r: Tx) => (sort.k === 'date' ? r.date.getTime() : sort.k === 'amount' ? r.amount : sort.k === 'client' ? r.client.name : sort.k === 'product' ? r.product.name : sort.k === 'status' ? r.status : r.manager);
    return [...f].sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * sort.dir);
  }, [rows, q, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const cur = Math.min(page, pages - 1);
  const view = filtered.slice(cur * pageSize, (cur + 1) * pageSize);
  // FLIP: строки, оставшиеся на странице после сортировки, переезжают на новые места
  useLayoutEffect(() => {
    const tb = body.current; if (!tb) return;
    const next = new Map<string, number>();
    tb.querySelectorAll<HTMLTableRowElement>('tr[data-id]').forEach((tr) => {
      const id = tr.dataset.id!, top = tr.offsetTop; next.set(id, top);
      const was = prevPos.current.get(id);
      if (!reduce()) {
        if (was !== undefined && was !== top) tr.animate([{ transform: `translateY(${was - top}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
        else if (was === undefined) tr.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'ease-out' });
      }
    });
    prevPos.current = next;
  }, [view.map((r) => r.id).join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
  const th = (k: SortKey, label: string, cls = '') => (
    <th className={cls} aria-sort={sort.k === k ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={() => setSort((s) => ({ k, dir: s.k === k ? ((-s.dir) as 1 | -1) : k === 'date' || k === 'amount' ? -1 : 1 }))} aria-label={`${t.sortBy}: ${label}`}>
        {label}{sort.k === k && (sort.dir === 1 ? <ArrowUp size={12} weight="bold" /> : <ArrowDown size={12} weight="bold" />)}
      </button>
    </th>
  );
  return (
    <div className={`txt ${compact ? 'is-compact' : ''}`}>
      <div className="txt-bar">
        <label className="field">
          <MagnifyingGlass size={16} aria-hidden="true" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder={t.txSearch} aria-label={t.txSearch} />
          {q && <button type="button" className="field-x" onClick={() => setQ('')} aria-label={t.resetSearch}><X size={14} weight="bold" /></button>}
        </label>
        {onExport && <button type="button" className="btn" onClick={onExport}><DownloadSimple size={16} weight="bold" />{t.export}</button>}
      </div>
      <div className="table-scroll">
        <table className="tx">
          <thead><tr><th className="c-id">#</th>{th('date', t.date)}{th('client', t.client)}{th('product', t.product)}{th('amount', t.amount, 'c-num')}{th('status', t.status)}{th('manager', t.manager)}</tr></thead>
          <tbody ref={body}>
            {view.map((r) => (
              <tr key={r.id} data-id={r.id}>
                <td className="c-id">{r.id}</td>
                <td className="c-date">{dateFull(r.date, lang)}</td>
                <td>{onClient ? <button type="button" className="link" onClick={() => onClient(r.client)}>{hl(r.client.name, q)}</button> : hl(r.client.name, q)}<div className="muted">{hl(r.client.company, q)}</div></td>
                <td>{hl(r.product.name, q)}</td>
                <td className="c-num">{money(r.amount, lang)}</td>
                <td><StatusChip s={r.status} /></td>
                <td>{hl(r.manager, q)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!view.length && <div className="empty"><MagnifyingGlass size={28} /><p>{t.nothing}</p><button type="button" className="btn" onClick={() => setQ('')}>{t.resetSearch}</button></div>}
      </div>
      <div className="pager">
        <span className="muted">{t.shown} {view.length} {t.of} {filtered.length}</span>
        <div className="pager-btns">
          <button type="button" className="icon-btn sm" disabled={cur === 0} onClick={() => setPage(cur - 1)} aria-label={t.prev}><CaretLeft size={16} weight="bold" /></button>
          {Array.from({ length: pages }, (_, i) => i).filter((i) => Math.abs(i - cur) <= 2 || i === 0 || i === pages - 1).map((i, k, arr) => (
            <span key={i} className="pager-grp">{k > 0 && i - arr[k - 1] > 1 && <span className="muted">…</span>}
              <button type="button" className={`pg ${i === cur ? 'is-on' : ''}`} onClick={() => setPage(i)} aria-current={i === cur ? 'page' : undefined}>{i + 1}</button></span>
          ))}
          <button type="button" className="icon-btn sm" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)} aria-label={t.next}><CaretRight size={16} weight="bold" /></button>
        </div>
      </div>
    </div>
  );
}

export const exportCsv = (rows: Tx[], t: Dict) => {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [[t.date, t.client, t.company, t.product, t.amount, t.status, t.manager].map(esc).join(';'),
    ...rows.map((r) => [r.date.toISOString().slice(0, 10), r.client.name, r.client.company, r.product.name, r.amount, t[r.status], r.manager].map(esc).join(';'))];
  const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'sales-dash-transactions.csv'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

type Hit = { kind: 'page' | 'client' | 'product' | 'tx'; id: string; title: string; sub: string; run: () => void };
/** Командная строка (⌘K): разделы, клиенты, продукты, сделки; стрелки и Enter */
export function CommandPalette({ open, onClose, go, openClient }: { open: boolean; onClose: () => void; go: (p: Page) => void; openClient: (c: Client) => void }) {
  const { t, lang } = useT();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) { setQ(''); setSel(0); } }, [open]);
  const hits = useMemo<Hit[]>(() => {
    const s = q.trim().toLowerCase();
    const pages: Hit[] = NAV.map((n) => ({ kind: 'page', id: n.id, title: t[n.id], sub: t.goTo, run: () => go(n.id) }));
    const clients: Hit[] = CLIENTS.map((c) => ({ kind: 'client', id: c.id, title: c.name, sub: c.company, run: () => openClient(c) }));
    const products: Hit[] = PRODUCTS.map((p) => ({ kind: 'product', id: p.id, title: p.name, sub: money(p.price, lang), run: () => go('products') }));
    const txs: Hit[] = TXS.slice(0, 60).map((x) => ({ kind: 'tx', id: String(x.id), title: `#${x.id} · ${x.client.name}`, sub: `${x.product.name} · ${money(x.amount, lang)}`, run: () => go('sales') }));
    const all = [...pages, ...clients, ...products, ...txs];
    return (s ? all.filter((h) => `${h.title} ${h.sub}`.toLowerCase().includes(s)) : [...pages, ...clients.slice(0, 5)]).slice(0, 9);
  }, [q, t, lang, go, openClient]);
  if (!open) return null;
  const pick = (h: Hit) => { h.run(); onClose(); };
  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((x) => Math.min(hits.length - 1, x + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((x) => Math.max(0, x - 1)); }
    if (e.key === 'Enter' && hits[sel]) pick(hits[sel]);
    if (e.key === 'Escape') onClose();
  };
  const Icon = { page: ArrowUpRight, client: Users, product: Package, tx: ChartLineUp };
  return (
    <div className="cmd-root" role="dialog" aria-modal="true" aria-label={t.search} onKeyDown={key}>
      <div className="cmd-overlay" onClick={onClose} />
      <div className="cmd">
        <label className="cmd-field"><MagnifyingGlass size={20} aria-hidden="true" />
          <input ref={input} autoFocus value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} placeholder={t.searchHint} aria-label={t.search} />
          <kbd>Esc</kbd>
        </label>
        <ul className="cmd-list" role="listbox">
          {hits.map((h, i) => {
            const I = Icon[h.kind];
            return (
              <li key={h.kind + h.id} role="option" aria-selected={i === sel} className={i === sel ? 'is-sel' : ''} onPointerEnter={() => setSel(i)} onClick={() => pick(h)}>
                <span className="cmd-ic"><I size={16} /></span><span className="cmd-t">{h.title}</span><span className="cmd-s">{h.sub}</span>
              </li>
            );
          })}
          {!hits.length && <li className="cmd-empty">{t.nothing}</li>}
        </ul>
        <div className="cmd-foot">{t.cmdHint}</div>
      </div>
    </div>
  );
}

export type Toast = { id: number; title: string; sub: string };
export function Toasts({ items, onClose }: { items: Toast[]; onClose: (id: number) => void }) {
  return (
    <div className="toasts" aria-live="polite">
      {items.map((x) => (
        <div key={x.id} className="toast"><span className="toast-dot" aria-hidden="true" /><div><b>{x.title}</b><span>{x.sub}</span></div>
          <button type="button" className="icon-btn sm" onClick={() => onClose(x.id)} aria-label="×"><X size={14} weight="bold" /></button></div>
      ))}
    </div>
  );
}
