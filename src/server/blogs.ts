import { createServerFn } from '@tanstack/react-start';
import { BlogDetails, BlogsItem, EditCountBlogForm } from '~/models/blogs';
import { fetchAllPb, fetchPb, updatePb } from '~/services/pocketbaseService';
import { handleError } from './errorHandler';

export const getAllBlogs = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const allBlogs = await fetchAllPb<BlogsItem>('blogs');
    // Sort blogs by created date in descending order (latest first)
    const sortedBlogs = allBlogs.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );
    return sortedBlogs;
  } catch (error) {
    throw handleError(error);
  }
});

export const getViewDetailBlog = createServerFn({
  method: 'GET',
})
  .validator((d: { blog_id: string }) => d)
  .handler(async ({ data: { blog_id } }) => {
    try {
      return await fetchPb<BlogDetails>('blogs', blog_id);
    } catch (error) {
      throw handleError(error);
    }
  });

export const editCountBlogServer = createServerFn({
  method: 'POST',
})
  .validator((d: { blog_id: string; formData: EditCountBlogForm }) => d)
  .handler(async ({ data }) => {
    try {
      const updatedBlog = await updatePb<EditCountBlogForm>(
        'blogs',
        data.blog_id,
        data.formData,
      );
      return updatedBlog;
    } catch (error) {
      throw handleError(error);
    }
  });

export const getRecentBlogs = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const recent = await fetchAllPb<BlogsItem>('blogs');

    // Sort blogs by count in descending order (most to least)
    const recentStories = recent.sort((a, b) => b.count - a.count);

    return recentStories;
  } catch (error) {
    throw handleError(error);
  }
});
