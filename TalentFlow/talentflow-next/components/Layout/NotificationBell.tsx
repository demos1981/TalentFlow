'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="header-action-button"
        title="Сповіщення"
      >
        <Bell className="header-action-icon" />
      </button>
      
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-empty">
            Немає нових сповіщень
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;