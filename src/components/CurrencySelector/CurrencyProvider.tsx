// src/contexts/CurrencyContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCurrency } from '~/hooks/shop/useCurrency';

interface CurrencyContextType {
  displayCurrency: string;
  currency: string;
  rate: number;
  convert: (value: number) => number;
  setCurrency: (ccy: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currencies } = useCurrency();
  const [currency, setCurrency] = useState<string>('USD');
  const [rate, setRate] = useState<number>(1);
  const displayCurrency =
    currency === 'THB' ? '฿' : currency === 'USD' ? '$' : currency;

  useEffect(() => {
    const selected = currencies.find(
      (c) => c.ccy === currency && c.type === 'SELL',
    );
    if (selected) {
      setRate(Number(selected.rate));
    }
  }, [currency, currencies]);

  const convert = (value: number) => {
    if (currency === 'THB') return value * rate;
    return value / rate; // for USD or others
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, displayCurrency, rate, convert, setCurrency }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error(
      'useCurrencyContext must be used within a CurrencyProvider',
    );
  }
  return context;
};
