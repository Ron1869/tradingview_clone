import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ filters, onFiltersChange, onApplyFilters, onResetFilters }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const assetClassOptions = [
    { value: 'all', label: 'All Assets' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'forex', label: 'Forex' },
    { value: 'commodities', label: 'Commodities' },
    { value: 'indices', label: 'Indices' }
  ];

  const marketCapOptions = [
    { value: 'all', label: 'All Market Caps' },
    { value: 'mega', label: 'Mega Cap (>$200B)' },
    { value: 'large', label: 'Large Cap ($10B-$200B)' },
    { value: 'mid', label: 'Mid Cap ($2B-$10B)' },
    { value: 'small', label: 'Small Cap ($300M-$2B)' },
    { value: 'micro', label: 'Micro Cap (<$300M)' }
  ];

  const technicalPatternOptions = [
    { value: 'all', label: 'All Patterns' },
    { value: 'breakout', label: 'Breakout' },
    { value: 'reversal', label: 'Reversal' },
    { value: 'continuation', label: 'Continuation' },
    { value: 'flag', label: 'Flag Pattern' },
    { value: 'triangle', label: 'Triangle' },
    { value: 'head_shoulders', label: 'Head & Shoulders' }
  ];

  const volumeOptions = [
    { value: 'all', label: 'All Volume' },
    { value: 'high', label: 'High Volume (>2x avg)' },
    { value: 'above_avg', label: 'Above Average (>1.5x avg)' },
    { value: 'unusual', label: 'Unusual Volume (>3x avg)' }
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
        <h3 className="text-lg font-semibold text-foreground">Market Scanner Filters</h3>
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
              label="Asset Class"
              options={assetClassOptions}
              value={filters?.assetClass}
              onChange={(value) => handleFilterChange('assetClass', value)}
            />

            <Select
              label="Market Cap"
              options={marketCapOptions}
              value={filters?.marketCap}
              onChange={(value) => handleFilterChange('marketCap', value)}
            />

            <Select
              label="Technical Pattern"
              options={technicalPatternOptions}
              value={filters?.technicalPattern}
              onChange={(value) => handleFilterChange('technicalPattern', value)}
            />

            <Select
              label="Volume Filter"
              options={volumeOptions}
              value={filters?.volume}
              onChange={(value) => handleFilterChange('volume', value)}
            />

            <Input
              label="Min Price ($)"
              type="number"
              placeholder="0.00"
              value={filters?.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e?.target?.value)}
            />

            <Input
              label="Max Price ($)"
              type="number"
              placeholder="1000.00"
              value={filters?.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e?.target?.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Min Change %"
              type="number"
              placeholder="-10"
              value={filters?.minChange}
              onChange={(e) => handleFilterChange('minChange', e?.target?.value)}
            />

            <Input
              label="Max Change %"
              type="number"
              placeholder="10"
              value={filters?.maxChange}
              onChange={(e) => handleFilterChange('maxChange', e?.target?.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {filters?.resultsCount || 0} assets match current filters
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
              >
                Reset Filters
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onApplyFilters}
                iconName="Search"
                iconPosition="left"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;