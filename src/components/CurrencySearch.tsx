'use client';

import { useState, FormEvent, useRef } from 'react';

interface CurrencyRate {
  currencyCode: string;
  usdRate: string;
  lastRefreshed: string;
}

interface CacheEntry {
  data: CurrencyRate;
  timestamp: number;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const CurrencySearch = () => {
  const [currencyCode, setCurrencyCode] = useState<string>('');
  const [rateData, setRateData] = useState<CurrencyRate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  const cache = useRef<Map<string, CacheEntry>>(new Map());

  const getCachedData = (code: string): CurrencyRate | null => {
    const cached = cache.current.get(code.toUpperCase());
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    // Remove expired cache
    if (cached) {
      cache.current.delete(code.toUpperCase());
    }
    return null;
  };

  const setCachedData = (code: string, data: CurrencyRate) => {
    cache.current.set(code.toUpperCase(), {
      data,
      timestamp: Date.now()
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (currencyCode.length !== 3) {
      setError("Please enter a valid 3-letter currency code.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRateData(null);
    setIsFromCache(false);


    const cachedData = getCachedData(currencyCode);
    if (cachedData) {
      setRateData(cachedData);
      setIsFromCache(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/latest-rate?currency=${currencyCode.toUpperCase()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch currency rate.');
      }

      const data = result as CurrencyRate;
      setRateData(data);
      setCachedData(currencyCode, data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCurrencyCode('');
    setRateData(null);
    setError(null);
    setIsFromCache(false);
  };

  return (
    <div className="p-4 sm:p-6 bg-white shadow-xl rounded-xl max-w-sm sm:max-w-lg mx-auto my-8 sm:my-12 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Latest Exchange Rate (vs USD)
      </h2>
      
      <form onSubmit={handleSubmit} className="mb-6">

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-grow">

            <label htmlFor="currency-code-latest" className="sr-only">Currency Code (3 letters)</label> 
            <input
              id="currency-code-latest" 
              type="text"
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())}
              placeholder="Enter Currency Code (e.g., EUR)"
              maxLength={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase font-mono text-lg transition"
              disabled={isLoading}
            />
            {currencyCode.length > 0 && currencyCode.length < 3 && (
              <p className="text-xs text-gray-400 mt-1">
                Enter {3 - currencyCode.length} more character{3 - currencyCode.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || currencyCode.length !== 3}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150"
          >
            {isLoading ? 'Fetching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-500 rounded-md mb-4">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3 p-5 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      )}

      {rateData && !isLoading && (
        <div className="space-y-4">

          <div className="p-5 bg-white rounded-lg border border-green-300 shadow-lg">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xl font-medium text-gray-700">1</span>
              <span className="text-3xl font-extrabold text-blue-600 tracking-tight">{rateData.currencyCode}</span>
              <span className="text-lg font-medium text-gray-700">=</span>

              <span className="text-4xl font-extrabold text-green-600">
                ${parseFloat(rateData.usdRate).toFixed(4)}
              </span>
              <span className="text-xl font-medium text-gray-700">USD</span>
            </div>
            <p className="text-sm text-gray-500">
              Last Refreshed: {new Date(rateData.lastRefreshed).toLocaleString()}
            </p>
            {isFromCache && (
              <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/>
                </svg>
                Loaded from cache
              </p>
            )}
          </div>
          <button
            onClick={handleClear}
            className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Clear Results
          </button>
        </div>
      )}

      {!rateData && !error && !isLoading && (
        <div className="text-center py-8">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 italic">
            Enter a 3-letter currency code to get started
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Examples: EUR, GBP, JPY, CAD
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencySearch;