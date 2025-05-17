import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React from 'react';
import { useCurrency } from '~/hooks/shop/useCurrency';
import { useCurrencyContext } from './CurrencyProvider';

interface CurrencySelectorProps {
  showLabel?: boolean;
  size?: 'small' | 'medium';
  variant?: 'standard' | 'outlined' | 'filled';
  minWidth?: number;
  isTransparent?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  showLabel = false,
  size = 'small',
  variant = 'outlined',
  minWidth = 80,
  isTransparent,
}) => {
  const { currencies } = useCurrency(); // should be of type CurrencyItem[]

  // Inside your component:
  const { currency, setCurrency } = useCurrencyContext();

  const [open, setOpen] = React.useState(false);

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value);
  };

  const filteredCurrencies = currencies.filter((item) => item.type === 'SELL');

  const CustomArrowDropDownIcon = ({ color }: { color: string }) => (
    <ArrowDropDownIcon sx={{ color, marginLeft: -9.5 }} />
  );

  const CustomArrowDropUpIcon = ({ color }: { color: string }) => (
    <ArrowDropUpIcon sx={{ color, marginLeft: -9.5 }} />
  );

  return (
    <Box display="flex" alignItems="center">
      {showLabel && (
        <Typography variant="body2" sx={{ mr: 1, color: '#7A6A55' }}>
          Currency:
        </Typography>
      )}
      <FormControl size={size} sx={{ minWidth }}>
        <Select
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          IconComponent={() =>
            open ? (
              <CustomArrowDropUpIcon
                color={isTransparent ? '#F5F0E6' : 'back'}
              />
            ) : (
              <CustomArrowDropDownIcon
                color={isTransparent ? '#F5F0E6' : 'back'}
              />
            )
          }
          value={currency}
          onChange={handleCurrencyChange}
          variant={variant}
          sx={{
            cursor: 'pointer',
            '& .MuiSelect-select': {
              py: size === 'small' ? 0.5 : 1,
              px: size === 'small' ? -2 : 2,
              color: isTransparent ? '#F5F0E6' : 'back',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isTransparent ? '#F5F0E6' : 'back',
            },
          }}
        >
          {filteredCurrencies.map((currency) => (
            <MenuItem key={currency.id} value={currency.ccy}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>{currency.ccy}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CurrencySelector;
