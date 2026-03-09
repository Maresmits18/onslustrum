import pallasLogo from "@/assets/pallas-logo.png";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useClub } from "@/contexts/ClubContext";
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
  Menu,
  X,
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

const mobileBottomNav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/kalender", icon: Calendar, label: "Kalender" },
  { to: "/nieuws", icon: Megaphone, label: "Nieuws" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/profiel", icon: User, label: "Profiel" },
];

const NavItem = ({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      style={isActive ? { backgroundColor: "color-mix(in srgb, var(--color-primary, hsl(356 70% 50%)) 10%, transparent)" } : undefined}
    >
      <Icon className="w-4 h-4" />
      {label}
    </NavLink>
  );
};

// Desktop sidebar
export const DesktopSidebar = () => {
  const { activeClub, signOut } = useClub();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex-col z-40">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          {activeClub?.logo_url ? (
            <img src={activeClub.logo_url} alt={activeClub.name} className="h-9 w-9 object-contain rounded-lg" />
          ) : (
            <img src={pallasLogo} alt="Lustrum Hub" className="h-9 w-9 object-contain" />
          )}
          <div>
            <p className="font-display font-semibold text-foreground text-sm leading-tight">
              {activeClub?.name || "Lustrum Hub"}
            </p>
            <p className="text-xs text-muted-foreground">
              {activeClub?.slug || "Selecteer een club"}
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => <NavItem key={item.to} {...item} />)}
      </nav>
      <div className="border-t border-border py-4 px-3 space-y-1">
        {bottomItems.map((item) => <NavItem key={item.to} {...item} />)}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 w-full"
        >
          <LogOut className="w-4 h-4" />
          Uitloggen
        </button>
      </div>
    </aside>
  );
};

// Mobile top bar
export const MobileHeader = ({ onMenuToggle }: { onMenuToggle: () => void }) => {
  const { activeClub } = useClub();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card/95 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4 safe-area-top">
      <div className="flex items-center gap-2">
        {activeClub?.logo_url ? (
          <img src={activeClub.logo_url} alt={activeClub.name} className="h-7 w-7 object-contain rounded" />
        ) : (
          <img src={pallasLogo} alt="PA" className="h-7 w-7 object-contain" />
        )}
        <span className="font-display font-semibold text-foreground text-sm">
          {activeClub?.name || "Lustrum Hub"}
        </span>
      </div>
      <button onClick={onMenuToggle} className="p-2 rounded-lg hover:bg-muted transition-colors">
        <Menu className="w-5 h-5 text-foreground" />
      </button>
    </header>
  );
};

// Mobile bottom navigation
export const MobileBottomNav = () => {
  const location = useLocation();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {mobileBottomNav.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors min-w-0",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

// Mobile slide-out menu
export const MobileDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { signOut } = useClub();

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-[60] lg:hidden" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-72 bg-card border-l border-border z-[70] lg:hidden animate-fade-in flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-display font-semibold text-foreground">Menu</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => <NavItem key={item.to} {...item} onClick={onClose} />)}
        </nav>
        <div className="border-t border-border py-4 px-3 space-y-1">
          {bottomItems.map((item) => <NavItem key={item.to} {...item} onClick={onClose} />)}
          <button
            onClick={() => { signOut(); onClose(); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 w-full"
          >
            <LogOut className="w-4 h-4" />
            Uitloggen
          </button>
        </div>
      </div>
    </>
  );
};

export default DesktopSidebar;
