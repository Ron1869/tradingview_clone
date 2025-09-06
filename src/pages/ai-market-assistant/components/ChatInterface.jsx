import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../contexts/LanguageContext';

const ChatInterface = ({ chatHistory, onSendMessage, isAnalyzing, aiSettings }) => {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAnalyzing]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef?.current?.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message?.trim() && !isAnalyzing) {
      onSendMessage(message?.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendCustomPrompt = () => {
    if (customPrompt?.trim() && !isAnalyzing) {
      onSendMessage(`Пользовательский запрос: ${customPrompt?.trim()}`);
      setCustomPrompt('');
      setShowPromptEditor(false);
    }
  };

  const quickPrompts = [
    {
      id: 1,
      label: 'Анализ Bitcoin',
      prompt: 'Проведи технический анализ Bitcoin на текущий момент'
    },
    {
      id: 2,
      label: 'Прогноз Ethereum',
      prompt: 'Какой прогноз для Ethereum на ближайшие 24 часа?'
    },
    {
      id: 3,
      label: 'Рыночные тренды',
      prompt: 'Какие основные тренды на криптовалютном рынке сейчас?'
    },
    {
      id: 4,
      label: 'Торговые сигналы',
      prompt: 'Есть ли сейчас хорошие торговые сигналы для входа в позицию?'
    }
  ];

  const formatMessage = (text) => {
    // Simple formatting for better readability
    return text
      ?.replace(/Bitcoin|BTC/g, '<strong>Bitcoin</strong>')
      ?.replace(/Ethereum|ETH/g, '<strong>Ethereum</strong>')
      ?.replace(/\$\d+[,\d]*\.?\d*/g, '<span class="text-data font-medium">$&</span>')
      ?.replace(/\d+%/g, '<span class="text-data font-medium">$&</span>');
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Brain" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">ИИ Помощник</h3>
              <p className="text-sm text-muted-foreground">
                Модель: {aiSettings?.model?.toUpperCase()} • Анализ: {
                  aiSettings?.analysisType === 'technical' ? 'Технический' : 
                  aiSettings?.analysisType === 'fundamental' ? 'Фундаментальный' : 'Смешанный'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Edit"
              iconPosition="left"
              onClick={() => setShowPromptEditor(!showPromptEditor)}
            >
              {t('customPrompt')}
            </Button>
            <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-warning animate-pulse' : 'bg-success'}`}></div>
          </div>
        </div>
      </div>

      {/* Custom Prompt Editor */}
      {showPromptEditor && (
        <div className="border-b border-border p-4 bg-muted/5">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Пользовательский промт для ИИ
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e?.target?.value)}
              placeholder="Введите детальный запрос для ИИ анализа..."
              className="w-full h-24 p-3 bg-input border border-border rounded-md text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPromptEditor(false)}
              >
                Отмена
              </Button>
              <Button
                size="sm"
                onClick={handleSendCustomPrompt}
                disabled={!customPrompt?.trim() || isAnalyzing}
              >
                Отправить промт
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {chatHistory?.map((chat) => (
          <div
            key={chat?.id}
            className={`flex ${chat?.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-[80%] ${chat?.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                chat?.type === 'user' ?'bg-primary' :'bg-secondary'
              }`}>
                <Icon 
                  name={chat?.type === 'user' ? 'User' : 'Brain'} 
                  size={16} 
                  color="white" 
                />
              </div>
              
              <div className={`rounded-lg p-3 ${
                chat?.type === 'user' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground'
              }`}>
                <div 
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: chat?.type === 'ai' ? formatMessage(chat?.message) : chat?.message 
                  }}
                />
                <div className={`text-xs mt-2 opacity-70 ${
                  chat?.type === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}>
                  {chat?.timestamp?.toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isAnalyzing && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-[80%]">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="Brain" size={16} color="white" />
              </div>
              <div className="bg-muted text-foreground rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {t('analyzing')}...
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Quick Actions */}
      {chatHistory?.length <= 1 && (
        <div className="border-t border-border p-4">
          <div className="mb-3">
            <p className="text-sm font-medium text-foreground mb-2">Быстрые запросы:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickPrompts?.map((prompt) => (
                <Button
                  key={prompt?.id}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-left h-auto p-2"
                  onClick={() => onSendMessage(prompt?.prompt)}
                  disabled={isAnalyzing}
                >
                  <span className="text-xs">{prompt?.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-border p-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e?.target?.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('enterPrompt')}
              className="w-full p-3 bg-input border border-border rounded-md text-sm text-foreground placeholder-muted-foreground resize-none max-h-32 focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ minHeight: '44px' }}
              disabled={isAnalyzing}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message?.trim() || isAnalyzing}
            iconName="Send"
            className="px-4"
          />
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Нажмите Enter для отправки, Shift+Enter для новой строки</span>
          <span>{message?.length}/1000</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;