import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const AlertsTable = ({ alerts, onEditAlert, onDeleteAlert, onDuplicateAlert, onBulkDelete }) => {
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAlerts(alerts?.map(alert => alert?.id));
    } else {
      setSelectedAlerts([]);
    }
  };

  const handleSelectAlert = (alertId, checked) => {
    if (checked) {
      setSelectedAlerts(prev => [...prev, alertId]);
    } else {
      setSelectedAlerts(prev => prev?.filter(id => id !== alertId));
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAlerts = [...alerts]?.sort((a, b) => {
    if (sortConfig?.key === 'createdAt') {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      return sortConfig?.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }
    
    if (sortConfig?.key === 'symbol') {
      return sortConfig?.direction === 'asc' 
        ? a?.symbol?.localeCompare(b?.symbol)
        : b?.symbol?.localeCompare(a?.symbol);
    }
    
    return 0;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Активен', color: 'text-success', bg: 'bg-success/10', icon: 'CheckCircle' },
      triggered: { label: 'Сработал', color: 'text-warning', bg: 'bg-warning/10', icon: 'AlertTriangle' },
      expired: { label: 'Истек', color: 'text-muted-foreground', bg: 'bg-muted/10', icon: 'Clock' }
    };

    const config = statusConfig?.[status] || statusConfig?.active;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color} ${config?.bg}`}>
        <Icon name={config?.icon} size={12} />
        <span>{config.label}</span>
      </span>
    );
  };

  const getAlertTypeLabel = (type) => {
    const types = {
      price: 'Цена',
      percentage: 'Процент',
      volume: 'Объем',
      technical: 'Технический',
      custom: 'Пользовательский'
    };
    return types?.[type] || type;
  };

  const formatCondition = (alert) => {
    const { alertType, condition, value } = alert;
    const conditionTranslations = {
        above: `выше $${value}`,
        below: `ниже $${value}`,
        crosses_above: `пересекает вверх $${value}`,
        crosses_below: `пересекает вниз $${value}`,
        increase: `рост на ${value}%`,
        decrease: `падение на ${value}%`,
        rsi_overbought: 'RSI Перекупленность',
        rsi_oversold: 'RSI Перепроданность',
        macd_bullish: 'MACD Бычий крест',
        macd_bearish: 'MACD Медвежий крест',
    }

    return conditionTranslations[condition] || condition;
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('ru-RU', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2">
          <h3 className="text-lg font-semibold text-foreground">Активные уведомления</h3>
          {selectedAlerts?.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onBulkDelete(selectedAlerts)}
              iconName="Trash2"
              iconPosition="left"
            >
              <span className="truncate">Удалить ({selectedAlerts?.length})</span>
            </Button>
          )}
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/5">
            <tr className="text-left">
              <th className="p-3 font-medium text-muted-foreground">
                <Checkbox
                  checked={selectedAlerts?.length === alerts?.length && alerts?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th 
                className="p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center space-x-1">
                  <span>Актив</span>
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th className="p-3 font-medium text-muted-foreground">Тип</th>
              <th className="p-3 font-medium text-muted-foreground">Условие</th>
              <th className="p-3 font-medium text-muted-foreground">Статус</th>
              <th 
                className="p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Создано</span>
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th className="p-3 font-medium text-muted-foreground">Действия</th>
            </tr>
          </thead>
          <tbody>
            {sortedAlerts?.map((alert) => (
              <tr key={alert?.id} className="border-t border-border hover:bg-muted/5">
                <td className="p-3">
                  <Checkbox
                    checked={selectedAlerts?.includes(alert?.id)}
                    onChange={(e) => handleSelectAlert(alert?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="TrendingUp" size={16} className="text-primary" />
                    </div>
                    <span className="font-medium text-foreground text-data truncate">{alert?.symbol}</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="text-muted-foreground truncate">{getAlertTypeLabel(alert?.alertType)}</span>
                </td>
                <td className="p-3">
                  <span className="text-foreground text-data truncate">{formatCondition(alert)}</span>
                </td>
                <td className="p-3">
                  {getStatusBadge(alert?.status)}
                </td>
                <td className="p-3">
                  <span className="text-muted-foreground truncate">{formatDate(alert?.createdAt)}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditAlert(alert)}
                      iconName="Edit"
                      className="h-8 w-8"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDuplicateAlert(alert)}
                      iconName="Copy"
                      className="h-8 w-8"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteAlert(alert?.id)}
                      iconName="Trash2"
                      className="text-error hover:text-error h-8 w-8"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {alerts?.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Нет настроенных уведомлений</h4>
            <p className="text-muted-foreground max-w-xs mx-auto">Создайте свое первое уведомление, чтобы начать получать автоматические оповещения.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsTable;
