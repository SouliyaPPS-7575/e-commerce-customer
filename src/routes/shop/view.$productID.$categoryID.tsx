import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  AccordionDetails,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrencyContext } from '~/components/CurrencySelector/CurrencyProvider';
import Footer from '~/containers/footer';
import ProductImageGallery from '~/containers/shop/ProductImageGallery';
import {
  getCartItemsQueryOption,
  useAddCart,
  useCartPage,
} from '~/hooks/shop/useAddCart';
import { useProducts } from '~/hooks/shop/useProducts';
import {
  productsByCategoryQueryOption,
  useProductsByCategory,
} from '~/hooks/shop/useProductsByCategory';
import {
  relateProductsQueryOption,
  useViewDetails,
  viewProductDetailsQueryOption,
} from '~/hooks/shop/useViewDetails';
import { localStorageData } from '~/server/cache';
import { queryClient } from '~/services/queryClient';
import { QuantityControl } from '~/styles/add-cart';
import { formatCurrency } from '~/utils/format';

export const Route = createFileRoute('/shop/view/$productID/$categoryID')({
  loader: async ({ context, params }) => {
    const { productID, categoryID } = params;
    const viewProductDetails = context.queryClient.ensureQueryData(
      viewProductDetailsQueryOption(productID),
    );
    const productsByCategory = context.queryClient.ensureQueryData(
      productsByCategoryQueryOption(categoryID),
    );
    const relateProducts = context.queryClient.ensureQueryData(
      relateProductsQueryOption(productID),
    );

    return { viewProductDetails, productsByCategory, relateProducts };
  },
  component: ProductDetailComponent,
});

