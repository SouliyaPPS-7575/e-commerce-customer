import { Box, Card, CardMedia, Grid, Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { BlogsItem } from '~/models/blogs';

interface LatestStoriesProps {
  stories: BlogsItem[];
}

const LatestStories = ({ stories }: LatestStoriesProps) => {
  const { t } = useTranslation();

  if (stories.length === 0) {
    return null;
  }

  return (
    <Box sx={{ my: 6 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 'bold',
          mb: 4,
          color: '#333',
        }}
      >
        {t('latest_stories')}
      </Typography>
      <Grid container spacing={3}>
        {stories.length > 0 && (
          <Grid size={12}>
            <Link
              to="/blog/view/$id"
              params={{ id: String(stories[0]?.id) }}
              style={{ textDecoration: 'none' }}
            >
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                }}
              >
                <CardMedia
                  component="img"
                  image={stories[0]?.image_url}
                  alt={stories[0]?.title}
                  sx={{
                    width: { md: '100%' },
                    height: { xs: '200px', md: '500px' },
                  }}
                />
              </Card>
            </Link>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default LatestStories;
