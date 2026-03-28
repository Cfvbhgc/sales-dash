import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import RevenueChart from './components/RevenueChart';
import CategoryChart from './components/CategoryChart';
import TransactionsTable from './components/TransactionsTable';
import TopManagers from './components/TopManagers';
import { statsData } from './data/mockData';
import './App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState(statsData);

  const randomUpdate = useCallback(() => {
    setStats(prev => {
      const next = [...prev];
      const idx = Math.floor(Math.random() * next.length);
      const item = { ...next[idx] };
      const delta = (Math.random() - 0.5) * 0.02 * item.value;
      item.value = Math.round((item.value + delta) * 100) / 100;
      item.change = Math.round((item.change + (Math.random() - 0.5) * 0.5) * 10) / 10;
      next[idx] = item;
      return next;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(randomUpdate, 8000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [randomUpdate]);

  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
      <main className="main-content">
        <Header />
        <div className="dashboard-content">
          <div className="stats-row">
            {stats.map((s, i) => (
              <StatsCard key={s.label} {...s} index={i} />
            ))}
          </div>
          <div className="charts-row">
            <RevenueChart />
            <CategoryChart />
          </div>
          <div className="bottom-row">
            <TransactionsTable />
            <TopManagers />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
