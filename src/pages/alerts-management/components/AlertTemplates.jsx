import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertTemplates = ({ onUseTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('popular');

  const templates = {
    popular: [
      {
        id: 1,
        name: "Bitcoin Price Breakout",
        description: "Alert when BTC breaks above $45,000",
        alertType: "price",
        condition: "above",
        value: "45000",
        symbol: "BTCUSDT",
        uses: 1247
      },
      {
        id: 2,
        name: "Ethereum RSI Oversold",
        description: "Alert when ETH RSI drops below 30",
        alertType: "technical",
        condition: "rsi_oversold",
        symbol: "ETHUSDT",
        uses: 892
      },
      {
        id: 3,
        name: "Volume Spike Detection",
        description: "Alert on 200% volume increase",
        alertType: "volume",
        condition: "spike",
        value: "200",
        symbol: "ADAUSDT",
        uses: 634
      }
    ],
    technical: [
      {
        id: 4,
        name: "MACD Bullish Cross",
        description: "Alert on MACD line crossing above signal",
        alertType: "technical",
        condition: "macd_bullish",
        symbol: "BTCUSDT",
        uses: 445
      },
      {
        id: 5,
        name: "RSI Overbought",
        description: "Alert when RSI exceeds 70",
        alertType: "technical",
        condition: "rsi_overbought",
        symbol: "ETHUSDT",
        uses: 378
      },
      {
        id: 6,
        name: "Moving Average Cross",
        description: "50-day MA crosses above 200-day MA",
        alertType: "technical",
        condition: "ma_cross_bullish",
        symbol: "SOLUSDT",
        uses: 267
      }
    ],
    price: [
      {
        id: 7,
        name: "Support Level Test",
        description: "Alert when price approaches key support",
        alertType: "price",
        condition: "below",
        value: "30000",
        symbol: "BTCUSDT",
        uses: 523
      },
      {
        id: 8,
        name: "Resistance Breakout",
        description: "Alert on breaking major resistance",
        alertType: "price",
        condition: "above",
        value: "2000",
        symbol: "ETHUSDT",
        uses: 412
      },
      {
        id: 9,
        name: "Daily High/Low",
        description: "Alert on new daily highs or lows",
        alertType: "price",
        condition: "crosses_above",
        value: "0",
        symbol: "ADAUSDT",
        uses: 334
      }
    ]
  };

  const categories = [
    { id: 'popular', label: 'Popular', icon: 'TrendingUp' },
    { id: 'technical', label: 'Technical', icon: 'BarChart3' },
    { id: 'price', label: 'Price', icon: 'DollarSign' }
  ];

  const handleUseTemplate = (template) => {
    const alertData = {
      symbol: template?.symbol,
      alertType: template?.alertType,
      condition: template?.condition,
      value: template?.value || '',
      notifications: {
        push: true,
        email: false,
        sms: false
      }
    };
    
    onUseTemplate(alertData);
  };

  const getTemplateIcon = (alertType) => {
    const icons = {
      price: 'DollarSign',
      technical: 'TrendingUp',
      volume: 'BarChart3',
      percentage: 'Percent'
    };
    return icons?.[alertType] || 'Bell';
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Alert Templates</h3>
        
        {/* Category Tabs */}
        <div className="flex space-x-1">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setSelectedCategory(category?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                selectedCategory === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={category?.icon} size={16} />
              <span>{category?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Templates Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates?.[selectedCategory]?.map((template) => (
            <div key={template?.id} className="border border-border rounded-lg p-4 hover:bg-muted/5 transition-smooth">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={getTemplateIcon(template?.alertType)} size={16} className="text-primary" />
                </div>
                <span className="text-xs text-muted-foreground bg-muted/10 px-2 py-1 rounded">
                  {template?.uses} uses
                </span>
              </div>
              
              <h4 className="font-medium text-foreground mb-2">{template?.name}</h4>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template?.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground text-data">{template?.symbol}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseTemplate(template)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Use
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/5">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Community templates available</span>
          <Button variant="ghost" size="sm" iconName="ExternalLink">
            Browse More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertTemplates;