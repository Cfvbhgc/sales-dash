// Главный компонент приложения SalesDash
import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import RevenueChart from './components/RevenueChart';
import CategoryChart from './components/CategoryChart';
import TransactionsTable from './components/TransactionsTable';
import TopManagers from './components/TopManagers';

const periods = [
  { key: '7d', label: '7 дней' },
  { key: '30d', label: '30 дней' },
  { key: '90d', label: '90 дней' },
  { key: '1y', label: 'Год' },
];

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [period, setPeriod] = useState('1y');

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={function () {
          setSidebarCollapsed(function (prev) { return !prev; });
        }}
      />

      <div className={`main-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header />

        <main className="main-content">
          {/* Фильтр периода */}
          <div className="period-filter">
            {periods.map(function (p) {
              return (
                <button
                  key={p.key}
                  className={`period-btn ${period === p.key ? 'active' : ''}`}
                  onClick={function () { setPeriod(p.key); }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Карточки статистики */}
          <StatsCards period={period} />

          {/* Графики */}
          <div className="charts-grid">
            <RevenueChart period={period} />
            <CategoryChart />
          </div>

          {/* Нижняя секция: таблица + менеджеры */}
          <div className="bottom-grid">
            <TransactionsTable />
            <TopManagers />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
