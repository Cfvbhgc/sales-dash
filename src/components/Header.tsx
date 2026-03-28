// Верхняя панель с поиском, уведомлениями и профилем
import React, { useState } from 'react';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';

/* Заголовки для каждой страницы */
const pageTitles: Record<string, string> = {
  dashboard: 'Панель управления',
  sales: 'Продажи',
  clients: 'Клиенты',
  products: 'Продукты',
  analytics: 'Аналитика',
  settings: 'Настройки',
};

interface HeaderProps {
  activePage: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

function Header({ activePage, searchQuery, onSearchChange }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{pageTitles[activePage] || 'Панель управления'}</h1>
        <div className="header-search">
          <span className="header-search-icon">{'\u{1F50D}'}</span>
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={function (e) { onSearchChange(e.target.value); }}
          />
        </div>
      </div>

      <div className="header-right">
        {/* Колокольчик */}
        <div style={{ position: 'relative' }}>
          <button
            className="header-bell"
            onClick={function () {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
          >
            {'\u{1F514}'}
            <span className="header-bell-badge" />
          </button>
          <NotificationsDropdown
            open={notifOpen}
            onClose={function () { setNotifOpen(false); }}
          />
        </div>

        {/* Аватар */}
        <div style={{ position: 'relative' }}>
          <div
            className="header-avatar"
            onClick={function () {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
          >
            АВ
          </div>
          <ProfileDropdown
            open={profileOpen}
            onClose={function () { setProfileOpen(false); }}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
