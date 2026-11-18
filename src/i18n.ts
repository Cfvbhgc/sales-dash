import { createContext, useContext } from 'react';

export type Lang = 'ru' | 'en';
const RU = {
  brand: 'SalesDash', overview: 'Обзор', sales: 'Продажи', clients: 'Клиенты', products: 'Продукты', analytics: 'Аналитика', settings: 'Настройки',
  overviewTitle: 'Обзор продаж', search: 'Поиск', searchHint: 'Клиенты, продукты, сделки…', export: 'Экспорт CSV', exported: 'Файл скачан',
  p7: '7 дней', p30: '30 дней', p90: '90 дней', p365: 'Год', vsPrev: 'к прошлому периоду',
  revenue: 'Выручка', orders: 'Заказы', newClients: 'Новые клиенты', check: 'Средний чек',
  revenueDyn: 'Динамика выручки', current: 'Текущий период', previous: 'Прошлый период', categories: 'Выручка по категориям',
  saas: 'SaaS', consulting: 'Консалтинг', licenses: 'Лицензии', training: 'Обучение', other: 'Другое',
  live: 'Сделки сейчас', liveOn: 'в эфире', newDeal: 'Новая сделка',
  txs: 'Транзакции', txSearch: 'Поиск по клиенту, продукту, менеджеру', date: 'Дата', client: 'Клиент', product: 'Продукт', amount: 'Сумма', status: 'Статус', manager: 'Менеджер',
  paid: 'Оплачен', pending: 'В обработке', refund: 'Возврат', canceled: 'Отменён', nothing: 'Ничего не нашлось', resetSearch: 'Сбросить поиск',
  prev: 'Назад', next: 'Вперёд', of: 'из', shown: 'показано',
  company: 'Компания', email: 'Почта', totalPaid: 'Сумма покупок', lastActivity: 'Последняя активность', deals: 'Сделок', region: 'Регион', clientSearch: 'Поиск клиента',
  monthly: 'Покупки по месяцам', clientTx: 'Последние сделки', close: 'Закрыть',
  perMonth: '/мес', perProject: '/проект', perGroup: '/группа', soldCount: 'Продано', productRevenue: 'Выручка',
  funnel: 'Воронка продаж', leads: 'Лиды', qualified: 'Квалификация', proposal: 'Предложение', won: 'Сделки', conv: 'Конверсия по месяцам, %',
  topManagers: 'Менеджеры по выручке', regions: 'Продажи по регионам', fromPrev: 'от предыдущего этапа',
  theme: 'Тема оформления', themeHint: 'Светлая или тёмная', light: 'Светлая', dark: 'Тёмная', language: 'Язык интерфейса', languageHint: 'Русский или English',
  notifyTitle: 'Уведомления', notifyHint: 'Показывать новые сделки во всплывающих сообщениях', density: 'Плотная таблица', densityHint: 'Меньше отступов в строках',
  notifications: 'Уведомления', markRead: 'Прочитать все', table: 'Таблица', chart: 'График', week: 'Неделя', month: 'Месяц', value: 'Значение',
  collapse: 'Свернуть меню', expand: 'Развернуть меню', cmdHint: 'стрелки для выбора, Enter открыть', goTo: 'Перейти', sortBy: 'Сортировать по',
  n1: 'Крупная сделка: Консалтинг Enterprise', n2: 'Выручка за неделю выше плана на 12%', n3: 'Новый клиент: АО «Каскад»', ago: 'назад', min: 'мин', h: 'ч',
};
const EN: typeof RU = {
  brand: 'SalesDash', overview: 'Overview', sales: 'Sales', clients: 'Clients', products: 'Products', analytics: 'Analytics', settings: 'Settings',
  overviewTitle: 'Sales overview', search: 'Search', searchHint: 'Clients, products, deals…', export: 'Export CSV', exported: 'File downloaded',
  p7: '7 days', p30: '30 days', p90: '90 days', p365: 'Year', vsPrev: 'vs previous period',
  revenue: 'Revenue', orders: 'Orders', newClients: 'New clients', check: 'Average order',
  revenueDyn: 'Revenue trend', current: 'This period', previous: 'Previous period', categories: 'Revenue by category',
  saas: 'SaaS', consulting: 'Consulting', licenses: 'Licenses', training: 'Training', other: 'Other',
  live: 'Live deals', liveOn: 'live', newDeal: 'New deal',
  txs: 'Transactions', txSearch: 'Search client, product, manager', date: 'Date', client: 'Client', product: 'Product', amount: 'Amount', status: 'Status', manager: 'Manager',
  paid: 'Paid', pending: 'Pending', refund: 'Refund', canceled: 'Canceled', nothing: 'Nothing found', resetSearch: 'Clear search',
  prev: 'Back', next: 'Next', of: 'of', shown: 'shown',
  company: 'Company', email: 'Email', totalPaid: 'Total spent', lastActivity: 'Last activity', deals: 'Deals', region: 'Region', clientSearch: 'Find a client',
  monthly: 'Purchases by month', clientTx: 'Recent deals', close: 'Close',
  perMonth: '/mo', perProject: '/project', perGroup: '/group', soldCount: 'Sold', productRevenue: 'Revenue',
  funnel: 'Sales funnel', leads: 'Leads', qualified: 'Qualified', proposal: 'Proposal', won: 'Won', conv: 'Monthly conversion, %',
  topManagers: 'Managers by revenue', regions: 'Sales by region', fromPrev: 'from previous stage',
  theme: 'Theme', themeHint: 'Light or dark', light: 'Light', dark: 'Dark', language: 'Language', languageHint: 'Русский or English',
  notifyTitle: 'Notifications', notifyHint: 'Show new deals as pop-up messages', density: 'Compact table', densityHint: 'Tighter rows',
  notifications: 'Notifications', markRead: 'Mark all read', table: 'Table', chart: 'Chart', week: 'Week', month: 'Month', value: 'Value',
  collapse: 'Collapse menu', expand: 'Expand menu', cmdHint: 'arrows to move, Enter to open', goTo: 'Go to', sortBy: 'Sort by',
  n1: 'Large deal: Enterprise Consulting', n2: 'Weekly revenue 12% above plan', n3: 'New client: Kaskad JSC', ago: 'ago', min: 'min', h: 'h',
};
export const DICT = { ru: RU, en: EN };
export type Dict = typeof RU;
export const I18n = createContext<{ t: Dict; lang: Lang }>({ t: RU, lang: 'ru' });
export const useT = () => useContext(I18n);

