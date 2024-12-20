export interface MarketDataConfig {
  provider: 'alphavantage' | 'finnhub';
  apiKey: string;
}

export const marketDataConfig: MarketDataConfig = {
  provider: 'finnhub',
  apiKey: 'cthl199r01qq96mamaf0cthl199r01qq96mamafg', // Finnhub API Key
};