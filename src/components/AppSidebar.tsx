import pallasLogo from "@/assets/pallas-logo.png";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Megaphone,
  PiggyBank,
  Users,
  MessageCircle,
  Award,
  History,
  ClipboardList,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/kalender", icon: Calendar, label: "Kalender" },
  { to: "/nieuws", icon: Megaphone, label: "Nieuws" },
  { to: "/sparen", icon: PiggyBank, label: "Sparen" },
  { to: "/commissies", icon: Users, label: "Commissies" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/polls", icon: ClipboardList, label: "Polls" },
  { to: "/geschiedenis", icon: History, label: "Geschiedenis" },
  { to: "/sponsors", icon: Award, label: "Sponsors" },
];

const bottomItems = [
  { to: "/profiel", icon: User, label: "Profiel" },
  { to: "/instellingen", icon: Settings, label: "Instellingen" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={pallasLogo} alt="Pallas Athena" className="h-9 w-9 object-contain" />
          <div>
            <p className="font-display font-semibold text-foreground text-sm leading-tight">Pallas Athena</p>
            <p className="text-xs text-muted-foreground">Lustrum 2026</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border py-4 px-3 space-y-1">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 w-full">
          <LogOut className="w-4 h-4" />
          Uitloggen
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
