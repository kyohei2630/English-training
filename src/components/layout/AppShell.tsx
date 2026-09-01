import { Link, Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import SideNav from './SideNav';
import { useSettings } from '../../hooks/useSettings';

export default function AppShell() {
  useSettings(); // applies dark mode / font size to <html> as soon as the app shell mounts
  const location = useLocation();
  const isTraining = location.pathname === '/training';

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {!isTraining && <SideNav />}
      <div className={!isTraining ? 'md:pl-56' : ''}>
        {!isTraining && (
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden dark:border-slate-700 dark:bg-slate-950/95">
            <span className="text-base font-bold text-blue-600 dark:text-blue-400">30分英語トレーニング</span>
            <Link to="/settings" aria-label="設定" className="tap-target flex items-center justify-center rounded-full p-1 text-xl">
              ⚙️
            </Link>
          </header>
        )}
        <main className={`mx-auto w-full max-w-3xl px-4 py-6 ${!isTraining ? 'pb-24 md:pb-10' : ''}`}>
          <Outlet />
        </main>
      </div>
      {!isTraining && <BottomNav />}
    </div>
  );
}
