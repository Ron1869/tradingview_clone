import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCards = () => {
  const [metrics, setMetrics] = useState({});
  const [marketStatus, setMarketStatus] = useState('open');

  const mockMetricsData = {
    accountBalance: {
      value: "125,847.32",
      change: "+3,456.78",
      changePercent: "+2.82%",
      isUp: true,
      icon: "Wallet",
      label: "Account Balance",
      currency: "USDT"
    },
    dailyPnL: {
      value: "2,234.56",
      change: "+567.89",
      changePercent: "+34.2%",
      isUp: true,
      icon: "TrendingUp",
      label: "Daily P&L",
      currency: "USDT"
    },
    totalPositions: {
      value: "12",
      change: "+2",
      changePercent: "+20%",
      isUp: true,
      icon: "Briefcase",
      label: "Open Positions",
      currency: ""
    },
    marketCap: {
      value: "2.45T",
      change: "+45.6B",
      changePercent: "+1.9%",
      isUp: true,
      icon: "Globe",
      label: "Total Market Cap",
      currency: "USD"
    }
  };

  useEffect(() => {
    setMetrics(mockMetricsData);
    
    // Simulate market status updates
    const statusInterval = setInterval(() => {
      const statuses = ['open', 'pre-market', 'closed'];
      const currentIndex = statuses?.indexOf(marketStatus);
      const nextIndex = (currentIndex + 1) % statuses?.length;
      setMarketStatus(statuses?.[nextIndex]);
    }, 10000);

    return () => clearInterval(statusInterval);
  }, [marketStatus]);

  const getMarketStatusInfo = () => {
    switch (marketStatus) {
      case 'open':
        return {
          label: 'Market Open',
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'Circle'
        };
      case 'pre-market':
        return {
          label: 'Pre-Market',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'Clock'
        };
      case 'closed':
        return {
          label: 'Market Closed',
          color: 'text-error',
          bgColor: 'bg-error/10',
          icon: 'XCircle'
        };
      default:
        return {
          label: 'Unknown',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          icon: 'HelpCircle'
        };
    }
  };

  const statusInfo = getMarketStatusInfo();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Market Status Card */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${statusInfo?.bgColor}`}>
            <Icon name={statusInfo?.icon} size={20} className={statusInfo?.color} />
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${statusInfo?.color?.replace('text-', 'bg-')}`}></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Market Status</h3>
          <div className={`text-lg font-bold ${statusInfo?.color}`}>
            {statusInfo?.label}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date()?.toLocaleTimeString('en-US', { 
              hour12: false,
              hour: '2-digit',
              minute: '2-digit'
            })} UTC
          </div>
        </div>
      </div>
      {/* Dynamic Metrics Cards */}
      {Object.entries(metrics)?.map(([key, metric]) => (
        <div key={key} className="bg-card border border-border rounded-lg p-4 hover:bg-muted/30 transition-smooth cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name={metric?.icon} size={20} className="text-primary" />
            </div>
            <div className={`flex items-center space-x-1 ${metric?.isUp ? 'text-success' : 'text-error'}`}>
              <Icon name={metric?.isUp ? 'TrendingUp' : 'TrendingDown'} size={14} />
              <span className="text-xs font-medium">{metric?.changePercent}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">{metric?.label}</h3>
            <div className="text-lg font-bold text-foreground text-data">
              {metric?.currency && metric?.currency !== '' ? `${metric?.currency === 'USD' ? '$' : ''}${metric?.value}${metric?.currency === 'USDT' ? ' USDT' : ''}` : metric?.value}
            </div>
            <div className={`text-xs font-medium ${metric?.isUp ? 'text-success' : 'text-error'}`}>
              {metric?.isUp ? '+' : ''}{metric?.change} {metric?.currency === 'USDT' ? 'USDT' : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;