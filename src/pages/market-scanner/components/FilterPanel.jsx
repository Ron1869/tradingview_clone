import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ filters, onFiltersChange, onApplyFilters, onResetFilters }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const assetClassOptions = [
    { value: 'all', label: 'Все активы' },
    { value: 'stocks', label: 'Акции' },
    { value: 'crypto', label: 'Криптовалюта' },
    { value: 'forex', label: 'Форекс' },
    { value: 'commodities', label: 'Товары' },
    { value: 'indices', label: 'Индексы' }
  ];

  const marketCapOptions = [
    { value: 'all', label: 'Любая капитализация' },
    { value: 'mega', label: 'Мега (>200 млрд $)' },
    { value: 'large', label: 'Крупная (10-200 млрд $)' },
    { value: 'mid', label: 'Средняя (2-10 млрд $)' },
    { value: 'small', label: 'Малая (300 млн - 2 млрд $)' },
    { value: 'micro', label: 'Микро (<300 млн $)' }
  ];

  const technicalPatternOptions = [
    { value: 'all', label: 'Все паттерны' },
    { value: 'breakout', label: 'Пробой' },
    { value: 'reversal', label: 'Разворот' },
    { value: 'continuation', label: 'Продолжение' },
    { value: 'flag', label: 'Флаг' },
    { value: 'triangle', label: 'Треугольник' },
    { value: 'head_shoulders', label: 'Голова и плечи' }
  ];

  const volumeOptions = [
    { value: 'all', label: 'Любой объем' },
    { value: 'high', label: 'Высокий (>2x сред.)' },
    { value: 'above_avg', label: 'Выше среднего (>1.5x сред.)' },
    { value: 'unusual', label: 'Необычный (>3x сред.)' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Фильтры сканера рынка</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
        </Button>
      </div>
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Класс активов"
              options={assetClassOptions}
              value={filters?.assetClass}
              onChange={(value) => handleFilterChange('assetClass', value)}
            />

            <Select
              label="Капитализация"
              options={marketCapOptions}
              value={filters?.marketCap}
              onChange={(value) => handleFilterChange('marketCap', value)}
            />

            <Select
              label="Технический паттерн"
              options={technicalPatternOptions}
              value={filters?.technicalPattern}
              onChange={(value) => handleFilterChange('technicalPattern', value)}
            />

            <Select
              label="Фильтр по объему"
              options={volumeOptions}
              value={filters?.volume}
              onChange={(value) => handleFilterChange('volume', value)}
            />

            <Input
              label="Мин. цена ($)"
              type="number"
              placeholder="0.00"
              value={filters?.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e?.target?.value)}
            />

            <Input
              label="Макс. цена ($)"
              type="number"
              placeholder="1000.00"
              value={filters?.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e?.target?.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Мин. изменение %"
              type="number"
              placeholder="-10"
              value={filters?.minChange}
              onChange={(e) => handleFilterChange('minChange', e?.target?.value)}
            />

            <Input
              label="Макс. изменение %"
              type="number"
              placeholder="10"
              value={filters?.maxChange}
              onChange={(e) => handleFilterChange('maxChange', e?.target?.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {filters?.resultsCount || 0} активов соответствует фильтрам
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
              >
                Сбросить
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onApplyFilters}
                iconName="Search"
                iconPosition="left"
              >
                Применить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;