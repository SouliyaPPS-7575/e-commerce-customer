import {
  AccountCircle,
  Close as CloseIcon,
  Logout,
  MenuRounded,
  SearchRounded,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import Profile from '@mui/icons-material/Person'; // Adjust the import path if necessary
import {
  AppBar,
  Badge,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CurrencySelector from '~/components/CurrencySelector/CurrencySelector';
import LanguageSelection from '~/components/LanguageSelection';
import { SearchDialog } from '~/components/SearchDialog';
import { useCountCartItems } from '~/hooks/shop/useAddCart';
import { useAuthToken } from '~/hooks/useAuthToken';
import { type NavItem, navItems } from '~/layout/navItems';
import { NavbarProps } from '~/models/shop';
import { getToken } from '~/server/auth';
import { localStorageData } from '~/server/cache';
import theme from '~/styles/theme';

const Navbar = ({ currentPage, goToPage }: NavbarProps) => {
  const { t } = useTranslation();
  // Current Path URL
  const location = useRouterState({ select: (state) => state.location });
  const currentPath = location.pathname;
  // Do not render on login
  const shouldRender = !(
    currentPath === '/login' ||
    currentPath === '/signup' ||
    currentPath === '/forgot-password' ||
    currentPath.startsWith('/verify-email')
  );

  // ✅ Only render null AFTER hooks
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
    noSsr: true,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  // Get cart items count using TanStack Query
  const { countCartItems } = useCountCartItems();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const { token } = useAuthToken();

  const handleAccountClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      // Store the current target before async operation
      const currentTarget = e.currentTarget;

      // Check authentication
      const { token } = await getToken();
      const localToken = localStorageData('token').getLocalStrage();

      if (!token || token === '' || !localToken) {
        navigate({ to: '/login' });
      } else {
        // Important: use the stored reference, not e.currentTarget which might be null after async
        setAnchorEl(currentTarget);
      }
    } catch (error) {
      navigate({ to: '/login' });
    }
  };

  const adjustedPage = currentPath !== '/' ? 1 : currentPage;
  const isTransparent = adjustedPage === 1;

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          boxShadow: 'none',
          bgcolor: isTransparent ? 'rgba(255, 255, 255, 0.455)' : 'transparent',
          backdropFilter: isTransparent ? 'blur(10px)' : 'none',
          transition: 'background-color 0.3s ease',
          borderBottom: isTransparent
            ? '1px solid rgba(0, 0, 0, 0.05)'
            : 'none',
          zIndex: 1000,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ justifyContent: 'space-between', position: 'relative' }}
          >
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleMobileMenu}
              sx={{
                display: { xs: 'flex', md: 'none' },
              }}
            >
              <MenuRounded sx={{ color: isTransparent ? 'back' : 'white' }} />
            </IconButton>

            {/* Logo - Centered on Desktop */}
            <Box
              sx={{
                transform: 'translateX(-5%)',
                display: { xs: 'block', md: 'none' },
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontFamily: "'Canela Trial', serif",
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: isTransparent ? 'back' : 'white',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  goToPage?.(0);
                  navigate({ to: '/' });
                }}
              ></Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexGrow: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 2,
                  mr: -10,
                }}
              >
                {navItems.map((item: NavItem) => {
                  return (
                    <Typography
                      key={item.name}
                      onClick={() => {
                        navigate({
                          to: item.href,
                        });
                      }}
                      sx={{
                        cursor: 'pointer',
                        mx: 1,
                        color: isTransparent ? 'back' : 'white',
                        fontWeight:
                          currentPage === item.page ||
                          (currentPath !== '/' &&
                            currentPath.split('/')[1] ===
                              item.href?.split('/')[1])
                            ? 700
                            : 400,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width:
                            currentPage === item.page ||
                            (currentPath !== '/' &&
                              currentPath.split('/')[1] ===
                                item.href?.split('/')[1])
                              ? '100%'
                              : '0%',
                          height: '2px',
                          bottom: 0,
                          left: 0,
                          backgroundColor: 'primary.main',
                          transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                          width: '100%',
                        },
                      }}
                    >
                      {t(item.name)}
                    </Typography>
                  );
                })}
              </Box>
            )}

            {/* Logo - Centered on Desktop */}
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                display: { xs: 'none', md: 'block' },
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontFamily: "'Canela Trial', serif",
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: isTransparent ? 'back' : 'white',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  goToPage?.(0);
                  navigate({ to: '/' });
                }}
              >
                Lao Silk
              </Typography>
            </Box>

            {/* Action icons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Currency selector */}
              <CurrencySelector isTransparent={isTransparent} />

              {/* Search */}
              <IconButton
                color="inherit"
                onClick={toggleSearch}
                sx={{
                  mr: 0,
                }}
              >
                <SearchRounded
                  sx={{ color: isTransparent ? 'back' : 'white' }}
                />
              </IconButton>

              {/* Shopping cart */}
              {(!!localStorageData('token').getLocalStrage() ||
                !!localStorageData('customer_id').getLocalStrage()) && (
                <Link
                  to="/shop/add-cart"
                  style={{ textDecoration: 'none' }}
                  search={{ close: true }}
                >
                  <IconButton color="inherit">
                    <Badge
                      badgeContent={countCartItems}
                      color="primary"
                      sx={{
                        '& .MuiBadge-badge': {
                          color: '#ffffff',
                          fontSize: '1rem',
                          textAlign: 'center',
                          fontSizeAdjust: '0.5em',
                          fontSmooth: 'always',
                          background:
                            'linear-gradient(45deg,#f39c5ae2 10%, #ab6936 90%)',
                        },
                        ml: 1,
                      }}
                    >
                      <ShoppingCartOutlined
                        sx={{
                          color: isTransparent ? 'back' : 'white',
                        }}
                      />
                    </Badge>
                  </IconButton>
                </Link>
              )}

              {/* User account dropdown */}
              {!isMobile && (
                <Box sx={{ position: 'relative', ml: 1, mr: 0 }}>
                  <IconButton
                    color="inherit"
                    onClick={handleAccountClick}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <AccountCircle
                      sx={{ color: isTransparent ? 'back' : 'white' }}
                    />
                  </IconButton>
                  <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    MenuListProps={{
                      'aria-labelledby': 'account-button',
                    }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 180,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '& .MuiMenuItem-root': {
                          py: 1.5,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);
                        navigate({ to: '/profiles' });
                      }}
                      sx={{
                        color: '#4A5568',
                        '&:hover': {
                          backgroundColor: '#F7FAFC',
                        },
                      }}
                    >
                      <Profile sx={{ mr: 1, color: '#C98B6B' }} />
                      <Typography>{t('view_profile')}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);
                        navigate({ to: '/logout' });
                      }}
                      sx={{
                        color: '#4A5568',
                        '&:hover': {
                          backgroundColor: '#FEF2F2',
                        },
                      }}
                    >
                      <Logout sx={{ mr: 1, color: '#E53E3E' }} />
                      <Typography>{t('logout')}</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              )}

              {/* Language change */}
              <LanguageSelection />
            </Box>
          </Toolbar>
        </Container>

        {/* Mobile drawer menu */}
        <Drawer anchor="left" open={mobileMenuOpen} onClose={toggleMobileMenu}>
          <Box sx={{ width: 250 }} role="presentation">
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}
            >
              <Typography variant="h6">Menu</Typography>
              <IconButton onClick={toggleMobileMenu}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
            <List>
              {navItems.map((item) => {
                const isSelected =
                  currentPath === '/' && currentPage === item.page;
                const Icon = item.icon;
                return (
                  <MenuItem
                    key={item.name}
                    selected={
                      isSelected ||
                      (currentPath !== '/' &&
                        currentPath.split('/')[1] === item.href?.split('/')[1])
                    }
                    onClick={() => {
                      if (currentPath === '/') {
                        goToPage?.(item.page);
                      } else {
                        navigate({
                          to: item.href,
                        });
                      }
                      toggleMobileMenu();
                    }}
                  >
                    {Icon && (
                      <Icon
                        sx={{
                          fontSize: '1.25rem',
                          verticalAlign: 'middle',
                          mr: 1.5,
                        }}
                      />
                    )}
                    {t(item.name)}
                  </MenuItem>
                );
              })}

              {token && (
                <>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      navigate({
                        to: '/profiles',
                      });

                      toggleMobileMenu();
                    }}
                  >
                    <Profile sx={{ mr: 1, color: '#C98B6B' }} />
                    {t('profile')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      navigate({ to: '/logout' });
                      toggleMobileMenu();
                    }}
                  >
                    <Logout sx={{ mr: 1, color: '#E53E3E' }} />
                    {t('logout')}
                  </MenuItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </AppBar>

      {/* Search dialog */}
      <SearchDialog searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
    </>
  );
};

export default Navbar;
