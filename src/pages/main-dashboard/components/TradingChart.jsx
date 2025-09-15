import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { useLanguage } from '../../../contexts/LanguageContext';

const TradingChart = () => {
  const { t } = useLanguage();
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const canvasRef = useRef(null);

  const symbolOptions = [
    { value: 'BTCUSDT', label: 'BTC/USDT' },
    { value: 'ETHUSDT', label: 'ETH/USDT' },
    { value: 'ADAUSDT', label: 'ADA/USDT' },
    { value: 'SOLUSDT', label: 'SOL/USDT' },
    { value: 'DOTUSDT', label: 'DOT/USDT' }
  ];

  const timeframeOptions = [
    { value: '1m', label: '1m' },
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '1h', label: '1h' },
    { value: '4h', label: '4h' },
    { value: '1d', label: '1D' },
    { value: '1w', label: '1W' }
  ];

  // Mock candlestick data
  const mockCandlestickData = [
    { time: '09:00', open: 67200, high: 67450, low: 67100, close: 67350, volume: 1234 },
    { time: '10:00', open: 67350, high: 67600, low: 67200, close: 67500, volume: 2345 },
    { time: '11:00', open: 67500, high: 67800, low: 67400, close: 67650, volume: 1876 },
    { time: '12:00', open: 67650, high: 67900, low: 67500, close: 67750, volume: 2987 },
    { time: '13:00', open: 67750, high: 68000, low: 67600, close: 67850, volume: 3456 },
    { time: '14:00', open: 67850, high: 68100, low: 67700, close: 67950, volume: 2234 },
    { time: '15:00', open: 67950, high: 68200, low: 67800, close: 68050, volume: 1987 },
    { time: '16:00', open: 68050, high: 68300, low: 67900, close: 68150, volume: 2876 }
  ];

  useEffect(() => {
    setChartData(mockCandlestickData);
  }, [selectedSymbol, selectedTimeframe]);

  useEffect(() => {
    if (canvasRef?.current && chartData?.length > 0) {
      drawChart();
    }
  }, [chartData]);

  const drawChart = () => {
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d');
    const { width, height } = canvas;

    // Clear canvas
    ctx?.clearRect(0, 0, width, height);

    // Set up chart dimensions
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Find min/max values
    const prices = chartData?.flatMap(d => [d?.high, d?.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx?.beginPath();
      ctx?.moveTo(padding, y);
      ctx?.lineTo(width - padding, y);
      ctx?.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= chartData?.length; i++) {
      const x = padding + (chartWidth / chartData?.length) * i;
      ctx?.beginPath();
      ctx?.moveTo(x, padding);
      ctx?.lineTo(x, height - padding);
      ctx?.stroke();
    }

    // Draw candlesticks
    const candleWidth = chartWidth / chartData?.length * 0.6;
    
    chartData?.forEach((candle, index) => {
      const x = padding + (chartWidth / chartData?.length) * index + (chartWidth / chartData?.length) * 0.2;
      const openY = padding + ((maxPrice - candle?.open) / priceRange) * chartHeight;
      const closeY = padding + ((maxPrice - candle?.close) / priceRange) * chartHeight;
      const highY = padding + ((maxPrice - candle?.high) / priceRange) * chartHeight;
      const lowY = padding + ((maxPrice - candle?.low) / priceRange) * chartHeight;

      const isGreen = candle?.close > candle?.open;
      
      // Draw wick
      ctx.strokeStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.lineWidth = 1;
      ctx?.beginPath();
      ctx?.moveTo(x + candleWidth / 2, highY);
      ctx?.lineTo(x + candleWidth / 2, lowY);
      ctx?.stroke();

      // Draw body
      ctx.fillStyle = isGreen ? '#10B981' : '#EF4444';
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY);
      ctx?.fillRect(x, bodyTop, candleWidth, bodyHeight || 1);
    });

    // Draw price labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '12px Inter';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice - (priceRange / 5) * i;
      const y = padding + (chartHeight / 5) * i;
      ctx?.fillText(price?.toFixed(0), padding - 10, y + 4);
    }

    // Draw time labels
    ctx.textAlign = 'center';
    chartData?.forEach((candle, index) => {
      const x = padding + (chartWidth / chartData?.length) * index + (chartWidth / chartData?.length) * 0.5;
      ctx?.fillText(candle?.time, x, height - 10);
    });
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      window.location.href = `/advanced-chart?symbol=${selectedSymbol}`;
    }
  };

  const currentPrice = chartData?.length > 0 ? chartData?.[chartData?.length - 1]?.close : 67234;
  const priceChange = chartData?.length > 1 ? 
    chartData?.[chartData?.length - 1]?.close - chartData?.[chartData?.length - 2]?.close : 0;
  const priceChangePercent = ((priceChange / currentPrice) * 100)?.toFixed(2);

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Select
              options={symbolOptions}
              value={selectedSymbol}
              onChange={setSelectedSymbol}
              className="w-32"
            />
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-foreground text-data">
                ${currentPrice?.toLocaleString()}
              </span>
              <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-success' : 'text-error'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange?.toFixed(2)} ({priceChangePercent}%)
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Maximize2"
              onClick={handleFullscreen}
              className="text-muted-foreground hover:text-foreground"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Settings"
              className="text-muted-foreground hover:text-foreground"
            />
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex space-x-1">
          {timeframeOptions?.map((tf) => (
            <button
              key={tf?.value}
              onClick={() => setSelectedTimeframe(tf?.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-smooth ${
                selectedTimeframe === tf?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tf?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Chart Area */}
      <div className="flex-1 p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-full border border-border rounded-md bg-background"
          style={{ maxHeight: '400px' }}
        />
      </div>
      {/* Chart Controls */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="TrendingUp"
              className="text-muted-foreground hover:text-foreground"
            >
              {t('indicators')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="PenTool"
              className="text-muted-foreground hover:text-foreground"
            >
              {t('draw')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Camera"
              className="text-muted-foreground hover:text-foreground"
            >
              {t('screenshot')}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {t('volume')}: {chartData?.length > 0 ? chartData?.[chartData?.length - 1]?.volume?.toLocaleString() : '0'}
            </span>
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-success">{t('live')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
