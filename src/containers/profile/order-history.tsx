import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCurrencyContext } from '~/components/CurrencySelector/CurrencyProvider';
import { CustomPagination } from '~/components/CustomPagination';
import { useOrderHistory } from '~/hooks/profile/useOrderHistory';
import type { PaginationAPI } from '~/models';
import { formatDateDMY } from '~/utils/format';

interface OrderHistoryProps {
  pagination: PaginationAPI;
  onPageChange: (page: number) => void;
}

export function OrderHistory({ pagination, onPageChange }: OrderHistoryProps) {
  const { t } = useTranslation();
  const { currency } = useCurrencyContext();
  const { orderHistory } = useOrderHistory(pagination);

  if (orderHistory?.items?.length === 0) {
    return (
      <Box sx={{ p: 0 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t('order_history')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          {t('no_orders_found')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, mt: 1 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t('order_history')}
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Product
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Price
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orderHistory?.items?.map((order) => (
              <TableRow
                key={order.id}
                sx={{
                  '&:last-child td, &:last-child th': {
                    border: 0,
                  },
                }}
              >
                <TableCell sx={{ py: 2, color: 'text.primary' }}>
                  {order?.product_name}
                </TableCell>
                <TableCell sx={{ py: 2, color: 'text.secondary' }}>
                  {order?.created && formatDateDMY(order.created)}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                  }}
                >
                  <Grid size={{ xs: 6, sm: 6 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                      }}
                    >
                      {currency === 'USD' &&
                        order?.price_usd &&
                        `${order.price_usd} $`}
                      {currency === 'THB' &&
                        order?.price_thb &&
                        `${order.price_thb} ฿`}
                      {currency === 'LAK' &&
                        order?.price_lak &&
                        `${order.price_lak} ₭`}
                    </Typography>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="center" mt={2}>
        <CustomPagination
          currentPage={orderHistory?.page}
          totalPages={orderHistory?.totalPages}
          onPageChange={onPageChange}
        />
      </Box>
    </Box>
  );
}
