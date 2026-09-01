import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './NavItems';

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden dark:border-slate-700 dark:bg-slate-900/95"
      aria-label="メインナビゲーション"
    >
      <ul className="flex justify-around">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `tap-target flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                }`
              }
              aria-label={item.label}
            >
              <span className="text-xl" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
