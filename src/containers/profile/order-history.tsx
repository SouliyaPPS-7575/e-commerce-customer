import CheckIcon from '@mui/icons-material/Check';
import ContentCopy from '@mui/icons-material/ContentCopy';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useNavigate, useSearch } from '@tanstack/react-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrencyContext } from '~/components/CurrencySelector/CurrencyProvider';
import { CustomPagination } from '~/components/CustomPagination';
import { useOrderHistory } from '~/hooks/profile/useOrderHistory';
import type { PaginationAPI } from '~/models';
import { formatCurrency, formatDateDMY } from '~/utils/format';

interface OrderHistoryProps {
  pagination: PaginationAPI;
  onPageChange: (page: number) => void;
}

export function OrderHistory({ pagination, onPageChange }: OrderHistoryProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Obtain search parameters from the router
  const { section, order_id, page, limit } = useSearch<any>({
    from: '/profiles',
  });

  const { displayCurrency, convert } = useCurrencyContext();

  const { orderHistory, orderItems } = useOrderHistory(
    pagination,
    order_id || '',
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

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
            </TableRow>
          </TableHead>

          <TableBody>
            {orderHistory?.items?.map((order) => (
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
                            page: section === 'orders' ? page || 1 : undefined,
                            limit:
                              section === 'orders' ? limit || 10 : undefined,
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
                          order?.reference_id || '',
                        );
                        setCopiedId(order?.reference_id || null);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                    >
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {order?.reference_id}
                      </Typography>
                      <Tooltip
                        title={
                          copiedId === order?.reference_id
                            ? 'Copied!'
                            : 'Copy to clipboard'
                        }
                      >
                        <IconButton size="small">
                          {copiedId === order?.reference_id ? (
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
                                sx={{
                                  fontWeight: 'bold',
                                  color: 'text.primary',
                                }}
                              >
                                {t('products')}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 'bold',
                                  color: 'text.primary',
                                }}
                              >
                                {t('date')}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 'bold',
                                  color: 'text.primary',
                                }}
                              >
                                {t('quantity')}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 'bold',
                                  color: 'text.primary',
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
                                  <TableCell>
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
                                  <TableCell>
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
                                  <TableCell>
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
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: 'bold',
                                        color: 'text.secondary',
                                        textTransform: 'capitalize',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {formatCurrency(convert(product.price * product.quantity)) ||
                                        0}{' '}
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
