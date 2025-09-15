import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../contexts/LanguageContext';

const PortfolioSummary = () => {
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = useState('24h');

  const mockPortfolioData = {
    totalBalance: "125,847.32",
    totalBalanceChange: "+3,456.78",
    totalBalanceChangePercent: "+2.82%",
    availableBalance: "23,456.78",
    positions: [
      {
        symbol: "BTCUSDT",
        name: t('bitcoin'),
        amount: "1.2345",
        value: "82,945.67",
        pnl: "+2,345.67",
        pnlPercent: "+2.91%",
        isUp: true,
        allocation: 65.9
      },
      {
        symbol: "ETHUSDT", 
        name: t('ethereum'),
        amount: "8.7654",
        value: "30,289.45",
        pnl: "-456.78",
        pnlPercent: "-1.49%",
        isUp: false,
        allocation: 24.1
      },
      {
        symbol: "ADAUSDT",
        name: t('cardano'),
        amount: "15,432.1",
        value: "7,045.23",
        pnl: "+567.89",
        pnlPercent: "+8.76%",
        isUp: true,
        allocation: 5.6
      },
      {
        symbol: "SOLUSDT",
        name: t('solana'), 
        amount: "38.456",
        value: "5,566.97",
        pnl: "-123.45",
        pnlPercent: "-2.17%",
        isUp: false,
        allocation: 4.4
      }
    ],
    performance: {
      "24h": { pnl: "+2,234.56", pnlPercent: "+1.81%" },
      "7d": { pnl: "+5,678.90", pnlPercent: "+4.73%" },
      "30d": { pnl: "+12,345.67", pnlPercent: "+10.87%" },
      "1y": { pnl: "+45,678.90", pnlPercent: "+57.32%" }
    }
  };

  const currentPerformance = mockPortfolioData?.performance?.[timeframe];

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">{t('portfolio')}</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreHorizontal"
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        {/* Total Balance */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-foreground text-data">
            ${mockPortfolioData?.totalBalance}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-success text-sm font-medium">
              {mockPortfolioData?.totalBalanceChange}
            </span>
            <span className="text-success text-sm">
              ({mockPortfolioData?.totalBalanceChangePercent})
            </span>
            <Icon name="TrendingUp" size={14} className="text-success" />
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex space-x-1">
          {['24h', '7d', '30d', '1y']?.map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-smooth ${
                timeframe === period
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      {/* Performance Summary */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t('pnl')} ({timeframe})</span>
          <div className="flex items-center space-x-2">
            <span className="text-success font-medium text-data">
              {currentPerformance?.pnl}
            </span>
            <span className="text-success text-sm">
              ({currentPerformance?.pnlPercent})
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">{t('available')}</span>
          <span className="font-medium text-foreground text-data">
            ${mockPortfolioData?.availableBalance}
          </span>
        </div>
      </div>
      {/* Positions */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">{t('positions')}</h4>
          <div className="space-y-3">
            {mockPortfolioData?.positions?.map((position, index) => (
              <div
                key={position?.symbol}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer"
                onClick={() => window.location.href = `/advanced-chart?symbol=${position?.symbol}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {position?.symbol?.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      {position?.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {position?.amount} {position?.symbol?.replace('USDT', '')}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-foreground text-sm text-data">
                    ${position?.value}
                  </div>
                  <div className={`text-xs flex items-center justify-end space-x-1 ${
                    position?.isUp ? 'text-success' : 'text-error'
                  }`}>
                    <Icon 
                      name={position?.isUp ? 'TrendingUp' : 'TrendingDown'} 
                      size={10} 
                    />
                    <span>{position?.pnlPercent}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
          >
            {t('buy')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Minus"
            iconPosition="left"
          >
            {t('sell')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
