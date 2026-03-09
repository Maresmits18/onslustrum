import { useState } from "react";
import { DesktopSidebar, MobileHeader, MobileBottomNav, MobileDrawer } from "@/components/AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AppLayout = ({ children, title, subtitle }: AppLayoutProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <MobileHeader onMenuToggle={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <MobileBottomNav />

      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0 p-4 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-sm lg:text-base mt-1">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
