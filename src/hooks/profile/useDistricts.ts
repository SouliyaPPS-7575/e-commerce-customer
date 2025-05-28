import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getDistricts } from '~/server/profile';

export const districtsQueryOption = (province_id: string) =>
  queryOptions({
    queryKey: ['districts', province_id],
    queryFn: () => getDistricts({ data: { province_id } }),
  });

export const useDistricts = (province_id: string) => {
  const {
    data: { districts },
  } = useSuspenseQuery(districtsQueryOption(province_id));

  return {
    districts,
  };
};
