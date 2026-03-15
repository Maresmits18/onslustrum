import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import MemberBottomNav from "@/components/MemberBottomNav";
import NotificationCenter from "@/components/NotificationCenter";

// --- Data ---
const nextEvent = {
  id: 1,
  title: "Lustrumgala",
  type: "gala" as const,
  emoji: "🎭",
  date: "11 april 2026",
  time: "19:00",
  location: "Grand Hotel Karel V",
  daysUntil: 28,
};

const heroGradients: Record<string, string> = {
  gala: "from-[hsl(348,72%,28%)] to-[hsl(348,60%,36%)]",
  borrel: "from-[hsl(38,70%,45%)] to-[hsl(30,65%,50%)]",
  reis: "from-[hsl(150,40%,30%)] to-[hsl(160,35%,38%)]",
  vergadering: "from-[hsl(220,15%,40%)] to-[hsl(220,12%,50%)]",
  anders: "from-[hsl(220,30%,45%)] to-[hsl(220,25%,55%)]",
};

const financieel = {
  pakket: "Pakket 3",
  gespaard: 125,
  totaal: 250,
  status: "gedeeltelijk_betaald",
};

const openPoll = {
  question: "Welk thema voor de afsluitborrel?",
  votes: 142,
};

const upcomingEvents = [
  { id: 1, title: "Openingsborrel", type: "borrel", emoji: "🥂", date: "14 mrt", rsvp: "going" },
  { id: 2, title: "ALV", type: "vergadering", emoji: "📋", date: "18 mrt", rsvp: null },
  { id: 3, title: "Lustrumreis Praag", type: "reis", emoji: "✈️", date: "25 mrt", rsvp: "going" },
  { id: 4, title: "Lustrumgala", type: "gala", emoji: "🎭", date: "11 apr", rsvp: null },
  { id: 5, title: "Pubquiz", type: "anders", emoji: "🎉", date: "18 apr", rsvp: null },
];

const eventBorderColors: Record<string, string> = {
  borrel: "border-l-amber-500",
  gala: "border-l-primary",
  reis: "border-l-emerald-600",
  vergadering: "border-l-slate-400",
  anders: "border-l-blue-500",
};

const newsItems = [
  {
    id: 1,
    commissie: "Lustrumcommissie",
    title: "Lustrumweek programma bekend!",
    excerpt: "Van maandag tot en met vrijdag staat er een vol programma klaar voor alle leden. Check de kalender!",
    date: "10 mrt",
  },
  {
    id: 2,
    commissie: "Bestuur",
    title: "ALV volgende week donderdag",
    excerpt: "De Algemene Ledenvergadering vindt plaats in de Senaatszaal. Vergeet je niet aan te melden.",
    date: "8 mrt",
  },
  {
    id: 3,
    commissie: "Sponsorcommissie",
    title: "Nieuwe sponsor: Bakkerij Van Dijk",
    excerpt: "We zijn trots op onze samenwerking. Leden krijgen 10% korting op alle producten.",
    date: "5 mrt",
  },
];

const statusConfig: Record<string, { label: string; emoji: string; className: string }> = {
  volledig_betaald: { label: "Betaald", emoji: "✅", className: "bg-emerald-100 text-emerald-800" },
  gedeeltelijk_betaald: { label: "Deels betaald", emoji: "⚠️", className: "bg-orange-100 text-orange-800" },
  niet_betaald: { label: "Open", emoji: "❌", className: "bg-red-100 text-red-800" },
  in_afwachting: { label: "In afwachting", emoji: "⏳", className: "bg-amber-100 text-amber-800" },
};

