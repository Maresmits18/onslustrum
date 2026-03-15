import { useState } from "react";
import { Bell, Megaphone, BarChart3, CalendarDays, Euro, CheckCircle2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  type: "mededeling" | "poll" | "event" | "betaling" | "aanmelding" | "herinnering";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "event",
    title: "Nieuw event toegevoegd",
    description: "Lustrumgala op 11 april 2026",
    timestamp: "2 uur geleden",
    read: false,
  },
  {
    id: 2,
    type: "betaling",
    title: "Betaling geregistreerd",
    description: "€50 ontvangen voor Pakket 3",
    timestamp: "5 uur geleden",
    read: false,
  },
  {
    id: 3,
    type: "poll",
    title: "Poll is live",
    description: "Stem nu op: Welk thema voor de afsluitborrel?",
    timestamp: "Gisteren",
    read: false,
  },
  {
    id: 4,
    type: "mededeling",
    title: "Nieuwe mededeling",
    description: "Het bestuur heeft het lustrumweek programma gedeeld",
    timestamp: "Gisteren",
    read: true,
  },
  {
    id: 5,
    type: "aanmelding",
    title: "Aanmelding goedgekeurd",
    description: "Je bent bevestigd voor de Openingsborrel",
    timestamp: "2 dagen geleden",
    read: true,
  },
];

const typeIcons: Record<Notification["type"], React.ReactNode> = {
  mededeling: <Megaphone className="w-4 h-4" />,
  poll: <BarChart3 className="w-4 h-4" />,
  event: <CalendarDays className="w-4 h-4" />,
  betaling: <Euro className="w-4 h-4" />,
  aanmelding: <CheckCircle2 className="w-4 h-4" />,
  herinnering: <CalendarDays className="w-4 h-4" />,
};

const typeColors: Record<Notification["type"], string> = {
  mededeling: "text-primary bg-primary/10",
  poll: "text-blue-600 bg-blue-50",
  event: "text-emerald-600 bg-emerald-50",
  betaling: "text-amber-600 bg-amber-50",
  aanmelding: "text-emerald-600 bg-emerald-50",
  herinnering: "text-orange-600 bg-orange-50",
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-muted/50 transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="top" className="rounded-b-2xl max-h-[85vh] overflow-y-auto p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-lg">Meldingen</SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                className="text-xs text-primary hover:text-primary font-medium"
              >
                Alles gelezen
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="px-5 py-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="font-display font-semibold text-foreground text-sm">Geen nieuwe meldingen</p>
              <p className="text-xs text-muted-foreground mt-1">Je bent helemaal bij! ✓</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-colors ${
                    notification.read
                      ? "hover:bg-muted/50"
                      : "bg-primary/[0.03] border-l-2 border-primary hover:bg-primary/[0.06]"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${typeColors[notification.type]}`}>
                    {typeIcons[notification.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${notification.read ? "text-foreground" : "font-semibold text-foreground"}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{notification.description}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 mt-1">{notification.timestamp}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
