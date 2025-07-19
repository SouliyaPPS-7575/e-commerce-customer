import CheckIcon from '@mui/icons-material/Check';
import ContentCopy from '@mui/icons-material/ContentCopy';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link, useRouter, useSearch } from '@tanstack/react-router';
import { format } from 'date-fns'; // Add this if not already imported
import {
  Calendar,
  Check,
  ChevronDown,
  Copy,
  CreditCard,
  MapPin,
  Package,
  User,
} from 'lucide-react';
import React, { RefObject, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrencyContext } from '~/components/CurrencySelector/CurrencyProvider';
import { CustomPagination } from '~/components/CustomPagination';
import { useOrderHistory } from '~/hooks/profile/useOrderHistory';
import type { SearchParamsAPI } from '~/models';
import { ProductImage } from '~/styles/checkout';
import theme from '~/styles/theme';
import { formatCurrency, formatDateDMY } from '~/utils/format';

interface OrderHistoryProps {
  orderRef: RefObject<HTMLDivElement | null>;
  searchParams: SearchParamsAPI;
  onPageChange: (page: number) => void;
}

export function OrderHistory({
  orderRef,
  searchParams,
  onPageChange,
}: OrderHistoryProps) {
  const { t } = useTranslation();
  // Router for navigation
  const router = useRouter();

  const [status, setStatus] = useState('');

  // Obtain search parameters from the router
  const { section, order_id, page, limit } = useSearch<any>({
    from: '/profiles',
  });

  const { currency, displayCurrency, convert } = useCurrencyContext();

  const { orderHistory, orderItems, isLoading } = useOrderHistory(
    {
      ...searchParams,
      status,
    },
    order_id || '',
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'purchased':
        return {
          color: theme.palette.info.main,
          backgroundColor: theme.palette.info.light + '20', // Adding transparency
        };
      case 'pending':
        return {
          color: theme.palette.warning.main,
          backgroundColor: theme.palette.warning.light + '20',
        };
      case 'cancel':
        return {
          color: theme.palette.error.main,
          backgroundColor: theme.palette.error.light + '20',
        };
      case 'delivering':
        return {
          color: '#800080',
          backgroundColor: '#80008020',
        };
      case 'completed':
        return {
          color: theme.palette.success.main,
          backgroundColor: theme.palette.success.light + '20',
        };
      default:
        return {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.grey[100],
        };
    }
  };

  // Calculate total pages from response
  const totalPages =
    orderHistory?.totalPages ||
    Math.ceil((orderHistory?.totalItems || 0) / limit) ||
    1;

  return (
    <Box sx={{ p: 0, mt: 1 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t('order_history')}
      </Typography>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
        justifyContent="flex-end"
        mb={2}
      >
        <Box sx={{ minWidth: { xs: '100%', sm: '160px' } }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {t('filter_by_status')}
          </Typography>
          <Select
            displayEmpty
            onChange={(e) => {
              router.navigate({
                to: '/profiles',
                resetScroll: false,
                hashScrollIntoView: false,
                search: {
                  order_id: order_id || '',
                  section,
                  page: section === 'orders' ? page || 1 : undefined,
                  limit: section === 'orders' ? limit || 25 : undefined,
                  status: e.target.value,
                },
              });
              setStatus(e.target.value);
              setExpandedRow(null);
            }}
            sx={{
              padding: '6px 12px',
              borderRadius: '4px',
              minWidth: { xs: '100%', sm: '160px' },
              height: '40px',
              backgroundColor: 'background.paper',
            }}
            defaultValue=""
          >
            <MenuItem value="">
              <Typography>{t('all')}</Typography>
            </MenuItem>
            <MenuItem value="purchased">
              <Typography sx={{ color: 'info.main', fontWeight: 'bold' }}>
                {t('purchased')}
              </Typography>
            </MenuItem>
            <MenuItem value="pending">
              <Typography sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                {t('pending')}
              </Typography>
            </MenuItem>
            <MenuItem value="cancel">
              <Typography sx={{ color: 'error.main', fontWeight: 'bold' }}>
                {t('cancel')}
              </Typography>
            </MenuItem>
            <MenuItem value="delivering">
              <Typography sx={{ color: '#800080', fontWeight: 'bold' }}>
                {t('delivering')}
              </Typography>
            </MenuItem>
            <MenuItem value="completed">
              <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>
                {t('completed')}
              </Typography>
            </MenuItem>
            <MenuItem value="delivering">
              <Typography sx={{ color: 'info.main', fontWeight: 'bold' }}>
                {t('delivering')}
              </Typography>
            </MenuItem>
            <MenuItem value="completed">
              <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>
                {t('completed')}
              </Typography>
            </MenuItem>
          </Select>
        </Box>
        <Box sx={{ minWidth: { xs: '100%', sm: '200px' } }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {t('filter_by_date')}
          </Typography>
          <DatePicker
            open={openDatePicker}
            onClose={() => setOpenDatePicker(false)}
            onOpen={() => setOpenDatePicker(true)}
            onChange={(newValue) => {
              if (newValue) {
                // Format to 'YYYY-MM-DD'
                const formattedDate = format(
                  new Date(newValue.toString()),
                  'yyyy-MM-dd',
                );

                router.navigate({
                  to: '/profiles',
                  resetScroll: false,
                  hashScrollIntoView: false,
                  search: {
                    order_id: order_id || '',
                    section,
                    page: section === 'orders' ? page || 1 : undefined,
                    limit: section === 'orders' ? limit || 10 : undefined,
                    createdAt: formattedDate, // Only the date
                  },
                });

                setOpenDatePicker(false);
              }
            }}
            slotProps={{
              textField: {
                size: 'small',
                sx: {
                  height: '40px',
                  backgroundColor: 'transparent',
                  width: '100%',
                },
              },
            }}
          />
        </Box>
      </Box>
      {/* Main Order History Table */}
      {!isMobile && (
        <TableContainer
          component={Paper}
          sx={{
            mb: 2,
            borderRadius: 2,
            maxHeight: '70vh',
            overflow: 'auto',
            '& .MuiTable-root': {
              minWidth: { xs: '800px', md: 'auto' },
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
              backgroundColor: '#f9fafb', // ← Change this to your desired color
              fontWeight: 'bold',
            },
            '&::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#F9FAFB',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#ccc',
              borderRadius: 4,
              '&:hover': {
                backgroundColor: '#999',
              },
            },
            '&:last-child': {
              border: 0,
            },
            transition: 'background-color 0.2s ease',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ width: '50px', position: 'sticky', zIndex: 1000 }}
                />
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    minWidth: { xs: '130px', md: '150px' },
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    position: 'sticky',
                    zIndex: 1000,
                  }}
                >
                  {t('reference_id')}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    minWidth: { xs: '100px', md: '120px' },
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    position: 'sticky',
                    zIndex: 1000,
                  }}
                >
                  {t('date')}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    minWidth: { xs: '80px', md: '100px' },
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    position: 'sticky',
                    zIndex: 1000,
                  }}
                >
                  {t('status')}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    minWidth: { xs: '150px', md: '200px' },
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    position: 'sticky',
                    zIndex: 1000,
                  }}
                >
                  {t('address')}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    minWidth: { xs: '60px', md: '80px' },
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    position: 'sticky',
                    zIndex: 1000,
                  }}
                >
                  {t('quantity')}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    minWidth: { xs: '100px', md: '120px' },
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    position: 'sticky',
                    zIndex: 1000,
                  }}
                >
                  {t('total')}
                </TableCell>
              </TableRow>
            </TableHead>

            {/*  Table Body */}

            <TableBody>
              {orderHistory && orderHistory?.items?.length > 0 ? (
                orderHistory?.items?.map((order) => (
                  <React.Fragment key={order.id}>
                    <TableRow
                      sx={{
                        '&:last-child td, &:last-child th': {
                          border: 0,
                        },
                        backgroundColor:
                          expandedRow === order.id ? 'action.hover' : 'inherit',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setExpandedRow(
                              expandedRow === order.id ? null : order.id,
                            );
                            router.navigate({
                              to: '/profiles',
                              resetScroll: false,
                              hashScrollIntoView: false,
                              search: {
                                order_id: order.id,
                                section,
                                page:
                                  section === 'orders' ? page || 1 : undefined,
                                limit:
                                  section === 'orders'
                                    ? limit || 10
                                    : undefined,
                                status,
                              },
                            });
                          }}
                          sx={{
                            transform:
                              expandedRow === order.id
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                          }}
                        >
                          <KeyboardArrowDown />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ py: 2, color: 'text.primary' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            gap: 0.25,
                            flexWrap: 'nowrap',
                            minWidth: 0,
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              order?.referenceID || '',
                            );
                            setCopiedId(order?.referenceID || null);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: '0.75rem', md: '0.875rem' },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: '1 1 auto',
                              minWidth: 0,
                            }}
                          >
                            {order?.referenceID}
                            &nbsp;&nbsp;
                            <Tooltip
                              title={
                                copiedId === order?.referenceID
                                  ? 'Copied!'
                                  : 'Copy to clipboard'
                              }
                            >
                              <IconButton
                                size="small"
                                sx={{
                                  flexShrink: 0,
                                  padding: '2px',
                                }}
                              >
                                {copiedId === order?.referenceID ? (
                                  <CheckIcon fontSize="small" color="success" />
                                ) : (
                                  <ContentCopy fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2, color: 'text.secondary' }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 'bold',
                            color: 'text.secondary',
                            textTransform: 'capitalize',
                            textAlign: 'left',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {order?.created && formatDateDMY(order.created)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 'bold',
                            color:
                              order?.status === 'purchased'
                                ? 'info.main'
                                : order?.status === 'pending'
                                  ? 'warning.main'
                                  : order?.status === 'cancel'
                                    ? 'error.main'
                                    : order?.status === 'delivering'
                                      ? '#800080'
                                      : order?.status === 'completed'
                                        ? 'success.main'
                                        : 'text.primary',
                            textTransform: 'capitalize',
                            textAlign: 'left',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {t(`${order?.status}`)}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 'bold', color: 'text.primary' }}
                      >
                        <Box>
                          {(order?.address || t('no_address_found'))
                            .split(',')
                            .slice(0, 2)
                            .map((line, index) => (
                              <Typography
                                key={index}
                                variant="body2"
                                sx={{
                                  color: 'text.secondary',
                                  textTransform: 'capitalize',
                                  textAlign: 'left',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: { xs: '120px', md: '200px' },
                                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                                }}
                              >
                                {line.trim()}
                              </Typography>
                            ))}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 'bold', color: 'text.primary' }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'bold',
                          }}
                        >
                          {order?.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2, color: 'text.primary' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'bold',
                          }}
                        >
                          {currency === 'USD' &&
                            order?.amountUSD &&
                            `${formatCurrency(Number(order?.amountUSD))} $`}
                          {currency === 'THB' &&
                            order?.amountTHB &&
                            `${formatCurrency(Number(order?.amountTHB))} ฿`}
                          {currency === 'LAK' &&
                            order?.amountLAK &&
                            `${formatCurrency(Number(order?.amountLAK))} ₭`}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* Collapsed Detail Row */}

                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{
                          py: 0,
                          overflow: 'hidden',
                          height: 'auto',
                          '&:last-child': {
                            border: 0,
                          },
                          transition: 'background-color 0.2s ease',
                          '&:hover': {
                            cursor: 'pointer',
                          },
                        }}
                      >
                        <Collapse
                          in={expandedRow === order.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box
                            sx={{
                              p: { xs: 2, md: 3 },
                              bgcolor: 'background.paper',
                            }}
                          >
                            {/* Product Table */}
                            <TableContainer
                              component={Paper}
                              sx={{
                                borderRadius: 2,
                                boxShadow: 1,
                                maxHeight: 400, // Increased height
                                overflow: 'auto', // Enable scrolling
                                mb: 3,
                                '&::-webkit-scrollbar': {
                                  width: 6,
                                  height: 6,
                                },
                                '&::-webkit-scrollbar-track': {
                                  backgroundColor: '#f5f5f5',
                                  borderRadius: 4,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                  backgroundColor: '#ccc',
                                  borderRadius: 4,
                                  '&:hover': {
                                    backgroundColor: '#999',
                                  },
                                },
                              }}
                            >
                              <Table stickyHeader size="small">
                                <TableHead>
                                  <TableRow>
                                    {[
                                      {
                                        label: t('image'),
                                        align: 'left',
                                        minWidth: 80,
                                      },
                                      {
                                        label: t('products'),
                                        align: 'left',
                                        minWidth: 180,
                                      },
                                      {
                                        label: t('date'),
                                        align: 'left',
                                        minWidth: 120,
                                      },
                                      {
                                        label: t('quantity'),
                                        align: 'center',
                                        minWidth: 80,
                                      },
                                      {
                                        label: t('price'),
                                        align: 'right',
                                        minWidth: 100,
                                      },
                                      {
                                        label: t('total'),
                                        align: 'right',
                                        minWidth: 120,
                                      },
                                    ].map((col, i) => (
                                      <TableCell
                                        key={i}
                                        align={'center'}
                                        sx={{
                                          fontWeight: 600,
                                          fontSize: {
                                            xs: '0.75rem',
                                            md: '0.875rem',
                                          },
                                          backgroundColor: 'grey.100',
                                          minWidth: col.minWidth,
                                          position: 'sticky',
                                          top: 0,
                                          zIndex: 100,
                                        }}
                                      >
                                        {col.label}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {isLoading ? (
                                    <>
                                      <div className="flex items-center justify-center ml-80 p-4">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-yellow-700"></div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      {orderItems?.products?.map((product) => (
                                        <TableRow
                                          key={product.id}
                                          hover
                                          sx={{
                                            '&:nth-of-type(odd)': {
                                              backgroundColor: 'grey.50',
                                            },
                                          }}
                                        >
                                          <TableCell>
                                            <Link
                                              to="/shop/view/$productID/$categoryID"
                                              params={{
                                                productID: product.id ?? '',
                                                categoryID:
                                                  product.category_id ?? '',
                                              }}
                                              style={{ textDecoration: 'none' }}
                                            >
                                              <ProductImage
                                                src={product?.image_url?.[0]}
                                                alt={product?.name}
                                                style={{
                                                  width: 48,
                                                  height: 48,
                                                  objectFit: 'cover',
                                                  borderRadius: 6,
                                                }}
                                              />
                                            </Link>
                                          </TableCell>
                                          <TableCell>
                                            <Typography
                                              variant="body2"
                                              noWrap
                                              sx={{
                                                fontWeight: 500,
                                                maxWidth: 180,
                                                color: 'text.primary',
                                              }}
                                            >
                                              {product?.name || 'N/A'}
                                            </Typography>
                                          </TableCell>
                                          <TableCell>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                              noWrap
                                            >
                                              {product?.created &&
                                                formatDateDMY(product?.created)}
                                            </Typography>
                                          </TableCell>
                                          <TableCell align="center">
                                            <Typography variant="body2">
                                              {product?.quantity || 0}
                                            </Typography>
                                          </TableCell>
                                          <TableCell align="right">
                                            <Typography variant="body2">
                                              {currency === 'USD'
                                                ? formatCurrency(
                                                    orderItems?.orderItems?.find(
                                                      (item) =>
                                                        item.product_id ===
                                                        product.id,
                                                    )?.price_usd || 0,
                                                  )
                                                : currency === 'THB'
                                                  ? formatCurrency(
                                                      orderItems?.orderItems?.find(
                                                        (item) =>
                                                          item.product_id ===
                                                          product.id,
                                                      )?.price_thb || 0,
                                                    )
                                                  : formatCurrency(
                                                      convert(
                                                        orderItems?.orderItems?.find(
                                                          (item) =>
                                                            item.product_id ===
                                                            product.id,
                                                        )?.price_lak || 0,
                                                      ),
                                                    )}{' '}
                                              {displayCurrency}
                                            </Typography>
                                          </TableCell>
                                          <TableCell align="right">
                                            <Typography
                                              variant="body2"
                                              color="primary"
                                              fontWeight="bold"
                                            >
                                              {formatCurrency(
                                                (currency === 'USD'
                                                  ? (orderItems?.orderItems?.find(
                                                      (item) =>
                                                        item.product_id ===
                                                        product.id,
                                                    )?.price_usd || 0) *
                                                    (product?.quantity || 0)
                                                  : currency === 'THB'
                                                    ? (orderItems?.orderItems?.find(
                                                        (item) =>
                                                          item.product_id ===
                                                          product.id,
                                                      )?.price_thb || 0) *
                                                      (product?.quantity || 0)
                                                    : convert(
                                                        (orderItems?.orderItems?.find(
                                                          (item) =>
                                                            item.product_id ===
                                                            product.id,
                                                        )?.price_lak || 0) *
                                                          (product?.quantity ||
                                                            0),
                                                      )) || 0,
                                              )}
                                              {displayCurrency}
                                            </Typography>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </>
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>

                            {/* Order Summary */}
                            <Paper
                              elevation={1}
                              sx={{
                                borderRadius: 2,
                                p: { xs: 2, sm: 3 },
                                backgroundColor: 'grey.100',
                              }}
                            >
                              <Typography variant="h6" sx={{ mb: 2 }}>
                                {t('order_summary')}
                              </Typography>
                              <Grid container spacing={3}>
                                <Grid
                                  size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 4,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {t('shipping_name')}:
                                  </Typography>
                                  <Typography variant="body1" fontWeight={600}>
                                    {(() => {
                                      if (
                                        order?.address?.split(',').length >= 2
                                      )
                                        return order.address
                                          .split(',')
                                          .slice(-2)
                                          .join(', ');
                                      if (order?.customerName)
                                        return order?.customerName;
                                      return t('no_name_found');
                                    })()}
                                  </Typography>
                                </Grid>

                                <Grid
                                  size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 5,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {t('shipping_address')}:
                                  </Typography>
                                  <Typography variant="body1" fontWeight={600}>
                                    {(() => {
                                      if (!order?.address)
                                        return t('no_address_found');
                                      const parts = order.address
                                        .split(',')
                                        .map((p) => p.trim());
                                      if (parts.length > 2)
                                        return parts.slice(0, -2).join(', ');
                                      return order.address;
                                    })()}
                                  </Typography>
                                </Grid>

                                <Grid
                                  size={{
                                    xs: 12,
                                    sm: 12,
                                    md: 3,
                                  }}
                                >
                                  <Box textAlign={{ xs: 'left', sm: 'right' }}>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {t('total')}:
                                    </Typography>
                                    <Typography
                                      variant="h6"
                                      color="primary"
                                      fontWeight="bold"
                                    >
                                      {currency === 'USD' &&
                                        order?.amountUSD &&
                                        `${formatCurrency(Number(order?.amountUSD))} $`}
                                      {currency === 'THB' &&
                                        order?.amountTHB &&
                                        `${formatCurrency(Number(order?.amountTHB))} ฿`}
                                      {currency === 'LAK' &&
                                        order?.amountLAK &&
                                        `${formatCurrency(Number(order?.amountLAK))} ₭`}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Paper>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {isLoading ? (
                        <>
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-yellow-700"></div>
                          </div>
                        </>
                      ) : (
                        t('no_orders_found')
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mobile Card View - Minimal Design */}
      {isMobile && (
        <Box
          ref={orderRef}
          sx={{
            mb: 2,
            borderRadius: 2,
            maxHeight: '70vh',
            overflow: 'auto',
            '& .MuiTable-root': {
              minWidth: { xs: '800px', md: 'auto' },
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
              backgroundColor: '#f9fafb', // ← Change this to your desired color
              fontWeight: 'bold',
            },
            '&::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#F9FAFB',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#ccc',
              borderRadius: 4,
              '&:hover': {
                backgroundColor: '#999',
              },
            },
            '&:last-child': {
              border: 0,
            },
            transition: 'background-color 0.2s ease',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
        >
          {orderHistory?.items?.map((order) => (
            <Card
              key={order.id}
              sx={{
                mb: 1.5,
                borderRadius: 2,
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
                border: '1px solid',
                borderColor: 'grey.100',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 1.5 }}>
                {/* Compact Header */}
                <Box
                  ref={orderRef}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      flex: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '0.875rem',
                        maxWidth: '120px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(order?.referenceID || '');
                        setCopiedId(order?.referenceID || null);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                    >
                      {order?.referenceID}
                    </Typography>
                    <Tooltip
                      title={
                        copiedId === order?.referenceID
                          ? 'Copied!'
                          : 'Copy to clipboard'
                      }
                    >
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            order?.referenceID || '',
                          );
                          setCopiedId(order?.referenceID || null);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        sx={{
                          p: 0.25,
                          minWidth: 'auto',
                          '&:hover': { backgroundColor: 'grey.50' },
                        }}
                      >
                        {copiedId === order?.referenceID ? (
                          <Check size={14} color="#10B981" />
                        ) : (
                          <Copy size={14} color="#9CA3AF" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={t(order?.status)}
                      size="small"
                      sx={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        height: 20,
                        textTransform: 'capitalize',
                        ...(getStatusColor(order?.status) && {
                          color: getStatusColor(order?.status).color,
                          backgroundColor:
                            getStatusColor(order.status)?.backgroundColor || '',
                        }),
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        setExpandedRow(
                          expandedRow === order.id ? null : order.id,
                        );
                        router.navigate({
                          to: '/profiles',
                          resetScroll: false,
                          hashScrollIntoView: false,
                          search: {
                            order_id: order.id,
                            section,
                            page: section === 'orders' ? page || 1 : undefined,
                            limit:
                              section === 'orders' ? limit || 10 : undefined,
                            status,
                          },
                        });

                        router.invalidate();
                      }}
                      sx={{
                        p: 0.5,
                        minWidth: 'auto',
                        '&:hover': { backgroundColor: 'grey.50' },
                        transition: 'all 0.2s',
                        transform:
                          expandedRow === order.id
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                      }}
                    >
                      <ChevronDown size={16} color="#6B7280" />
                    </IconButton>
                  </Box>
                </Box>

                {/* Compact Info Grid */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                  <Grid size={6}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Calendar size={11} color="#9CA3AF" />
                      <Typography
                        variant="caption"
                        sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}
                      >
                        {formatDateDMY(order?.created)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          mb: 0.25,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Package size={11} color="#9CA3AF" />
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.6875rem',
                            color: 'text.secondary',
                          }}
                        >
                          {t('qty')}: {order?.quantity}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Price and Address Row */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mb: 0.25,
                      }}
                    >
                      <MapPin size={11} color="#9CA3AF" />
                      <Typography
                        variant="caption"
                        sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}
                      >
                        {t('shipping_address')}:
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.75rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        ml: 1.5,
                      }}
                    >
                      {(() => {
                        if (!order?.address) return t('no_address_found');
                        const addressParts = order.address
                          .split(',')
                          .map((part) => part.trim());
                        if (addressParts.length > 2) {
                          return addressParts.slice(0, -2).join(', ');
                        } else if (addressParts.length <= 2) {
                          return order.address;
                        }
                        return order.address;
                      })()}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.75rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        ml: 1.5,
                      }}
                    >
                      {(() => {
                        if (order?.address?.split(',').length >= 2)
                          return order.address.split(',').slice(-2).join(', ');
                        if (order?.customerName) return order.customerName;
                        if (order?.address) {
                          const addressParts = order.address
                            .split(',')
                            .map((part) => part.trim());
                          if (addressParts.length >= 2) {
                            return addressParts.slice(-2).join(', ');
                          }
                        }
                        return t('no_name_found');
                      })()}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mb: 0.25,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <CreditCard size={11} color="#9CA3AF" />
                      <Typography
                        variant="caption"
                        sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}
                      >
                        {t('total')}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 800,
                        color: 'primary.main',
                        fontSize: '0.875rem',
                      }}
                    >
                      {currency === 'USD' &&
                        order?.amountUSD &&
                        `$${formatCurrency(Number(order?.amountUSD))}`}
                      {currency === 'THB' &&
                        order?.amountTHB &&
                        `${formatCurrency(Number(order?.amountTHB))} ฿`}
                      {currency === 'LAK' &&
                        order?.amountLAK &&
                        `${formatCurrency(Number(order?.amountLAK))} ₭`}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              {/* Expanded Content - Optimized */}
              <Collapse
                in={expandedRow === order.id}
                timeout="auto"
                unmountOnExit
              >
                <Box
                  sx={{
                    borderTop: 1,
                    borderColor: 'grey.100',
                    p: 1.5,
                    backgroundColor: 'grey.25',
                    maxHeight: 300, // Adjust as needed
                    overflowY: 'auto',
                    pr: 1,
                    mb: 2,
                    '&::-webkit-scrollbar': {
                      width: 6,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#cbd5e1',
                      borderRadius: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f5f9',
                      borderRadius: 8,
                    },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 1.5,
                      fontSize: '0.875rem',
                    }}
                  >
                    {t('products')} ({orderItems?.orderItems?.length})
                  </Typography>

                  {/* Scrollable Product List */}
                  <Box
                    sx={{
                      pr: 1,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      {orderItems?.products?.map((product) => (
                        <Card
                          key={product?.id}
                          sx={{
                            p: 1,
                            backgroundColor: '#ffffff',
                            borderRadius: 1.5,
                            boxShadow: 'none',
                            border: '1px solid',
                            borderColor: 'grey.100',
                          }}
                        >
                          {isLoading ? (
                            <>
                              <div className="flex items-center justify-center p-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-yellow-700"></div>
                              </div>
                            </>
                          ) : (
                            <>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Box
                                  component="img"
                                  src={product?.image_url?.[0]}
                                  alt={product?.name}
                                  sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 1.5,
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                  }}
                                />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 500,
                                      color: 'text.primary',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      fontSize: '1rem',
                                    }}
                                  >
                                    {product?.name || 'N/A'}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      mt: 0.25,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ whiteSpace: 'nowrap' }}
                                    >
                                      {product?.created &&
                                        formatDateDMY(product?.created)}
                                    </Typography>
                                    {/* <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ fontSize: '0.6875rem' }}
                                    >
                                      {t('qty')}: {product?.quantity || 0}
                                    </Typography> */}
                                    <Typography
                                      variant="body2"
                                      color="primary"
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: '0.8125rem',
                                      }}
                                    >
                                      {t('totals')}:{' '}
                                      {formatCurrency(
                                        convert(
                                          product?.price * product?.quantity,
                                        ),
                                      )}{' '}
                                      {displayCurrency}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'flex-end',
                                    }}
                                  >
                                    <Typography
                                      color="primary"
                                      sx={{
                                        fontSize: '0.7125rem',
                                      }}
                                    >
                                      {t('price')}: {product?.quantity} x{' '}
                                      {formatCurrency(convert(product?.price))}{' '}
                                      {displayCurrency}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </>
                          )}
                        </Card>
                      ))}
                    </Box>
                  </Box>

                  {/* Compact Order Summary */}
                  <Grid container spacing={2}>
                    {/* Shipping Information */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: '#F5F5F5', // light blue background
                          border: '1px solid',
                          borderColor: 'grey.100',
                        }}
                      >
                        {/* Shipping Name */}
                        <Box sx={{ mb: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <User size={11} color="#9CA3AF" />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: '0.6875rem' }}
                            >
                              {t('shipping_name')}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: 'text.primary',
                              ml: 1.5,
                              fontSize: '0.8125rem',
                            }}
                          >
                            {(() => {
                              if (order?.address?.split(',').length >= 2)
                                return order.address
                                  .split(',')
                                  .slice(-2)
                                  .join(', ');
                              if (order?.customerName)
                                return order.customerName;
                              const addressParts =
                                order?.address?.split(',') || [];
                              return (
                                addressParts.slice(-2).join(', ') ||
                                t('no_name_found')
                              );
                            })()}
                          </Typography>
                        </Box>

                        {/* Shipping Address */}
                        <Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <MapPin size={11} color="#9CA3AF" />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: '0.6875rem' }}
                            >
                              {t('shipping_address')}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              ml: 1.5,
                              fontSize: '0.8125rem',
                            }}
                          >
                            {(() => {
                              if (!order?.address) return t('no_address_found');
                              const addressParts = order?.address
                                .split(',')
                                .map((part) => part.trim());
                              return addressParts.length > 2
                                ? addressParts.slice(0, -2).join(', ')
                                : order?.address;
                            })()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Order Summary */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: '#FFFFFF', // ligt green background
                          border: '1px solid',
                          borderColor: 'grey.100',
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          {t('order_summary')}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            fontWeight={600}
                            variant="caption"
                            color="text.secondary"
                          >
                            {t('total')}:
                          </Typography>
                          <Typography
                            fontWeight={700}
                            color="primary"
                            sx={{ fontSize: '1rem' }}
                          >
                            {currency === 'USD' &&
                              order?.amountUSD &&
                              `${formatCurrency(Number(order?.amountUSD))} $`}
                            {currency === 'THB' &&
                              order?.amountTHB &&
                              `${formatCurrency(Number(order?.amountTHB))} ฿`}
                            {currency === 'LAK' &&
                              order?.amountLAK &&
                              `${formatCurrency(Number(order?.amountLAK))} ₭`}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Card>
          ))}
        </Box>
      )}

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="center" mt={2}>
        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={orderHistory?.totalItems}
          onPageChange={onPageChange}
        />
      </Box>
    </Box>
  );
}