const MemberHome = () => {
  const navigate = useNavigate();
  const [heroRsvp, setHeroRsvp] = useState(false);
  const voortgang = Math.round((financieel.gespaard / financieel.totaal) * 100);
  const status = statusConfig[financieel.status];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border safe-area-top">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-display font-bold text-primary text-xs">PA</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground text-base leading-tight">Pallas Athena</h1>
              <p className="text-[11px] text-muted-foreground">Est. 1976 · Lustrum 2026</p>
            </div>
          </div>
          <button className="relative p-2 rounded-full hover:bg-muted/50 transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto animate-fade-in">
        {/* Hero Event */}
        <section className="px-5 pt-5 pb-2">
          <div className={`rounded-2xl bg-gradient-to-br ${heroGradients[nextEvent.type]} p-5 text-primary-foreground shadow-lg`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-80">Volgende event</span>
            <div className="mt-3 flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-bold leading-tight">{nextEvent.emoji} {nextEvent.title}</h2>
                <p className="text-sm opacity-80">Over {nextEvent.daysUntil} dagen</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs opacity-75">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{nextEvent.date} · {nextEvent.time}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{nextEvent.location}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={() => setHeroRsvp(!heroRsvp)}
                className={`text-xs font-medium ${heroRsvp
                  ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  : "bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/30"
                }`}
              >
                {heroRsvp ? "Ik ga! ✓" : "Ik ga!"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/home/kalender")}
                className="text-xs text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                Details →
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="px-5 py-3 grid grid-cols-2 gap-3">
          {/* Financieel card */}
          <button
            onClick={() => navigate("/home/financieel")}
            className="glass-card rounded-xl p-4 text-left hover:border-primary/20 transition-all group"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Jouw bijdrage</span>
            <p className="font-display font-semibold text-foreground text-sm mt-1.5">{financieel.pakket}</p>
            <Progress value={voortgang} className="h-1.5 mt-2" />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-muted-foreground">€{financieel.gespaard} / €{financieel.totaal}</span>
              <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${status.className} border-0`}>
                {status.emoji}
              </Badge>
            </div>
          </button>

          {/* Poll card */}
          {openPoll ? (
            <button
              onClick={() => navigate("/home/feed")}
              className="glass-card rounded-xl p-4 text-left hover:border-primary/20 transition-all group"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Poll open!</span>
              <p className="font-display font-semibold text-foreground text-sm mt-1.5 line-clamp-2 leading-snug">{openPoll.question}</p>
              <p className="text-xs text-muted-foreground mt-2">{openPoll.votes} leden gestemd</p>
              <span className="text-xs font-medium text-primary mt-1 inline-block group-hover:underline">Stem nu →</span>
            </button>
          ) : (
            <div className="glass-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-lg">✓</span>
              <p className="text-xs text-emerald-700 font-medium mt-1">Alle polls beantwoord</p>
            </div>
          )}
        </section>

        {/* Upcoming Events — horizontal scroll */}
        <section className="py-3">
          <div className="flex items-center justify-between px-5 mb-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Agenda</h3>
            <button onClick={() => navigate("/home/kalender")} className="text-xs text-primary font-medium hover:underline">
              Alle events →
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
            {upcomingEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate("/home/kalender")}
                className={`glass-card rounded-xl p-3.5 min-w-[140px] max-w-[140px] text-left border-l-[3px] shrink-0 hover:shadow-md transition-all ${eventBorderColors[event.type]}`}
              >
                <span className="text-lg">{event.emoji}</span>
                <p className="font-display font-semibold text-foreground text-xs mt-1.5 leading-snug line-clamp-2">{event.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{event.date}</p>
                {event.rsvp === "going" ? (
                  <Badge variant="outline" className="mt-2 text-[9px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border-emerald-200">
                    Je gaat ✓
                  </Badge>
                ) : (
                  <span className="text-[9px] text-muted-foreground mt-2 inline-block">Nog niet gereageerd</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* News */}
        <section className="px-5 py-3 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5" /> Nieuws
            </h3>
          </div>

          {newsItems.map((item) => (
            <article
              key={item.id}
              className="glass-card rounded-xl p-4 space-y-1.5 hover:border-primary/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-primary">{item.commissie}</span>
                <span className="text-[11px] text-muted-foreground">{item.date}</span>
              </div>
              <h4 className="font-display font-semibold text-foreground text-sm leading-snug">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.excerpt}</p>
            </article>
          ))}

          <button onClick={() => navigate("/home/feed")} className="w-full text-center text-xs text-primary font-medium py-2 hover:underline">
            Meer nieuws →
          </button>
        </section>
      </main>

      <MemberBottomNav />
    </div>
  );
};

export default MemberHome;
