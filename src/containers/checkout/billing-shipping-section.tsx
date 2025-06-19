import { CardContent, Stack, TextField, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import { Districts, Provinces } from '~/models/profile';
import { StyledCard } from '~/styles/checkout';

interface BillingShippingSectionProps {
  formAddress: any;
  formCheckout: any;
  provinces: Provinces[];
  districts: Districts[];
}
export function BillingShippingSection({
  formAddress,
  formCheckout,
  provinces,
  districts,
}: BillingShippingSectionProps) {
  const { t } = useTranslation();
  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 400 }}>
          {t('billing')} & {t('shipping')}
        </Typography>

        <Stack spacing={3}>
          {/* Province ID */}
          <formAddress.Field
            name="province_id"
            validators={{
              onChange: ({ value }: any) => {
                if (!value) return t('please_select_province');
              },
              onBlur: ({ value }: any) => {
                if (!value) return t('please_select_province');
              },
            }}
            children={(field: any) => (
              <Autocomplete
                fullWidth
                id={field.name}
                options={provinces || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={
                  provinces.find(
                    (province) => province.id === field.state.value,
                  ) || null
                }
                onChange={(_, newValue) => {
                  field.handleChange(newValue ? newValue.id : '');
                  formAddress.setFieldValue('district_id', '');
                }}
                onBlur={() => field.handleBlur()} // this will trigger onBlur validator
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('province')}
                    size="small"
                    required
                    error={Boolean(
                      field.state.meta.touched && field.state.meta.error,
                    )}
                    helperText={
                      field.state.meta.touched ? field.state.meta.error : ''
                    }
                  />
                )}
              />
            )}
          />

          {/* District ID */}
          <formAddress.Field
            name="district_id"
            validators={{
              onChange: ({ value }: any) => {
                if (!value) return t('please_select_district');
              },
              onBlur: ({ value }: any) => {
                if (!value) return t('please_select_district');
              },
            }}
            children={(field: any) => (
              <Autocomplete
                fullWidth
                id={field.name}
                disabled={!formAddress.state.values.province_id}
                options={districts}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={
                  districts.find(
                    (district) => district.id === field.state.value,
                  ) || null
                }
                onChange={(_, newValue) => {
                  field.handleChange(newValue ? newValue.id : '');
                }}
                onBlur={() => field.handleBlur()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('city')}
                    size="small"
                    required
                    error={Boolean(
                      field.state.meta.touched && field.state.meta.error,
                    )}
                    helperText={
                      field.state.meta.touched ? field.state.meta.error : ''
                    }
                    placeholder={
                      !formAddress.state.values.province_id
                        ? 'Please select a province first'
                        : 'Select district'
                    }
                  />
                )}
              />
            )}
          />

          {/* Village */}
          <formAddress.Field
            name="village"
            validators={{
              onChange: ({ value }: any) => {
                if (!value) return 'Village is required';
              },
            }}
            children={(field: any) => (
              <TextField
                fullWidth
                id={field.name}
                name={field.name}
                label={t('village')}
                variant="outlined"
                value={field.state.value ?? ''}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={() => field.handleBlur()}
                size="small"
                required
                error={Boolean(
                  field.state.meta.touched && field.state.meta.error,
                )}
                helperText={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
            )}
          />

          {/* Shipping Name */}
          <formAddress.Field
            name="shipping_name"
            validators={{
              onChange: ({ value }: any) => {
                if (!value) return 'Shipping name is required';
              },
            }}
            children={(field: any) => (
              <TextField
                fullWidth
                id={field.name}
                name={field.name}
                label={t('shipping_name')}
                variant="outlined"
                value={field.state.value ?? ''}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={() => field.handleBlur()}
                size="small"
                required
                error={Boolean(
                  field.state.meta.touched && field.state.meta.error,
                )}
                helperText={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
            )}
          />

          {/* Additional Information */}
          <formCheckout.Field
            name="remark"
            children={(field: any) => (
              <TextField
                fullWidth
                label={t('additional_information')}
                variant="outlined"
                multiline
                rows={3}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                size="small"
                required
                error={Boolean(
                  field.state.meta.touched && field.state.meta.error,
                )}
                helperText={
                  field.state.meta.touched ? field.state.meta.error : ''
                }
              />
            )}
          />
        </Stack>
      </CardContent>
    </StyledCard>
  );
}
