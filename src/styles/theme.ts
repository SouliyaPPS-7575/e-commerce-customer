import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0F5791' },
    secondary: { main: '#5BC0EA' },
    error: { main: '#B71C1C' },
    warning: { main: '#FF5722' },
    success: { main: '#8BC34A' },
    background: {
      default: 'linear-gradient(to bottom right, #D9EAF7, #BFE6FA)',
      paper: '#fff',
    },
    text: { primary: '#000', secondary: '#000' },
  },
  typography: {
    fontFamily: `"Noto Sans Lao", "Lao Sans", "Phetsarath OT", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif`,
    button: { textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@font-face': [
            {
              fontFamily: 'Noto Sans Lao',
              fontStyle: 'normal',
              fontWeight: 400,
              fontDisplay: 'swap',
              src: `url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;700&display=swap') format('woff2')`,
            },
            {
              fontFamily: 'Phetsarath OT',
              fontStyle: 'normal',
              fontWeight: 400,
              fontDisplay: 'swap',
              src: `url('https://fonts.googleapis.com/css2?family=Phetsarath+OT:wght@400;700&display=swap') format('woff2')`,
            },
          ],
        },
        body: {
          background: 'linear-gradient(to bottom right, #D9EAF7, #BFE6FA)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #0F5791 30%, #5BC0EA 90%)',
          borderRadius: '8px',
          color: '#fff',
          fontWeight: 'bold',
          padding: '8px 14px',
          '&:hover': {
            background: 'linear-gradient(45deg, #0F5791 30%, #5BC0EA 90%)',
          },
        },
      },
    },
  },
});

export default theme;
