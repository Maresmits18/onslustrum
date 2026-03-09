import AppSidebar from "@/components/AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AppLayout = ({ children, title, subtitle }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
