import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import AlertCreationPanel from './components/AlertCreationPanel';
import AlertsTable from './components/AlertsTable';
import AlertHistory from './components/AlertHistory';
import AlertTemplates from './components/AlertTemplates';
import AlertStatusIndicator from './components/AlertStatusIndicator';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const AlertsManagement = () => {
  const [alerts, setAlerts] = useState([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);
  const [isCreationPanelOpen, setIsCreationPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('alerts');

  // Initialize with mock data
  useEffect(() => {
    const mockAlerts = [
      {
        id: 1,
        symbol: 'BTCUSDT',
        alertType: 'price',
        condition: 'above',
        value: '45000',
        status: 'active',
        notifications: { push: true, email: false, sms: false },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        triggeredAt: null
      },
      {
        id: 2,
        symbol: 'ETHUSDT',
        alertType: 'technical',
        condition: 'rsi_oversold',
        value: '30',
        status: 'active',
        notifications: { push: true, email: true, sms: false },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        triggeredAt: null
      },
      {
        id: 3,
        symbol: 'ADAUSDT',
        alertType: 'percentage',
        condition: 'increase',
        value: '10',
        status: 'triggered',
        notifications: { push: true, email: false, sms: true },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        triggeredAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        id: 4,
        symbol: 'SOLUSDT',
        alertType: 'volume',
        condition: 'spike',
        value: '200',
        status: 'active',
        notifications: { push: true, email: true, sms: true },
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        triggeredAt: null
      }
    ];

    const mockTriggeredAlerts = [
      {
        id: 101,
        symbol: 'BTCUSDT',
        alertType: 'price',
        condition: 'above',
        value: '42000',
        notifications: { push: true, email: false, sms: false },
        triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 102,
        symbol: 'ETHUSDT',
        alertType: 'technical',
        condition: 'macd_bullish',
        value: '',
        notifications: { push: true, email: true, sms: false },
        triggeredAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
      },
      {
        id: 103,
        symbol: 'ADAUSDT',
        alertType: 'percentage',
        condition: 'increase',
        value: '15',
        notifications: { push: true, email: false, sms: true },
        triggeredAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      }
    ];

    setAlerts(mockAlerts);
    setTriggeredAlerts(mockTriggeredAlerts);
  }, []);

  const handleCreateAlert = (newAlert) => {
    setAlerts(prev => [...prev, newAlert]);
    setIsCreationPanelOpen(false);
  };

  const handleEditAlert = (alert) => {
    // In a real app, this would open an edit modal
    console.log('Edit alert:', alert);
  };

  const handleDeleteAlert = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const handleDuplicateAlert = (alert) => {
    const duplicatedAlert = {
      ...alert,
      id: Date.now(),
      createdAt: new Date(),
      status: 'active',
      triggeredAt: null
    };
    setAlerts(prev => [...prev, duplicatedAlert]);
  };

  const handleBulkDelete = (alertIds) => {
    setAlerts(prev => prev?.filter(alert => !alertIds?.includes(alert?.id)));
  };

  const handleUseTemplate = (templateData) => {
    setIsCreationPanelOpen(true);
    // In a real app, this would pre-fill the creation form
    console.log('Use template:', templateData);
  };

  const tabs = [
    { id: 'alerts', label: 'Активные уведомления', icon: 'Bell' },
    { id: 'history', label: 'История', icon: 'History' },
    { id: 'templates', label: 'Шаблоны', icon: 'BookOpen' }
  ];

  const activeAlerts = alerts?.filter(alert => alert?.status === 'active');
  const triggeredToday = triggeredAlerts?.filter(alert => 
    new Date(alert.triggeredAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  )?.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Управление уведомлениями</h1>
                <p className="text-muted-foreground mt-2">
                  Создавайте и управляйте ценовыми оповещениями, техническими индикаторами и торговыми уведомлениями
                </p>
              </div>
              
              <div className="hidden md:block">
                <AlertStatusIndicator
                  totalAlerts={alerts?.length}
                  activeAlerts={activeAlerts?.length}
                  triggeredToday={triggeredToday}
                />
              </div>
            </div>
          </div>

          {/* Mobile Status Indicator */}
          <div className="md:hidden mb-6">
            <AlertStatusIndicator
              totalAlerts={alerts?.length}
              activeAlerts={activeAlerts?.length}
              triggeredToday={triggeredToday}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Alert Creation */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <AlertCreationPanel
                  onCreateAlert={handleCreateAlert}
                  isOpen={isCreationPanelOpen}
                  onToggle={() => setIsCreationPanelOpen(!isCreationPanelOpen)}
                />
                
                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Быстрые действия</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Import"
                      iconPosition="left"
                      className="w-full justify-start text-left"
                    >
                      <span className="truncate">Импорт уведомлений</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                      className="w-full justify-start text-left"
                    >
                      <span className="truncate">Экспорт уведомлений</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Settings"
                      iconPosition="left"
                      className="w-full justify-start text-left"
                    >
                      <span className="truncate">Настройки уведомлений</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-1 mb-6 bg-muted/10 p-1 rounded-lg">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth flex-1 justify-center ${
                      activeTab === tab?.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span className="text-center">{tab?.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'alerts' && (
                  <AlertsTable
                    alerts={alerts}
                    onEditAlert={handleEditAlert}
                    onDeleteAlert={handleDeleteAlert}
                    onDuplicateAlert={handleDuplicateAlert}
                    onBulkDelete={handleBulkDelete}
                  />
                )}

                {activeTab === 'history' && (
                  <AlertHistory triggeredAlerts={triggeredAlerts} />
                )}

                {activeTab === 'templates' && (
                  <AlertTemplates onUseTemplate={handleUseTemplate} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsManagement;
