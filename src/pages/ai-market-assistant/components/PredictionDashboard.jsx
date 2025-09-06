import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { useLanguage } from '../../../contexts/LanguageContext';

const PredictionDashboard = ({ marketData, predictions, onGeneratePrediction, isAnalyzing }) => {
  const { t } = useLanguage();
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [filterConfidence, setFilterConfidence] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const confidenceOptions = [
    { value: 'all', label: 'Все уровни доверия' },
    { value: 'high', label: 'Высокое доверие (>80%)' },
    { value: 'medium', label: 'Среднее доверие (60-80%)' },
    { value: 'low', label: 'Низкое доверие (<60%)' }
  ];

  const symbolOptions = marketData?.map(item => ({
    value: item?.symbol,
    label: item?.symbol
  })) || [];

  const sortOptions = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'oldest', label: 'Сначала старые' },
    { value: 'confidence', label: 'По уровню доверия' },
    { value: 'symbol', label: 'По символу' }
  ];

  const filteredPredictions = predictions
    ?.filter(prediction => {
      if (filterConfidence === 'all') return true;
      if (filterConfidence === 'high') return prediction?.confidence > 0.8;
      if (filterConfidence === 'medium') return prediction?.confidence >= 0.6 && prediction?.confidence <= 0.8;
      if (filterConfidence === 'low') return prediction?.confidence < 0.6;
      return true;
    })
    ?.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b?.createdAt) - new Date(a?.createdAt);
      if (sortBy === 'oldest') return new Date(a?.createdAt) - new Date(b?.createdAt);
      if (sortBy === 'confidence') return b?.confidence - a?.confidence;
      if (sortBy === 'symbol') return a?.symbol?.localeCompare(b?.symbol);
      return 0;
    });

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.8) return 'Высокое';
    if (confidence >= 0.6) return 'Среднее';
    return 'Низкое';
  };

  const getPredictionStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'monitoring': return 'Clock';
      case 'completed': return 'Flag';
      default: return 'Circle';
    }
  };

  const getPredictionStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'monitoring': return 'text-warning';
      case 'completed': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} час${hours > 1 ? (hours < 5 ? 'а' : 'ов') : ''} назад`;
    }
    return `${minutes} минут${minutes > 1 ? (minutes < 5 ? 'ы' : '') : 'у'} назад`;
  };

  return (
    <div className="space-y-6">
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketData?.slice(0, 3)?.map((item) => (
          <div key={item?.symbol} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  item?.prediction === 'bullish' ? 'bg-success' : 
                  item?.prediction === 'bearish' ? 'bg-error' : 'bg-warning'
                }`}></div>
                <span className="font-semibold text-foreground text-data">{item?.symbol}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="Brain"
                onClick={() => onGeneratePrediction(item?.symbol)}
                disabled={isAnalyzing}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Цена</span>
                <span className="font-medium text-foreground text-data">${item?.price}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Изменение</span>
                <span className={`font-medium ${
                  item?.change?.startsWith('+') ? 'text-success' : 'text-error'
                }`}>
                  {item?.change}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Объем</span>
                <span className="font-medium text-foreground text-data">{item?.volume}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Прогноз</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    item?.prediction === 'bullish' ? 'text-success' : 
                    item?.prediction === 'bearish' ? 'text-error' : 'text-warning'
                  }`}>
                    {item?.prediction === 'bullish' ? 'Рост' : 
                     item?.prediction === 'bearish' ? 'Падение' : 'Боковик'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(item?.confidence * 100)}%)
                  </span>
                </div>
              </div>
              
              {item?.target && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Цель</span>
                  <span className="font-medium text-foreground text-data">${item?.target}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prediction Controls */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Прогнозы ИИ</h3>
            <p className="text-sm text-muted-foreground">
              Анализ рынка и прогнозирование на основе машинного обучения
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Select
              value={selectedSymbol}
              onChange={(value) => setSelectedSymbol(value)}
              options={symbolOptions}
              placeholder="Выберите символ"
              className="w-full sm:w-40"
            />
            <Button
              variant="default"
              iconName="Brain"
              iconPosition="left"
              onClick={() => onGeneratePrediction(selectedSymbol)}
              disabled={isAnalyzing}
              className="w-full sm:w-auto"
            >
              {isAnalyzing ? t('analyzing') : 'Создать прогноз'}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <Select
          value={filterConfidence}
          onChange={(value) => setFilterConfidence(value)}
          options={confidenceOptions}
          className="w-full sm:w-48"
        />
        <Select
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          options={sortOptions}
          className="w-full sm:w-48"
        />
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        {filteredPredictions?.length > 0 ? (
          filteredPredictions?.map((prediction) => (
            <div key={prediction?.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} color="white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-foreground text-data">{prediction?.symbol}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{prediction?.timeframe}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Icon 
                        name={getPredictionStatusIcon(prediction?.status)} 
                        size={14} 
                        className={getPredictionStatusColor(prediction?.status)}
                      />
                      <span className={`text-xs ${getPredictionStatusColor(prediction?.status)}`}>
                        {prediction?.status === 'active' ? 'Активный' : 
                         prediction?.status === 'monitoring' ? 'Мониторинг' : 'Завершен'}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(prediction?.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-medium ${getConfidenceColor(prediction?.confidence)}`}>
                    {getConfidenceLabel(prediction?.confidence)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(prediction?.confidence * 100)}% доверие
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/5 rounded-md p-3 mb-3">
                <p className="text-sm text-foreground leading-relaxed">
                  {prediction?.prediction}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>ИИ прогноз</span>
                  <span>•</span>
                  <span>Модель: GPT-5</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" iconName="Share">
                    Поделиться
                  </Button>
                  <Button variant="ghost" size="sm" iconName="BookOpen">
                    Детали
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Icon name="Brain" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Нет прогнозов для отображения
            </h3>
            <p className="text-muted-foreground mb-4">
              Создайте первый прогноз, выбрав символ и нажав "Создать прогноз"
            </p>
            <Button
              variant="default"
              iconName="Brain"
              iconPosition="left"
              onClick={() => onGeneratePrediction('BTCUSDT')}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? t('analyzing') : 'Создать прогноз'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionDashboard;