import { useEffect, useMemo, useRef, useState } from 'react';
import { Lightning, X } from '@phosphor-icons/react';
import { CLIENTS, CONVERSION, FUNNEL, PRODUCTS, TXS, categories, delta, kpis, managerRevenue, monthOf, productStats, regionRevenue, series, spark, type Client, type Period, type Tx } from './data';
import { dateFull, dateShort, money, moneyShort, monthShort, num, pct, useT, type Lang } from './i18n';
import { BarList, DataTable, LineChart, Num, SegBar, Spark } from './charts';
import { Card, Delta, StatusChip, TxTable, exportCsv } from './ui';

const CAT_CLS = ['s1', 's2', 's3', 's4', 's5'];
const ptLabel = (d: Date, unit: string, l: Lang) => (unit === 'month' ? monthShort(d, l) : dateShort(d, l));

export function Overview({ period, onClient, live, onExported }: { period: Period; onClient: (c: Client) => void; live: Tx[]; onExported: () => void }) {
  const { t, lang } = useT();
  const k = kpis(period), kp = kpis(period, 1);
  const pts = series(period);
  const labels = pts.map((p) => ptLabel(p.label, p.unit, lang));
  const cats = categories(period).map((c, i) => ({ id: c.id, name: t[c.id], share: c.share, cls: CAT_CLS[i] }));
  const tiles = [
    { key: 'orders' as const, name: t.orders, v: k.orders, p: kp.orders, fmt: (v: number) => num(v, lang) },
    { key: 'clients' as const, name: t.newClients, v: k.clients, p: kp.clients, fmt: (v: number) => num(v, lang) },
    { key: 'check' as const, name: t.check, v: k.check, p: kp.check, fmt: (v: number) => money(v, lang) },
  ];
  const fmtP = (v: number) => pct(v, lang, false);
  return (
    <div className="grid g-overview">
      <Card className="hero-tile" delay={0}>
        <div className="kpi-label">{t.revenue}</div>
        <div className="hero-num"><Num value={k.revenue} fmt={(v) => money(v, lang)} /></div>
        <div className="kpi-foot"><Delta v={delta(k.revenue, kp.revenue)} fmt={fmtP} /><span className="muted">{t.vsPrev}</span></div>
        <Spark values={spark('revenue', period)} />
      </Card>
      {tiles.map((x, i) => (
        <Card key={x.key} className="kpi" delay={60 + i * 60}>
          <div className="kpi-label">{x.name}</div>
          <div className="kpi-num"><Num value={x.v} fmt={x.fmt} /></div>
          <div className="kpi-foot"><Delta v={delta(x.v, x.p)} fmt={fmtP} /><span className="muted">{t.vsPrev}</span></div>
          <Spark values={spark(x.key, period)} />
        </Card>
      ))}
      <Card className="c-chart" title={t.revenueDyn} delay={200}
        table={<DataTable head={[t.date, t.current, t.previous]} rows={pts.map((p, i) => [labels[i], money(p.value, lang), money(p.prev, lang)])} />}>
        <LineChart labels={labels} fmtY={(v) => moneyShort(v, lang)} fmtTip={(v) => money(v, lang)} height={300}
          series={[{ key: 'cur', name: t.current, values: pts.map((p) => p.value), cls: 's1', area: true }, { key: 'prev', name: t.previous, values: pts.map((p) => p.prev), cls: 'muted-line' }]} />
      </Card>
      <Card className="c-cats" title={t.categories} delay={260}
        table={<DataTable head={[t.product, '%', t.revenue]} rows={cats.map((c) => [c.name, pct(c.share, lang, false), money(c.share * k.revenue, lang)])} />}>
        <SegBar items={cats} fmt={(v) => `${Math.round(v * 100)}%`} />
        <ul className="cat-list">
          {cats.map((c) => <li key={c.id}><i className={`key-box ${c.cls}`} /><span>{c.name}</span><b>{moneyShort(c.share * k.revenue, lang)}</b></li>)}
        </ul>
      </Card>
      <Card className="c-live" title={t.live} sub={<span className="live-badge"><i />{t.liveOn}</span>} delay={320}>
        <LiveFeed items={live} onClient={onClient} />
      </Card>
      <Card className="c-table" title={t.txs} delay={380}>
        <TxTable rows={TXS} onClient={onClient} onExport={() => { exportCsv(TXS, t); onExported(); }} />
      </Card>
    </div>
  );
}

function LiveFeed({ items, onClient }: { items: Tx[]; onClient: (c: Client) => void }) {
  const { lang } = useT();
  return (
    <ul className="live">
      {items.slice(0, 6).map((x, i) => (
        <li key={x.id} className={i === 0 ? 'is-new' : ''}>
          <span className="live-ic"><Lightning size={14} weight="fill" /></span>
          <div className="live-main"><button type="button" className="link" onClick={() => onClient(x.client)}>{x.client.name}</button><span className="muted">{x.product.name}</span></div>
          <b className="live-sum">+{moneyShort(x.amount, lang)}</b>
        </li>
      ))}
    </ul>
  );
}

