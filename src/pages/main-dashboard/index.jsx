import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import MetricsCards from './components/MetricsCards';
import TradingChart from './components/TradingChart';
import MarketWatchlist from './components/MarketWatchlist';
import PortfolioSummary from './components/PortfolioSummary';
import TradingPanel from './components/TradingPanel';
import RecentTrades from './components/RecentTrades';
import MarketNews from './components/MarketNews';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

const MainDashboard = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [layoutConfig, setLayoutConfig] = useState('default');

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
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
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-lg font-medium text-foreground">{t('loadingDashboard')}</div>
          <div className="text-sm text-muted-foreground">{t('initializingWorkspace')}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('tradingDashboard')} - {t('appName')}</title>
        <meta name="description" content={t('welcomeMessage')} />
      </Helmet>
      
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('tradingDashboard')}</h1>
          <p className="text-muted-foreground">{t('welcomeMessage')}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Layout"
            onClick={() => handleLayoutChange(layoutConfig === 'default' ? 'compact' : 'default')}
          >
            {layoutConfig === 'default' ? t('compactLayout') : t('defaultLayout')}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={handleResetLayout}
            className="text-muted-foreground hover:text-foreground"
          >
            {t('reset')}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            className="text-muted-foreground hover:text-foreground"
          >
            {t('customize')}
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <MetricsCards />

      {/* Main Dashboard Grid */}
      <div className={`grid gap-6 ${
        layoutConfig === 'compact' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-4'
      }`}>
        
        {/* Primary Chart Section */}
        <div className={`${
          layoutConfig === 'compact' ? 'lg:col-span-2' : 'lg:col-span-3'
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
          <h3 className="text-lg font-semibold text-foreground">{t('quickActions')}</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="TrendingUp"
              onClick={() => window.location.href = '/advanced-chart'}
            >
              {t('advancedCharts')}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Search"
              onClick={() => window.location.href = '/market-scanner'}
            >
              {t('marketScanner')}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Bell"
              onClick={() => window.location.href = '/alerts-management'}
            >
              {t('manageAlerts')}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Users"
              onClick={() => window.location.href = '/social-trading-feed'}
            >
              {t('socialFeed')}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>{t('marketDataLive')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} />
            <span>{t('secureConnection')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>{t('lastUpdated')}: {new Date()?.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDashboard;
