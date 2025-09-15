import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useLanguage } from '../../contexts/LanguageContext';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { t } = useLanguage();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const mockSearchResults = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$175.43', change: '+1.2%' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$2,847.63', change: '-0.8%' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.50', change: '+2.1%' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$378.85', change: '+0.5%' }
  ];

  const filteredResults = mockSearchResults.filter(item =>
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSelect = (symbol) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    window.location.href = `/advanced-chart?symbol=${symbol}`;
  };

  return (
    <header className="h-16 flex-shrink-0 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-muted-foreground"
        >
          <Icon name={isSidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={20} />
        </Button>
        
        {/* Quick Search */}
        <div className="relative" ref={searchRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center space-x-2 text-muted-foreground"
          >
            <Icon name="Search" size={16} />
            <span className="text-sm hidden sm:inline">{t('searchSymbols')}</span>
            <span className="text-xs bg-muted px-2 py-1 rounded-md hidden md:inline">Ctrl+K</span>
          </Button>

          {isSearchOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevated z-1100">
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('searchSymbols')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredResults.length > 0 ? (
                  filteredResults.map((item) => (
                    <button
                      key={item.symbol}
                      onClick={() => handleSearchSelect(item.symbol)}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted transition-smooth text-left"
                    >
                      <div>
                        <div className="font-medium text-foreground text-data">{item.symbol}</div>
                        <div className="text-sm text-muted-foreground">{item.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground text-data">{item.price}</div>
                        <div className={`text-xs ${item.change.startsWith('+') ? 'text-success' : 'text-error'}`}>
                          {item.change}
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
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="rounded-full"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
            </Button>

            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevated z-1100">
                <div className="p-3 border-b border-border">
                  <div className="text-sm font-medium text-foreground">{t('userName')}</div>
                  <div className="text-xs text-muted-foreground">{t('userEmail')}</div>
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
      </div>
    </header>
  );
};

export default Header;
