// Верхняя панель с поиском и профилем
import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Панель управления</h1>
        <div className="header-search">
          <span className="header-search-icon">🔍</span>
          <input type="text" placeholder="Поиск..." />
        </div>
      </div>

      <div className="header-right">
        <button className="header-bell">
          🔔
          <span className="header-bell-badge" />
        </button>
        <div className="header-avatar">АД</div>
      </div>
    </header>
  );
}

export default Header;
