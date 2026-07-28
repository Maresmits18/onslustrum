import { GlassWater, Sparkles, Plane, ClipboardList, PartyPopper, type LucideIcon } from "lucide-react";

export type EventType = "borrel" | "gala" | "reis" | "vergadering" | "anders";

interface EventTypeStyle {
  label: string;
  Icon: LucideIcon;
  /** Badge / chip styling */
  chip: string;
  /** Left accent border */
  accent: string;
  /** Icon tile styling */
  tile: string;
  /** Hero gradient */
  hero: string;
}

export const eventTypes: Record<EventType, EventTypeStyle> = {
  borrel: {
    label: "Borrel",
    Icon: GlassWater,
    chip: "bg-event-borrel-soft text-event-borrel border-event-borrel/20",
    accent: "border-l-event-borrel",
    tile: "bg-event-borrel-soft text-event-borrel",
    hero: "from-[hsl(var(--event-borrel))] to-[hsl(38_65%_46%)]",
  },
  gala: {
    label: "Gala",
    Icon: Sparkles,
    chip: "bg-event-gala-soft text-event-gala border-event-gala/20",
    accent: "border-l-event-gala",
    tile: "bg-event-gala-soft text-event-gala",
    hero: "from-[hsl(var(--event-gala))] to-[hsl(348_60%_38%)]",
  },
  reis: {
    label: "Reis",
    Icon: Plane,
    chip: "bg-event-reis-soft text-event-reis border-event-reis/20",
    accent: "border-l-event-reis",
    tile: "bg-event-reis-soft text-event-reis",
    hero: "from-[hsl(var(--event-reis))] to-[hsl(158_40%_34%)]",
  },
  vergadering: {
    label: "Vergadering",
    Icon: ClipboardList,
    chip: "bg-event-vergadering-soft text-event-vergadering border-event-vergadering/20",
    accent: "border-l-event-vergadering",
    tile: "bg-event-vergadering-soft text-event-vergadering",
    hero: "from-[hsl(var(--event-vergadering))] to-[hsl(220_12%_46%)]",
  },
  anders: {
    label: "Anders",
    Icon: PartyPopper,
    chip: "bg-event-anders-soft text-event-anders border-event-anders/20",
    accent: "border-l-event-anders",
    tile: "bg-event-anders-soft text-event-anders",
    hero: "from-[hsl(var(--event-anders))] to-[hsl(215_48%_50%)]",
  },
};

export type PaymentStatus =
  | "volledig_betaald"
  | "gedeeltelijk_betaald"
  | "niet_betaald"
  | "in_afwachting";

export const paymentStatuses: Record<PaymentStatus, { label: string; short: string; chip: string }> = {
  volledig_betaald: {
    label: "Volledig betaald",
    short: "Betaald",
    chip: "bg-success-soft text-success border-success/20",
  },
  gedeeltelijk_betaald: {
    label: "Gedeeltelijk betaald",
    short: "Deels betaald",
    chip: "bg-warning-soft text-warning border-warning/20",
  },
  niet_betaald: {
    label: "Niet betaald",
    short: "Open",
    chip: "bg-destructive/10 text-destructive border-destructive/20",
  },
  in_afwachting: {
    label: "In afwachting",
    short: "In afwachting",
    chip: "bg-muted text-muted-foreground border-border",
  },
};