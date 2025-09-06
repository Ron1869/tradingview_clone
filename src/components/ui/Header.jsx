import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useLanguage } from '../../contexts/LanguageContext';

const Header = () => {
  const location = useLocation();
  const { t, currentLanguage, switchLanguage } = useLanguage();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketStatus, setMarketStatus] = useState('open');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const languageMenuRef = useRef(null);

  const navigationItems = [
    { label: t('dashboard'), path: '/main-dashboard', icon: 'LayoutDashboard' },
    { label: t('charts'), path: '/advanced-chart', icon: 'TrendingUp' },
    { label: t('scanner'), path: '/market-scanner', icon: 'Search' },
    { label: t('alerts'), path: '/alerts-management', icon: 'Bell' },
    { label: t('social'), path: '/social-trading-feed', icon: 'Users' },
    { label: t('aiAssistant'), path: '/ai-market-assistant', icon: 'Brain' }
  ];

  const mockSearchResults = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$175.43', change: '+1.2%' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$2,847.63', change: '-0.8%' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.50', change: '+2.1%' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$378.85', change: '+0.5%' }
  ];

  const filteredResults = mockSearchResults?.filter(item =>
    item?.symbol?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setIsSearchOpen(false);
      }
      if (languageMenuRef?.current && !languageMenuRef?.current?.contains(event?.target)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event?.ctrlKey && event?.key === 'k') {
        event?.preventDefault();
        setIsSearchOpen(true);
      }
      if (event?.key === 'Escape') {
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getMarketStatusColor = () => {
    switch (marketStatus) {
      case 'open': return 'text-success';
      case 'closed': return 'text-muted-foreground';
      case 'pre-market': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'disconnected': return 'text-error';
      case 'connecting': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const handleSearchSelect = (symbol) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    // Navigate to advanced chart with selected symbol
    window.location.href = `/advanced-chart?symbol=${symbol}`;
  };

  const getMarketStatusText = () => {
    switch (marketStatus) {
      case 'open': return t('marketOpen');
      case 'closed': return t('marketClosed');
      case 'pre-market': return t('preMarket');
      default: return t('marketClosed');
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return t('live');
      case 'connecting': return t('connecting');
      case 'disconnected': return t('offline');
      default: return t('offline');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-background/95 backdrop-blur-glass border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/main-dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">Black Trading</span>
        </Link>

        {/* Market Status Indicator */}
        <div className="hidden md:flex items-center space-x-4 ml-8">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getMarketStatusColor()?.replace('text-', 'bg-')}`}></div>
            <span className={`text-sm font-medium ${getMarketStatusColor()}`}>
              {getMarketStatusText()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()?.replace('text-', 'bg-')}`}></div>
            <span className={`text-sm ${getConnectionStatusColor()}`}>
              {getConnectionStatusText()}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1 mx-8">
          {navigationItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative" ref={languageMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="Globe" size={16} />
              <span className="text-xs uppercase">{currentLanguage}</span>
              <Icon name="ChevronDown" size={16} className={`transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isLanguageMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-popover border border-border rounded-lg shadow-elevated z-1100">
                <div className="py-2">
                  <button
                    onClick={() => {
                      switchLanguage('ru');
                      setIsLanguageMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-muted transition-smooth ${
                      currentLanguage === 'ru' ? 'text-primary font-medium' : 'text-foreground'
                    }`}
                  >
                    <span>🇷🇺</span>
                    <span>Русский</span>
                  </button>
                  <button
                    onClick={() => {
                      switchLanguage('en');
                      setIsLanguageMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-muted transition-smooth ${
                      currentLanguage === 'en' ? 'text-primary font-medium' : 'text-foreground'
                    }`}
                  >
                    <span>🇺🇸</span>
                    <span>English</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Search */}
          <div className="relative" ref={searchRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="Search" size={16} />
              <span className="text-xs">Ctrl+K</span>
            </Button>

            {isSearchOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevated z-1100">
                <div className="p-3 border-b border-border">
                  <div className="relative">
                    <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t('searchSymbols')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                      className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredResults?.length > 0 ? (
                    filteredResults?.map((item) => (
                      <button
                        key={item?.symbol}
                        onClick={() => handleSearchSelect(item?.symbol)}
                        className="w-full flex items-center justify-between p-3 hover:bg-muted transition-smooth text-left"
                      >
                        <div>
                          <div className="font-medium text-foreground text-data">{item?.symbol}</div>
                          <div className="text-sm text-muted-foreground">{item?.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground text-data">{item?.price}</div>
                          <div className={`text-xs ${item?.change?.startsWith('+') ? 'text-success' : 'text-error'}`}>
                            {item?.change}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-muted-foreground text-sm">
                      {searchQuery ? t('noSymbolsFound') : t('startTypingToSearch')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-foreground">John Trader</span>
              <Icon name="ChevronDown" size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevated z-1100">
                <div className="p-3 border-b border-border">
                  <div className="text-sm font-medium text-foreground">John Trader</div>
                  <div className="text-xs text-muted-foreground">john.trader@example.com</div>
                </div>
                <div className="py-2">
                  <Link 
                    to="/profile"
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="User" size={16} />
                    <span>{t('profileSettings')}</span>
                  </Link>
                  <Link 
                    to="/settings"
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="Settings" size={16} />
                    <span>{t('preferences')}</span>
                  </Link>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted transition-smooth">
                    <Icon name="Palette" size={16} />
                    <span>{t('theme')}</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted transition-smooth">
                    <Icon name="HelpCircle" size={16} />
                    <span>{t('helpSupport')}</span>
                  </button>
                </div>
                <div className="border-t border-border py-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error hover:bg-muted transition-smooth">
                    <Icon name="LogOut" size={16} />
                    <span>{t('signOut')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => {/* Mobile menu toggle logic */}}
          >
            <Icon name="Menu" size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-glass border-t border-border z-1000">
        <nav className="flex items-center justify-around py-2">
          {navigationItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-smooth ${
                  isActive
                    ? 'text-primary' :'text-muted-foreground'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span className="text-xs font-medium">{item?.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;