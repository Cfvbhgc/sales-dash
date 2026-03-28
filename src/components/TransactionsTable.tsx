// Таблица транзакций с сортировкой, поиском и пагинацией
import React, { useState, useMemo } from 'react';
import { transactions, Transaction } from '../data/mockData';

type SortField = keyof Transaction;
type SortDir = 'asc' | 'desc';

function TransactionsTable() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Обработчик клика по заголовку для сортировки
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(function (prev) {
        return prev === 'asc' ? 'desc' : 'asc';
      });
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  }

  // Фильтрация по поиску
  const filtered = useMemo(function () {
    const q = search.toLowerCase();
    if (!q) return transactions;
    return transactions.filter(function (t) {
      return (
        t.client.toLowerCase().includes(q) ||
        t.product.toLowerCase().includes(q) ||
        t.manager.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
      );
    });
  }, [search]);

  // Сортировка
  const sorted = useMemo(function () {
    return [...filtered].sort(function (a, b) {
      const aVal = a[sortField];
      const bVal = b[sortField];

      let cmp: number;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal), 'ru');
      }

      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  // Пагинация
  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  // Стрелка сортировки
  function sortArrow(field: SortField): string {
    if (sortField !== field) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  }

  // Экспорт CSV
  function handleExport() {
    const header = 'ID,Дата,Клиент,Продукт,Сумма,Статус,Менеджер\n';
    const rows = filtered.map(function (t) {
      return `${t.id},${t.date},"${t.client}","${t.product}",${t.amount},"${t.status}","${t.manager}"`;
    }).join('\n');

    const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  // Класс статуса
  function statusClass(status: string): string {
    switch (status) {
      case 'Завершён': return 'completed';
      case 'Ожидание': return 'pending';
      case 'Отменён': return 'cancelled';
      default: return '';
    }
  }

  // Генерация номеров страниц
  function pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  const columns: { field: SortField; label: string }[] = [
    { field: 'id', label: 'ID' },
    { field: 'date', label: 'Дата' },
    { field: 'client', label: 'Клиент' },
    { field: 'product', label: 'Продукт' },
    { field: 'amount', label: 'Сумма' },
    { field: 'status', label: 'Статус' },
    { field: 'manager', label: 'Менеджер' },
  ];

  return (
    <div className="glass-card">
      <div className="transactions-header">
        <h3 className="chart-title" style={{ margin: 0 }}>
          Транзакции
        </h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            className="transactions-search"
            placeholder="Поиск по клиенту, продукту..."
            value={search}
            onChange={function (e) {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button className="export-btn" onClick={handleExport}>
            📥 Экспорт CSV
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(function (col) {
                return (
                  <th
                    key={col.field}
                    onClick={function () { handleSort(col.field); }}
                    className={sortField === col.field ? 'sorted' : ''}
                  >
                    {col.label}
                    <span className="sort-arrow">{sortArrow(col.field)}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginated.map(function (t) {
              return (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    #{t.id}
                  </td>
                  <td>{t.date}</td>
                  <td>{t.client}</td>
                  <td>{t.product}</td>
                  <td className="amount">₽{t.amount.toLocaleString('ru-RU')}</td>
                  <td>
                    <span className={`status-badge ${statusClass(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{t.manager}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={function () { setPage(function (p) { return p - 1; }); }}
          >
            Назад
          </button>

          {pageNumbers().map(function (n) {
            return (
              <button
                key={n}
                className={`pagination-btn ${n === page ? 'active' : ''}`}
                onClick={function () { setPage(n); }}
              >
                {n}
              </button>
            );
          })}

          <button
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={function () { setPage(function (p) { return p + 1; }); }}
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionsTable;
