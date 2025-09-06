import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChartContainer = ({ selectedSymbol, timeframe, chartType, indicators, onDrawingModeChange }) => {
  const [chartData, setChartData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [drawingMode, setDrawingMode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const chartRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  // Suppress ResizeObserver error - common issue with ResponsiveContainer
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args?.[0] === 'string' && args?.[0]?.includes('ResizeObserver loop completed with undelivered notifications')) {
        // Suppress ResizeObserver loop error which is harmless in this context
        return;
      }
      originalError?.apply(console, args);
    };

    return () => {
      console.error = originalError;
      if (resizeTimeoutRef?.current) {
        clearTimeout(resizeTimeoutRef?.current);
      }
    };
  }, []);

  // Mock chart data generation with useCallback to prevent unnecessary re-renders
  const generateMockData = useCallback(() => {
    const data = [];
    const volumeData = [];
    const basePrice = selectedSymbol === 'BTCUSD' ? 45000 : selectedSymbol === 'ETHUSD' ? 2800 : 150;
    let currentPrice = basePrice;
    
    const timePoints = timeframe === '1m' ? 100 : timeframe === '5m' ? 288 : timeframe === '1h' ? 24 : 30;
    
    for (let i = 0; i < timePoints; i++) {
      const change = (Math.random() - 0.5) * (basePrice * 0.02);
      currentPrice += change;
      
      const high = currentPrice + Math.random() * (basePrice * 0.01);
      const low = currentPrice - Math.random() * (basePrice * 0.01);
      const open = i === 0 ? basePrice : data?.[i - 1]?.close || currentPrice;
      const close = currentPrice;
      const volume = Math.floor(Math.random() * 1000000) + 100000;
      
      const timestamp = new Date(Date.now() - (timePoints - i) * (timeframe === '1m' ? 60000 : timeframe === '5m' ? 300000 : timeframe === '1h' ? 3600000 : 86400000));
      
      data?.push({
        time: timestamp?.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        timestamp: timestamp?.getTime(),
        open: parseFloat(open?.toFixed(2)),
        high: parseFloat(high?.toFixed(2)),
        low: parseFloat(low?.toFixed(2)),
        close: parseFloat(close?.toFixed(2)),
        volume: volume,
        price: parseFloat(close?.toFixed(2))
      });
      
      volumeData?.push({
        time: timestamp?.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        volume: volume,
        color: close > open ? '#10B981' : '#EF4444'
      });
    }
    
    return { data, volumeData };
  }, [selectedSymbol, timeframe]);

  // Debounced data update to prevent rapid re-renders
  useEffect(() => {
    if (resizeTimeoutRef?.current) {
      clearTimeout(resizeTimeoutRef?.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      const { data, volumeData } = generateMockData();
      setChartData(data);
      setVolumeData(volumeData);
    }, 100);

    return () => {
      if (resizeTimeoutRef?.current) {
        clearTimeout(resizeTimeoutRef?.current);
      }
    };
  }, [generateMockData]);

  const handleDrawingTool = (tool) => {
    setDrawingMode(tool);
    onDrawingModeChange?.(tool);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleZoom = (direction) => {
    if (direction === 'in' && zoomLevel < 3) {
      setZoomLevel(zoomLevel + 0.2);
    } else if (direction === 'out' && zoomLevel > 0.5) {
      setZoomLevel(zoomLevel - 0.2);
    }
  };

  // Memoized tooltip components to prevent re-renders
  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between space-x-4">
              <span className="text-muted-foreground">Открытие:</span>
              <span className="text-foreground font-medium text-data">{data?.open}</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-muted-foreground">Максимум:</span>
              <span className="text-foreground font-medium text-data">{data?.high}</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-muted-foreground">Минимум:</span>
              <span className="text-foreground font-medium text-data">{data?.low}</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-muted-foreground">Закрытие:</span>
              <span className="text-foreground font-medium text-data">{data?.close}</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-muted-foreground">Объем:</span>
              <span className="text-foreground font-medium text-data">{data?.volume?.toLocaleString('ru-RU')}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }, []);

  const VolumeTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-2 shadow-elevated">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-sm font-medium text-data">
            Объем: {payload?.[0]?.value?.toLocaleString('ru-RU')}
          </p>
        </div>
      );
    }
    return null;
  }, []);

  return (
    <div className={`bg-card border border-border rounded-lg ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">{selectedSymbol}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Таймфрейм:</span>
            <span className="text-sm font-medium text-foreground text-data">{timeframe}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Тип:</span>
            <span className="text-sm font-medium text-foreground">{chartType === 'candlestick' ? 'Свечи' : chartType === 'line' ? 'Линия' : 'Область'}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Drawing Tools */}
          <div className="flex items-center space-x-1 mr-4">
            <Button
              variant={drawingMode === 'trendline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleDrawingTool('trendline')}
            >
              <Icon name="TrendingUp" size={16} />
            </Button>
            <Button
              variant={drawingMode === 'horizontal' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleDrawingTool('horizontal')}
            >
              <Icon name="Minus" size={16} />
            </Button>
            <Button
              variant={drawingMode === 'rectangle' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleDrawingTool('rectangle')}
            >
              <Icon name="Square" size={16} />
            </Button>
            <Button
              variant={drawingMode === 'fibonacci' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleDrawingTool('fibonacci')}
            >
              <Icon name="GitBranch" size={16} />
            </Button>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 mr-4">
            <Button variant="ghost" size="sm" onClick={() => handleZoom('in')}>
              <Icon name="ZoomIn" size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleZoom('out')}>
              <Icon name="ZoomOut" size={16} />
            </Button>
            <span className="text-xs text-muted-foreground px-2">{Math.round(zoomLevel * 100)}%</span>
          </div>
          
          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
            <Icon name={isFullscreen ? "Minimize2" : "Maximize2"} size={16} />
          </Button>
        </div>
      </div>

      {/* Chart Area with error boundary */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[500px]'} p-4`} ref={chartRef}>
        <div className="h-[70%] mb-4">
          {chartData?.length > 0 && (
            <ResponsiveContainer 
              width="100%" 
              height="100%"
              debounceMs={150}
              style={{ overflow: 'visible' }}
            >
              {chartType === 'line' ? (
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tick={{ fill: 'var(--color-muted-foreground)' }}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tick={{ fill: 'var(--color-muted-foreground)' }}
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="close" 
                    stroke="var(--color-primary)" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: 'var(--color-primary)' }}
                  />
                  {indicators?.includes('ma20') && (
                    <Line 
                      type="monotone" 
                      dataKey="ma20" 
                      stroke="var(--color-warning)" 
                      strokeWidth={1}
                      dot={false}
                      strokeDasharray="5 5"
                    />
                  )}
                  {indicators?.includes('ma50') && (
                    <Line 
                      type="monotone" 
                      dataKey="ma50" 
                      stroke="var(--color-success)" 
                      strokeWidth={1}
                      dot={false}
                      strokeDasharray="5 5"
                    />
                  )}
                </LineChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tick={{ fill: 'var(--color-muted-foreground)' }}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tick={{ fill: 'var(--color-muted-foreground)' }}
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="close" 
                    stroke="var(--color-primary)" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Volume Chart */}
        <div className="h-[30%]">
          {volumeData?.length > 0 && (
            <ResponsiveContainer 
              width="100%" 
              height="100%"
              debounceMs={150}
              style={{ overflow: 'visible' }}
            >
              <BarChart data={volumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="time" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tick={{ fill: 'var(--color-muted-foreground)' }}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tick={{ fill: 'var(--color-muted-foreground)' }}
                />
                <Tooltip content={<VolumeTooltip />} />
                <Bar 
                  dataKey="volume" 
                  fill="var(--color-muted)"
                  opacity={0.7}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart Status */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-muted-foreground">Последнее обновление:</span>
          <span className="text-foreground text-data">{new Date()?.toLocaleTimeString('ru-RU')}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-success text-xs">Подключено</span>
          </div>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">Задержка: 0мс</span>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;