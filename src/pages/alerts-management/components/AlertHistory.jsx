import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Select from '../../../components/ui/Select';

const AlertHistory = ({ triggeredAlerts }) => {
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  const filterOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'price', label: 'Price Alerts' },
    { value: 'percentage', label: 'Percentage Alerts' },
    { value: 'volume', label: 'Volume Alerts' },
    { value: 'technical', label: 'Technical Alerts' }
  ];

  const sortOptions = [
    { value: 'desc', label: 'Newest First' },
    { value: 'asc', label: 'Oldest First' }
  ];

  const filteredAlerts = triggeredAlerts?.filter(alert => filterType === 'all' || alert?.alertType === filterType)?.sort((a, b) => {
      const aDate = new Date(a.triggeredAt);
      const bDate = new Date(b.triggeredAt);
      return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    });

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
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
      "Market opened with high volatility",
      "Strong buying pressure detected",
      "Breaking resistance level",
      "Volume spike during news event",
      "Technical indicator crossover",
      "Support level tested",
      "Breakout pattern confirmed",
      "Reversal signal detected"
    ];
    
    return contexts?.[Math.floor(Math.random() * contexts?.length)];
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Alert History</h3>
          <div className="flex items-center space-x-3">
            <Select
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
              className="w-40"
            />
            <Select
              options={sortOptions}
              value={sortOrder}
              onChange={setSortOrder}
              className="w-40"
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
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground text-data">{alert?.symbol}</h4>
                      <span className="text-xs text-muted-foreground">{formatDate(alert?.triggeredAt)}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert?.alertType === 'price' && `Price ${alert?.condition} $${alert?.value}`}
                      {alert?.alertType === 'percentage' && `${alert?.condition} by ${alert?.value}%`}
                      {alert?.alertType === 'volume' && `Volume ${alert?.condition}`}
                      {alert?.alertType === 'technical' && alert?.condition?.replace('_', ' ')?.toUpperCase()}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground bg-muted/10 px-2 py-1 rounded">
                        {getMarketContext(alert)}
                      </span>
                      
                      <div className="flex items-center space-x-2">
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
            <h4 className="text-lg font-medium text-foreground mb-2">No triggered alerts</h4>
            <p className="text-muted-foreground">
              {filterType === 'all' 
                ? "Your triggered alerts will appear here once conditions are met."
                : `No ${filterType} alerts have been triggered yet.`
              }
            </p>
          </div>
        )}
      </div>
      {/* Footer Stats */}
      {filteredAlerts?.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total triggered: {filteredAlerts?.length}</span>
            <span>Last 24h: {filteredAlerts?.filter(alert => 
              new Date(alert.triggeredAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
            )?.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertHistory;