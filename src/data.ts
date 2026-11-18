/**
 * Демо-данные дашборда: генерируются с постоянным зерном, поэтому одинаковы при каждом открытии.
 * 730 дней истории, чтобы у любого периода был прошлый период для сравнения.
 */
let seed = 20261118;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];

export type Period = 7 | 30 | 90 | 365;
export const PERIODS: Period[] = [7, 30, 90, 365];
export type Status = 'paid' | 'pending' | 'refund' | 'canceled';

const DAYS = 730;
const TODAY = new Date(2026, 10, 18);
export const dayDate = (i: number) => new Date(TODAY.getTime() - (DAYS - 1 - i) * 86400000);

// дневные ряды: рост, недельный ритм, сезон, шум
const revenue: number[] = [], orders: number[] = [], newClients: number[] = [];
for (let i = 0; i < DAYS; i++) {
  const d = dayDate(i);
  const trend = 24000 + i * 34;
  const week = [0.86, 1.05, 1.08, 1.07, 1.04, 0.99, 0.88][(d.getDay() + 6) % 7];
  const season = 1 + 0.14 * Math.sin(((d.getMonth() - 9) / 12) * Math.PI * 2); // пик к декабрю
  const o = Math.max(2, Math.round((trend / 6900) * week * season * (0.9 + rnd() * 0.2)));
  orders.push(o);
  revenue.push(Math.round(o * (6600 + rnd() * 900)));
  newClients.push(Math.max(0, Math.round(o * (0.18 + rnd() * 0.12))));
}

const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
const win = (a: number[], p: number, back = 0) => a.slice(DAYS - p * (back + 1), DAYS - p * back);

export type Kpis = { revenue: number; orders: number; clients: number; check: number };
export const kpis = (p: Period, back = 0): Kpis => {
  const r = sum(win(revenue, p, back)), o = sum(win(orders, p, back));
  return { revenue: r, orders: o, clients: sum(win(newClients, p, back)) + Math.round(p * 2.1), check: Math.round(r / Math.max(1, o)) };
};
export const delta = (a: number, b: number) => (b ? (a - b) / b : 0);

/** точки графика: 7 и 30 дней по дням, 90 дней по неделям, год по месяцам */
export type Pt = { label: Date; value: number; prev: number; unit: 'day' | 'week' | 'month' };
export const series = (p: Period): Pt[] => {
  const cur = win(revenue, p), prev = win(revenue, p, 1);
  const step = p === 90 ? 7 : p === 365 ? 30.4 : 1;
  const n = Math.round(p / step), out: Pt[] = [];
  for (let k = 0; k < n; k++) {
    const a = Math.round(k * step), b = Math.round((k + 1) * step);
    out.push({ label: dayDate(DAYS - p + Math.min(b, p) - 1), value: sum(cur.slice(a, b)), prev: sum(prev.slice(a, b)), unit: p === 90 ? 'week' : p === 365 ? 'month' : 'day' });
  }
  return out;
};
/** короткий ряд для мини-графика показателя */
export const spark = (key: keyof Kpis, p: Period) => {
  const n = 14, step = p / n, src = key === 'orders' ? orders : key === 'clients' ? newClients : revenue;
  return Array.from({ length: n }, (_, k) => {
    const a = sum(win(src, p).slice(Math.round(k * step), Math.round((k + 1) * step)));
    if (key !== 'check') return a;
    const o = sum(win(orders, p).slice(Math.round(k * step), Math.round((k + 1) * step)));
    return a / Math.max(1, o);
  });
};

export const CATEGORIES = [
  { id: 'saas', share: 0.41 }, { id: 'consulting', share: 0.24 }, { id: 'licenses', share: 0.19 }, { id: 'training', share: 0.11 }, { id: 'other', share: 0.05 },
] as const;
export const categories = (p: Period) => {
  const tilt = { 7: [0.02, -0.01, 0, -0.01, 0], 30: [0, 0, 0, 0, 0], 90: [-0.01, 0.01, 0.01, -0.01, 0], 365: [-0.02, 0.01, 0.01, 0, 0] }[p];
  return CATEGORIES.map((c, i) => ({ id: c.id, share: c.share + tilt[i] }));
};

export const PRODUCTS = [
  { id: 'p1', name: 'SaaS Подписка Pro', cat: 'saas', price: 15000, unit: 'month' },
  { id: 'p2', name: 'Консалтинг Enterprise', cat: 'consulting', price: 150000, unit: 'project' },
  { id: 'p3', name: 'Лицензия Team', cat: 'licenses', price: 8000, unit: 'month' },
  { id: 'p4', name: 'Обучение Corporate', cat: 'training', price: 45000, unit: 'group' },
  { id: 'p5', name: 'Поддержка Premium', cat: 'saas', price: 25000, unit: 'month' },
  { id: 'p6', name: 'Интеграция API', cat: 'other', price: 60000, unit: 'project' },
] as const;
export type Product = (typeof PRODUCTS)[number];

