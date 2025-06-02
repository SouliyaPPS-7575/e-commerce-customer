import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Custom Pagination Component
export const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [1];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Previous Button */}
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        sx={{
          width: 40,
          height: 40,
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: '#eeeeee',
          },
          '&:disabled': {
            backgroundColor: '#fafafa',
            color: '#bdbdbd',
          },
        }}
      >
        <ChevronLeft fontSize="small" />
      </IconButton>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => (
        <Box key={index}>
          {page === '...' ? (
            <Typography
              sx={{
                px: 1,
                py: 1,
                minWidth: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '14px',
              }}
            >
              ...
            </Typography>
          ) : (
            <IconButton
              onClick={() => onPageChange(page as number)}
              sx={{
                width: 40,
                height: 40,
                backgroundColor:
                  currentPage === page ? '#D9D9D98C' : 'transparent',
                color: currentPage === page ? 'back' : 'back',
                border: '1px solid #e0e0e0',
                borderRadius: '50%',
                fontSize: '14px',
                fontWeight: currentPage === page ? 'bold' : 'normal',
                '&:hover': {
                  backgroundColor:
                    currentPage === page ? '#D9D9D98C' : '#eeeeee',
                },
              }}
            >
              {page}
            </IconButton>
          )}
        </Box>
      ))}

      {/* Next Button */}
      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        sx={{
          width: 40,
          height: 40,
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: '#eeeeee',
          },
          '&:disabled': {
            backgroundColor: '#fafafa',
            color: '#bdbdbd',
          },
        }}
      >
        <ChevronRight fontSize="small" />
      </IconButton>
    </Box>
  );
};
