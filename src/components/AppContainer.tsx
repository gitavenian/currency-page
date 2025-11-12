'use client';

import { useState } from 'react';
import CurrencySearch from './CurrencySearch';
import HistoricalSearch from './DateSearch';

type ViewMode = 'latest' | 'date-range';

const AppContainer = () => {
  const [activeView, setActiveView] = useState<ViewMode>('latest');

  const getButtonClasses = (mode: ViewMode) => {
    return `px-6 py-3 text-lg font-bold rounded-t-lg transition duration-200 
            ${activeView === mode 
              ? 'bg-white text-blue-600 border-b-4 border-blue-600' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border-b-4 border-transparent'
            }`;
  };

  return (
    <div className="max-w-5xl mx-auto my-12">
      
      <div className="flex justify-start border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveView('latest')}
          className={getButtonClasses('latest')}
        >
          Latest Rate Search
        </button>
        <button
          onClick={() => setActiveView('date-range')}
          className={getButtonClasses('date-range')}
        >
          Historical Range Search
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {activeView === 'latest' ? <CurrencySearch /> : <HistoricalSearch />}
      </div>
    </div>
  );
};

export default AppContainer;