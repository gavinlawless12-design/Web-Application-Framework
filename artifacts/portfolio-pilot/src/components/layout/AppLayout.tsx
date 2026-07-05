import { Sidebar } from './Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden focus:outline-none">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
