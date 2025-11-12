import { useState, useRef, useCallback } from "react";
import { CurrencyRate, LatestRateCacheEntry } from "@/types/currency";

const CACHE_DURATION = 60 * 60 * 1000;

export const useLatestRate = () => {
  const [rateData, setRateData] = useState<CurrencyRate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  const cache = useRef<Map<string, LatestRateCacheEntry>>(new Map());

  const getCachedData = useCallback((code: string): CurrencyRate | null => {
    const cached = cache.current.get(code.toUpperCase());
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    if (cached) {
      cache.current.delete(code.toUpperCase());
    }
    return null;
  }, []);

  const setCachedData = useCallback((code: string, data: CurrencyRate) => {
    cache.current.set(code.toUpperCase(), {
      data,
      timestamp: Date.now(),
    });
  }, []);

  const fetchLatestRate = useCallback(
    async (code: string) => {
      setIsLoading(true);
      setError(null);
      setRateData(null);
      setIsFromCache(false);

      const cachedData = getCachedData(code);
      if (cachedData) {
        setRateData(cachedData);
        setIsFromCache(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/latest-rate?currency=${code.toUpperCase()}`
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch currency rate.");
        }

        const data = result as CurrencyRate;
        setRateData(data);
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

  // Clear function for the component
  const clearData = useCallback(() => {
    setRateData(null);
    setError(null);
    setIsFromCache(false);
  }, []);

  return {
    rateData,
    isLoading,
    error,
    isFromCache,
    fetchLatestRate,
    clearData,
  };
};
