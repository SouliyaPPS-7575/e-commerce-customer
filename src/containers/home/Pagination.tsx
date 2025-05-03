import { Box } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  pageCount,
  onPageChange,
}: PaginationProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: '10px', md: '20px' },
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        zIndex: 900,
      }}
    >
      {Array.from({ length: pageCount }).map((_, index) => (
        <Box
          key={index}
          onClick={() => onPageChange(index)}
          sx={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor:
              currentPage === index + 1
                ? 'primary.main'
                : 'rgba(255, 255, 255, 0.5)',
            border: '1px solid',
            borderColor:
              currentPage === index + 1 ? 'primary.main' : 'rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.2)',
            },
          }}
        />
      ))}
    </Box>
  );
}
