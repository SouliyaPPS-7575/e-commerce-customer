import { styled } from '@mui/material';
import { Box } from 'lucide-react';

export const ScrollContainer = styled(Box)({
  display: 'flex',
  overflowX: 'auto',
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE/Edge
  '&::-webkit-scrollbar': {
    display: 'none', // Chrome/Safari/Opera
  },
  WebkitOverflowScrolling: 'touch',
  gap: '24px',
  paddingBottom: '16px', // Add some padding to avoid cut-off shadows
});

export const StoryItem = styled(Box)(() => ({
  flex: '0 0 auto',
  width: '280px', // Fixed width for each item
  height: '100%',
}));