export function Sales({ onClient, onExported, compact }: { onClient: (c: Client) => void; onExported: () => void; compact: boolean }) {
  const { t } = useT();
  return (
    <div className="grid g-one">
      <Card title={t.txs}><TxTable rows={TXS} pageSize={14} compact={compact} onClient={onClient} onExport={() => { exportCsv(TXS, t); onExported(); }} /></Card>
    </div>
  );
}

export function Clients({ onClient, compact }: { onClient: (c: Client) => void; compact: boolean }) {
  const { t, lang } = useT();
  const [q, setQ] = useState('');
  const list = useMemo(() => CLIENTS.filter((c) => `${c.name} ${c.company} ${c.email}`.toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => b.total - a.total), [q]);
  return (
    <div className="grid g-one">
      <Card title={t.clients} actions={<label className="field sm"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.clientSearch} aria-label={t.clientSearch} /></label>}>
        <div className={`table-scroll ${compact ? 'is-compact' : ''}`}>
          <table className="tx clients">
            <thead><tr><th>{t.client}</th><th>{t.company}</th><th>{t.manager}</th><th className="c-num">{t.totalPaid}</th><th>{t.monthly}</th><th>{t.lastActivity}</th></tr></thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="row-btn" tabIndex={0} onClick={() => onClient(c)} onKeyDown={(e) => e.key === 'Enter' && onClient(c)}>
                  <td><span className="ava">{c.name.split(' ').map((w) => w[0]).join('')}</span><b>{c.name}</b><div className="muted">{c.email}</div></td>
                  <td>{c.company}</td><td>{c.manager}</td><td className="c-num">{money(c.total, lang)}</td>
                  <td className="c-spark"><Spark values={c.monthly} /></td><td>{dateFull(c.last, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!list.length && <div className="empty"><p>{t.nothing}</p></div>}
        </div>
      </Card>
    </div>
  );
}

export function ClientDrawer({ c, onClose }: { c: Client | null; onClose: () => void }) {
  const { t, lang } = useT();
  const [shown, setShown] = useState<Client | null>(c);
  const [state, setState] = useState<'open' | 'closed'>('closed');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (c) { setShown(c); setState('open'); setTimeout(() => ref.current?.focus(), 30); return; }
    setState('closed'); const tm = setTimeout(() => setShown(null), 260); return () => clearTimeout(tm);
  }, [c]);
  useEffect(() => { if (!c) return; const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [c, onClose]);
  if (!shown) return null;
  const tx = TXS.filter((x) => x.client.id === shown.id).slice(0, 5);
  const labels = shown.monthly.map((_, i) => monthShort(monthOf(i), lang));
  return (
    <div className="drawer-root" data-state={state}>
      <div className="drawer-overlay" onClick={onClose} />
      <div ref={ref} tabIndex={-1} className="drawer" role="dialog" aria-modal="true" aria-labelledby="dr-t">
        <div className="drawer-head">
          <span className="ava lg">{shown.name.split(' ').map((w) => w[0]).join('')}</span>
          <div><h2 id="dr-t">{shown.name}</h2><div className="muted">{shown.company}</div></div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t.close}><X size={18} weight="bold" /></button>
        </div>
        <dl className="drawer-facts">
          <div><dt>{t.totalPaid}</dt><dd>{money(shown.total, lang)}</dd></div>
          <div><dt>{t.deals}</dt><dd>{shown.deals}</dd></div>
          <div><dt>{t.manager}</dt><dd>{shown.manager}</dd></div>
          <div><dt>{t.region}</dt><dd>{shown.region}</dd></div>
          <div className="wide"><dt>{t.email}</dt><dd>{shown.email}</dd></div>
        </dl>
        <h3 className="drawer-h">{t.monthly}</h3>
        <LineChart labels={labels} height={180} fmtY={(v) => moneyShort(v, lang)} fmtTip={(v) => money(v, lang)} series={[{ key: 'm', name: t.monthly, values: shown.monthly, cls: 's1', area: true }]} />
        <h3 className="drawer-h">{t.clientTx}</h3>
        <ul className="drawer-tx">{tx.map((x) => <li key={x.id}><div><b>{x.product.name}</b><span className="muted">{dateFull(x.date, lang)}</span></div><div className="r"><b>{money(x.amount, lang)}</b><StatusChip s={x.status} /></div></li>)}</ul>
      </div>
    </div>
  );
}

