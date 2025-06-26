import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number; // Add total items for better debugging
  onPageChange: (page: number) => void;
}

export const CustomPagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationProps) => {
  // Add validation for props
  const validCurrentPage = Math.max(1, Number(currentPage) || 1);
  const validTotalPages = Math.max(1, Number(totalPages) || 1);

  const getVisiblePages = () => {
    if (validTotalPages <= 1) return [1];
    
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Handle edge cases
    if (validTotalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= validTotalPages; i++) {
        range.push(i);
      }
      return range;
    }

    // Calculate range around current page
    const start = Math.max(2, validCurrentPage - delta);
    const end = Math.min(validTotalPages - 1, validCurrentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add first page
    if (start > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Add middle range (skip if first page already included)
    if (start > 1) {
      rangeWithDots.push(...range);
    } else {
      rangeWithDots.push(...range.filter(p => p !== 1));
    }

    // Add last page
    if (end < validTotalPages - 1) {
      rangeWithDots.push('...', validTotalPages);
    } else if (end < validTotalPages) {
      rangeWithDots.push(validTotalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= validTotalPages && page !== validCurrentPage) {
      console.log('Changing to page:', page);
      onPageChange(page);
    }
  };

  // Don't render pagination if there's only one page
  if (validTotalPages <= 1) {
    return null;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: 1,
      py: 2
    }}>
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mr: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Page {validCurrentPage} of {validTotalPages} 
            {totalItems && ` (${totalItems} items)`}
          </Typography>
        </Box>
      )}

      {/* Previous Button */}
      <IconButton
        onClick={() => handlePageChange(validCurrentPage - 1)}
        disabled={validCurrentPage === 1}
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
            cursor: 'not-allowed',
          },
        }}
      >
        <ChevronLeft fontSize="small" />
      </IconButton>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => (
        <Box key={`page-${index}-${page}`}>
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
              onClick={() => handlePageChange(page as number)}
              sx={{
                width: 40,
                height: 40,
                backgroundColor:
                  validCurrentPage === page ? '#1976d2' : 'transparent',
                color: validCurrentPage === page ? 'white' : '#333',
                border: '1px solid #e0e0e0',
                borderRadius: '50%',
                fontSize: '14px',
                fontWeight: validCurrentPage === page ? 'bold' : 'normal',
                '&:hover': {
                  backgroundColor:
                    validCurrentPage === page ? '#1565c0' : '#eeeeee',
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
        onClick={() => handlePageChange(validCurrentPage + 1)}
        disabled={validCurrentPage === validTotalPages}
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
            cursor: 'not-allowed',
          },
        }}
      >
        <ChevronRight fontSize="small" />
      </IconButton>
    </Box>
  );
};