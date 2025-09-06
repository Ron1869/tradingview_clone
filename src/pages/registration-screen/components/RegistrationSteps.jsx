import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationSteps = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: 'Личные данные', icon: 'User' },
    { number: 2, title: 'Безопасность', icon: 'Shield' },
    { number: 3, title: 'Готово', icon: 'CheckCircle' },
  ];

  return (
    <div className="flex items-center justify-between">
      {steps?.map((step, index) => {
        const isActive = currentStep === step?.number;
        const isCompleted = currentStep > step?.number;
        const isLast = index === steps?.length - 1;

        return (
          <React.Fragment key={step?.number}>
            <div className="flex flex-col items-center space-y-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted
                    ? 'bg-success text-success-foreground'
                    : isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name={step?.icon} size={16} />
                )}
              </div>
              <div className="text-center">
                <div className={`text-xs font-medium ${
                  isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </div>
              </div>
            </div>
            {!isLast && (
              <div className="flex-1 h-px mx-4">
                <div
                  className={`h-full transition-colors ${
                    isCompleted ? 'bg-success' : 'bg-muted'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RegistrationSteps;