import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { transactions, Transaction } from '../data/mockData';
import { exportTransactionsCSV } from '../utils/csvExport';

type SortKey = keyof Transaction;
type SortDir = 'asc' | 'desc';

const TransactionsTable: React.FC = () => {
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [search, setSearch] = useState('');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let data = [...transactions];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(t =>
        t.customer.toLowerCase().includes(q) ||
        t.product.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return data;
  }, [search, sortKey, sortDir]);

  const statusClass = (s: string) => {
    switch (s) {
      case 'Completed': return 'status-completed';
      case 'Pending': return 'status-pending';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <motion.div
      className="transactions-container glass-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="transactions-header">
        <h3 className="section-title">Recent Transactions</h3>
        <div className="transactions-actions">
          <input
            type="text"
            className="table-search"
            placeholder="Filter transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="csv-btn" onClick={() => exportTransactionsCSV(filtered)}>
            ⤓ Export CSV
          </button>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID{arrow('id')}</th>
              <th onClick={() => handleSort('customer')}>Customer{arrow('customer')}</th>
              <th onClick={() => handleSort('product')}>Product{arrow('product')}</th>
              <th onClick={() => handleSort('amount')}>Amount{arrow('amount')}</th>
              <th onClick={() => handleSort('status')}>Status{arrow('status')}</th>
              <th onClick={() => handleSort('date')}>Date{arrow('date')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <td className="cell-id">{t.id}</td>
                <td>{t.customer}</td>
                <td>{t.product}</td>
                <td className="cell-amount">${t.amount.toLocaleString()}</td>
                <td><span className={`status-badge ${statusClass(t.status)}`}>{t.status}</span></td>
                <td className="cell-date">{t.date}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TransactionsTable;
