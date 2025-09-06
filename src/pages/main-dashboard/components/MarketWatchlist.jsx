import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MarketWatchlist = () => {
  const [watchlistData, setWatchlistData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('favorites');

  const mockWatchlistData = {
    favorites: [
      {
        symbol: "BTCUSDT",
        name: "Bitcoin",
        price: "67,234.50",
        change: "+2.34",
        changePercent: "+3.61%",
        volume: "2.4B",
        isUp: true,
        icon: "₿"
      },
      {
        symbol: "ETHUSDT", 
        name: "Ethereum",
        price: "3,456.78",
        change: "-45.23",
        changePercent: "-1.29%",
        volume: "1.8B",
        isUp: false,
        icon: "Ξ"
      },
      {
        symbol: "ADAUSDT",
        name: "Cardano", 
        price: "0.4567",
        change: "+0.0234",
        changePercent: "+5.41%",
        volume: "456M",
        isUp: true,
        icon: "₳"
      },
      {
        symbol: "SOLUSDT",
        name: "Solana",
        price: "145.67",
        change: "-3.45",
        changePercent: "-2.31%", 
        volume: "789M",
        isUp: false,
        icon: "◎"
      },
      {
        symbol: "DOTUSDT",
        name: "Polkadot",
        price: "6.789",
        change: "+0.234",
        changePercent: "+3.57%",
        volume: "234M",
        isUp: true,
        icon: "●"
      }
    ],
    trending: [
      {
        symbol: "PEPEUSDT",
        name: "Pepe",
        price: "0.00001234",
        change: "+0.00000456",
        changePercent: "+58.9%",
        volume: "3.2B",
        isUp: true,
        icon: "🐸"
      },
      {
        symbol: "SHIBUSDT",
        name: "Shiba Inu",
        price: "0.00002456",
        change: "+0.00000789",
        changePercent: "+47.3%",
        volume: "2.1B",
        isUp: true,
        icon: "🐕"
      },
      {
        symbol: "DOGEUSDT",
        name: "Dogecoin",
        price: "0.1234",
        change: "+0.0234",
        changePercent: "+23.4%",
        volume: "1.5B",
        isUp: true,
        icon: "Ð"
      }
    ]
  };

  useEffect(() => {
    setWatchlistData(mockWatchlistData?.[selectedTab]);
  }, [selectedTab]);

  const handleSymbolClick = (symbol) => {
    // Navigate to advanced chart with selected symbol
    window.location.href = `/advanced-chart?symbol=${symbol}`;
  };

  const handleAddToWatchlist = () => {
    // Add new symbol to watchlist logic
    console.log('Add to watchlist');
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Watchlist</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="Plus"
            onClick={handleAddToWatchlist}
            className="text-muted-foreground hover:text-foreground"
          >
            Add
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1">
          {[
            { key: 'favorites', label: 'Favorites', icon: 'Star' },
            { key: 'trending', label: 'Trending', icon: 'TrendingUp' }
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
      {/* Watchlist Items */}
      <div className="flex-1 overflow-y-auto">
        {watchlistData?.map((item, index) => (
          <div
            key={item?.symbol}
            onClick={() => handleSymbolClick(item?.symbol)}
            className="p-3 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-smooth"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold">
                  {item?.icon}
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">{item?.symbol}</div>
                  <div className="text-xs text-muted-foreground">{item?.name}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-foreground text-sm text-data">${item?.price}</div>
                <div className={`text-xs flex items-center space-x-1 ${
                  item?.isUp ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={item?.isUp ? 'TrendingUp' : 'TrendingDown'} 
                    size={12} 
                  />
                  <span>{item?.changePercent}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Vol: {item?.volume}</span>
              <span className={item?.isUp ? 'text-success' : 'text-error'}>
                {item?.isUp ? '+' : ''}{item?.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          iconName="ExternalLink"
          iconPosition="right"
          onClick={() => window.location.href = '/market-scanner'}
        >
          View All Markets
        </Button>
      </div>
    </div>
  );
};

export default MarketWatchlist;