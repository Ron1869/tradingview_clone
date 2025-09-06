import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { aiMarketService } from '../../services/aiService';
import ChatMessage from './components/ChatMessage';
import AISettings from './components/AISettings';
import QuickActions from './components/QuickActions';


const AIAssistant = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [aiSettings, setAISettings] = useState({
    reasoningDepth: 'medium',
    analysisType: 'hybrid',
    includeSentiment: true,
    verbosity: 'medium'
  });
  const [activeSymbol, setActiveSymbol] = useState('AAPL');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: t('currentLanguage') === 'ru' 
        ? 'Привет! Я ваш ИИ-помощник для анализа рынка. Задавайте вопросы о торговле, анализе акций или используйте быстрые действия ниже.' :'Hello! I\'m your AI market analysis assistant. Ask me about trading, stock analysis, or use the quick actions below.',
      timestamp: new Date()?.toISOString(),
    };
    setMessages([welcomeMessage]);
  }, [t]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (customMessage = null) => {
    const messageText = customMessage || inputMessage?.trim();
    if (!messageText) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()?.toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiMarketService?.customAnalysis(messageText, {
        reasoningDepth: aiSettings?.reasoningDepth,
        verbosity: aiSettings?.verbosity,
        includeConfidence: true
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response?.analysis,
        confidence: response?.confidence,
        keyInsights: response?.key_insights,
        riskFactors: response?.risk_factors,
        recommendations: response?.recommendations,
        timestamp: new Date()?.toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: t('currentLanguage') === 'ru' 
          ? 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.' :'Sorry, there was an error processing your request. Please try again.',
        isError: true,
        timestamp: new Date()?.toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarketPrediction = async (symbol) => {
    const predictionMessage = t('currentLanguage') === 'ru' 
      ? `Проанализируй ${symbol} и предскажи движение цены`
      : `Analyze ${symbol} and predict price movement`;

    setIsLoading(true);
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: predictionMessage,
      timestamp: new Date()?.toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const prediction = await aiMarketService?.predictMarketTrends(symbol, {
        reasoningDepth: aiSettings?.reasoningDepth,
        analysisType: aiSettings?.analysisType,
        includeSentiment: aiSettings?.includeSentiment
      });

      const predictionMessageAI = {
        id: Date.now() + 1,
        type: 'prediction',
        content: prediction?.reasoning,
        prediction: prediction,
        timestamp: new Date()?.toISOString(),
      };

      setMessages(prev => [...prev, predictionMessageAI]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: error?.message,
        isError: true,
        timestamp: new Date()?.toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'ai',
      content: t('currentLanguage') === 'ru' 
        ? 'Чат очищен. Как могу помочь с анализом рынка?' :'Chat cleared. How can I help with market analysis?',
      timestamp: new Date()?.toISOString(),
    }]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Icon name="Bot" size={20} color="white" />
                </div>
                <span>{t('aiAssistant')}</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('currentLanguage') === 'ru' 
                  ? 'Интеллектуальный анализ рынка и торговые рекомендации' :'Intelligent market analysis and trading recommendations'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={clearChat}
                disabled={isLoading}
              >
                <Icon name="RotateCcw" size={16} className="mr-2" />
                {t('currentLanguage') === 'ru' ? 'Очистить' : 'Clear'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowSettings(!showSettings)}
                className={showSettings ? 'bg-muted' : ''}
              >
                <Icon name="Settings" size={16} className="mr-2" />
                {t('aiSettings')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col h-[calc(100vh-280px)]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages?.map((message) => (
                    <ChatMessage key={message?.id} message={message} />
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-center space-x-3 text-muted-foreground">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <Icon name="Bot" size={16} />
                      </div>
                      <div className="bg-muted rounded-lg px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                          <span className="text-sm ml-2">{t('analyzing')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-border p-4">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e?.target?.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('enterPrompt')}
                        disabled={isLoading}
                        className="min-h-[44px]"
                        multiline
                      />
                    </div>
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage?.trim() || isLoading}
                      className="h-11 px-4"
                    >
                      <Icon name="Send" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <QuickActions 
                onAction={handleSendMessage}
                onPredict={handleMarketPrediction}
                activeSymbol={activeSymbol}
                onSymbolChange={setActiveSymbol}
                isLoading={isLoading}
              />

              {/* AI Settings */}
              {showSettings && (
                <AISettings
                  settings={aiSettings}
                  onSettingsChange={setAISettings}
                />
              )}

              {/* Market Overview */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                  <Icon name="TrendingUp" size={16} className="mr-2" />
                  {t('currentLanguage') === 'ru' ? 'Обзор рынка' : 'Market Overview'}
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">S&P 500</span>
                    <span className="text-success">+0.75%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">NASDAQ</span>
                    <span className="text-success">+1.12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">VIX</span>
                    <span className="text-error">-2.34%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">USD/RUB</span>
                    <span className="text-warning">+0.23%</span>
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

export default AIAssistant;