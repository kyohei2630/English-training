export interface NavItem {
  to: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/reading', label: 'Reading', icon: '📖' },
  { to: '/writing', label: 'Writing', icon: '✍️' },
  { to: '/review', label: 'Review', icon: '🔄' },
  { to: '/progress', label: 'Progress', icon: '📊' },
];
