import { useMemo, useState } from "react";
import {
  ChevronRight,
  Info,
  MessageCircle,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import MemberBottomNav from "@/components/MemberBottomNav";
import MemberHeader from "@/components/MemberHeader";
import { formatShortDate, formatLongDate } from "@/lib/dates";

const eur = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

const pot = {
  pakket: "Pakket 3",
  gespaard: 60,
  doel: 2050,
  /** Wat je op vandaag gespaard zou moeten hebben. */
  verwacht: 1366,
  /** Laatste sluitingsdatum van de pot. */
  deadline: "2026-12-31",
  bijgewerkt: "2026-07-04",
};

const spaarplan = [
  { naam: "Lustrumgala", datum: "2026-08-22", bedrag: 750 },
  { naam: "Lustrumreis", datum: "2026-09-18", bedrag: 900 },
  { naam: "Openingsborrel", datum: "2026-08-01", bedrag: 250 },
  { naam: "Slotdiner", datum: "2026-10-03", bedrag: 150 },
];

const betalingen = [
  { datum: "2026-02-15", bedrag: 35, notitie: "Eerste termijn" },
  { datum: "2026-01-01", bedrag: 15, notitie: "Kerstactie bijdrage" },
  { datum: "2025-12-10", bedrag: 10, notitie: "Startbedrag" },
];

const MemberFinancieel = () => {
  const [planOpen, setPlanOpen] = useState(false);

  const { pct, verwachtPct, achterstand, perMaand, maandenTeGaan } = useMemo(() => {
    const pct = Math.min(100, Math.round((pot.gespaard / pot.doel) * 100));
    const verwachtPct = Math.min(100, Math.round((pot.verwacht / pot.doel) * 100));
    const achterstand = pot.verwacht - pot.gespaard;
    const nu = new Date();
    const eind = new Date(pot.deadline);
    const maandenTeGaan = Math.max(
      1,
      (eind.getFullYear() - nu.getFullYear()) * 12 + (eind.getMonth() - nu.getMonth()),
    );
    const perMaand = (pot.doel - pot.gespaard) / maandenTeGaan;
    return { pct, verwachtPct, achterstand, perMaand, maandenTeGaan };
  }, []);

  const opSchema = achterstand <= 0;

  return (
    <div className="min-h-screen bg-background pb-28">
      <MemberHeader
        title="Spaarpot"
        subtitle={`Bijgewerkt ${formatShortDate(pot.bijgewerkt)} · ${pot.pakket}`}
      />

      <main className="px-5 py-5 max-w-lg mx-auto space-y-4 animate-fade-in">
        {/* Hero: hoeveel staat er in de pot */}
        <Card className="border-border/60 overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                  Al gespaard
                </span>
                <p className="font-display text-[2.5rem] leading-none font-bold text-foreground mt-1.5 tabular-nums">
                  {eur(pot.gespaard)}
                </p>
              </div>
              <span className="text-sm text-muted-foreground shrink-0 pb-1 tabular-nums">
                van {eur(pot.doel)}
              </span>
            </div>

            {/* Voortgang met richtlijn-markering */}
            <div className="space-y-2">
              <div className="relative">
                <Progress value={pct} className="h-2.5" />
                <div
                  className="absolute -top-1 h-[18px] w-0.5 rounded-full bg-foreground/50"
                  style={{ left: `${verwachtPct}%` }}
                  aria-hidden
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums">
                <span>{pct}% van je doel</span>
                <span>richtlijn vandaag: {eur(pot.verwacht)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 space-y-1">
              <p
                className={`flex items-center gap-2 text-sm font-semibold ${
                  opSchema ? "text-[hsl(var(--success))]" : "text-primary"
                }`}
              >
                {opSchema ? (
                  <TrendingUp className="w-4 h-4 shrink-0" />
                ) : (
                  <TrendingDown className="w-4 h-4 shrink-0" />
                )}
                {opSchema
                  ? `Je loopt ${eur(Math.abs(achterstand))} voor`
                  : `Je loopt ${eur(achterstand)} achter`}
              </p>
              <p className="text-sm text-muted-foreground">
                Maak{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {eur(perMaand)}
                </span>{" "}
                per maand over om op tijd rond te komen ({maandenTeGaan} maanden te gaan).
              </p>
            </div>
          </div>
        </Card>

        {/* Spaarplan */}
        <Collapsible open={planOpen} onOpenChange={setPlanOpen}>
          <Card className="border-border/60 overflow-hidden">
            <CollapsibleTrigger className="w-full flex items-center gap-3 p-4 text-left min-h-[56px] hover:bg-muted/40 transition-colors">
              <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <PiggyBank className="w-5 h-5 text-primary" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-display font-semibold text-foreground text-sm">
                  Spaarplan
                </span>
                <span className="block text-xs text-muted-foreground">
                  Verdeling over de evenementen
                </span>
              </span>
              <ChevronRight
                className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                  planOpen ? "rotate-90" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="border-t border-border/60 divide-y divide-border/60">
                {spaarplan.map((item) => (
                  <li key={item.naam} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.naam}</p>
                      <p className="text-xs text-muted-foreground">{formatLongDate(item.datum)}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground tabular-nums shrink-0">
                      {eur(item.bedrag)}
                    </span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Betaalhistorie */}
        <section className="space-y-2">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground px-1">
            Jouw betalingen
          </h2>
          <Card className="border-border/60 overflow-hidden">
            {betalingen.length > 0 ? (
              <ul className="divide-y divide-border/60">
                {betalingen.map((p) => (
                  <li key={p.datum} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-9 h-9 rounded-full bg-[hsl(var(--success-soft))] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-[hsl(var(--success))]" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.notitie}</p>
                      <p className="text-xs text-muted-foreground">{formatLongDate(p.datum)}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground tabular-nums shrink-0">
                      +{eur(p.bedrag)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nog geen betalingen geregistreerd
              </p>
            )}
          </Card>
        </section>

        {/* Uitleg + contact */}
        <Card className="border-border/60 bg-muted/30">
          <div className="p-4 space-y-3">
            <p className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
              <Info className="w-4 h-4 shrink-0 mt-px" />
              De richtlijn is het bedrag dat je vandaag gespaard zou moeten hebben om op de
              einddatum je pakket rond te hebben.
            </p>
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-sm font-medium text-foreground">Vragen over je betaling?</p>
              <Button size="sm" variant="outline" className="shrink-0 gap-1.5 min-h-[40px]">
                <MessageCircle className="w-4 h-4" />
                Penningmeester
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <MemberBottomNav />
    </div>
  );
};

export default MemberFinancieel;
