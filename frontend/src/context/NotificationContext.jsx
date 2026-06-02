import React, { createContext, useContext, useState, useCallback } from "react";
import "./NotificationContext.css";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = "success", duration = 3000) => {
    // Clear any existing toast quickly before setting a new one
    setToast(null);
    setTimeout(() => {
      setToast({ message, type, duration });
    }, 10);
    
    setTimeout(() => {
      setToast((current) => {
        if (current && current.message === message) {
          return null;
        }
        return current;
      });
    }, duration + 500); // 500ms grace period for exit animation
  }, []);

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      {toast && (
        <div className="apple-toast-overlay">
          <div className="apple-toast-container" key={toast.message}>
            <div className={`apple-toast-content type-${toast.type}`}>
              {toast.type === "success" && <i className="ri-checkbox-circle-fill icon-success"></i>}
              {toast.type === "error" && <i className="ri-error-warning-fill icon-error"></i>}
              {toast.type === "info" && <i className="ri-information-fill icon-info"></i>}
              <span className="apple-toast-text">{toast.message}</span>
            </div>
            
            {/* The expanding shadow timer layer */}
            <div 
              className="apple-toast-timer" 
              style={{ animationDuration: `${toast.duration}ms` }}
            ></div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
