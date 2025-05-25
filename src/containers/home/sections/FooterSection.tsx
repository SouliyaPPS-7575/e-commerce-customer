import { Facebook, Twitter, YouTube, Instagram } from '@mui/icons-material';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

// Footer navigation links
const footerLinks = {
  shop: ["Our company", "Leadership", "Our story", "Opportunity"],
  about: ["All products", "Feel Great", "Unimate"],
  info: ["Contact", "Events", "Blog", "Press", "Careers"],
}

export default function FooterSection() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh', // Make footer take full page height
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top green section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        sx={{
          width: '100%',
          backgroundColor: '#E8D9B1', // Olive green color from the image
          height: { xs: '100px', sm: '150px' }, // Responsive height
          flexGrow: 1, // Take available space
        }}
      />
      {/* White middle section with links */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          width: '100%',
          backgroundColor: 'white',
          color: 'black',
          py: { xs: 4, sm: 6 }, // Responsive padding
          px: { xs: 2, sm: 3, md: 4 }, // Responsive horizontal padding
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={{ xs: 3, sm: 4 }}
            justifyContent="space-between"
          >
            {/* Social Media */}
            <Grid
              size={{
                xs: 12,
                md: 3,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 4,
                    justifyContent: { xs: 'center', md: 'flex-start' }, // Center on mobile, left on desktop
                  }}
                >
                  <IconButton sx={{ color: '#D4AF37' }}>
                    <Facebook />
                  </IconButton>
                  <IconButton sx={{ color: '#D4AF37' }}>
                    <Twitter />
                  </IconButton>
                  <IconButton sx={{ color: '#D4AF37' }}>
                    <YouTube />
                  </IconButton>
                  <IconButton sx={{ color: '#D4AF37' }}>
                    <Instagram />
                  </IconButton>
                </Box>
              </motion.div>
            </Grid>

            {/* Shop Links */}
            <Grid
              size={{
                xs: 6,
                sm: 4,
                md: 3,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant={isMobile ? 'subtitle1' : 'h6'}
                  sx={{
                    mb: { xs: 2, sm: 3 },
                    fontWeight: 'bold',
                    textAlign: { xs: 'center', sm: 'left' }, // Center on mobile
                  }}
                >
                  Shop
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'none',
                    p: 0,
                    m: 0,
                    textAlign: { xs: 'center', sm: 'left' }, // Center on mobile
                  }}
                >
                  {footerLinks.shop.map((link) => (
                    <Box component="li" key={link} sx={{ mb: 1.5 }}>
                      <Link
                        href="#"
                        color="inherit"
                        underline="hover"
                        sx={{
                          fontSize: { xs: '0.9rem', sm: 'inherit' }, // Smaller font on mobile
                        }}
                      >
                        {link}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* About Links */}
            <Grid
              size={{
                xs: 6,
                sm: 4,
                md: 3,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant={isMobile ? 'subtitle1' : 'h6'}
                  sx={{
                    mb: { xs: 2, sm: 3 },
                    fontWeight: 'bold',
                    textAlign: { xs: 'center', sm: 'left' }, // Center on mobile
                  }}
                >
                  About
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'none',
                    p: 0,
                    m: 0,
                    textAlign: { xs: 'center', sm: 'left' }, // Center on mobile
                  }}
                >
                  {footerLinks.about.map((link) => (
                    <Box component="li" key={link} sx={{ mb: 1.5 }}>
                      <Link
                        href="#"
                        color="inherit"
                        underline="hover"
                        sx={{
                          fontSize: { xs: '0.9rem', sm: 'inherit' }, // Smaller font on mobile
                        }}
                      >
                        {link}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Info Links */}
            <Grid
              size={{
                xs: 12,
                sm: 4,
                md: 3,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant={isMobile ? 'subtitle1' : 'h6'}
                  sx={{
                    mb: { xs: 2, sm: 3 },
                    fontWeight: 'bold',
                    textAlign: { xs: 'center', sm: 'left' }, // Center on mobile
                    mt: { xs: 3, sm: 0 }, // Add margin top on mobile
                  }}
                >
                  Info
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'none',
                    p: 0,
                    m: 0,
                    textAlign: { xs: 'center', sm: 'left' }, // Center on mobile
                    display: { xs: 'flex', sm: 'block' }, // Horizontal on mobile
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  {footerLinks.info.map((link) => (
                    <Box
                      component="li"
                      key={link}
                      sx={{
                        mb: 1.5,
                        mx: { xs: 1, sm: 0 }, // Add horizontal margin on mobile
                      }}
                    >
                      <Link
                        href="#"
                        color="inherit"
                        underline="hover"
                        sx={{
                          fontSize: { xs: '0.9rem', sm: 'inherit' }, // Smaller font on mobile
                        }}
                      >
                        {link}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Bottom green section with copyright */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        sx={{
          width: '100%',
          backgroundColor: '#E8D9B1', // Olive green color from the image
          color: 'white',
          py: { xs: 2, sm: 3 }, // Responsive padding
          flexGrow: 1, // Take available space
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: '#000',
                opacity: 0.9,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Smaller font on mobile
              }}
            >
              © 2025 Copyright Company Brand. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
