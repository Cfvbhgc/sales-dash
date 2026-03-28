// Страница настроек — переключатели с локальным state
import React, { useState } from 'react';

function SettingsPage() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState<'RU' | 'EN'>('RU');

  return (
    <div className="page-container animate-in">
      <h2 className="page-title">Настройки</h2>

      <div className="settings-list">
        {/* Тема */}
        <div className="glass-card settings-row">
          <div className="settings-info">
            <div className="settings-label">Тёмная тема</div>
            <div className="settings-desc">Переключение между тёмной и светлой темой интерфейса</div>
          </div>
          <button
            className={`toggle-switch ${darkTheme ? 'active' : ''}`}
            onClick={function () { setDarkTheme(!darkTheme); }}
            aria-label="Переключить тему"
          >
            <span className="toggle-knob" />
          </button>
        </div>

        {/* Уведомления */}
        <div className="glass-card settings-row">
          <div className="settings-info">
            <div className="settings-label">Уведомления</div>
            <div className="settings-desc">Push-уведомления о новых заказах и событиях</div>
          </div>
          <button
            className={`toggle-switch ${notifications ? 'active' : ''}`}
            onClick={function () { setNotifications(!notifications); }}
            aria-label="Переключить уведомления"
          >
            <span className="toggle-knob" />
          </button>
        </div>

        {/* Язык */}
        <div className="glass-card settings-row">
          <div className="settings-info">
            <div className="settings-label">Язык интерфейса</div>
            <div className="settings-desc">Выберите язык: Русский или English</div>
          </div>
          <div className="lang-toggle">
            <button
              className={`lang-btn ${language === 'RU' ? 'active' : ''}`}
              onClick={function () { setLanguage('RU'); }}
            >
              RU
            </button>
            <button
              className={`lang-btn ${language === 'EN' ? 'active' : ''}`}
              onClick={function () { setLanguage('EN'); }}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
