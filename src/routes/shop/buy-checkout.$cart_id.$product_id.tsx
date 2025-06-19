import { Grid } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { BillingShippingSection } from '~/containers/checkout/billing-shipping-section';
import { CheckoutPageLayout } from '~/containers/checkout/checkout-page-layout';
import { OrderSummarySection } from '~/containers/checkout/order-summary-section';
import { useCheckoutLogic } from '~/hooks/checkout/use-checkout-logic';
import { useOrderCalculations } from '~/hooks/checkout/use-order-calculations';
import {
  getBuyNowCartItemQueryOption,
  useBuyNowCartItem,
} from '~/hooks/checkout/useBuyNowCartItem';
import { useAddress } from '~/hooks/profile/useAddress';
import { queryKeyCountCartItems } from '~/hooks/shop';
import {
  getCartItemsQueryOption,
  useCountCartItems,
} from '~/hooks/shop/useAddCart';
import { useDeleteCartItem } from '~/hooks/shop/useDeleteCartItem';
import { viewProductDetailsQueryOption } from '~/hooks/shop/useViewDetails';
import { OrderItems } from '~/models/checkout';
import { queryClient } from '~/services/queryClient';

export const Route = createFileRoute('/shop/buy-checkout/$cart_id/$product_id')(
  {
    loader: async ({ context, params }) => {
      const { cart_id, product_id } = params;

      try {
        const cartItems = await context.queryClient.ensureQueryData(
          getBuyNowCartItemQueryOption(cart_id),
        );

        const viewProductDetails = await context.queryClient.ensureQueryData(
          viewProductDetailsQueryOption(product_id),
        );

        if (!viewProductDetails) {
          throw new Error('No product details');
        }

        return { cartItems, viewProductDetails };
      } catch (error) {
        console.error('Loader error:', error);
      }
    },
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { t } = useTranslation();
  const { cart_id, product_id } = Route.useParams();

  const { cartItem } = useBuyNowCartItem(cart_id);

  const { data: product } = useSuspenseQuery(
    viewProductDetailsQueryOption(product_id),
  );
  const { formAddress, provinces, districts } = useAddress();

  const { isSubmitting, setIsSubmitting, createOrderMutate } =
    useCheckoutLogic();

  const orderItems: OrderItems[] = [
    {
      quantity: cartItem?.quantity,
      name: product?.name,
      price: product?.price,
      id: cartItem?.id,
      image_url: product?.image_url?.[0],
      category_id: product?.category_id,
      product_id: product?.id,
      collectionId: product?.collectionId,
      collectionName: product?.collectionName,
      customer_id: cartItem?.customer_id,
      status: cartItem?.status,
      created: cartItem?.created,
      updated: cartItem?.updated,
    },
  ];

  // const orderItems =
  const {
    subtotal,
    shippingFee,
    total,
    displayCurrency,
    convert,
    formatCurrency,
  } = useOrderCalculations(orderItems);

  const { deleteCartItem } = useDeleteCartItem();

  const { refetchCountCartItems } = useCountCartItems();

  const formCheckout = useForm({
    defaultValues: {
      remark: '',
    },
    onSubmit: ({ value }) => {
      createOrderMutate(
        {
          data: {
            cartItems: [cartItem?.id],
            remark: value.remark,
          },
        },
        {
          onSuccess: () => {
            deleteCartItem({ data: { cart_id: cartItem?.id } });
            refetchCountCartItems();
            queryClient.invalidateQueries(getCartItemsQueryOption());
            queryClient.invalidateQueries({ queryKey: queryKeyCountCartItems });
          },
        },
      );
    },
  });

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { state: addressFormState } = formAddress;
      const { state: checkoutFormState } = formCheckout;

      // Individual field validation for formAddress
      const { shipping_name, province_id, district_id, village } =
        addressFormState.values;

      if (!province_id) {
        toast.error(t('please_select_province'));
        formAddress.validateField('province_id', 'submit');
        setIsSubmitting(false);
        return;
      }

      if (!district_id) {
        toast.error(t('please_select_district'));
        formAddress.validateField('district_id', 'submit');
        setIsSubmitting(false);
        return;
      }

      if (!village) {
        toast.error(t('village_required'));
        formAddress.validateField('village', 'submit');
        setIsSubmitting(false);
        return;
      }

      if (!shipping_name) {
        toast.error(t('shipping_name_required'));
        formAddress.validateField('shipping_name', 'submit');
        setIsSubmitting(false);
        return;
      }

      // Validate entire checkout form
      if (!checkoutFormState.isValid) {
        formCheckout.validateAllFields('submit');
        toast.error('Please fix the checkout form errors before proceeding.');
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
          formAddress={formAddress}
          formCheckout={formCheckout}
        />
      </Grid>
    </CheckoutPageLayout>
  );
}
