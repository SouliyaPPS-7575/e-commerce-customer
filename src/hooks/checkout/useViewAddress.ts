import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getViewAddresses } from '~/server/profile';
import { queryKeyViewAddress } from '../profile';

export const viewAddressQueryOption = () =>
  queryOptions({
    queryKey: queryKeyViewAddress,
    queryFn: getViewAddresses,
    staleTime: 1,
  });

export const useViewAddress = () => {
  const {
    data: { address },
  } = useSuspenseQuery(viewAddressQueryOption());

  return {
    address,
  };
};
