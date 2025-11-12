// src/hooks/useHistoricalData.ts

import { useState, useRef, useCallback } from "react";
import { HistoricalData, CacheEntry } from "../types/currency";

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

export const useHistoricalData = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  const cache = useRef<Map<string, CacheEntry>>(new Map());

  const getCachedData = useCallback((code: string): HistoricalData | null => {
    const cached = cache.current.get(code.toUpperCase());
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    if (cached) {
      cache.current.delete(code.toUpperCase());
    }
    return null;
  }, []);

  const setCachedData = useCallback((code: string, data: HistoricalData) => {
    cache.current.set(code.toUpperCase(), {
      data,
      timestamp: Date.now(),
    });
  }, []);

  const fetchHistoricalData = useCallback(
    async (code: string) => {
      setIsLoading(true);
      setError(null);
      setHistoricalData(null);
      setIsFromCache(false);

      const cachedData = getCachedData(code);
      if (cachedData) {
        setHistoricalData(cachedData);
        setIsFromCache(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/historical-rate?currency=${code.toUpperCase()}`
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch historical data.");
        }

        const data = result as HistoricalData;
        setHistoricalData(data);
        setCachedData(code, data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [getCachedData, setCachedData]
  );

  const clearData = useCallback(() => {
    setHistoricalData(null);
    setError(null);
    setIsFromCache(false);
  }, []);

  return {
    historicalData,
    isLoading,
    error,
    isFromCache,
    fetchHistoricalData,
    clearData,
  };
};
