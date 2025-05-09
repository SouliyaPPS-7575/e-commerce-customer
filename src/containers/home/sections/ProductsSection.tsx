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
import { useProducts } from '~/hooks/shop/useProducts';
import { useRanking } from '~/hooks/shop/useRanking';
import { formatCurrency } from '~/utils/format';

export default function ProductsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { productsData } = useProducts();

  const { productsRankingData } = useRanking();

  const visibleProducts = isMobile
    ? productsRankingData.slice(0, 4)
    : productsRankingData.slice(0, 8);

  // create function filter products by ranking refer from ranking.rank
  const filteredProductsRanking = visibleProducts
    .filter((ranking) => ranking?.rank <= 4)
    .sort((a, b) => a?.rank - b?.rank) // Sort by rank ascending
    .map((ranking) => {
      const product = productsData.find(
        (product) => product?.id === ranking?.product_id,
      );
      return {
        ...product,
        rank: ranking?.rank,
      };
    });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#F5F0E6',
        border: '1px solid #E0DCD5',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          sx={{
            mb: 2.5,
            fontWeight: 600,
            mt: isMobile ? 1 : 2,
            position: 'relative',
            fontFamily: "'Playfair Display', Georgia, serif",
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.4rem' },
          }}
        >
          Shop our best products
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
          {filteredProductsRanking.map((product) => (
            <Grid
              key={product.id}
              size={{
                xs: 6,
                sm: 6,
                md: 4,
                lg: 3,
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
                      transition: 'all 0.3s ease',
                      p: 0,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        product.image_url?.[0] === null ? '' : product.image_url?.[0]
                      }
                      alt={product.name}
                      sx={{
                        aspectRatio: '4 / 5',
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
                          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.1rem' },
                          color: '#7A6A55',
                        }}
                      >
                        {formatCurrency(product.price || 0)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Link to={'/shop'}>
            <Button
              variant="contained"
              size="medium"
              endIcon={<ArrowForward />}
              sx={{
                background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
                color: '#fff',
                px: 3,
                borderRadius: 8,
                textTransform: 'uppercase',
                fontWeight: 500,
                letterSpacing: '1px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #B8860B, #D4AF37)',
                },
              }}
            >
              View All Products
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
