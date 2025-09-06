import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScanHistory = ({ history, onLoadHistoricalScan, onDeleteScan }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPerformanceColor = (performance) => {
    if (performance > 0) return 'text-success';
    if (performance < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Scan History</h3>
          <p className="text-sm text-muted-foreground">
            Track performance of previous scans
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
        </Button>
      </div>
      {isExpanded && (
        <div className="p-4">
          {history?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="History" size={32} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No scan history available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history?.map((scan) => (
                <div
                  key={scan?.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-smooth"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm">
                          {scan?.name}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(scan?.timestamp)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {scan?.resultsCount} results
                          </span>
                          {scan?.avgPerformance !== undefined && (
                            <span className={`text-xs font-medium ${getPerformanceColor(scan?.avgPerformance)}`}>
                              Avg: {scan?.avgPerformance > 0 ? '+' : ''}{scan?.avgPerformance?.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onLoadHistoricalScan(scan)}
                          className="h-8 px-3"
                        >
                          <Icon name="RotateCcw" size={14} />
                          <span className="ml-1 text-xs">Load</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteScan(scan?.id)}
                          className="h-8 w-8 p-0 text-error hover:text-error"
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {history?.length > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-foreground">
                  <span className="font-medium">Performance Tracking:</span>
                  <span className="text-muted-foreground ml-2">
                    Based on 1-week price changes after scan date
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="BarChart3"
                  iconPosition="left"
                >
                  View Analytics
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanHistory;