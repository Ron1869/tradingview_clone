import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import ChartContainer from './components/ChartContainer';
import SymbolSidebar from './components/SymbolSidebar';
import TradingPanel from './components/TradingPanel';
import ChartControls from './components/ChartControls';
import MarketDepth from './components/MarketDepth';

const AdvancedChart = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSD');
  const [currentPrice, setCurrentPrice] = useState(45234.56);
  const [timeframe, setTimeframe] = useState('1h');
  const [chartType, setChartType] = useState('candlestick');
  const [indicators, setIndicators] = useState(['ma20', 'volume']);
  const [watchlist, setWatchlist] = useState([]);
  const [drawingMode, setDrawingMode] = useState(null);
  const [showPineScript, setShowPineScript] = useState(false);

  // Mock price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * (prev * 0.001);
        return parseFloat((prev + change)?.toFixed(2));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSymbolChange = (symbol) => {
    setSelectedSymbol(symbol);
    // Mock price for different symbols
    const prices = {
      'BTCUSD': 45234.56,
      'ETHUSD': 2847.23,
      'AAPL': 175.43,
      'GOOGL': 2847.63,
      'EURUSD': 1.0845
    };
    setCurrentPrice(prices?.[symbol] || 45234.56);
  };

  const handleScreenshot = () => {
    // Mock screenshot functionality
    alert('Скриншот графика сохранен в загрузки');
  };

  const handlePineScript = () => {
    setShowPineScript(!showPineScript);
  };

  const handleDrawingModeChange = (mode) => {
    setDrawingMode(mode);
  };

  return (
    <>
      <Helmet>
        <title>Продвинутые графики - TradingView</title>
        <meta name="description" content="Профессиональные торговые графики с техническим анализом, индикаторами и инструментами рисования для трейдеров" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Main Content */}
        <div className="pt-16 pb-16 md:pb-0 h-screen flex flex-col">
          {/* Chart Controls */}
          <ChartControls
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            chartType={chartType}
            onChartTypeChange={setChartType}
            indicators={indicators}
            onIndicatorsChange={setIndicators}
            onScreenshot={handleScreenshot}
            onPineScript={handlePineScript}
          />

          {/* Main Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Symbol Search & Watchlist */}
            <div className="hidden lg:block">
              <SymbolSidebar
                selectedSymbol={selectedSymbol}
                onSymbolChange={handleSymbolChange}
                onWatchlistUpdate={setWatchlist}
              />
            </div>

            {/* Center - Chart Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 p-4">
                <ChartContainer
                  selectedSymbol={selectedSymbol}
                  timeframe={timeframe}
                  chartType={chartType}
                  indicators={indicators}
                  onDrawingModeChange={handleDrawingModeChange}
                />
              </div>

              {/* Bottom - Market Depth */}
              <div className="h-80 p-4 pt-0">
                <MarketDepth
                  selectedSymbol={selectedSymbol}
                  currentPrice={currentPrice}
                />
              </div>
            </div>

            {/* Right Sidebar - Trading Panel */}
            <div className="hidden xl:block">
              <TradingPanel
                selectedSymbol={selectedSymbol}
                currentPrice={currentPrice}
              />
            </div>
          </div>
        </div>

        {/* Pine Script Editor Modal */}
        {showPineScript && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Pine Script Editor</h2>
                <button
                  onClick={() => setShowPineScript(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 p-4">
                <div className="bg-input border border-border rounded-lg h-full p-4">
                  <pre className="text-sm text-foreground font-mono">
{`//@version=5
indicator("Пользовательский индикатор", shorttitle="Custom", overlay=true)

// Параметры
length = input.int(20, title="Период MA")
source = input(close, title="Источник")

// Расчет скользящей средней
ma = ta.sma(source, length)

// Отображение на графике
plot(ma, color=color.blue, linewidth=2, title="MA")

// Сигналы
bullish = ta.crossover(close, ma)
bearish = ta.crossunder(close, ma)

plotshape(bullish, style=shape.triangleup, location=location.belowbar, 
          color=color.green, size=size.small, title="Покупка")
plotshape(bearish, style=shape.triangledown, location=location.abovebar, 
          color=color.red, size=size.small, title="Продажа")`}
                  </pre>
                </div>
              </div>
              
              <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Pine Script v5 - Создайте собственные индикаторы и стратегии
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                      Применить
                    </button>
                    <button className="px-4 py-2 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors">
                      Сохранить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Trading Panel */}
        <div className="xl:hidden fixed bottom-16 left-0 right-0 bg-card border-t border-border p-4 md:hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground text-data">{selectedSymbol}</div>
              <div className="text-xs text-muted-foreground">
                {new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'USD'
                })?.format(currentPrice)}
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-success text-white rounded-md text-sm font-medium">
                Купить
              </button>
              <button className="px-4 py-2 bg-error text-white rounded-md text-sm font-medium">
                Продать
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedChart;