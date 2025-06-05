import {
  AccordionDetails,
  Box,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import ImagePreview from '~/components/ImagePreview';
import { getViewBlogQueryOption, useViewBlog } from '~/hooks/blogs/useViewBlog';
import { BlogExcerpt } from '~/styles/blogs';
import theme from '~/styles/theme';
import { cleanedDescription, formattedDate } from '~/utils/format';

export const Route = createFileRoute('/blog/view/$id')({
  loader: async ({ context, params }) => {
    const { id } = params;
    const blog = context.queryClient.ensureQueryData(
      getViewBlogQueryOption(id),
    );
    return { blog };
  },
  component: RouteComponent,
});

function RouteComponent() {
  // const { t } = useTranslation();
  const id = Route.useParams().id;
  const { blog } = useViewBlog(id);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid size={12}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
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
              <BlogExcerpt>
                <AccordionDetails>
                  <Box
                    sx={{
                      fontSize: '1.5rem',
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: cleanedDescription(blog?.description),
                    }}
                  />
                </AccordionDetails>
              </BlogExcerpt>
            </Typography>
          </Box>

          {/* Image Preview Component */}
          <ImagePreview
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          {/* Recent Stories Section */}
          {/* <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 'bold',
                mb: 4,
                color: '#333',
              }}
            >
              {t('recent_stories')}
            </Typography>

            <ScrollContainer>
              {recentStories.map((story) => (
                <StoryItem key={story.id}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      backgroundColor: '#c4c4c4',
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {story.date}
                  </Typography>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: '#333',
                    }}
                  >
                    {story.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.5 }}
                  >
                    {story.excerpt}
                  </Typography>
                </StoryItem>
              ))}
            </ScrollContainer>
          </Box> */}
        </Grid>
      </Grid>
    </Container>
  );
}
