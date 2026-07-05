import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useEffect } from 'react';

import NotFound from '@/pages/not-found';
import Landing from '@/pages/Landing';
import Setup from '@/pages/Setup';
import Dashboard from '@/pages/Dashboard';
import Discover from '@/pages/Discover';
import PortfolioBuilder from '@/pages/PortfolioBuilder';
import Screener from '@/pages/Screener';
import StockDetail from '@/pages/StockDetail';
import WatchlistPage from '@/pages/Watchlist';
import AiChat from '@/pages/AiChat';
import Settings from '@/pages/Settings';
import AppLayout from '@/components/layout/AppLayout';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/setup" component={Setup} />
      <Route path="/dashboard" component={() => <AppLayout><Dashboard /></AppLayout>} />
      <Route path="/discover" component={() => <AppLayout><Discover /></AppLayout>} />
      <Route path="/portfolio" component={() => <AppLayout><PortfolioBuilder /></AppLayout>} />
      <Route path="/screener" component={() => <AppLayout><Screener /></AppLayout>} />
      <Route path="/stocks/:ticker" component={() => <AppLayout><StockDetail /></AppLayout>} />
      <Route path="/watchlist" component={() => <AppLayout><WatchlistPage /></AppLayout>} />
      <Route path="/ai" component={() => <AppLayout><AiChat /></AppLayout>} />
      <Route path="/settings" component={() => <AppLayout><Settings /></AppLayout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
