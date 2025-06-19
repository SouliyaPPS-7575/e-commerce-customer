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
    fontFamily: `'Satoshi', 'Manrope', 'Noto Sans Lao', sans-serif`, // Default body font
    h1: { fontFamily: `'Canela Trial', 'Bodoni Moda', serif` },
    h2: { fontFamily: `'Canela Trial', 'Bodoni Moda', serif` },
    h3: { fontFamily: `'Canela Trial', 'Bodoni Moda', serif` },
    h4: { fontFamily: `'Canela Trial', 'Bodoni Moda', serif` },
    h5: { fontFamily: `'Canela Trial', 'Bodoni Moda', serif` },
    h6: { fontFamily: `'Canela Trial', 'Bodoni Moda', serif` },
    subtitle1: { fontFamily: `'Canela Trial', 'Bodoni Moda', serif` },
    subtitle2: { fontFamily: `'Canela Trial', 'Bodoni Moda', serif` },
    button: { textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          // Import all required fonts
          '@import': [
            "url('https://fonts.googleapis.com/css2?family=Canela+Trial&display=swap')",
            "url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400;1,700&display=swap')",
            "url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap')",
            "url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao+Looped:wght@400;700&display=swap')",
            "url('https://fonts.googleapis.com/css2?family=Satoshi:wght@400;700&display=swap')",
          ].join(' '),
          body: {
            background: 'linear-gradient(to bottom right, #F5F5F5, #FBF8F4)',
            fontFamily: `'Satoshi', 'Manrope', 'Noto Sans Lao', sans-serif`,
          },
          // Lao language overrides
          ':lang(lo)': {
            fontFamily: `'Satoshi', 'Noto Sans Lao Looped', sans-serif`,
          },
          // Headings and subtitles for Lao
          'h1:lang(lo), h2:lang(lo), h3:lang(lo), h4:lang(lo), h5:lang(lo), h6:lang(lo), .MuiTypography-h1:lang(lo), .MuiTypography-h2:lang(lo), .MuiTypography-h3:lang(lo), .MuiTypography-h4:lang(lo), .MuiTypography-h5:lang(lo), .MuiTypography-h6:lang(lo), .MuiTypography-subtitle1:lang(lo), .MuiTypography-subtitle2:lang(lo)': {
            fontFamily: `'Noto Sans Lao Looped', sans-serif`,
          },
          // Headings and subtitles for English (alternative)
          'h1:lang(en), h2:lang(en), h3:lang(en), h4:lang(en), h5:lang(en), h6:lang(en), .MuiTypography-h1:lang(en), .MuiTypography-h2:lang(en), .MuiTypography-h3:lang(en), .MuiTypography-h4:lang(en), .MuiTypography-h5:lang(en), .MuiTypography-h6:lang(en), .MuiTypography-subtitle1:lang(en), .MuiTypography-subtitle2:lang(en)': {
            fontFamily: `'Bodoni Moda', serif`,
          },
          // Body text for English (alternative)
          'body:lang(en), p:lang(en), .MuiTypography-body1:lang(en), .MuiTypography-body2:lang(en)': {
            fontFamily: `'Manrope', sans-serif`,
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
