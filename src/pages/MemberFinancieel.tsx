import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MemberBottomNav from "@/components/MemberBottomNav";

const profile = {
  pakket: "Pakket 3",
  gespaard: 125,
  totaal: 250,
  status: "gedeeltelijk_betaald",
};

const statusConfig: Record<string, { label: string; emoji: string; className: string }> = {
  volledig_betaald: { label: "Volledig betaald", emoji: "✅", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  in_afwachting: { label: "In afwachting", emoji: "⏳", className: "bg-amber-100 text-amber-800 border-amber-200" },
  gedeeltelijk_betaald: { label: "Gedeeltelijk betaald", emoji: "⚠️", className: "bg-orange-100 text-orange-800 border-orange-200" },
  niet_betaald: { label: "Niet betaald", emoji: "❌", className: "bg-red-100 text-red-800 border-red-200" },
};

const paymentHistory = [
  { datum: "15 feb 2026", bedrag: 50, notitie: "Eerste termijn" },
  { datum: "1 jan 2026", bedrag: 50, notitie: "Kerstactie bijdrage" },
  { datum: "10 dec 2025", bedrag: 25, notitie: "Startbedrag" },
];

const MemberFinancieel = () => {
  const navigate = useNavigate();
  const voortgang = Math.round((profile.gespaard / profile.totaal) * 100);
  const status = statusConfig[profile.status];

  const motivatie = voortgang >= 75
    ? "Je bent er bijna! 🎉"
    : voortgang >= 50
      ? "Goed bezig! 💪"
      : "Je bent net begonnen!";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border safe-area-top">
        <div className="flex items-center gap-3 px-5 py-3">
          <button onClick={() => navigate("/home")} className="p-1 -ml-1 rounded-md hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display font-bold text-foreground text-base">Financieel</h1>
        </div>
      </header>

      <main className="px-5 py-6 max-w-lg mx-auto space-y-5 animate-fade-in">
        {/* Hero card */}
        <Card className="glass-card border-border/50 overflow-hidden">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Jouw bijdrage</span>
                <h2 className="font-display text-2xl font-bold text-foreground mt-1">{profile.pakket}</h2>
              </div>
              <Badge variant="outline" className={`${status.className} border text-xs`}>
                {status.emoji} {status.label}
              </Badge>
            </div>

            <div className="space-y-2">
              <Progress value={voortgang} className="h-3" />
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold text-foreground">
                  €{profile.gespaard} <span className="text-sm font-normal text-muted-foreground">/ €{profile.totaal}</span>
                </span>
                <span className="text-xs text-muted-foreground">{voortgang}%</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground italic">{motivatie}</p>
          </div>
        </Card>

        {/* Payment history */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Betaalhistorie</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-display text-xs">Datum</TableHead>
                    <TableHead className="font-display text-xs">Bedrag</TableHead>
                    <TableHead className="font-display text-xs">Notitie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm">{p.datum}</TableCell>
                      <TableCell className="text-sm font-medium">€{p.bedrag.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.notitie}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Nog geen betalingen geregistreerd</p>
            )}
          </CardContent>
        </Card>

        {/* Contact card */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-foreground text-sm">Vragen over je betaling?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Neem contact op met de penningmeester</p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0 gap-1.5 border-primary/30 text-primary hover:bg-primary/5">
              <MessageCircle className="w-3.5 h-3.5" />
              Contact
            </Button>
          </CardContent>
        </Card>
      </main>

      <MemberBottomNav />
    </div>
  );
};

export default MemberFinancieel;
