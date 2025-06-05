import {
  AccordionDetails,
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { createFileRoute, Link } from '@tanstack/react-router';
import HeroSection from '~/containers/blogs/HeroSection';
import LatestStories from '~/containers/blogs/LatestStories';
import Footer from '~/containers/footer';
import { blogsQueryOption, useBlogs } from '~/hooks/blogs/useBlogs';
import { BlogExcerpt } from '~/styles/blogs';
import theme from '~/styles/theme';
import { cleanedDescription, formattedDate } from '~/utils/format';

export const Route = createFileRoute('/blog/')({
  loader: async ({ context }) => {
    const blogs = context.queryClient.ensureQueryData(blogsQueryOption());
    return { blogs };
  },
  component: BlogComponent,
});

function BlogComponent() {
  const { blogs: blogPosts } = useBlogs();

  const startBlogSecondItem = blogPosts?.slice(1, blogPosts.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          bgcolor: '#FBF8F4',
          minHeight: '100vh',
        }}
      >
      {/* Hero Section */}
      <HeroSection
        title={'Lao silk'}
        subtitle={
          'Timeless Elegance, Woven by Tradition – Discover the Luxury of Handcrafted Lao Silk.'
        }
        imageUrl={
          'https://i.ibb.co/PZqV2kDg/5b20080976d0fff9ad004eedf6bc1becc637bc5c.png'
        }
      />

      <Container maxWidth="lg">
        {/* Latest Stories Section */}
        <LatestStories stories={blogPosts} />

        <Grid container spacing={3} sx={{ mb: 2, mt: -1 }}>
          {startBlogSecondItem?.map((post) => (
            <Grid
              key={post.id}
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              size={{
                xs: 12,
                sm: 6
              }}>
              <Link
                to="/blog/view/$id"
                params={{ id: String(post.id) }}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxShadow: 'none',
                    border: '1px solid #e0e0e0',
                    borderRadius: 0,
                    cursor: 'pointer',
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: 300,
                      objectFit: 'cover',
                    }}
                    image={post?.image_url}
                    alt={post?.title}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        mb: 1,
                        color: '#888',
                      }}
                    >
                      {formattedDate(post?.created)}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {post?.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.9rem',
                        color: '#666',
                      }}
                    >
                      <BlogExcerpt>
                        <AccordionDetails>
                          <Box
                            sx={{
                              fontSize: '0.95rem',
                              color: theme.palette.text.secondary,
                              lineHeight: 1.7,
                            }}
                            dangerouslySetInnerHTML={{
                              __html: cleanedDescription(post?.description),
                            }}
                          />
                        </AccordionDetails>
                      </BlogExcerpt>
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
      </Box>
    </motion.div>
  );
}
