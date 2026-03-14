import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MemberBottomNav from "@/components/MemberBottomNav";

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

const typeBorderColors: Record<string, string> = {
  borrel: "border-l-amber-500",
  gala: "border-l-primary",
  reis: "border-l-emerald-600",
  vergadering: "border-l-slate-400",
  anders: "border-l-blue-500",
};

const typeColors: Record<string, string> = {
  borrel: "bg-amber-100 text-amber-800 border-amber-200",
  gala: "bg-primary/10 text-primary border-primary/20",
  reis: "bg-emerald-100 text-emerald-800 border-emerald-200",
  vergadering: "bg-slate-100 text-slate-700 border-slate-200",
  anders: "bg-blue-100 text-blue-700 border-blue-200",
};

const events: Event[] = [
  { id: 1, title: "Openingsborrel Lustrum", type: "borrel", emoji: "🥂", startDate: "14 maart 2026", startTime: "20:00", location: "Café De Kroeg", description: "Aftrap van de lustrumweek met een gezellige borrel.", going: 87, rsvpEnabled: true, month: "Maart 2026", isPast: false },
  { id: 2, title: "ALV & Bestuurswissel", type: "vergadering", emoji: "📋", startDate: "18 maart 2026", startTime: "19:30", location: "Senaatszaal, Academiegebouw", description: "Algemene Ledenvergadering met verkiezing nieuw bestuur.", going: 56, rsvpEnabled: true, month: "Maart 2026", isPast: false },
  { id: 3, title: "Lustrumreis Praag", type: "reis", emoji: "✈️", startDate: "25 maart 2026", endDate: "29 maart 2026", location: "Praag, Tsjechië", description: "Vijf dagen Praag met het hele dispuut.", going: 34, rsvpEnabled: true, month: "Maart 2026", isPast: false },
  { id: 4, title: "Lustrumgala", type: "gala", emoji: "🎭", startDate: "11 april 2026", startTime: "19:00", location: "Grand Hotel Karel V", description: "Het hoogtepunt van het lustrum. Black tie.", going: 112, rsvpEnabled: true, month: "April 2026", isPast: false },
  { id: 5, title: "Pubquiz", type: "anders", emoji: "🎉", startDate: "18 april 2026", startTime: "20:30", location: "Café Ledig Erf", description: "Teams van 4. Prijzen voor de winnaars!", going: 48, rsvpEnabled: true, month: "April 2026", isPast: false },
  { id: 6, title: "Nieuwjaarsborrel", type: "borrel", emoji: "🥂", startDate: "10 januari 2026", startTime: "21:00", location: "Café De Kroeg", description: "Proost op het nieuwe jaar!", going: 65, rsvpEnabled: false, month: "Januari 2026", isPast: true },
  { id: 7, title: "Commissievergadering", type: "vergadering", emoji: "📋", startDate: "5 februari 2026", startTime: "18:00", location: "Bestuurskamer", description: "Voortgang lustrumcommissies bespreken.", going: 12, rsvpEnabled: false, month: "Februari 2026", isPast: true },
];

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

const MemberEvents = () => {
  const navigate = useNavigate();
  const [rsvps, setRsvps] = useState<Record<number, RsvpStatus>>({});

  const nextEvent = events.find((e) => !e.isPast);
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
    <div key={event.id} className={`relative pl-8 pb-6 last:pb-0 ${event.isPast ? "opacity-50" : ""}`}>
      {/* Timeline line & dot */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
      <div className={`absolute left-[-3.5px] top-2 w-2 h-2 rounded-full border-2 border-background ${
        isNext ? "bg-primary ring-2 ring-primary/30" : event.isPast ? "bg-muted-foreground/40" : "bg-border"
      }`} />

      <div className={`glass-card rounded-xl p-4 space-y-2.5 border-l-[3px] transition-all ${typeBorderColors[event.type]} ${
        isNext ? "ring-1 ring-primary/20 shadow-md" : ""
      }`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">{event.emoji}</span>
            <Badge variant="outline" className={`text-[10px] ${typeColors[event.type]}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
            {isNext && (
              <Badge className="bg-primary text-primary-foreground text-[9px] uppercase tracking-wider px-1.5 py-0">
                Volgende
              </Badge>
            )}
          </div>
          {isNext && (
            <span className="text-[11px] font-medium text-primary whitespace-nowrap">
              Over {getDaysUntil(event.startDate)} dagen
            </span>
          )}
        </div>

        <h4 className="font-display font-semibold text-foreground text-base leading-snug">{event.title}</h4>

        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>{event.startDate}{event.startTime && ` · ${event.startTime}`}{event.endDate && ` — ${event.endDate}`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{event.going} leden gaan</span>
          </div>

          {event.rsvpEnabled && !event.isPast && (
            <div className="flex gap-1">
              {[
                { status: "going" as const, label: "Ik ga!", active: "bg-emerald-100 text-emerald-800 border-emerald-300 ring-1 ring-emerald-200" },
                { status: "maybe" as const, label: "Misschien", active: "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-200" },
                { status: "not_going" as const, label: "Nee", active: "bg-rose-50 text-rose-600 border-rose-200 ring-1 ring-rose-200" },
              ].map((btn) => (
                <button
                  key={btn.status}
                  onClick={() => handleRsvp(event.id, btn.status)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                    rsvps[event.id] === btn.status
                      ? `${btn.active} font-medium`
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
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border safe-area-top">
        <div className="flex items-center gap-3 px-5 py-3">
          <button onClick={() => navigate("/home")} className="p-1 -ml-1 rounded-md hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display font-bold text-foreground text-base leading-tight">Kalender</h1>
            <p className="text-[11px] text-muted-foreground">Alle activiteiten op een rij</p>
          </div>
        </div>
      </header>

      <main className="px-5 py-6 max-w-lg mx-auto animate-fade-in">
        {Object.entries(grouped).map(([month, items]) => (
          <div key={month} className="mb-6">
            <h3 className="font-display font-semibold text-foreground text-[11px] uppercase tracking-[0.15em] mb-4">{month}</h3>
            <div className="relative ml-1">
              {items.map((e) => renderEventCard(e, e.id === nextEvent?.id))}
            </div>
          </div>
        ))}

        {Object.keys(pastGrouped).length > 0 && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">Afgelopen</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            {Object.entries(pastGrouped).map(([month, items]) => (
              <div key={month} className="mb-6">
                <h3 className="font-display font-semibold text-muted-foreground text-[11px] uppercase tracking-[0.15em] mb-4">{month}</h3>
                <div className="relative ml-1">
                  {items.map((e) => renderEventCard(e, false))}
                </div>
              </div>
            ))}
          </>
        )}
      </main>

      <MemberBottomNav />
    </div>
  );
};

export default MemberEvents;
