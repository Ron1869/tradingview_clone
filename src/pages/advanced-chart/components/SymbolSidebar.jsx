import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useLanguage } from '../../../contexts/LanguageContext';

const SymbolSidebar = ({ selectedSymbol, onSymbolChange, onWatchlistUpdate }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('watchlist');
  const [watchlist, setWatchlist] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [marketData, setMarketData] = useState({});

  const mockSymbols = [
    { symbol: 'BTCUSD', name: 'Bitcoin', price: 45234.56, change: 2.34, changePercent: 5.45, volume: '2.1B', category: 'crypto' },
    { symbol: 'ETHUSD', name: 'Ethereum', price: 2847.23, change: -45.67, changePercent: -1.58, volume: '1.8B', category: 'crypto' },
    { symbol: 'ADAUSD', name: 'Cardano', price: 0.4523, change: 0.0234, changePercent: 5.45, volume: '456M', category: 'crypto' },
    { symbol: 'SOLUSD', name: 'Solana', price: 98.76, change: 3.45, changePercent: 3.62, volume: '234M', category: 'crypto' },
    { symbol: 'DOTUSD', name: 'Polkadot', price: 6.78, change: -0.23, changePercent: -3.28, volume: '123M', category: 'crypto' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24, volume: '45.2M', category: 'stocks' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2847.63, change: -23.45, changePercent: -0.81, volume: '1.2M', category: 'stocks' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: 5.23, changePercent: 2.15, volume: '78.9M', category: 'stocks' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 1.95, changePercent: 0.52, volume: '23.4M', category: 'stocks' },
    { symbol: 'EURUSD', name: 'Euro / US Dollar', price: 1.0845, change: 0.0023, changePercent: 0.21, volume: '5.6B', category: 'forex' },
    { symbol: 'GBPUSD', name: 'British Pound / US Dollar', price: 1.2634, change: -0.0045, changePercent: -0.35, volume: '3.2B', category: 'forex' },
    { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', price: 149.85, change: 0.67, changePercent: 0.45, volume: '4.1B', category: 'forex' }
  ];

  useEffect(() => {
    const defaultWatchlist = ['BTCUSD', 'ETHUSD', 'AAPL', 'GOOGL', 'EURUSD'];
    setWatchlist(defaultWatchlist);
    
    const data = {};
    mockSymbols?.forEach(symbol => {
      data[symbol.symbol] = symbol;
    });
    setMarketData(data);
  }, []);

  useEffect(() => {
    if (searchQuery?.trim()) {
      const filtered = mockSymbols?.filter(symbol =>
        symbol?.symbol?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        symbol?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSymbolSelect = (symbol) => {
    onSymbolChange(symbol);
    setSearchQuery('');
    setActiveTab('watchlist');
  };

  const toggleWatchlist = (symbol) => {
    const newWatchlist = watchlist?.includes(symbol)
      ? watchlist?.filter(s => s !== symbol)
      : [...watchlist, symbol];
    
    setWatchlist(newWatchlist);
    onWatchlistUpdate(newWatchlist);
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-success' : 'text-error';
  };

  const formatPrice = (price) => {
    return price < 1 ? price?.toFixed(4) : price?.toFixed(2);
  };

  const formatChange = (change, percent) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change?.toFixed(2)} (${sign}${percent?.toFixed(2)}%)`;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'crypto': return 'Bitcoin';
      case 'stocks': return 'TrendingUp';
      case 'forex': return 'DollarSign';
      default: return 'BarChart3';
    }
  };

  const renderSymbolItem = (symbolData, showCategory = false) => {
    const isSelected = selectedSymbol === symbolData?.symbol;
    const isInWatchlist = watchlist?.includes(symbolData?.symbol);
    
    return (
      <div
        key={symbolData?.symbol}
        className={`p-3 border border-border rounded-lg cursor-pointer transition-smooth hover:bg-muted ${
          isSelected ? 'bg-primary/10 border-primary' : 'bg-card'
        }`}
        onClick={() => handleSymbolSelect(symbolData?.symbol)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {showCategory && (
              <Icon name={getCategoryIcon(symbolData?.category)} size={16} className="text-muted-foreground" />
            )}
            <span className="font-medium text-foreground text-data">{symbolData?.symbol}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                toggleWatchlist(symbolData?.symbol);
              }}
              className="p-1 h-auto"
            >
              <Icon 
                name={isInWatchlist ? "Star" : "StarOff"} 
                size={14} 
                className={isInWatchlist ? "text-warning" : "text-muted-foreground"} 
              />
            </Button>
          </div>
          <span className={`text-sm font-medium text-data ${getChangeColor(symbolData?.change)}`}>
            {formatPrice(symbolData?.price)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate">{symbolData?.name}</span>
          <div className="text-right">
            <div className={`text-xs font-medium text-data ${getChangeColor(symbolData?.change)}`}>
              {formatChange(symbolData?.change, symbolData?.changePercent)}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('volume')}: {symbolData?.volume}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t('symbols')}</h2>
        
        {/* Search */}
        <Input
          type="search"
          placeholder={t('searchSymbols')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="mb-4"
        />
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              activeTab === 'watchlist' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('favorites')}
          </button>
          <button
            onClick={() => setActiveTab('markets')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              activeTab === 'markets' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('markets')}
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {searchQuery?.trim() ? (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              {t('searchResults')} ({searchResults?.length})
            </h3>
            {searchResults?.length > 0 ? (
              searchResults?.map(symbol => renderSymbolItem(symbol, true))
            ) : (
              <div className="text-center py-8">
                <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">{t('noSymbolsFound')}</p>
              </div>
            )}
          </div>
        ) : activeTab === 'watchlist' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t('favoriteSymbols')} ({watchlist?.length})
              </h3>
              <Button variant="ghost" size="sm">
                <Icon name="Settings" size={16} />
              </Button>
            </div>
            
            {watchlist?.length > 0 ? (
              watchlist?.map(symbol => {
                const symbolData = marketData?.[symbol];
                return symbolData ? renderSymbolItem(symbolData) : null;
              })
            ) : (
              <div className="text-center py-8">
                <Icon name="Star" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-2">{t('noFavoriteSymbols')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('addFavoritesHint')}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Crypto */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                <Icon name="Bitcoin" size={16} className="mr-2" />
                {t('cryptocurrencies')}
              </h3>
              <div className="space-y-3">
                {mockSymbols?.filter(s => s?.category === 'crypto')?.map(symbol => renderSymbolItem(symbol))}
              </div>
            </div>
            
            {/* Stocks */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                <Icon name="TrendingUp" size={16} className="mr-2" />
                {t('stocks')}
              </h3>
              <div className="space-y-3">
                {mockSymbols?.filter(s => s?.category === 'stocks')?.map(symbol => renderSymbolItem(symbol))}
              </div>
            </div>
            
            {/* Forex */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                <Icon name="DollarSign" size={16} className="mr-2" />
                {t('forex')}
              </h3>
              <div className="space-y-3">
                {mockSymbols?.filter(s => s?.category === 'forex')?.map(symbol => renderSymbolItem(symbol))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t('updatedLabel')} {new Date()?.toLocaleTimeString(t('locale'))}</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>{t('online')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolSidebar;
