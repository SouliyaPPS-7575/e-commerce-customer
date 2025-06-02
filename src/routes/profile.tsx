import { Box, Container, Divider, Grid, useTheme } from '@mui/material';
import {
  createFileRoute,
  redirect,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useState } from 'react';
import { AccountDetailsForm } from '~/containers/profile/account-details-form';
import { AddressForm } from '~/containers/profile/address-form';
import { OrderHistory } from '~/containers/profile/order-history';
import { ProfileSidebar } from '~/containers/profile/profile-sidebar';

import { getMeQueryOption, useGetMe } from '~/hooks/profile/useGetMe';
import { orderHistoryQueryOption } from '~/hooks/profile/useOrderHistory';
import type { PaginationAPI } from '~/models';
import { getToken } from '~/server/auth';

export const Route = createFileRoute('/profile')({
  beforeLoad: async () => {
    const { token } = await getToken();
    if (!token) {
      return redirect({
        to: '/login',
      });
    }
  },
  validateSearch: ({ from, section, page, limit }) => {
    return {
      from,
      section: section || 'account', // Default to 'account' if not provided
      page,
      limit,
    };
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
  const navigate = useNavigate();
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const { me } = useGetMe();

  // Obtain search parameters from the router
  const searchParams = useSearch({ from: '/profile' });

  // Get active section from search params
  const activeSection = searchParams.section || ('account' as any);

  // Create pagination object from search params
  const pagination: PaginationAPI = {
    page: Number(searchParams.page) || 1,
    limit: Number(searchParams.limit) || 10,
  };

  // Function to handle section change
  const handleSectionChange = (section: string) => {
    navigate({
      to: '/profile',
      search: {
        ...searchParams,
        section,
        // Reset pagination when changing sections
        page: section === 'orders' ? searchParams.page || 1 : undefined,
        limit: section === 'orders' ? searchParams.limit || 10 : undefined,
      },
    });
  };

  // Function to update pagination in URL
  const handlePageChange = (page: number) => {
    navigate({
      to: '/profile',
      search: {
        ...searchParams,
        page,
      },
    });
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
          <Grid size={{ xs: 12, md: 3 }}>
            <ProfileSidebar
              user={me}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 9 }} sx={{ p: 1, mt: -2 }}>
            {activeSection === 'account' && (
              <>
                <AccountDetailsForm
                  user={me}
                  isEditing={isEditingAccount}
                  onEditToggle={() => setIsEditingAccount(!isEditingAccount)}
                />

                <Divider sx={{ my: 3, mt: 4 }} />

                <AddressForm
                  isEditing={isEditingAddress}
                  onEditToggle={() => setIsEditingAddress(!isEditingAddress)}
                />
              </>
            )}

            {activeSection === 'orders' && (
              <OrderHistory
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProfilePage;
