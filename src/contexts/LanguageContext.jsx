import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Russian translations for the Black Trading platform
export const translations = {
  ru: {
    // Navigation
    dashboard: 'Панель управления',
    charts: 'Графики',
    scanner: 'Сканер',
    alerts: 'Уведомления',
    social: 'Социальные сети',
    
    // Authentication
    login: 'Вход',
    register: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Подтвердить пароль',
    firstName: 'Имя',
    lastName: 'Фамилия',
    phone: 'Телефон',
    rememberMe: 'Запомнить меня',
    forgotPassword: 'Забыли пароль?',
    createAccount: 'Создать аккаунт',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    signIn: 'Войти',
    signUp: 'Зарегистрироваться',
    welcomeBack: 'Добро пожаловать обратно',
    createYourAccount: 'Создайте свой аккаунт',
    enterCredentials: 'Введите свои данные для входа',
    fillDetails: 'Заполните свои данные для регистрации',
    
    // Common buttons
    submit: 'Отправить',
    cancel: 'Отмена',
    save: 'Сохранить',
    edit: 'Редактировать',
    delete: 'Удалить',
    confirm: 'Подтвердить',
    
    // Market status
    marketOpen: 'Рынок открыт',
    marketClosed: 'Рынок закрыт',
    preMarket: 'Предварительный рынок',
    live: 'В прямом эфире',
    connecting: 'Подключение',
    offline: 'Оффлайн',
    
    // AI Assistant
    aiAssistant: 'ИИ помощник',
    marketPrediction: 'Прогноз рынка',
    askAI: 'Спросить ИИ',
    aiSettings: 'Настройки ИИ',
    customPrompt: 'Пользовательский запрос',
    enterPrompt: 'Введите ваш запрос для ИИ',
    predictMarket: 'Предсказать рынок',
    analyzing: 'Анализируем',
    
    // Profile
    profile: 'Профиль',
    profileSettings: 'Настройки профиля',
    preferences: 'Предпочтения',
    theme: 'Тема',
    language: 'Язык',
    helpSupport: 'Помощь и поддержка',
    signOut: 'Выйти',
    
    // Settings
    settings: 'Настройки',
    generalSettings: 'Общие настройки',
    tradingSettings: 'Настройки торговли',
    notifications: 'Уведомления',
    security: 'Безопасность',
    
    // Search
    searchSymbols: 'Поиск символов...',
    noSymbolsFound: 'Символы не найдены',
    startTypingToSearch: 'Начните вводить для поиска...',
    
    // Validation messages
    emailRequired: 'Email обязателен',
    passwordRequired: 'Пароль обязателен',
    passwordsDoNotMatch: 'Пароли не совпадают',
    firstNameRequired: 'Имя обязательно',
    lastNameRequired: 'Фамилия обязательна',
    invalidEmail: 'Неверный формат email',
    
    // Generic messages
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успех',
    warning: 'Предупреждение',
    info: 'Информация',
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    charts: 'Charts',
    scanner: 'Scanner',
    alerts: 'Alerts',
    social: 'Social',
    
    // Authentication
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    rememberMe: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    welcomeBack: 'Welcome Back',
    createYourAccount: 'Create Your Account',
    enterCredentials: 'Enter your credentials to login',
    fillDetails: 'Fill in your details to register',
    
    // Common buttons
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    
    // Market status
    marketOpen: 'Market Open',
    marketClosed: 'Market Closed',
    preMarket: 'Pre-Market',
    live: 'Live',
    connecting: 'Connecting',
    offline: 'Offline',
    
    // AI Assistant
    aiAssistant: 'AI Assistant',
    marketPrediction: 'Market Prediction',
    askAI: 'Ask AI',
    aiSettings: 'AI Settings',
    customPrompt: 'Custom Prompt',
    enterPrompt: 'Enter your prompt for AI',
    predictMarket: 'Predict Market',
    analyzing: 'Analyzing',
    
    // Profile
    profile: 'Profile',
    profileSettings: 'Profile Settings',
    preferences: 'Preferences',
    theme: 'Theme',
    language: 'Language',
    helpSupport: 'Help & Support',
    signOut: 'Sign Out',
    
    // Settings
    settings: 'Settings',
    generalSettings: 'General Settings',
    tradingSettings: 'Trading Settings',
    notifications: 'Notifications',
    security: 'Security',
    
    // Search
    searchSymbols: 'Search symbols...',
    noSymbolsFound: 'No symbols found',
    startTypingToSearch: 'Start typing to search...',
    
    // Validation messages
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    passwordsDoNotMatch: 'Passwords do not match',
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    invalidEmail: 'Invalid email format',
    
    // Generic messages
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
  },
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ru'); // Russian as default

  const switchLanguage = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  };

  const t = (key) => {
    return translations?.[currentLanguage]?.[key] || translations?.en?.[key] || key;
  };

  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations?.[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const value = {
    currentLanguage,
    switchLanguage,
    t,
    translations: translations?.[currentLanguage],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};