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
      active: { color: 'text-success', bg: 'bg-success/10', icon: 'CheckCircle' },
      triggered: { color: 'text-warning', bg: 'bg-warning/10', icon: 'AlertTriangle' },
      expired: { color: 'text-muted-foreground', bg: 'bg-muted/10', icon: 'Clock' }
    };

    const config = statusConfig?.[status] || statusConfig?.active;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color} ${config?.bg}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const getAlertTypeLabel = (type) => {
    const types = {
      price: 'Price',
      percentage: 'Percentage',
      volume: 'Volume',
      technical: 'Technical',
      custom: 'Custom'
    };
    return types?.[type] || type;
  };

  const formatCondition = (alert) => {
    const { alertType, condition, value } = alert;
    
    if (alertType === 'price') {
      return `${condition?.replace('_', ' ')} $${value}`;
    }
    
    if (alertType === 'percentage') {
      return `${condition} ${value}%`;
    }
    
    if (alertType === 'technical') {
      return condition?.replace('_', ' ')?.toUpperCase();
    }
    
    return condition;
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Active Alerts</h3>
          {selectedAlerts?.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onBulkDelete(selectedAlerts)}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete Selected ({selectedAlerts?.length})
            </Button>
          )}
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/5">
            <tr>
              <th className="p-3 text-left">
                <Checkbox
                  checked={selectedAlerts?.length === alerts?.length && alerts?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th 
                className="p-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center space-x-1">
                  <span>Asset</span>
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">Type</th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">Condition</th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th 
                className="p-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
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
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="TrendingUp" size={16} className="text-primary" />
                    </div>
                    <span className="font-medium text-foreground text-data">{alert?.symbol}</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="text-sm text-muted-foreground">{getAlertTypeLabel(alert?.alertType)}</span>
                </td>
                <td className="p-3">
                  <span className="text-sm text-foreground text-data">{formatCondition(alert)}</span>
                </td>
                <td className="p-3">
                  {getStatusBadge(alert?.status)}
                </td>
                <td className="p-3">
                  <span className="text-sm text-muted-foreground">{formatDate(alert?.createdAt)}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditAlert(alert)}
                      iconName="Edit"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicateAlert(alert)}
                      iconName="Copy"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteAlert(alert?.id)}
                      iconName="Trash2"
                      className="text-error hover:text-error"
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
            <h4 className="text-lg font-medium text-foreground mb-2">No alerts configured</h4>
            <p className="text-muted-foreground">Create your first alert to get started with automated notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsTable;