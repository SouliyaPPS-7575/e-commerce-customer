import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';

// Mock stories data
const stories = [
  {
    id: 1,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image: '/placeholder.svg?height=400&width=600',
  },
  {
    id: 2,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image: '/placeholder.svg?height=400&width=600',
  },
  {
    id: 3,
    title: 'Recent Stories',
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
    image: '/placeholder.svg?height=400&width=600',
  },
];

export default function BlogSection() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          sx={{
            mb: 2,
          }}
        >
          Recent Stories
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: '700px', mx: 'auto' }}
        >
          "The latest from our journal — stories behind the silk, the artisans,
          and the culture."
        </Typography>

        <Grid container spacing={4}>
          {stories.map((story) => (
            <Grid
              key={story.id}
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
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
                  sx={{
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {story.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {story.excerpt}
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    sx={{
                      p: 0,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Read more
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
            }}
          >
            View all
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
