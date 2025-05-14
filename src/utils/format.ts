export const formatCurrency = (
  value: number,
  locale = 'en-US',
) => {
  const hasFraction = value % 1 !== 0;
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
};
