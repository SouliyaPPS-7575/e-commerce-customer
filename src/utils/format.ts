export const formatCurrency = (
  value: number,
  locale = 'en-US',
  currency = 'USD',
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
};
