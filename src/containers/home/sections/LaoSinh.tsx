import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCurrencyContext } from '~/components/CurrencySelector/CurrencyProvider';
import { useBanners } from '~/hooks/banner/useBanners';
import { useCategories } from '~/hooks/shop/useCategories';
import { useProducts } from '~/hooks/shop/useProducts';
import { formatCurrency } from '~/utils/format';

export default function LaoSinhSection() {
  const { t } = useTranslation();
  const scrollLeft = () => {
    const container = document.getElementById('product-scroll');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('product-scroll');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const { bannersData } = useBanners();
  const { categoriesData } = useCategories();

  const categoryIdSinh =
    categoriesData.find((category) => category.name === 'Sinh')?.id || 1; // Default to 1 if not found

  const { displayCurrency, convert } = useCurrencyContext();

  const { productsData } = useProducts();
  const sinhProducts = productsData.filter(
    (product) => product.category_id === categoryIdSinh,
  );

  if (!bannersData || !categoriesData || !productsData) {
    return null; // Handle loading state or error
  }
  if (sinhProducts.length === 0) {
    return null;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        sx={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          backgroundImage: `url(${bannersData[1]?.img_url})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          top: { xs: 60 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box
            sx={{
              maxWidth: '600px',
              color: 'white',
              pl: { xs: 2, md: 4 },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
                fontWeight: 300,
                fontFamily: 'serif',
                lineHeight: 1.1,
                mb: 2,
              }}
            >
              Lao Sinh
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 300,
                mb: 4,
                opacity: 0.95,
                lineHeight: 1.4,
              }}
            >
              Where artisanal heritage meets modern luxury.
            </Typography>

            <Link
              to="/shop/index/$category_id"
              params={{ category_id: String(categoryIdSinh) }}
              style={{ textDecoration: 'none' }}
            >
              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  textTransform: 'none',
                  fontWeight: 400,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {t('discover_now')}
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box
        sx={{
          backgroundColor: '#f8f6f3',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              mb: 4,
              mt: 4,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.2rem', md: '2.2rem' },
                  fontWeight: 400,
                  fontFamily: 'serif',
                  color: '#2c2c2c',
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                LAO SINH CATEGORIES
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  fontSize: { xs: '0.7rem', md: '1.1rem' },
                  fontWeight: 300,
                }}
              >
                Find your perfect piece in every pattern and silhouette
              </Typography>
            </Box>

            <Link
              to="/shop/index/$category_id"
              params={{ category_id: String(categoryIdSinh) }}
              style={{ textDecoration: 'none' }}
            >
              <Button
                sx={{
                  color: '#2c2c2c',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  textDecoration: 'underline',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                {t('shops')}
              </Button>
            </Link>
          </Box>

          {/* Product Gallery */}
          <Box sx={{ position: 'relative' }}>
            {/* Navigation Arrows */}
            <IconButton
              onClick={scrollLeft}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={scrollRight}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <ChevronRight />
            </IconButton>

            {/* Scrollable Product Container */}
            <Box
              id="product-scroll"
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                pb: 1,
                px: 1,
                mt: -1,
                mb: -8,
                '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar
              }}
            >
              {sinhProducts.map((product) => (
                <Box
                  key={`${product.id}-${product.category_id}`}
                  sx={{
                    flex: '0 0 auto',
                    minWidth: {
                      xs: '75%',
                      sm: '40%',
                      md: '28%',
                      lg: '22%',
                    },
                    maxWidth: {
                      xs: '90%',
                      sm: '45%',
                      md: '30%',
                      lg: '24%',
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
                                xs: '1rem',
                                sm: '1.15rem',
                                md: '1.25rem',
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
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
