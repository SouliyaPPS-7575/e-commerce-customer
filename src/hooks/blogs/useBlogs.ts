import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getAllBlogs } from '~/server/blogs';

export const blogsQueryOption = () =>
  queryOptions({
    queryKey: ['blogs'],
    queryFn: getAllBlogs,
  });

export const useBlogs = () => {
  const { data: blogs } = useSuspenseQuery(blogsQueryOption());

  return {
    blogs,
  };
};
