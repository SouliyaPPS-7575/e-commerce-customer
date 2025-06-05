import { styled, Typography, Card } from "@mui/material";

// Styled components
export const JournalTitle = styled(Typography)(({ theme }) => ({
     fontFamily: "'Times New Roman', serif",
     fontSize: '2rem',
     fontWeight: 400,
     letterSpacing: '0.05em',
     marginBottom: theme.spacing(1),
}));

export const JournalSubtitle = styled(Typography)(({ theme }) => ({
     fontSize: '1rem',
     color: theme.palette.text.secondary,
     marginBottom: theme.spacing(6),
}));

export const BlogCard = styled(Card)(() => ({
     boxShadow: 'none',
     borderRadius: 0,
     height: '100%',
     display: 'flex',
     flexDirection: 'column',
     transition: 'transform 0.3s ease',
     '&:hover': {
          transform: 'translateY(-4px)',
     },
}));

export const BlogDate = styled(Typography)(({ theme }) => ({
     fontSize: '0.875rem',
     color: theme.palette.text.secondary,
     marginBottom: theme.spacing(1),
}));

export const BlogTitle = styled(Typography)(({ theme }) => ({
     fontSize: '1rem',
     fontWeight: 500,
     marginBottom: theme.spacing(1),
}));

export const BlogExcerpt = styled(Typography)(({ theme }) => ({
     fontSize: '0.875rem',
     color: theme.palette.text.secondary,
     display: '-webkit-box',
     WebkitLineClamp: 3,
     WebkitBoxOrient: 'vertical',
     overflow: 'hidden',
}));