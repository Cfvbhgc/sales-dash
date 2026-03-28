import { Transaction } from '../data/mockData';

export function exportTransactionsCSV(data: Transaction[]): void {
  const headers = ['ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'];
  const rows = data.map(t => [t.id, t.customer, t.product, t.amount.toString(), t.status, t.date]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'transactions.csv';
  link.click();
  URL.revokeObjectURL(url);
}
