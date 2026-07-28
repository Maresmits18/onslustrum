import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Clock, MapPin, Newspaper, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import MemberBottomNav from "@/components/MemberBottomNav";
import MemberHeader from "@/components/MemberHeader";
import NotificationCenter from "@/components/NotificationCenter";
import { eventTypes, paymentStatuses, type EventType, type PaymentStatus } from "@/lib/eventTypes";
import { daysUntil, formatShortDate, formatLongDate } from "@/lib/dates";

const member = { firstName: "Pieter" };

// --- Data ---
const nextEvent = {
  id: 1,
  title: "Lustrumgala",
  type: "gala" as EventType,
  date: "2026-08-22",
  time: "19:00",
  location: "Grand Hotel Karel V",
};

const financieel = {
  pakket: "Pakket 3",
  gespaard: 125,
  totaal: 250,
  status: "gedeeltelijk_betaald" as PaymentStatus,
};

const openPoll = {
  question: "Welk thema voor de afsluitborrel?",
  votes: 142,
};

const upcomingEvents: { id: number; title: string; type: EventType; date: string; rsvp: string | null }[] = [
  { id: 1, title: "Openingsborrel", type: "borrel", date: "2026-08-04", rsvp: "going" },
  { id: 2, title: "ALV", type: "vergadering", date: "2026-08-12", rsvp: null },
  { id: 3, title: "Lustrumreis Praag", type: "reis", date: "2026-08-18", rsvp: "going" },
  { id: 4, title: "Lustrumgala", type: "gala", date: "2026-08-22", rsvp: null },
  { id: 5, title: "Pubquiz", type: "anders", date: "2026-09-03", rsvp: null },
];

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

