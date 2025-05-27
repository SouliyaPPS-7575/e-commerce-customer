import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getProvinces } from '~/server/profile';

export const provincesQueryOption = () =>
  queryOptions({
    queryKey: ['provinces'],
    queryFn: getProvinces,
  });

export const useProvinces = () => {
  const {
    data: { provinces },
  } = useSuspenseQuery(provincesQueryOption());

  return {
    provinces,
  };
};
