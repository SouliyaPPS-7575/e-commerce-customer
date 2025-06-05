import { createServerFn } from '@tanstack/react-start';
import { BlogDetails, BlogsItem } from '~/models/blogs';
import { fetchAllPb, fetchPb } from '~/services/pocketbaseService';
import { handleError } from './errorHandler';

export const getAllBlogs = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    return await fetchAllPb<BlogsItem>('blogs');
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
