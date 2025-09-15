import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../contexts/LanguageContext';

const MarketDepth = ({ selectedSymbol, currentPrice }) => {
  const { t } = useLanguage();
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState([]);
  const [activeTab, setActiveTab] = useState('depth');
  const [depthLevel, setDepthLevel] = useState(10);

  useEffect(() => {
    const generateOrderBook = () => {
      const basePrice = currentPrice || 45000;
      const bids = [];
      const asks = [];
      
      for (let i = 0; i < 20; i++) {
        const price = basePrice - (i + 1) * (basePrice * 0.0001);
        const size = Math.random() * 10 + 0.1;
        const total = price * size;
        bids?.push({
          price: parseFloat(price?.toFixed(2)),
          size: parseFloat(size?.toFixed(4)),
          total: parseFloat(total?.toFixed(2)),
          count: Math.floor(Math.random() * 50) + 1
        });
      }
      
      for (let i = 0; i < 20; i++) {
        const price = basePrice + (i + 1) * (basePrice * 0.0001);
        const size = Math.random() * 10 + 0.1;
        const total = price * size;
        asks?.push({
          price: parseFloat(price?.toFixed(2)),
          size: parseFloat(size?.toFixed(4)),
          total: parseFloat(total?.toFixed(2)),
          count: Math.floor(Math.random() * 50) + 1
        });
      }
      
      return { bids, asks };
    };

    const generateRecentTrades = () => {
      const trades = [];
      const basePrice = currentPrice || 45000;
      
      for (let i = 0; i < 50; i++) {
        const price = basePrice + (Math.random() - 0.5) * (basePrice * 0.001);
        const size = Math.random() * 5 + 0.01;
        const side = Math.random() > 0.5 ? 'buy' : 'sell';
        const timestamp = new Date(Date.now() - i * 1000 * Math.random() * 60);
        
        trades?.push({
          id: i,
          price: parseFloat(price?.toFixed(2)),
          size: parseFloat(size?.toFixed(4)),
          side,
          timestamp,
          total: parseFloat((price * size)?.toFixed(2))
        });
      }
      
      return trades?.sort((a, b) => b?.timestamp - a?.timestamp);
    };

    setOrderBook(generateOrderBook());
    setRecentTrades(generateRecentTrades());

    const interval = setInterval(() => {
      setOrderBook(generateOrderBook());
      setRecentTrades(generateRecentTrades());
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedSymbol, currentPrice]);

  const formatPrice = (price) => {
    return price < 1 ? price?.toFixed(4) : price?.toFixed(2);
  };

  const formatSize = (size) => {
    return size?.toFixed(4);
  };

  const formatTime = (timestamp) => {
    return timestamp?.toLocaleTimeString(t('locale'), {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const calculateSpread = () => {
    if (orderBook?.asks?.length > 0 && orderBook?.bids?.length > 0) {
      const bestAsk = orderBook?.asks?.[0]?.price;
      const bestBid = orderBook?.bids?.[0]?.price;
      const spread = bestAsk - bestBid;
      const spreadPercent = (spread / bestBid) * 100;
      return { spread, spreadPercent };
    }
    return { spread: 0, spreadPercent: 0 };
  };

  const { spread, spreadPercent } = calculateSpread();

  const getMaxTotal = () => {
    const allTotals = [...orderBook?.bids, ...orderBook?.asks]?.map(order => order?.total);
    return Math.max(...allTotals, 0);
  };

  const maxTotal = getMaxTotal();

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{t('orderBook')}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">{t('spreadLabel')}</span>
            <span className="text-xs font-medium text-foreground text-data">
              {formatPrice(spread)} ({spreadPercent?.toFixed(3)}%)
            </span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('depth')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              activeTab === 'depth' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('depth')}
          </button>
          <button
            onClick={() => setActiveTab('trades')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              activeTab === 'trades' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('trades')}
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'depth' ? (
          <div className="h-full flex flex-col">
            {/* Depth Controls */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t('depthLabel')}</span>
                <div className="flex space-x-1">
                  {[5, 10, 20]?.map((level) => (
                    <Button
                      key={level}
                      variant={depthLevel === level ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setDepthLevel(level)}
                      className="px-2 py-1 text-xs"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Book Header */}
            <div className="px-3 py-2 border-b border-border">
              <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground">
                <div className="text-left">{t('price')}</div>
                <div className="text-right">{t('size')}</div>
                <div className="text-right">{t('total')}</div>
                <div className="text-right">{t('count')}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Asks (Sell Orders) */}
              <div className="space-y-1 p-2">
                {orderBook?.asks?.slice(0, depthLevel)?.reverse()?.map((ask, index) => (
                  <div
                    key={`ask-${index}`}
                    className="relative grid grid-cols-4 gap-2 text-xs py-1 px-2 rounded hover:bg-error/5 cursor-pointer"
                  >
                    <div
                      className="absolute inset-y-0 right-0 bg-error/10"
                      style={{ width: `${(ask?.total / maxTotal) * 100}%` }}
                    ></div>
                    <div className="relative text-error font-medium text-data">{formatPrice(ask?.price)}</div>
                    <div className="relative text-right text-foreground text-data">{formatSize(ask?.size)}</div>
                    <div className="relative text-right text-foreground text-data">{formatPrice(ask?.total)}</div>
                    <div className="relative text-right text-muted-foreground">{ask?.count}</div>
                  </div>
                ))}
              </div>

              {/* Current Price */}
              <div className="px-4 py-3 border-y border-border bg-muted/50">
                <div className="flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground text-data">
                    {formatPrice(currentPrice || 0)}
                  </span>
                  <Icon name="TrendingUp" size={16} className="ml-2 text-success" />
                </div>
                <div className="text-center text-xs text-muted-foreground mt-1">
                  {t('lastPrice')}
                </div>
              </div>

              {/* Bids (Buy Orders) */}
              <div className="space-y-1 p-2">
                {orderBook?.bids?.slice(0, depthLevel)?.map((bid, index) => (
                  <div
                    key={`bid-${index}`}
                    className="relative grid grid-cols-4 gap-2 text-xs py-1 px-2 rounded hover:bg-success/5 cursor-pointer"
                  >
                    <div
                      className="absolute inset-y-0 right-0 bg-success/10"
                      style={{ width: `${(bid?.total / maxTotal) * 100}%` }}
                    ></div>
                    <div className="relative text-success font-medium text-data">{formatPrice(bid?.price)}</div>
                    <div className="relative text-right text-foreground text-data">{formatSize(bid?.size)}</div>
                    <div className="relative text-right text-foreground text-data">{formatPrice(bid?.total)}</div>
                    <div className="relative text-right text-muted-foreground">{bid?.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Trades Header */}
            <div className="px-3 py-2 border-b border-border">
              <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground">
                <div className="text-left">{t('time')}</div>
                <div className="text-right">{t('price')}</div>
                <div className="text-right">{t('size')}</div>
                <div className="text-right">{t('total')}</div>
              </div>
            </div>

            {/* Recent Trades */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-1 p-2">
                {recentTrades?.map((trade) => (
                  <div
                    key={trade?.id}
                    className="grid grid-cols-4 gap-2 text-xs py-1 px-2 rounded hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="text-muted-foreground text-data">{formatTime(trade?.timestamp)}</div>
                    <div className={`text-right font-medium text-data ${
                      trade?.side === 'buy' ? 'text-success' : 'text-error'
                    }`}>
                      {formatPrice(trade?.price)}
                    </div>
                    <div className="text-right text-foreground text-data">{formatSize(trade?.size)}</div>
                    <div className="text-right text-foreground text-data">{formatPrice(trade?.total)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t('updatedLabel')} {new Date()?.toLocaleTimeString(t('locale'))}</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>{t('realTime')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDepth;
