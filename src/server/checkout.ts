import { createServerFn } from '@tanstack/react-start';
import { CreateAddressesForm, CreateOrdersForm } from '~/models/checkout';
import pb, { createPb } from '~/services/pocketbaseService';
import { handleError } from './errorHandler';

export const createAdresses = createServerFn({
  method: 'POST',
})
  .validator((d: CreateAddressesForm) => d)
  .handler(async ({ data }) => {
    try {
      const res = await createPb<CreateAddressesForm>('addresses', data);
      return { success: true, res };
    } catch (error) {
      throw handleError(error);
    }
  });

export const createOrder = createServerFn({
  method: 'POST',
})
  .validator((d: CreateOrdersForm) => d)
  .handler(async ({ data }) => {
    try {
      const res = await pb.send('/cust/checkout', {
        method: 'create',
        body: data,
      });
      return { success: true, res };
    } catch (error) {
      throw handleError(error);
    }
  });
