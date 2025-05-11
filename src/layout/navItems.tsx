export type NavItem = {
  name: string;
  page: number;
  href?: string;
};

export const navItems: NavItem[] = [
  { name: 'home', page: 0, href: '/' },
  { name: 'shop', page: 1, href: '/shop' },
  { name: 'blog', page: 2, href: '/blog' },
  { name: 'contact', page: 3, href: '/contact' },
];
