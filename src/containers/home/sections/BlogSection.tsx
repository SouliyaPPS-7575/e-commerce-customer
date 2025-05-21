import { ArrowForward } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  styled,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { t } from 'i18next';
import theme from '~/styles/theme';
import { formattedDate } from '~/utils/format';

// Mock stories data
const stories = [
  {
    id: 1,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image:
      'https://i.ibb.co/BKZfkBx5/e13a2af44b3fd92e9a7c350eb2a8634f34d25dab.png',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image:
      'https://i.ibb.co/yc2DsWpN/504d33301cb8c8d22ee9613ccba278753be876bc.png',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image:
      'https://i.ibb.co/LhRtPgsq/bca5476fe24e81e0928194f5321cdf1d456b857f.png',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image:
      'https://i.ibb.co/d4RbgVSd/a78d3af5ac3de6c540f3bf9f40069915b3bb174c.png',
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image:
      'https://i.ibb.co/C3VnhQRk/bcdd2a43df06c7fe6772a7c4136279e79b02c945.png',
    createdAt: new Date().toISOString(),
  },
];

// Styled components
const JournalTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Times New Roman', serif",
  fontSize: '2.5rem',
  fontWeight: 400,
  letterSpacing: '0.05em',
  marginBottom: theme.spacing(1),
}));

const JournalSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(6),
}));

const BlogCard = styled(Card)(() => ({
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

const BlogDate = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const BlogTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  marginBottom: theme.spacing(1),
}));

const BlogExcerpt = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

export default function BlogSection() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Separate featured and regular posts
  const featuredPosts = stories.slice(0, 2);

  return (
    <Box
      sx={{
        minHeight: '108vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <JournalTitle variant="h2">JOURNAL</JournalTitle>
            <JournalSubtitle variant="subtitle1">
              Explore our blog for stories, traditions, and styling ideas.
            </JournalSubtitle>
          </motion.div>
        </Box>

        {/* Featured posts (larger, top row) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {featuredPosts.map((post, index) => (
            <Grid
              key={post.id}
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <BlogCard sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    image={post.image}
                    alt={post.title}
                    sx={{
                      height: 300,
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ p: 2, pt: 3 }}>
                    <BlogDate>{formattedDate(post.createdAt)}</BlogDate>
                    <BlogTitle variant="h6" sx={{ fontWeight: 'bold' }}>
                      {post.title}
                    </BlogTitle>
                    <BlogExcerpt>{post.excerpt}</BlogExcerpt>
                  </CardContent>
                </BlogCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {isMobile ? (
          // Mobile: Horizontal scroll list
          <Box
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
                <Link
                  to="/blog/view/$id"
                  params={{ id: String(story.id) }}
                  style={{ textDecoration: 'none' }}
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
                      cursor: 'pointer',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={story.image}
                      alt={story.title}
                      sx={{ height: 200, width: '100%', objectFit: 'cover' }}
                    />
                    <CardContent>
                      <BlogDate>{formattedDate(story.createdAt)}</BlogDate>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                      >
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
                </Link>
              </motion.div>
            ))}
          </Box>
        ) : (
          // Desktop: Horizontal scroll list
          <Box
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
                <Link
                  to="/blog/view/$id"
                  params={{ id: String(story.id) }}
                  style={{ textDecoration: 'none' }}
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
                      cursor: 'pointer',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={story.image}
                      alt={story.title}
                      sx={{ height: 200, width: '100%', objectFit: 'cover' }}
                    />
                    <CardContent>
                      <BlogDate>{formattedDate(story.createdAt)}</BlogDate>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                      >
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
                </Link>
              </motion.div>
            ))}
          </Box>
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
              {t('view_all')}
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
