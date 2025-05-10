import type React from 'react';

import {
  ArrowBack,
  ArrowForward,
  Email,
  Facebook,
  YouTube,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/blog/')({
  component: BlogComponent,
});

interface BlogPost {
  id: number;
  image: string;
  date: string;
  title: string;
  description: string;
}

function BlogComponent() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      image:
        'https://i.ibb.co/WpphJQLy/40c813602b61003644235a44b089be83dd842d23.png',
      date: 'April 25',
      title: 'Lorem Ipsum is simply dummy text of the printing',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
    },
    {
      id: 2,
      image:
        'https://i.ibb.co/dsmPrfdw/077a52a250b52801fc931245f9f88c29b434a1ff.png',
      date: 'April 25',
      title: 'Lorem Ipsum is simply dummy text of the printing',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
    },
    {
      id: 3,
      image:
        'https://i.ibb.co/27JnPL5t/67844ba1469f8cc84cce815ace14e4804fb94b7c.png',
      date: 'April 25',
      title: 'Lorem Ipsum is simply dummy text of the printing',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
    },
    {
      id: 4,
      image:
        'https://i.ibb.co/4RCVTWSZ/e13a2af44b3fd92e9a7c350eb2a8634f34d25dab.png',
      date: 'April 25',
      title: 'Lorem Ipsum is simply dummy text of the printing',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
    },
    {
      id: 5,
      image:
        'https://i.ibb.co/fzz0vksJ/371ba15d32f7ae9494972dfa5b3477c2ac8b0ce3.png',
      date: 'April 25',
      title: 'Lorem Ipsum is simply dummy text of the printing',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
    },
    {
      id: 6,
      image:
        'https://i.ibb.co/dsmPrfdw/077a52a250b52801fc931245f9f88c29b434a1ff.png',
      date: 'April 25',
      title: 'Lorem Ipsum is simply dummy text of the printing',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: '#f5f0e6',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="lg">
        <br />
        <br />
        <br />

        <Box sx={{ mb: 6, textAlign: 'left' }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontFamily: 'serif',
              fontWeight: 700,
              color: '#333',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Lorem Ipsum
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#6b6b47',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.2rem' },
            }}
          >
            <Box component="span" sx={{ color: '#6b6b47', fontWeight: 500 }}>
              Lorem Ipsum
            </Box>{' '}
            is simply dummy text
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            TabIndicatorProps={{
              style: {
                display: 'none',
              },
            }}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                color: '#555',
                fontSize: '1rem',
                mr: 3,
                p: 0,
                minWidth: 'auto',
              },
              '& .Mui-selected': {
                color: '#000',
                fontWeight: 600,
              },
            }}
          >
            <Tab label="All blogs" />
            <Tab label="Featured" />
            <Tab label="Company" />
          </Tabs>
        </Box>

        <Grid container spacing={3} sx={{ mb: 2, mt: -1 }}>
          {blogPosts.map((post) => (
            <Grid
              key={post.id}
              size={{
                xs: 12,
                sm: 6,
              }}
            >
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
                    image={post.image}
                    alt={post.title}
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
                      {post.date}
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
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.9rem',
                        color: '#666',
                      }}
                    >
                      {post.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              sx={{
                bgcolor: '#f0f0f0',
                borderRadius: '50%',
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: '#e0e0e0',
                },
              }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>

            {[1, 2, '...', 5, 6].map((page, index) => (
              <Button
                key={index}
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: '50%',
                  p: 0,
                  bgcolor: page === 1 ? '#f0f0f0' : 'transparent',
                  color: '#333',
                  fontWeight: page === 1 ? 600 : 400,
                  '&:hover': {
                    bgcolor: '#e0e0e0',
                  },
                }}
              >
                {page}
              </Button>
            ))}

            <IconButton
              sx={{
                bgcolor: '#f0f0f0',
                borderRadius: '50%',
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: '#e0e0e0',
                },
              }}
            >
              <ArrowForward fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />
      </Container>
      {/* Footer */}
      <Box sx={{ bgcolor: '#7a8c5c', color: 'white', pt: 8, pb: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {/* Logo Column */}
            <Grid
              size={{
                xs: 12,
                md: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: '#f5f0e6' }}
              >
                Logo
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#f5f0e6', opacity: 0.9, lineHeight: 1.6 }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <IconButton sx={{ color: '#f5f0e6', p: 0 }}>
                  <Facebook />
                </IconButton>
                <IconButton sx={{ color: '#f5f0e6', p: 0 }}>
                  <YouTube />
                </IconButton>
                <IconButton sx={{ color: '#f5f0e6', p: 0 }}>
                  <Email />
                </IconButton>
              </Box>
            </Grid>

            {/* Contact Column */}
            <Grid
              size={{
                xs: 12,
                md: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: '#f5f0e6' }}
              >
                Contact
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#f5f0e6', opacity: 0.9, mb: 1.5 }}
              >
                020 123 456 78
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#f5f0e6', opacity: 0.9, mb: 1.5 }}
              >
                example@gmail.com
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#f5f0e6', opacity: 0.9, mb: 1.5 }}
              >
                Live Chat
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#f5f0e6', opacity: 0.9 }}
              >
                Village, District, Province
              </Typography>
            </Grid>

            {/* Navigation Column */}
            <Grid
              size={{
                xs: 12,
                md: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: '#f5f0e6' }}
              >
                Navigation
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#f5f0e6', opacity: 0.9, mb: 1.5 }}
              >
                Home
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#f5f0e6', opacity: 0.9, mb: 1.5 }}
              >
                Shop
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#f5f0e6', opacity: 0.9 }}
              >
                Blog
              </Typography>
            </Grid>

            {/* Join Us Column */}
            <Grid
              size={{
                xs: 12,
                md: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: '#f5f0e6' }}
              >
                Join us
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#f5f0e6', opacity: 0.9, mb: 2 }}
              >
                Be the first to recieve news & update
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  placeholder="Enter your email address"
                  variant="outlined"
                  size="small"
                  sx={{
                    bgcolor: '#f5f0e6',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'transparent',
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#c19a6b',
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#a88659',
                    },
                    alignSelf: 'flex-start',
                    borderRadius: 1,
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(245, 240, 230, 0.2)', mb: 2 }} />

          <Typography
            variant="body2"
            sx={{ color: '#f5f0e6', opacity: 0.7, textAlign: 'center', py: 2 }}
          >
            © 2025 Copyright Company Brand. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
