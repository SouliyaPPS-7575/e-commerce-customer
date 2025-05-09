import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React from 'react';
import { currencies, CurrencyCode, useCurrency } from './CurrencyProvider';

interface CurrencySelectorProps {
  showLabel?: boolean;
  size?: 'small' | 'medium';
  variant?: 'standard' | 'outlined' | 'filled';
  minWidth?: number;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  showLabel = false,
  size = 'small',
  variant = 'outlined',
  minWidth = 80,
}) => {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value as CurrencyCode);
  };

  return (
    <Box display="flex" alignItems="center">
      {showLabel && (
        <Typography variant="body2" sx={{ mr: 1, color: '#7A6A55' }}>
          Currency:
        </Typography>
      )}
      <FormControl size={size} sx={{ minWidth }}>
        <Select
          value={currency}
          onChange={handleCurrencyChange}
          variant={variant}
          sx={{
            '& .MuiSelect-select': {
              py: size === 'small' ? 0.5 : 1,
              px: size === 'small' ? -2 : 2,
            },
          }}
        >
          {Object.keys(currencies).map((curr) => (
            <MenuItem key={curr} value={curr}>
              <Box display="flex" alignItems="center">
                <Typography>{curr}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CurrencySelector;
