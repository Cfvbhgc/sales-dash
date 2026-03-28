// Моковые данные для SalesDash

export interface Transaction {
  id: number;
  date: string;
  client: string;
  product: string;
  amount: number;
  status: 'Завершён' | 'Ожидание' | 'Отменён';
  manager: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface Category {
  name: string;
  value: number;
  color: string;
}

export interface Manager {
  name: string;
  sales: number;
  target: number;
  deals: number;
  color: string;
}

// Менеджеры
export const managers: Manager[] = [
  { name: 'Алексей Петров', sales: 3_250_000, target: 3_500_000, deals: 47, color: '#10b981' },
  { name: 'Мария Соколова', sales: 2_980_000, target: 3_000_000, deals: 42, color: '#8b5cf6' },
  { name: 'Дмитрий Волков', sales: 2_750_000, target: 3_200_000, deals: 38, color: '#f59e0b' },
  { name: 'Елена Козлова', sales: 2_120_000, target: 2_500_000, deals: 31, color: '#f43f5e' },
  { name: 'Артём Морозов', sales: 1_747_500, target: 2_000_000, deals: 25, color: '#06b6d4' },
];

// Русские имена клиентов
const clientNames = [
  'ООО "ТехноСофт"', 'ИП Иванов А.С.', 'АО "ГлобалТрейд"', 'ООО "Вектор"',
  'ЗАО "Прогресс"', 'ООО "Инновация"', 'ИП Сидорова М.В.', 'АО "Меридиан"',
  'ООО "Квантум"', 'ИП Козлов Д.И.', 'АО "СтройМастер"', 'ООО "Альфа Групп"',
  'ИП Новикова Е.П.', 'ООО "Спектр"', 'АО "Титан"', 'ООО "Орион"',
  'ИП Белов К.Р.', 'ООО "Синергия"', 'АО "Горизонт"', 'ООО "Эверест"',
  'ИП Морозова Н.А.', 'ООО "Феникс"', 'АО "Платинум"', 'ООО "Нова"',
  'ИП Кузнецов В.Г.',
];

const products = ['SaaS Подписка Pro', 'Консалтинг Enterprise', 'Лицензия Team'];
const managerNames = managers.map(m => m.name);
// Генерация 55 транзакций за 3 месяца
function generateTransactions(): Transaction[] {
  const result: Transaction[] = [];
  const baseDate = new Date(2026, 0, 1); // январь 2026

  for (let i = 1; i <= 55; i++) {
    const dayOffset = Math.floor(Math.random() * 90);
    const date = new Date(baseDate);
    date.setDate(date.getDate() + dayOffset);

    const statusRoll = Math.random();
    let status: Transaction['status'];
    if (statusRoll < 0.65) status = 'Завершён';
    else if (statusRoll < 0.85) status = 'Ожидание';
    else status = 'Отменён';

    const product = products[i % products.length];
    let amount: number;
    if (product === 'SaaS Подписка Pro') amount = 85_000 + Math.floor(Math.random() * 120_000);
    else if (product === 'Консалтинг Enterprise') amount = 250_000 + Math.floor(Math.random() * 350_000);
    else amount = 150_000 + Math.floor(Math.random() * 200_000);

    result.push({
      id: i,
      date: date.toISOString().slice(0, 10),
      client: clientNames[i % clientNames.length],
      product,
      amount,
      status,
      manager: managerNames[i % managerNames.length],
    });
  }

  return result.sort((a, b) => b.date.localeCompare(a.date));
}

export const transactions: Transaction[] = generateTransactions();

// Ежемесячная выручка за 12 месяцев (апр 2025 — мар 2026)
export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Апр', revenue: 820_000 },
  { month: 'Май', revenue: 950_000 },
  { month: 'Июн', revenue: 1_100_000 },
  { month: 'Июл', revenue: 980_000 },
  { month: 'Авг', revenue: 870_000 },
  { month: 'Сен', revenue: 1_250_000 },
  { month: 'Окт', revenue: 1_380_000 },
  { month: 'Ноя', revenue: 1_150_000 },
  { month: 'Дек', revenue: 1_520_000 },
  { month: 'Янв', revenue: 1_340_000 },
  { month: 'Фев', revenue: 1_180_000 },
  { month: 'Мар', revenue: 1_307_500 },
];

// Категории продаж
export const categories: Category[] = [
  { name: 'SaaS', value: 40, color: '#10b981' },
  { name: 'Консалтинг', value: 25, color: '#8b5cf6' },
  { name: 'Лицензии', value: 20, color: '#f59e0b' },
  { name: 'Обучение', value: 10, color: '#f43f5e' },
  { name: 'Другое', value: 5, color: '#06b6d4' },
];
