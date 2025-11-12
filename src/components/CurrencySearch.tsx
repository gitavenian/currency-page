// src/components/CurrencySearch.tsx

'use client'; 

import { useState, FormEvent } from 'react';

// Define the expected structure of the data returned by our Route Handler
interface CurrencyRate {
  currencyCode: string;
  usdRate: string;
  lastRefreshed: string;
}

const CurrencySearch = () => {
  const [currencyCode, setCurrencyCode] = useState<string>('');
  const [rateData, setRateData] = useState<CurrencyRate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (currencyCode.length !== 3) {
        setError("Please enter a valid 3-letter currency code.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setRateData(null);

    try {
      const response = await fetch(`/api/latest-rate?currency=${currencyCode.toUpperCase()}`);
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch currency rate.');
      }

      setRateData(result as CurrencyRate);
      
    } catch (err) {

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl max-w-lg mx-auto my-12 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Latest Exchange Rate (vs USD)</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          value={currencyCode}
          onChange={(e) => setCurrencyCode(e.target.value)}
          placeholder="Enter Currency Code (e.g., EUR)"
          maxLength={3}
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 uppercase font-mono text-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || currencyCode.length !== 3}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-150"
        >
          {isLoading ? 'Fetching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-500 rounded-md">
          <p className="font-semibold">Error:</p> {error}
        </div>
      )}

      {rateData && (
        <div className="space-y-3 p-5 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xl font-medium text-gray-700">
            1 **{rateData.currencyCode}** = <span className="text-green-600 font-extrabold text-3xl">${rateData.usdRate}</span> USD
          </p>
          <p className="text-sm text-gray-500">
            Last Refreshed: {new Date(rateData.lastRefreshed).toLocaleString()}
          </p>
        </div>
      )}

      {/* Initial state placeholder */}
      {!rateData && !error && !isLoading && (
          <p className="text-center text-gray-500 p-4 italic">
            Search for a currency
          </p>
      )}
    </div>
  );
};

export default CurrencySearch;