export const formatCurrency = (
  value: number,
  locale = 'en-US',
) => {
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