const FIRST = ['Алексей', 'Мария', 'Дмитрий', 'Елена', 'Андрей', 'Анна', 'Сергей', 'Ольга', 'Максим', 'Татьяна', 'Игорь', 'Наталья', 'Артём', 'Дарья', 'Павел', 'Ксения', 'Роман', 'Юлия', 'Глеб', 'Вера', 'Тимур', 'Лилия', 'Никита', 'Полина'];
const LAST = ['Иванов', 'Петрова', 'Сидоров', 'Козлова', 'Морозов', 'Волкова', 'Новиков', 'Фёдорова', 'Егоров', 'Кузнецова', 'Попов', 'Лебедева', 'Соколов', 'Михайлова', 'Орлов', 'Белова', 'Захаров', 'Гусева', 'Миронов', 'Ершова', 'Сафин', 'Галиева', 'Тарасов', 'Крылова'];
const COMP = ['Технопарк', 'Сибирь Групп', 'Альфа-Строй', 'ДатаСофт', 'МегаТрейд', 'ИнноТех', 'Уральские Системы', 'КлаудСервис', 'Прогресс', 'СмартЛогистик', 'НефтьСтрой', 'ФинКонсалт', 'Вектор', 'АгроПлюс', 'Северный Порт', 'Медиа Линия', 'Гранит', 'ЭкоФуд', 'Ритм', 'Полюс-М', 'Каскад', 'Лидер', 'Горизонт', 'Мост'];
const FORM = ['ООО', 'АО', 'ООО', 'ПАО', 'ООО', 'ИП'];
const TRANSLIT: Record<string, string> = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
const lat = (s: string) => s.toLowerCase().split('').map((c) => TRANSLIT[c] ?? c).join('').replace(/[^a-z]/g, '');

export const MANAGERS = ['Мария Соколова', 'Артём Волков', 'Дмитрий Орлов', 'Елена Козлова', 'Алексей Петров', 'Ксения Белова'];
export const REGIONS = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Новосибирск', 'Казань', 'Уфа'];

export type Client = { id: string; name: string; company: string; email: string; manager: string; region: string; total: number; deals: number; last: Date; monthly: number[] };
export const CLIENTS: Client[] = FIRST.map((f, i) => {
  const last = LAST[i], company = `${FORM[i % FORM.length]} «${COMP[i]}»`;
  const monthly = Array.from({ length: 12 }, () => Math.round((40 + rnd() * 160) * 1000));
  return { id: `c${i + 1}`, name: `${last} ${f}`, company, email: `${lat(last)}@${lat(COMP[i]).slice(0, 10)}.ru`, manager: MANAGERS[i % 6], region: REGIONS[(i * 5) % 6],
    total: sum(monthly), deals: 3 + Math.floor(rnd() * 22), last: dayDate(DAYS - 1 - Math.floor(rnd() * 26)), monthly };
});

export type Tx = { id: number; date: Date; client: Client; product: Product; amount: number; status: Status; manager: string };
export const TXS: Tx[] = Array.from({ length: 160 }, (_, k) => {
  const product = pick([...PRODUCTS]), client = pick(CLIENTS);
  const st = rnd();
  return { id: 3200 - k, date: dayDate(DAYS - 1 - Math.floor(k * 2.2 + rnd() * 2)), client, product,
    amount: Math.round((product.price * (0.6 + rnd() * 1.6)) / 100) * 100, status: (st < 0.74 ? 'paid' : st < 0.88 ? 'pending' : st < 0.95 ? 'refund' : 'canceled') as Status, manager: client.manager };
});

export const productStats = (p: Product) => {
  const tx = TXS.filter((t) => t.product.id === p.id && t.status === 'paid');
  const months = Array.from({ length: 12 }, (_, m) => tx.filter((t) => t.date.getMonth() === (TODAY.getMonth() - 11 + m + 12) % 12).reduce((s, t) => s + t.amount, 0));
  return { count: tx.length, revenue: sum(tx.map((t) => t.amount)), months };
};

export const FUNNEL = [{ id: 'leads', v: 1240 }, { id: 'qualified', v: 642 }, { id: 'proposal', v: 381 }, { id: 'won', v: 178 }];
export const CONVERSION = [8.2, 8.9, 9.6, 9.1, 10.4, 11.2, 10.8, 11.9, 12.6, 12.1, 13.4, 14.2];
export const managerRevenue = () => MANAGERS.map((m) => ({ id: m, v: sum(TXS.filter((t) => t.manager === m && t.status === 'paid').map((t) => t.amount)) })).sort((a, b) => b.v - a.v);
export const regionRevenue = () => REGIONS.map((r) => ({ id: r, v: sum(TXS.filter((t) => t.client.region === r && t.status === 'paid').map((t) => t.amount)) })).sort((a, b) => b.v - a.v);
export const monthOf = (k: number) => new Date(TODAY.getFullYear(), TODAY.getMonth() - 11 + k, 1);

/** живая лента: новые сделки по одной */
let live = 3201;
export const nextLive = (): Tx => {
  const product = pick([...PRODUCTS]), client = pick(CLIENTS);
  return { id: live++, date: new Date(), client, product, amount: Math.round((product.price * (0.7 + rnd())) / 100) * 100, status: 'paid', manager: client.manager };
};
