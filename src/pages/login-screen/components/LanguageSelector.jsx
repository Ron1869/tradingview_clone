import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LanguageSelector = () => {
  const { currentLanguage, switchLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef?.current && !menuRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const currentLang = languages?.find(lang => lang?.code === currentLanguage) || languages?.[0];

  return (
    <div className="fixed top-4 right-4 z-50" ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-card/90 backdrop-blur-sm"
      >
        <span>{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
        <Icon name="ChevronDown" size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-popover border border-border rounded-lg shadow-elevated z-50">
          <div className="py-2">
            {languages?.map((lang) => (
              <button
                key={lang?.code}
                onClick={() => {
                  switchLanguage(lang?.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-muted transition-smooth ${
                  currentLanguage === lang?.code ? 'text-primary font-medium bg-muted/50' : 'text-foreground'
                }`}
              >
                <span>{lang?.flag}</span>
                <span>{lang?.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;