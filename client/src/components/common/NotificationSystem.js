import React, { useState, useEffect, createContext, useContext } from 'react';
import './Common.css';

// Create a context for notifications
const NotificationContext = createContext();

// Provider component that wraps the app
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [bellNotifications, setBellNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (event) => {
      const { message, type = 'info', duration = 5000 } = event.detail;
      const id = Date.now() + Math.random();
      
      const notification = {
        id,
        message,
        type,
        duration,
        timestamp: new Date()
      };

      setNotifications(prev => [...prev, notification]);

      // Auto remove notification after duration
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    };

    const handleBellNotification = (event) => {
      const { message, type = 'info', eventName = '', eventId = null } = event.detail;
      const id = Date.now() + Math.random();
      
      const notification = {
        id,
        message,
        type,
        eventName,
        eventId,
        timestamp: new Date(),
        isRead: false
      };

      setBellNotifications(prev => [notification, ...prev]);
    };

    window.addEventListener('notification', handleNotification);
    window.addEventListener('bellNotification', handleBellNotification);

    // Load initial notifications
    loadInitialNotifications();

    return () => {
      window.removeEventListener('notification', handleNotification);
      window.removeEventListener('bellNotification', handleBellNotification);
    };
  }, []);

  const loadInitialNotifications = () => {
    // Sample initial notifications
    const initialNotifications = [
      {
        id: 1,
        message: "You have been matched to 'Community Health Fair' event",
        type: 'assignment',
        eventName: 'Community Health Fair',
        eventId: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false
      },
      {
        id: 2,
        message: "Event 'Food Drive' has been updated - new location",
        type: 'update',
        eventName: 'Food Drive',
        eventId: '2',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: false
      },
      {
        id: 3,
        message: "Reminder: 'Technology Workshop' is happening tomorrow",
        type: 'reminder',
        eventName: 'Technology Workshop',
        eventId: '3',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: true
      }
    ];
    setBellNotifications(initialNotifications);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAsRead = (id) => {
    setBellNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setBellNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const clearNotification = (id) => {
    setBellNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setBellNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      bellNotifications,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAllNotifications
    }}>
      {children}
      <NotificationSystem notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
};

// Export a hook to use notifications
export const useNotifications = () => useContext(NotificationContext);

// Notification Bell Component
export const NotificationBell = () => {
  const { bellNotifications, markAsRead, markAllAsRead, clearNotification, clearAllNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = bellNotifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return '🎯';
      case 'update':
        return '📝';
      case 'reminder':
        return '⏰';
      default:
        return '📢';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="notification-bell">
      <button 
        className="bell-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {bellNotifications.length > 0 && (
              <div className="notification-actions">
                {unreadCount > 0 && (
                  <button 
                    className="mark-all-read"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
                <button 
                  className="clear-all"
                  onClick={clearAllNotifications}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="notification-list">
            {bellNotifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications</p>
              </div>
            ) : (
              bellNotifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    {notification.eventName && (
                      <p className="event-name">Event: {notification.eventName}</p>
                    )}
                    <span className="notification-time">
                      {getTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  <button 
                    className="notification-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(notification.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Notification display component
const NotificationSystem = ({ notifications, removeNotification }) => {
  // If there are no notifications, don't render anything
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`notification notification-${notification.type}`}
        >
          <p>{notification.message}</p>
          <button 
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// For direct imports of the component
export default NotificationSystem;
