import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import MetricsCards from './components/MetricsCards';
import TradingChart from './components/TradingChart';
import MarketWatchlist from './components/MarketWatchlist';
import PortfolioSummary from './components/PortfolioSummary';
import TradingPanel from './components/TradingPanel';
import RecentTrades from './components/RecentTrades';
import MarketNews from './components/MarketNews';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MainDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [layoutConfig, setLayoutConfig] = useState('default');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Simulate loading time for dashboard initialization
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    // Load saved layout configuration from localStorage
    const savedLayout = localStorage.getItem('dashboard-layout');
    if (savedLayout) {
      setLayoutConfig(savedLayout);
    }
  }, []);

  const handleLayoutChange = (newLayout) => {
    setLayoutConfig(newLayout);
    localStorage.setItem('dashboard-layout', newLayout);
  };

  const handleResetLayout = () => {
    setLayoutConfig('default');
    localStorage.removeItem('dashboard-layout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-16 md:pb-0">
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="text-lg font-medium text-foreground">Loading Dashboard...</div>
              <div className="text-sm text-muted-foreground">Initializing trading workspace</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Main Dashboard - TradingView Clone</title>
        <meta name="description" content="Professional trading dashboard with real-time market data, charts, and portfolio management" />
      </Helmet>
      <Header />
      <div className="pt-16 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-6">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Trading Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Monitor your portfolio and execute trades efficiently.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Layout"
                onClick={() => handleLayoutChange(layoutConfig === 'default' ? 'compact' : 'default')}
              >
                {layoutConfig === 'default' ? 'Compact' : 'Default'} Layout
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="RotateCcw"
                onClick={handleResetLayout}
                className="text-muted-foreground hover:text-foreground"
              >
                Reset
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="Settings"
                className="text-muted-foreground hover:text-foreground"
              >
                Customize
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <MetricsCards />

          {/* Main Dashboard Grid */}
          <div className={`grid gap-6 ${
            layoutConfig === 'compact' ?'grid-cols-1 lg:grid-cols-3' :'grid-cols-1 lg:grid-cols-4'
          }`}>
            
            {/* Primary Chart Section */}
            <div className={`${
              layoutConfig === 'compact' ?'lg:col-span-2' :'lg:col-span-3'
            } space-y-6`}>
              
              {/* Trading Chart */}
              <div className="h-[500px]">
                <TradingChart />
              </div>
              
              {/* Secondary Widgets Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[400px]">
                  <RecentTrades />
                </div>
                <div className="h-[400px]">
                  <MarketNews />
                </div>
              </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              
              {/* Trading Panel */}
              <div className="h-[500px]">
                <TradingPanel />
              </div>
              
              {/* Market Watchlist */}
              <div className="h-[400px]">
                <MarketWatchlist />
              </div>
              
              {/* Portfolio Summary */}
              <div className="h-[400px]">
                <PortfolioSummary />
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="mt-8 bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="TrendingUp"
                  onClick={() => window.location.href = '/advanced-chart'}
                >
                  Advanced Charts
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Search"
                  onClick={() => window.location.href = '/market-scanner'}
                >
                  Market Scanner
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Bell"
                  onClick={() => window.location.href = '/alerts-management'}
                >
                  Manage Alerts
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Users"
                  onClick={() => window.location.href = '/social-trading-feed'}
                >
                  Social Feed
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Market Data Live</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={12} />
                <span>Secure Connection</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>Last Updated: {new Date()?.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;