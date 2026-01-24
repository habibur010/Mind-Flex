import { Sidebar, MobileNav } from "./Navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect logic handled in App.tsx or component level, 
    // but defensive return here prevents flash of content
    return null;
  }

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