const MemberHome = () => {
  const navigate = useNavigate();
  const [heroRsvp, setHeroRsvp] = useState<boolean | null>(null);
  const voortgang = Math.round((financieel.gespaard / financieel.totaal) * 100);
  const status = paymentStatuses[financieel.status];
  const heroType = eventTypes[nextEvent.type];
  const HeroIcon = heroType.Icon;
  const days = daysUntil(nextEvent.date);

  return (
    <div className="min-h-screen bg-background pb-24">
      <MemberHeader
        title="Pallas Athena"
        subtitle="Est. 1976 · Lustrum 2026"
        leading={
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-primary text-xs">PA</span>
          </div>
        }
        action={<NotificationCenter />}
      />

      <main className="max-w-lg mx-auto animate-fade-in">
        {/* Greeting */}
        <section className="px-5 pt-5">
          <h2 className="font-display text-2xl font-bold text-foreground leading-tight">
            Hoi {member.firstName}
          </h2>
          <p className="text-sm text-muted-foreground">Dit staat er voor je klaar.</p>
        </section>

        {/* Hero Event */}
        <section className="px-5 pt-4 pb-2">
          <div className={`rounded-2xl bg-gradient-to-br ${heroType.hero} p-5 text-primary-foreground shadow-lg`}>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/20 px-2.5 py-1 text-[11px] font-semibold">
                <Clock className="w-3 h-3" />
                {days === 0 ? "Vandaag" : days === 1 ? "Morgen" : `Nog ${days} dagen`}
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold leading-tight mt-3 flex items-center gap-2">
              <HeroIcon className="w-6 h-6 shrink-0" aria-hidden />
              {nextEvent.title}
            </h3>
            <div className="mt-2 space-y-1 text-sm text-primary-foreground/90">
              <p className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden />
                {formatLongDate(nextEvent.date)} · {nextEvent.time}
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
                {nextEvent.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                type="button"
                aria-pressed={heroRsvp === true}
                onClick={() => setHeroRsvp(heroRsvp === true ? null : true)}
                className={`min-h-[44px] rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                  heroRsvp === true
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/50 hover:bg-primary-foreground/25"
                }`}
              >
                <Check className="w-4 h-4" aria-hidden /> Ik ga mee
              </button>
              <button
                type="button"
                aria-pressed={heroRsvp === false}
                onClick={() => setHeroRsvp(heroRsvp === false ? null : false)}
                className={`min-h-[44px] rounded-xl text-sm font-semibold transition-colors ${
                  heroRsvp === false
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/50 hover:bg-primary-foreground/25"
                }`}
              >
                Niet dit keer
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate("/home/kalender")}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-foreground underline underline-offset-4 min-h-[44px]"
            >
              Bekijk details <ChevronRight className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="px-5 py-3 grid grid-cols-2 gap-3 items-stretch">
          {/* Financieel card */}
          <button
            onClick={() => navigate("/home/financieel")}
            className="glass-card rounded-xl p-4 text-left hover:border-primary/20 transition-all flex flex-col"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Jouw bijdrage</span>
            <p className="font-display font-semibold text-foreground text-sm mt-1.5">{financieel.pakket}</p>
            <div className="mt-auto pt-2">
              <Progress value={voortgang} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-1.5">
                €{financieel.gespaard} van €{financieel.totaal}
              </p>
              <Badge variant="outline" className={`mt-2 text-[10px] px-2 py-0.5 ${status.chip}`}>
                {status.short}
              </Badge>
            </div>
          </button>

          {/* Poll card */}
          {openPoll ? (
            <button
              onClick={() => navigate("/home/feed")}
              className="glass-card rounded-xl p-4 text-left hover:border-primary/20 transition-all group flex flex-col"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Poll open</span>
              <p className="font-display font-semibold text-foreground text-sm mt-1.5 line-clamp-3 leading-snug">{openPoll.question}</p>
              <div className="mt-auto pt-2">
                <p className="text-xs text-muted-foreground">{openPoll.votes} leden gestemd</p>
                <span className="text-xs font-semibold text-primary mt-1 inline-flex items-center gap-0.5 group-hover:underline">
                  Stem nu <ChevronRight className="w-3 h-3" aria-hidden />
                </span>
              </div>
            </button>
          ) : (
            <div className="glass-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <Check className="w-5 h-5 text-success" aria-hidden />
              <p className="text-xs text-success font-medium mt-1">Alle polls beantwoord</p>
            </div>
          )}
        </section>

        {/* Upcoming Events — horizontal scroll */}
        <section className="py-3">
          <div className="flex items-center justify-between px-5 mb-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Agenda</h3>
            <button
              onClick={() => navigate("/home/kalender")}
              className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              Alle events <ChevronRight className="w-3 h-3" aria-hidden />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide edge-fade-x snap-x snap-mandatory">
            {upcomingEvents.map((event) => {
              const t = eventTypes[event.type];
              const Icon = t.Icon;
              return (
                <button
                  key={event.id}
                  onClick={() => navigate("/home/kalender")}
                  className={`glass-card rounded-xl p-3.5 w-[150px] shrink-0 snap-start text-left border-l-[3px] hover:shadow-md transition-all ${t.accent}`}
                >
                  <span className={`inline-flex w-7 h-7 rounded-lg items-center justify-center ${t.tile}`}>
                    <Icon className="w-4 h-4" aria-hidden />
                  </span>
                  <p className="font-display font-semibold text-foreground text-xs mt-2 leading-snug line-clamp-2 min-h-[2.2em]">
                    {event.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">{formatShortDate(event.date)}</p>
                  {event.rsvp === "going" ? (
                    <Badge variant="outline" className="mt-2 text-[10px] px-1.5 py-0 bg-success-soft text-success border-success/20">
                      Je gaat
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-muted-foreground mt-2 inline-block">Nog niet gereageerd</span>
                  )}
                </button>
              );
            })}
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

          <button
            onClick={() => navigate("/home/feed")}
            className="w-full text-center text-sm text-primary font-semibold min-h-[44px] hover:underline"
          >
            Meer nieuws
          </button>
        </section>
      </main>

      <MemberBottomNav />
    </div>
  );
};

export default MemberHome;
