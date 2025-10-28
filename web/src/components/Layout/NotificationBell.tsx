import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationApi } from '../../services/api';
import './NotificationBell.css';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  metadata?: {
    actionUrl?: string;
    relatedType?: string;
  };
}

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Завантаження сповіщень
  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [user]);

  // Закриття dropdown при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smart Polling: розумне оновлення залежно від активності користувача
  useEffect(() => {
    if (user) {
      let interval: NodeJS.Timeout;
      
      const handleVisibilityChange = () => {
        if (document.hidden) {
          // Користувач не активний (вкладка не видима) - оновлюємо кожні 10 хв
          clearInterval(interval);
          interval = setInterval(loadUnreadCount, 10 * 60 * 1000); // 10 хвилин
        } else {
          // Користувач активний (вкладка видима) - оновлюємо кожні 5 хв
          clearInterval(interval);
          interval = setInterval(loadUnreadCount, 5 * 60 * 1000); // 5 хвилин
          loadUnreadCount(); // Завантажуємо одразу при поверненні
        }
      };

      // Початкове налаштування
      handleVisibilityChange();
      
      // Слухаємо зміни видимості вкладки
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Оновлюємо при фокусі на вкладці
      const handleFocus = () => {
        if (!document.hidden) {
          loadUnreadCount();
        }
      };
      window.addEventListener('focus', handleFocus);
      
      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationApi.getNotifications({ limit: 10 });
      if (response.data?.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Помилка завантаження сповіщень:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      if (response.data?.count !== undefined) {
        const newCount = response.data.count;
        
        // Якщо кількість збільшилася, показуємо push notification
        if (newCount > unreadCount && unreadCount > 0) {
          const newNotifications = notifications.filter(n => !n.isRead);
          if (newNotifications.length > 0) {
            showPushNotification(newNotifications[0]);
          }
        }
        
        setUnreadCount(newCount);
      }
    } catch (error) {
      console.error('Помилка завантаження кількості сповіщень:', error);
    }
  };

  // Push Notifications: запит дозволу та налаштування
  useEffect(() => {
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
      
      // Якщо дозвіл не надано, запитуємо його
      if (Notification.permission === 'default') {
        requestPushPermission();
      }
    }
  }, []);

  // Запит дозволу на push notifications
  const requestPushPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        setPushPermission(permission);
        
        if (permission === 'granted') {
          console.log('Push notifications дозволено!');
        }
      } catch (error) {
        console.error('Помилка запиту push notifications:', error);
      }
    }
  };

  // Показ push notification
  const showPushNotification = (notification: Notification) => {
    if (pushPermission === 'granted' && !document.hasFocus()) {
      const pushNotif = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
        silent: false
      });

      // Обробка кліку на push notification
      pushNotif.onclick = () => {
        window.focus();
        if (notification.metadata?.actionUrl) {
          window.location.href = notification.metadata.actionUrl;
        }
        pushNotif.close();
      };

      // Автоматичне закриття через 10 секунд
      setTimeout(() => pushNotif.close(), 10000);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      
      // Оновлюємо локальний стан
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      // Оновлюємо лічильник
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Помилка позначення сповіщення:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      
      // Оновлюємо локальний стан
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      // Скидаємо лічильник
      setUnreadCount(0);
    } catch (error) {
      console.error('Помилка позначення всіх сповіщень:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      
      // Видаляємо з локального стану
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      // Оновлюємо лічильник якщо сповіщення було непрочитане
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Помилка видалення сповіщення:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Позначаємо як прочитане
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Переходимо за посиланням якщо є
    if (notification.metadata?.actionUrl) {
      window.location.href = notification.metadata.actionUrl;
    }

    // Закриваємо dropdown
    setIsOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_application': return '📝';
      case 'application_status_changed': return '🔄';
      case 'interview_scheduled': return '📅';
      case 'new_message': return '💬';
      case 'system_message': return '🔔';
      default: return '📢';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'щойно';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} год. тому`;
    } else {
      return date.toLocaleDateString('uk-UA');
    }
  };

  if (!user) return null;

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      {/* Кнопка з колокольчиком */}
      <button
        className={`notification-bell-button ${unreadCount > 0 ? 'has-notifications' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Сповіщення"
      >
        <Bell className="notification-bell-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Dropdown з сповіщеннями */}
      {isOpen && (
        <div className="notification-dropdown">
          {/* Заголовок */}
          <div className="notification-header">
            <h3>
              Сповіщення
              {pushPermission === 'granted' && (
                <span className="push-indicator" title="Push сповіщення активні">
                  🔔
                </span>
              )}
            </h3>
            <div className="notification-actions">
              {/* Push Notifications кнопка */}
              {pushPermission === 'default' && (
                <button
                  className="notification-action-btn push-permission-btn"
                  onClick={requestPushPermission}
                  title="Увімкнути push сповіщення"
                >
                  🔔
                </button>
              )}
              {pushPermission === 'granted' && (
                <span className="push-status" title="Push сповіщення увімкнено">
                  ✅
                </span>
              )}
              {unreadCount > 0 && (
                <button
                  className="notification-action-btn"
                  onClick={markAllAsRead}
                  title="Позначити всі як прочитані"
                >
                  <Check size={16} />
                </button>
              )}
              <button
                className="notification-action-btn"
                onClick={() => setIsOpen(false)}
                title="Закрити"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Список сповіщень */}
          <div className="notification-list">
            {isLoading ? (
              <div className="notification-loading">Завантаження...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={24} />
                <p>Немає сповіщень</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''} ${getPriorityColor(notification.priority)}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {formatDate(notification.createdAt)}
                      </span>
                      {notification.priority === 'high' && (
                        <span className="notification-priority">Важливо</span>
                      )}
                      {notification.priority === 'urgent' && (
                        <span className="notification-priority urgent">Терміново</span>
                      )}
                    </div>
                  </div>
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        className="notification-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        title="Позначити як прочитане"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      className="notification-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Видалити"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Футер */}
          {notifications.length > 0 && (
            <div className="notification-footer">
              <button
                className="notification-view-all"
                onClick={() => {
                  // Тут можна додати перехід на сторінку всіх сповіщень
                  setIsOpen(false);
                }}
              >
                Переглянути всі сповіщення
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
