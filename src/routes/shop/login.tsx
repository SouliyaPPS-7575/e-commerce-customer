import { Visibility, VisibilityOff } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelection from '~/components/LanguageSelection';
import { useLogin } from '~/hooks/auth/useLogin';
import theme from '~/styles/theme';

export const Route = createFileRoute('/shop/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const { form } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(true);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
    history.back();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Box sx={{ position: 'absolute', top: 10, left: 1, zIndex: 2 }}>
          <LanguageSelection />
        </Box>

        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            color: 'grey.600',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Card sx={{ borderRadius: 3, boxShadow: 'none' }}>
          <CardContent>
            <Typography
              variant="h5"
              component="h1"
              align="center"
              fontWeight="bold"
              mb={4}
            >
              {t('login_to_your_account')}
            </Typography>

            <form
              id="login-form"
              onDragEnter={(e) => e.preventDefault()}
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              {/* Email Field */}
              <form.Field
                name="identity"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Email is required';
                    if (!/\S+@\S+\.\S+/.test(value))
                      return 'Invalid email address';
                  },
                }}
              >
                {(field) => (
                  <TextField
                    required
                    id={field.name}
                    name={field.name}
                    label={t('email')}
                    fullWidth
                    type="email"
                    margin="normal"
                    variant="outlined"
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={20} />
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                )}
              </form.Field>

              {/* Password Field */}
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) =>
                    !value || value.length < 6
                      ? 'Password must be at least 6 characters'
                      : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    required
                    autoComplete="new-password"
                    id={field.name}
                    name={field.name}
                    label={t('password')}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={20} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                            sx={{
                              color: showPassword ? 'primary.main' : 'grey.500',
                            }}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                )}
              </form.Field>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  mt: 2,
                }}
              >
                {t('login')}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mb: 2, mt: 1 }}>
              <Link
                to={'/forgot-password'}
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                }}
              >
                {t('forgot_password')}
              </Link>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary" mb={1}>
                {t('do_not_have_account')}
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
                {t('sign_up')}
              </Link>
            </Box>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
