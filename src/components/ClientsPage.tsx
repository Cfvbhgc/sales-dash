// Страница клиентов — таблица с поиском
import React, { useState } from 'react';

interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  totalPurchases: number;
  lastActivity: string;
}

const clientsData: Client[] = [
  { id: 1, name: 'Иванов Алексей', company: 'ООО Техноком', email: 'ivanov@technocom.ru', totalPurchases: 1250000, lastActivity: '2026-03-27' },
  { id: 2, name: 'Петрова Мария', company: 'АО Сибирь Групп', email: 'petrova@sibirgroup.ru', totalPurchases: 890000, lastActivity: '2026-03-26' },
  { id: 3, name: 'Сидоров Дмитрий', company: 'ИП Сидоров', email: 'sidorov@mail.ru', totalPurchases: 340000, lastActivity: '2026-03-25' },
  { id: 4, name: 'Козлова Елена', company: 'ООО ДатаСофт', email: 'kozlova@datasoft.ru', totalPurchases: 2100000, lastActivity: '2026-03-28' },
  { id: 5, name: 'Морозов Андрей', company: 'ПАО МегаТрейд', email: 'morozov@megatrade.ru', totalPurchases: 780000, lastActivity: '2026-03-24' },
  { id: 6, name: 'Волкова Анна', company: 'ООО ИнноТех', email: 'volkova@innotech.ru', totalPurchases: 1560000, lastActivity: '2026-03-27' },
  { id: 7, name: 'Новиков Сергей', company: 'АО Уральские Системы', email: 'novikov@uralsys.ru', totalPurchases: 450000, lastActivity: '2026-03-22' },
  { id: 8, name: 'Фёдорова Ольга', company: 'ООО КлаудСервис', email: 'fedorova@cloudservice.ru', totalPurchases: 920000, lastActivity: '2026-03-26' },
  { id: 9, name: 'Егоров Максим', company: 'ЗАО Прогресс', email: 'egorov@progress.ru', totalPurchases: 670000, lastActivity: '2026-03-20' },
  { id: 10, name: 'Кузнецова Татьяна', company: 'ООО СмартЛогистик', email: 'kuznetsova@smartlog.ru', totalPurchases: 1890000, lastActivity: '2026-03-28' },
  { id: 11, name: 'Попов Игорь', company: 'АО НефтьСтрой', email: 'popov@neftstroy.ru', totalPurchases: 3200000, lastActivity: '2026-03-25' },
  { id: 12, name: 'Лебедева Наталья', company: 'ООО ФинКонсалт', email: 'lebedeva@finconsult.ru', totalPurchases: 540000, lastActivity: '2026-03-23' },
  { id: 13, name: 'Соколов Артём', company: 'ИП Соколов', email: 'sokolov@bk.ru', totalPurchases: 280000, lastActivity: '2026-03-19' },
  { id: 14, name: 'Михайлова Дарья', company: 'ООО АгроПлюс', email: 'mikhaylova@agroplus.ru', totalPurchases: 1120000, lastActivity: '2026-03-27' },
  { id: 15, name: 'Орлов Владимир', company: 'ПАО ТрансГаз', email: 'orlov@transgaz.ru', totalPurchases: 4500000, lastActivity: '2026-03-28' },
];

/* Форматирование суммы в рубли */
function formatRub(value: number): string {
  return value.toLocaleString('ru-RU') + ' ₽';
}

/* Форматирование даты */
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface ClientsPageProps {
  searchQuery: string;
}

function ClientsPage({ searchQuery }: ClientsPageProps) {
  const [localSearch, setLocalSearch] = useState('');

  /* Объединяем глобальный и локальный поиск */
  const query = (searchQuery || localSearch).toLowerCase();

  const filtered = clientsData.filter(function (c) {
    if (!query) return true;
    return (
      c.name.toLowerCase().includes(query) ||
      c.company.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="page-container animate-in">
      <div className="page-header">
        <h2 className="page-title">Клиенты</h2>
        <input
          type="text"
          className="transactions-search"
          placeholder="Поиск клиентов..."
          value={localSearch}
          onChange={function (e) { setLocalSearch(e.target.value); }}
        />
      </div>

      <div className="glass-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Имя</th>
                <th>Компания</th>
                <th>Email</th>
                <th>Сумма покупок</th>
                <th>Последняя активность</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(function (client, idx) {
                return (
                  <tr key={client.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{client.name}</td>
                    <td>{client.company}</td>
                    <td style={{ color: 'var(--cyan)' }}>{client.email}</td>
                    <td className="amount">{formatRub(client.totalPurchases)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(client.lastActivity)}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Ничего не найдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClientsPage;
