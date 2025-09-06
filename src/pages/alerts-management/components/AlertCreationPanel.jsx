import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AlertCreationPanel = ({ onCreateAlert, isOpen, onToggle }) => {
  const [alertData, setAlertData] = useState({
    symbol: '',
    alertType: 'price',
    condition: 'above',
    value: '',
    percentage: '',
    notifications: {
      push: true,
      email: false,
      sms: false
    }
  });

  const [errors, setErrors] = useState({});

  const assetOptions = [
    { value: 'BTCUSDT', label: 'Bitcoin (BTC/USDT)' },
    { value: 'ETHUSDT', label: 'Ethereum (ETH/USDT)' },
    { value: 'ADAUSDT', label: 'Cardano (ADA/USDT)' },
    { value: 'SOLUSDT', label: 'Solana (SOL/USDT)' },
    { value: 'DOTUSDT', label: 'Polkadot (DOT/USDT)' },
    { value: 'LINKUSDT', label: 'Chainlink (LINK/USDT)' },
    { value: 'MATICUSDT', label: 'Polygon (MATIC/USDT)' },
    { value: 'AVAXUSDT', label: 'Avalanche (AVAX/USDT)' }
  ];

  const alertTypeOptions = [
    { value: 'price', label: 'Price Alert' },
    { value: 'percentage', label: 'Percentage Change' },
    { value: 'volume', label: 'Volume Spike' },
    { value: 'technical', label: 'Technical Indicator' },
    { value: 'custom', label: 'Custom Pine Script' }
  ];

  const conditionOptions = {
    price: [
      { value: 'above', label: 'Price Above' },
      { value: 'below', label: 'Price Below' },
      { value: 'crosses_above', label: 'Crosses Above' },
      { value: 'crosses_below', label: 'Crosses Below' }
    ],
    percentage: [
      { value: 'increase', label: 'Increase by %' },
      { value: 'decrease', label: 'Decrease by %' }
    ],
    volume: [
      { value: 'spike', label: 'Volume Spike' },
      { value: 'above_average', label: 'Above Average' }
    ],
    technical: [
      { value: 'rsi_overbought', label: 'RSI Overbought (>70)' },
      { value: 'rsi_oversold', label: 'RSI Oversold (<30)' },
      { value: 'macd_bullish', label: 'MACD Bullish Cross' },
      { value: 'macd_bearish', label: 'MACD Bearish Cross' }
    ]
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!alertData?.symbol) {
      newErrors.symbol = 'Please select an asset';
    }
    
    if (alertData?.alertType === 'price' && !alertData?.value) {
      newErrors.value = 'Please enter a price value';
    }
    
    if (alertData?.alertType === 'percentage' && !alertData?.percentage) {
      newErrors.percentage = 'Please enter a percentage value';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    const newAlert = {
      id: Date.now(),
      symbol: alertData?.symbol,
      alertType: alertData?.alertType,
      condition: alertData?.condition,
      value: alertData?.value || alertData?.percentage,
      notifications: alertData?.notifications,
      status: 'active',
      createdAt: new Date(),
      triggeredAt: null
    };

    onCreateAlert(newAlert);
    
    // Reset form
    setAlertData({
      symbol: '',
      alertType: 'price',
      condition: 'above',
      value: '',
      percentage: '',
      notifications: {
        push: true,
        email: false,
        sms: false
      }
    });
    setErrors({});
  };

  const handleNotificationChange = (type, checked) => {
    setAlertData(prev => ({
      ...prev,
      notifications: {
        ...prev?.notifications,
        [type]: checked
      }
    }));
  };

  if (!isOpen) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <Button
          variant="outline"
          onClick={onToggle}
          iconName="Plus"
          iconPosition="left"
          className="w-full"
        >
          Create New Alert
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Create New Alert</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          iconName="X"
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asset Selection */}
        <Select
          label="Select Asset"
          placeholder="Choose trading pair"
          options={assetOptions}
          value={alertData?.symbol}
          onChange={(value) => setAlertData(prev => ({ ...prev, symbol: value }))}
          error={errors?.symbol}
          searchable
          required
        />

        {/* Alert Type */}
        <Select
          label="Alert Type"
          options={alertTypeOptions}
          value={alertData?.alertType}
          onChange={(value) => setAlertData(prev => ({ 
            ...prev, 
            alertType: value,
            condition: conditionOptions?.[value]?.[0]?.value || 'above'
          }))}
          required
        />

        {/* Condition */}
        <Select
          label="Condition"
          options={conditionOptions?.[alertData?.alertType] || conditionOptions?.price}
          value={alertData?.condition}
          onChange={(value) => setAlertData(prev => ({ ...prev, condition: value }))}
          required
        />

        {/* Value Input */}
        {alertData?.alertType === 'price' && (
          <Input
            label="Price Value"
            type="number"
            placeholder="Enter target price"
            value={alertData?.value}
            onChange={(e) => setAlertData(prev => ({ ...prev, value: e?.target?.value }))}
            error={errors?.value}
            required
          />
        )}

        {alertData?.alertType === 'percentage' && (
          <Input
            label="Percentage Value"
            type="number"
            placeholder="Enter percentage (e.g., 5)"
            value={alertData?.percentage}
            onChange={(e) => setAlertData(prev => ({ ...prev, percentage: e?.target?.value }))}
            error={errors?.percentage}
            required
          />
        )}

        {/* Notification Preferences */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Notification Methods</label>
          <div className="space-y-2">
            <Checkbox
              label="Push Notifications"
              checked={alertData?.notifications?.push}
              onChange={(e) => handleNotificationChange('push', e?.target?.checked)}
            />
            <Checkbox
              label="Email Notifications"
              checked={alertData?.notifications?.email}
              onChange={(e) => handleNotificationChange('email', e?.target?.checked)}
            />
            <Checkbox
              label="SMS Notifications"
              checked={alertData?.notifications?.sms}
              onChange={(e) => handleNotificationChange('sms', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            variant="default"
            iconName="Bell"
            iconPosition="left"
            className="flex-1"
          >
            Create Alert
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onToggle}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AlertCreationPanel;