export function Products() {
  const { t, lang } = useT();
  const unit = { month: t.perMonth, project: t.perProject, group: t.perGroup };
  const catIdx = ['saas', 'consulting', 'licenses', 'training', 'other'];
  return (
    <div className="grid g-products">
      {PRODUCTS.map((p, i) => {
        const st = productStats(p);
        return (
          <Card key={p.id} className="product" delay={i * 60}>
            <div className="prod-top"><span className="prod-cat"><i className={`key-box ${CAT_CLS[catIdx.indexOf(p.cat)]}`} />{t[p.cat as 'saas']}</span></div>
            <h3 className="prod-name">{p.name}</h3>
            <div className="prod-price">{money(p.price, lang)}<span className="muted">{unit[p.unit]}</span></div>
            <div className="prod-stats"><div><span className="muted">{t.soldCount}</span><b>{st.count}</b></div><div><span className="muted">{t.productRevenue}</span><b>{moneyShort(st.revenue, lang)}</b></div></div>
            <Spark values={st.months.map((v) => v + 1)} cls={CAT_CLS[catIdx.indexOf(p.cat)]} />
          </Card>
        );
      })}
    </div>
  );
}

export function Analytics() {
  const { t, lang } = useT();
  const mgr = managerRevenue().map((m) => ({ id: m.id, name: m.id, v: m.v }));
  const reg = regionRevenue().map((r) => ({ id: r.id, name: r.id, v: r.v }));
  const fun = FUNNEL.map((f, i) => ({ id: f.id, name: t[f.id as 'leads'], v: f.v, sub: i ? ` · ${pct(f.v / FUNNEL[i - 1].v, lang, false)}` : undefined }));
  const months = CONVERSION.map((_, i) => monthShort(monthOf(i), lang));
  return (
    <div className="grid g-analytics">
      <Card title={t.funnel} sub={`% ${t.fromPrev}`} table={<DataTable head={[t.funnel, t.value]} rows={fun.map((f) => [f.name, num(f.v, lang)])} />}>
        <BarList items={fun} fmt={(v) => num(v, lang)} ramp={['o1', 'o2', 'o3', 'o4']} />
      </Card>
      <Card title={t.conv} table={<DataTable head={[t.month, '%']} rows={CONVERSION.map((v, i) => [months[i], v.toFixed(1)])} />}>
        <LineChart labels={months} height={240} fmtY={(v) => `${Math.round(v)}%`} fmtTip={(v) => `${v.toFixed(1)}%`} series={[{ key: 'c', name: t.conv, values: CONVERSION, cls: 's1', area: true }]} endLabel={`${CONVERSION[11]}%`} />
      </Card>
      <Card title={t.topManagers} table={<DataTable head={[t.manager, t.revenue]} rows={mgr.map((m) => [m.name, money(m.v, lang)])} />}>
        <BarList items={mgr} fmt={(v) => moneyShort(v, lang)} />
      </Card>
      <Card title={t.regions} table={<DataTable head={[t.region, t.revenue]} rows={reg.map((r) => [r.name, money(r.v, lang)])} />}>
        <BarList items={reg} fmt={(v) => moneyShort(v, lang)} />
      </Card>
    </div>
  );
}

export function Settings({ theme, setTheme, lang, setLang, notify, setNotify, compact, setCompact }: {
  theme: 'light' | 'dark'; setTheme: (v: 'light' | 'dark', e?: React.MouseEvent) => void; lang: Lang; setLang: (l: Lang) => void; notify: boolean; setNotify: (v: boolean) => void; compact: boolean; setCompact: (v: boolean) => void;
}) {
  const { t } = useT();
  const sw = (on: boolean, set: () => void, label: string) => <button type="button" role="switch" aria-checked={on} aria-label={label} className={`switch ${on ? 'is-on' : ''}`} onClick={set}><span /></button>;
  return (
    <div className="grid g-settings">
      <Card>
        <div className="set-row"><div><b>{t.theme}</b><span className="muted">{t.themeHint}</span></div>
          <div className="segm-mini">{(['light', 'dark'] as const).map((v) => <button key={v} type="button" className={theme === v ? 'is-on' : ''} onClick={(e) => setTheme(v, e)}>{t[v]}</button>)}</div></div>
        <div className="set-row"><div><b>{t.language}</b><span className="muted">{t.languageHint}</span></div>
          <div className="segm-mini">{(['ru', 'en'] as const).map((v) => <button key={v} type="button" className={lang === v ? 'is-on' : ''} onClick={() => setLang(v)}>{v.toUpperCase()}</button>)}</div></div>
        <div className="set-row"><div><b>{t.notifyTitle}</b><span className="muted">{t.notifyHint}</span></div>{sw(notify, () => setNotify(!notify), t.notifyTitle)}</div>
        <div className="set-row"><div><b>{t.density}</b><span className="muted">{t.densityHint}</span></div>{sw(compact, () => setCompact(!compact), t.density)}</div>
      </Card>
    </div>
  );
}
