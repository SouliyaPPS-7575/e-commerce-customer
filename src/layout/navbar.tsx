import {
  AccountCircle,
  Close as CloseIcon,
  MenuRounded,
  SearchRounded,
  ShoppingCartOutlined,
} from '@mui/icons-material';
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
  InputBase,
  List,
  MenuItem,
  Toolbar,
  Typography,
  alpha,
  styled,
  useMediaQuery,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { NavItem, navItems } from '~/layout/navItems';
import theme from '~/styles/theme';

// Styled search component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  display: 'flex',
  alignItems: 'center',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

// Mock data fetching with TanStack Query
const useCartItems = () => {
  return useQuery({
    queryKey: ['cartItems'],
    queryFn: async () => {
      // Simulate API call
      return Promise.resolve(3);
    },
    initialData: 0,
  });
};

interface NavbarProps {
  currentPage?: number;
  goToPage?: (page: number) => void;
}

const Navbar = ({ currentPage, goToPage }: NavbarProps) => {
  // Current Path URL
  const location = useRouterState({ select: (state) => state.location });
  const currentPath = location.pathname;
  // Do not render on login
  if (
    currentPath === '/login' ||
    currentPath === '/signup' ||
    currentPath === '/forgot-password'
  )
    return null;

  // ✅ Only render null AFTER hooks
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();

  // Get cart items count using TanStack Query
  const { data: cartItemsCount } = useCartItems();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const isTransparent = currentPage === 0;

  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          boxShadow: 'none',
          bgcolor: isTransparent ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
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
              Laos Fabric
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {navItems.map((item: NavItem) => (
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
                      fontWeight: currentPage === item.page ? 700 : 400,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: currentPage === item.page ? '100%' : '0%',
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
                    {item.name}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Action icons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Search */}
              <IconButton color="inherit" onClick={toggleSearch}>
                <SearchRounded
                  sx={{ color: isTransparent ? '#F5F0E6' : 'back' }}
                />
              </IconButton>

              {/* User account */}
              <IconButton color="inherit">
                <AccountCircle
                  sx={{ color: isTransparent ? '#F5F0E6' : 'back' }}
                />
              </IconButton>
              {/* Shopping cart */}
              <IconButton color="inherit">
                <Badge
                  badgeContent={cartItemsCount}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      color: '#ffffff',
                      fontSize: '1rem',
                    },
                  }}
                >
                  <ShoppingCartOutlined
                    sx={{ color: isTransparent ? '#F5F0E6' : 'back' }}
                  />
                </Badge>
              </IconButton>
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
                return (
                  <MenuItem
                    key={item.name}
                    selected={isSelected}
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
                    {item.name}
                  </MenuItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      </AppBar>
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
