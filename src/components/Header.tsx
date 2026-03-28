import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Dashboard</h1>
        <span className="header-subtitle">Sales overview and analytics</span>
      </div>
      <div className="header-right">
        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        <button className="notification-btn">
          <span>🔔</span>
          <span className="notification-badge">3</span>
        </button>
        <div className="user-avatar">
          <span>ИС</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
