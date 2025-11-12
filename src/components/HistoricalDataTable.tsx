import React from "react";
import { HistoricalRate } from "@/types/currency";

interface HistoricalDataTableProps {
  // Data props
  ratesToDisplay: HistoricalRate[];
  filteredRatesLength: number;
  currencyCode: string;
  startDate: string;
  endDate: string;
  isLoading: boolean;
  error: string | null;
  isFromCache: boolean;

  // Pagination props
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  // Handler props
  handleClear: () => void;
}

const HistoricalDataTable: React.FC<HistoricalDataTableProps> = ({
  ratesToDisplay,
  filteredRatesLength,
  currencyCode,
  startDate,
  endDate,
  isLoading,
  error,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  setCurrentPage,
  handleClear,
  isFromCache,
}) => {
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-500 rounded-md mb-4">
        <p className="font-semibold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
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
    );
  }

  if (filteredRatesLength > 0) {
    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-medium text-gray-800">
            {currencyCode} Rates
            <span className="text-sm text-gray-500 ml-2">
              ({startDate} to {endDate})
            </span>
          </h3>
          <div className="flex items-center gap-3">
            {isFromCache && (
              <span className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                </svg>
                Cached
              </span>
            )}
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {filteredRatesLength} total rates
            </span>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Exchange Rate (1 {currencyCode} = USD)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ratesToDisplay.map(({ date, rate }) => (
                <tr key={date} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 whitespace-nowrap text-base font-medium text-gray-900">
                    {new Date(date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-base text-gray-700 font-mono font-semibold">
                    ${rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pt-4">
          <span className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredRatesLength)} of {filteredRatesLength}{" "}
            results
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="mt-4 w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Clear Results
        </button>
      </div>
    );
  }

  if (currencyCode) {
    return (
      <div className="mt-6 p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <svg
          className="w-12 h-12 mx-auto text-yellow-500 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-yellow-800 font-medium">
          No data available for this date range
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          Try selecting a different date range
        </p>
        <button
          onClick={handleClear}
          className="mt-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Clear Search
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <svg
        className="w-20 h-20 mx-auto text-gray-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <p className="text-gray-500 italic mb-2">
        Select a currency and date range to view historical rates
      </p>
      <p className="text-xs text-gray-400">
        Tip: Historical data may be limited for some currencies
      </p>
    </div>
  );
};

export default HistoricalDataTable;
