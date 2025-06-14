import { Box, Typography } from '@mui/material';
import { ProductImage } from '~/styles/checkout';

interface OrderItemRowProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
  };
  displayCurrency: string;
  formatCurrency: (amount: number) => string;
  convert: (amount: number) => number;
}

export function OrderItemRow({
  item,
  displayCurrency,
  formatCurrency,
  convert,
}: OrderItemRowProps) {
  return (
    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <ProductImage src={item.image_url} alt={item.name} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2">{item.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          x {item.quantity}
        </Typography>
      </Box>
      <Typography variant="body2" fontWeight={500}>
        {formatCurrency(convert(item.price * item.quantity)) || 0} {displayCurrency}
      </Typography>
    </Box>
  );
}
