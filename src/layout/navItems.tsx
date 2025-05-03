export type NavItem = {
  name: string;
  page: number;
  href?: string;
};

export const navItems: NavItem[] = [
  { name: 'Home', page: 0, href: '/' },
  { name: 'About Us', page: 1, href: '/about' },
  { name: 'Shop', page: 2, href: '/shop' },
  { name: 'Blog', page: 3, href: '/blog' },
  { name: 'Contact', page: 4, href: '/contact' },
];
