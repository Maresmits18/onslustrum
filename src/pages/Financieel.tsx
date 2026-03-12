import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  LayoutDashboard, Users, Newspaper, Settings, Calendar, LogOut,
  PiggyBank, TrendingUp, Receipt, Target, Send, Plus, Upload,
  Euro, CheckCircle2, Clock, AlertCircle, Wallet,
} from "lucide-react";

/* ── Sidebar ── */
const sidebarItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/dashboard/financieel", icon: PiggyBank, label: "Financieel", active: true },
  { path: "/dashboard", icon: Users, label: "Leden" },
  { path: "/dashboard", icon: Newspaper, label: "Nieuws" },
  { path: "/dashboard", icon: Calendar, label: "Kalender" },
  { path: "/dashboard", icon: Settings, label: "Instellingen" },
];

/* ── Placeholder data ── */
const budgetCategories = [
  { name: "Gala", budget: 3000, spent: 800, color: "bg-primary" },
  { name: "Reis", budget: 4000, spent: 1200, color: "bg-chart-2" },
  { name: "Borrel", budget: 1000, spent: 100, color: "bg-chart-3" },
  { name: "Gadgets", budget: 1500, spent: 0, color: "bg-chart-4" },
  { name: "Oudleden contributie", budget: 500, spent: 0, color: "bg-chart-5" },
];

const totalBudget = 10000;
const totalSaved = 4250;
const totalSpent = 2100;

const memberPayments = [
  { name: "Pieter de Vries", t1: 50, t2: 50, t3: 0, total: 100, goal: 150, status: "openstaand" },
  { name: "Sophie Jansen", t1: 50, t2: 50, t3: 50, total: 150, goal: 150, status: "betaald" },
  { name: "Thomas Bakker", t1: 50, t2: 50, t3: 50, total: 150, goal: 150, status: "betaald" },
  { name: "Emma Visser", t1: 50, t2: 0, t3: 0, total: 50, goal: 150, status: "openstaand" },
  { name: "Lotte Mulder", t1: 50, t2: 50, t3: 50, total: 150, goal: 150, status: "betaald" },
  { name: "Jan van Dijk", t1: 0, t2: 0, t3: 0, total: 0, goal: 150, status: "in afwachting" },
  { name: "Maria de Boer", t1: 50, t2: 50, t3: 0, total: 100, goal: 150, status: "openstaand" },
  { name: "Daan Smit", t1: 50, t2: 50, t3: 50, total: 150, goal: 150, status: "betaald" },
];

const expenses = [
  { date: "2026-03-01", category: "Gala", description: "Locatiehuur deposit", amount: 500, by: "Thomas Bakker" },
  { date: "2026-02-20", category: "Gala", description: "DJ boeking", amount: 300, by: "Thomas Bakker" },
  { date: "2026-02-15", category: "Reis", description: "Vliegtickets (aanbetaling)", amount: 1200, by: "Sophie Jansen" },
  { date: "2026-01-28", category: "Borrel", description: "Drankjes nieuwjaarsborrel", amount: 100, by: "Pieter de Vries" },
];

const fmt = (n: number) => `€${n.toLocaleString("nl-NL")}`;

