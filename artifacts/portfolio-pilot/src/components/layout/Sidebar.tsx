import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Compass, Briefcase, Filter, LineChart, List, MessageSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'Portfolio Builder', path: '/portfolio', icon: Briefcase },
    { name: 'Screener', path: '/screener', icon: Filter },
    { name: 'Watchlist', path: '/watchlist', icon: List },
    { name: 'AI Assistant', path: '/ai', icon: MessageSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-card-border bg-card flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-card-border">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
          <LineChart className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg tracking-tight">PortfolioPilot</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = location === item.path || location.startsWith(item.path + '/');
          return (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                active 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-card-border text-xs text-muted-foreground flex justify-between">
        <span>PP Terminal</span>
        <span>v2.4.1</span>
      </div>
    </div>
  );
}
