import React from 'react';
import { Crown, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

const PlanBadge = ({ plan, className = '' }) => {
  if (!plan) return null;
  
  const planConfig = {
    basic: {
      label: 'Básico',
      icon: Shield,
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      iconColor: 'text-blue-600'
    },
    premium: {
      label: 'Premium',
      icon: Crown,
      className: 'bg-amber-100 text-amber-800 border-amber-200',
      iconColor: 'text-amber-600'
    }
  };
  
  const config = planConfig[plan] || planConfig.basic;
  const Icon = config.icon;
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
      config.className,
      className
    )}>
      <Icon className={cn('w-3 h-3', config.iconColor)} />
      {config.label}
    </span>
  );
};

export default PlanBadge; 