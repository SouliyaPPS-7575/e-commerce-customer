import { ArrowForward, ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCurrencyContext } from '~/components/CurrencySelector/CurrencyProvider';
import Footer from '~/containers/footer';
import { useProductsSection } from '~/hooks/shop/useProductsSection';
import { formatCurrency } from '~/utils/format';
import BlogSection from './BlogSection';
import { useCategories } from '~/hooks/shop/useCategories';

export default function ProductsSection() {
  const { t } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { categoriesData } = useCategories();

  const { filteredProductsRanking } = useProductsSection();

  const { displayCurrency, convert } = useCurrencyContext();

  const handlePrevSlide = () => {
    const container = document.getElementById('product-carousel');
    if (container) {
      container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
    }
  };

  const handleNextSlide = () => {
    const container = document.getElementById('product-carousel');
    if (container) {
      container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section with Three Textile Types */}
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Grid container>
          {categoriesData?.slice(0, 3).map((category) => (
            <Grid
              key={category.id}
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.03 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                style={{ height: '100%' }}
              >
                <Link
                  to="/shop/index/$category_id"
                  params={{ category_id: category.id }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      height: { xs: 300, md: 500 },
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      component="img"
                      src={category.image_url}
                      alt={category.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        left: 0,
                        width: '100%',
                        color: '#fff',
                        textAlign: 'center',
                        fontFamily: "'Canela', serif",
                        letterSpacing: 1,
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Box>
                </Link>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Best Sellers Section */}
      <Box
        sx={{
          minHeight: '100vh',
          py: 6,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FBF8F4',
          border: '1px solid #E0DCD5',
          mb: isMobile ? -10 : -10,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 0 }}>
          {/* Best Sellers Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 6,
            }}
          >
            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontFamily: "'Canela', serif",
                fontWeight: 500,
                color: '#3a3a3a',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              {t('our_best_seller')}
            </Typography>
            <Link
              to={'/shop/index/$category_id'}
              params={{ category_id: 'all' }}
            >
              <Typography
                sx={{
                  color: '#3a3a3a',
                  textTransform: 'none',
                  fontSize: '1rem',
                  textDecoration: 'underline',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                {t('shop_all')}
              </Typography>
            </Link>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Product Carousel */}
            <Box sx={{ position: 'relative', mt: 4 }}>
              <Button
                onClick={handlePrevSlide}
                sx={{
                  position: 'absolute',
                  left: -20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg,#de9c69 10%, #C98B6B 90%)',
                  color: '#fff',
                  zIndex: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                <ChevronLeft />
              </Button>

              <Box
                id="product-carousel"
                sx={{
                  display: 'flex',
                  gap: 2,
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'smooth',
                  pb: 1,
                  px: 1,
                  mt: -4,
                  '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar
                }}
              >
                {filteredProductsRanking.map((product) => (
                  <Box
                    key={product.id}
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

              <Button
                onClick={handleNextSlide}
                sx={{
                  position: 'absolute',
                  right: -20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg,#de9c69 10%, #C98B6B 90%)',
                  color: '#fff',
                  zIndex: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                <ChevronRight />
              </Button>
            </Box>
          </motion.div>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: isMobile ? -3.5 : -1,
            }}
          >
            <Link
              to={'/shop/index/$category_id'}
              params={{ category_id: 'all' }}
            >
              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowForward />}
                sx={{
                  background: 'linear-gradient(45deg,#de9c69 10%, #C98B6B 90%)',
                  borderRadius: '30px',
                  color: 'white',
                  px: 5,
                  py: 1,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: '#a67c62',
                  },
                }}
              >
                {t('view_all_products')}
              </Button>
            </Link>
          </Box>
          <BlogSection key="blog" />
        </Container>
      </Box>
      <Footer key={'footer'} />
    </>
  );
}
