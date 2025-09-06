import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AISettings = ({ settings, onSettingsChange }) => {
  const { t } = useLanguage();

  const updateSetting = (key, value) => {
    onSettingsChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const reasoningOptions = [
    { value: 'minimal', label: 'Быстрый (минимальное рассуждение)' },
    { value: 'low', label: 'Легкий (быстрый анализ)' },
    { value: 'medium', label: 'Средний (сбалансированный)' },
    { value: 'high', label: 'Глубокий (детальный анализ)' }
  ];

  const analysisOptions = [
    { value: 'technical', label: 'Технический анализ' },
    { value: 'fundamental', label: 'Фундаментальный анализ' },
    { value: 'hybrid', label: 'Комбинированный анализ' }
  ];

  const verbosityOptions = [
    { value: 'low', label: 'Краткие ответы' },
    { value: 'medium', label: 'Средняя детализация' },
    { value: 'high', label: 'Подробные ответы' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-foreground flex items-center">
        <Icon name="Settings" size={16} className="mr-2" />
        {t('aiSettings')}
      </h3>
      <div className="space-y-4">
        {/* Reasoning Depth */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Глубина анализа
          </label>
          <Select
            value={settings?.reasoningDepth}
            onValueChange={(value) => updateSetting('reasoningDepth', value)}
          >
            {reasoningOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Контролирует глубину рассуждений ИИ
          </p>
        </div>

        {/* Analysis Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Тип анализа
          </label>
          <Select
            value={settings?.analysisType}
            onValueChange={(value) => updateSetting('analysisType', value)}
          >
            {analysisOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Фокус анализа рынка
          </p>
        </div>

        {/* Verbosity */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Детализация ответов
          </label>
          <Select
            value={settings?.verbosity}
            onValueChange={(value) => updateSetting('verbosity', value)}
          >
            {verbosityOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Уровень детализации в ответах
          </p>
        </div>

        {/* Include Sentiment */}
        <div>
          <Checkbox
            id="includeSentiment"
            checked={settings?.includeSentiment}
            onChange={(e) => updateSetting('includeSentiment', e?.target?.checked)}
            label="Учитывать настроения рынка"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Включает анализ новостей и социальных настроений
          </p>
        </div>
      </div>
      {/* Performance Info */}
      <div className="pt-3 border-t border-border">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={14} className="text-primary mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Рекомендации:</p>
              <p>• Используйте "Быстрый" для простых вопросов</p>
              <p>• Выберите "Глубокий" для сложного анализа</p>
              <p>• Комбинированный анализ дает лучшие результаты</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;