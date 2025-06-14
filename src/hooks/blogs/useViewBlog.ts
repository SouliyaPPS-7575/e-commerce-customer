import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getViewDetailBlog } from '~/server/blogs';

export const getViewBlogQueryOption = (blog_id: string) =>
  queryOptions({
    queryKey: ['viewBlog', blog_id],
    queryFn: () =>
      getViewDetailBlog({
        data: { blog_id },
      }),
  });

export const useViewBlog = (blog_id: string) => {
  const { data: blog } = useSuspenseQuery(getViewBlogQueryOption(blog_id));

  return {
    blog,
  };
};
