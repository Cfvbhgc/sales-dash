// Дропдаун профиля — показывается по клику на аватар
import React from 'react';

interface ProfileDropdownProps {
  open: boolean;
  onClose: () => void;
}

function ProfileDropdown({ open, onClose }: ProfileDropdownProps) {
  if (!open) return null;

  return (
    <>
      {/* Оверлей для закрытия */}
      <div className="dropdown-overlay" onClick={onClose} />
      <div className="dropdown profile-dropdown">
        <div className="profile-info">
          <div className="profile-avatar-large">АВ</div>
          <div className="profile-details">
            <div className="profile-name">Александр Волков</div>
            <div className="profile-role">Руководитель отдела продаж</div>
            <div className="profile-email">volkov@salesdash.ru</div>
          </div>
        </div>
        <div className="profile-divider" />
        <button className="profile-logout" onClick={onClose}>
          🚪 Выйти
        </button>
      </div>
    </>
  );
}

export default ProfileDropdown;
