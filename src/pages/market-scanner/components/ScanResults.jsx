import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScanResults = ({ results, onAddToWatchlist, onOpenChart, onExportResults }) => {
  const [sortField, setSortField] = useState('change');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'heatmap'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedResults = [...results]?.sort((a, b) => {
    let aVal = a?.[sortField];
    let bVal = b?.[sortField];
    
    if (typeof aVal === 'string') {
      aVal = aVal?.replace(/[^0-9.-]/g, '');
      bVal = bVal?.replace(/[^0-9.-]/g, '');
    }
    
    aVal = parseFloat(aVal) || 0;
    bVal = parseFloat(bVal) || 0;
    
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const getChangeColor = (change) => {
    const numChange = parseFloat(change?.replace('%', ''));
    if (numChange > 0) return 'text-success';
    if (numChange < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change) => {
    const numChange = parseFloat(change?.replace('%', ''));
    if (numChange > 0) return 'TrendingUp';
    if (numChange < 0) return 'TrendingDown';
    return 'Minus';
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-foreground hover:text-primary transition-smooth"
    >
      <span>{children}</span>
      {sortField === field && (
        <Icon 
          name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
          size={14} 
        />
      )}
    </button>
  );

  const HeatmapView = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
      {sortedResults?.map((result) => {
        const change = parseFloat(result?.change?.replace('%', ''));
        const intensity = Math.min(Math.abs(change) / 10, 1);
        const bgColor = change > 0 
          ? `rgba(34, 197, 94, ${intensity * 0.3})` 
          : `rgba(239, 68, 68, ${intensity * 0.3})`;
        
        return (
          <div
            key={result?.symbol}
            className="p-3 rounded-lg border border-border cursor-pointer hover:border-primary transition-smooth"
            style={{ backgroundColor: bgColor }}
            onClick={() => onOpenChart(result?.symbol)}
          >
            <div className="text-sm font-medium text-foreground text-data">
              {result?.symbol}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {result?.price}
            </div>
            <div className={`text-xs font-medium mt-1 ${getChangeColor(result?.change)}`}>
              {result?.change}
            </div>
          </div>
        );
      })}
    </div>
  );

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4">
              <SortButton field="symbol">Символ</SortButton>
            </th>
            <th className="text-right py-3 px-4">
              <SortButton field="price">Цена</SortButton>
            </th>
            <th className="text-right py-3 px-4">
              <SortButton field="change">Изм.</SortButton>
            </th>
            <th className="text-right py-3 px-4">
              <SortButton field="volume">Объем</SortButton>
            </th>
            <th className="text-right py-3 px-4">
              <SortButton field="marketCap">Кап.</SortButton>
            </th>
            <th className="text-right py-3 px-4">
              <SortButton field="rsi">RSI</SortButton>
            </th>
            <th className="text-center py-3 px-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          {sortedResults?.map((result, index) => (
            <tr 
              key={result?.symbol}
              className={`border-b border-border hover:bg-muted transition-smooth ${
                result?.isNew ? 'bg-success/5' : result?.isRemoved ? 'opacity-50' : ''
              }`}
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium text-foreground text-data">
                    {result?.symbol}
                  </div>
                  {result?.isNew && (
                    <span className="px-2 py-1 text-xs bg-success text-success-foreground rounded">
                      Новый
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {result?.name}
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="text-sm font-medium text-foreground text-data">
                  {result?.price}
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className={`flex items-center justify-end space-x-1 ${getChangeColor(result?.change)}`}>
                  <Icon name={getChangeIcon(result?.change)} size={14} />
                  <span className="text-sm font-medium text-data">
                    {result?.change}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="text-sm text-foreground text-data">
                  {result?.volume}
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="text-sm text-foreground text-data">
                  {result?.marketCap}
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className={`text-sm font-medium text-data ${
                  result?.rsi > 70 ? 'text-error' : result?.rsi < 30 ? 'text-success' : 'text-foreground'
                }`}>
                  {result?.rsi}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddToWatchlist(result?.symbol)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon name="Plus" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChart(result?.symbol)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon name="BarChart3" size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Результаты сканирования</h3>
          <p className="text-sm text-muted-foreground">
            Найдено {results?.length} активов • Последнее обновление: {new Date()?.toLocaleTimeString('ru-RU')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 px-3"
            >
              <Icon name="Table" size={14} />
            </Button>
            <Button
              variant={viewMode === 'heatmap' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('heatmap')}
              className="h-8 px-3"
            >
              <Icon name="Grid3X3" size={14} />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportResults}
            iconName="Download"
            iconPosition="left"
          >
            Экспорт
          </Button>
        </div>
      </div>
      <div className="p-4">
        {results?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Ничего не найдено</h4>
            <p className="text-muted-foreground">
              Попробуйте изменить фильтры или выберите готовый скан, чтобы начать.
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'table' ? <TableView /> : <HeatmapView />}
          </>
        )}
      </div>
    </div>
  );
};

export default ScanResults;
