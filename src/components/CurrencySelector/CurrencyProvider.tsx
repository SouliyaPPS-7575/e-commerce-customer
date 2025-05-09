import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define a type for currency codes
export type CurrencyCode = 'USD' | 'KIP' | 'BATH';

// Define a type for currency info
export type CurrencyInfo = {
  symbol: string;
  rate: number;
};

// Define a type for the currencies object
export type CurrenciesType = {
  [key in CurrencyCode]: CurrencyInfo;
};

// Available currencies with their symbols and conversion rates relative to USD
export const currencies: CurrenciesType = {
  USD: { symbol: '$', rate: 1 },
  KIP: { symbol: '₭', rate: 0.0001 },
  BATH: { symbol: '฿', rate: 0.03 },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  convertPrice: (price: number | string) => string;
  extractPrice: (priceStr: any) => number;
}

// Create context with default values
const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  convertPrice: () => '$0.00',
  extractPrice: () => 0,
});

interface CurrencyProviderProps {
  children?: ReactNode;
  defaultCurrency?: CurrencyCode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
  defaultCurrency = 'USD',
}) => {
  const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency);

  // Extract numeric value from price string if it's a string
  const extractPrice = (priceStr: any) => {
    // Handle undefined, null or empty values
    if (priceStr === undefined || priceStr === null || priceStr === '') {
      return 0;
    }

    // If already a number, return it directly
    if (typeof priceStr === 'number') return priceStr;

    // Convert to string to ensure match works
    const priceString = String(priceStr);

    // Extract numbers from string (assuming format like "$99.99")
    const match = priceString.match(/[0-9]+(\.[0-9]+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Convert price based on selected currency
  const convertPrice = (price: number | string) => {
    const basePrice = extractPrice(price);

    // Assuming base price is in USD, convert to selected currency
    const convertedPrice = basePrice * currencies[currency].rate;

    // Format with 2 decimal places
    return `${currencies[currency].symbol}${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, convertPrice, extractPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use currency context
export const useCurrency = () => useContext(CurrencyContext);

export default CurrencyContext;
