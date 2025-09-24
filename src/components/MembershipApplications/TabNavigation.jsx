import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav aria-label="Tabs" className="flex px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === tab.id
              ? 'text-primary border-b-2 border-primary font-semibold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span className="ml-2 bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
              {tab.count}
            </span>
          )}
          {activeTab === tab.id && (
            <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-primary"></span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default TabNavigation;