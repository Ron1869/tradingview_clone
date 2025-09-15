import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useLanguage } from '../../contexts/LanguageContext';

const Sidebar = ({ isSidebarOpen }) => {
  const { t } = useLanguage();
  const location = useLocation();

  const navigationItems = [
    { label: t('dashboard'), path: '/main-dashboard', icon: 'LayoutDashboard' },
    { label: t('charts'), path: '/advanced-chart', icon: 'TrendingUp' },
    { label: t('scanner'), path: '/market-scanner', icon: 'Search' },
    { label: t('alerts'), path: '/alerts-management', icon: 'Bell' },
    { label: t('social'), path: '/social-trading-feed', icon: 'Users' },
    { label: t('aiAssistant'), path: '/ai-market-assistant', icon: 'Brain' }
  ];

  return (
    <aside className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} bg-card border-r border-border flex-shrink-0 flex flex-col`}>
      <div className={`flex items-center h-16 border-b border-border ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'}`}>
        <Link to="/main-dashboard" className="flex items-center space-x-2 overflow-hidden">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="TrendingUp" size={20} color="white" />
          </div>
          {isSidebarOpen && <span className="text-xl font-semibold text-foreground whitespace-nowrap">{t('appName')}</span>}
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={!isSidebarOpen ? item.label : undefined}
              className={`flex items-center rounded-lg text-sm font-medium transition-colors duration-150 ${isSidebarOpen ? 'justify-start space-x-3 px-3 py-2.5' : 'justify-center p-2.5'} ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}>
              <Icon name={item.icon} size={20} className="flex-shrink-0" />
              {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
