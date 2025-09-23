import React, { useState, useEffect } from 'react';
import './Common.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // This would normally fetch notifications from an API
    // For now, it's just a placeholder
    
    // Set up event listener for new notifications
    const handleNewNotification = (event) => {
      if (event && event.detail) {
        addNotification(event.detail.message, event.detail.type);
      }
    };
    
    // Add event listener
    window.addEventListener('notification', handleNewNotification);
    
    // Clean up
    return () => {
      window.removeEventListener('notification', handleNewNotification);
    };
  }, []);
  
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    
    setNotifications(prev => [
      ...prev, 
      { id, message, type }
    ]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // If there are no notifications, don't render anything
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification notification-${notification.type}`}>
          <p>{notification.message}</p>
          <button 
            onClick={() => removeNotification(notification.id)}
            className="notification-close"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
