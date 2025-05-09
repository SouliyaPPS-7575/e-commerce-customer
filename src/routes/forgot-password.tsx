import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Phone } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import LanguageSelection from '~/components/LanguageSelection';

export const Route = createFileRoute('/forgot-password')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const [step, setStep] = useState<'phone_number' | 'otp' | 'newPassword'>(
    'phone_number',
  );
  const [phone, setPhone] = useState('');
  const [_otpSent, setOtpSent] = useState(false);

  const handleSendOTP = () => {
    setOtpSent(true);
  };

  const phoneNumberForm = useForm({
    defaultValues: {
      phone_number: '',
    },
    onSubmit: async ({ value }) => {
      console.log('phone submitted:', value);
      setPhone(value.phone_number);
      setStep('otp');
      // Add your API call to send OTP here
    },
  });

  const otpForm = useForm({
    defaultValues: {
      otp: '',
    },
    onSubmit: async ({ value }) => {
      console.log('OTP submitted:', value);
      setStep('newPassword');
      // Add your API call to verify OTP here
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      console.log('New password submitted:', value);
      // Add your API call to reset password here
      // Redirect to login page after successful password reset
      window.location.href = '/login';
    },
  });
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
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
        <LanguageSelection />
      </Box>
      <br />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Card
          sx={{
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              component="h1"
              align="center"
              fontWeight="bold"
              color="primary"
              sx={{ mb: 2 }}
            >
              {step === 'phone_number' && t('forgot_password')}
              {step === 'otp' && t('verify_otp')}
              {step === 'newPassword' && t('set_new_password')}
            </Typography>

            {step === 'phone_number' && (
              <>
                <Typography variant="body1" sx={{ mb: 1, textAlign: 'center' }}>
                  {t('please_enter_your_phone_number_to_receive_otp')}
                </Typography>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    phoneNumberForm.handleSubmit();
                  }}
                >
                  <phoneNumberForm.Field
                    name="phone_number"
                    validators={{
                      onChange: z
                        .string()
                        .min(1, t('please_enter_your_phone_number')),
                    }}
                  >
                    {(field) => (
                      <TextField
                        id={field.name}
                        name={field.name}
                        fullWidth
                        label={t('phone_number')}
                        placeholder={t('phone_number')}
                        margin="normal"
                        required
                        value={field.state.value ?? ''}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={!!field.state.meta.errors}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone size={20} /> &nbsp; 856
                            </InputAdornment>
                          ),
                        }}
                        helperText={!field.state.meta.errors}
                      />
                    )}
                  </phoneNumberForm.Field>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      bgcolor: '#64b5f6',
                      '&:hover': {
                        bgcolor: '#42a5f5',
                      },
                      borderRadius: 1,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    {t('send_otp')}
                  </Button>
                </form>
              </>
            )}

            {step === 'otp' && (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  ລະຫັດ OTP ໄດ້ຖືກສົ່ງໄປຫາ {phone}
                </Typography>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    otpForm.handleSubmit();
                  }}
                >
                  <Box sx={{ position: 'relative', mt: 0, mb: 2 }}>
                    <otpForm.Field
                      name="otp"
                      validators={{
                        onChange: z.string().min(4, 'ກະລຸນາປ້ອນລະຫັດ OTP'),
                      }}
                    >
                      {(field) => (
                        <TextField
                          id={field.name}
                          name={field.name}
                          fullWidth
                          label="ຢືນຢັນ OTP"
                          placeholder="ຢືນຢັນ OTP"
                          margin="normal"
                          required
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          error={!!field.state.meta.errors}
                          helperText={!field.state.meta.errors}
                        />
                      )}
                    </otpForm.Field>

                    <Box
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: '110%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <Typography
                        onClick={handleSendOTP}
                        sx={{
                          textTransform: 'none',
                          color: '#0F5791',
                          cursor: 'pointer',
                        }}
                      >
                        ສົ່ງລະຫັດ OTP ອີກຄັ້ງ
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      bgcolor: '#64b5f6',
                      '&:hover': {
                        bgcolor: '#42a5f5',
                      },
                      borderRadius: 1,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    ຢືນຢັນ
                  </Button>
                </form>
              </>
            )}

            {step === 'newPassword' && (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  ກະລຸນາຕັ້ງລະຫັດຜ່ານໃໝ່ຂອງທ່ານ
                </Typography>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    passwordForm.handleSubmit();
                  }}
                >
                  <passwordForm.Field
                    name="password"
                    validators={{
                      onChange: z
                        .string()
                        .min(6, 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ'),
                    }}
                  >
                    {(field) => (
                      <TextField
                        id={field.name}
                        name={field.name}
                        fullWidth
                        type="password"
                        label="ລະຫັດຜ່ານໃໝ່"
                        placeholder="ລະຫັດຜ່ານໃໝ່"
                        margin="normal"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={!!field.state.meta.errors}
                        helperText={!field.state.meta.errors}
                      />
                    )}
                  </passwordForm.Field>

                  <passwordForm.Field
                    name="confirmPassword"
                    validators={{
                      onChange: (field) => {
                        const password = passwordForm.getFieldValue('password');
                        if (field.value !== password) {
                          return 'ລະຫັດຜ່ານບໍ່ກົງກັນ';
                        }
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <TextField
                        id={field.name}
                        name={field.name}
                        fullWidth
                        type="password"
                        label="ຢືນຢັນລະຫັດຜ່ານໃໝ່"
                        placeholder="ຢືນຢັນລະຫັດຜ່ານໃໝ່"
                        margin="normal"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={!!field.state.meta.errors}
                        helperText={field.state.meta.errors}
                      />
                    )}
                  </passwordForm.Field>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      bgcolor: '#64b5f6',
                      '&:hover': {
                        bgcolor: '#42a5f5',
                      },
                      borderRadius: 1,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    {t('confirm')}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        {/* Header with navigation options */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
            background: 'transparent',
            p: 2,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ color: '#fff' }}
          >
            {t('remember_password')}
          </Typography>
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>
            {t('login')}
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}
