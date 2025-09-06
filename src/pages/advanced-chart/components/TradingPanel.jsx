import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TradingPanel = ({ selectedSymbol, currentPrice }) => {
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [activeTab, setActiveTab] = useState('order');
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(50000);

  const orderTypeOptions = [
    { value: 'market', label: 'Рыночный' },
    { value: 'limit', label: 'Лимитный' },
    { value: 'stop', label: 'Стоп' },
    { value: 'stop-limit', label: 'Стоп-лимит' }
  ];

  // Mock positions and orders
  useEffect(() => {
    const mockPositions = [
      {
        id: 1,
        symbol: 'BTCUSD',
        side: 'long',
        size: 0.5,
        entryPrice: 44500.00,
        currentPrice: 45234.56,
        pnl: 367.28,
        pnlPercent: 1.65,
        margin: 2225.00
      },
      {
        id: 2,
        symbol: 'ETHUSD',
        side: 'short',
        size: 2.0,
        entryPrice: 2900.00,
        currentPrice: 2847.23,
        pnl: 105.54,
        pnlPercent: 1.82,
        margin: 1450.00
      }
    ];

    const mockOrders = [
      {
        id: 1,
        symbol: 'AAPL',
        side: 'buy',
        type: 'limit',
        quantity: 100,
        price: 170.00,
        status: 'pending',
        created: new Date(Date.now() - 3600000)
      },
      {
        id: 2,
        symbol: 'GOOGL',
        side: 'sell',
        type: 'stop',
        quantity: 10,
        price: 2800.00,
        status: 'pending',
        created: new Date(Date.now() - 7200000)
      }
    ];

    setPositions(mockPositions);
    setOrders(mockOrders);
  }, []);

  useEffect(() => {
    if (orderType === 'market') {
      setPrice(currentPrice?.toString() || '');
    }
  }, [orderType, currentPrice]);

  const handleSubmitOrder = () => {
    if (!quantity) return;

    const orderPrice = orderType === 'market' ? currentPrice : parseFloat(price);
    const orderQuantity = parseFloat(quantity);
    const orderValue = orderPrice * orderQuantity;

    if (side === 'buy' && orderValue > balance) {
      alert('Недостаточно средств для выполнения ордера');
      return;
    }

    const newOrder = {
      id: Date.now(),
      symbol: selectedSymbol,
      side,
      type: orderType,
      quantity: orderQuantity,
      price: orderPrice,
      status: orderType === 'market' ? 'filled' : 'pending',
      created: new Date()
    };

    setOrders([newOrder, ...orders]);
    
    if (orderType === 'market') {
      // Update balance
      if (side === 'buy') {
        setBalance(balance - orderValue);
      } else {
        setBalance(balance + orderValue);
      }
      
      // Clear form
      setQuantity('');
      setPrice('');
      setStopLoss('');
      setTakeProfit('');
    }
  };

  const calculateOrderValue = () => {
    if (!quantity || !price) return 0;
    return parseFloat(quantity) * parseFloat(price);
  };

  const getPositionPnlColor = (pnl) => {
    return pnl >= 0 ? 'text-success' : 'text-error';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(value);
  };

  const formatDateTime = (date) => {
    return date?.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Торговля</h2>
          <div className="text-sm">
            <span className="text-muted-foreground">Баланс: </span>
            <span className="font-medium text-foreground text-data">{formatCurrency(balance)}</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('order')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              activeTab === 'order' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Ордер
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              activeTab === 'positions' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Позиции
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              activeTab === 'orders' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Ордера
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'order' && (
          <div className="space-y-4">
            {/* Symbol Info */}
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground text-data">{selectedSymbol}</span>
                <span className="text-sm text-foreground text-data">{formatCurrency(currentPrice || 0)}</span>
              </div>
            </div>

            {/* Buy/Sell Toggle */}
            <div className="flex space-x-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setSide('buy')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                  side === 'buy' ?'bg-success text-white shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Купить
              </button>
              <button
                onClick={() => setSide('sell')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                  side === 'sell' ?'bg-error text-white shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Продать
              </button>
            </div>

            {/* Order Type */}
            <Select
              label="Тип ордера"
              options={orderTypeOptions}
              value={orderType}
              onChange={setOrderType}
            />

            {/* Quantity */}
            <Input
              label="Количество"
              type="number"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => setQuantity(e?.target?.value)}
              step="0.01"
              min="0"
            />

            {/* Price (for limit orders) */}
            {orderType !== 'market' && (
              <Input
                label="Цена"
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e?.target?.value)}
                step="0.01"
                min="0"
              />
            )}

            {/* Advanced Options */}
            <div className="space-y-3">
              <Input
                label="Стоп-лосс (опционально)"
                type="number"
                placeholder="0.00"
                value={stopLoss}
                onChange={(e) => setStopLoss(e?.target?.value)}
                step="0.01"
                min="0"
              />
              
              <Input
                label="Тейк-профит (опционально)"
                type="number"
                placeholder="0.00"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e?.target?.value)}
                step="0.01"
                min="0"
              />
            </div>

            {/* Order Summary */}
            {quantity && price && (
              <div className="bg-muted rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Сумма ордера:</span>
                  <span className="font-medium text-foreground text-data">
                    {formatCurrency(calculateOrderValue())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Комиссия (0.1%):</span>
                  <span className="font-medium text-foreground text-data">
                    {formatCurrency(calculateOrderValue() * 0.001)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="text-muted-foreground">Итого:</span>
                  <span className="font-medium text-foreground text-data">
                    {formatCurrency(calculateOrderValue() * 1.001)}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              variant={side === 'buy' ? 'success' : 'destructive'}
              fullWidth
              onClick={handleSubmitOrder}
              disabled={!quantity || (orderType !== 'market' && !price)}
            >
              {side === 'buy' ? 'Купить' : 'Продать'} {selectedSymbol}
            </Button>
          </div>
        )}

        {activeTab === 'positions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Открытые позиции ({positions?.length})
              </h3>
              <Button variant="ghost" size="sm">
                <Icon name="Settings" size={16} />
              </Button>
            </div>

            {positions?.length > 0 ? (
              positions?.map(position => (
                <div key={position?.id} className="bg-muted rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground text-data">{position?.symbol}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        position?.side === 'long' ?'bg-success/20 text-success' :'bg-error/20 text-error'
                      }`}>
                        {position?.side === 'long' ? 'LONG' : 'SHORT'}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Размер:</span>
                      <div className="font-medium text-foreground text-data">{position?.size}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Вход:</span>
                      <div className="font-medium text-foreground text-data">{formatCurrency(position?.entryPrice)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Текущая:</span>
                      <div className="font-medium text-foreground text-data">{formatCurrency(position?.currentPrice)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">P&L:</span>
                      <div className={`font-medium text-data ${getPositionPnlColor(position?.pnl)}`}>
                        {formatCurrency(position?.pnl)} ({position?.pnlPercent > 0 ? '+' : ''}{position?.pnlPercent?.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Изменить
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      Закрыть
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Icon name="TrendingUp" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Нет открытых позиций</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Активные ордера ({orders?.filter(o => o?.status === 'pending')?.length})
              </h3>
              <Button variant="ghost" size="sm">
                <Icon name="RefreshCw" size={16} />
              </Button>
            </div>

            {orders?.length > 0 ? (
              orders?.map(order => (
                <div key={order?.id} className="bg-muted rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground text-data">{order?.symbol}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order?.side === 'buy' ?'bg-success/20 text-success' :'bg-error/20 text-error'
                      }`}>
                        {order?.side?.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order?.status === 'filled' ?'bg-success/20 text-success' 
                          : order?.status === 'pending' ?'bg-warning/20 text-warning' :'bg-error/20 text-error'
                      }`}>
                        {order?.status === 'filled' ? 'ИСПОЛНЕН' : order?.status === 'pending' ? 'ОЖИДАЕТ' : 'ОТМЕНЕН'}
                      </span>
                    </div>
                    {order?.status === 'pending' && (
                      <Button variant="ghost" size="sm">
                        <Icon name="X" size={14} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Тип:</span>
                      <div className="font-medium text-foreground">{order?.type}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Количество:</span>
                      <div className="font-medium text-foreground text-data">{order?.quantity}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Цена:</span>
                      <div className="font-medium text-foreground text-data">{formatCurrency(order?.price)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Создан:</span>
                      <div className="font-medium text-foreground text-data">{formatDateTime(order?.created)}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Нет активных ордеров</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingPanel;