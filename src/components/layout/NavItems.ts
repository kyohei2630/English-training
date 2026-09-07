export interface NavItem {
  to: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/vocabulary', label: 'Vocabulary', icon: '🧠' },
  { to: '/reading', label: 'Reading', icon: '📖' },
  { to: '/writing', label: 'Writing', icon: '✍️' },
  { to: '/toeic', label: 'TOEIC', icon: '📝' },
  { to: '/review', label: 'Review', icon: '🔄' },
  { to: '/progress', label: 'Progress', icon: '📊' },
];

/** Trimmed for narrow phone screens (BottomNav) — TOEIC and the rest stay reachable
 * from Home's quick links and the extra-training hub. */
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/vocabulary', label: 'Vocabulary', icon: '🧠' },
  { to: '/reading', label: 'Reading', icon: '📖' },
  { to: '/writing', label: 'Writing', icon: '✍️' },
  { to: '/review', label: 'Review', icon: '🔄' },
  { to: '/progress', label: 'Progress', icon: '📊' },
];
