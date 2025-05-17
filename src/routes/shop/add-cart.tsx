import { ShoppingCartOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  formatCurrency,
  useCurrencyContext,
} from '~/components/CurrencySelector/CurrencyProvider';
import CurrencySelector from '~/components/CurrencySelector/CurrencySelector';
import { getCartItemsQueryOption, useCartPage } from '~/hooks/shop/useAddCart';
import {
  CartItemBox,
  CheckoutButton,
  ContinueShoppingButton,
  QuantityControl,
  StyledDialog,
} from '~/styles/add-cart';

export const Route = createFileRoute('/shop/add-cart')({
  loader: async ({ context }) => {
    const cartItems = context.queryClient.ensureQueryData(
      getCartItemsQueryOption(),
    );
    return { cartItems };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { displayCurrency, convert } = useCurrencyContext();

  const {
    // Data
    enrichedCartItems,

    // Function
    handleQuantityChange,
    handleRemoveItem,
    calculateSubtotal,
  } = useCartPage();

  const onClose = () => {
    history.back();
  };

  return (
    <StyledDialog open={true} onClose={onClose} fullWidth>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <ShoppingCartOutlined sx={{ color: '#c19a7e', fontSize: 32, ml: 1 }} />

        {/* Currency selector */}
        <CurrencySelector isTransparent={false} />

        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ my: 1 }} />

      <DialogContent sx={{ p: 1 }}>
        {enrichedCartItems?.map((item) => (
          <React.Fragment key={item.id}>
            <CartItemBox>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  component="img"
                  src={item.image_url}
                  alt={item.name}
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 1,
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {item.name}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={{ mb: 1 }}
                >
                  {formatCurrency(convert(item.price)) || 0} {displayCurrency}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <QuantityControl>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>

                    <TextField
                      variant="standard"
                      value={item.quantity === 0 ? '' : item.quantity}
                      InputProps={{ disableUnderline: true }}
                      sx={{
                        width: 30,
                        input: { textAlign: 'center' },
                        '& .MuiInputBase-input': { p: 0 },
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numericValue = parseInt(value);
                        if (value === '') {
                          handleQuantityChange(item.id, 0);
                        } else if (!isNaN(numericValue)) {
                          handleQuantityChange(item.id, numericValue);
                        }
                      }}
                    />

                    <IconButton
                      size="small"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </QuantityControl>

                  <IconButton
                    size="small"
                    onClick={() => handleRemoveItem(item.id)}
                    sx={{ color: '#c19a7e' }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
            </CartItemBox>
            <Divider />
          </React.Fragment>
        ))}
      </DialogContent>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 3 }}>
        <Typography variant="h6">{t('subtotal')}</Typography>
        <Typography variant="h6" fontWeight="bold">
          {formatCurrency(convert(calculateSubtotal())) || 0} {displayCurrency}
        </Typography>
      </Box>
      <DialogActions sx={{ flexDirection: 'column', p: 2, pt: 0 }}>
        <CheckoutButton fullWidth variant="contained" onClick={() => {}}>
          {t('checkout')}
        </CheckoutButton>

        <ContinueShoppingButton
          onClick={() => {
            navigate({
              to: '/shop',
            });
          }}
          sx={{ mt: 2 }}
        >
          {t('continue_shopping')}
        </ContinueShoppingButton>
      </DialogActions>
    </StyledDialog>
  );
}
