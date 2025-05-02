import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube } from '@mui/icons-material';

// Footer navigation links
const footerLinks = {
  shop: ['Our company', 'Leadership', 'Our story', 'Opportunity'],
  about: ['All products', 'Feel Great', 'Unimate'],
  info: ['Contact', 'Events', 'Blog', 'Press', 'Careers'],
};

export default function FooterSection() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'secondary.main',
        color: 'white',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Social Media */}
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <IconButton sx={{ color: 'white' }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: 'white' }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: 'white' }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: 'white' }}>
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          {/* Shop Links */}
          <Grid
            size={{
              xs: 6,
              sm: 4,
              md: 3
            }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Shop
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {footerLinks.shop.map((link) => (
                <Box component="li" key={link} sx={{ mb: 1.5 }}>
                  <Link href="#" color="inherit" underline="hover">
                    {link}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* About Links */}
          <Grid
            size={{
              xs: 6,
              sm: 4,
              md: 3
            }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              About
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {footerLinks.about.map((link) => (
                <Box component="li" key={link} sx={{ mb: 1.5 }}>
                  <Link href="#" color="inherit" underline="hover">
                    {link}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Info Links */}
          <Grid
            size={{
              xs: 6,
              sm: 4,
              md: 3
            }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Info
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {footerLinks.info.map((link) => (
                <Box component="li" key={link} sx={{ mb: 1.5 }}>
                  <Link href="#" color="inherit" underline="hover">
                    {link}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2025 Copyright Company Brand. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
