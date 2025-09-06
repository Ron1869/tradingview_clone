import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ChatInterface from './components/ChatInterface';
import PredictionDashboard from './components/PredictionDashboard';
import ConfigurationPanel from './components/ConfigurationPanel';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useLanguage } from '../../contexts/LanguageContext';

const AIMarketAssistant = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('chat');
  const [aiSettings, setAiSettings] = useState({
    model: 'gpt-5',
    analysisType: 'technical',
    riskTolerance: 'medium',
    timeframe: '1h',
    enablePredictions: true,
    autoRefresh: true,
    confidence: 0.75
  });
  const [marketData, setMarketData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize with mock market data
  useEffect(() => {
    const mockMarketData = [
      {
        symbol: 'BTCUSDT',
        price: '43,250.00',
        change: '+2.45%',
        volume: '1.2B',
        prediction: 'bullish',
        confidence: 0.78,
        target: '45,000',
        timestamp: new Date()
      },
      {
        symbol: 'ETHUSDT',
        price: '2,680.50',
        change: '-1.23%',
        volume: '850M',
        prediction: 'neutral',
        confidence: 0.62,
        target: '2,750',
        timestamp: new Date()
      },
      {
        symbol: 'ADAUSDT',
        price: '0.4850',
        change: '+5.67%',
        volume: '420M',
        prediction: 'bullish',
        confidence: 0.85,
        target: '0.52',
        timestamp: new Date()
      }
    ];

    const mockPredictions = [
      {
        id: 1,
        symbol: 'BTCUSDT',
        prediction: 'Сильный восходящий тренд ожидается в течение следующих 4 часов на основе технического анализа и объемов.',
        confidence: 0.78,
        timeframe: '4h',
        createdAt: new Date(),
        status: 'active'
      },
      {
        id: 2,
        symbol: 'ETHUSDT',
        prediction: 'Боковое движение с возможным пробоем уровня сопротивления 2750. Рекомендуется осторожность.',
        confidence: 0.62,
        timeframe: '6h',
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        status: 'monitoring'
      }
    ];

    setMarketData(mockMarketData);
    setPredictions(mockPredictions);

    // Initialize chat with welcome message
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      message: 'Привет! Я ваш ИИ помощник для анализа рынка. Я могу помочь с техническим анализом, прогнозированием цен и торговыми стратегиями. Какой инструмент хотели бы проанализировать?',
      timestamp: new Date()
    };
    setChatHistory([welcomeMessage]);
  }, []);

  const handleSendMessage = async (message) => {
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: message,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setIsAnalyzing(true);

    // Simulate AI response (in real app, this would call OpenAI API)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        message: generateAIResponse(message),
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateAIResponse = (userMessage) => {
    // Mock AI responses based on message content
    const responses = {
      bitcoin: 'Анализируя Bitcoin (BTC), я вижу сильные технические индикаторы. RSI находится на уровне 58, MACD показывает бычий кроссовер. Объем торгов увеличился на 23% за последние 24 часа. Рекомендую следить за уровнем сопротивления $45,000.',
      ethereum: 'По Ethereum (ETH) наблюдаю смешанные сигналы. Цена тестирует поддержку $2,650. Если удержится, возможно движение к $2,800. Важно следить за объемами и общим настроением рынка.',
      prediction: 'На основе текущих данных и алгоритмов машинного обучения, я прогнозирую умеренный рост BTC в ближайшие 4-6 часов с вероятностью 76%. Ключевые факторы: технические индикаторы, объем и рыночные новости.',
      default: 'Я анализирую ваш запрос... Для более точного анализа укажите конкретный инструмент или тип анализа (технический, фундаментальный, настроения рынка).'
    };

    const message = userMessage?.toLowerCase();
    if (message?.includes('bitcoin') || message?.includes('btc')) {
      return responses?.bitcoin;
    } else if (message?.includes('ethereum') || message?.includes('eth')) {
      return responses?.ethereum;
    } else if (message?.includes('прогноз') || message?.includes('предсказ')) {
      return responses?.prediction;
    } else {
      return responses?.default;
    }
  };

  const handleSettingsUpdate = (newSettings) => {
    setAiSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const handleGeneratePrediction = async (symbol) => {
    setIsAnalyzing(true);
    
    // Simulate prediction generation
    setTimeout(() => {
      const newPrediction = {
        id: Date.now(),
        symbol,
        prediction: `Новый прогноз для ${symbol} создан на основе текущих настроек ИИ. Анализ включает технические индикаторы, объемы и рыночные тренды.`,
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        timeframe: aiSettings?.timeframe,
        createdAt: new Date(),
        status: 'active'
      };
      
      setPredictions(prev => [newPrediction, ...prev]);
      setIsAnalyzing(false);
    }, 3000);
  };

  const tabs = [
    { id: 'chat', label: t('aiAssistant'), icon: 'MessageSquare' },
    { id: 'predictions', label: t('marketPrediction'), icon: 'TrendingUp' },
    { id: 'settings', label: t('aiSettings'), icon: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{t('aiAssistant')}</h1>
                <p className="text-muted-foreground mt-2">
                  Интеллектуальный анализ рынка и прогнозирование с помощью ИИ
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-warning animate-pulse' : 'bg-success'}`}></div>
                    <span className="text-sm font-medium text-foreground">
                      {isAnalyzing ? t('analyzing') : 'ИИ готов'}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => handleGeneratePrediction('BTCUSDT')}
                  disabled={isAnalyzing}
                >
                  {t('predictMarket')}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden">
              <div className="flex space-x-1 mb-6 bg-muted/10 p-1 rounded-lg">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth flex-1 justify-center ${
                      activeTab === tab?.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Desktop Tab Navigation */}
              <div className="hidden lg:flex space-x-1 mb-6 bg-muted/10 p-1 rounded-lg">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                      activeTab === tab?.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'chat' && (
                  <ChatInterface
                    chatHistory={chatHistory}
                    onSendMessage={handleSendMessage}
                    isAnalyzing={isAnalyzing}
                    aiSettings={aiSettings}
                  />
                )}

                {activeTab === 'predictions' && (
                  <PredictionDashboard
                    marketData={marketData}
                    predictions={predictions}
                    onGeneratePrediction={handleGeneratePrediction}
                    isAnalyzing={isAnalyzing}
                  />
                )}

                {activeTab === 'settings' && (
                  <ConfigurationPanel
                    aiSettings={aiSettings}
                    onSettingsUpdate={handleSettingsUpdate}
                  />
                )}
              </div>
            </div>

            {/* Sidebar - Market Overview */}
            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="space-y-6">
                {/* Quick Market Stats */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-4">Быстрый обзор рынка</h3>
                  <div className="space-y-3">
                    {marketData?.slice(0, 3)?.map((item) => (
                      <div key={item?.symbol} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            item?.prediction === 'bullish' ? 'bg-success' : 
                            item?.prediction === 'bearish' ? 'bg-error' : 'bg-warning'
                          }`}></div>
                          <span className="text-sm font-medium text-foreground text-data">
                            {item?.symbol}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground text-data">
                            ${item?.price}
                          </div>
                          <div className={`text-xs ${
                            item?.change?.startsWith('+') ? 'text-success' : 'text-error'
                          }`}>
                            {item?.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Status */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Статус ИИ</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Модель</span>
                      <span className="text-sm font-medium text-foreground">
                        {aiSettings?.model?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Анализ</span>
                      <span className="text-sm font-medium text-foreground">
                        {aiSettings?.analysisType === 'technical' ? 'Технический' : 
                         aiSettings?.analysisType === 'fundamental' ? 'Фундаментальный' : 'Смешанный'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Таймфрейм</span>
                      <span className="text-sm font-medium text-foreground">
                        {aiSettings?.timeframe}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Точность</span>
                      <span className="text-sm font-medium text-foreground">
                        {Math.round(aiSettings?.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Быстрые действия</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Brain"
                      iconPosition="left"
                      className="w-full justify-start"
                      onClick={() => handleGeneratePrediction('BTCUSDT')}
                      disabled={isAnalyzing}
                    >
                      Анализ Bitcoin
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="TrendingUp"
                      iconPosition="left"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('predictions')}
                    >
                      Все прогнозы
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Settings"
                      iconPosition="left"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('settings')}
                    >
                      Настройки ИИ
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMarketAssistant;