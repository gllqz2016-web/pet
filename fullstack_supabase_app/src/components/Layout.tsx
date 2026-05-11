import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Map, PawPrint, Megaphone, CalendarHeart, User, Bell, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/map', label: '地图', icon: Map },
    { path: '/', label: '领养', icon: PawPrint },
    { path: '/report', label: '上报', icon: Megaphone },
    { path: '/events', label: '活动', icon: CalendarHeart },
    { path: '/profile', label: '我的', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background relative flex flex-col pt-16 pb-24">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 shadow-[0_4px_20px_rgba(204,90,61,0.08)] bg-surface/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-margin-mobile h-16 w-full max-w-container-max mx-auto">
          <button onClick={() => navigate('/')} className="text-primary hover:scale-105 transition-transform" aria-label="搜索">
            <Search className="w-6 h-6" />
          </button>
          <h1 className="font-headline-lg-mobile text-primary tracking-tight font-bold text-xl">Stray Stories</h1>
          <button onClick={() => navigate('/messages')} className="text-primary hover:scale-105 transition-transform relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-surface"></span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto relative">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 rounded-t-xl bg-surface shadow-[0_-4px_20px_rgba(204,90,61,0.08)]">
        <div className="flex justify-around items-center h-20 px-2 pb-safe w-full max-w-container-max mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/events' && location.pathname === '/messages'); // Fallback logic
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center px-4 py-1 transition-all duration-200 active:scale-90",
                  isActive 
                    ? "bg-secondary-container text-on-secondary-container rounded-full" 
                    : "text-on-surface-variant hover:bg-secondary-fixed/20"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
                <span className="font-label-md text-label-md mt-1">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
