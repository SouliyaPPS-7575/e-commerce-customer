import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CreateAddressesForm } from '~/models/checkout';
import { localStorageData } from '~/server/cache';
import { createAdresses, editAdresses } from '~/server/profile';
import { queryClient } from '~/services/queryClient';
import { queryKeyViewAddress } from '.';
import { useViewAddress } from '../checkout/useViewAddress';
import { useDistricts } from './useDistricts';
import { useProvinces } from './useProvinces';

export const useAddress = () => {
  const { t } = useTranslation();
  const [provinceID, setProvinceID] = useState('');
  const { address } = useViewAddress();
  const { provinces } = useProvinces();
  const { districts } = useDistricts(provinceID || address?.province_id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tab } = useSearch<any>({
    from: '__root__',
  });

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
      // laos address
      customer_id: localStorageData('customer_id').getLocalStrage(),
      province_id: address?.province_id || null,
      district_id: address?.district_id || null,
      village: address?.village || null,
      shipping_name: address?.shipping_name || null,
      // global address
      country_code: address?.country_code || '',
      country_name: address?.country_name || '',
      address_line_1: address?.address_line_1 || '',
      address_line_2: address?.address_line_2 || '',
      city: address?.city || '',
      state_region: address?.state_region || '',
      postal_code: address?.postal_code || '',
      is_international: address?.is_international || false,
    } as CreateAddressesForm,
    listeners: {
      onChange: (e) => {
        setProvinceID(e.formApi.store.state.values.province_id);
        const {
          // laos address
          province_id,
          district_id,
          village,
          shipping_name,
          // global address
          country_code,
          country_name,
          address_line_1,
          address_line_2,
          city,
          state_region,
          postal_code,
          // is_international,
        } = e.formApi.store.state.values;

        if (tab === 0) {
          // laos address
          const isAllEmptyLaos =
            !!province_id && !!district_id && !!village && !!shipping_name;
          setIsSubmitting(!isAllEmptyLaos);
        } else if (tab === 1) {
          // global address
          const isAllEmptyGlobal =
            !!country_code &&
            !!country_name &&
            !!address_line_1 &&
            !!address_line_2 &&
            !!city &&
            !!state_region &&
            !!postal_code;
          setIsSubmitting(!isAllEmptyGlobal);
        }
      },
    },
    onSubmit: async ({ value }) => {
      const isSame =
        // laos address
        value.province_id === address?.province_id &&
        value.district_id === address?.district_id &&
        value.village === address?.village &&
        value.shipping_name === address?.shipping_name &&
        // global address
        value.country_code === address?.country_code &&
        value.country_name === address?.country_name &&
        value.address_line_1 === address?.address_line_1 &&
        value.address_line_2 === address?.address_line_2 &&
        value.city === address?.city &&
        value.state_region === address?.state_region &&
        value.postal_code === address?.postal_code &&
        value.is_international === address?.is_international;

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
    isSubmitting,
    setIsSubmitting,
  };
};
