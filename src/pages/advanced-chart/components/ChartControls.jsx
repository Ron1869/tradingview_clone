import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { useLanguage } from '../../../contexts/LanguageContext';

const ChartControls = ({ 
  timeframe, 
  onTimeframeChange, 
  chartType, 
  onChartTypeChange, 
  indicators, 
  onIndicatorsChange,
  onScreenshot,
  onPineScript 
}) => {
  const { t } = useLanguage();
  const [showIndicators, setShowIndicators] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);

  const timeframes = [
    { value: '1m', label: t('timeframe1m') },
    { value: '5m', label: t('timeframe5m') },
    { value: '15m', label: t('timeframe15m') },
    { value: '30m', label: t('timeframe30m') },
    { value: '1h', label: t('timeframe1h') },
    { value: '4h', label: t('timeframe4h') },
    { value: '1D', label: t('timeframe1d') },
    { value: '1W', label: t('timeframe1w') },
    { value: '1M', label: t('timeframe1M') }
  ];

  const chartTypes = [
    { value: 'candlestick', label: t('chartTypeCandles') },
    { value: 'line', label: t('chartTypeLine') },
    { value: 'area', label: t('chartTypeArea') },
    { value: 'bars', label: t('chartTypeBars') }
  ];

  const availableIndicators = [
    { id: 'ma20', name: 'MA(20)', description: t('indicatorMA20'), category: 'trend' },
    { id: 'ma50', name: 'MA(50)', description: t('indicatorMA50'), category: 'trend' },
    { id: 'ma200', name: 'MA(200)', description: t('indicatorMA200'), category: 'trend' },
    { id: 'ema12', name: 'EMA(12)', description: t('indicatorEMA12'), category: 'trend' },
    { id: 'ema26', name: 'EMA(26)', description: t('indicatorEMA26'), category: 'trend' },
    { id: 'bb', name: 'Bollinger Bands', description: t('indicatorBB'), category: 'volatility' },
    { id: 'rsi', name: 'RSI(14)', description: t('indicatorRSI'), category: 'momentum' },
    { id: 'macd', name: 'MACD', description: t('indicatorMACD'), category: 'momentum' },
    { id: 'stoch', name: 'Stochastic', description: t('indicatorStoch'), category: 'momentum' },
    { id: 'volume', name: 'Volume', description: t('indicatorVolume'), category: 'volume' },
    { id: 'vwap', name: 'VWAP', description: t('indicatorVWAP'), category: 'volume' },
    { id: 'supertrend', name: 'SuperTrend', description: t('indicatorSupertrend'), category: 'trend' }
  ];

  const drawingTools = [
    { id: 'trendline', name: t('toolTrendline'), icon: 'TrendingUp' },
    { id: 'horizontal', name: t('toolHorizontalLine'), icon: 'Minus' },
    { id: 'vertical', name: t('toolVerticalLine'), icon: 'Separator' },
    { id: 'rectangle', name: t('toolRectangle'), icon: 'Square' },
    { id: 'circle', name: t('toolCircle'), icon: 'Circle' },
    { id: 'fibonacci', name: t('toolFibonacci'), icon: 'GitBranch' },
    { id: 'pitchfork', name: t('toolPitchfork'), icon: 'GitMerge' },
    { id: 'gann', name: t('toolGannFan'), icon: 'Zap' }
  ];

  const toggleIndicator = (indicatorId) => {
    const newIndicators = indicators?.includes(indicatorId)
      ? indicators?.filter(id => id !== indicatorId)
      : [...indicators, indicatorId];
    onIndicatorsChange(newIndicators);
  };

  const getIndicatorsByCategory = (category) => {
    return availableIndicators?.filter(indicator => indicator?.category === category);
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="flex items-center justify-between p-4">
        {/* Left Section - Timeframes */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">{t('timeframeLabel')}</span>
            <div className="flex space-x-1">
              {timeframes?.map((tf) => (
                <Button
                  key={tf?.value}
                  variant={timeframe === tf?.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onTimeframeChange(tf?.value)}
                  className="px-3 py-1 text-xs"
                >
                  {tf?.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Section - Chart Type */}
        <div className="flex items-center space-x-4">
          <Select
            options={chartTypes}
            value={chartType}
            onChange={onChartTypeChange}
            className="w-32"
          />
        </div>

        {/* Right Section - Tools */}
        <div className="flex items-center space-x-2">
          {/* Indicators */}
          <div className="relative">
            <Button
              variant={showIndicators ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowIndicators(!showIndicators)}
            >
              <Icon name="BarChart3" size={16} className="mr-2" />
              {t('indicators')}
              <Icon name="ChevronDown" size={14} className="ml-2" />
            </Button>

            {showIndicators && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevated z-50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">{t('technicalIndicators')}</h3>
                  
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      {t('trendIndicators')}
                    </h4>
                    <div className="space-y-2">
                      {getIndicatorsByCategory('trend')?.map((indicator) => (
                        <label key={indicator?.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={indicators?.includes(indicator?.id)}
                            onChange={() => toggleIndicator(indicator?.id)}
                            className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">{indicator?.name}</div>
                            <div className="text-xs text-muted-foreground">{indicator?.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      {t('momentumIndicators')}
                    </h4>
                    <div className="space-y-2">
                      {getIndicatorsByCategory('momentum')?.map((indicator) => (
                        <label key={indicator?.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={indicators?.includes(indicator?.id)}
                            onChange={() => toggleIndicator(indicator?.id)}
                            className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">{indicator?.name}</div>
                            <div className="text-xs text-muted-foreground">{indicator?.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      {t('volumeIndicators')}
                    </h4>
                    <div className="space-y-2">
                      {getIndicatorsByCategory('volume')?.map((indicator) => (
                        <label key={indicator?.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={indicators?.includes(indicator?.id)}
                            onChange={() => toggleIndicator(indicator?.id)}
                            className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">{indicator?.name}</div>
                            <div className="text-xs text-muted-foreground">{indicator?.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      {t('volatilityIndicators')}
                    </h4>
                    <div className="space-y-2">
                      {getIndicatorsByCategory('volatility')?.map((indicator) => (
                        <label key={indicator?.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={indicators?.includes(indicator?.id)}
                            onChange={() => toggleIndicator(indicator?.id)}
                            className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">{indicator?.name}</div>
                            <div className="text-xs text-muted-foreground">{indicator?.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawing Tools */}
          <div className="relative">
            <Button
              variant={showDrawingTools ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowDrawingTools(!showDrawingTools)}
            >
              <Icon name="Edit" size={16} className="mr-2" />
              {t('tools')}
              <Icon name="ChevronDown" size={14} className="ml-2" />
            </Button>

            {showDrawingTools && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevated z-50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">{t('drawingTools')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {drawingTools?.map((tool) => (
                      <Button
                        key={tool?.id}
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                      >
                        <Icon name={tool?.icon} size={16} className="mr-2" />
                        {tool?.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pine Script */}
          <Button variant="ghost" size="sm" onClick={onPineScript}>
            <Icon name="Code" size={16} className="mr-2" />
            {t('pineScript')}
          </Button>

          {/* Screenshot */}
          <Button variant="ghost" size="sm" onClick={onScreenshot}>
            <Icon name="Camera" size={16} />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Icon name="Settings" size={16} />
          </Button>
        </div>
      </div>
      {/* Active Indicators Display */}
      {indicators?.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">{t('activeIndicatorsLabel')}</span>
            <div className="flex flex-wrap gap-2">
              {indicators?.map((indicatorId) => {
                const indicator = availableIndicators?.find(ind => ind?.id === indicatorId);
                return indicator ? (
                  <span
                    key={indicatorId}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary"
                  >
                    {indicator?.name}
                    <button
                      onClick={() => toggleIndicator(indicatorId)}
                      className="ml-1 hover:text-primary/80"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartControls;
