import React, { useState } from 'react';
import { cn } from '@/utils/cn';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const variantClasses = {
    default: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: 'border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors',
      active: 'border-blue-500 text-blue-600 dark:text-blue-400',
      inactive: 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
    },
    pills: {
      container: 'space-x-1',
      tab: 'px-3 py-2 text-sm font-medium rounded-md transition-colors',
      active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
      inactive: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700',
    },
    underline: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: 'px-4 py-2 text-sm font-medium border-b-2 border-transparent transition-colors',
      active: 'border-blue-500 text-blue-600 dark:text-blue-400',
      inactive: 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3',
  };

  const currentVariant = variantClasses[variant];

  return (
    <div className={className}>
      {/* Tab navigation */}
      <div className={cn('flex', currentVariant.container)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'flex items-center space-x-2 transition-colors',
              currentVariant.tab,
              sizeClasses[size],
              activeTab === tab.id
                ? currentVariant.active
                : currentVariant.inactive,
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export { Tabs };
