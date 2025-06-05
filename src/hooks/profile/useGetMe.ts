import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getMe } from '~/server/profile';

export const getMeQueryOption = () =>
  queryOptions({
    queryKey: ['getMe'],
    queryFn: getMe,
    staleTime: 0,
  });

export const useGetMe = () => {
  const {
    data: me,
  } = useSuspenseQuery(getMeQueryOption());

  return { me };
};
