export type NavItem = {
  name: string;
  page: number;
  href?: string;
};

export const navItems: NavItem[] = [
  { name: 'Home', page: 0, href: '/' },
  { name: 'Shop', page: 1, href: '/shop' },
  { name: 'Blog', page: 2, href: '/blog' },
  { name: 'Contact', page: 3, href: '/contact' },
];
