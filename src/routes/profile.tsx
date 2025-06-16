import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import {
  createFileRoute,
  redirect
} from '@tanstack/react-router';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AddressForm } from '~/containers/profile/address-form';

import 'react-phone-input-2/lib/material.css';
import { getMeQueryOption, useGetMe } from '~/hooks/profile/useGetMe';
import { orderHistoryQueryOption } from '~/hooks/profile/useOrderHistory';
import { EditProfileForm } from '~/models/profile';
import { getToken } from '~/server/auth';
import { editProfile } from '~/server/profile';
import { queryClient } from '~/services/queryClient';
import '~/styles/phone-input-styles.css';

export const Route = createFileRoute('/profile')({
  beforeLoad: async () => {
    const { token } = await getToken();
    if (!token) {
      return redirect({
        to: '/login',
      });
    }
  },
  loader: ({ context, location }) => {
    const searchParams = new URLSearchParams(location.search);
    const page = Number(searchParams.get('page'));
    const limit = Number(searchParams.get('limit'));

    const me = context.queryClient.ensureQueryData(getMeQueryOption());
    const orderHistory = context.queryClient.ensureQueryData(
      orderHistoryQueryOption({
        page,
        limit,
      }),
    );
    return { me, orderHistory };
  },
  component: ProfilePage,
});

function ProfilePage() {
  const theme = useTheme();
  // const navigate = useNavigate();
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Lazy load PhoneInput component
  // This is done to avoid loading the component on the server side
  const [PhoneInput, setPhoneInput] = useState<
    (typeof import('react-phone-input-2'))['default'] | null
  >(null);

  useEffect(() => {
    import('react-phone-input-2').then((module) => {
      setPhoneInput(() => module.default);
    });
  }, []);

  const { me } = useGetMe();

  // Obtain search parameters from the router
  // const searchParams = useSearch<any>({ from: '/profile' });

  // // Get active section from search params
  // const activeSection = searchParams.section || 'account';

  // // Create pagination object from search params
  // const pagination: PaginationAPI = {
  //   page: Number(searchParams.page) || 1,
  //   limit: Number(searchParams.limit) || 10,
  // };

  // // Function to handle section change
  // const handleSectionChange = (section: string) => {
  //   navigate({
  //     to: '/profile',
  //     search: {
  //       ...searchParams,
  //       section,
  //       // Reset pagination when changing sections
  //       page: section === 'orders' ? searchParams.page || 1 : undefined,
  //       limit: section === 'orders' ? searchParams.limit || 10 : undefined,
  //     },
  //   });
  // };

  // // Function to update pagination in URL
  // const handlePageChange = (page: number) => {
  //   navigate({
  //     to: '/profile',
  //     search: {
  //       ...searchParams,
  //       page,
  //     },
  //   });
  // };

  const onEditToggle = () => {
    setIsEditingAccount(!isEditingAccount);
  };

  // AccountDetailsForm

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: editProfileMutate } = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(getMeQueryOption());
      toast.success(t('successfully'));
      onEditToggle();
    },
  });

  const form = useForm({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingAccount) {
      form.handleSubmit();
    } else {
      onEditToggle();
    }
  };

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
          {/* <Grid size={{ xs: 12, md: 3 }}>
            <ProfileSidebar
              user={me}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </Grid> */}

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 9 }} sx={{ p: 1, mt: -2 }}>
            {/* {activeSection === 'account' && ( */}
            <>
              <Box sx={{ p: 0, mt: 0 }}>
                <form onSubmit={handleSubmit}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {t('account_details')}
                  </Typography>

                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    {/* Name */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {t('full_name')}
                      </Typography>
                      <form.Field name="name">
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
                      </form.Field>
                    </Grid>

                    {/* Phone number */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {t('phone_number')}
                      </Typography>
                      <form.Field name="phone_number">
                        {(field) => (
                          <Box
                            className="phone-field-container"
                            sx={{ minHeight: '56px' }}
                          >
                            {PhoneInput && (
                              <PhoneInput
                                disabled={!isEditingAccount}
                                country="la"
                                enableAreaCodes
                                autocompleteSearch
                                enableSearch
                                value={field.state.value ?? ''}
                                onChange={(val: string) => {
                                  const formatted = val.startsWith('+')
                                    ? val
                                    : '+' + val;
                                  field.handleChange(formatted);
                                }}
                                inputProps={{
                                  name: 'phone',
                                  required: true,
                                  autoFocus: true,
                                }}
                                containerStyle={{ width: '100%' }}
                                inputStyle={{ width: '100%' }}
                              />
                            )}
                          </Box>
                        )}
                      </form.Field>
                    </Grid>

                    {/* Old Password */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {t('old_password')}
                      </Typography>
                      <form.Field
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
                                    onClick={() =>
                                      setShowOldPassword(!showOldPassword)
                                    }
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
                      </form.Field>
                    </Grid>

                    {/* Password */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {t('password')}
                      </Typography>
                      <form.Field
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
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
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
                      </form.Field>
                    </Grid>

                    {/* Confirm Password */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {t('confirm_password')}
                      </Typography>
                      <form.Field
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
                                    onClick={() =>
                                      setShowConfirmPassword(
                                        !showConfirmPassword,
                                      )
                                    }
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
                      </form.Field>
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    variant="contained"
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
              </Box>

              <Divider sx={{ my: 3, mt: 4 }} />

              <AddressForm
                isEditing={isEditingAddress}
                onEditToggle={() => setIsEditingAddress(!isEditingAddress)}
              />
            </>
            {/* )} */}

            {/* {activeSection === 'orders' && (
              <OrderHistory
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )} */}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProfilePage;
