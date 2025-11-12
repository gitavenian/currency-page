export interface HistoricalRate {
  date: string;
  rate: string;
}

export interface HistoricalData {
  currencyCode: string;
  rates: HistoricalRate[];
}

export interface CacheEntry {
  data: HistoricalData;
  timestamp: number;
}

export interface CurrencyRate {
  currencyCode: string;
  usdRate: string;
  lastRefreshed: string;
}

export interface LatestRateCacheEntry {
  data: CurrencyRate;
  timestamp: number;
}
