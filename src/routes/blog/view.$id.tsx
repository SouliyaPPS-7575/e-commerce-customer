import {
  AccordionDetails,
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImagePreview from '~/components/ImagePreview';
import { useEditCountBlog } from '~/hooks/blogs/useEditCountBlog';
import {
  recentBlogsQueryOption,
  useRecentBlogs,
} from '~/hooks/blogs/useRecentBlogs';
import { getViewBlogQueryOption, useViewBlog } from '~/hooks/blogs/useViewBlog';
import { BlogDate, BlogExcerpt } from '~/styles/blogs';
import theme from '~/styles/theme';
import {
  cleanedBlogDescription,
  cleanedDescription,
  formattedDate,
} from '~/utils/format';

export const Route = createFileRoute('/blog/view/$id')({
  loader: async ({ context, params }) => {
    const { id } = params;
    const blog = context.queryClient.ensureQueryData(
      getViewBlogQueryOption(id),
    );
    const recentBlogs = context.queryClient.ensureQueryData(
      recentBlogsQueryOption(),
    );
    return { blog, recentBlogs };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { t } = useTranslation();
  const id = Route.useParams().id;
  const { blog } = useViewBlog(id);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { recentBlogs } = useRecentBlogs();

  const { editCountBlog } = useEditCountBlog();

  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
  };

  // Mobile scroll tracking for activeSlide
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.scrollWidth / recentBlogs.length;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveSlide(index);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [recentBlogs.length]);

  return (
    <Box
      sx={{
        backgroundColor: '#f8f6f3',
        py: { xs: -1, md: 1 },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 10, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={12}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  color: '#333',
                }}
              >
                {blog?.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, fontSize: '18px' }}
              >
                {formattedDate(blog?.created)}
              </Typography>
            </Box>

            {/* Hero Image */}
            <Box
              component="img"
              src={blog?.image_url || ''}
              alt={blog?.title}
              onClick={() => setSelectedImage(blog?.image_url || '')}
              sx={{
                width: '100%',
                height: 'auto',
                backgroundColor: '#c4c4c4',
                borderRadius: theme.spacing(1),
                marginBottom: theme.spacing(4),
                cursor: 'pointer',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />

            {/* Article Content */}
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  lineHeight: 1.7,
                  color: '#666',
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    fontSize: '1.2rem',
                    color: theme.palette.text.secondary,
                    lineHeight: 1.7,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: cleanedBlogDescription(blog?.description),
                  }}
                />
              </Typography>
            </Box>

            {/* Image Preview Component */}
            <ImagePreview
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />

            {/* Recent Stories Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                component="h5"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  color: '#333',
                }}
              >
                {t('recent_stories')}
              </Typography>

              {isMobile ? (
                <>
                  <Box
                    ref={scrollContainerRef}
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      scrollSnapType: 'x mandatory',
                      gap: 2,
                      pb: 2,
                      px: 1,
                    }}
                  >
                    {recentBlogs?.map((story, idx) => (
                      <motion.div
                        key={`${story.id}-${idx}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        style={{ scrollSnapAlign: 'start', minWidth: '80%' }}
                      >
                        <Link
                          to="/blog/view/$id"
                          params={{ id: String(story?.id) }}
                          style={{ textDecoration: 'none' }}
                        >
                          <Card
                            key={story.id}
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            sx={{
                              minWidth: '85%',
                              scrollSnapAlign: 'center',
                              borderRadius: 2,
                              boxShadow: 'none',
                              overflow: 'hidden',
                              bgcolor: 'transparent',
                              textAlign: 'center',
                            }}
                            onClick={() => {
                              handleSlideChange(idx);
                              editCountBlog({
                                data: {
                                  blog_id: story.id,
                                  formData: {
                                    ...story,
                                    count: story?.count + 1,
                                  },
                                },
                              });
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={story?.image_url}
                              alt={story?.title}
                              sx={{
                                height: 200,
                                width: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <CardContent>
                              <BlogDate>
                                {formattedDate(story?.created)}
                              </BlogDate>
                              <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                  fontWeight: 'bold',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {story?.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: -2 }}
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
                                        __html: cleanedDescription(
                                          story?.description,
                                        ),
                                      }}
                                    />
                                  </AccordionDetails>
                                </BlogExcerpt>
                              </Typography>
                              <Link
                                to="/blog"
                                style={{ textDecoration: 'none' }}
                              >
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
                  {/* Pagination dots */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1,
                      mt: 1,
                      mb: 5,
                    }}
                  >
                    {Array.from({ length: recentBlogs.length }).map(
                      (_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor:
                              index === activeSlide ? '#d4af37' : '#d0d0d0',
                            transition: 'all 0.3s ease',
                          }}
                          onClick={() => handleSlideChange(index)}
                        />
                      ),
                    )}
                  </Box>
                </>
              ) : (
                <>
                  {/* Desktop: Horizontal scroll list */}
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
                    {recentBlogs.map((story, idx) => (
                      <motion.div
                        key={`${story.id}-${idx}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        style={{ scrollSnapAlign: 'start', minWidth: '30%' }}
                      >
                        <Link
                          to="/blog/view/$id"
                          params={{ id: String(story?.id) }}
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
                            onClick={() => {
                              editCountBlog({
                                data: {
                                  blog_id: story.id,
                                  formData: {
                                    ...story,
                                    count: story?.count + 1,
                                  },
                                },
                              });
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={story?.image_url}
                              alt={story?.title}
                              sx={{
                                height: 200,
                                width: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <CardContent>
                              <BlogDate>
                                {formattedDate(story?.created)}
                              </BlogDate>
                              <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ fontWeight: 'bold' }}
                              >
                                {story?.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: -1 }}
                              >
                                <BlogExcerpt>
                                  <AccordionDetails>
                                    <Box
                                      sx={{
                                        fontSize: '0.95rem',
                                        color: theme.palette.text.secondary,
                                      }}
                                      dangerouslySetInnerHTML={{
                                        __html: cleanedDescription(
                                          story?.description,
                                        ),
                                      }}
                                    />
                                  </AccordionDetails>
                                </BlogExcerpt>
                              </Typography>
                              <Link
                                to="/blog"
                                style={{ textDecoration: 'none' }}
                              >
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
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
