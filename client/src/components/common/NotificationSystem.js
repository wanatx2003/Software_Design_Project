// client/src/components/common/NotificationSystem.js
import React, {
  createContext, useContext, useState, useCallback, useEffect
} from "react";
import "../common/Common.css";

const Ctx = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [{ id, message, type }, ...prev]);
    setTimeout(() => removeNotification(id), 5000);
  }, [removeNotification]);

  // keep supporting CustomEvent("notification", { detail: { message, type } })
  useEffect(() => {
    const handler = (e) => {
      if (e?.detail?.message) addNotification(e.detail.message, e.detail.type);
    };
    window.addEventListener("notification", handler);
    return () => window.removeEventListener("notification", handler);
  }, [addNotification]);

  return (
    <Ctx.Provider value={{ notifications, addNotification, removeNotification }}>
      {/* existing toast stack (uses YOUR css classes) */}
      <div className="notification-container">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`notification notification-${n.type || "info"}`}
          >
            <p>{n.message}</p>
            <button
              className="notification-close"
              onClick={() => removeNotification(n.id)}
              aria-label="Dismiss"
              title="Dismiss"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {children}
    </Ctx.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};

// Bell + dropdown (separate UI; tiny extra css below)
export const NotificationBell = () => {
  const { notifications, removeNotification } = useNotifications();
  const [open, setOpen] = useState(false);
  const unread = notifications.length;

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!e.target.closest?.(".notif-wrapper")) setOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  return (
    <div className="notif-wrapper">
      <button className="notif-bell" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
        <span aria-hidden>🔔</span>
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          {unread === 0 ? (
            <div className="notif-empty">No notifications</div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`notif-row`}>
                <span className={`dot dot-${n.type || "info"}`} />
                <div className="notif-msg">{n.message}</div>
                <button className="notif-x" onClick={() => removeNotification(n.id)}>×</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
