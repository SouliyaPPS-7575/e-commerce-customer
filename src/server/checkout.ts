import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import {
  CreateAddressesForm,
  CreateOrdersForm,
  EditAddressesForm,
  ViewAddress,
} from '~/models/checkout';
import pb, { createPb, updatePb } from '~/services/pocketbaseService';
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

export const editAdresses = createServerFn({
  method: 'POST',
})
  .validator((d: { id: string; formData: EditAddressesForm }) => d)
  .handler(async ({ data: { id, formData } }) => {
    try {
      const res = await updatePb<EditAddressesForm>('addresses', id, formData);
      return { success: true, res };
    } catch (error) {
      throw handleError(error);
    }
  });

export const getViewAddresses = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const address = await pb.collection('addresses').getFullList<ViewAddress>({
      filter: `customer_id="${getCookie('customer_id')}"`,
    });
    return { success: true, address: address[0] };
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
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`,
        }
      });
      return { success: true, res };
    } catch (error) {
      throw handleError(error);
    }
  });
