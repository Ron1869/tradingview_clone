import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';
import RegistrationSteps from './components/RegistrationSteps';
import SocialLoginButtons from './components/SocialLoginButtons';
import LanguageSelector from './components/LanguageSelector';

const RegistrationScreen = () => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    emailVerified: false,
    phoneVerified: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData?.firstName) {
      newErrors.firstName = t('firstNameRequired');
    }
    
    if (!formData?.lastName) {
      newErrors.lastName = t('lastNameRequired');
    }
    
    if (!formData?.email) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = t('invalidEmail');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData?.password) {
      newErrors.password = t('passwordRequired');
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = t('passwordsDoNotMatch');
    }
    
    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'Необходимо согласиться с условиями';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (currentStep !== 3) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock registration API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Registration data:', formData);
      
      // Redirect to dashboard after successful registration
      window.location.href = '/main-dashboard';
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData?.password;
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    const checks = [
      password?.length >= 8,
      /[A-Z]/?.test(password),
      /[a-z]/?.test(password),
      /[0-9]/?.test(password),
      /[^A-Za-z0-9]/?.test(password),
    ];
    
    strength = checks?.filter(Boolean)?.length;
    
    const labels = ['Очень слабый', 'Слабый', 'Средний', 'Хороший', 'Отличный'];
    const colors = ['bg-error', 'bg-warning', 'bg-info', 'bg-success', 'bg-primary'];
    
    return {
      strength,
      label: labels?.[strength - 1] || '',
      color: colors?.[strength - 1] || 'bg-muted',
      percentage: (strength / 5) * 100,
    };
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
            {t('firstName')}
          </label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={formData?.firstName}
            onChange={handleInputChange}
            placeholder="Иван"
            className={errors?.firstName ? 'border-error' : ''}
            disabled={isLoading}
          />
          {errors?.firstName && (
            <p className="text-error text-xs mt-1">{errors?.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
            {t('lastName')}
          </label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={formData?.lastName}
            onChange={handleInputChange}
            placeholder="Иванов"
            className={errors?.lastName ? 'border-error' : ''}
            disabled={isLoading}
          />
          {errors?.lastName && (
            <p className="text-error text-xs mt-1">{errors?.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          {t('email')}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData?.email}
          onChange={handleInputChange}
          placeholder="ivan@blacktrading.com"
          className={errors?.email ? 'border-error' : ''}
          disabled={isLoading}
        />
        {errors?.email && (
          <p className="text-error text-xs mt-1">{errors?.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
          {t('phone')} (необязательно)
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData?.phone}
          onChange={handleInputChange}
          placeholder="+7 (999) 123-45-67"
          disabled={isLoading}
        />
      </div>
    </div>
  );

  const renderStep2 = () => {
    const passwordStrength = getPasswordStrength();
    
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            {t('password')}
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData?.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className={errors?.password ? 'border-error pr-12' : 'pr-12'}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>
          {formData?.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Сила пароля:</span>
                <span className={`font-medium ${passwordStrength?.strength >= 3 ? 'text-success' : 'text-warning'}`}>
                  {passwordStrength?.label}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${passwordStrength?.color}`}
                  style={{ width: `${passwordStrength?.percentage}%` }}
                />
              </div>
            </div>
          )}
          {errors?.password && (
            <p className="text-error text-xs mt-1">{errors?.password}</p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
            {t('confirmPassword')}
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData?.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              className={errors?.confirmPassword ? 'border-error pr-12' : 'pr-12'}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>
          {errors?.confirmPassword && (
            <p className="text-error text-xs mt-1">{errors?.confirmPassword}</p>
          )}
        </div>
        <div>
          <Checkbox
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData?.agreeToTerms}
            onChange={handleInputChange}
            label={
              <span className="text-sm">
                Я соглашаюсь с{' '}
                <Link to="/terms" className="text-primary hover:text-primary/90">
                  Условиями использования
                </Link>{' '}
                и{' '}
                <Link to="/privacy" className="text-primary hover:text-primary/90">
                  Политикой конфиденциальности
                </Link>
              </span>
            }
            disabled={isLoading}
            className={errors?.agreeToTerms ? 'border-error' : ''}
          />
          {errors?.agreeToTerms && (
            <p className="text-error text-xs mt-1">{errors?.agreeToTerms}</p>
          )}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
        <Icon name="CheckCircle" size={32} className="text-success" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Регистрация завершена!
        </h3>
        <p className="text-muted-foreground">
          Добро пожаловать в Black Trading. Ваш аккаунт успешно создан.
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-left">
        <h4 className="font-medium text-foreground mb-2">Следующие шаги:</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center space-x-2">
            <Icon name="Mail" size={16} />
            <span>Проверьте email для подтверждения адреса</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Shield" size={16} />
            <span>Настройте двухфакторную аутентификацию</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="User" size={16} />
            <span>Заполните профиль для лучшего опыта</span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted flex items-center justify-center p-4">
      {/* Language Selector */}
      <LanguageSelector />
      
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-elevated p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="TrendingUp" size={24} color="white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Black Trading</h1>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {currentStep < 3 ? t('createYourAccount') : 'Добро пожаловать!'}
            </h2>
            {currentStep < 3 && (
              <p className="text-muted-foreground">{t('fillDetails')}</p>
            )}
          </div>

          {/* Progress Steps */}
          <RegistrationSteps currentStep={currentStep} totalSteps={3} />

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="mt-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <Button
                type="button"
                variant="ghost"
                onClick={handlePrevStep}
                disabled={currentStep === 1 || isLoading}
                className={currentStep === 1 ? 'invisible' : ''}
              >
                <Icon name="ChevronLeft" size={16} className="mr-2" />
                Назад
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="ml-auto"
                >
                  Далее
                  <Icon name="ChevronRight" size={16} className="ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Создаем аккаунт...</span>
                    </div>
                  ) : (
                    'Начать торговлю'
                  )}
                </Button>
              )}
            </div>
          </form>

          {/* Social Login & Login Link */}
          {currentStep === 1 && (
            <>
              {/* Divider */}
              <div className="my-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">или</span>
                  </div>
                </div>
              </div>

              {/* Social Registration */}
              <SocialLoginButtons />

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  {t('alreadyHaveAccount')}{' '}
                  <Link 
                    to="/login-screen" 
                    className="text-primary hover:text-primary/90 font-medium transition-colors"
                  >
                    {t('signIn')}
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationScreen;