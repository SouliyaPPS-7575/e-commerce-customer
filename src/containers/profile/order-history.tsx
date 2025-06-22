import CheckIcon from '@mui/icons-material/Check';
import ContentCopy from '@mui/icons-material/ContentCopy';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Collapse,
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
  Typography
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrencyContext } from '~/components/CurrencySelector/CurrencyProvider';
import { CustomPagination } from '~/components/CustomPagination';
import { useOrderHistory } from '~/hooks/profile/useOrderHistory';
import type { SearchParamsAPI } from '~/models';
import { ProductImage } from '~/styles/checkout';
import { formatCurrency, formatDateDMY } from '~/utils/format';

interface OrderHistoryProps {
  searchParams: SearchParamsAPI;
  onPageChange: (page: number) => void;
}

export function OrderHistory({
  searchParams,
  onPageChange,
}: OrderHistoryProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [status, setStatus] = useState('');

  // Obtain search parameters from the router
  const { section, order_id, page, limit } = useSearch<any>({
    from: '/profiles',
  });

  const { currency, displayCurrency, convert } = useCurrencyContext();

  const { orderHistory, orderItems } = useOrderHistory(
    searchParams,
    order_id || '',
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <Box sx={{ p: 0, mt: 1 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t('order_history')}
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
        >
          <Grid>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {t('filter_by_status')}
            </Typography>
            <Select
              displayEmpty
              onChange={(e) => {
                navigate({
                  to: '/profiles',
                  search: {
                    order_id: order_id || '',
                    section,
                    page: section === 'orders' ? page || 1 : undefined,
                    limit: section === 'orders' ? limit || 10 : undefined,
                    status: e.target.value,
                  },
                });
                setStatus(e.target.value);
                setExpandedRow(null);
              }}
              sx={{
                padding: '6px 12px',
                borderRadius: '4px',
                minWidth: '160px',
                height: '40px',
                backgroundColor: 'background.paper',
              }}
              defaultValue=""
            >
              <MenuItem value="">
                <Typography>{t('all')}</Typography>
              </MenuItem>
              <MenuItem value="purchased">
                <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>
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
            </Select>
          </Grid>
          <Grid>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {t('filter_by_date')}
            </Typography>
            <DateTimePicker
              onChange={(newValue) => {
                if (newValue) {
                  const formattedDate = new Date(
                    newValue.toString(),
                  ).toISOString();
                  navigate({
                    to: '/profiles',
                    search: {
                      order_id: order_id || '',
                      section,
                      page: section === 'orders' ? page || 1 : undefined,
                      limit: section === 'orders' ? limit || 10 : undefined,
                      date: formattedDate,
                    },
                  });
                }
              }}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: {
                    height: '40px',
                    backgroundColor: 'transparent',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
      {/* Main Order History Table */}
      <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '50px' }} />
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  minWidth: '150px',
                }}
              >
                {t('reference_id')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  minWidth: '120px',
                }}
              >
                {t('date')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  minWidth: '100px',
                }}
              >
                {t('status')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  minWidth: '200px',
                }}
              >
                {t('address')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  minWidth: '80px',
                }}
              >
                {t('quantity')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  minWidth: '120px',
                }}
              >
                {t('total')}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orderHistory?.items?.length > 0 ? (
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
                          navigate({
                            to: '/profiles',
                            search: {
                              order_id: order.id,
                              section,
                              page:
                                section === 'orders' ? page || 1 : undefined,
                              limit:
                                section === 'orders' ? limit || 10 : undefined,
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
                        }}
                        onClick={() => {
                          navigator.clipboard.writeText(
                            order?.referenceID || '',
                          );
                          setCopiedId(order?.referenceID || null);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                      >
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {order?.referenceID}
                        </Typography>
                        <Tooltip
                          title={
                            copiedId === order?.referenceID
                              ? 'Copied!'
                              : 'Copy to clipboard'
                          }
                        >
                          <IconButton size="small">
                            {copiedId === order?.referenceID ? (
                              <CheckIcon fontSize="small" color="success" />
                            ) : (
                              <ContentCopy fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
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
                              ? 'success.main'
                              : order?.status === 'pending'
                                ? 'warning.main'
                                : order?.status === 'cancel'
                                  ? 'error.main'
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
                          .slice(0, 2) // Show only first 2 lines to save space
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
                                maxWidth: '200px',
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
                        border: 'none',
                        backgroundColor: 'grey.50',
                      }}
                    >
                      <Collapse
                        in={expandedRow === order.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ p: 2 }}>
                          {/* Product Details Table */}
                          <TableContainer
                            component={Paper}
                            sx={{ mb: 3, borderRadius: 1 }}
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                                  <TableCell
                                    sx={{
                                      minWidth: '100px',
                                    }}
                                  >
                                    {t('image')}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      minWidth: '200px',
                                    }}
                                  >
                                    {t('products')}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      minWidth: '120px',
                                    }}
                                  >
                                    {t('date')}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      minWidth: '80px',
                                      textAlign: 'center',
                                    }}
                                  >
                                    {t('quantity')}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      minWidth: '100px',
                                      textAlign: 'right',
                                    }}
                                  >
                                    {t('price')}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      minWidth: '120px',
                                      textAlign: 'right',
                                    }}
                                  >
                                    {t('total')}
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {orderItems?.products?.map((product) => (
                                  <TableRow
                                    key={product.id}
                                    sx={{
                                      '&:hover': {
                                        backgroundColor: 'action.hover',
                                      },
                                    }}
                                  >
                                    <TableCell>
                                      <Link
                                        to="/shop/view/$productID/$categoryID"
                                        params={{
                                          productID: product.id ?? '',
                                          categoryID: product.category_id ?? '',
                                        }}
                                        style={{ textDecoration: 'none' }}
                                      >
                                        <ProductImage
                                          src={product?.image_url[0]}
                                          alt={product?.name}
                                          style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                          }}
                                        />
                                      </Link>
                                    </TableCell>
                                    <TableCell>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 'medium',
                                          color: 'text.primary',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          maxWidth: '200px',
                                        }}
                                      >
                                        {product?.name || 'N/A'}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ whiteSpace: 'nowrap' }}
                                      >
                                        {product?.created &&
                                          formatDateDMY(product.created)}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                      <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 'bold' }}
                                      >
                                        {product?.quantity || 0}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>
                                      <Typography
                                        variant="body2"
                                        color="text.primary"
                                      >
                                        {formatCurrency(
                                          convert(product.price),
                                        ) || 0}{' '}
                                        {displayCurrency}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 'bold',
                                          color: 'primary.main',
                                        }}
                                      >
                                        {formatCurrency(
                                          convert(
                                            product.price * product.quantity,
                                          ),
                                        ) || 0}{' '}
                                        {displayCurrency}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>

                          {/* Order Summary */}
                          <Box
                            sx={{
                              mt: 3,
                              p: 2,
                              backgroundColor: 'background.paper',
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="h6" sx={{ mb: 2 }}>
                              {t('order_summary')}
                            </Typography>
                            <Grid container spacing={2}>
                              {/* Shipping Name Section */}
                              <Grid
                                size={{
                                  xs: 12,
                                  sm: 6,
                                  md: 4,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 0.5 }}
                                >
                                  {t('shipping_name')}:
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 'bold' }}
                                >
                                  {(() => {
                                    if (order?.address?.split(',').length >= 2)
                                      return order.address
                                        .split(',')
                                        .slice(-2)
                                        .join(', ');
                                    if (order?.customerName)
                                      return order.customerName;

                                    // Extract shipping name from address (last 2 parts)
                                    if (order?.address) {
                                      const addressParts = order.address
                                        .split(',')
                                        .map((part) => part.trim());
                                      if (addressParts.length >= 2) {
                                        return addressParts
                                          .slice(-2)
                                          .join(', ');
                                      }
                                    }
                                    return t('no_name_found');
                                  })()}
                                </Typography>
                              </Grid>

                              {/* Address Section */}
                              <Grid
                                size={{
                                  xs: 12,
                                  sm: 6,
                                  md: 4,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 0.5 }}
                                >
                                  {t('shipping_address')}:
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 'bold' }}
                                >
                                  {(() => {
                                    if (!order?.address)
                                      return t('no_address_found');

                                    // Extract address (first parts, excluding last 2 which are name)
                                    const addressParts = order.address
                                      .split(',')
                                      .map((part) => part.trim());
                                    if (addressParts.length > 2) {
                                      return addressParts
                                        .slice(0, -2)
                                        .join(', ');
                                    } else if (addressParts.length <= 2) {
                                      // If only 2 or fewer parts, show all as address
                                      return order.address;
                                    }
                                    return order.address;
                                  })()}
                                </Typography>
                              </Grid>
                              <Grid
                                size={{
                                  xs: 12,
                                  sm: 6,
                                  md: 3.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    textAlign: { xs: 'left', sm: 'right' },
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {t('total')}:
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    color="primary.main"
                                    sx={{ fontWeight: 'bold' }}
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
                          </Box>
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
                    {t('no_orders_found')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
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
