import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react'; // Icono por defecto

const GenericCard = ({
  icon: Icon = FileText,
  title,
  subtitle,
  description,
  tags,
  actions,
  onCardClick,
  theme = 'dark', // 'dark' or 'light'
}) => {
  const themeClasses = {
    dark: {
      card: 'bg-slate-800/50 border-slate-700 hover:border-teal-500/50',
      title: 'text-slate-100',
      subtitle: 'text-slate-400',
      description: 'text-slate-300',
      tag: 'bg-slate-700 text-slate-300',
      tagBorder: 'border-slate-700',
      actionIcon: 'text-slate-400 hover:text-white',
    },
    light: {
      card: 'bg-white border-slate-200 hover:border-teal-300',
      title: 'text-slate-800',
      subtitle: 'text-slate-500',
      description: 'text-slate-600',
      tag: 'bg-slate-100 text-slate-600',
      tagBorder: 'border-slate-200',
      actionIcon: 'text-slate-500 hover:text-slate-900',
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <Card
      className={`${currentTheme.card} hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer h-full`}
      onClick={onCardClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-teal-500/10 p-2 rounded-lg flex-shrink-0">
              <Icon className="text-teal-400" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-lg truncate ${currentTheme.title}`} title={title}>{title}</h3>
              {subtitle && <p className={`text-sm truncate ${currentTheme.subtitle}`} title={subtitle}>{subtitle}</p>}
            </div>
          </div>
          {actions && actions.length > 0 && (
            <div 
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {actions.map((action, index) => (
                <Button key={index} variant="ghost" size="icon" onClick={action.onClick} title={action.tooltip}>
                  <action.icon size={18} className={currentTheme.actionIcon} />
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div>
          {description && <p className={`mb-4 text-sm line-clamp-3 ${currentTheme.description}`}>{description}</p>}
        </div>
        {tags && tags.length > 0 && (
          <div className={`border-t ${currentTheme.tagBorder} pt-3 flex flex-wrap gap-2 mt-auto`}>
            {tags.map((tag, index) => (
              <span key={index} className={`text-xs px-2 py-1 rounded ${currentTheme.tag}`}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Skeleton placeholder for both themes
export const GenericCardSkeleton = ({ theme = 'dark' }) => (
  <div className={`animate-pulse rounded-lg h-40 ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-800/50 border-slate-700'}`} />
);

// Asociar como propiedad estática para poder usar GenericCard.Skeleton
GenericCard.Skeleton = GenericCardSkeleton;
  

export default GenericCard;
