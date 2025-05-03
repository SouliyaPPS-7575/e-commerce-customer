import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#C98B6B' },
    secondary: { main: '#C98B6B' },
    error: { main: '#B71C1C' },
    warning: { main: '#FF5722' },
    success: { main: '#8BC34A' },
    background: {
      default: 'linear-gradient(to bottom right, #F5F5F5, #F5F0E6)',
      paper: '#F5F5F5',
    },
    text: { primary: '#000', secondary: '#000' },
  },
  typography: {
    fontFamily: `Playfair Display sans-serif`,
    button: { textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@font-face': [
            {
              fontFamily: 'Playfair Display',
              fontStyle: 'normal',
              fontWeight: 400,
              fontDisplay: 'swap',
              src: `url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap') format('woff2')`,
            },
          ],
        },
        body: {
          background: 'linear-gradient(to bottom right, #F5F5F5, #F5F0E6)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg,#de9c69 10%, #C98B6B 90%)',
          borderRadius: '20px',
          color: '#F5F5F5',
          fontWeight: 'bold',
          padding: '8px 14px',
          '&:hover': {
            background: 'linear-gradient(45deg, #ab6936 30%, #C98B6B 90%)',
          },
        },
      },
    },
  },
});

export default theme;
