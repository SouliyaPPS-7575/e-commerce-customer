import { createServerFn } from '@tanstack/react-start';
import { WhatsappLink } from '~/models/contact';
import { fetchAllPb } from '~/services/pocketbaseService';
import { handleError } from './errorHandler';

export const getWhatsappLink = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const res = await fetchAllPb<WhatsappLink>('contacts');
    return res[0]?.link;
  } catch (error) {
    throw handleError(error);
  }
});
