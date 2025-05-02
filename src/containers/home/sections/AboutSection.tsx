import { Box, Button, Container, Grid, Typography } from '@mui/material';

export default function AboutSection() {
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
        <Grid container spacing={6} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            <Box
              component="img"
              src="/placeholder.svg?height=800&width=800"
              alt="Colorful fabrics"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  mb: 3,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: 0,
                    width: '60px',
                    height: '3px',
                    backgroundColor: 'primary.main',
                  },
                }}
              >
                Lorem Ipsum
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="body1"
                  sx={{ mb: 3, color: 'text.secondary' }}
                >
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 4, color: 'text.secondary' }}
                >
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    mt: 2,
                  }}
                >
                  Learn more
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
