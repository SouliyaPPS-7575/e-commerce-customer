import { SvgIconComponent, HomeOutlined } from '@mui/icons-material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

export type NavItem = {
  name: string;
  page: number;
  href?: string;
  icon?: SvgIconComponent; // Store the icon component itself
};

export const navItems: NavItem[] = [
  {
    name: 'home',
    page: 0,
    href: '/',
    icon: HomeOutlined,
  },
  {
    name: 'shop',
    page: 1,
    href: '/shop/index/all',
    icon: StorefrontOutlinedIcon,
  },
  { name: 'journal', page: 2, href: '/blog', icon: ArticleOutlinedIcon },
];
