import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#C98B6B' },
    secondary: { main: '#C98B6B' },
    error: { main: '#B71C1C' },
    warning: { main: '#FF5722' },
    success: { main: '#8BC34A' },
    background: {
      default: 'linear-gradient(to bottom right, #F5F5F5, #FBF8F4)',
      paper: '#FBF8F4',
    },
    text: { primary: '#000', secondary: '#000' },
  },
  typography: {
    fontFamily: 'Canela Trial',
    button: { textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          // Load both fonts from Google Fonts
          '@font-face': [
            {
              fontFamily: 'Canela Trial',
              fontStyle: 'normal',
              fontWeight: 400,
              fontDisplay: 'swap',
              src: `url('https://fonts.googleapis.com/css2?family=Canela+Trial&display=swap') format('woff2')`,
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
            background: 'linear-gradient(to bottom right, #F5F5F5, #FBF8F4)',
            fontFamily: `'Canela Trial', 'Noto Sans Lao', sans-serif`,
          },
          // Use Noto Sans Lao when content is in Lao
          ':lang(lo)': {
            fontFamily: `'Noto Sans Lao', sans-serif`,
          },
          ':lang(en)': {
            fontFamily: `'Canela Trial', serif`,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
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
