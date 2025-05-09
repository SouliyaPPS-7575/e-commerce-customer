import { ShoppingBag } from '@mui/icons-material';
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import ProductImageGallery from '~/containers/shop/ProductImageGallery';
import {
  productsByCategoryQueryOption,
  useProductsByCategory,
} from '~/hooks/shop/useProductsByCategory';
import {
  useViewDetails,
  viewProductDetailsQueryOption,
} from '~/hooks/shop/useViewDetails';
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

    return { viewProductDetails, productsByCategory };
  },
  component: ProductDetailComponent,
});

function ProductDetailComponent() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { product, isLoading } = useViewDetails();
  const { productsByCategoryData } = useProductsByCategory();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '120vh',
        backgroundColor: theme.palette.background.paper,
        py: 4,
        mt: -10,
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
              sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
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
                  }}
                >
                  {productsByCategoryData.name}
                </Typography>
              </Box>

              {/* Price */}
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ my: 2, mt: -0.5 }}
              >
                {formatCurrency(product.price || 0)}
              </Typography>

              {/* Add to Cart Button */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  mb: 2,
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <ShoppingBag />
                    )
                  }
                  onClick={() => {}}
                  disabled={isLoading}
                  sx={{
                    width: '70%',
                    mx: 'auto',
                    fontSize: '1.2rem',
                    backgroundColor: '#212121',
                    '&:hover': {
                      backgroundColor: '#000000',
                    },
                  }}
                >
                  {t('add_to_cart')}
                </Button>
              </Box>

              {/* Accordion Sections */}
              <Divider sx={{ my: 1 }} />
              <AccordionSummary
                aria-controls="description-content"
                id="description-header"
              >
                <Typography variant="h6">{t('description')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: -2 }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </AccordionDetails>
              <Divider />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
