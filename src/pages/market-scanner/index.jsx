import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import FilterPanel from './components/FilterPanel';
import PresetScans from './components/PresetScans';
import ScanResults from './components/ScanResults';
import ScanHistory from './components/ScanHistory';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MarketScanner = () => {
  const [filters, setFilters] = useState({
    assetClass: 'all',
    marketCap: 'all',
    technicalPattern: 'all',
    volume: 'all',
    minPrice: '',
    maxPrice: '',
    minChange: '',
    maxChange: '',
    resultsCount: 0
  });

  const [activePreset, setActivePreset] = useState(null);
  const [scanResults, setScanResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(null);

  // Mock scan history data
  const [scanHistory] = useState([
    {
      id: 1,
      name: 'High Volume Breakouts',
      timestamp: Date.now() - 86400000, // 1 day ago
      resultsCount: 23,
      avgPerformance: 3.2,
      filters: { technicalPattern: 'breakout', volume: 'high' }
    },
    {
      id: 2,
      name: 'Oversold Bounce',
      timestamp: Date.now() - 172800000, // 2 days ago
      resultsCount: 15,
      avgPerformance: -1.8,
      filters: { technicalPattern: 'reversal', maxChange: '-5' }
    },
    {
      id: 3,
      name: 'Momentum Stocks',
      timestamp: Date.now() - 259200000, // 3 days ago
      resultsCount: 31,
      avgPerformance: 5.7,
      filters: { minChange: '5', volume: 'above_avg' }
    }
  ]);

  // Mock scan results data
  const mockResults = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: '$175.43',
      change: '+2.1%',
      volume: '52.3M',
      marketCap: '$2.75T',
      rsi: 65.2,
      isNew: true
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: '$248.50',
      change: '+5.8%',
      volume: '89.1M',
      marketCap: '$789.2B',
      rsi: 72.1,
      isNew: false
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: '$2,847.63',
      change: '-0.8%',
      volume: '28.7M',
      marketCap: '$1.82T',
      rsi: 45.3,
      isNew: false
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: '$378.85',
      change: '+1.2%',
      volume: '35.2M',
      marketCap: '$2.81T',
      rsi: 58.7,
      isNew: false
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      price: '$875.28',
      change: '+7.3%',
      volume: '67.8M',
      marketCap: '$2.16T',
      rsi: 78.9,
      isNew: true
    },
    {
      symbol: 'AMD',
      name: 'Advanced Micro Devices',
      price: '$142.67',
      change: '+3.4%',
      volume: '45.6M',
      marketCap: '$230.1B',
      rsi: 62.4,
      isNew: false
    },
    {
      symbol: 'BTC-USD',
      name: 'Bitcoin',
      price: '$67,234.50',
      change: '+4.2%',
      volume: '$28.9B',
      marketCap: '$1.32T',
      rsi: 69.1,
      isNew: false
    },
    {
      symbol: 'ETH-USD',
      name: 'Ethereum',
      price: '$3,456.78',
      change: '+6.1%',
      volume: '$15.2B',
      marketCap: '$415.8B',
      rsi: 71.5,
      isNew: true
    }
  ];

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setIsScanning(true);
    setActivePreset(null);
    
    // Simulate scanning delay
    setTimeout(() => {
      const filteredResults = mockResults?.filter(result => {
        let matches = true;
        
        if (filters?.assetClass !== 'all') {
          if (filters?.assetClass === 'crypto' && !result?.symbol?.includes('-USD')) {
            matches = false;
          } else if (filters?.assetClass === 'stocks' && result?.symbol?.includes('-USD')) {
            matches = false;
          }
        }
        
        if (filters?.minPrice && parseFloat(result?.price?.replace(/[^0-9.]/g, '')) < parseFloat(filters?.minPrice)) {
          matches = false;
        }
        
        if (filters?.maxPrice && parseFloat(result?.price?.replace(/[^0-9.]/g, '')) > parseFloat(filters?.maxPrice)) {
          matches = false;
        }
        
        const change = parseFloat(result?.change?.replace('%', ''));
        if (filters?.minChange && change < parseFloat(filters?.minChange)) {
          matches = false;
        }
        
        if (filters?.maxChange && change > parseFloat(filters?.maxChange)) {
          matches = false;
        }
        
        return matches;
      });
      
      setScanResults(filteredResults);
      setFilters(prev => ({ ...prev, resultsCount: filteredResults?.length }));
      setLastScanTime(new Date());
      setIsScanning(false);
    }, 1500);
  };

  const handleResetFilters = () => {
    setFilters({
      assetClass: 'all',
      marketCap: 'all',
      technicalPattern: 'all',
      volume: 'all',
      minPrice: '',
      maxPrice: '',
      minChange: '',
      maxChange: '',
      resultsCount: 0
    });
    setScanResults([]);
    setActivePreset(null);
  };

  const handleSelectPreset = (preset) => {
    setActivePreset(preset?.id);
    setFilters(prev => ({ ...prev, ...preset?.filters }));
    
    // Auto-apply preset filters
    setTimeout(() => {
      handleApplyFilters();
    }, 100);
  };

  const handleAddToWatchlist = (symbol) => {
    // Mock add to watchlist functionality
    console.log(`Added ${symbol} to watchlist`);
    // In real app, this would make an API call
  };

  const handleOpenChart = (symbol) => {
    // Navigate to advanced chart with selected symbol
    window.location.href = `/advanced-chart?symbol=${symbol}`;
  };

  const handleExportResults = () => {
    // Mock export functionality
    const csvContent = [
      ['Symbol', 'Name', 'Price', 'Change', 'Volume', 'Market Cap', 'RSI'],
      ...scanResults?.map(result => [
        result?.symbol,
        result?.name,
        result?.price,
        result?.change,
        result?.volume,
        result?.marketCap,
        result?.rsi
      ])
    ]?.map(row => row?.join(','))?.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market_scan_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const handleLoadHistoricalScan = (scan) => {
    setFilters(prev => ({ ...prev, ...scan?.filters }));
    setActivePreset(null);
    handleApplyFilters();
  };

  const handleDeleteScan = (scanId) => {
    // Mock delete functionality
    console.log(`Deleted scan ${scanId}`);
  };

  // Auto-refresh results every 30 seconds when scanning is active
  useEffect(() => {
    if (scanResults?.length > 0) {
      const interval = setInterval(() => {
        // Update timestamps and add/remove some results to simulate real-time updates
        setScanResults(prev => prev?.map(result => ({
          ...result,
          isNew: Math.random() > 0.9,
          isRemoved: Math.random() > 0.95
        })));
        setLastScanTime(new Date());
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [scanResults?.length]);

  return (
    <>
      <Helmet>
        <title>Market Scanner - TradingView Clone</title>
        <meta name="description" content="Powerful market scanning tools to identify trading opportunities across multiple asset classes with real-time filtering and analysis." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Market Scanner</h1>
                  <p className="text-muted-foreground mt-1">
                    Discover trading opportunities with powerful screening tools
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {isScanning && (
                    <div className="flex items-center space-x-2 text-primary">
                      <div className="animate-spin">
                        <Icon name="Loader2" size={16} />
                      </div>
                      <span className="text-sm font-medium">Scanning...</span>
                    </div>
                  )}
                  {lastScanTime && (
                    <div className="text-sm text-muted-foreground">
                      Last scan: {lastScanTime?.toLocaleTimeString()}
                    </div>
                  )}
                  <Button
                    variant="default"
                    onClick={handleApplyFilters}
                    disabled={isScanning}
                    iconName="Search"
                    iconPosition="left"
                  >
                    {isScanning ? 'Scanning...' : 'Run Scan'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Filters and Presets */}
              <div className="lg:col-span-1 space-y-6">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onApplyFilters={handleApplyFilters}
                  onResetFilters={handleResetFilters}
                />
                
                <PresetScans
                  onSelectPreset={handleSelectPreset}
                  activePreset={activePreset}
                />
                
                <ScanHistory
                  history={scanHistory}
                  onLoadHistoricalScan={handleLoadHistoricalScan}
                  onDeleteScan={handleDeleteScan}
                />
              </div>

              {/* Main Content - Results */}
              <div className="lg:col-span-3">
                <ScanResults
                  results={scanResults}
                  onAddToWatchlist={handleAddToWatchlist}
                  onOpenChart={handleOpenChart}
                  onExportResults={handleExportResults}
                />
              </div>
            </div>

            {/* Quick Stats */}
            {scanResults?.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-2xl font-bold text-success">
                    {scanResults?.filter(r => parseFloat(r?.change?.replace('%', '')) > 0)?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Gainers</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-2xl font-bold text-error">
                    {scanResults?.filter(r => parseFloat(r?.change?.replace('%', '')) < 0)?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Losers</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-2xl font-bold text-warning">
                    {scanResults?.filter(r => r?.rsi > 70)?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Overbought</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">
                    {scanResults?.filter(r => r?.rsi < 30)?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Oversold</div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default MarketScanner;