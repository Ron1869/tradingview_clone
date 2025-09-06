import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

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
  const [showIndicators, setShowIndicators] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);

  const timeframes = [
    { value: '1m', label: '1м' },
    { value: '5m', label: '5м' },
    { value: '15m', label: '15м' },
    { value: '30m', label: '30м' },
    { value: '1h', label: '1ч' },
    { value: '4h', label: '4ч' },
    { value: '1D', label: '1Д' },
    { value: '1W', label: '1Н' },
    { value: '1M', label: '1М' }
  ];

  const chartTypes = [
    { value: 'candlestick', label: 'Свечи' },
    { value: 'line', label: 'Линия' },
    { value: 'area', label: 'Область' },
    { value: 'bars', label: 'Бары' }
  ];

  const availableIndicators = [
    { id: 'ma20', name: 'MA(20)', description: 'Скользящая средняя 20', category: 'trend' },
    { id: 'ma50', name: 'MA(50)', description: 'Скользящая средняя 50', category: 'trend' },
    { id: 'ma200', name: 'MA(200)', description: 'Скользящая средняя 200', category: 'trend' },
    { id: 'ema12', name: 'EMA(12)', description: 'Экспоненциальная MA 12', category: 'trend' },
    { id: 'ema26', name: 'EMA(26)', description: 'Экспоненциальная MA 26', category: 'trend' },
    { id: 'bb', name: 'Bollinger Bands', description: 'Полосы Боллинджера', category: 'volatility' },
    { id: 'rsi', name: 'RSI(14)', description: 'Индекс относительной силы', category: 'momentum' },
    { id: 'macd', name: 'MACD', description: 'Схождение-расхождение скользящих средних', category: 'momentum' },
    { id: 'stoch', name: 'Stochastic', description: 'Стохастический осциллятор', category: 'momentum' },
    { id: 'volume', name: 'Volume', description: 'Объем торгов', category: 'volume' },
    { id: 'vwap', name: 'VWAP', description: 'Средневзвешенная по объему цена', category: 'volume' },
    { id: 'supertrend', name: 'SuperTrend', description: 'Супертренд индикатор', category: 'trend' }
  ];

  const drawingTools = [
    { id: 'trendline', name: 'Трендовая линия', icon: 'TrendingUp' },
    { id: 'horizontal', name: 'Горизонтальная линия', icon: 'Minus' },
    { id: 'vertical', name: 'Вертикальная линия', icon: 'Separator' },
    { id: 'rectangle', name: 'Прямоугольник', icon: 'Square' },
    { id: 'circle', name: 'Круг', icon: 'Circle' },
    { id: 'fibonacci', name: 'Фибоначчи', icon: 'GitBranch' },
    { id: 'pitchfork', name: 'Вилы Эндрюса', icon: 'GitMerge' },
    { id: 'gann', name: 'Веер Ганна', icon: 'Zap' }
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
            <span className="text-sm font-medium text-muted-foreground">Таймфрейм:</span>
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
              Индикаторы
              <Icon name="ChevronDown" size={14} className="ml-2" />
            </Button>

            {showIndicators && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevated z-50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Технические индикаторы</h3>
                  
                  {/* Trend Indicators */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Трендовые
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

                  {/* Momentum Indicators */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Осцилляторы
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

                  {/* Volume Indicators */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Объемные
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

                  {/* Volatility Indicators */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Волатильность
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
              Инструменты
              <Icon name="ChevronDown" size={14} className="ml-2" />
            </Button>

            {showDrawingTools && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevated z-50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Инструменты рисования</h3>
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
            Pine Script
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
            <span className="text-xs text-muted-foreground">Активные индикаторы:</span>
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