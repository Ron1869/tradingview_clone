import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTrades = () => {
  const [selectedTab, setSelectedTab] = useState('recent');

  const mockTradesData = {
    recent: [
      {
        id: "TXN001",
        symbol: "BTCUSDT",
        side: "buy",
        quantity: "0.1234",
        price: "67,234.50",
        value: "8,294.57",
        fee: "8.29",
        time: "14:23:45",
        status: "filled",
        pnl: null
      },
      {
        id: "TXN002", 
        symbol: "ETHUSDT",
        side: "sell",
        quantity: "2.5678",
        price: "3,456.78",
        value: "8,876.54",
        fee: "8.88",
        time: "13:45:12",
        status: "filled",
        pnl: "+234.56"
      },
      {
        id: "TXN003",
        symbol: "ADAUSDT", 
        side: "buy",
        quantity: "1,000.00",
        price: "0.4567",
        value: "456.70",
        fee: "0.46",
        time: "12:30:28",
        status: "filled",
        pnl: null
      },
      {
        id: "TXN004",
        symbol: "SOLUSDT",
        side: "sell", 
        quantity: "15.4321",
        price: "145.67",
        value: "2,247.89",
        fee: "2.25",
        time: "11:15:33",
        status: "filled",
        pnl: "-45.67"
      },
      {
        id: "TXN005",
        symbol: "DOTUSDT",
        side: "buy",
        quantity: "234.56",
        price: "6.789",
        value: "1,592.34",
        fee: "1.59",
        time: "10:45:17",
        status: "filled",
        pnl: null
      }
    ],
    orders: [
      {
        id: "ORD001",
        symbol: "BTCUSDT",
        side: "buy",
        type: "limit",
        quantity: "0.0500",
        price: "66,500.00",
        value: "3,325.00",
        time: "15:30:22",
        status: "pending"
      },
      {
        id: "ORD002",
        symbol: "ETHUSDT", 
        side: "sell",
        type: "stop",
        quantity: "1.2345",
        price: "3,400.00",
        value: "4,197.30",
        time: "14:15:45",
        status: "pending"
      },
      {
        id: "ORD003",
        symbol: "ADAUSDT",
        side: "buy",
        type: "limit",
        quantity: "2,000.00", 
        price: "0.4500",
        value: "900.00",
        time: "13:22:11",
        status: "pending"
      }
    ]
  };

  const currentData = mockTradesData?.[selectedTab];

  const getStatusColor = (status) => {
    switch (status) {
      case 'filled': return 'text-success';
      case 'pending': return 'text-warning';
      case 'cancelled': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getSideColor = (side) => {
    return side === 'buy' ? 'text-success' : 'text-error';
  };

  const handleCancelOrder = (orderId) => {
    console.log('Cancelling order:', orderId);
    alert('Order cancelled successfully!');
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Trading Activity</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1">
          {[
            { key: 'recent', label: 'Recent Trades', icon: 'Activity' },
            { key: 'orders', label: 'Open Orders', icon: 'Clock' }
          ]?.map((tab) => (
            <button
              key={tab?.key}
              onClick={() => setSelectedTab(tab?.key)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth ${
                selectedTab === tab?.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Table Header */}
      <div className="px-4 py-2 border-b border-border bg-muted/30">
        <div className="grid grid-cols-6 gap-4 text-xs font-medium text-muted-foreground">
          <span>Symbol</span>
          <span>Side</span>
          <span>Quantity</span>
          <span>Price</span>
          <span>Time</span>
          <span>Status</span>
        </div>
      </div>
      {/* Table Content */}
      <div className="flex-1 overflow-y-auto">
        {currentData?.map((item, index) => (
          <div
            key={item?.id}
            className="px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-smooth"
          >
            <div className="grid grid-cols-6 gap-4 items-center">
              {/* Symbol */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {item?.symbol?.slice(0, 2)}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {item?.symbol}
                </span>
              </div>

              {/* Side */}
              <div className="flex items-center space-x-1">
                <Icon 
                  name={item?.side === 'buy' ? 'TrendingUp' : 'TrendingDown'} 
                  size={12} 
                  className={getSideColor(item?.side)}
                />
                <span className={`text-sm font-medium ${getSideColor(item?.side)}`}>
                  {item?.side?.toUpperCase()}
                </span>
              </div>

              {/* Quantity */}
              <span className="text-sm text-foreground text-data">
                {item?.quantity}
              </span>

              {/* Price */}
              <span className="text-sm text-foreground text-data">
                ${item?.price}
              </span>

              {/* Time */}
              <span className="text-sm text-muted-foreground">
                {item?.time}
              </span>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${getStatusColor(item?.status)}`}>
                  {item?.status?.toUpperCase()}
                </span>
                
                {selectedTab === 'orders' && item?.status === 'pending' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={() => handleCancelOrder(item?.id)}
                    className="text-error hover:text-error/80 h-6 w-6 p-0"
                  />
                )}
              </div>
            </div>

            {/* Additional Info for Recent Trades */}
            {selectedTab === 'recent' && (
              <div className="grid grid-cols-6 gap-4 mt-2 text-xs text-muted-foreground">
                <span>Value: ${item?.value}</span>
                <span>Fee: ${item?.fee}</span>
                <span></span>
                <span></span>
                <span></span>
                {item?.pnl && (
                  <span className={item?.pnl?.startsWith('+') ? 'text-success' : 'text-error'}>
                    P&L: {item?.pnl}
                  </span>
                )}
              </div>
            )}

            {/* Additional Info for Orders */}
            {selectedTab === 'orders' && (
              <div className="grid grid-cols-6 gap-4 mt-2 text-xs text-muted-foreground">
                <span>Type: {item?.type?.toUpperCase()}</span>
                <span>Value: ${item?.value}</span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {selectedTab === 'recent' ? 'Last 24 hours' : `${currentData?.length} open orders`}
          </span>
          <Button
            variant="outline"
            size="sm"
            iconName="MoreHorizontal"
            className="text-muted-foreground hover:text-foreground"
          >
            View All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentTrades;