import { Link, useLocation } from "wouter";
import { Home, Gamepad2, Activity, Music, MessageCircle, User, LogOut, CheckSquare, Camera, HeartPulse, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: CheckSquare, label: "Tasks", href: "/tasks" },
    { icon: Camera, label: "Face Analyzer", href: "/face-analyzer" },
    { icon: Gamepad2, label: "Games", href: "/games" },
    { icon: Activity, label: "Yoga & Health", href: "/wellness" },
    { icon: HeartPulse, label: "Health Monitor", href: "/health" },
    { icon: Music, label: "Music", href: "/music" },
    { icon: MessageCircle, label: "Support", href: "/chat" },
    { icon: Stethoscope, label: "Doctors", href: "/doctors" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-card border-r border-border sticky top-0">
      <div className="p-6">
        <h1 className="text-3xl font-bold font-display text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          MindFlex
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group",
                location === item.href
                  ? "bg-primary/10 text-primary font-medium shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", location === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [location] = useLocation();
  
  const navItems = [
    { icon: Home, href: "/dashboard" },
    { icon: CheckSquare, href: "/tasks" },
    { icon: Gamepad2, href: "/games" },
    { icon: Activity, href: "/wellness" },
    { icon: HeartPulse, href: "/health" },
    { icon: Music, href: "/music" },
    { icon: MessageCircle, href: "/chat" },
    { icon: Stethoscope, href: "/doctors" },
    { icon: User, href: "/profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50">
      <div className="flex justify-around items-center p-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              "p-2 rounded-xl transition-colors",
              location === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
            )}>
              <item.icon className="w-6 h-6" />
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
