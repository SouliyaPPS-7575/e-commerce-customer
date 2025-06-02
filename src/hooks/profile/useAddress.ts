import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CreateAddressesForm } from '~/models/checkout';
import { localStorageData } from '~/server/cache';
import { createAdresses, editAdresses } from '~/server/profile';
import { queryClient } from '~/services/queryClient';
import { useViewAddress } from '../checkout/useViewAddress';
import { useDistricts } from './useDistricts';
import { useProvinces } from './useProvinces';
import { queryKeyViewAddress } from '.';

export const useAddress = () => {
  const { t } = useTranslation();
  const [provinceID, setProvinceID] = useState('');
  const { address } = useViewAddress();
  const { provinces } = useProvinces();
  const { districts } = useDistricts(provinceID || address?.province_id);

  const { mutate: createAddressMutate } = useMutation({
    mutationFn: createAdresses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyViewAddress });
      toast.success(t('successfully'));
    },
  });

  const { mutate: editAdressMutate } = useMutation({
    mutationFn: editAdresses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyViewAddress });
      toast.success(t('successfully'));
    },
  });

  const formAddress = useForm({
    defaultValues: {
      customer_id: localStorageData('customer_id').getLocalStrage(),
      province_id: address?.province_id || '',
      district_id: address?.district_id || '',
      village: address?.village || '',
      shipping_name: address?.shipping_name || '',
    } as CreateAddressesForm,
    listeners: {
      onChange: (e) => {
        setProvinceID(e.formApi.store.state.values.province_id);
      },
    },
    onSubmit: async ({ value }) => {
      const isSame =
        value.province_id === address?.province_id &&
        value.district_id === address?.district_id &&
        value.village === address?.village &&
        value.shipping_name === address?.shipping_name;

      if (isSame && address !== undefined) {
        return Promise.resolve();
      } else if (address !== undefined) {
        return new Promise((resolve, reject) => {
          editAdressMutate(
            {
              data: {
                id: address?.id,
                formData: value,
              },
            },
            {
              onSuccess: () => resolve(undefined),
              onError: (error) => reject(error),
            },
          );
        });
      }

      if (address === undefined) {
        return new Promise((resolve, reject) => {
          createAddressMutate(
            {
              data: value,
            },
            {
              onSuccess: () => resolve(undefined),
              onError: (error) => reject(error),
            },
          );
        });
      }
    },
  });

  return {
    formAddress,
    provinces,
    districts,
  };
};
