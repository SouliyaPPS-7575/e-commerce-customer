import { createServerFn } from '@tanstack/react-start';
import { Districts, Provinces } from '~/models/profile';
import pb, { fetchAllPb } from '~/services/pocketbaseService';
import { handleError } from './errorHandler';

export const getProvinces = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const provinces = await fetchAllPb<Provinces>('provinces');
    return { provinces };
  } catch (error) {
    throw handleError(error);
  }
});

export const getDistricts = createServerFn({
  method: 'GET',
})
  .validator((d: { province_id: string }) => d)
  .handler(async ({ data }) => {
    try {
      const { province_id } = data;
      const districts = await pb
        .collection('districts')
        .getFullList<Districts>({ filter: `province_id = "${province_id}"` });
      return { districts };
    } catch (error) {
      throw handleError(error);
    }
  });
