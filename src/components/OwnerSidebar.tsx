import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Newspaper, Settings, Calendar, LogOut, PiggyBank,
} from "lucide-react";

const sidebarItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/dashboard/financieel", icon: PiggyBank, label: "Financieel" },
  { path: "/dashboard", icon: Users, label: "Leden" },
  { path: "/dashboard", icon: Newspaper, label: "Nieuws" },
  { path: "/dashboard", icon: Calendar, label: "Kalender" },
  { path: "/dashboard/instellingen", icon: Settings, label: "Instellingen" },
];

const OwnerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 p-6 flex-shrink-0">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="font-display font-bold text-primary text-sm">PA</span>
        </div>
        <div>
          <h1 className="font-display font-bold text-foreground leading-tight">Pallas Athena</h1>
          <p className="text-xs text-muted-foreground">Beheerder</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Uitloggen</span>
      </button>
    </aside>
  );
};

export default OwnerSidebar;
