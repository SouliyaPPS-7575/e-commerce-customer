import { Grid } from '@mui/material';
import { createFileRoute, redirect, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const { enrichedCartItems, selectedItemIds } = useCartPage();

  const orderItems = enrichedCartItems.filter((item) =>
    selectedItemIds.includes(item.id),
  ) as OrderItems[];

  const { formAddress, provinces, districts, isSubmitting, setIsSubmitting } =
    useAddress();

  const { formCheckout } = useCheckoutLogic(selectedItemIds);

  const {
    subtotal,
    shippingFee,
    total,
    displayCurrency,
    convert,
    formatCurrency,
  } = useOrderCalculations(orderItems);

  const { tab } = useSearch<any>({
    from: '/shop/checkout',
  });

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Check stock for each item in the order
    for (const item of orderItems) {
      if (item.quantity > item.total_count) {
        toast.error(t('quantity_exceeds_stock', { product_name: item.name }));
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const { state: addressFormState } = formAddress;

      // Individual field validation for formAddress
      const {
        // laos address
        shipping_name,
        province_id,
        district_id,
        village,

        // global address
        country_code,
        country_name,
        address_line_1,
        address_line_2,
        city,
        state_region,
        postal_code,
        // is_international,
      } = addressFormState.values;

      // laos address
      if (!province_id && tab === 0) {
        toast.error(t('please_select_province'));
        formAddress.validateField('province_id', 'submit');
        setIsSubmitting(false);
        return;
      }

      if (!district_id && tab === 0) {
        toast.error(t('please_select_district'));
        formAddress.validateField('district_id', 'submit');
        setIsSubmitting(false);
        return;
      }

      if (!village && tab === 0) {
        toast.error(t('village_required'));
        formAddress.validateField('village', 'submit');
        setIsSubmitting(false);
        return;
      }

      if (!shipping_name && tab === 0) {
        toast.error(t('shipping_name_required'));
        formAddress.validateField('shipping_name', 'submit');
        setIsSubmitting(false);
        return;
      }

      // global address
      if (!country_code && tab === 1) {
        toast.error(t('country_code_required'));
        formAddress.validateField('country_code', 'submit');
        setIsSubmitting(false);
        return;
      }

      if (!country_name && tab === 1) {
        toast.error(t('country_name_required'));
        formAddress.validateField('country_name', 'submit');
        setIsSubmitting(false);
        return;
      }

      if (!address_line_1 && tab === 1) {
        toast.error(t('address_line_1_required'));
        formAddress.validateField('address_line_1', 'submit');
        setIsSubmitting(false);
        return;
      }

      if (!address_line_2 && tab === 1) {
        toast.error(t('address_line_2_required'));
        formAddress.validateField('address_line_2', 'submit');
        setIsSubmitting(false);
        return;
      }

      if (!city && tab === 1) {
        toast.error(t('city_required'));
        formAddress.validateField('city', 'submit');
        setIsSubmitting(false);
        return;
      }

      if (!state_region && tab === 1) {
        toast.error(t('state_region_required'));
        formAddress.validateField('state_region', 'submit');
        setIsSubmitting(false);
        return;
      }

      if (!postal_code && tab === 1) {
        toast.error(t('postal_code_required'));
        formAddress.validateField('postal_code', 'submit');
        setIsSubmitting(false);
        return;
      }

      // Submit forms
      await formAddress.handleSubmit();
      await formCheckout.handleSubmit();

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error submitting forms:', error);
      if (error instanceof Error) {
        toast.error(`Failed to place order: ${error.message}`);
      } else {
        toast.error('Failed to place order. Please try again.');
      }
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
        />
      </Grid>
    </CheckoutPageLayout>
  );
}
