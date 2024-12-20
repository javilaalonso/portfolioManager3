import axios from 'axios';
import { MarketDataProvider, StockQuote, SearchResult, ApiError } from './types';
import { marketDataConfig } from '../../config/marketDataConfig';

const BASE_URL = 'https://finnhub.io/api/v1';

export class FinnhubProvider implements MarketDataProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = marketDataConfig.apiKey;
  }

  async searchSymbols(query: string): Promise<SearchResult[] | ApiError> {
    try {
      if (!query || query.length < 1) return [];

      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          q: query,
          token: this.apiKey,
        },
        timeout: 5000,
      });

      if (!response.data.result) {
        return {
          message: 'Invalid API Response',
          details: response.data
        };
      }

      return response.data.result.map((item: any) => ({
        symbol: item.symbol,
        name: item.description,
        type: item.type,
        region: 'US', // Finnhub primarily focuses on US markets
        currency: 'USD',
      }));

    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          message: 'Network Error',
          details: {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
          }
        };
      }
      return {
        message: 'Unknown Error',
        details: error
      };
    }
  }

  async getStockQuote(symbol: string): Promise<StockQuote | ApiError> {
    try {
      const response = await axios.get(`${BASE_URL}/quote`, {
        params: {
          symbol,
          token: this.apiKey,
        },
        timeout: 5000,
      });

      if (!response.data || typeof response.data.c !== 'number') {
        return {
          message: 'Invalid API Response',
          details: response.data
        };
      }

      return {
        symbol,
        price: response.data.c,
        change: response.data.d || 0,
        changePercent: response.data.dp || 0,
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          message: 'Network Error',
          details: {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
          }
        };
      }
      return {
        message: 'Unknown Error',
        details: error
      };
    }
  }
}