import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Clock, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import OwnerSidebar from "@/components/OwnerSidebar";

type EventType = "borrel" | "gala" | "reis" | "vergadering" | "anders";

interface Event {
  id: number;
  title: string;
  type: EventType;
  emoji: string;
  startDate: string;
  startTime?: string;
  endDate?: string;
  location: string;
  description: string;
  going: number;
  goingNames: string[];
  rsvpEnabled: boolean;
  maxParticipants?: number;
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

const emojiMap: Record<EventType, string> = {
  borrel: "🥂",
  gala: "🎭",
  reis: "✈️",
  vergadering: "📋",
  anders: "🎉",
};

const initialEvents: Event[] = [
  { id: 1, title: "Openingsborrel Lustrum", type: "borrel", emoji: "🥂", startDate: "14 maart 2026", startTime: "20:00", location: "Café De Kroeg", description: "Aftrap van de lustrumweek met een gezellige borrel.", going: 87, goingNames: ["Pieter de Vries", "Sophie Jansen", "Thomas Bakker", "Emma Visser", "Lars Mulder"], rsvpEnabled: true, month: "Maart 2026", isPast: false },
  { id: 2, title: "ALV & Bestuurswissel", type: "vergadering", emoji: "📋", startDate: "18 maart 2026", startTime: "19:30", location: "Senaatszaal", description: "Algemene Ledenvergadering met verkiezing nieuw bestuur.", going: 56, goingNames: ["Anna de Groot", "Bram Hendriks", "Clara Smit"], rsvpEnabled: true, month: "Maart 2026", isPast: false },
  { id: 3, title: "Lustrumreis Praag", type: "reis", emoji: "✈️", startDate: "25 maart 2026", endDate: "29 maart 2026", location: "Praag, Tsjechië", description: "Vijf dagen Praag met het hele dispuut.", going: 34, goingNames: ["Daan Willems", "Eva Bosman"], rsvpEnabled: true, maxParticipants: 40, month: "Maart 2026", isPast: false },
  { id: 4, title: "Lustrumgala", type: "gala", emoji: "🎭", startDate: "11 april 2026", startTime: "19:00", location: "Grand Hotel Karel V", description: "Het hoogtepunt van het lustrum. Black tie.", going: 112, goingNames: ["Fenna Dekker", "Gijs van Dijk", "Hannah Meijer", "Iris Scholten"], rsvpEnabled: true, month: "April 2026", isPast: false },
  { id: 5, title: "Nieuwjaarsborrel", type: "borrel", emoji: "🥂", startDate: "10 januari 2026", startTime: "21:00", location: "Café De Kroeg", description: "Proost op het nieuwe jaar!", going: 65, goingNames: [], rsvpEnabled: false, month: "Januari 2026", isPast: true },
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

const OwnerKalender = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [attendeesEvent, setAttendeesEvent] = useState<Event | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<EventType>("borrel");
  const [formStartDate, setFormStartDate] = useState("");
  const [formStartTime, setFormStartTime] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formMaxParticipants, setFormMaxParticipants] = useState("");
  const [formRsvp, setFormRsvp] = useState(true);

  const resetForm = () => {
    setFormTitle(""); setFormType("borrel"); setFormStartDate(""); setFormStartTime("");
    setFormEndDate(""); setFormLocation(""); setFormDescription(""); setFormMaxParticipants(""); setFormRsvp(true);
    setEditingEvent(null);
  };

