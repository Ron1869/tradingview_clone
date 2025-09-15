import React from 'react';
import Icon from '../../../components/AppIcon';

const PresetScans = ({ onSelectPreset, activePreset }) => {
  const presetScans = [
    {
      id: 'high_volume_breakouts',
      name: 'Прорывы с высоким объемом',
      description: 'Акции, пробивающие сопротивление с высоким объемом',
      icon: 'TrendingUp',
      color: 'text-success',
      filters: {
        technicalPattern: 'breakout',
        volume: 'high',
        minChange: '2'
      }
    },
    {
      id: 'oversold_bounce',
      name: 'Отскок от перепроданности',
      description: 'Перепроданные акции, показывающие сигналы разворота',
      icon: 'ArrowUp',
      color: 'text-primary',
      filters: {
        technicalPattern: 'reversal',
        maxChange: '-5'
      }
    },
    {
      id: 'momentum_stocks',
      name: 'Акции с импульсом',
      description: 'Сильный восходящий импульс с объемом',
      icon: 'Zap',
      color: 'text-warning',
      filters: {
        minChange: '5',
        volume: 'above_avg'
      }
    },
    {
      id: 'gap_up',
      name: 'Акции с гэпом вверх',
      description: 'Акции, открывающиеся с гэпом вверх на новостях или отчетах',
      icon: 'ArrowUpRight',
      color: 'text-success',
      filters: {
        minChange: '3',
        volume: 'unusual'
      }
    },
    {
      id: 'large_cap_movers',
      name: 'Движения в крупных компаниях',
      description: 'Акции крупных компаний со значительными движениями',
      icon: 'Building2',
      color: 'text-secondary',
      filters: {
        marketCap: 'large',
        minChange: '2'
      }
    },
    {
      id: 'crypto_gainers',
      name: 'Лидеры роста в криптовалюте',
      description: 'Самые прибыльные криптовалюты',
      icon: 'Bitcoin',
      color: 'text-accent',
      filters: {
        assetClass: 'crypto',
        minChange: '5'
      }
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Готовые сканы</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Быстрый доступ к популярным стратегиям сканирования
        </p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {presetScans?.map((preset) => (
            <button
              key={preset?.id}
              onClick={() => onSelectPreset(preset)}
              className={`p-4 rounded-lg border transition-smooth text-left hover:bg-muted ${
                activePreset === preset?.id
                  ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-muted ${preset?.color}`}>
                  <Icon name={preset?.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm">
                    {preset?.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {preset?.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={16} className="text-primary" />
            <span className="text-sm text-foreground font-medium">Совет:</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Начните с готовых сканов и настройте фильтры в соответствии с вашей торговой стратегией.
            Сохраняйте пользовательские сканы для будущего использования.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PresetScans;
