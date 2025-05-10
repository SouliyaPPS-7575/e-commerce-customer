import { ArrowForward } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import theme from '~/styles/theme';

// Mock stories data
const stories = [
  {
    id: 1,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image:
      'https://i.ibb.co/BKZfkBx5/e13a2af44b3fd92e9a7c350eb2a8634f34d25dab.png',
  },
  {
    id: 2,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image:
      'https://i.ibb.co/yc2DsWpN/504d33301cb8c8d22ee9613ccba278753be876bc.png',
  },
  {
    id: 3,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image:
      'https://i.ibb.co/LhRtPgsq/bca5476fe24e81e0928194f5321cdf1d456b857f.png',
  },
  {
    id: 4,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image:
      'https://i.ibb.co/d4RbgVSd/a78d3af5ac3de6c540f3bf9f40069915b3bb174c.png',
  },
  {
    id: 5,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image:
      'https://i.ibb.co/C3VnhQRk/bcdd2a43df06c7fe6772a7c4136279e79b02c945.png',
  },
];

export default function BlogSection() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '110vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#F5F0E6',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          sx={{
            fontSize: '1.8rem',
            fontWeight: 600,
            mb: 1,
            mt: 1,
            fontFamily: 'Georgia, serif', // adjust if you're using a custom theme
          }}
        >
          Recent Stories
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            color: '#666',
            fontStyle: 'italic',
            mb: 1.5,
          }}
        >
          “The latest from our journal — stories behind the silk, the artisans,
          and the culture.”
        </Typography>

        {isMobile ? (
          // Mobile: Horizontal scroll list
          (<Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              gap: 2,
              pb: 2,
              px: 1,
            }}
          >
            {stories.map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                style={{ scrollSnapAlign: 'start', minWidth: '80%' }}
              >
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 'none',
                    border: '1px solid #eee',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={story.image}
                    alt={story.title}
                    sx={{ height: 200, width: '100%', objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {story.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {story.excerpt}
                    </Typography>
                    <Link to="/blog" style={{ textDecoration: 'none' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#b06b40',
                          fontWeight: 500,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Read more
                      </Typography>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>)
        ) : (
          // Desktop: Horizontal scroll list
          (<Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              gap: 2,
              pb: 2,
              px: 1,
            }}
          >
            {stories.map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                style={{ scrollSnapAlign: 'start', minWidth: '30%' }}
              >
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 'none',
                    border: '1px solid #eee',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={story.image}
                    alt={story.title}
                    sx={{ height: 200, width: '100%', objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {story.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {story.excerpt}
                    </Typography>
                    <Link to="/blog" style={{ textDecoration: 'none' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#b06b40',
                          fontWeight: 500,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Read more
                      </Typography>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>)
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: isMobile ? 1 : 2,
          }}
        >
          <Link to="/blog" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                backgroundColor: '#c29b7d',
                borderRadius: '30px',
                color: 'white',
                px: 5,
                py: 1,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: '#a67c62',
                },
              }}
            >
              View all
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