  const openEdit = (event: Event) => {
    setEditingEvent(event);
    setFormTitle(event.title); setFormType(event.type); setFormStartDate(event.startDate);
    setFormStartTime(event.startTime || ""); setFormEndDate(event.endDate || "");
    setFormLocation(event.location); setFormDescription(event.description);
    setFormMaxParticipants(event.maxParticipants?.toString() || ""); setFormRsvp(event.rsvpEnabled);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formTitle || !formStartDate) return;
    const newEvent: Event = {
      id: editingEvent?.id || Date.now(),
      title: formTitle, type: formType, emoji: emojiMap[formType],
      startDate: formStartDate, startTime: formStartTime || undefined,
      endDate: formEndDate || undefined, location: formLocation,
      description: formDescription, going: editingEvent?.going || 0,
      goingNames: editingEvent?.goingNames || [],
      rsvpEnabled: formRsvp, maxParticipants: formMaxParticipants ? parseInt(formMaxParticipants) : undefined,
      month: formStartDate.split(" ").slice(1).join(" ").replace(/^\w/, (c) => c.toUpperCase()),
      isPast: false,
    };
    if (editingEvent) {
      setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? newEvent : e)));
    } else {
      setEvents((prev) => [...prev, newEvent]);
    }
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const nextEvent = events.find((e) => !e.isPast);
  const upcomingEvents = events.filter((e) => !e.isPast);
  const pastEvents = events.filter((e) => e.isPast);

  const grouped = upcomingEvents.reduce<Record<string, Event[]>>((acc, e) => {
    (acc[e.month] = acc[e.month] || []).push(e);
    return acc;
  }, {});

  const pastGrouped = pastEvents.reduce<Record<string, Event[]>>((acc, e) => {
    (acc[e.month] = acc[e.month] || []).push(e);
    return acc;
  }, {});

  const renderEventCard = (event: Event, isNext: boolean) => (
    <div key={event.id} className={`relative pl-8 pb-8 last:pb-0 ${event.isPast ? "opacity-50" : ""}`}>
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
      <div className={`absolute left-[-4px] top-2 w-[9px] h-[9px] rounded-full border-2 border-background ${typeDotColors[event.type]}`} />

      <div className={`glass-card rounded-xl p-5 space-y-3 transition-all ${isNext ? "ring-2 ring-primary/30 shadow-md" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl">{event.emoji}</span>
            <Badge variant="outline" className={`text-xs ${typeColors[event.type]}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
            {isNext && (
              <Badge className="bg-primary text-primary-foreground text-[10px] uppercase tracking-wider">
                Volgende
              </Badge>
            )}
            {isNext && (
              <span className="text-xs font-medium text-primary">
                Over {getDaysUntil(event.startDate)} dagen
              </span>
            )}
          </div>
          {!event.isPast && (
            <div className="flex gap-1">
              <button onClick={() => openEdit(event)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(event.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <h4 className="font-display font-semibold text-foreground text-lg leading-snug">{event.title}</h4>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{event.startDate}{event.startTime && ` · ${event.startTime}`}{event.endDate && ` — ${event.endDate}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setAttendeesEvent(event)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="underline-offset-2 hover:underline">{event.going} leden gaan</span>
            {event.maxParticipants && <span className="text-muted-foreground/60">/ {event.maxParticipants} max</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <OwnerSidebar />

      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-8 py-5">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Kalender</h1>
              <p className="text-sm text-muted-foreground">Evenementen beheren</p>
            </div>
            <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2">
              <Plus className="w-4 h-4" />
              Evenement toevoegen
            </Button>
          </div>
        </header>

        <main className="px-8 py-6 max-w-3xl animate-fade-in">
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month} className="mb-8">
              <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-4">{month}</h3>
              <div className="relative ml-1">
                {items.map((e) => renderEventCard(e, e.id === nextEvent?.id))}
              </div>
            </div>
          ))}

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
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); resetForm(); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{editingEvent ? "Evenement bewerken" : "Nieuw evenement"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Titel</Label>
              <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Naam van het evenement" />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={formType} onValueChange={(v) => setFormType(v as EventType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="borrel">🥂 Borrel</SelectItem>
                  <SelectItem value="gala">🎭 Gala</SelectItem>
                  <SelectItem value="reis">✈️ Reis</SelectItem>
                  <SelectItem value="vergadering">📋 Vergadering</SelectItem>
                  <SelectItem value="anders">🎉 Anders</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Startdatum</Label>
                <Input value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} placeholder="14 maart 2026" />
              </div>
              <div className="space-y-1.5">
                <Label>Tijd</Label>
                <Input value={formStartTime} onChange={(e) => setFormStartTime(e.target.value)} placeholder="20:00" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Einddatum (optioneel)</Label>
              <Input value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} placeholder="Voor meerdaagse events" />
            </div>
            <div className="space-y-1.5">
              <Label>Locatie</Label>
              <Input value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="Waar vindt het plaats?" />
            </div>
            <div className="space-y-1.5">
              <Label>Beschrijving</Label>
              <Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Korte beschrijving..." rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Max deelnemers (optioneel)</Label>
              <Input type="number" value={formMaxParticipants} onChange={(e) => setFormMaxParticipants(e.target.value)} placeholder="Geen limiet" />
            </div>
            <div className="flex items-center justify-between">
              <Label>RSVP inschakelen</Label>
              <Switch checked={formRsvp} onCheckedChange={setFormRsvp} />
            </div>
            <Button onClick={handleSave} className="w-full">{editingEvent ? "Opslaan" : "Toevoegen"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attendees Sheet */}
      <Sheet open={!!attendeesEvent} onOpenChange={(open) => { if (!open) setAttendeesEvent(null); }}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="font-display">Deelnemers — {attendeesEvent?.title}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-2">
            <p className="text-sm text-muted-foreground mb-4">{attendeesEvent?.going} leden gaan</p>
            {attendeesEvent?.goingNames.map((name, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-display font-bold text-primary">
                    {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <span className="text-sm text-foreground">{name}</span>
              </div>
            ))}
            {attendeesEvent && attendeesEvent.going > attendeesEvent.goingNames.length && (
              <p className="text-xs text-muted-foreground pt-2">
                en {attendeesEvent.going - attendeesEvent.goingNames.length} anderen...
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OwnerKalender;
