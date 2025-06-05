import {
  Clear as ClearIcon,
  Close as CloseIcon,
  SearchRounded,
  ShoppingBag,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '~/hooks/shop/useProducts';
import { ProductItem } from '~/models/shop';

interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'category' | 'brand';
  price?: number;
  category?: string;
  image?: string;
  productCount?: number;
}

interface CategorizedResults {
  products: SearchResult[];
  categories: never[];
  brands: never[];
}

interface SearchDialogProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

function debounce<T extends (...args: any[]) => Promise<void>>(
  func: T,
  wait: number,
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} {
  let timeout: NodeJS.Timeout;
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
}

export function SearchDialog({ searchOpen, setSearchOpen }: SearchDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { productsData } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleNavigation = (result: SearchResult) => {
    if (result.type === 'product') {
      navigate({
        to: '/shop/view/$productID/$categoryID',
        params: {
          productID: String(result.id),
          categoryID: String(result.category),
        },
      });
    }
  };

  const performSearch = async (
    query: string,
    products: ProductItem[],
  ): Promise<SearchResult[]> => {
    await new Promise((r) => setTimeout(r, 500));
    const lower = query.toLowerCase();

    const filtered = products.filter((p) => {
      return (
        p.name?.toLowerCase().includes(lower) ||
        p.description?.toLowerCase().includes(lower) ||
        p.price?.toString().includes(lower) ||
        p.id?.toLowerCase().includes(lower) ||
        p.created?.toLowerCase().includes(lower)
      );
    });

    return filtered.map((item) => ({
      id: String(item.id),
      title: item.name ?? '',
      discription: item.description ?? '',
      type: 'product',
      category: item.category_id ?? '',
      price: item.price ?? 0,
      image: item.image_url[0] ?? '',
    }));
  };

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await performSearch(query, productsData);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [productsData],
  );

  useEffect(() => {
    return () => debouncedSearch.cancel(); // Cleanup on unmount
  }, [debouncedSearch]);

  const categorizedResults = useMemo((): CategorizedResults => {
    return {
      products: searchResults.filter((r) => r.type === 'product'),
      categories: [],
      brands: [],
    };
  }, [searchResults]);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const value = event.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleResultClick = (result: SearchResult) => {
    setSearchHistory((prev) =>
      [result.title, ...prev.filter((h) => h !== result.title)].slice(0, 5),
    );
    handleNavigation(result);
    setSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleClose = () => {
    setSearchOpen(false);
    clearSearch();
  };

  return (
    <Dialog open={searchOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{t('search')}</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            mb: 2,
            borderRadius: 2,
          }}
        >
          <SearchRounded sx={{ mr: 1, color: 'text.secondary' }} />
          <TextField
            variant="standard"
            placeholder={t('please_enter_search_text')}
            fullWidth
            autoFocus
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              disableUnderline: true,
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {isSearching && (
          <Box textAlign="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!isSearching &&
          searchQuery &&
          categorizedResults.products.length > 0 && (
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
              >
                <ShoppingBag sx={{ mr: 1, fontSize: 16 }} />
                {t('products')} ({categorizedResults.products.length})
              </Typography>

              <List disablePadding>
                {categorizedResults.products.map((result) => (
                  <ListItemButton
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={result.image}
                        alt={result.title}
                        sx={{ width: 40, height: 40 }}
                      >
                        <ShoppingBag />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={result.title}
                      secondary={
                        <Box display="flex" gap={1} alignItems="center">
                          {result.price && (
                            <Typography
                              variant="body2"
                              color="primary"
                              fontWeight="bold"
                            >
                              ${result.price}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          )}

        {!isSearching && searchQuery && searchResults.length === 0 && (
          <Box textAlign="center" py={3}>
            <Typography variant="body2" color="text.secondary">
              {t('no_results_found')} "{searchQuery}"
            </Typography>
          </Box>
        )}

        {!searchQuery && searchHistory.length > 0 && (
          <Box mt={2}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {t('recent_searches')}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {searchHistory.map((item, i) => (
                <Chip
                  key={i}
                  label={item}
                  size="small"
                  onClick={() => handleQuickSearch(item)}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
