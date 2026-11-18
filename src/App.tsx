import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { PERIODS, TXS, nextLive, type Client, type Period, type Tx } from './data';
import { DICT, I18n, money, type Lang } from './i18n';
import { CommandPalette, NAV, Segmented, Sidebar, Toasts, Topbar, type Page, type Toast } from './ui';
import { Analytics, ClientDrawer, Clients, Overview, Products, Sales, Settings } from './pages';
import { reduce } from './charts';

const store = { get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } } };
const pageFromHash = (): Page => { const h = window.location.hash.slice(1) as Page; return NAV.some((n) => n.id === h) ? h : 'overview'; };

export function App() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => (store.get('sd-theme') as 'light' | 'dark') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  const [lang, setLangState] = useState<Lang>(() => (store.get('sd-lang') as Lang) || 'ru');
  const [page, setPage] = useState<Page>(pageFromHash);
  const [period, setPeriod] = useState<Period>(30);
  const [collapsed, setCollapsed] = useState(() => store.get('sd-side') === '1');
  const [notify, setNotifyState] = useState(() => store.get('sd-notify') !== '0');
  const [compact, setCompactState] = useState(() => store.get('sd-compact') === '1');
  const [cmd, setCmd] = useState(false);
  const [bell, setBell] = useState(false);
  const [unread, setUnread] = useState(3);
  const [client, setClient] = useState<Client | null>(null);
  const [live, setLive] = useState<Tx[]>(() => TXS.filter((x) => x.status === 'paid').slice(0, 6));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const t = DICT[lang];

  useEffect(() => { document.documentElement.dataset.theme = theme; store.set('sd-theme', theme); }, [theme]);
  useEffect(() => { document.documentElement.lang = lang; store.set('sd-lang', lang); }, [lang]);
  useEffect(() => { store.set('sd-side', collapsed ? '1' : '0'); }, [collapsed]);
  useEffect(() => { store.set('sd-notify', notify ? '1' : '0'); }, [notify]);
  useEffect(() => { store.set('sd-compact', compact ? '1' : '0'); }, [compact]);
  useEffect(() => { document.title = `${t[page]} · SalesDash`; }, [page, t]);

  const go = useCallback((p: Page) => {
    setPage(p); setBell(false);
    if (window.location.hash !== `#${p}`) history.pushState(null, '', `#${p}`);
    document.querySelector('.main')?.scrollTo({ top: 0 }); window.scrollTo({ top: 0 });
  }, []);
  useEffect(() => { const f = () => setPage(pageFromHash()); window.addEventListener('popstate', f); return () => window.removeEventListener('popstate', f); }, []);

  const toast = useCallback((title: string, sub: string) => {
    const id = Date.now() + Math.random();
    setToasts((x) => [{ id, title, sub }, ...x].slice(0, 3));
    setTimeout(() => setToasts((x) => x.filter((y) => y.id !== id)), 4500);
  }, []);

  // живая лента: новая сделка раз в 7 секунд, пока вкладка видна
  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden) return;
      const x = nextLive();
      setLive((l) => [x, ...l].slice(0, 12));
      if (notify) toast(`${t.newDeal} · ${money(x.amount, lang)}`, `${x.client.name}, ${x.product.name}`);
    }, 7000);
    return () => clearInterval(id);
  }, [notify, t, lang, toast]);

  // ⌘K / Ctrl+K / «/» — командная строка
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest('input, textarea');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); setCmd(true); }
    };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);

  /** смена темы круглой волной от кнопки (View Transitions), без них — мгновенно */
  const setTheme = useCallback((v: 'light' | 'dark', e?: React.MouseEvent) => {
    if (v === theme) return;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || reduce()) { setThemeState(v); return; }
    const x = e ? e.clientX : window.innerWidth - 60, y = e ? e.clientY : 30;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const vt = doc.startViewTransition(() => { flushSync(() => setThemeState(v)); });
    vt.ready.then(() => {
      document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 650, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', pseudoElement: '::view-transition-new(root)' });
    });
  }, [theme]);

  const periodOpts = PERIODS.map((p) => ({ v: p, l: t[`p${p}` as 'p7'] }));
  const notifications = [{ t: t.n1, ago: `12 ${t.min}` }, { t: t.n2, ago: `1 ${t.h}` }, { t: t.n3, ago: `3 ${t.h}` }];

  return (
    <I18n.Provider value={{ t, lang }}>
      <div className={`app ${collapsed ? 'side-collapsed' : ''}`}>
        <Sidebar page={page} go={go} collapsed={collapsed} toggle={() => setCollapsed((c) => !c)} />
        <div className="main">
          <Topbar title={t[page]} onSearch={() => setCmd(true)} theme={theme} onTheme={(e) => setTheme(theme === 'dark' ? 'light' : 'dark', e)}
            unread={unread} bellOpen={bell} onBell={() => setBell((b) => !b)}>
            {bell && (
              <div className="pop" role="dialog" aria-label={t.notifications}>
                <div className="pop-head"><b>{t.notifications}</b><button type="button" className="link" onClick={() => setUnread(0)}>{t.markRead}</button></div>
                <ul>{notifications.map((n, i) => <li key={i} className={i < unread ? 'is-unread' : ''}><span className="pop-dot" aria-hidden="true" /><span>{n.t}</span><span className="muted">{n.ago} {t.ago}</span></li>)}</ul>
              </div>
            )}
          </Topbar>
          <div className="content" key={page}>
            {page === 'overview' && (
              <div className="filters">
                <h2 className="page-h">{t.overviewTitle}</h2>
                <Segmented value={period} options={periodOpts} onChange={setPeriod} label={t.overviewTitle} />
              </div>
            )}
            {page === 'overview' && <Overview period={period} onClient={setClient} live={live} onExported={() => toast(t.exported, 'sales-dash-transactions.csv')} />}
            {page === 'sales' && <Sales onClient={setClient} compact={compact} onExported={() => toast(t.exported, 'sales-dash-transactions.csv')} />}
            {page === 'clients' && <Clients onClient={setClient} compact={compact} />}
            {page === 'products' && <Products />}
            {page === 'analytics' && <Analytics />}
            {page === 'settings' && <Settings theme={theme} setTheme={setTheme} lang={lang} setLang={setLangState} notify={notify} setNotify={setNotifyState} compact={compact} setCompact={setCompactState} />}
          </div>
        </div>
        <CommandPalette open={cmd} onClose={() => setCmd(false)} go={go} openClient={setClient} />
        <ClientDrawer c={client} onClose={() => setClient(null)} />
        <Toasts items={toasts} onClose={(id) => setToasts((x) => x.filter((y) => y.id !== id))} />
      </div>
    </I18n.Provider>
  );
}
