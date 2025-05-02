import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';

// Mock product data
const products = [
  {
    id: 1,
    name: 'Product name',
    price: '$299',
    image: '/placeholder.svg?height=400&width=400',
  },
  {
    id: 2,
    name: 'Product name',
    price: '$299',
    image: '/placeholder.svg?height=400&width=400',
  },
  {
    id: 3,
    name: 'Product name',
    price: '$299',
    image: '/placeholder.svg?height=400&width=400',
  },
  {
    id: 4,
    name: 'Product name',
    price: '$299',
    image: '/placeholder.svg?height=400&width=400',
  },
  {
    id: 5,
    name: 'Product name',
    price: '$299',
    image: '/placeholder.svg?height=400&width=400',
  },
  {
    id: 6,
    name: 'Product name',
    price: '$299',
    image: '/placeholder.svg?height=400&width=400',
  },
];

export default function ProductsSection() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'background.paper',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          sx={{
            mb: 6,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '3px',
              backgroundColor: 'primary.main',
            },
          }}
        >
          Shop our best products
        </Typography>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid
              key={product.id}
              size={{
                xs: 6,
                sm: 4,
                md: 3
              }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    height: 180,
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="subtitle1" component="h3" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
            }}
          >
            View all products
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
