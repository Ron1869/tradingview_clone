import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onAction, onPredict, activeSymbol, onSymbolChange, isLoading }) => {
  const { t } = useLanguage();
  const [customSymbol, setCustomSymbol] = useState('');

  const popularSymbols = [
    'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 
    'NVDA', 'META', 'NFLX', 'AMD', 'BABA'
  ];

  const quickPrompts = [
    {
      title: 'Анализ рынка',
      prompt: 'Проанализируй текущее состояние фондового рынка США',
      icon: 'BarChart3'
    },
    {
      title: 'Технический анализ',
      prompt: `Проведи технический анализ ${activeSymbol}`,
      icon: 'TrendingUp'
    },
    {
      title: 'Новости рынка',
      prompt: 'Какие важные новости влияют на рынок сегодня?',
      icon: 'Newspaper'
    },
    {
      title: 'Риск-менеджмент',
      prompt: 'Дай советы по управлению рисками в торговле',
      icon: 'Shield'
    }
  ];

  const handleSymbolPredict = () => {
    const symbol = customSymbol?.toUpperCase() || activeSymbol;
    onPredict(symbol);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-foreground flex items-center">
        <Icon name="Zap" size={16} className="mr-2" />
        {t('currentLanguage') === 'ru' ? 'Быстрые действия' : 'Quick Actions'}
      </h3>
      {/* Market Prediction Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">{t('marketPrediction')}</h4>
        
        <div className="flex space-x-2">
          <Select
            value={activeSymbol}
            onValueChange={onSymbolChange}
            className="flex-1"
          >
            {popularSymbols?.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </Select>
          
          <Button
            onClick={handleSymbolPredict}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Icon name="TrendingUp" size={14} />
          </Button>
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="Или введите символ"
            value={customSymbol}
            onChange={(e) => setCustomSymbol(e?.target?.value?.toUpperCase())}
            className="flex-1 text-sm"
          />
          <Button
            onClick={handleSymbolPredict}
            disabled={isLoading || !customSymbol?.trim()}
            size="sm"
          >
            {t('predictMarket')}
          </Button>
        </div>
      </div>
      {/* Quick Prompts */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Быстрые запросы</h4>
        
        <div className="grid grid-cols-1 gap-2">
          {quickPrompts?.map((prompt, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => onAction(prompt?.prompt)}
              disabled={isLoading}
              className="justify-start h-auto p-3 text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Icon name={prompt?.icon} size={14} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">{prompt?.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {prompt?.prompt}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
      {/* Market Status */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Статус рынка</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-success font-medium">Открыт</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;