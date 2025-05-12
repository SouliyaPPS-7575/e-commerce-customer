import GridViewIcon from '@mui/icons-material/GridView';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { SetStateAction, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrencyContext } from '~/components/CurrencySelector/CurrencyProvider';
import Footer from '~/containers/footer';
import {
  categoriesQueryOption,
  useCategories,
} from '~/hooks/shop/useCategories';
import { productsQueryOption, useProducts } from '~/hooks/shop/useProducts';
import { formatCurrency } from '~/utils/format';

export const Route = createFileRoute('/shop/')({
  loader: async ({ context }) => {
    const productsData = context.queryClient.ensureQueryData(
      productsQueryOption(),
    );

    const categories = context.queryClient.ensureQueryData(
      categoriesQueryOption(),
    );

    return { productsData, categories };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { displayCurrency, convert } = useCurrencyContext();

  const { productsData } = useProducts();

  const [sortBy, setSortBy] = useState<string>('nameAsc');
  const [gridCols, setGridCols] = useState(2); // default to 2 columns

  const handleSortChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSortBy(event.target.value);
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { categoriesData } = useCategories();

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    if (!productsData) return [];

    const filtered = selectedCategory
      ? productsData.filter((p) => p.category_id === selectedCategory)
      : productsData;

    const sorted = [...filtered];
    switch (sortBy) {
      case 'nameAsc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'nameDesc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'priceLow':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'priceHigh':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      default:
        return sorted;
    }
  }, [productsData, selectedCategory, sortBy]);


  return (
    <>
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.paper,
          py: 4,
          mt: isMobile ? 5 : 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Wrapper for horizontal centering */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              mb: isMobile ? 1.5 : 5.5,
              mt: isMobile ? -1 : 2,
            }}
          >
            {/* Scrollable Category Filter Tabs */}
            <Box
              sx={{
                fontFamily: 'Playfair Display Noto Sans Lao',
                display: 'inline-flex',
                alignItems: 'center',
                overflowX: 'auto',
                gap: 1,
                py: 0.5,
                px: 1,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {/* All Category */}
              <Box
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(null)}
                sx={{
                  px: 2,
                  py: 0.7,
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  backgroundColor:
                    selectedCategory === null
                      ? 'primary.main'
                      : theme.palette.grey[200],
                  color:
                    selectedCategory === null
                      ? '#fff'
                      : theme.palette.text.primary,
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow:
                    selectedCategory === null ? theme.shadows[1] : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                All
              </Box>

              {categoriesData?.map((category) => (
                <Box
                  key={category.id}
                  component={motion.div}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCategory(category.id)}
                  sx={{
                    px: 2,
                    py: 0.7,
                    borderRadius: '999px',
                    whiteSpace: 'nowrap',
                    backgroundColor:
                      selectedCategory === category.id
                        ? 'primary.main'
                        : theme.palette.grey[200],
                    color:
                      selectedCategory === category.id
                        ? '#fff'
                        : theme.palette.text.primary,
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow:
                      selectedCategory === category.id
                        ? theme.shadows[1]
                        : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {category.name}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Header with Title and Sort */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              mb: 3,
              mt: isMobile ? -1 : -5,
              flexWrap: 'nowrap', // Prevent wrapping on small screens
            }}
          >
            {/* Shop All Title */}
            {isMobile && (
              <Typography
                sx={{
                  fontWeight: 600,
                  mt: isMobile ? 1 : 2,
                  position: 'relative',
                  textAlign: 'left',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                  flexShrink: 1, // Allow text to shrink if needed
                }}
              >
                {t('shops')}
              </Typography>
            )}
            {!isMobile && (
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 600,
                  mt: isMobile ? 1 : 2,
                  position: 'relative',
                  textAlign: 'left',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.4rem' },
                  flexShrink: 1, // Allow text to shrink if needed
                }}
              >
                {t('shop_all')}
              </Typography>
            )}

            {/* Sort Controls */}
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                backgroundColor: theme.palette.background.paper,
                py: 1,
                px: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.5, sm: 1 }, // Reduce gap on smaller screens
                  flexShrink: 0, // Don't shrink the sorting controls
                  ml: 1, // Add margin to ensure separation from the title
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    whiteSpace: 'nowrap', // Prevent "Sort by:" from wrapping
                  }}
                >
                  {t('sort_by')}
                </Typography>
                <FormControl
                  variant="standard"
                  sx={{
                    minWidth: { xs: 95, sm: 120 }, // Smaller width on mobile
                    '& .MuiSelect-select': {
                      fontSize: { xs: '0.8rem', sm: '1rem' },
                      fontWeight: 500,
                      py: 0,
                    },
                  }}
                >
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    disableUnderline
                    displayEmpty
                  >
                    <MenuItem value="nameAsc">Name A-Z</MenuItem>
                    <MenuItem value="nameDesc">Name Z-A</MenuItem>
                    <MenuItem value="priceLow">Price: Low to High</MenuItem>
                    <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                  </Select>
                </FormControl>

                {/* Grid View Controls */}
                {isMobile && (
                  <Box sx={{ ml: 1, display: 'flex', gap: 1, mr: -2 }}>
                    <GridViewIcon
                      onClick={() => setGridCols(2)}
                      sx={{
                        cursor: 'pointer',
                        color:
                          gridCols === 2 ? 'primary.main' : 'text.secondary',
                      }}
                    />
                    <SplitscreenIcon
                      onClick={() => setGridCols(1)}
                      sx={{
                        cursor: 'pointer',
                        color:
                          gridCols === 1 ? 'primary.main' : 'text.secondary',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {filteredProducts.map((product) => (
              <Grid
                key={product.id}
                size={{
                  xs: gridCols === 1 ? 12 : 6,
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
                          product.image_url?.[0] === null
                            ? ''
                            : product.image_url?.[0]
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
                            fontSize: {
                              xs: '1rem',
                              sm: '1.1rem',
                              md: '1.1rem',
                            },
                            color: '#7A6A55',
                          }}
                        >
                          {formatCurrency(convert(product.price)) || 0}{' '}
                          {displayCurrency}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </>
  );
}
