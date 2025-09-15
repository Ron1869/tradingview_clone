import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import Icon from '../../../components/AppIcon';
import MarketPredictionCard from './MarketPredictionCard';

const ChatMessage = ({ message }) => {
  const { t, locale } = useLanguage();

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessageContent = () => {
    if (message?.type === 'prediction' && message?.prediction) {
      return <MarketPredictionCard prediction={message?.prediction} />;
    }

    return (
      <div className="space-y-3">
        <p className="text-foreground whitespace-pre-wrap">{message?.content}</p>
        {message?.confidence && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="TrendingUp" size={12} />
            <span>{t('confidence', { confidence: Math.round(message?.confidence * 100) })}</span>
          </div>
        )}
        {message?.keyInsights && message?.keyInsights?.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
              <Icon name="Lightbulb" size={14} className="mr-1" />
              {t('keyInsights')}
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {message?.keyInsights?.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {message?.recommendations && message?.recommendations?.length > 0 && (
          <div className="bg-primary/10 rounded-lg p-3">
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
              <Icon name="Target" size={14} className="mr-1" />
              {t('recommendations')}
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {message?.recommendations?.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {message?.riskFactors && message?.riskFactors?.length > 0 && (
          <div className="bg-warning/10 rounded-lg p-3">
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
              <Icon name="AlertTriangle" size={14} className="mr-1" />
              {t('riskFactors')}
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {message?.riskFactors?.map((risk, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">!</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (message?.type === 'user') {
    return (
      <div className="flex items-start justify-end space-x-3">
        <div className="max-w-xs lg:max-w-md">
          <div className="bg-primary text-primary-foreground rounded-lg px-4 py-3">
            <p className="text-sm whitespace-pre-wrap">{message?.content}</p>
          </div>
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {formatTimestamp(message?.timestamp)}
          </div>
        </div>
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="User" size={16} color="white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        message?.isError ? 'bg-error' : 'bg-muted'
      }`}>
        <Icon name={message?.isError ? 'AlertCircle' : 'Bot'} size={16} color="white" />
      </div>
      <div className="max-w-xs lg:max-w-2xl flex-1">
        <div className={`rounded-lg px-4 py-3 ${
          message?.isError 
            ? 'bg-error/10 border border-error/20' :'bg-muted'
        }`}>
          {renderMessageContent()}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {formatTimestamp(message?.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
