import { SvgIconComponent } from '@mui/icons-material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

export type NavItem = {
  name: string;
  page: number;
  href?: string;
  icon?: SvgIconComponent; // Store the icon component itself
};

export const navItems: NavItem[] = [
  { name: 'shop', page: 1, href: '/shop', icon: StorefrontOutlinedIcon },
  { name: 'blog', page: 2, href: '/blog', icon: ArticleOutlinedIcon },
  { name: 'contact', page: 3, href: '/contact', icon: MailOutlineIcon },
];
