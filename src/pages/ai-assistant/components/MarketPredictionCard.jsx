import React from 'react';
import Icon from '../../../components/AppIcon';

const MarketPredictionCard = ({ prediction }) => {
  const getDirectionIcon = (direction) => {
    switch (direction) {
      case 'bullish': return 'TrendingUp';
      case 'bearish': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getDirectionColor = (direction) => {
    switch (direction) {
      case 'bullish': return 'text-success';
      case 'bearish': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getDirectionLabel = (direction) => {
    switch (direction) {
      case 'bullish': return 'Рост';
      case 'bearish': return 'Падение';
      default: return 'Нейтрально';
    }
  };

  const getRiskLabel = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'Низкий';
      case 'medium': return 'Средний';
      case 'high': return 'Высокий';
      default: return riskLevel;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Прогноз по {prediction?.symbol}</h3>
            <p className="text-xs text-muted-foreground">{prediction?.timeframe}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`flex items-center space-x-1 ${getDirectionColor(prediction?.direction)}`}>
            <Icon name={getDirectionIcon(prediction?.direction)} size={16} />
            <span className="font-medium">{getDirectionLabel(prediction?.direction)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.round(prediction?.confidence * 100)}% уверенность
          </div>
        </div>
      </div>
      {/* Prediction Summary */}
      <div className="bg-muted/30 rounded-lg p-3">
        <p className="text-sm text-foreground">{prediction?.prediction}</p>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Уровень риска</h4>
          <div className={`text-sm font-medium ${getRiskColor(prediction?.risk_level)}`}>
            {getRiskLabel(prediction?.risk_level)}
          </div>
        </div>
        
        {prediction?.targets && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Цели</h4>
            <div className="text-sm text-muted-foreground">
              {prediction?.targets?.target_price && (
                <div>Цель: ${prediction?.targets?.target_price?.toFixed(2)}</div>
              )}
              {prediction?.targets?.support && (
                <div>Поддержка: ${prediction?.targets?.support?.toFixed(2)}</div>
              )}
              {prediction?.targets?.resistance && (
                <div>Сопротивление: ${prediction?.targets?.resistance?.toFixed(2)}</div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Key Factors */}
      {prediction?.key_factors && prediction?.key_factors?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <Icon name="Key" size={14} className="mr-1" />
            Ключевые факторы
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {prediction?.key_factors?.map((factor, index) => (
              <div key={index} className="flex items-start text-xs text-muted-foreground">
                <span className="mr-2 text-primary">•</span>
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Confidence Indicator */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">Достоверность прогноза</span>
        <div className="flex items-center space-x-2">
          <div className="w-16 h-2 bg-muted rounded-full">
            <div 
              className="h-2 bg-primary rounded-full transition-all"
              style={{ width: `${prediction?.confidence * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-foreground">
            {Math.round(prediction?.confidence * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketPredictionCard;