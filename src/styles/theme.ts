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
      paper: '#F5F0E6',
    },
    text: { primary: '#000', secondary: '#000' },
  },
  typography: {
    fontFamily: 'Playfair Display Noto Sans Lao',
    button: { textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          // Load both fonts from Google Fonts
          '@font-face': [
            {
              fontFamily: 'Playfair Display',
              fontStyle: 'normal',
              fontWeight: 400,
              fontDisplay: 'swap',
              src: `url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap') format('woff2')`,
            },
            {
              fontFamily: 'Noto Sans Lao',
              fontStyle: 'normal',
              fontWeight: 400,
              fontDisplay: 'swap',
              src: `url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao&display=swap') format('woff2')`,
            },
          ],
          // Global font override using :lang()
          body: {
            background: 'linear-gradient(to bottom right, #F5F5F5, #F5F0E6)',
            fontFamily: `'Playfair Display', 'Noto Sans Lao', sans-serif`,
          },
          // Use Noto Sans Lao when content is in Lao
          ':lang(lo)': {
            fontFamily: `'Noto Sans Lao', sans-serif`,
          },
          ':lang(en)': {
            fontFamily: `'Playfair Display', serif`,
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg,#de9c69 10%, #C98B6B 90%)',
          borderRadius: '10px',
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
