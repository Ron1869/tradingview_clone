import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AlertStatusIndicator = ({ totalAlerts, activeAlerts, triggeredToday }) => {
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate connection status updates
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Randomly simulate connection issues (5% chance)
      if (Math.random() < 0.05) {
        setConnectionStatus('reconnecting');
        setTimeout(() => setConnectionStatus('connected'), 2000);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'reconnecting': return 'text-warning';
      case 'disconnected': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'reconnecting': return 'RotateCw';
      case 'disconnected': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000);
    
    if (diff < 60) return `${diff}с назад`;
    if (diff < 3600) return `${Math.floor(diff / 60)}м назад`;
    return `${Math.floor(diff / 3600)}ч назад`;
  };

  const stats = [
    {
      label: 'Всего',
      value: totalAlerts,
      icon: 'Bell',
      color: 'text-foreground'
    },
    {
      label: 'Активные',
      value: activeAlerts,
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      label: 'Сегодня',
      value: triggeredToday,
      icon: 'AlertTriangle',
      color: 'text-warning'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Connection Status */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <Icon 
            name={getConnectionIcon()} 
            size={16} 
            className={`${getConnectionColor()} ${connectionStatus === 'reconnecting' ? 'animate-spin' : ''}`} 
          />
          <span className={`text-sm font-medium ${getConnectionColor()}`}>
            {connectionStatus === 'connected' && 'Мониторинг активен'}
            {connectionStatus === 'reconnecting' && 'Переподключение...'}
            {connectionStatus === 'disconnected' && 'Соединение потеряно'}
          </span>
        </div>
        <span className="text-xs text-muted-foreground flex-shrink-0">
          Обновлено {formatLastUpdate()}
        </span>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div className={`text-2xl font-bold ${stat?.color} text-data`}>
              {stat?.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat?.label}
            </div>
          </div>
        ))}
      </div>
      {/* Health Indicator */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Состояние системы</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-success">Работает</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertStatusIndicator;
