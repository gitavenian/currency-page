// src/components/HistoricalSearch.tsx

'use client'; 

import { useState, FormEvent, useMemo } from 'react';

interface HistoricalRate {
  date: string;
  rate: string;
}

interface HistoricalData {
  currencyCode: string;
  rates: HistoricalRate[];
}

const DateSearch = () => {
  const [currencyCode, setCurrencyCode] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      const response = await fetch(`/api/historical-rate?currency=${currencyCode.toUpperCase()}`);
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch historical data.');
      }
      setHistoricalData(result as HistoricalData);
      
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


  return (
    <div className="p-6 bg-white shadow-xl rounded-xl max-w-5xl mx-auto mt-8 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Historical Exchange Rates (vs USD)</h2>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6 items-end">

        <div className="flex-1 w-full">
            <label className="text-sm font-medium text-gray-700 block mb-1">Currency Code</label>
            <input
              type="text"
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              placeholder="EUR, JPY, etc."
              maxLength={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 uppercase font-mono"
            />
        </div>

        <div className="flex-1 w-full">
            <label className="text-sm font-medium text-gray-700 block mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
        </div>

        <div className="flex-1 w-full">
            <label className="text-sm font-medium text-gray-700 block mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-150 w-full md:w-auto"
        >
          {isLoading ? 'Loading...' : 'Get Historical Data'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-500 rounded-md mb-4">
          <p className="font-semibold">Error:</p> {error}
        </div>
      )}

      {filteredRates.length > 0 && (
        <div className="mt-6 overflow-x-auto">
            <h3 className="text-xl font-medium text-gray-800 mb-3">
                Rates for {historicalData?.currencyCode} ({startDate} to {endDate})
            </h3>
            <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exchange Rate (vs $1 USD)</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRates.map(({ date, rate }) => (
                        <tr key={date} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">${rate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
      {!historicalData && !error && !isLoading && (
          <p className="text-center text-gray-500 p-4 italic">
            Select a date range and currency to view historical exchange rates.
          </p>
      )}
    </div>
  );
};

export default DateSearch;