"use client";

import { useState, FormEvent, useMemo } from "react";
import { useHistoricalData } from "@/hooks/useHistoricalData";
import { HistoricalRate } from "@/types/currency";
import HistoricalDataTable from "./HistoricalDataTable";

const RATES_PER_PAGE = 10;

const DateSearch = () => {
  const [currencyCode, setCurrencyCode] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    historicalData,
    isLoading,
    error,
    isFromCache,
    fetchHistoricalData,
    clearData,
  } = useHistoricalData();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (currencyCode.length !== 3 || !startDate || !endDate) {
      alert("Please enter a 3-letter currency code, start date, and end date.");
      return;
    }
    if (startDate > endDate) {
      alert("Error: Start date cannot be after the end date.");
      return;
    }

    setCurrentPage(1);
    await fetchHistoricalData(currencyCode);
  };

  const handleClear = () => {
    setCurrencyCode("");
    setStartDate("");
    setEndDate("");
    clearData();
    setCurrentPage(1);
  };

  const filteredRates: HistoricalRate[] = useMemo(() => {
    if (!historicalData) return [];

    return historicalData.rates
      .filter((rate) => {
        const rateDate = rate.date;
        return rateDate >= startDate && rateDate <= endDate;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [historicalData, startDate, endDate]);

  const totalPages = Math.ceil(filteredRates.length / RATES_PER_PAGE);
  const startIndex = (currentPage - 1) * RATES_PER_PAGE;
  const endIndex = startIndex + RATES_PER_PAGE;
  const ratesToDisplay = filteredRates.slice(startIndex, endIndex);

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl max-w-5xl mx-auto mt-8 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Historical Exchange Rates (vs USD)
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 mb-6 items-end"
      >
        <div className="flex-1 w-full">
          <label
            htmlFor="currency-code-historical"
            className="text-sm font-medium text-gray-700 block mb-1"
          >
            Currency Code <span className="text-red-500">*</span>
          </label>
          <input
            id="currency-code-historical"
            type="text"
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())}
            placeholder="EUR, JPY, etc."
            maxLength={3}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase font-mono transition"
            disabled={isLoading}
          />
        </div>

        <div className="flex-1 w-full">
          <label
            htmlFor="start-date"
            className="text-sm font-medium text-gray-700 block mb-1"
          >
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate || undefined}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isLoading}
          />
        </div>

        <div className="flex-1 w-full">
          <label
            htmlFor="end-date"
            className="text-sm font-medium text-gray-700 block mb-1"
          >
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            id="end-date"
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
          disabled={
            isLoading || currencyCode.length !== 3 || !startDate || !endDate
          }
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 w-full md:w-auto"
        >
          {isLoading ? "Loading..." : "Get Data"}
        </button>
      </form>

      <HistoricalDataTable
        ratesToDisplay={ratesToDisplay}
        filteredRatesLength={filteredRates.length}
        currencyCode={historicalData?.currencyCode || currencyCode}
        startDate={startDate}
        endDate={endDate}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        setCurrentPage={setCurrentPage}
        handleClear={handleClear}
        isFromCache={isFromCache}
      />
    </div>
  );
};

export default DateSearch;
