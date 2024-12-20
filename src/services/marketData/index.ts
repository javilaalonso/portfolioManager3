import { MarketDataProvider } from './types';
import { AlphaVantageProvider } from './alphavantageProvider';
import { FinnhubProvider } from './finnhubProvider';
import { marketDataConfig } from '../../config/marketDataConfig';

let provider: MarketDataProvider | null = null;

export function getMarketDataProvider(): MarketDataProvider {
  if (!provider) {
    switch (marketDataConfig.provider) {
      case 'finnhub':
        provider = new FinnhubProvider();
        break;
      case 'alphavantage':
      default:
        provider = new AlphaVantageProvider();
    }
  }
  return provider;
}