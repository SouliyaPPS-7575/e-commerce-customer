import {
  Close as CloseIcon,
  MenuRounded,
  PersonRounded,
  SearchRounded,
  ShoppingCartRounded,
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
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  alpha,
  styled,
  useMediaQuery,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import theme from '~/styles/theme';
import { navItems } from './navItems';

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

const Navbar = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Get cart items count using TanStack Query
  const { data: cartItemsCount } = useCartItems();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: 'white',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'black',
                textDecoration: 'none',
              }}
            >
              UNICITY
            </Typography>

            {/* Desktop navigation */}
            {!isMobile && (
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  flexGrow: 1,
                  justifyContent: 'center',
                }}
              >
                {navItems.map((item) => (
                  <Box
                    component={Link}
                    key={item.name}
                    sx={{
                      my: 2,
                      color: '#1976d2',
                      display: 'block',
                      mx: 2,
                      fontWeight: 500,
                      fontSize: '1rem',
                    }}
                    href={item.href}
                  >
                    {item.name}
                  </Box>
                ))}
              </Box>
            )}

            {/* Action icons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Search */}
              <IconButton color="inherit" onClick={toggleSearch}>
                <SearchRounded sx={{ color: '#0F5791' }} />
              </IconButton>

              {/* User account */}
              <IconButton color="inherit">
                <PersonRounded sx={{ color: '#0F5791' }} />
              </IconButton>

              {/* Shopping cart */}
              <IconButton color="inherit">
                <Badge badgeContent={cartItemsCount} color="primary">
                  <ShoppingCartRounded sx={{ color: '#0F5791' }} />
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
                <MenuRounded sx={{ color: '#0F5791' }} />
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
              {navItems.map((item) => (
                <ListItem key={item.name} component="a" href={item.href}>
                  <ListItemText primary={item.name} />
                </ListItem>
              ))}
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
              <SearchRounded sx={{ color: '#90caf9' }} />
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
