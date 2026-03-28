// Главный компонент приложения SalesDash
import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import type { PageKey } from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import RevenueChart from './components/RevenueChart';
import CategoryChart from './components/CategoryChart';
import TransactionsTable from './components/TransactionsTable';
import TopManagers from './components/TopManagers';
import ClientsPage from './components/ClientsPage';
import ProductsPage from './components/ProductsPage';
import AnalyticsPage from './components/AnalyticsPage';
import SettingsPage from './components/SettingsPage';

const periods = [
  { key: '7d', label: '7 дней' },
  { key: '30d', label: '30 дней' },
  { key: '90d', label: '90 дней' },
  { key: '1y', label: 'Год' },
];

/* Контент дашборда — вынесен для чистоты */
function DashboardContent({ period, setPeriod }: { period: string; setPeriod: (p: string) => void }) {
  return (
    <>
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
    </>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [period, setPeriod] = useState('1y');
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  /* При смене страницы сбрасываем поиск */
  function handlePageChange(page: PageKey) {
    setActivePage(page);
    setSearchQuery('');
  }

  /* Рендер контента в зависимости от activePage */
  function renderPage() {
    switch (activePage) {
      case 'dashboard':
      case 'sales':
        return <DashboardContent period={period} setPeriod={setPeriod} />;
      case 'clients':
        return <ClientsPage searchQuery={searchQuery} />;
      case 'products':
        return <ProductsPage searchQuery={searchQuery} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardContent period={period} setPeriod={setPeriod} />;
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={function () {
          setSidebarCollapsed(function (prev) { return !prev; });
        }}
        activePage={activePage}
        onPageChange={handlePageChange}
      />

      <BottomNav
        activePage={activePage}
        onPageChange={handlePageChange}
      />

      <div className={`main-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header
          activePage={activePage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
