import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import {
  Box,
  CardContent,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import {
  useNavigate,
  useParams,
  useRouterState,
  useSearch,
} from '@tanstack/react-router';
import { useState } from 'react';
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
  // Current Path URL
  const location = useRouterState({ select: (state) => state.location });
  const currentPath = location.pathname;

  const { tab } = useSearch<any>({
    from: '__root__',
  });

  const [tabValue, setTabValue] = useState(tab);
  const navigate = useNavigate();

  // Obtain search parameters from the router
  const params = useParams({ from: '__root__' }) as any;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    if (currentPath.startsWith('/shop/buy-checkout')) {
      navigate({
        to: '/shop/buy-checkout/$cart_id/$product_id',
        params: {
          cart_id: params?.cart_id,
          product_id: params?.product_id,
        },
        search: {
          tab: newValue,
        },
      });
    } else {
      navigate({
        to: '/shop/checkout',
        search: {
          tab: newValue,
        },
      });
    }
  };

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 0, fontWeight: 500 }}>
          {t('billing')} &amp; {t('shipping')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="address form tabs"
            centered
            sx={{
              backgroundColor: 'background.paper',
              px: 2,
            }}
          >
            <Tab
              icon={<HomeIcon />}
              iconPosition="start"
              label={t('address_in_Laos')}
            />
            <Tab
              icon={<PublicIcon />}
              iconPosition="start"
              label={t('global_address')}
            />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ px: { xs: 0, sm: 3 }, py: 2 }}
          >
            <Grid container spacing={3}>
              {/* Province ID */}
              <Grid size={12}>
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
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
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
                            field.state.meta.touched
                              ? field.state.meta.error
                              : ''
                          }
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* District ID */}
              <Grid size={12}>
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
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
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
                          label={t('district')}
                          size="small"
                          required
                          error={Boolean(
                            field.state.meta.touched && field.state.meta.error,
                          )}
                          helperText={
                            field.state.meta.touched
                              ? field.state.meta.error
                              : ''
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
              </Grid>

              {/* Village */}
              <Grid size={12}>
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
              </Grid>

              {/* Shipping Name */}
              <Grid size={12}>
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
              </Grid>

              {/* Additional Information */}
              <Grid size={12}>
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
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 1 && (
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ px: { xs: 0, sm: 3 }, py: 2 }}
          >
            <Grid container spacing={3}>
              {/* Country Name */}
              <Grid size={12}>
                <formAddress.Field
                  name="country_name"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      label={t('country_name')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="small"
                      required
                    />
                  )}
                />
              </Grid>

              {/* Country Code */}
              <Grid size={12}>
                <formAddress.Field
                  name="country_code"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      label={t('country_code')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="small"
                      required
                    />
                  )}
                />
              </Grid>

              {/* Address Line 1 */}
              <Grid size={12}>
                <formAddress.Field
                  name="address_line_1"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      label={t('address_line_1')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="small"
                      required
                    />
                  )}
                />
              </Grid>

              {/* Address Line 2 */}
              <Grid size={12}>
                <formAddress.Field
                  name="address_line_2"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      label={t('address_line_2')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="small"
                    />
                  )}
                />
              </Grid>

              {/* City */}
              <Grid size={12}>
                <formAddress.Field
                  name="city"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      label={t('city')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="small"
                      required
                    />
                  )}
                />
              </Grid>

              {/* State/Region */}
              <Grid size={12}>
                <formAddress.Field
                  name="state_region"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      label={t('state_region')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="small"
                    />
                  )}
                />
              </Grid>

              {/* Postal Code */}
              <Grid size={12}>
                <formAddress.Field
                  name="postal_code"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      label={t('postal_code')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="small"
                      required
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
}
