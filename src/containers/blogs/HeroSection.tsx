import { Box, Typography } from '@mui/material';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageUrl: string;
}

const HeroSection = ({ title, subtitle, imageUrl }: HeroSectionProps) => {
  if (!title || !subtitle || !imageUrl) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: '400px',
        width: '100%',
        overflow: 'hidden',
        mb: 6,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        },
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt={title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '50px',
          left: '50px',
          zIndex: 2,
          color: 'white',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            color: 'white',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'normal',
            color: 'white',
            maxWidth: '600px',
            fontSize: { xs: '1rem', md: '1.25rem' },
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default HeroSection;
