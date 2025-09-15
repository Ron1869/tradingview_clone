import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';
import SocialLoginButtons from './components/SocialLoginButtons';

const LoginScreen = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = t('invalidEmail');
    }
    
    if (!formData?.password) {
      newErrors.password = t('passwordRequired');
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

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock login API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Login data:', formData);
      
      // Redirect to dashboard after successful login
      window.location.href = '/main-dashboard';
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted flex items-center justify-center p-4">
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
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('welcomeBack')}</h2>
            <p className="text-muted-foreground">{t('enterCredentials')}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="example@blacktrading.com"
                className={errors?.email ? 'border-error' : ''}
                disabled={isLoading}
              />
              {errors?.email && (
                <p className="text-error text-xs mt-1">{errors?.email}</p>
              )}
            </div>

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
              {errors?.password && (
                <p className="text-error text-xs mt-1">{errors?.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formData?.rememberMe}
                onChange={handleInputChange}
                label={t('rememberMe')}
                disabled={isLoading}
              />
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:text-primary/90 transition-colors"
              >
                {t('forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>{t('loading')}</span>
                </div>
              ) : (
                t('signIn')
              )}
            </Button>
          </form>

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

          {/* Social Login */}
          <SocialLoginButtons />

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              {t('createAccount')}{' '}
              <Link 
                to="/registration-screen" 
                className="text-primary hover:text-primary/90 font-medium transition-colors"
              >
                {t('signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;