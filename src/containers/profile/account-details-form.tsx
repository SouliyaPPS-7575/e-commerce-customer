import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { toast } from 'sonner';
import { getMeQueryOption } from '~/hooks/profile/useGetMe';
import type { EditProfileForm } from '~/models/profile';
import { editProfile } from '~/server/profile';
import { queryClient } from '~/services/queryClient';
import '~/styles/phone-input-styles.css';
interface AccountDetailsFormProps {
  user: {
    username?: string;
    name?: string;
    phone_number?: string;
  } | null;
  isEditing: boolean;
  onEditToggle: () => void;
}

export function AccountDetailsForm({
  user,
  isEditing,
  onEditToggle,
}: AccountDetailsFormProps) {
  const { t } = useTranslation();
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
      username: user?.username || '',
      name: user?.name || '',
      phone_number: user?.phone_number || '',
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
        username !== user?.username ||
        name !== user?.name ||
        phone_number !== user?.phone_number;

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
    if (isEditing) {
      form.handleSubmit();
    } else {
      onEditToggle();
    }
  };

  const [PhoneInput, setPhoneInput] =
    useState<React.FC<PhoneInputProps> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-phone-input-2').then((module) => {
        setPhoneInput(() => module.default);
      });
    }
  }, []);

  return (
    <Box sx={{ p: 0, mt: 0 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t('account_details')}
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
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
                  disabled={!isEditing}
                />
              )}
            </form.Field>
          </Grid>

          {/* Phone number */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('phone_number')}
            </Typography>
            <form.Field name="phone_number">
              {(field) => (
                <Box className="phone-field-container">
                  {PhoneInput && (
                    <PhoneInput
                      country={'la'}
                      enableAreaCodes
                      autocompleteSearch
                      enableSearch
                      placeholder={t('phone_number')}
                      searchPlaceholder={t('phone_number')}
                      value={field.state.value ?? ''}
                      onChange={(val: string) => {
                        const formatted = val.startsWith('+') ? val : '+' + val;
                        field.handleChange(formatted);
                      }}
                    />
                  )}
                </Box>
              )}
            </form.Field>
          </Grid>

          {/* Old Password */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
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
                  disabled={!isEditing}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          edge="end"
                          size="small"
                          disabled={!isEditing}
                        >
                          {showOldPassword ? <VisibilityOff /> : <Visibility />}
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
            <Typography variant="body2" color="text.secondary" gutterBottom>
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
                  disabled={!isEditing}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          disabled={!isEditing}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
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
            <Typography variant="body2" color="text.secondary" gutterBottom>
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
                  disabled={!isEditing}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          size="small"
                          disabled={!isEditing}
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
          {isEditing ? 'Save' : 'Edit Profile'}
        </Button>
      </form>
    </Box>
  );
}
