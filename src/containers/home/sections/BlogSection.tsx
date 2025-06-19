import { ArrowForward } from '@mui/icons-material';
import {
  AccordionDetails,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlogs } from '~/hooks/blogs/useBlogs';
import { useEditCountBlog } from '~/hooks/blogs/useEditCountBlog';
import {
  BlogCard,
  BlogDate,
  BlogExcerpt,
  BlogTitle,
  JournalSubtitle,
  JournalTitle,
} from '~/styles/blogs';
import theme from '~/styles/theme';
import {
  cleanedBlogDescription,
  cleanedDescription,
  formattedDate,
} from '~/utils/format';

export default function BlogSection() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { blogs } = useBlogs();

  // Separate featured and regular posts
  const featuredPosts = blogs?.slice(0, 2);

  const blogsLast = isMobile ? blogs : blogs?.slice(2);

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
      const cardWidth = container.scrollWidth / blogsLast.length;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveSlide(index);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [blogsLast.length]);

  const { editCountBlog } = useEditCountBlog();

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
            <JournalTitle variant="h4">{t('journal')}</JournalTitle>
            <JournalSubtitle variant="subtitle1">
              {t('journal_subtitle')}
            </JournalSubtitle>
          </motion.div>
        </Box>

        {/* Featured posts (larger, top row) */}
        {!isMobile && (
          <Grid container spacing={3} sx={{ mb: 1 }}>
            {featuredPosts?.map((post, index) => (
              <Grid
                key={post?.id}
                // Updated to use the new size prop instead of xs/md
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
                  <Link
                    to="/blog/view/$id"
                    params={{ id: String(post?.id) }}
                    style={{ textDecoration: 'none' }}
                  >
                    <BlogCard
                      sx={{ height: '100%' }}
                      onClick={() => {
                        editCountBlog({
                          data: {
                            blog_id: post.id,
                            formData: {
                              ...post,
                              count: post?.count + 1,
                            },
                          },
                        });
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={post?.image_url}
                        alt={post?.title}
                        sx={{
                          height: 300,
                          width: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <CardContent sx={{ p: 2, pt: 2 }}>
                        <BlogDate>{formattedDate(post?.created)}</BlogDate>
                        <BlogTitle
                          variant="h6"
                          sx={{ fontWeight: 'bold', mb: 0 }}
                        >
                          {post?.title}
                        </BlogTitle>
                        <Box
                          sx={{
                            fontSize: '0.95rem',
                            color: theme.palette.text.secondary,
                            lineHeight: 1.7,
                          }}
                          dangerouslySetInnerHTML={{
                            __html: cleanedBlogDescription(post?.description),
                          }}
                        />
                      </CardContent>
                    </BlogCard>
                  </Link>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

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
              {blogsLast?.map((story, idx) => (
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
                        sx={{ height: 200, width: '100%', objectFit: 'cover' }}
                      />
                      <CardContent>
                        <BlogDate>{formattedDate(story?.created)}</BlogDate>
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
              {blogs.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: index === activeSlide ? '#d4af37' : '#d0d0d0',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => handleSlideChange(index)}
                />
              ))}
            </Box>
          </>
        ) : (
          // Desktop: Horizontal scroll list
          <>
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
              {blogsLast?.map((story, idx) => (
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
                        sx={{ height: 200, width: '100%', objectFit: 'cover' }}
                      />
                      <CardContent>
                        <BlogDate>{formattedDate(story?.created)}</BlogDate>
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
          </>
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
                background: 'linear-gradient(45deg,#de9c69 10%, #C98B6B 90%)',
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
