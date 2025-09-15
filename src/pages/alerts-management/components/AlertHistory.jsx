import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Select from '../../../components/ui/Select';

const AlertHistory = ({ triggeredAlerts }) => {
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  const filterOptions = [
    { value: 'all', label: 'Все типы' },
    { value: 'price', label: 'Цена' },
    { value: 'percentage', label: 'Процент' },
    { value: 'volume', label: 'Объем' },
    { value: 'technical', label: 'Технические' }
  ];

  const sortOptions = [
    { value: 'desc', label: 'Сначала новые' },
    { value: 'asc', label: 'Сначала старые' }
  ];

  const filteredAlerts = triggeredAlerts?.filter(alert => filterType === 'all' || alert?.alertType === filterType)?.sort((a, b) => {
      const aDate = new Date(a.triggeredAt);
      const bDate = new Date(b.triggeredAt);
      return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    });

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('ru-RU', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAlertTypeIcon = (type) => {
    const icons = {
      price: 'DollarSign',
      percentage: 'Percent',
      volume: 'BarChart3',
      technical: 'TrendingUp',
      custom: 'Code'
    };
    return icons?.[type] || 'Bell';
  };

  const getMarketContext = (alert) => {
    // Mock market context data
    const contexts = [
      "Высокая волатильность",
      "Давление покупателей",
      "Пробитие сопротивления",
      "Скачок объема",
      "Пересечение индикатора",
      "Тест поддержки",
      "Подтверждение пробоя",
      "Сигнал разворота"
    ];
    
    return contexts?.[Math.floor(Math.random() * contexts?.length)];
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">История уведомлений</h3>
          <div className="flex items-center space-x-3">
            <Select
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
              className="w-full sm:w-40"
              aria-label="Filter by alert type"
            />
            <Select
              options={sortOptions}
              value={sortOrder}
              onChange={setSortOrder}
              className="w-full sm:w-40"
              aria-label="Sort by date"
            />
          </div>
        </div>
      </div>
      {/* History List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts?.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredAlerts?.map((alert) => (
              <div key={alert?.id} className="p-4 hover:bg-muted/5">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name={getAlertTypeIcon(alert?.alertType)} size={16} className="text-success" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground text-data truncate">{alert?.symbol}</h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(alert?.triggeredAt)}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      {alert?.alertType === 'price' && `Цена ${alert?.condition} $${alert?.value}`}
                      {alert?.alertType === 'percentage' && `${alert?.condition} на ${alert?.value}%`}
                      {alert?.alertType === 'volume' && `Объем ${alert?.condition}`}
                      {alert?.alertType === 'technical' && alert?.condition?.replace('_', ' ')?.toUpperCase()}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground bg-muted/10 px-2 py-1 rounded truncate">
                        {getMarketContext(alert)}
                      </span>
                      
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {alert?.notifications?.push && (
                          <Icon name="Smartphone" size={12} className="text-muted-foreground" />
                        )}
                        {alert?.notifications?.email && (
                          <Icon name="Mail" size={12} className="text-muted-foreground" />
                        )}
                        {alert?.notifications?.sms && (
                          <Icon name="MessageSquare" size={12} className="text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Нет сработавших уведомлений</h4>
            <p className="text-muted-foreground max-w-xs mx-auto">
              {filterType === 'all' 
                ? "Ваши сработавшие уведомления появятся здесь, как только условия будут выполнены."
                : `Уведомления типа ${filterType} еще не срабатывали.`
              }
            </p>
          </div>
        )}
      </div>
      {/* Footer Stats */}
      {filteredAlerts?.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/5">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="whitespace-nowrap">Всего: {filteredAlerts?.length}</span>
            <span className="whitespace-nowrap">За 24ч: {filteredAlerts?.filter(alert => 
              new Date(alert.triggeredAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
            )?.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertHistory;
