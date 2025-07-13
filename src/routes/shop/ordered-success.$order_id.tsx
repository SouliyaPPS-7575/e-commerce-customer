import { Button, Card, CardContent } from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCurrencyContext } from '~/components/CurrencySelector/CurrencyProvider';
import {
  getOrderItemQueryOption,
  useOrderItem,
} from '~/hooks/orders/useOrderItem';
import { productsQueryOption, useProducts } from '~/hooks/shop/useProducts';
import { OrderItemRes } from '~/models/orders';
import { formatCurrency } from '~/utils/format';

export const Route = createFileRoute('/shop/ordered-success/$order_id')({
  loader: async ({ context, params }) => {
    const { order_id } = params;
    const orderItem = context.queryClient.ensureQueryData(
      getOrderItemQueryOption(order_id),
    );
    const products = context.queryClient.ensureQueryData(productsQueryOption());
    return { orderItem, products };
  },
  component: RouteComponent,
});

export default function RouteComponent() {
  const { t } = useTranslation();
  const order_id = Route.useParams().order_id;
  const { orderItem } = useOrderItem(order_id);
  const { productsData } = useProducts();
  const { currency } = useCurrencyContext();

  const orderItems = orderItem?.map((item) => {
    // Find the corresponding product in productsData
    const product = productsData?.find((p) => p.id === item.product_id);
    // Return a new object with the product details merged in
    return {
      ...item,
      product_name: product?.name || item.product_name,
      image_url: product?.image_url ? [product.image_url] : [],
    };
  }) as OrderItemRes[];

  // Calculate total amount
  const totalAmount = orderItems?.reduce((sum, item) => {
    const price =
      currency === 'USD'
        ? item?.price_usd
        : currency === 'THB'
          ? item?.price_thb
          : currency === 'LAK'
            ? item?.price_lak
            : 0;
    return sum + (price ?? 0) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-[#f5f1eb] flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Success Icon and Message */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-medium text-gray-900">
            {t('thank_you_ordering')}
          </h1>
        </div>

        {/* Order Summary Card */}
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {t('order_summary')}
            </h2>

            <div className="space-y-4">
              <div className="max-h-80 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
                {orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item?.image_url?.[0] || '/placeholder.svg'}
                        alt={item?.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item?.product_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        x {item?.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {currency === 'USD' &&
                          item?.price_usd &&
                          `${formatCurrency(item?.price_usd * item.quantity)} $`}
                        {currency === 'THB' &&
                          item?.price_thb &&
                          `${formatCurrency(item?.price_thb * item.quantity)} ฿`}
                        {currency === 'LAK' &&
                          item?.price_lak &&
                          `${formatCurrency(item?.price_lak * item.quantity)} ₭`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">
                    {t('total')}
                  </span>
                  <span className="text-lg font-medium text-gray-900">
                    {currency === 'USD' && `${totalAmount.toFixed(2)} $`}
                    {currency === 'THB' && `${totalAmount.toFixed(2)} ฿`}
                    {currency === 'LAK' && `${totalAmount.toFixed(2)} ₭`}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Link to="/profiles" search={{ section: 'orders' }}>
            <Button
              variant="outlined"
              sx={{
                color: '#000',
                ':hover': {
                  color: '#f0f0f0',
                },
              }}
              fullWidth
              className="w-full flex-1"
            >
              {t('view_order')}
            </Button>
          </Link>

          <Link to="/shop/index/$category_id" params={{ category_id: 'all' }}>
            <Button
              variant="contained"
              fullWidth
              className="bg-[#c4b896] hover:bg-[#b5a985] text-white border-0"
            >
              {t('continue_shopping')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