/* ── Donut chart (pure SVG) ── */
const DonutChart = () => {
  const data = budgetCategories;
  const total = data.reduce((s, c) => s + c.budget, 0);
  const colors = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
  let cum = 0;

  const arcs = data.map((cat, i) => {
    const pct = cat.budget / total;
    const start = cum;
    cum += pct;
    const startAngle = start * 2 * Math.PI - Math.PI / 2;
    const endAngle = cum * 2 * Math.PI - Math.PI / 2;
    const largeArc = pct > 0.5 ? 1 : 0;
    const r = 80;
    const x1 = 100 + r * Math.cos(startAngle);
    const y1 = 100 + r * Math.sin(startAngle);
    const x2 = 100 + r * Math.cos(endAngle);
    const y2 = 100 + r * Math.sin(endAngle);
    return (
      <path
        key={cat.name}
        d={`M 100 100 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={colors[i]}
        className="transition-opacity hover:opacity-80"
      />
    );
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 200 200" className="w-48 h-48">
        {arcs}
        <circle cx="100" cy="100" r="45" className="fill-card" />
        <text x="100" y="96" textAnchor="middle" className="fill-foreground text-xs font-display font-bold" style={{ fontSize: 14 }}>
          {fmt(totalBudget)}
        </text>
        <text x="100" y="112" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>
          totaal budget
        </text>
      </svg>
      <div className="flex flex-wrap gap-3 justify-center">
        {data.map((cat, i) => (
          <div key={cat.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i] }} />
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Component ── */
const Financieel = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("alle");

  const filteredMembers = memberPayments.filter((m) => {
    if (filter === "alle") return true;
    return m.status === filter;
  });

  const paidCount = 98;
  const totalMembers = 142;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-display font-bold text-primary text-sm">PA</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground leading-tight">Pallas Athena</h1>
            <p className="text-xs text-muted-foreground">Beheerder</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Uitloggen</span>
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
          {/* Header */}
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Financieel overzicht</h2>
            <p className="text-muted-foreground text-sm mt-1">Budget, betalingen en uitgaven</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overzicht" className="space-y-6">
            <TabsList className="bg-muted/60 p-1 rounded-lg">
              <TabsTrigger value="overzicht" className="font-display text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-md">Overzicht</TabsTrigger>
              <TabsTrigger value="per-lid" className="font-display text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-md">Per lid</TabsTrigger>
              <TabsTrigger value="uitgaven" className="font-display text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-md">Uitgaven</TabsTrigger>
              <TabsTrigger value="budgetplan" className="font-display text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-md">Budgetplan</TabsTrigger>
            </TabsList>

            {/* ═══ TAB 1: Overzicht ═══ */}
            <TabsContent value="overzicht" className="space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Totaal gespaard", value: fmt(totalSaved), icon: PiggyBank, accent: "text-primary" },
                  { label: "Totaal budget", value: fmt(totalBudget), icon: Target, accent: "text-chart-2" },
                  { label: "Totaal uitgegeven", value: fmt(totalSpent), icon: Receipt, accent: "text-chart-3" },
                  { label: "Resterend", value: fmt(totalBudget - totalSpent), icon: TrendingUp, accent: "text-chart-4" },
                ].map((s) => (
                  <div key={s.label} className="glass-card rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
                      <s.icon className={`w-5 h-5 ${s.accent}`} />
                    </div>
                    <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="glass-card rounded-xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground">Spaardoel</h3>
                  <span className="text-sm text-muted-foreground">{fmt(totalSaved)} / {fmt(totalBudget)}</span>
                </div>
                <Progress value={(totalSaved / totalBudget) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground">{Math.round((totalSaved / totalBudget) * 100)}% van het doel bereikt</p>
              </div>

              {/* Donut + Betaalstatus */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Budgetverdeling</h3>
                  <DonutChart />
                </div>
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Betaalstatus leden</h3>
                  <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] gap-4">
                    <div className="relative w-36 h-36">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" className="stroke-muted" strokeWidth="10" />
                        <circle
                          cx="50" cy="50" r="40" fill="none" className="stroke-primary" strokeWidth="10"
                          strokeDasharray={`${(paidCount / totalMembers) * 251.2} 251.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-display text-2xl font-bold text-foreground">{paidCount}</span>
                        <span className="text-xs text-muted-foreground">/ {totalMembers}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{Math.round((paidCount / totalMembers) * 100)}%</span> van de leden heeft betaald
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ═══ TAB 2: Per lid ═══ */}
            <TabsContent value="per-lid" className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-48 bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle leden</SelectItem>
                    <SelectItem value="betaald">Betaald</SelectItem>
                    <SelectItem value="openstaand">Openstaand</SelectItem>
                    <SelectItem value="in afwachting">In afwachting</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="font-display text-sm">
                  <Send className="w-4 h-4 mr-2" />
                  Stuur herinnering aan alle openstaande leden
                </Button>
              </div>

              <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Naam</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Termijn 1</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Termijn 2</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Termijn 3</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Totaal</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Voortgang</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((m) => (
                      <TableRow key={m.name} className="border-border">
                        <TableCell className="font-medium text-foreground">{m.name}</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">{m.t1 ? fmt(m.t1) : "—"}</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">{m.t2 ? fmt(m.t2) : "—"}</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">{m.t3 ? fmt(m.t3) : "—"}</TableCell>
                        <TableCell className="text-right font-display font-semibold text-foreground">{fmt(m.total)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={m.status === "betaald" ? "default" : m.status === "openstaand" ? "destructive" : "secondary"}
                            className="text-xs capitalize"
                          >
                            {m.status === "betaald" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {m.status === "openstaand" && <AlertCircle className="w-3 h-3 mr-1" />}
                            {m.status === "in afwachting" && <Clock className="w-3 h-3 mr-1" />}
                            {m.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right w-28">
                          <div className="flex items-center gap-2">
                            <Progress value={(m.total / m.goal) * 100} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground w-8 text-right">{Math.round((m.total / m.goal) * 100)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {m.status !== "betaald" && (
                            <Button size="sm" variant="ghost" className="text-xs text-primary hover:text-primary">
                              <Send className="w-3 h-3" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* ═══ TAB 3: Uitgaven ═══ */}
            <TabsContent value="uitgaven" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display text-lg font-semibold text-foreground">Alle uitgaven</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="font-display text-sm">
                      <Plus className="w-4 h-4 mr-2" /> Uitgave toevoegen
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-display">Nieuwe uitgave</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Categorie</Label>
                        <Select>
                          <SelectTrigger className="bg-background"><SelectValue placeholder="Kies categorie" /></SelectTrigger>
                          <SelectContent>
                            {budgetCategories.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Omschrijving</Label>
                        <Input placeholder="Wat is er betaald?" className="bg-background" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Bedrag</Label>
                          <div className="relative">
                            <Euro className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input type="number" placeholder="0.00" className="pl-9 bg-background" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Datum</Label>
                          <Input type="date" className="bg-background" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Betaald door</Label>
                        <Input placeholder="Naam" className="bg-background" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Bonnetje</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
                          <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Klik om een bestand te uploaden</p>
                        </div>
                      </div>
                      <Button className="w-full font-display">Opslaan</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Datum</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Categorie</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Omschrijving</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Bedrag</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Toegevoegd door</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((e, i) => (
                      <TableRow key={i} className="border-border">
                        <TableCell className="text-sm text-muted-foreground">{new Date(e.date).toLocaleDateString("nl-NL")}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{e.category}</Badge></TableCell>
                        <TableCell className="text-sm text-foreground">{e.description}</TableCell>
                        <TableCell className="text-right font-display font-semibold text-foreground">{fmt(e.amount)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{e.by}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Category totals */}
              <div className="glass-card rounded-xl p-5">
                <h4 className="font-display font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Totaal per categorie</h4>
                <div className="space-y-2">
                  {budgetCategories.filter((c) => c.spent > 0).map((c) => (
                    <div key={c.name} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{c.name}</span>
                      <span className="font-display font-semibold text-foreground">{fmt(c.spent)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 flex items-center justify-between text-sm font-semibold">
                    <span className="text-foreground">Totaal</span>
                    <span className="font-display text-foreground">{fmt(totalSpent)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ═══ TAB 4: Budgetplan ═══ */}
            <TabsContent value="budgetplan" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgetCategories.map((cat) => {
                  const remaining = cat.budget - cat.spent;
                  const pct = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
                  return (
                    <div key={cat.name} className="glass-card rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-semibold text-foreground uppercase tracking-wider text-sm">{cat.name}</h4>
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Budget</span><span className="font-display font-semibold text-foreground">{fmt(cat.budget)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Uitgegeven</span><span className="font-display font-semibold text-foreground">{fmt(cat.spent)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Resterend</span><span className="font-display font-semibold text-primary">{fmt(remaining)}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={pct} className="h-2" />
                        <p className="text-xs text-muted-foreground text-right">{Math.round(pct)}% gebruikt</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full font-display text-xs">
                        Budget aanpassen
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Totaal budget</p>
                    <p className="font-display text-2xl font-bold text-foreground">{fmt(totalBudget)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Totaal uitgegeven</p>
                    <p className="font-display text-2xl font-bold text-primary">{fmt(totalSpent)}</p>
                  </div>
                </div>
                <Progress value={(totalSpent / totalBudget) * 100} className="h-3 mt-4" />
                <p className="text-xs text-muted-foreground mt-2">{Math.round((totalSpent / totalBudget) * 100)}% van het totale budget uitgegeven</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Financieel;
