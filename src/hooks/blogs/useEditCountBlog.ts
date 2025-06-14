import { useMutation } from '@tanstack/react-query';
import { editCountBlogServer } from '~/server/blogs';
import { queryClient } from '~/services/queryClient';
import { recentBlogsQueryOption } from './useRecentBlogs';

export const useEditCountBlog = () => {
  const { mutate: editCountBlog } = useMutation({
    mutationFn: editCountBlogServer,
    onSuccess: () => {
      queryClient.invalidateQueries(recentBlogsQueryOption());
    },
  });

  return { editCountBlog };
};
