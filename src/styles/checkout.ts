import { Button, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
}));

export const ProductImage = styled('img')({
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: 4,
});

export const PlaceOrderButton = styled(Button)({
  color: 'white',
  padding: '16px',
  fontSize: '16px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  '&:hover': {
    backgroundColor: '#C4B590',
  },
});