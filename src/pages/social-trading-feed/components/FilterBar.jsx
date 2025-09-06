import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterBar = ({ onFilterChange, activeFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const postTypeOptions = [
    { value: 'all', label: 'Все посты' },
    { value: 'text', label: 'Текстовые' },
    { value: 'chart', label: 'Анализ графиков' },
    { value: 'prediction', label: 'Прогнозы' },
    { value: 'educational', label: 'Обучающие' }
  ];

  const sortOptions = [
    { value: 'latest', label: 'Новые' },
    { value: 'popular', label: 'Популярные' },
    { value: 'trending', label: 'В тренде' },
    { value: 'following', label: 'Подписки' }
  ];

  const timeRangeOptions = [
    { value: 'all', label: 'За все время' },
    { value: '1h', label: 'За час' },
    { value: '24h', label: 'За день' },
    { value: '7d', label: 'За неделю' },
    { value: '30d', label: 'За месяц' }
  ];

  const assetClassOptions = [
    { value: 'all', label: 'Все активы' },
    { value: 'crypto', label: 'Криптовалюты' },
    { value: 'stocks', label: 'Акции' },
    { value: 'forex', label: 'Валюты' },
    { value: 'commodities', label: 'Сырье' },
    { value: 'indices', label: 'Индексы' }
  ];

  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...activeFilters,
      [filterType]: value
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      postType: 'all',
      sortBy: 'latest',
      timeRange: 'all',
      assetClass: 'all',
      followingOnly: false,
      verifiedOnly: false
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters?.postType !== 'all') count++;
    if (activeFilters?.sortBy !== 'latest') count++;
    if (activeFilters?.timeRange !== 'all') count++;
    if (activeFilters?.assetClass !== 'all') count++;
    if (activeFilters?.followingOnly) count++;
    if (activeFilters?.verifiedOnly) count++;
    return count;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Select
          options={sortOptions}
          value={activeFilters?.sortBy}
          onChange={(value) => handleFilterChange('sortBy', value)}
          className="min-w-32"
        />
        
        <Select
          options={postTypeOptions}
          value={activeFilters?.postType}
          onChange={(value) => handleFilterChange('postType', value)}
          className="min-w-32"
        />

        <Button
          variant={activeFilters?.followingOnly ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange('followingOnly', !activeFilters?.followingOnly)}
          className="flex items-center space-x-2"
        >
          <Icon name="Users" size={16} />
          <span>Подписки</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
        >
          <Icon name="Filter" size={16} />
          <span>Фильтры</span>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
          <Icon 
            name="ChevronDown" 
            size={16} 
            className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
          />
        </Button>

        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Сбросить
          </Button>
        )}
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select
              label="Период времени"
              options={timeRangeOptions}
              value={activeFilters?.timeRange}
              onChange={(value) => handleFilterChange('timeRange', value)}
            />
            
            <Select
              label="Класс активов"
              options={assetClassOptions}
              value={activeFilters?.assetClass}
              onChange={(value) => handleFilterChange('assetClass', value)}
            />

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-foreground">Дополнительно</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeFilters?.verifiedOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange('verifiedOnly', !activeFilters?.verifiedOnly)}
                  className="flex items-center space-x-2"
                >
                  <Icon name="BadgeCheck" size={14} />
                  <span>Верифицированные</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Быстрые фильтры:</span>
            {['#bitcoin', '#акции', '#форекс', '#анализ', '#прогноз']?.map((tag) => (
              <Button
                key={tag}
                variant="ghost"
                size="sm"
                className="text-xs text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => {/* Handle hashtag filter */}}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}
      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Активные фильтры:</span>
            
            {activeFilters?.postType !== 'all' && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                <span>{postTypeOptions?.find(opt => opt?.value === activeFilters?.postType)?.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange('postType', 'all')}
                  className="p-0 h-auto text-primary hover:text-primary"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            )}

            {activeFilters?.timeRange !== 'all' && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                <span>{timeRangeOptions?.find(opt => opt?.value === activeFilters?.timeRange)?.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange('timeRange', 'all')}
                  className="p-0 h-auto text-primary hover:text-primary"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            )}

            {activeFilters?.assetClass !== 'all' && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                <span>{assetClassOptions?.find(opt => opt?.value === activeFilters?.assetClass)?.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange('assetClass', 'all')}
                  className="p-0 h-auto text-primary hover:text-primary"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            )}

            {activeFilters?.followingOnly && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                <span>Только подписки</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange('followingOnly', false)}
                  className="p-0 h-auto text-primary hover:text-primary"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            )}

            {activeFilters?.verifiedOnly && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                <span>Верифицированные</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange('verifiedOnly', false)}
                  className="p-0 h-auto text-primary hover:text-primary"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;