import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { useLanguage } from '../../../contexts/LanguageContext';

const TradingPanel = () => {
  const { t } = useLanguage();
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');

  const orderTypeOptions = [
    { value: 'market', label: t('market') },
    { value: 'limit', label: t('limit') },
    { value: 'stop', label: t('stop') },
    { value: 'stop_limit', label: t('stopLimit') }
  ];

  const symbolOptions = [
    { value: 'BTCUSDT', label: 'BTC/USDT' },
    { value: 'ETHUSDT', label: 'ETH/USDT' },
    { value: 'ADAUSDT', label: 'ADA/USDT' },
    { value: 'SOLUSDT', label: 'SOL/USDT' }
  ];

  const mockAccountData = {
    balance: "23,456.78",
    availableBalance: "18,234.56",
    marginUsed: "5,222.22",
    marginLevel: "425.6%",
    currentPrice: "67,234.50"
  };

  const handlePlaceOrder = () => {
    if (!quantity) {
      alert(t('alertEnterQuantity'));
      return;
    }
    
    if (orderType === 'limit' && !price) {
      alert(t('alertEnterPriceLimit'));
      return;
    }

    // Mock order placement
    const orderData = {
      symbol: selectedSymbol,
      side,
      type: orderType,
      quantity,
      price: orderType === 'market' ? mockAccountData?.currentPrice : price,
      stopLoss,
      takeProfit
    };

    console.log('Placing order:', orderData);
    alert(`${side?.toUpperCase()} ${t('alertOrderPlaced')}`);
    
    // Reset form
    setQuantity('');
    setPrice('');
    setStopLoss('');
    setTakeProfit('');
  };

  const calculateOrderValue = () => {
    if (!quantity) return '0.00';
    const orderPrice = orderType === 'market'? parseFloat(mockAccountData?.currentPrice?.replace(',', '')) : 
      parseFloat(price || '0');
    return (parseFloat(quantity) * orderPrice)?.toLocaleString();
  };

  const getMaxQuantity = () => {
    const availableBalance = parseFloat(mockAccountData?.availableBalance?.replace(',', ''));
    const currentPrice = parseFloat(mockAccountData?.currentPrice?.replace(',', ''));
    
    if (side === 'buy') {
      return (availableBalance / currentPrice)?.toFixed(6);
    } else {
      // For sell, would need to check actual holdings
      return '1.234567';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">{t('quickTrade')}</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        {/* Symbol Selector */}
        <Select
          options={symbolOptions}
          value={selectedSymbol}
          onChange={setSelectedSymbol}
          className="mb-3"
        />

        {/* Buy/Sell Toggle */}
        <div className="flex rounded-lg bg-muted p-1">
          <button
            onClick={() => setSide('buy')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-smooth ${
              side === 'buy' ?'bg-success text-white' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('buy')}
          </button>
          <button
            onClick={() => setSide('sell')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-smooth ${
              side === 'sell' ?'bg-error text-white' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('sell')}
          </button>
        </div>
      </div>
      {/* Order Form */}
      <div className="flex-1 p-4 space-y-4">
        {/* Order Type */}
        <Select
          label={t('orderType')}
          options={orderTypeOptions}
          value={orderType}
          onChange={setOrderType}
        />

        {/* Price (for limit orders) */}
        {(orderType === 'limit' || orderType === 'stop_limit') && (
          <Input
            label={`${t('price')} (USDT)`}
            type="number"
            placeholder={t('enterPrice')}
            value={price}
            onChange={(e) => setPrice(e?.target?.value)}
          />
        )}

        {/* Quantity */}
        <div>
          <Input
            label={`${t('quantity')} (BTC)`}
            type="number"
            placeholder={t('enterQuantity')}
            value={quantity}
            onChange={(e) => setQuantity(e?.target?.value)}
          />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{t('max')}: {getMaxQuantity()}</span>
            <button
              onClick={() => setQuantity(getMaxQuantity())}
              className="text-primary hover:text-primary/80 transition-smooth"
            >
              {t('useMax')}
            </button>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-3">
          <Input
            label={t('stopLossOptional')}
            type="number"
            placeholder={t('stopLossPrice')}
            value={stopLoss}
            onChange={(e) => setStopLoss(e?.target?.value)}
          />
          
          <Input
            label={t('takeProfitOptional')}
            type="number"
            placeholder={t('takeProfitPrice')}
            value={takeProfit}
            onChange={(e) => setTakeProfit(e?.target?.value)}
          />
        </div>

        {/* Order Summary */}
        <div className="bg-muted/30 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('orderValue')}:</span>
            <span className="font-medium text-foreground text-data">
              ${calculateOrderValue()} USDT
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('estFee')}:</span>
            <span className="font-medium text-foreground text-data">
              ${(parseFloat(calculateOrderValue()?.replace(',', '')) * 0.001)?.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('available')}:</span>
            <span className="font-medium text-foreground text-data">
              ${mockAccountData?.availableBalance} USDT
            </span>
          </div>
        </div>
      </div>
      {/* Place Order Button */}
      <div className="p-4 border-t border-border">
        <Button
          variant={side === 'buy' ? 'success' : 'destructive'}
          size="lg"
          fullWidth
          onClick={handlePlaceOrder}
          disabled={!quantity}
          className="font-semibold"
        >
          {side === 'buy' ? t('buySymbol') : t('sellSymbol')} {selectedSymbol?.replace('USDT', '')}
        </Button>
        
        <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>{t('connected')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} />
            <span>{t('secure')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;
