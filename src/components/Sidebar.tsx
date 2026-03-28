// Боковая панель навигации
import React from 'react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: '📊', label: 'Дашборд', active: true },
  { icon: '💰', label: 'Продажи', active: false },
  { icon: '👥', label: 'Клиенты', active: false },
  { icon: '📦', label: 'Продукты', active: false },
  { icon: '📈', label: 'Аналитика', active: false },
  { icon: '⚙️', label: 'Настройки', active: false },
];

function Sidebar({ collapsed, onToggle }: SidebarProps) {
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
              key={item.label}
              className={`sidebar-item ${item.active ? 'active' : ''}`}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="sidebar-toggle" onClick={onToggle}>
        {collapsed ? '▶' : '◀'}
      </button>
    </aside>
  );
}

export default Sidebar;
