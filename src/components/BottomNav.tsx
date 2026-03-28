// Мобильная навигация — fixed bottom tab bar
import React, { useState } from 'react';
import type { PageKey } from './Sidebar';

interface BottomNavProps {
  activePage: PageKey;
  onPageChange: (page: PageKey) => void;
}

function BottomNav({ activePage, onPageChange }: BottomNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  const activeColor = '#10b981';
  const inactiveColor = '#64748b';

  function isActive(key: PageKey) {
    return activePage === key;
  }

  function color(key: PageKey) {
    return isActive(key) ? activeColor : inactiveColor;
  }

  function handleMore() {
    setMoreOpen(function (prev) { return !prev; });
  }

  function handleMoreItem(page: PageKey) {
    setMoreOpen(false);
    onPageChange(page);
  }

  const isMoreActive = activePage === 'settings';

  return (
    <>
      {/* Bottom sheet overlay */}
      {moreOpen && (
        <div
          className="bottom-sheet-overlay"
          onClick={function () { setMoreOpen(false); }}
        />
      )}

      {/* Bottom sheet */}
      {moreOpen && (
        <div className="bottom-sheet">
          <div className="bottom-sheet-handle" />
          <button
            className={`bottom-sheet-item ${activePage === 'settings' ? 'active' : ''}`}
            onClick={function () { handleMoreItem('settings'); }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Настройки</span>
          </button>
          <button
            className="bottom-sheet-item"
            onClick={function () { setMoreOpen(false); }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Профиль</span>
          </button>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="bottom-nav">
        {/* Продажи */}
        <button
          className={`bottom-nav-btn ${isActive('dashboard') || isActive('sales') ? 'active' : ''}`}
          onClick={function () { onPageChange('dashboard'); setMoreOpen(false); }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isActive('dashboard') || isActive('sales') ? activeColor : inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="12" width="4" height="9" rx="1" />
            <rect x="10" y="7" width="4" height="14" rx="1" />
            <rect x="17" y="3" width="4" height="18" rx="1" />
          </svg>
          <span style={{ color: isActive('dashboard') || isActive('sales') ? activeColor : inactiveColor }}>Продажи</span>
        </button>

        {/* Клиенты */}
        <button
          className={`bottom-nav-btn ${isActive('clients') ? 'active' : ''}`}
          onClick={function () { onPageChange('clients'); setMoreOpen(false); }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color('clients')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span style={{ color: color('clients') }}>Клиенты</span>
        </button>

        {/* Продукты */}
        <button
          className={`bottom-nav-btn ${isActive('products') ? 'active' : ''}`}
          onClick={function () { onPageChange('products'); setMoreOpen(false); }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color('products')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.5 9.4l-9-5.19" />
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <span style={{ color: color('products') }}>Продукты</span>
        </button>

        {/* Аналитика */}
        <button
          className={`bottom-nav-btn ${isActive('analytics') ? 'active' : ''}`}
          onClick={function () { onPageChange('analytics'); setMoreOpen(false); }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color('analytics')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span style={{ color: color('analytics') }}>Аналитика</span>
        </button>

        {/* Ещё */}
        <button
          className={`bottom-nav-btn ${isMoreActive ? 'active' : ''}`}
          onClick={handleMore}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isMoreActive ? activeColor : inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
          <span style={{ color: isMoreActive ? activeColor : inactiveColor }}>Ещё</span>
        </button>
      </nav>
    </>
  );
}

export default BottomNav;
