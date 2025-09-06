import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TradingPanel = () => {
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');

  const orderTypeOptions = [
    { value: 'market', label: 'Market' },
    { value: 'limit', label: 'Limit' },
    { value: 'stop', label: 'Stop' },
    { value: 'stop_limit', label: 'Stop Limit' }
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
      alert('Please enter quantity');
      return;
    }
    
    if (orderType === 'limit' && !price) {
      alert('Please enter price for limit order');
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
    alert(`${side?.toUpperCase()} order placed successfully!`);
    
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
          <h3 className="text-lg font-semibold text-foreground">Quick Trade</h3>
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
            Buy
          </button>
          <button
            onClick={() => setSide('sell')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-smooth ${
              side === 'sell' ?'bg-error text-white' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sell
          </button>
        </div>
      </div>
      {/* Order Form */}
      <div className="flex-1 p-4 space-y-4">
        {/* Order Type */}
        <Select
          label="Order Type"
          options={orderTypeOptions}
          value={orderType}
          onChange={setOrderType}
        />

        {/* Price (for limit orders) */}
        {(orderType === 'limit' || orderType === 'stop_limit') && (
          <Input
            label="Price (USDT)"
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e?.target?.value)}
          />
        )}

        {/* Quantity */}
        <div>
          <Input
            label="Quantity (BTC)"
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e?.target?.value)}
          />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Max: {getMaxQuantity()}</span>
            <button
              onClick={() => setQuantity(getMaxQuantity())}
              className="text-primary hover:text-primary/80 transition-smooth"
            >
              Use Max
            </button>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-3">
          <Input
            label="Stop Loss (Optional)"
            type="number"
            placeholder="Stop loss price"
            value={stopLoss}
            onChange={(e) => setStopLoss(e?.target?.value)}
          />
          
          <Input
            label="Take Profit (Optional)"
            type="number"
            placeholder="Take profit price"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e?.target?.value)}
          />
        </div>

        {/* Order Summary */}
        <div className="bg-muted/30 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order Value:</span>
            <span className="font-medium text-foreground text-data">
              ${calculateOrderValue()} USDT
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Est. Fee:</span>
            <span className="font-medium text-foreground text-data">
              ${(parseFloat(calculateOrderValue()?.replace(',', '')) * 0.001)?.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available:</span>
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
          {side === 'buy' ? 'Buy' : 'Sell'} {selectedSymbol?.replace('USDT', '')}
        </Button>
        
        <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Connected</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;