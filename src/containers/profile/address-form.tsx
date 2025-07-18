import type React from 'react';

import PublicIcon from '@mui/icons-material/Public';
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { HomeIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddress } from '~/hooks/profile/useAddress';

interface AddressFormProps {
  isEditing: boolean;
  onEditToggle: () => void;
}

export function AddressForm({ isEditing, onEditToggle }: AddressFormProps) {
  const { t } = useTranslation();
  const { formAddress, provinces, districts } = useAddress();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      formAddress.handleSubmit();
    } else {
      onEditToggle();
    }
  };

  const { tab } = useSearch<any>({
    from: '/profiles',
  });

  // Obtain search parameters from the router
  const params = useParams({ from: '/profiles' }) as any;
  const { section } = useSearch<any>({ from: '/profiles' });

  const [tabValue, setTabValue] = useState(tab);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    navigate({
      to: '/profiles',
      params,
      search: {
        section,
        tab: newValue,
      },
      resetScroll: false,
      hashScrollIntoView: false,
    });
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 3,
          mt: -2,
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

      <form onSubmit={handleSubmit}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t('shipping_address')}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {t('shipping_info')}
        </Typography>

        {tabValue === 0 && (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* Province ID */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <formAddress.Field
                name="province_id"
                children={(field) => (
                  <Autocomplete
                    sx={{ mt: 1, zIndex: 1 }}
                    size="medium"
                    fullWidth
                    disabled={!isEditing}
                    options={provinces}
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        disabled={!isEditing}
                        label="Province"
                        size="medium"
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* District ID */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <formAddress.Field
                name="district_id"
                children={(field) => (
                  <Autocomplete
                    sx={{ mt: 1, zIndex: 1 }}
                    size="medium"
                    fullWidth
                    disabled={
                      !formAddress.state.values.province_id || !isEditing
                    }
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
                    onChange={(_, newValue) =>
                      field.handleChange(newValue ? newValue.id : '')
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="District"
                        size="medium"
                        disabled={!isEditing}
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <formAddress.Field
                name="village"
                children={(field) => (
                  <TextField
                    fullWidth
                    label="Village"
                    variant="outlined"
                    disabled={!isEditing}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    size="medium"
                    margin="dense"
                  />
                )}
              />
            </Grid>

            {/* Shipping Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <formAddress.Field
                name="shipping_name"
                children={(field) => (
                  <TextField
                    fullWidth
                    label="Shipping Name"
                    variant="outlined"
                    disabled={!isEditing}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    size="medium"
                    margin="dense"
                  />
                )}
              />
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Country Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <formAddress.Field
                  name="country_name"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      disabled={!isEditing}
                      label={t('country_name')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="medium"
                      margin="dense"
                      required
                    />
                  )}
                />
              </Grid>

              {/* Country Code */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <formAddress.Field
                  name="country_code"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      disabled={!isEditing}
                      label={t('country_code')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="medium"
                      margin="dense"
                      required
                    />
                  )}
                />
              </Grid>

              {/* Address Line 1 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <formAddress.Field
                  name="address_line_1"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      disabled={!isEditing}
                      label={t('address_line_1')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="medium"
                      margin="dense"
                      required
                    />
                  )}
                />
              </Grid>

              {/* Address Line 2 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <formAddress.Field
                  name="address_line_2"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      disabled={!isEditing}
                      label={t('address_line_2')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="medium"
                      margin="dense"
                    />
                  )}
                />
              </Grid>

              {/* City */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <formAddress.Field
                  name="city"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      disabled={!isEditing}
                      label={t('city')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="medium"
                      margin="dense"
                      required
                    />
                  )}
                />
              </Grid>

              {/* State Region */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <formAddress.Field
                  name="state_region"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      disabled={!isEditing}
                      label={t('state_region')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="medium"
                      margin="dense"
                    />
                  )}
                />
              </Grid>

              {/* Postal Code */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <formAddress.Field
                  name="postal_code"
                  children={(field: any) => (
                    <TextField
                      fullWidth
                      disabled={!isEditing}
                      label={t('postal_code')}
                      variant="outlined"
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      size="medium"
                      margin="dense"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            color: 'white',
            px: 3,
            py: 1,
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '16px',
            '&:hover': {
              bgcolor: '#c4b590',
            },
          }}
        >
          {isEditing ? 'Save Address' : 'Edit Address'}
        </Button>
      </form>
    </>
  );
}
