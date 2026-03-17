import { Link, useLocation } from "wouter";
import { 
  Cpu, 
  BarChart2, 
  GitCompare, 
  Home, 
  LayoutDashboard 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Overview", icon: Home },
    { href: "/simulator", label: "Simulator", icon: Cpu },
    { href: "/compare", label: "Compare Algorithms", icon: GitCompare },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card shadow-sm fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <LayoutDashboard className="w-6 h-6" />
            <span>OS Scheduler</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            System Core v1.0
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 cursor-pointer font-medium text-sm",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border bg-muted/20">
          <div className="p-3 bg-card border border-border rounded shadow-sm">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">Status</h4>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-foreground">Backend: Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 lg:p-10 max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
