export const navItemsHome = [
  { name: 'Shop', href: '/shop' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export type NavItem = {
  name: string;
  page: number;
};

export const navItems: NavItem[] = [
  { name: 'Home', page: 0 },
  { name: 'About Us', page: 1 },
  { name: 'Shop', page: 2 },
  { name: 'Blog', page: 3 },
  { name: 'Contact', page: 4 },
];
