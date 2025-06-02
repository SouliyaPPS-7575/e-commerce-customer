import type React from 'react';

import {
     Autocomplete,
     Button,
     Grid,
     TextField,
     Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAddress } from '~/hooks/profile/useAddress';

interface AddressFormProps {
  isEditing: boolean;
  onEditToggle: () => void;
}

export function AddressForm({ isEditing, onEditToggle }: AddressFormProps) {
  const { t } = useTranslation();
  const { formAddress, provinces, districts } = useAddress();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      formAddress.handleSubmit();
    } else {
      onEditToggle();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t('shipping_address')}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t('shipping_info')}
      </Typography>

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
                disabled={!formAddress.state.values.province_id || !isEditing}
                options={districts}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
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
  );
}
