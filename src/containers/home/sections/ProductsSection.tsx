import { ArrowForward } from '@mui/icons-material';
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
import { useProductsSection } from '~/hooks/shop/useProductsSection';
import { formatCurrency } from '~/utils/format';

export default function ProductsSection() {
  const { t } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { filteredProductsRanking } = useProductsSection();

  const { displayCurrency, convert } = useCurrencyContext();

  return (
    <Box
      sx={{
        minHeight: '110vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#F5F0E6',
        border: '1px solid #E0DCD5',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 600,
            mt: isMobile ? -10 : -1,
            position: 'relative',
            fontFamily: "'Playfair Display', Georgia, serif",
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.2rem' },
          }}
        >
          {t('shop_our_best_products')}
          <Box
            sx={{
              width: 60,
              height: 4,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
              mx: 'auto',
              mt: 1,
            }}
          />
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
        </Grid>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: isMobile ? -3.5 : 1,
          }}
        >
          <Link to={'/shop'}>
            <Button
              variant="contained"
              size="small"
              endIcon={<ArrowForward />}
              sx={{
                backgroundColor: '#c29b7d',
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
      </Container>
    </Box>
  );
}
