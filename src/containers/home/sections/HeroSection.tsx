import { KeyboardArrowDown } from '@mui/icons-material';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useBanners } from '~/hooks/banner/useBanners';
import theme from '~/styles/theme';

interface HeroSectionProps {
  goToPage: (pageNumber: number) => void;
  handleScroll: () => void;
}

export default function HeroSection({
  goToPage,
  handleScroll,
}: HeroSectionProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { bannersData } = useBanners();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      sx={{
        height: '105vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundImage: `url(${bannersData[0]?.img_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
        px: 2,
        mt: -4,
      }}
    >
      <Container
        maxWidth="md"
        sx={{ position: 'relative', zIndex: 1, textAlign: 'center', mt: 4 }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: 'white',
              mb: 3,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Lao Silk
          </Typography>
        </Box>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: 'white',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            Timeless Elegance, Woven by Tradition – Discover the Luxury of
            Handcrafted Lao Silk.
          </Typography>
        </Box>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Box
            onClick={() => {
              goToPage(1);
              handleScroll();
            }}
            sx={{
              color: 'white',
              border: '2px solid white',
              borderRadius: '999px',
              px: 4,
              py: 1.5,
              cursor: 'pointer',
              fontSize: { xs: '0.875rem', sm: '1.1rem' },
              display: 'inline-block',
              textAlign: 'center',
              transition: 'background-color 0.3s',
              backgroundColor: 'rgba(11, 9, 9, 0.212)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Shop now
          </Box>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: isMobile ? '-70%' : '-80%',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': {
                transform: 'translateX(-50%) translateY(0)',
              },
              '40%': {
                transform: 'translateX(-50%) translateY(-20px)',
              },
              '60%': {
                transform: 'translateX(-50%) translateY(-10px)',
              },
            },
          }}
        >
          <KeyboardArrowDown
            sx={{ color: 'white', fontSize: '2.5rem', cursor: 'pointer' }}
            onClick={() => {
              goToPage(1);
              handleScroll();
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
