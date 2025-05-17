import {
  AccountCircle,
  Close as CloseIcon,
  Logout,
  MenuRounded,
  Search,
  SearchRounded,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import Profile from '@mui/icons-material/Person'; // Adjust the import path if necessary
import {
  AppBar,
  Badge,
  Box,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
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
import { useCountCartItems } from '~/hooks/shop/useAddCart';
import { useAuthToken } from '~/hooks/useAuthToken';
import { type NavItem, navItems } from '~/layout/navItems';
import { NavbarProps } from '~/models/shop';
import { getToken } from '~/server/auth';
import { SearchIconWrapper, StyledInputBase } from '~/styles/navbar';
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
  const { data: countCartItems } = useCountCartItems();

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

      if (!token || token === '') {
        navigate({ to: '/login' });
      } else {
        // Important: use the stored reference, not e.currentTarget which might be null after async
        setAnchorEl(currentTarget);
      }
    } catch (error) {
      navigate({ to: '/login' });
    }
  };

  const isTransparent = currentPage === 0;

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
          bgcolor: isTransparent ? 'transparent' : 'rgba(255, 255, 255, 0.455)',
          backdropFilter: isTransparent ? 'none' : 'blur(10px)',
          transition: 'background-color 0.3s ease',
          borderBottom: isTransparent
            ? 'none'
            : '1px solid rgba(0, 0, 0, 0.05)',
          zIndex: 1000,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: '1.5rem',
                color: isTransparent ? '#F5F0E6' : 'back',
                cursor: 'pointer',
              }}
              onClick={() => {
                goToPage?.(0);
                navigate({ to: '/' });
              }}
            >
              Laos
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                        if (currentPath === '/') {
                          goToPage?.(item.page);
                        } else {
                          navigate({
                            to: item.href,
                          });
                        }
                      }}
                      sx={{
                        cursor: 'pointer',
                        mx: 1,
                        color: isTransparent ? '#F5F0E6' : 'back',
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

            {/* Action icons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Search */}
              <IconButton
                color="inherit"
                onClick={toggleSearch}
                sx={{
                  mr: 1,
                }}
              >
                <SearchRounded
                  sx={{ color: isTransparent ? '#F5F0E6' : 'back' }}
                />
              </IconButton>
              {/* Currency selector */}
              <CurrencySelector isTransparent={isTransparent} />
              {/* User account dropdown */}
              {!isMobile && (
                <Box sx={{ position: 'relative', ml: 1, mr: -1 }}>
                  <IconButton
                    color="inherit"
                    onClick={handleAccountClick}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <AccountCircle
                      sx={{ color: isTransparent ? '#F5F0E6' : 'back' }}
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
                        navigate({ to: '/profile' });
                        setAnchorEl(null);
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
                        navigate({ to: '/logout' });
                        setAnchorEl(null);
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
              
              {/* Shopping cart */}
              {localStorage.getItem('token') ||
                (localStorage.getItem('customer_id') && (
                  <Link to="/shop/add-cart" style={{ textDecoration: 'none' }}>
                    <IconButton color="inherit">
                      <Badge
                        badgeContent={countCartItems}
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            color: '#ffffff',
                            fontSize: '1rem',
                          },
                          ml: 1,
                        }}
                      >
                        <ShoppingCartOutlined
                          sx={{ color: isTransparent ? '#F5F0E6' : 'back' }}
                        />
                      </Badge>
                    </IconButton>
                  </Link>
                ))}

              {/* Language change */}
              <LanguageSelection />
              {/* Mobile menu button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleMobileMenu}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  ml: '5px',
                  mr: '-7px',
                }}
              >
                <MenuRounded
                  sx={{ color: isTransparent ? '#F5F0E6' : 'back' }}
                />
              </IconButton>
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
                      navigate({ to: '/profile' });
                    }}
                  >
                    <Profile sx={{ mr: 1, color: '#C98B6B' }} />
                    {t('profile')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate({ to: '/logout' });
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
      <Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Search</DialogTitle>
        <DialogContent>
          <Search sx={{ width: '100%' }}>
            <SearchIconWrapper>
              <SearchRounded sx={{ color: 'text.primary' }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              id="outlined-search"
              type="search"
              autoFocus
              fullWidth
            />
          </Search>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
