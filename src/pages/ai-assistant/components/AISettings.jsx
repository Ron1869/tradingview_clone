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
    { value: 'minimal', label: t('reasoningQuick') },
    { value: 'low', label: t('reasoningLight') },
    { value: 'medium', label: t('reasoningMedium') },
    { value: 'high', label: t('reasoningDeep') }
  ];

  const analysisOptions = [
    { value: 'technical', label: t('technicalAnalysis') },
    { value: 'fundamental', label: t('fundamentalAnalysis') },
    { value: 'hybrid', label: t('hybridAnalysis') }
  ];

  const verbosityOptions = [
    { value: 'low', label: t('verbosityLow') },
    { value: 'medium', label: t('verbosityMedium') },
    { value: 'high', label: t('verbosityHigh') }
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
            {t('reasoningDepth')}
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
            {t('reasoningDepthTooltip')}
          </p>
        </div>

        {/* Analysis Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('analysisType')}
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
            {t('analysisTypeTooltip')}
          </p>
        </div>

        {/* Verbosity */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('verbosity')}
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
            {t('verbosityTooltip')}
          </p>
        </div>

        {/* Include Sentiment */}
        <div>
          <Checkbox
            id="includeSentiment"
            checked={settings?.includeSentiment}
            onChange={(e) => updateSetting('includeSentiment', e?.target?.checked)}
            label={t('includeMarketSentiment')}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t('includeMarketSentimentTooltip')}
          </p>
        </div>
      </div>
      {/* Performance Info */}
      <div className="pt-3 border-t border-border">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={14} className="text-primary mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">{t('recommendations')}</p>
              <p>{t('recommendationsTip1')}</p>
              <p>{t('recommendationsTip2')}</p>
              <p>{t('recommendationsTip3')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
