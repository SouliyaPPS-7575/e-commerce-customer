import {
  History,
  Logout,
  Person,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import ClientOnlyPhoneInput from '~/components/ClientOnlyPhoneInput';
import { useAddress } from '~/hooks/profile/useAddress';
import { getMeQueryOption, useGetMe } from '~/hooks/profile/useGetMe';
import { EditProfileForm } from '~/models/profile';
import { getToken } from '~/server/auth';
import { editProfile, uploadAvatar } from '~/server/profile';
import { queryClient } from '~/services/queryClient';
import { viewAvatar } from '~/utils/format';

export const Route = createFileRoute('/profile')({
  beforeLoad: async () => {
    const { token } = await getToken();
    if (!token) {
      return redirect({
        to: '/login',
      });
    }
  },
  loader: ({ context }) => {
    const me = context.queryClient.ensureQueryData(getMeQueryOption());
    return { me };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const theme = useTheme();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState('account');
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const { me } = useGetMe();

  const { mutate: editProfileMutate } = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(getMeQueryOption());
      toast.success(t('successfully'));
    },
  });

  const formEditProfile = useForm({
    defaultValues: {
      username: me?.username || '',
      name: me?.name || '',
      phone_number: me?.phone_number || '',
      oldPassword: '',
      password: '',
      passwordConfirm: '',
    } as EditProfileForm,
    onSubmit: async ({ value }) => {
      const {
        username,
        name,
        phone_number,
        oldPassword,
        password,
        passwordConfirm,
      } = value;

      const hasProfileChanged =
        username !== me?.username ||
        name !== me?.name ||
        phone_number !== me?.phone_number;

      const hasPasswordChanged = oldPassword || password || passwordConfirm;

      if (!hasProfileChanged && !hasPasswordChanged) {
        return;
      }

      const dataToSend: Partial<EditProfileForm> = {};

      if (hasProfileChanged) {
        dataToSend.username = username;
        dataToSend.name = name;
        dataToSend.phone_number = phone_number;
      }

      if (oldPassword) dataToSend.oldPassword = oldPassword;
      if (password) dataToSend.password = password;
      if (passwordConfirm) dataToSend.passwordConfirm = passwordConfirm;

      editProfileMutate({
        data: dataToSend,
      });
    },
  });

  const handleToggleOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadAvatarMutate } = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries(getMeQueryOption());
      toast.success(t('successfully'));
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !me?.id) return;

    const formData = new FormData();
    formData.append('avatar', file);

    // Option 1: Send file directly
    uploadAvatarMutate({
      data: formData,
    });
  };

  const { formAddress, provinces, districts } = useAddress();

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        py: 10,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Sidebar */}
          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Paper
              elevation={1}
              sx={{ p: 3, borderRadius: 2, backgroundColor: 'white' }}
            >
              {/* Profile Section */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                {/* Upload Avatar */}
                <Box
                  sx={{ position: 'relative', width: 120, mx: 'auto', mb: 2 }}
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: '#c4c4c4',
                    }}
                    src={viewAvatar(me?.avatar)}
                    alt={me?.name}
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'white',
                      border: '1px solid #ccc',
                      '&:hover': { bgcolor: '#f0f0f0' },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                </Box>

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {me?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {me?.email}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Navigation Menu */}
              <List sx={{ p: 0 }}>
                <ListItem
                  onClick={() => setActiveSection('account')}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 1,
                    mb: 1,

                    '& .MuiListItemIcon-root': {
                      color:
                        activeSection === 'account' ? '#d4af37' : 'inherit',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      color:
                        activeSection === 'account' ? '#d4af37' : 'inherit',
                    }}
                    primary={t('account_details')}
                  />
                </ListItem>

                <ListItem
                  onClick={() => setActiveSection('orders')}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 1,
                    mb: 1,
                    '& .MuiListItemIcon-root': {
                      color: activeSection === 'orders' ? '#d4af37' : 'inherit',
                    },
                  }}
                >
                  <ListItemIcon>
                    <History />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      color: activeSection === 'orders' ? '#d4af37' : 'inherit',
                    }}
                    primary="Order History"
                  />
                </ListItem>

                <Link to="/logout">
                  <ListItem
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 1,
                      color: 'text.secondary',
                    }}
                  >
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Log out" />
                  </ListItem>
                </Link>
              </List>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid
            size={{
              xs: 12,
              md: 9,
            }}
            sx={{ p: 1, mt: -2 }}
          >
            {activeSection === 'account' && (
              <>
                {/* Edit Profile Form */}
                <form
                  id="edit-profile-form"
                  onDragEnter={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  onDragOver={(e) => e.preventDefault()}
                  onSubmit={(e) => {
                    e.preventDefault();
                    formEditProfile.handleSubmit();
                  }}
                >
                  {/* Account Details Section */}
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {t('account_details')}
                  </Typography>

                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    {/* Name */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {t('full_name')}
                      </Typography>
                      <formEditProfile.Field name="name">
                        {(field) => (
                          <TextField
                            fullWidth
                            value={field.state.value ?? ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            variant="outlined"
                            size="medium"
                            disabled={!isEditingAccount}
                          />
                        )}
                      </formEditProfile.Field>
                    </Grid>

                    {/* Phone number */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {t('phone_number')}
                      </Typography>

                      <formEditProfile.Field name="phone_number">
                        {(field) => (
                          <ClientOnlyPhoneInput
                            value={field.state.value ?? ''}
                            onChange={(phone: string) =>
                              field.handleChange(phone)
                            }
                            placeholder={t('phone_number')}
                            disabled={!isEditingAccount}
                          />
                        )}
                      </formEditProfile.Field>
                    </Grid>

                    {/* Old Password */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {t('old_password')}
                      </Typography>
                      <formEditProfile.Field
                        name="oldPassword"
                        validators={{
                          onChange: ({ value }) =>
                            value && value.length < 8
                              ? 'Password must be at least 8 characters'
                              : undefined,
                        }}
                      >
                        {(field) => (
                          <TextField
                            fullWidth
                            type={showOldPassword ? 'text' : 'password'}
                            value={field.state.value ?? ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            variant="outlined"
                            size="medium"
                            disabled={!isEditingAccount}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={handleToggleOldPassword}
                                    edge="end"
                                    size="small"
                                    disabled={!isEditingAccount}
                                  >
                                    {showOldPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      </formEditProfile.Field>
                    </Grid>

                    {/* Password */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {t('password')}
                      </Typography>
                      <formEditProfile.Field
                        name="password"
                        validators={{
                          onChange: ({ value }) =>
                            value && value.length < 8
                              ? 'Password must be at least 8 characters'
                              : undefined,
                        }}
                      >
                        {(field) => (
                          <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            value={field.state.value ?? ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            variant="outlined"
                            size="medium"
                            disabled={!isEditingAccount}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={handleTogglePassword}
                                    edge="end"
                                    size="small"
                                    disabled={!isEditingAccount}
                                  >
                                    {showPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      </formEditProfile.Field>
                    </Grid>

                    {/* Confirm Password */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {t('confirm_password')}
                      </Typography>
                      <formEditProfile.Field
                        name="passwordConfirm"
                        validators={{
                          onChange: ({ value }) =>
                            value && value.length < 8
                              ? 'Password must be at least 8 characters'
                              : undefined,
                        }}
                      >
                        {(field) => (
                          <TextField
                            fullWidth
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={field.state.value ?? ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            variant="outlined"
                            size="medium"
                            disabled={!isEditingAccount}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={handleToggleConfirmPassword}
                                    edge="end"
                                    size="small"
                                    disabled={!isEditingAccount}
                                  >
                                    {showConfirmPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      </formEditProfile.Field>
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    onClick={() => {
                      if (isEditingAccount) {
                        formEditProfile.handleSubmit();
                      }
                      setIsEditingAccount(!isEditingAccount);
                    }}
                    sx={{
                      mt: 3,
                      color: 'white',
                      px: 3,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontSize: '16px',
                      '&:hover': {
                        bgcolor: '#c4b590',
                      },
                    }}
                  >
                    {isEditingAccount ? 'Save' : 'Edit Profile'}
                  </Button>
                </form>

                {/* Divider */}
                <Divider sx={{ my: 3, mt: 4 }} />

                {/* Shipping Address Section */}
                <form
                  id="formAddress"
                  onDragEnter={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  onDragOver={(e) => e.preventDefault()}
                  onSubmit={(e) => {
                    e.preventDefault();
                    formAddress.handleSubmit();
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {t('shipping_address')}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t('shipping_info')}
                  </Typography>

                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    {/* Province ID */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <formAddress.Field
                        name="province_id"
                        children={(field) => (
                          <Autocomplete
                            sx={{ mt: 1, zIndex: 1 }}
                            size="medium"
                            fullWidth
                            disabled={!isEditingAddress}
                            options={provinces}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            }
                            value={
                              provinces.find(
                                (province) => province.id === field.state.value,
                              ) || null
                            }
                            onChange={(_, newValue) => {
                              field.handleChange(newValue ? newValue.id : '');
                              // Clear district when province changes
                              formAddress.setFieldValue('district_id', '');
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                disabled={!isEditingAddress}
                                label="Province"
                                size="medium"
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>

                    {/* District ID */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <formAddress.Field
                        name="district_id"
                        children={(field) => (
                          <Autocomplete
                            sx={{ mt: 1, zIndex: 1 }}
                            size="medium"
                            fullWidth
                            disabled={
                              !formAddress.state.values.province_id ||
                              !isEditingAddress
                            }
                            options={districts}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            }
                            value={
                              districts.find(
                                (district) => district.id === field.state.value,
                              ) || null
                            }
                            onChange={(_, newValue) =>
                              field.handleChange(newValue ? newValue.id : '')
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="District"
                                size="medium"
                                disabled={!isEditingAddress}
                                placeholder={
                                  !formAddress.state.values.province_id
                                    ? 'Please select a province first'
                                    : 'Select district'
                                }
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>

                    {/* Village */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <formAddress.Field
                        name="village"
                        children={(field) => (
                          <TextField
                            fullWidth
                            label="Village"
                            variant="outlined"
                            disabled={!isEditingAddress}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            size="medium"
                            margin="dense"
                          />
                        )}
                      />
                    </Grid>

                    {/* Shipping Name */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <formAddress.Field
                        name="shipping_name"
                        children={(field) => (
                          <TextField
                            fullWidth
                            label="Shipping Name"
                            variant="outlined"
                            disabled={!isEditingAddress}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            size="medium"
                            margin="dense"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    type="submit"
                    onClick={() => {
                      if (isEditingAddress) {
                        formEditProfile.handleSubmit();
                      }
                      setIsEditingAddress(!isEditingAddress);
                    }}
                    sx={{
                      mt: 3,
                      color: 'white',
                      px: 3,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontSize: '16px',
                      '&:hover': {
                        bgcolor: '#c4b590',
                      },
                    }}
                  >
                    {isEditingAddress ? 'Save Address' : 'Edit Address'}
                  </Button>
                </form>
              </>
            )}

            {activeSection === 'orders' && (
              <Box sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {t('order_history')}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  {t('no_orders_found')}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
