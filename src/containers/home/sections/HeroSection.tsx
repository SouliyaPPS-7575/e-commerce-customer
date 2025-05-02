import { Box, Button, Container, Typography } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

export default function HeroSection() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Container
        maxWidth="md"
        sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
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
          Laos Fabric
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            color: 'white',
            mb: 6,
            maxWidth: '800px',
            mx: 'auto',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&apos;s standard dummy text
          ever since the 1500s
        </Typography>
        <Button
          variant="outlined"
          size="large"
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'white',
            },
            px: 4,
            py: 1.5,
          }}
        >
          Explore more
        </Button>
      </Container>

      <Box
        sx={{
          position: 'absolute',
          bottom: '30px',
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
        <KeyboardArrowDown sx={{ color: 'white', fontSize: '2.5rem' }} />
      </Box>
    </Box>
  );
}
