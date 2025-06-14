import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getRecentBlogs } from '~/server/blogs';

export const recentBlogsQueryOption = () =>
  queryOptions({
    queryKey: ['recentBlogs'],
    queryFn: getRecentBlogs,
    staleTime: 0,
  });

export const useRecentBlogs = () => {
  const { data: recentBlogs } = useSuspenseQuery(recentBlogsQueryOption());
  return {
    recentBlogs,
  };
};
