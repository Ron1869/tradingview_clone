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
    { value: 'BTCUSDT', label: 'Биткоин (BTC/USDT)' },
    { value: 'ETHUSDT', label: 'Эфириум (ETH/USDT)' },
    { value: 'ADAUSDT', label: 'Кардано (ADA/USDT)' },
    { value: 'SOLUSDT', label: 'Солана (SOL/USDT)' },
    { value: 'DOTUSDT', label: 'Полкадот (DOT/USDT)' },
    { value: 'LINKUSDT', label: 'Чейнлинк (LINK/USDT)' },
    { value: 'MATICUSDT', label: 'Полигон (MATIC/USDT)' },
    { value: 'AVAXUSDT', label: 'Аваланч (AVAX/USDT)' }
  ];

  const alertTypeOptions = [
    { value: 'price', label: 'Ценовое уведомление' },
    { value: 'percentage', label: 'Процентное изменение' },
    { value: 'volume', label: 'Скачок объема' },
    { value: 'technical', label: 'Технический индикатор' },
    { value: 'custom', label: 'Пользовательский Pine Script' }
  ];

  const conditionOptions = {
    price: [
      { value: 'above', label: 'Цена выше' },
      { value: 'below', label: 'Цена ниже' },
      { value: 'crosses_above', label: 'Пересекает вверх' },
      { value: 'crosses_below', label: 'Пересекает вниз' }
    ],
    percentage: [
      { value: 'increase', label: 'Увеличение на %' },
      { value: 'decrease', label: 'Уменьшение на %' }
    ],
    volume: [
      { value: 'spike', label: 'Скачок объема' },
      { value: 'above_average', label: 'Выше среднего' }
    ],
    technical: [
      { value: 'rsi_overbought', label: 'RSI перекупленность (>70)' },
      { value: 'rsi_oversold', label: 'RSI перепроданность (<30)' },
      { value: 'macd_bullish', label: 'Бычье пересечение MACD' },
      { value: 'macd_bearish', label: 'Медвежье пересечение MACD' }
    ]
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!alertData?.symbol) {
      newErrors.symbol = 'Пожалуйста, выберите актив';
    }
    
    if (alertData?.alertType === 'price' && !alertData?.value) {
      newErrors.value = 'Пожалуйста, введите значение цены';
    }
    
    if (alertData?.alertType === 'percentage' && !alertData?.percentage) {
      newErrors.percentage = 'Пожалуйста, введите процентное значение';
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
          <span className="truncate">Создать новое уведомление</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Создать уведомление</h3>
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
          label="Выберите актив"
          placeholder="Выберите торговую пару"
          options={assetOptions}
          value={alertData?.symbol}
          onChange={(value) => setAlertData(prev => ({ ...prev, symbol: value }))}
          error={errors?.symbol}
          searchable
          required
        />

        {/* Alert Type */}
        <Select
          label="Тип уведомления"
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
          label="Условие"
          options={conditionOptions?.[alertData?.alertType] || conditionOptions?.price}
          value={alertData?.condition}
          onChange={(value) => setAlertData(prev => ({ ...prev, condition: value }))}
          required
        />

        {/* Value Input */}
        {alertData?.alertType === 'price' && (
          <Input
            label="Значение цены"
            type="number"
            placeholder="Введите целевую цену"
            value={alertData?.value}
            onChange={(e) => setAlertData(prev => ({ ...prev, value: e?.target?.value }))}
            error={errors?.value}
            required
          />
        )}

        {alertData?.alertType === 'percentage' && (
          <Input
            label="Процентное значение"
            type="number"
            placeholder="Введите процент (например, 5)"
            value={alertData?.percentage}
            onChange={(e) => setAlertData(prev => ({ ...prev, percentage: e?.target?.value }))}
            error={errors?.percentage}
            required
          />
        )}

        {/* Notification Preferences */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Способы уведомления</label>
          <div className="space-y-2">
            <Checkbox
              label="Push-уведомления"
              checked={alertData?.notifications?.push}
              onChange={(e) => handleNotificationChange('push', e?.target?.checked)}
            />
            <Checkbox
              label="Email-уведомления"
              checked={alertData?.notifications?.email}
              onChange={(e) => handleNotificationChange('email', e?.target?.checked)}
            />
            <Checkbox
              label="SMS-уведомления"
              checked={alertData?.notifications?.sms}
              onChange={(e) => handleNotificationChange('sms', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
          <Button
            type="submit"
            variant="default"
            iconName="Bell"
            iconPosition="left"
            className="flex-1"
          >
            <span className="truncate">Создать уведомление</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onToggle}
            className="flex-1"
          >
            <span className="truncate">Отмена</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AlertCreationPanel;
