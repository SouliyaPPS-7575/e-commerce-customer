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

// Mock product data
const products = [
  {
    id: 1,
    name: 'Product name',
    price: '$299',
    image:
      'https://i.ibb.co/FqmBwx9t/2ed9560e5c7a28abcb18e258aebca21b36b5cde5.png',
  },
  {
    id: 2,
    name: 'Product name',
    price: '$299',
    image:
      'https://i.ibb.co/27JnPL5t/67844ba1469f8cc84cce815ace14e4804fb94b7c.png',
  },
  {
    id: 3,
    name: 'Product name',
    price: '$299',
    image:
      'https://i.ibb.co/DP9MrBH9/c5b8b40839de702f61d56f59461d7446a9d0f381.png',
  },
  {
    id: 4,
    name: 'Product name',
    price: '$299',
    image:
      'https://i.ibb.co/BKZfkBx5/e13a2af44b3fd92e9a7c350eb2a8634f34d25dab.png',
  },
  {
    id: 5,
    name: 'Product name',
    price: '$299',
    image:
      'https://i.ibb.co/LhRtPgsq/bca5476fe24e81e0928194f5321cdf1d456b857f.png',
  },
  {
    id: 6,
    name: 'Product name',
    price: '$299',
    image:
      'https://i.ibb.co/yc2DsWpN/504d33301cb8c8d22ee9613ccba278753be876bc.png',
  },
  {
    id: 7,
    name: 'Product name',
    price: '$299',
    image:
      'https://i.ibb.co/C3VnhQRk/bcdd2a43df06c7fe6772a7c4136279e79b02c945.png',
  },
  {
    id: 8,
    name: 'Product name',
    price: '$299',
    image:
      'https://i.ibb.co/d4RbgVSd/a78d3af5ac3de6c540f3bf9f40069915b3bb174c.png',
  },
];

export default function ProductsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const visibleProducts = isMobile
    ? products.slice(0, 4)
    : products.slice(0, 8);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#F5F0E6',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          sx={{
            mb: 2,
            mt: isMobile ? 2 : 3,
            position: 'relative',
            fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.5rem' },
          }}
        >
          Shop our best products
        </Typography>

        <Grid container spacing={2}>
          {visibleProducts.map((product) => (
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
                whileHover={{
                  y: -5,
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ height: '100%', display: 'flex' }}
              >
                <Card
                  sx={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      height: isMobile ? '150px' : '210px',
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2, mb: -1.5 }}>
                    <Typography
                      variant="subtitle1"
                      component="h3"
                      gutterBottom
                      noWrap
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.price}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Link to={'/shop'}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 2,
              }}
            >
              View all products
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
