import type React from 'react';

import { History, Logout, Person } from '@mui/icons-material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getMeQueryOption } from '~/hooks/profile/useGetMe';
import { uploadAvatar } from '~/server/profile';
import { queryClient } from '~/services/queryClient';
import { viewAvatar } from '~/utils/format';

interface ProfileSidebarProps {
  user: {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function ProfileSidebar({
  user,
  activeSection,
  onSectionChange,
}: ProfileSidebarProps) {
  const { t } = useTranslation();
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
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append('avatar', file);

    uploadAvatarMutate({
      data: formData,
    });
  };

  return (
    <Paper
      elevation={1}
      sx={{ p: 3, borderRadius: 2, backgroundColor: 'white' }}
    >
      {/* Profile Section */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        {/* Upload Avatar */}
        <Box sx={{ position: 'relative', width: 120, mx: 'auto', mb: 2 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: '#c4c4c4',
              cursor: 'pointer',
            }}
            src={viewAvatar(user?.avatar)}
            alt={user?.name}
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
          {user?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Navigation Menu */}
      <List sx={{ p: 0 }}>
        <ListItem
          onClick={() => onSectionChange('account')}
          sx={{
            cursor: 'pointer',
            borderRadius: 1,
            mb: 1,
            '& .MuiListItemIcon-root': {
              color: activeSection === 'account' ? '#d4af37' : 'inherit',
            },
          }}
        >
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText
            sx={{
              color: activeSection === 'account' ? '#d4af37' : 'inherit',
            }}
            primary={t('account_details')}
          />
        </ListItem>

        <ListItem
          onClick={() => onSectionChange('orders')}
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
  );
}
