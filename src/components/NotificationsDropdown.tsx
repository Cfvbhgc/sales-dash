// Дропдаун уведомлений — показывается по клику на колокольчик
import React from 'react';

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  { id: 1, text: 'Новый заказ от ООО Техноком — ₽45,000', time: '2 мин назад', read: false },
  { id: 2, text: 'Цель Q1 достигнута на 94%', time: '15 мин назад', read: false },
  { id: 3, text: 'Клиент Иванов запросил счёт', time: '1 час назад', read: false },
  { id: 4, text: 'Сделка с АО Сибирь Групп закрыта', time: '2 часа назад', read: true },
  { id: 5, text: 'Новая заявка на Консалтинг Enterprise', time: '3 часа назад', read: true },
  { id: 6, text: 'Менеджер Петрова выполнила план на 110%', time: '5 часов назад', read: true },
  { id: 7, text: 'Обновление тарифов вступает в силу 01.04', time: 'вчера', read: true },
];

interface NotificationsDropdownProps {
  open: boolean;
  onClose: () => void;
}

function NotificationsDropdown({ open, onClose }: NotificationsDropdownProps) {
  if (!open) return null;

  return (
    <>
      {/* Невидимый оверлей для закрытия по клику снаружи */}
      <div className="dropdown-overlay" onClick={onClose} />
      <div className="dropdown notifications-dropdown">
        <div className="dropdown-header">
          <span className="dropdown-title">Уведомления</span>
          <span className="dropdown-badge">{notifications.filter(function (n) { return !n.read; }).length} новых</span>
        </div>
        <div className="dropdown-list">
          {notifications.map(function (n) {
            return (
              <div key={n.id} className={`dropdown-item ${!n.read ? 'unread' : ''}`}>
                <div className="dropdown-item-text">{n.text}</div>
                <div className="dropdown-item-time">{n.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default NotificationsDropdown;