function ProductDetailComponent() {
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { t } = useTranslation();

  const { displayCurrency, convert } = useCurrencyContext();

  const { product, isLoading, relateProducts } = useViewDetails();
  const { productsByCategoryData } = useProductsByCategory();

  const cleanedDescription = product.description
    .replace(/\r\n/g, '<div style="height: 7px"></div>')
    .replace(/<h1>/g, '<h1 style="font-weight: bold;">')
    .replace(/<\/h1>/g, '</h1>')
    .replace(/<h2>/g, '<h1 style="font-weight: bold;">');

  // const { filteredProductsRanking } = useProductsSection();

  const { productsData } = useProducts();

  const filteredRelateProducts = productsData.filter((product) =>
    relateProducts.some((relatedProduct) => relatedProduct === product.id),
  );

  const { addCart } = useAddCart();
  const { enrichedCartItems } = useCartPage();

  const checkSameAddedCartItem = enrichedCartItems.some(
    (item) => item.product_id === product.id,
  );

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    if (checkSameAddedCartItem) {
      queryClient.invalidateQueries(getCartItemsQueryOption());
      navigate({ to: '/shop/add-cart' });
      return;
    }

    if (newQuantity < 1) return;
    setQuantity(Math.max(newQuantity, 1));
  };

  const customerId = localStorageData('customer_id').getLocalStrage();

  const handleAddToCart = () => {
    if (checkSameAddedCartItem && customerId) {
      navigate({ to: '/shop/add-cart' });
      return;
    }

    if (!customerId) {
      navigate({ to: '/shop/login' });
      return;
    }

    addCart({
      data: {
        product_id: product.id,
        customer_id: customerId,
        status: 'pending',
        quantity,
      },
    });
  };

  const handleBuyNow = () => {
    const customerId = localStorageData('customer_id').getLocalStrage();

    if (checkSameAddedCartItem && customerId) {
      navigate({ to: '/shop/add-cart' });
      return;
    }

    if (!customerId) {
      navigate({ to: '/shop/login' });
      return;
    }

    if (!customerId) {
      navigate({ to: '/shop/login' });
    } else {
      addCart(
        {
          data: {
            product_id: product.id,
            customer_id: customerId,
            status: 'pending',
            quantity,
          },
        },
        {
          onSuccess: ({ cart_id }) => {
            if (!cart_id) return;
            navigate({
              to: '/shop/buy-checkout/$cart_id/$product_id',
              params: {
                cart_id,
                product_id: product.id,
              },
            });
          },
        },
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          minHeight: '120vh',
          backgroundColor: theme.palette.background.paper,
          py: 4,
          mt: isMobile ? -3 : 0,
        }}
      >
        <br />
        <br />
        <Container
          maxWidth="lg"
          sx={{
            py: 1,
          }}
        >
          <Grid container spacing={2}>
            {/* Product Image */}
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <ProductImageGallery product={product} />
            </Grid>

            {/* Product Details */}
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                {/* Brand & Title */}
                <Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    fontWeight="bold"
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                    sx={{
                      mt: -1.5,
                      mb: 1.5,
                      fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.6rem' },
                      color: '#7A6A55',
                    }}
                  >
                    {productsByCategoryData.name}
                  </Typography>
                </Box>

                {/* Price */}
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    my: 2,
                    mt: -0.5,
                    fontSize: { xs: '1.5rem', sm: '1.7rem', md: '1.8rem' },
                    color: '#7A6A55',
                  }}
                >
                  {formatCurrency(convert(product.price)) || 0}{' '}
                  {displayCurrency}
                </Typography>

                {/* Quantity control */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <QuantityControl>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(quantity - 1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>

                    <TextField
                      variant="standard"
                      value={quantity}
                      InputProps={{ disableUnderline: true }}
                      sx={{
                        width: 30,
                        input: { textAlign: 'center' },
                        '& .MuiInputBase-input': { p: 0 },
                      }}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value);
                        if (!isNaN(quantity)) {
                          handleQuantityChange(quantity);
                        }
                      }}
                    />

                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </QuantityControl>
                </Box>

                <br />
                <Typography variant="body2" fontWeight="bold">
                  &nbsp;{'In Stock'}
                </Typography>
                <br />

                {/* Add to Cart Button */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <ShoppingCart />
                        )
                      }
                      onClick={handleAddToCart}
                      disabled={isLoading}
                      sx={{
                        width: '100%', // Full width within Grid item
                        fontSize: '1.2rem',
                        backgroundColor: '#ffffff',
                        color: '#C98B6B',
                        '&:hover': {
                          color: '#fff',
                          backgroundColor: '#f0f0f0',
                        },
                      }}
                    >
                      {t('add_to_cart')}
                    </Button>
                  </Grid>

                  {/* Buy Now Button */}
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={isLoading}
                      sx={{
                        background:
                          'linear-gradient(45deg,#de9c69 10%, #C98B6B 90%)',
                        width: '100%', // Full width within Grid item
                        fontSize: '1.2rem',
                        color: '#fff',
                        '&:hover': {
                          borderColor: '#fff',
                          color: '#fff',
                        },
                      }}
                      onClick={handleBuyNow}
                    >
                      {t('buy_now')}
                    </Button>
                  </Grid>
                </Grid>

                {/* Accordion Sections */}
                <Divider sx={{ my: 1 }} />
                <AccordionDetails>
                  <Box
                    sx={{
                      mb: -3,
                      mt: -1,
                      fontSize: '0.95rem',
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                    }}
                    dangerouslySetInnerHTML={{ __html: cleanedDescription }}
                  />
                </AccordionDetails>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1, mt: 2 }} />

          {/* YOU_MIGHT_ALSO_LIKE Products */}
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 600,
              mt: 2,
              position: 'relative',
              textAlign: 'left',
              fontFamily: 'Canela Trial',
              letterSpacing: '0.5px',
              fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.4rem' },
              flexShrink: 1, // Allow text to shrink if needed
            }}
          >
            {t('YOU_MIGHT_ALSO_LIKE')}
          </Typography>

          <Grid container spacing={2}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                pb: 1,
                px: 1,
                mt: 3,
                '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar
              }}
            >
              {filteredRelateProducts.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    flex: '0 0 auto',
                    width: {
                      xs: '80%', // 1–2 visible items on mobile
                      sm: '45%', // ~2 items on small tablets
                      md: '30%', // ~3 items on tablets
                      lg: '23%', // 4–5 items on desktop
                    },
                    scrollSnapAlign: 'start',
                  }}
                >
                  <motion.div
                    whileHover={{ y: -5, scale: 1.03 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ height: '100%' }}
                  >
                    <Link
                      to="/shop/view/$productID/$categoryID"
                      params={{
                        productID: product.id ?? '',
                        categoryID: product.category_id ?? '',
                      }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          borderRadius: 0,
                          overflow: 'hidden',
                          boxShadow: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          backgroundColor: 'transparent',
                          p: 0,
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={
                            product.image_url?.[0] === null
                              ? ''
                              : product.image_url?.[0]
                          }
                          alt={product.name}
                          sx={{
                            aspectRatio: '3 / 5',
                            width: '100%',
                            objectFit: 'cover',
                            boxShadow: 3,
                            transition: 'transform 0.4s ease',
                            '&:hover': { transform: 'scale(1.05)' },
                          }}
                        />
                        <CardContent
                          sx={{
                            p: 1,
                            textAlign: 'left',
                            backgroundColor: 'transparent',
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            component="h3"
                            gutterBottom
                            noWrap
                            sx={{
                              mt: -0.1,
                              fontSize: {
                                xs: '1.2rem',
                                sm: '1.3rem',
                                md: '1.3rem',
                              },
                              color: '#333333',
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: -1,
                              fontSize: {
                                xs: '1rem',
                                sm: '1.1rem',
                                md: '1.1rem',
                              },
                              color: '#7A6A55',
                            }}
                          >
                            {formatCurrency(convert(product.price || 0))}{' '}
                            {displayCurrency}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
