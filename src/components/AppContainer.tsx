'use client';

import { useState } from 'react';
import CurrencySearch from './CurrencySearch';
import HistoricalSearch from './DateSearch';

type ViewMode = 'latest' | 'date-range';

const AppContainer = () => {
  const [activeView, setActiveView] = useState<ViewMode>('latest');

  const getButtonClasses = (mode: ViewMode) => {
    const isActive = activeView === mode;
    return `px-6 py-3 text-lg font-semibold rounded-t-lg transition-all duration-200 
            ${isActive 
              ? 'bg-white text-blue-600 shadow-sm border-b-4 border-blue-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 border-b-4 border-transparent'
            }`;
  };

  return (
    <div className="max-w-6xl mx-auto my-12">
      {/* Tab Navigation */}
      <div className="flex justify-start border-b-2 border-gray-200 mb-0 bg-gray-50 rounded-t-lg">
        <button
          onClick={() => setActiveView('latest')}
          className={getButtonClasses('latest')}
          aria-pressed={activeView === 'latest'}
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Latest Rate
          </span>
        </button>
        <button
          onClick={() => setActiveView('date-range')}
          className={getButtonClasses('date-range')}
          aria-pressed={activeView === 'date-range'}
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Historical Data
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-gray-50 p-6 rounded-b-lg shadow-lg">
        {activeView === 'latest' ? <CurrencySearch /> : <HistoricalSearch />}
      </div>
    </div>
  );
};

export default AppContainer;