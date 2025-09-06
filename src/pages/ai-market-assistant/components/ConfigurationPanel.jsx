import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../contexts/LanguageContext';

const ConfigurationPanel = ({ aiSettings, onSettingsUpdate }) => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState(aiSettings);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customPromptTemplate, setCustomPromptTemplate] = useState('');

  const modelOptions = [
    { value: 'gpt-5', label: 'GPT-5 (Рекомендуется)' },
    { value: 'gpt-5-mini', label: 'GPT-5 Mini (Быстрый)' },
    { value: 'gpt-4o', label: 'GPT-4o (Стабильный)' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Экономичный)' }
  ];

  const analysisTypeOptions = [
    { value: 'technical', label: 'Технический анализ' },
    { value: 'fundamental', label: 'Фундаментальный анализ' },
    { value: 'sentiment', label: 'Анализ настроений' },
    { value: 'mixed', label: 'Смешанный анализ' }
  ];

  const riskToleranceOptions = [
    { value: 'conservative', label: 'Консервативный' },
    { value: 'medium', label: 'Умеренный' },
    { value: 'aggressive', label: 'Агрессивный' }
  ];

  const timeframeOptions = [
    { value: '15m', label: '15 минут' },
    { value: '1h', label: '1 час' },
    { value: '4h', label: '4 часа' },
    { value: '1d', label: '1 день' },
    { value: '1w', label: '1 неделя' }
  ];

  const reasoningEffortOptions = [
    { value: 'minimal', label: 'Минимальный (Быстро)' },
    { value: 'low', label: 'Низкий' },
    { value: 'medium', label: 'Средний (Рекомендуется)' },
    { value: 'high', label: 'Высокий (Глубокий анализ)' }
  ];

  const verbosityOptions = [
    { value: 'low', label: 'Краткий' },
    { value: 'medium', label: 'Сбалансированный' },
    { value: 'high', label: 'Подробный' }
  ];

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  const handleSaveSettings = () => {
    onSettingsUpdate(settings);
  };

  const handleResetToDefaults = () => {
    const defaultSettings = {
      model: 'gpt-5',
      analysisType: 'technical',
      riskTolerance: 'medium',
      timeframe: '1h',
      enablePredictions: true,
      autoRefresh: true,
      confidence: 0.75,
      reasoningEffort: 'medium',
      verbosity: 'medium',
      maxTokens: 2000
    };
    setSettings(defaultSettings);
  };

  const promptTemplates = [
    {
      id: 1,
      name: 'Технический анализ',
      template: 'Проведи детальный технический анализ {symbol} на таймфрейме {timeframe}. Включи анализ трендов, уровней поддержки/сопротивления, индикаторов и объемов.'
    },
    {
      id: 2,
      name: 'Прогноз цены',
      template: 'Предскажи движение цены {symbol} на следующие {timeframe}, учитывая текущие рыночные условия, технические индикаторы и объемы торгов.'
    },
    {
      id: 3,
      name: 'Торговые сигналы',
      template: 'Найди торговые возможности для {symbol}. Определи точки входа, цели прибыли и стоп-лоссы на основе {analysisType} анализа.'
    },
    {
      id: 4,
      name: 'Анализ рисков',
      template: 'Оцени риски торговли {symbol} с уровнем толерантности {riskTolerance}. Предоставь рекомендации по управлению рисками.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI Model Configuration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Настройки ИИ модели</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Настройте поведение и параметры ИИ помощника
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={handleResetToDefaults}
            >
              Сбросить
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Save"
              iconPosition="left"
              onClick={handleSaveSettings}
            >
              Сохранить
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Модель ИИ
              </label>
              <Select
                value={settings?.model}
                onChange={(value) => handleSettingChange('model', value)}
                options={modelOptions}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                GPT-5 обеспечивает лучшее качество анализа
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Тип анализа
              </label>
              <Select
                value={settings?.analysisType}
                onChange={(value) => handleSettingChange('analysisType', value)}
                options={analysisTypeOptions}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Толерантность к риску
              </label>
              <Select
                value={settings?.riskTolerance}
                onChange={(value) => handleSettingChange('riskTolerance', value)}
                options={riskToleranceOptions}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Таймфрейм по умолчанию
              </label>
              <Select
                value={settings?.timeframe}
                onChange={(value) => handleSettingChange('timeframe', value)}
                options={timeframeOptions}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Уровень рассуждения (GPT-5)
              </label>
              <Select
                value={settings?.reasoningEffort || 'medium'}
                onChange={(value) => handleSettingChange('reasoningEffort', value)}
                options={reasoningEffortOptions}
                className="w-full"
                disabled={settings?.model !== 'gpt-5' && settings?.model !== 'gpt-5-mini'}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Контролирует глубину анализа ИИ
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Подробность ответов
              </label>
              <Select
                value={settings?.verbosity || 'medium'}
                onChange={(value) => handleSettingChange('verbosity', value)}
                options={verbosityOptions}
                className="w-full"
                disabled={settings?.model !== 'gpt-5' && settings?.model !== 'gpt-5-mini'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Минимальное доверие
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={settings?.confidence}
                  onChange={(e) => handleSettingChange('confidence', parseFloat(e?.target?.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-foreground w-12">
                  {Math.round(settings?.confidence * 100)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Прогнозы ниже этого уровня не будут показаны
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={settings?.enablePredictions}
                  onChange={(checked) => handleSettingChange('enablePredictions', checked)}
                />
                <label className="text-sm font-medium text-foreground">
                  Автоматические прогнозы
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={settings?.autoRefresh}
                  onChange={(checked) => handleSettingChange('autoRefresh', checked)}
                />
                <label className="text-sm font-medium text-foreground">
                  Автообновление данных
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-left"
        >
          <div>
            <h3 className="text-lg font-semibold text-foreground">Расширенные настройки</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Дополнительные параметры для опытных пользователей
            </p>
          </div>
          <Icon 
            name="ChevronDown" 
            size={20} 
            className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
          />
        </button>

        {showAdvanced && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Максимальное количество токенов
              </label>
              <Input
                type="number"
                value={settings?.maxTokens || 2000}
                onChange={(e) => handleSettingChange('maxTokens', parseInt(e?.target?.value))}
                min="500"
                max="4000"
                step="100"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ограничивает длину ответов ИИ (500-4000)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Системный промт
              </label>
              <textarea
                value={settings?.systemPrompt || 'Ты эксперт по техническому анализу финансовых рынков. Предоставляй точные, обоснованные прогнозы и рекомендации.'}
                onChange={(e) => handleSettingChange('systemPrompt', e?.target?.value)}
                placeholder="Введите системный промт для ИИ..."
                className="w-full h-24 p-3 bg-input border border-border rounded-md text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        )}
      </div>

      {/* Prompt Templates */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Шаблоны промтов</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Готовые шаблоны для различных видов анализа
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Plus"
            iconPosition="left"
          >
            Добавить шаблон
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promptTemplates?.map((template) => (
            <div key={template?.id} className="bg-muted/5 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{template?.name}</h4>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" iconName="Edit">
                  </Button>
                  <Button variant="ghost" size="sm" iconName="Copy">
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                {template?.template}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Создать пользовательский шаблон
          </label>
          <div className="space-y-3">
            <textarea
              value={customPromptTemplate}
              onChange={(e) => setCustomPromptTemplate(e?.target?.value)}
              placeholder="Введите шаблон промта... Используйте {symbol}, {timeframe}, {analysisType} как переменные"
              className="w-full h-24 p-3 bg-input border border-border rounded-md text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Save"
              iconPosition="left"
              disabled={!customPromptTemplate?.trim()}
            >
              Сохранить шаблон
            </Button>
          </div>
        </div>
      </div>

      {/* API Status & Usage */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Статус API и использование</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">●</div>
            <div className="text-xs text-muted-foreground">Статус API</div>
            <div className="text-sm font-medium text-foreground">Активен</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground mb-1 text-data">847</div>
            <div className="text-xs text-muted-foreground">Запросы сегодня</div>
            <div className="text-sm font-medium text-foreground">из 1000</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground mb-1 text-data">23ms</div>
            <div className="text-xs text-muted-foreground">Среднее время</div>
            <div className="text-sm font-medium text-foreground">ответа</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">99.8%</div>
            <div className="text-xs text-muted-foreground">Точность</div>
            <div className="text-sm font-medium text-foreground">прогнозов</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;