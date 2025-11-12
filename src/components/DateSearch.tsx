'use client';

import { useState, FormEvent, useMemo, useRef } from 'react';

interface HistoricalRate {
  date: string;
  rate: string;
}

interface HistoricalData {
  currencyCode: string;
  rates: HistoricalRate[];
}

interface CacheEntry {
  data: HistoricalData;
  timestamp: number;
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const DateSearch = () => {
  const [currencyCode, setCurrencyCode] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  // Cache stored in ref to persist across renders
  const cache = useRef<Map<string, CacheEntry>>(new Map());

  const getCachedData = (code: string): HistoricalData | null => {
    const cached = cache.current.get(code.toUpperCase());
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    if (cached) {
      cache.current.delete(code.toUpperCase());
    }
    return null;
  };

  const setCachedData = (code: string, data: HistoricalData) => {
    cache.current.set(code.toUpperCase(), {
      data,
      timestamp: Date.now()
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (currencyCode.length !== 3 || !startDate || !endDate) {
      setError("Please enter a 3-letter currency code, start date, and end date.");
      return;
    }
    if (startDate > endDate) {
      setError("Start date cannot be after the end date.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHistoricalData(null);
    setIsFromCache(false);

    // Check cache first
    const cachedData = getCachedData(currencyCode);
    if (cachedData) {
      setHistoricalData(cachedData);
      setIsFromCache(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/historical-rate?currency=${currencyCode.toUpperCase()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch historical data.');
      }

      const data = result as HistoricalData;
      setHistoricalData(data);
      setCachedData(currencyCode, data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRates = useMemo(() => {
    if (!historicalData) return [];

    return historicalData.rates.filter(rate => {
      const rateDate = rate.date;
      return rateDate >= startDate && rateDate <= endDate;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [historicalData, startDate, endDate]);

  const handleClear = () => {
    setCurrencyCode('');
    setStartDate('');
    setEndDate('');
    setHistoricalData(null);
    setError(null);
    setIsFromCache(false);
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl max-w-5xl mx-auto mt-8 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Historical Exchange Rates (vs USD)
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1 w-full">
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Currency Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())}
            placeholder="EUR, JPY, etc."
            maxLength={3}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase font-mono transition"
            disabled={isLoading}
          />
          {currencyCode.length > 0 && currencyCode.length < 3 && (
            <p className="text-xs text-gray-500 mt-1">
              {3 - currencyCode.length} more character{3 - currencyCode.length !== 1 ? 's' : ''} required
            </p>
          )}
        </div>

        <div className="flex-1 w-full">
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate || undefined}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isLoading}
          />
        </div>

        <div className="flex-1 w-full">
          <label className="text-sm font-medium text-gray-700 block mb-1">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || currencyCode.length !== 3 || !startDate || !endDate}
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 w-full md:w-auto"
        >
          {isLoading ? 'Loading...' : 'Get Data'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-500 rounded-md mb-4">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mt-6 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredRates.length > 0 && !isLoading && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-medium text-gray-800">
              {historicalData?.currencyCode} Rates
              <span className="text-sm text-gray-500 ml-2">
                ({startDate} to {endDate})
              </span>
            </h3>
            <div className="flex items-center gap-3">
              {isFromCache && (
                <span className="text-xs text-blue-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/>
                  </svg>
                  Cached
                </span>
              )}
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {filteredRates.length} rates
              </span>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exchange Rate (1 {historicalData?.currencyCode} = USD)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRates.map(({ date, rate }) => (
                  <tr key={date} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                      ${rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleClear}
            className="mt-4 w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Clear Results
          </button>
        </div>
      )}

      {historicalData && filteredRates.length === 0 && !isLoading && (
        <div className="mt-6 p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <svg className="w-12 h-12 mx-auto text-yellow-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-yellow-800 font-medium">No data available for this date range</p>
          <p className="text-sm text-yellow-700 mt-1">Try selecting a different date range</p>
        </div>
      )}

      {!historicalData && !error && !isLoading && (
        <div className="text-center py-12">
          <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 italic mb-2">
            Select a currency and date range to view historical rates
          </p>
          <p className="text-xs text-gray-400">
            Tip: Historical data may be limited for some currencies
          </p>
        </div>
      )}
    </div>
  );
};

export default DateSearch;