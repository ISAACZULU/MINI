import React from 'react';
import { IconlyCheckCircle, IconlyInfo, IconlyAlert } from './Iconly';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <IconlyCheckCircle size={18} color="var(--safety-green)" />;
      case 'warning':
        return <IconlyAlert size={18} color="var(--alert-yellow)" />;
      default:
        return <IconlyInfo size={18} color="var(--primary-blue)" />;
    }
  };

  return (
    <div className="toast-notification">
      {renderIcon()}
      <span>{toast.message}</span>
    </div>
  );
}
