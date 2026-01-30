import { Sidebar, MobileNav } from "./Navigation";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 relative overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
