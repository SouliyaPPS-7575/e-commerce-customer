import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import theme from '~/styles/theme';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2,
      duration: 0.8,
      ease: 'easeOut',
    },
  }),
};

export default function AboutSection() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component={motion.div}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={isMobile ? 2 : 4} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Box
              component={motion.img}
              custom={0}
              variants={fadeInUp}
              src="https://i.ibb.co/d4RbgVSd/a78d3af5ac3de6c540f3bf9f40069915b3bb174c.png"
              alt="Colorful fabrics"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Box component={motion.div} custom={1} variants={fadeInUp}>
              <Typography
                component={motion.div}
                custom={2}
                variants={fadeInUp}
                variant="h2"
                sx={{
                  mb: 3,
                  position: 'relative',
                  fontSize: { xs: '2rem', md: '3rem' },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: 0,
                    width: '60px',
                    height: '3px',
                    backgroundColor: 'primary.main',
                  },
                }}
              >
                Lorem Ipsum
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography
                  component={motion.div}
                  custom={2}
                  variants={fadeInUp}
                  variant="body1"
                  sx={{
                    mb: 1,
                    color: 'text.secondary',
                    fontSize: { xs: '1rem', md: '1.125rem' },
                  }}
                >
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </Typography>
                <Typography
                  component={motion.div}
                  custom={2}
                  variants={fadeInUp}
                  variant="body1"
                  sx={{
                    mb: 1,
                    color: 'text.secondary',
                    fontSize: { xs: '1rem', md: '1.125rem' },
                  }}
                >
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: isMobile ? -2 : 2,
                  }}
                >
                  <Link to="/about" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary" size="large">
                      Learn more
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
