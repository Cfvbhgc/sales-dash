import { subDays, format } from 'date-fns';

export interface Transaction {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  date: string;
}

export interface Manager {
  name: string;
  initials: string;
  sales: number;
  target: number;
  color: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const now = new Date();
function randomDate(): string {
  const d = subDays(now, Math.floor(Math.random() * 90));
  return format(d, 'dd.MM.yyyy');
}

export const statsData = [
  { label: 'Revenue', value: 284350, prefix: '$', suffix: '', change: 12.5 },
  { label: 'Orders', value: 1847, prefix: '', suffix: '', change: 8.2 },
  { label: 'Customers', value: 12493, prefix: '', suffix: '', change: 15.3 },
  { label: 'Avg Order', value: 153.80, prefix: '$', suffix: '', change: -2.1 },
];

export const revenueData: MonthlyRevenue[] = [
  { month: 'Apr', revenue: 18200 },
  { month: 'May', revenue: 21500 },
  { month: 'Jun', revenue: 19800 },
  { month: 'Jul', revenue: 24100 },
  { month: 'Aug', revenue: 22800 },
  { month: 'Sep', revenue: 26500 },
  { month: 'Oct', revenue: 23900 },
  { month: 'Nov', revenue: 28100 },
  { month: 'Dec', revenue: 31200 },
  { month: 'Jan', revenue: 27400 },
  { month: 'Feb', revenue: 29800 },
  { month: 'Mar', revenue: 32500 },
];

export const categoryData: CategoryData[] = [
  { name: 'Electronics', value: 35, color: '#10b981' },
  { name: 'Clothing', value: 25, color: '#8b5cf6' },
  { name: 'Home', value: 20, color: '#3b82f6' },
  { name: 'Sports', value: 12, color: '#f59e0b' },
  { name: 'Other', value: 8, color: '#64748b' },
];

export const transactions: Transaction[] = [
  { id: 'TXN-001', customer: 'Иван Смирнов', product: 'MacBook Pro 14"', amount: 2499, status: 'Completed', date: randomDate() },
  { id: 'TXN-002', customer: 'Анна Кузнецова', product: 'iPhone 15 Pro', amount: 1199, status: 'Completed', date: randomDate() },
  { id: 'TXN-003', customer: 'Сергей Попов', product: 'Sony WH-1000XM5', amount: 349, status: 'Pending', date: randomDate() },
  { id: 'TXN-004', customer: 'Ольга Васильева', product: 'Samsung 65" OLED TV', amount: 1899, status: 'Completed', date: randomDate() },
  { id: 'TXN-005', customer: 'Николай Новиков', product: 'iPad Air', amount: 599, status: 'Cancelled', date: randomDate() },
  { id: 'TXN-006', customer: 'Татьяна Федорова', product: 'Nike Air Max 90', amount: 129, status: 'Completed', date: randomDate() },
  { id: 'TXN-007', customer: 'Андрей Морозов', product: 'Canon EOS R6', amount: 2499, status: 'Pending', date: randomDate() },
  { id: 'TXN-008', customer: 'Екатерина Волкова', product: 'Dyson V15', amount: 749, status: 'Completed', date: randomDate() },
  { id: 'TXN-009', customer: 'Михаил Алексеев', product: 'PS5 Digital', amount: 449, status: 'Completed', date: randomDate() },
  { id: 'TXN-010', customer: 'Наталья Лебедева', product: 'Adidas Ultraboost', amount: 189, status: 'Pending', date: randomDate() },
  { id: 'TXN-011', customer: 'Павел Козлов', product: 'Apple Watch Ultra', amount: 799, status: 'Completed', date: randomDate() },
  { id: 'TXN-012', customer: 'Юлия Егорова', product: 'IKEA Sofa Set', amount: 1299, status: 'Cancelled', date: randomDate() },
  { id: 'TXN-013', customer: 'Виктор Соловьев', product: 'Samsung Galaxy S24', amount: 999, status: 'Completed', date: randomDate() },
  { id: 'TXN-014', customer: 'Светлана Зайцева', product: 'Bose QC45', amount: 279, status: 'Pending', date: randomDate() },
  { id: 'TXN-015', customer: 'Роман Павлов', product: 'Dell XPS 15', amount: 1799, status: 'Completed', date: randomDate() },
];

export const managers: Manager[] = [
  { name: 'Алексей Петров', initials: 'АП', sales: 84200, target: 100000, color: '#10b981' },
  { name: 'Мария Соколова', initials: 'МС', sales: 72500, target: 100000, color: '#8b5cf6' },
  { name: 'Дмитрий Волков', initials: 'ДВ', sales: 65800, target: 100000, color: '#3b82f6' },
  { name: 'Елена Козлова', initials: 'ЕК', sales: 58300, target: 100000, color: '#f59e0b' },
  { name: 'Артём Морозов', initials: 'АМ', sales: 51200, target: 100000, color: '#ef4444' },
];
