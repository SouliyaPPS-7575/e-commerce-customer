import {
  Box,
  Grid,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import ImagePreview from '~/components/ImagePreview';
import { ProductItem } from '~/models/shop';

const ProductImageGallery = ({ product }: { product: ProductItem }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Ensure we have an array of images
  const images = product.image_url || [];

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const { offset } = info;
    // If drag to left (negative offset.x), go to next image
    if (offset.x < -50 && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
    // If drag to right (positive offset.x), go to previous image
    else if (offset.x > 50 && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const nextImage = () => {
    if (selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // Mobile-specific swipe indicators
  const NavOverlay = () => (
    <>
      {/* Left navigation arrow */}
      {selectedImageIndex > 0 && (
        <Box
          component={motion.div}
          initial={{ opacity: 0.4 }}
          whileHover={{ opacity: 0.9 }}
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer',
          }}
          onClick={prevImage}
        >
          <ChevronLeft size={24} />
        </Box>
      )}

      {/* Right navigation arrow */}
      {selectedImageIndex < images.length - 1 && (
        <Box
          component={motion.div}
          initial={{ opacity: 0.4 }}
          whileHover={{ opacity: 0.9 }}
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '4px 0 0 4px',
            cursor: 'pointer',
          }}
          onClick={nextImage}
        >
          <ChevronRight size={24} />
        </Box>
      )}

      {/* Indicator dots */}
      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 10,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor:
                  index === selectedImageIndex ? '#000' : 'rgba(0,0,0,0.3)',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedImageIndex(index)}
            />
          ))}
        </Box>
      )}
    </>
  );

  return (
    <>
      {/* Mobile View */}
      {isMobile ? (
        <>
          <Box sx={{ position: 'relative', width: '100%' }}>
            <Paper
              elevation={0}
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                position: 'relative',
              }}
            >
              <Box
                component={motion.div}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.img
                      src={images[selectedImageIndex]}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      drag
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      dragMomentum={false}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedImage(images[selectedImageIndex])}
                      onDragEnd={handleDragEnd}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </motion.div>
                </AnimatePresence>
              </Box>
            </Paper>
            <NavOverlay />
          </Box>

          {/* Thumbnail Column */}
          {images.length > 1 && (
            <Grid
              size={{
                xs: 8,
                sm: 1.5,
                md: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  overflowX: 'auto',
                  gap: 1,
                  mt: 1,
                }}
              >
                {images.map((image: string, index: number) => (
                  <Box
                    key={index}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    sx={{
                      width: '100%',
                      height: { sm: '70px', md: '80px' },
                      borderRadius: 1,
                      overflow: 'hidden',
                      border:
                        index === selectedImageIndex
                          ? `2px solid ${theme.palette.primary.main}`
                          : '1px solid #ddd',
                      cursor: 'pointer',
                      opacity: index === selectedImageIndex ? 1 : 0.7,
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Grid>
          )}
        </>
      ) : (
        /* Desktop View */
        (<Grid container spacing={2}>
          {/* Thumbnail Column */}
          {images.length > 1 && (
            <Grid
              size={{
                xs: 2,
                sm: 1.5,
                md: 1.5,
              }}
            >
              <Stack spacing={2} sx={{ height: '100%' }}>
                {images.map((image: string, index: number) => (
                  <Box
                    key={index}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    sx={{
                      width: '100%',
                      height: { sm: '70px', md: '80px' },
                      borderRadius: 1,
                      overflow: 'hidden',
                      border:
                        index === selectedImageIndex
                          ? `2px solid ${theme.palette.primary.main}`
                          : '1px solid #ddd',
                      cursor: 'pointer',
                      opacity: index === selectedImageIndex ? 1 : 0.7,
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Grid>
          )}
          {/* Main Image */}
          <Grid
            size={{
              xs: 10,
              sm: 10.5,
              md: 10.5,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                position: 'relative',
              }}
            >
              <NavOverlay />
              <Box
                component={motion.div}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.img
                      src={images[selectedImageIndex]}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      drag
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      dragMomentum={false}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedImage(images[selectedImageIndex])}
                      onDragEnd={handleDragEnd}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </motion.div>
                </AnimatePresence>
              </Box>
            </Paper>
          </Grid>
        </Grid>)
      )}
      {/* Image Preview Component */}
      <ImagePreview
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </>
  );
};

export default ProductImageGallery;
