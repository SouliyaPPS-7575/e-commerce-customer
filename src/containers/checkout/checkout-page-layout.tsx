import type React from 'react';

import { Box, Container, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface CheckoutPageLayoutProps {
  children: React.ReactNode;
}

export function CheckoutPageLayout({ children }: CheckoutPageLayoutProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        py: 5,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 2, fontWeight: 400, color: '#666' }}
        >
          Check-out Details
        </Typography>
        <Grid container spacing={4}>
          {children}
        </Grid>
      </Container>
    </Box>
  );
}
