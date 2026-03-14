import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, MessageCircle, User, MapPin, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type RsvpStatus = "going" | "maybe" | "not_going" | null;

interface Event {
  id: number;
  title: string;
  type: "borrel" | "gala" | "reis" | "vergadering" | "anders";
  emoji: string;
  startDate: string;
  startTime?: string;
  endDate?: string;
  location: string;
  description: string;
  going: number;
  rsvpEnabled: boolean;
  month: string;
  isPast: boolean;
}

const typeColors: Record<string, string> = {
  borrel: "bg-amber-100 text-amber-800 border-amber-200",
  gala: "bg-primary/10 text-primary border-primary/20",
  reis: "bg-emerald-100 text-emerald-800 border-emerald-200",
  vergadering: "bg-slate-100 text-slate-700 border-slate-200",
  anders: "bg-blue-100 text-blue-700 border-blue-200",
};

const typeDotColors: Record<string, string> = {
  borrel: "bg-amber-500",
  gala: "bg-primary",
  reis: "bg-emerald-600",
  vergadering: "bg-slate-500",
  anders: "bg-blue-500",
};

const events: Event[] = [
  { id: 1, title: "Openingsborrel Lustrum", type: "borrel", emoji: "🥂", startDate: "14 maart 2026", startTime: "20:00", location: "Café De Kroeg", description: "Aftrap van de lustrumweek met een gezellige borrel.", going: 87, rsvpEnabled: true, month: "Maart 2026", isPast: false },
  { id: 2, title: "ALV & Bestuurswissel", type: "vergadering", emoji: "📋", startDate: "18 maart 2026", startTime: "19:30", location: "Senaatszaal, Academiegebouw", description: "Algemene Ledenvergadering met verkiezing nieuw bestuur.", going: 56, rsvpEnabled: true, month: "Maart 2026", isPast: false },
  { id: 3, title: "Lustrumreis Praag", type: "reis", emoji: "✈️", startDate: "25 maart 2026", endDate: "29 maart 2026", location: "Praag, Tsjechië", description: "Vijf dagen Praag met het hele dispuut. Inclusief stadstour en boottocht.", going: 34, rsvpEnabled: true, month: "Maart 2026", isPast: false },
  { id: 4, title: "Lustrumgala", type: "gala", emoji: "🎭", startDate: "11 april 2026", startTime: "19:00", location: "Grand Hotel Karel V", description: "Het hoogtepunt van het lustrum. Black tie. Diner, dansen en speeches.", going: 112, rsvpEnabled: true, month: "April 2026", isPast: false },
  { id: 5, title: "Pubquiz", type: "anders", emoji: "🎉", startDate: "18 april 2026", startTime: "20:30", location: "Café Ledig Erf", description: "Teams van 4. Prijzen voor de winnaars!", going: 48, rsvpEnabled: true, month: "April 2026", isPast: false },
  { id: 6, title: "Nieuwjaarsborrel", type: "borrel", emoji: "🥂", startDate: "10 januari 2026", startTime: "21:00", location: "Café De Kroeg", description: "Proost op het nieuwe jaar!", going: 65, rsvpEnabled: false, month: "Januari 2026", isPast: true },
  { id: 7, title: "Commissievergadering", type: "vergadering", emoji: "📋", startDate: "5 februari 2026", startTime: "18:00", location: "Bestuurskamer", description: "Voortgang lustrumcommissies bespreken.", going: 12, rsvpEnabled: false, month: "Februari 2026", isPast: true },
];

const getNextEvent = () => events.find((e) => !e.isPast);

const getDaysUntil = (dateStr: string) => {
  const months: Record<string, number> = { januari: 0, februari: 1, maart: 2, april: 3, mei: 4, juni: 5, juli: 6, augustus: 7, september: 8, oktober: 9, november: 10, december: 11 };
  const parts = dateStr.split(" ");
  const day = parseInt(parts[0]);
  const month = months[parts[1].toLowerCase()];
  const year = parseInt(parts[2]);
  const target = new Date(year, month, day);
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
};

const bottomNavItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/home/events", icon: Calendar, label: "Kalender" },
  { path: "/home/mededelingen", icon: Megaphone, label: "Feed" },
  { path: "/profiel", icon: User, label: "Profiel" },
];

const MemberEvents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rsvps, setRsvps] = useState<Record<number, RsvpStatus>>({});
  const nextEvent = getNextEvent();

  const pastEvents = events.filter((e) => e.isPast);
  const upcomingEvents = events.filter((e) => !e.isPast);

  const grouped = upcomingEvents.reduce<Record<string, Event[]>>((acc, e) => {
    (acc[e.month] = acc[e.month] || []).push(e);
    return acc;
  }, {});

  const pastGrouped = pastEvents.reduce<Record<string, Event[]>>((acc, e) => {
    (acc[e.month] = acc[e.month] || []).push(e);
    return acc;
  }, {});

  const handleRsvp = (eventId: number, status: RsvpStatus) => {
    setRsvps((prev) => ({ ...prev, [eventId]: prev[eventId] === status ? null : status }));
  };

  const renderEventCard = (event: Event, isNext: boolean) => (
    <div key={event.id} className={`relative pl-8 pb-8 last:pb-0 ${event.isPast ? "opacity-50" : ""}`}>
      {/* Timeline line & dot */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
      <div className={`absolute left-[-4px] top-2 w-[9px] h-[9px] rounded-full border-2 border-background ${typeDotColors[event.type]}`} />

      <div className={`glass-card rounded-xl p-5 space-y-3 transition-all ${isNext ? "ring-2 ring-primary/30 shadow-md" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{event.emoji}</span>
            <Badge variant="outline" className={`text-xs ${typeColors[event.type]}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
            {isNext && (
              <Badge className="bg-primary text-primary-foreground text-[10px] uppercase tracking-wider">
                Volgende
              </Badge>
            )}
          </div>
          {isNext && (
            <span className="text-xs font-medium text-primary whitespace-nowrap">
              Over {getDaysUntil(event.startDate)} dagen
            </span>
          )}
        </div>

        <h4 className="font-display font-semibold text-foreground text-lg leading-snug">{event.title}</h4>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {event.startDate}
              {event.startTime && ` · ${event.startTime}`}
              {event.endDate && ` — ${event.endDate}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{event.going} leden gaan</span>
          </div>

          {event.rsvpEnabled && !event.isPast && (
            <div className="flex gap-1.5">
              {[
                { status: "going" as const, label: "Ik ga!", variant: "bg-emerald-100 text-emerald-800 border-emerald-300" },
                { status: "maybe" as const, label: "Misschien", variant: "bg-amber-50 text-amber-700 border-amber-200" },
                { status: "not_going" as const, label: "Ik ga niet", variant: "bg-rose-50 text-rose-600 border-rose-200" },
              ].map((btn) => (
                <button
                  key={btn.status}
                  onClick={() => handleRsvp(event.id, btn.status)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                    rsvps[event.id] === btn.status
                      ? `${btn.variant} font-medium ring-1 ring-offset-1`
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-display font-bold text-primary text-sm">PA</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground text-lg leading-tight">Evenementen</h1>
            <p className="text-xs text-muted-foreground">Alle activiteiten op een rij</p>
          </div>
        </div>
      </header>

      <main className="px-5 py-6 max-w-lg mx-auto animate-fade-in">
        {/* Upcoming */}
        {Object.entries(grouped).map(([month, items]) => (
          <div key={month} className="mb-8">
            <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-4">{month}</h3>
            <div className="relative ml-1">
              {items.map((e) => renderEventCard(e, e.id === nextEvent?.id))}
            </div>
          </div>
        ))}

        {/* Past */}
        {Object.keys(pastGrouped).length > 0 && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Afgelopen</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            {Object.entries(pastGrouped).map(([month, items]) => (
              <div key={month} className="mb-8">
                <h3 className="font-display font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-4">{month}</h3>
                <div className="relative ml-1">
                  {items.map((e) => renderEventCard(e, false))}
                </div>
              </div>
            ))}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-40">
        <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MemberEvents;