const loc = (l: Lang) => (l === 'ru' ? 'ru-RU' : 'en-US');
export const money = (v: number, l: Lang) => `${new Intl.NumberFormat(loc(l), { maximumFractionDigits: 0 }).format(Math.round(v))} ₽`;
export const moneyShort = (v: number, l: Lang) => {
  const a = Math.abs(v);
  const [d, s] = a >= 1e6 ? [1e6, l === 'ru' ? ' млн' : 'M'] : a >= 1e3 ? [1e3, l === 'ru' ? ' тыс' : 'K'] : [1, ''];
  return `${new Intl.NumberFormat(loc(l), { maximumFractionDigits: a >= 1e6 ? 1 : 0 }).format(v / d)}${s} ₽`;
};
export const num = (v: number, l: Lang) => new Intl.NumberFormat(loc(l), { maximumFractionDigits: 0 }).format(Math.round(v));
export const pct = (v: number, l: Lang, sign = true) => `${sign && v > 0 ? '+' : ''}${new Intl.NumberFormat(loc(l), { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(v * 100)}%`;
export const dateShort = (d: Date, l: Lang) => new Intl.DateTimeFormat(loc(l), { day: 'numeric', month: 'short' }).format(d).replace('.', '');
export const dateFull = (d: Date, l: Lang) => new Intl.DateTimeFormat(loc(l), { day: 'numeric', month: 'short', year: 'numeric' }).format(d).replace('.', '');
export const monthShort = (d: Date, l: Lang) => new Intl.DateTimeFormat(loc(l), { month: 'short' }).format(d).replace('.', '');
