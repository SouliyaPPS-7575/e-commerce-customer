import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import {
  CreateAddressesForm,
  EditAddressesForm,
  ViewAddress,
} from '~/models/checkout';
import {
  Districts,
  EditProfileForm,
  GetMe,
  OrderHistoryDetails,
  OrderHistoryItems,
  Provinces,
} from '~/models/profile';
import pb, {
  createPb,
  fetchAllPb,
  fetchFilterPb,
  updatePb,
} from '~/services/pocketbaseService';
import { handleError } from './errorHandler';
import { PaginationAPI } from '~/models';

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

// This function fetches all provinces from the PocketBase database
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

// This function fetches all districts from the PocketBase database
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

// This function fetches the user from the PocketBase database
export const getMe = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const customer_id = getCookie('customer_id') as string;
    return await pb.collection<GetMe>('customers').getOne(customer_id);
  } catch (error) {
    throw handleError(error);
  }
});

// Change email
export const changeEmail = createServerFn({ method: 'POST' })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data: { email, password } }) => {
    try {
      const token = getCookie('token') as string;

      // Set the token before making the request
      pb.authStore.save(token, null);

      const resRequestEmailChange = await pb.send(
        '/api/collections/customers/request-email-change',
        {
          method: 'POST',
          body: { email },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}`,
          },
        },
      );

      const resConfirmEmailChange = await pb.send(
        '/api/collections/customers/confirm-email-change',
        {
          method: 'POST',
          body: {
            token,
            password,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}`,
          },
        },
      );

      return { success: true, resRequestEmailChange, resConfirmEmailChange };
    } catch (error) {
      throw handleError(error);
    }
  });

// Edit profile
export const editProfile = createServerFn({ method: 'POST' })
  .validator((d: EditProfileForm) => d)
  .handler(async ({ data }) => {
    try {
      const customer_id = getCookie('customer_id') as string;
      return await pb.collection('customers').update(customer_id, data);
    } catch (error) {
      throw handleError(error);
    }
  });

// Upload avatar
export const uploadAvatar = createServerFn({ method: 'POST' })
  .validator((d: FormData) => d)
  .handler(async ({ data }) => {
    try {
      const customer_id = getCookie('customer_id') as string;
      // PocketBase will handle the FormData automatically
      return await pb.collection('customers').update(customer_id, data);
    } catch (error) {
      throw handleError(error);
    }
  });

export const getOrderHistoryItems = createServerFn({
  method: 'GET',
})
  .validator((d: { order_id: string }) => d)
  .handler(async ({ data: { order_id } }) => {
    try {
      const res = await fetchFilterPb<OrderHistoryItems>(
        'order_items',
        'order_id',
        order_id,
      );
      return { ...res[0] };
    } catch (error) {
      throw handleError(error);
    }
  });

export const getOrderHistory = createServerFn({
  method: 'GET',
})
  .validator((d: PaginationAPI) => d)
  .handler(async ({ data: { page, limit } }) => {
    try {
      const customer_id = getCookie('customer_id') as string;
      const order_id = await fetchFilterPb<OrderHistoryDetails>(
        'orders',
        'customer_id',
        customer_id,
      );

      const orderIds = order_id.map((item) => item.id);

      const filterString = orderIds.map(id => `order_id="${id}"`).join(' || ');

      const orderItems = await pb
        .collection('order_items')
        .getList<OrderHistoryItems>(page, limit, {
          filter: filterString,
        });

      return orderItems;
    } catch (error) {
      throw handleError(error);
    }
  });
