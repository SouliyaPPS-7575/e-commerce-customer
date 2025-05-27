import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, useTheme } from '@mui/material/styles';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  formatCurrency,
  useCurrencyContext,
} from '~/components/CurrencySelector/CurrencyProvider';
import { useDistricts } from '~/hooks/profile/useDistricts';
import { useProvinces } from '~/hooks/profile/useProvinces';
import { useCartPage } from '~/hooks/shop/useAddCart';
import { CreateAddressesForm } from '~/models/checkout';
import { localStorageData } from '~/server/cache';
import { createAdresses } from '~/server/checkout';

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
}));

const ProductImage = styled('img')({
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: 4,
});

const PlaceOrderButton = styled(Button)({
  backgroundColor: '#D4C5A0',
  color: 'white',
  padding: '16px',
  fontSize: '16px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  '&:hover': {
    backgroundColor: '#C4B590',
  },
});

export const Route = createFileRoute('/shop/checkout')({
  component: RouteComponent,
});

function RouteComponent() {
  const theme = useTheme();

  const { mutate: createAdress } = useMutation({
    mutationFn: createAdresses,
    onSuccess: () => {},
  });

  const { enrichedCartItems, selectedItemIds } = useCartPage();

  const orderItems = enrichedCartItems.filter((item) =>
    selectedItemIds.includes(item.id),
  );

  const { displayCurrency, convert } = useCurrencyContext();

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const form = useForm({
    defaultValues: {
      customer_id: localStorageData('customer_id').getLocalStrage(),
      province_id: '',
      district_id: '',
      village: '',
      shipping_name: '',
    } as CreateAddressesForm,
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
      createAdress({ data: value });
    },
  });

  const { provinces } = useProvinces();

  const { districts } = useDistricts(form.getFieldValue('province_id'));

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        py: 5,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 2, fontWeight: 400, color: '#666' }}
        >
          Check-out Details
        </Typography>
        <Grid container spacing={4}>
          {/* Left Column - Billing & Shipping Form */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 400 }}>
                  Billing & Shipping
                </Typography>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <Stack spacing={3}>
                    {/* Province ID */}
                    <form.Field
                      name="province_id"
                      children={(field) => (
                        <Autocomplete
                          fullWidth
                          options={provinces}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          value={
                            provinces.find((province) => province.id === field.state.value) || null
                          }
                          onChange={(_, newValue) =>
                            field.handleChange(newValue ? newValue.id : '')
                          }
                          renderInput={(params) => (
                            <TextField {...params} label="Province" size="small" />
                          )}
                        />
                      )}
                    />

                    {/* District ID */}
                    <form.Field
                      name="district_id"
                      children={(field) => (
                        <Autocomplete
                          fullWidth
                          options={districts}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          value={
                            districts.find((district) => district.id === field.state.value) || null
                          }
                          onChange={(_, newValue) =>
                            field.handleChange(newValue ? newValue.id : '')
                          }
                          renderInput={(params) => (
                            <TextField {...params} label="District" size="small" />
                          )}
                        />
                      )}
                    />

                    {/* Village */}
                    <form.Field
                      name="village"
                      children={(field) => (
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
                    <form.Field
                      name="shipping_name"
                      children={(field) => (
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
                    {/* <form.Field
                      name="additionalInfo"
                      children={(field) => (
                        <TextField
                          fullWidth
                          label="Additional Information"
                          variant="outlined"
                          multiline
                          rows={6}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          size="small"
                        />
                      )}
                    /> */}
                  </Stack>
                </form>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 400 }}>
                  Your order
                </Typography>

                {/* Product Header */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Product
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Order Items */}
                <Stack spacing={2} sx={{ mb: 3 }}>
                  {orderItems.map((item) => (
                    <Box
                      key={item.id}
                      sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                    >
                      <ProductImage src={item.image_url} alt={item.name} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          x {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(convert(item.price)) || 0}{' '}
                        {displayCurrency}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {/* Order Summary */}
                <Stack spacing={1} sx={{ mb: 3 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatCurrency(convert(subtotal)) || 0} {displayCurrency}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2">Shipping fee</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {shippingFee}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body1" fontWeight={500}>
                      Total
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatCurrency(convert(total)) || 0} {displayCurrency}
                    </Typography>
                  </Box>
                </Stack>

                {/* Bank Transfer Instructions */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
                    Bank Transfer Instruction
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s
                  </Typography>
                </Box>

                {/* Place Order Button */}
                <PlaceOrderButton
                  fullWidth
                  variant="contained"
                  size="medium"
                  onClick={() => form.handleSubmit()}
                >
                  Place Order
                </PlaceOrderButton>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
