import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getWhatsappLink } from '~/server/contact';

export const whatsappLinkQueryOption = () =>
  queryOptions({
    queryKey: ['whatsappLink'],
    queryFn: getWhatsappLink,
  });

export const useContact = () => {
  const { data: whatsappLink } = useSuspenseQuery(whatsappLinkQueryOption());
  return {
    whatsappLink,
  };
};
