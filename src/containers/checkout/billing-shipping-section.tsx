import { CardContent, Stack, TextField, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { StyledCard } from '~/styles/checkout';

interface BillingShippingSectionProps {
  formAddress: any;
  formCheckout: any;
  provinces: any[];
  districts: any[];
}

export function BillingShippingSection({
  formAddress,
  formCheckout,
  provinces,
  districts,
}: BillingShippingSectionProps) {
  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 400 }}>
          Billing & Shipping
        </Typography>

        <Stack spacing={3}>
          {/* Province ID */}
          <formAddress.Field
            name="province_id"
            children={(field: any) => (
              <Autocomplete
                fullWidth
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
                  // Clear district when province changes
                  formAddress.setFieldValue('district_id', '');
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Province" size="small" />
                )}
              />
            )}
          />

          {/* District ID */}
          <formAddress.Field
            name="district_id"
            children={(field: any) => (
              <Autocomplete
                fullWidth
                disabled={!formAddress.state.values.province_id}
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
                    size="small"
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
            children={(field: any) => (
              <TextField
                fullWidth
                label="Village"
                variant="outlined"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                size="small"
              />
            )}
          />

          {/* Shipping Name */}
          <formAddress.Field
            name="shipping_name"
            children={(field: any) => (
              <TextField
                fullWidth
                label="Shipping Name"
                variant="outlined"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                size="small"
              />
            )}
          />

          {/* Additional Information */}
          <formCheckout.Field
            name="remark"
            children={(field: any) => (
              <TextField
                fullWidth
                label="Additional Information"
                variant="outlined"
                multiline
                rows={3}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                size="small"
              />
            )}
          />
        </Stack>
      </CardContent>
    </StyledCard>
  );
}
