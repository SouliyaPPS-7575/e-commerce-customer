import { Email, YouTube } from '@mui/icons-material';
import { Box, Container, Grid, IconButton, Typography } from '@mui/material';
import { Link, useRouterState } from '@tanstack/react-router';
import { Facebook } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  // Current Path URL
  const location = useRouterState({ select: (state) => state.location });
  const currentPath = location.pathname;

  return (
    <>
      {/* Green top border */}
      <Box
        sx={{ bgcolor: '#E8D9B1', height: '100px', width: '100%', zIndex: 1 }}
      />
      {/* Main content with white background */}
      <Box sx={{ bgcolor: 'white', color: '#333', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          {/* Main footer content */}
          <Grid
            container
            spacing={{ xs: 3, md: 4 }}
            sx={{
              justifyContent: 'flex-end',
              textAlign: 'center',
              mb: { xs: 3, md: 4 },
            }}
          >
            {/* Logo & Description Column */}
            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#2c3e50',
                  letterSpacing: '-0.5px',
                }}
              >
                Your Brand
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#6c757d',
                  lineHeight: 1.7,
                  mb: 3,
                  maxWidth: '280px',
                }}
              >
                Creating exceptional experiences through innovative design and
                quality craftsmanship.
              </Typography>
              {/* Social Media Icons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: '#3b5998',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#2d4373',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 8px rgba(59, 89, 152, 0.3)',
                  }}
                >
                  <Facebook size={20} />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: '#ff0000',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#cc0000',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 8px rgba(255, 0, 0, 0.3)',
                  }}
                >
                  <YouTube />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: '#ea4335',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#d33b2c',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 8px rgba(234, 67, 53, 0.3)',
                  }}
                >
                  <Email />
                </IconButton>
              </Box>
            </Grid>

            {/* Contact Information Column */}
            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2.5,
                  color: '#2c3e50',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px',
                    height: '3px',
                    bgcolor: '#E8D9B1',
                    borderRadius: '2px',
                  },
                }}
              >
                {t('contact')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#495057',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 500,
                  }}
                >
                  📞 +856 20 55 512 935
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#495057',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 500,
                  }}
                >
                  ✉️ example@gmail.com
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#495057',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 500,
                  }}
                >
                  💬 Live Chat
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#495057',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 500,
                  }}
                >
                  📍 Village, District, Province
                </Typography>
              </Box>
            </Grid>

            {/* Navigation Links Column */}
            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2.5,
                  color: '#2c3e50',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px',
                    height: '3px',
                    bgcolor: '#E8D9B1',
                    borderRadius: '2px',
                  },
                }}
              >
                {t('navigation')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Link to="/" className={currentPath === '/' ? 'active' : ''}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: currentPath === '/' ? '#E8D9B1' : '#495057',
                      cursor: 'pointer',
                      fontWeight: currentPath === '/' ? 600 : 500,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#E8D9B1',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    {t('home')}
                  </Typography>
                </Link>
                <Link
                  to="/shop/index/$category_id"
                  params={{ category_id: 'all' }}
                  className={currentPath === '/shop' ? 'active' : ''}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: currentPath.startsWith('/shop')
                        ? '#E8D9B1'
                        : '#495057',
                      cursor: 'pointer',
                      fontWeight: currentPath.startsWith('/shop') ? 600 : 500,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#E8D9B1',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    {t('shop')}
                  </Typography>
                </Link>
                <Link
                  to="/blog"
                  className={currentPath === '/blog' ? 'active' : ''}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: currentPath.startsWith('/blog')
                        ? '#E8D9B1'
                        : '#495057',
                      cursor: 'pointer',
                      fontWeight: currentPath.startsWith('/blog') ? 600 : 500,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#E8D9B1',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    {t('journal')}
                  </Typography>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Green bottom border with copyright */}
      <Box sx={{ bgcolor: '#E8D9B1', py: 3 }}>
        <Typography
          variant="body2"
          sx={{ color: '#000', opacity: 0.9, textAlign: 'center' }}
        >
          © 2025 Your Brand. All rights reserved. Made with ❤️
        </Typography>
      </Box>
    </>
  );
}

export default Footer;
