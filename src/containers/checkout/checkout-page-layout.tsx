import type React from 'react';

import { Box, Container, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface CheckoutPageLayoutProps {
  children: React.ReactNode;
}

export function CheckoutPageLayout({ children }: CheckoutPageLayoutProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        py: 6,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 2, fontWeight: 400, color: '#666' }}
        >
          {t('checkout_details')}
        </Typography>
        <Grid container spacing={4}>
          {children}
        </Grid>
      </Container>
    </Box>
  );
}
