// Боковая панель навигации — с переключением активной страницы
import React from 'react';

export type PageKey = 'dashboard' | 'sales' | 'clients' | 'products' | 'analytics' | 'settings';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activePage: PageKey;
  onPageChange: (page: PageKey) => void;
}

const menuItems: { icon: string; label: string; key: PageKey }[] = [
  { icon: '\u{1F4CA}', label: 'Дашборд', key: 'dashboard' },
  { icon: '\u{1F4B0}', label: 'Продажи', key: 'sales' },
  { icon: '\u{1F465}', label: 'Клиенты', key: 'clients' },
  { icon: '\u{1F4E6}', label: 'Продукты', key: 'products' },
  { icon: '\u{1F4C8}', label: 'Аналитика', key: 'analytics' },
  { icon: '\u2699\uFE0F', label: 'Настройки', key: 'settings' },
];

function Sidebar({ collapsed, onToggle, activePage, onPageChange }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">SD</div>
        <span className="sidebar-logo-text">SalesDash</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(function (item) {
          return (
            <button
              key={item.key}
              className={`sidebar-item ${activePage === item.key ? 'active' : ''}`}
              onClick={function () { onPageChange(item.key); }}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="sidebar-toggle" onClick={onToggle}>
        {collapsed ? '\u25B6' : '\u25C0'}
      </button>
    </aside>
  );
}

export default Sidebar;
