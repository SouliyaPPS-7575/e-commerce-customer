import { Grid } from '@mui/material';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'sonner';
import { BillingShippingSection } from '~/containers/checkout/billing-shipping-section';
import { CheckoutPageLayout } from '~/containers/checkout/checkout-page-layout';
import { OrderSummarySection } from '~/containers/checkout/order-summary-section';
import { useCheckoutLogic } from '~/hooks/checkout/use-checkout-logic';
import { useOrderCalculations } from '~/hooks/checkout/use-order-calculations';
import { viewAddressQueryOption } from '~/hooks/checkout/useViewAddress';
import { useAddress } from '~/hooks/profile/useAddress';
import {
  getCountCartItemsQueryOption,
  useCartPage,
} from '~/hooks/shop/useAddCart';
import { OrderItems } from '~/models/checkout';

export const Route = createFileRoute('/shop/checkout')({
  beforeLoad: async ({ context }) => {
    try {
      const cartItems = await context.queryClient.ensureQueryData(
        getCountCartItemsQueryOption(),
      );

      if (cartItems === 0) {
        return redirect({
          to: '/shop/index/$category_id',
          params: { category_id: 'all' },
        });
      }
    } catch (error) {
      console.error('Loader error:', error);

      // Optionally inspect error to check for 401/403/etc.
      throw redirect({
        to: '/shop/index/$category_id',
        params: { category_id: 'all' },
      });
    }
  },
  loader: async ({ context }) => {
    try {
      const address = context.queryClient.ensureQueryData(
        viewAddressQueryOption(),
      );
      return { address };
    } catch (error) {
      console.error('Loader error:', error);

      // Optionally inspect error to check for 401/403/etc.
      throw redirect({
        to: '/shop/index/$category_id',
        params: { category_id: 'all' },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { enrichedCartItems, selectedItemIds } = useCartPage();

  const orderItems = enrichedCartItems.filter((item) =>
    selectedItemIds.includes(item.id),
  ) as OrderItems[];

  const { formAddress, provinces, districts } = useAddress();

  const { isSubmitting, setIsSubmitting, formCheckout } =
    useCheckoutLogic(selectedItemIds);

  const {
    subtotal,
    shippingFee,
    total,
    displayCurrency,
    convert,
    formatCurrency,
  } = useOrderCalculations(orderItems);

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // First submit the address form
      await formAddress.handleSubmit();
      // Then submit the checkout form
      await formCheckout.handleSubmit();
    } catch (error) {
      console.error('Error submitting forms:', error);
      toast.error('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <CheckoutPageLayout>
      {/* Left Column - Billing & Shipping Form */}
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <BillingShippingSection
          formAddress={formAddress}
          formCheckout={formCheckout}
          provinces={provinces}
          districts={districts}
        />
      </Grid>

      {/* Right Column - Order Summary */}
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <OrderSummarySection
          orderItems={orderItems}
          subtotal={subtotal}
          shippingFee={shippingFee}
          total={total}
          displayCurrency={displayCurrency}
          formatCurrency={formatCurrency}
          convert={convert}
          isSubmitting={isSubmitting}
          onPlaceOrder={handlePlaceOrder}
          formAddress={formAddress}
          formCheckout={formCheckout}
        />
      </Grid>
    </CheckoutPageLayout>
  );
}
