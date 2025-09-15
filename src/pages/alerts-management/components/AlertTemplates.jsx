import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertTemplates = ({ onUseTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('popular');

  const templates = {
    popular: [
      {
        id: 1,
        name: "Прорыв цены биткоина",
        description: "Уведомление, когда BTC пробьет $45,000",
        alertType: "price",
        condition: "above",
        value: "45000",
        symbol: "BTCUSDT",
        uses: 1247
      },
      {
        id: 2,
        name: "Перепроданность RSI ETH",
        description: "Уведомление, когда RSI ETH упадет ниже 30",
        alertType: "technical",
        condition: "rsi_oversold",
        symbol: "ETHUSDT",
        uses: 892
      },
      {
        id: 3,
        name: "Скачок объема",
        description: "Уведомление при увеличении объема на 200%",
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
        name: "Бычье пересечение MACD",
        description: "Пересечение линии MACD выше сигнальной",
        alertType: "technical",
        condition: "macd_bullish",
        symbol: "BTCUSDT",
        uses: 445
      },
      {
        id: 5,
        name: "Перекупленность RSI",
        description: "Уведомление, когда RSI превысит 70",
        alertType: "technical",
        condition: "rsi_overbought",
        symbol: "ETHUSDT",
        uses: 378
      },
      {
        id: 6,
        name: "Пересечение МА",
        description: "50-дневная MA пересекает 200-дневную MA",
        alertType: "technical",
        condition: "ma_cross_bullish",
        symbol: "SOLUSDT",
        uses: 267
      }
    ],
    price: [
      {
        id: 7,
        name: "Тест поддержки",
        description: "Цена приближается к ключевой поддержке",
        alertType: "price",
        condition: "below",
        value: "30000",
        symbol: "BTCUSDT",
        uses: 523
      },
      {
        id: 8,
        name: "Прорыв сопротивления",
        description: "Прорыв основного сопротивления",
        alertType: "price",
        condition: "above",
        value: "2000",
        symbol: "ETHUSDT",
        uses: 412
      },
      {
        id: 9,
        name: "Дневной макс/мин",
        description: "Новые дневные максимумы или минимумы",
        alertType: "price",
        condition: "crosses_above",
        value: "0",
        symbol: "ADAUSDT",
        uses: 334
      }
    ]
  };

  const categories = [
    { id: 'popular', label: 'Популярные', icon: 'TrendingUp' },
    { id: 'technical', label: 'Технические', icon: 'BarChart3' },
    { id: 'price', label: 'Цена', icon: 'DollarSign' }
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
        <h3 className="text-lg font-semibold text-foreground mb-4">Шаблоны</h3>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1 bg-muted/10 p-1 rounded-lg">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setSelectedCategory(category?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth flex-1 justify-center ${
                selectedCategory === category?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={category?.icon} size={16} />
              <span className="truncate">{category?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Templates Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates?.[selectedCategory]?.map((template) => (
            <div key={template?.id} className="border border-border rounded-lg p-4 flex flex-col hover:bg-muted/5 transition-smooth">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={getTemplateIcon(template?.alertType)} size={16} className="text-primary" />
                </div>
                <span className="text-xs text-muted-foreground bg-muted/10 px-2 py-1 rounded whitespace-nowrap">
                  {template?.uses} исп.
                </span>
              </div>
              
              <div className="flex-grow">
                <h4 className="font-medium text-foreground mb-2 truncate">{template?.name}</h4>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template?.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-muted-foreground text-data truncate">{template?.symbol}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseTemplate(template)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  <span className="truncate">Исп.</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
          <span className="truncate">Доступны шаблоны сообщества</span>
          <Button variant="ghost" size="sm" iconName="ExternalLink">
            <span className="truncate">Посмотреть</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertTemplates;
