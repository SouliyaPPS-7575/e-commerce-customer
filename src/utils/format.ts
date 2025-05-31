import { useMemo } from 'react';
import { localStorageData } from '~/server/cache';

export const formatCurrency = (value: number, locale = 'en-US') => {
  const hasFraction = value % 1 !== 0;
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export function formattedDate(isoDate?: string): string {
  return useMemo(() => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, [isoDate]);
}

export const viewAvatar = (avatar?: string) => {
  const avatarUrl = avatar?.startsWith('http')
    ? avatar
    : `${process.env.BASE_URL}/api/files/_pb_users_auth_/${localStorageData('customer_id').getLocalStrage()}/${avatar}?token=${localStorageData('token').getLocalStrage()}`;
  return avatarUrl;
};
