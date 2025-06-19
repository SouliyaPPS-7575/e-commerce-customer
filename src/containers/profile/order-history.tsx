import CheckIcon from '@mui/icons-material/Check';
import ContentCopy from '@mui/icons-material/ContentCopy';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {t('reference_id')}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {t('date')}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {t('status')}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {t('address')}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {t('quantity')}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
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
                      >
                        {expandedRow === order.id ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
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
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        color:
                          order?.status === 'completed'
                            ? 'success.main'
                            : 'warning.main',
                      }}
                    >
                      <Grid size={{ xs: 6, sm: 6 }}>
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
                      </Grid>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                      }}
                    >
                      <Box>
                        {(order?.address || t('no_address_found'))
                          .split(',')
                          .map((line, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                textTransform: 'capitalize',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {line.trim()}
                            </Typography>
                          ))}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                      }}
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
                  <TableRow>
                    <TableCell colSpan={5} sx={{ py: 0 }}>
                      <Collapse
                        in={expandedRow === order.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  align="center"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: 'text.primary',
                                    textAlign: 'center',
                                  }}
                                >
                                  {t('image')}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: 'text.primary',
                                    textAlign: 'center',
                                  }}
                                >
                                  {t('products')}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: 'text.primary',
                                    textAlign: 'center',
                                  }}
                                >
                                  {t('date')}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: 'text.primary',
                                    textAlign: 'center',
                                  }}
                                >
                                  {t('quantity')}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: 'text.primary',
                                    textAlign: 'center',
                                  }}
                                >
                                  {t('total')}
                                </TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {orderItems?.products?.map((product) => (
                                <React.Fragment key={product.id}>
                                  <TableRow>
                                    <TableCell
                                      align="center"
                                      sx={{ textAlign: 'center' }}
                                    >
                                      <Link
                                        to="/shop/view/$productID/$categoryID"
                                        params={{
                                          productID: product.id ?? '',
                                          categoryID: product.category_id ?? '',
                                        }}
                                        style={{ display: 'inline-block' }}
                                      >
                                        <ProductImage
                                          src={product?.image_url[0]}
                                          alt={product?.name}
                                        />
                                      </Link>
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{ textAlign: 'center' }}
                                    >
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          fontWeight: 'bold',
                                          color: 'text.secondary',
                                          textTransform: 'capitalize',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {product?.name || 'N/A'}
                                      </Typography>
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{ textAlign: 'center' }}
                                    >
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          fontWeight: 'bold',
                                          color: 'text.secondary',
                                          textTransform: 'capitalize',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {product?.created &&
                                          formatDateDMY(product.created)}
                                      </Typography>
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{ textAlign: 'center' }}
                                    >
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          fontWeight: 'bold',
                                          color: 'text.secondary',
                                          textTransform: 'capitalize',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {product?.quantity || 0}
                                      </Typography>
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{ textAlign: 'center' }}
                                    >
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          fontWeight: 'bold',
                                          color: 'text.secondary',
                                          textTransform: 'capitalize',
                                          whiteSpace: 'nowrap',
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
                                </React.Fragment>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography
                    variant="body1"
                    color="text.secondary"
                  >
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
