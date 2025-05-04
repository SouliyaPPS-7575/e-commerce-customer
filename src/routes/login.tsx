import { createFileRoute, Link } from '@tanstack/react-router';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import theme from '~/styles/theme';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundImage:
          "url('https://i.ibb.co/DP9MrBH9/c5b8b40839de702f61d56f59461d7446a9d0f381.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
          backdropFilter: 'blur(4px)',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              fontWeight="bold"
              mb={4}
            >
              ເຂົ້າສູ່ລະບົບ
            </Typography>

            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                id="phone"
                label="Phone number"
                placeholder="Phone number"
                variant="outlined"
                margin="normal"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                variant="outlined"
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={<Checkbox id="remember" color="primary" />}
                label="Keep me logged in"
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mb: 2, height: 48 }}
              >
                Log in
              </Button>

              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Link
                  to={'/forgot-password'}
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                  }}
                >
                  Forgot password
                </Link>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary" mb={1}>
                Don&apos;t have an account?
              </Typography>
              <Link
                to={'/signup'}
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '1.1rem',
                }}
              >
                Sign up
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
