import { Box, CardContent, Divider, Stack, Typography } from '@mui/material';
import { StyledCard, PlaceOrderButton } from '~/styles/checkout';
import { OrderItemRow } from './order-item-row';
import { useTranslation } from 'react-i18next';

interface OrderSummarySectionProps {
  orderItems: any[];
  subtotal: number;
  shippingFee: number;
  total: number;
  displayCurrency: string;
  formatCurrency: (amount: number) => string;
  convert: (amount: number) => number;
  isSubmitting: boolean;
  onPlaceOrder: () => void;
  formAddress: any;
  formCheckout: any;
}

export function OrderSummarySection({
  orderItems,
  subtotal,
  shippingFee,
  total,
  displayCurrency,
  formatCurrency,
  convert,
  isSubmitting,
  onPlaceOrder,
  formAddress,
  formCheckout,
}: OrderSummarySectionProps) {
  const { t } = useTranslation();

  return (
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
            <OrderItemRow
              key={item.id}
              item={item}
              displayCurrency={displayCurrency}
              formatCurrency={formatCurrency}
              convert={convert}
            />
          ))}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Order Summary */}
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">{t('subtotal')}</Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatCurrency(convert(subtotal)) || 0} {displayCurrency}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Shipping fee</Typography>
            <Typography variant="body2" fontWeight={500}>
              {shippingFee}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1" fontWeight={500}>
              {t('total')}
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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </Typography>
        </Box>

        {/* Place Order Button */}
        <PlaceOrderButton
          fullWidth
          variant="contained"
          size="medium"
          onClick={onPlaceOrder}
          disabled={isSubmitting || !formAddress || !formCheckout}
        >
          {isSubmitting ? `${t('processing')}...` : `${t('place_order')}`}
        </PlaceOrderButton>
      </CardContent>
    </StyledCard>
  );
}
