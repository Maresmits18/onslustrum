import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PiggyBank, TrendingUp, Receipt, Target, Send, Plus, Upload,
  Euro, Wallet, ArrowUpDown, Search, Download, Edit2, UserPlus,
  AlertTriangle, ChevronUp, ChevronDown, X,
} from "lucide-react";
import OwnerSidebar from "@/components/OwnerSidebar";

/* ── Package config ── */
const defaultPackages: Record<string, number> = {
  "Pakket 1": 75,
  "Pakket 2": 125,
  "Pakket 3": 200,
  "Pakket 4": 350,
};

/* ── Status config ── */
type MemberStatus = "volledig_betaald" | "in_afwachting" | "gedeeltelijk_betaald" | "niet_betaald" | "herinnering_verstuurd";

const statusConfig: Record<MemberStatus, { label: string; icon: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  volledig_betaald: { label: "Volledig betaald", icon: "✅", variant: "default" },
  in_afwachting: { label: "In afwachting", icon: "⏳", variant: "secondary" },
  gedeeltelijk_betaald: { label: "Gedeeltelijk betaald", icon: "⚠️", variant: "outline" },
  niet_betaald: { label: "Niet betaald", icon: "❌", variant: "destructive" },
  herinnering_verstuurd: { label: "Herinnering verstuurd", icon: "📩", variant: "secondary" },
};

/* ── Types ── */
interface MemberPayment {
  id: string;
  name: string;
  pakket: string;
  gespaard: number;
  status: MemberStatus;
  notitie: string;
  betalingen: { maand: string; bedrag: number; datum: string; notitie: string }[];
}

/* ── Placeholder data ── */
const initialMembers: MemberPayment[] = [
  { id: "1", name: "Pieter de Vries", pakket: "Pakket 2", gespaard: 125, status: "volledig_betaald", notitie: "", betalingen: [{ maand: "Januari", bedrag: 50, datum: "2026-01-15", notitie: "" }, { maand: "Februari", bedrag: 50, datum: "2026-02-15", notitie: "" }, { maand: "Maart", bedrag: 25, datum: "2026-03-10", notitie: "Laatste betaling" }] },
  { id: "2", name: "Sophie Jansen", pakket: "Pakket 3", gespaard: 150, status: "gedeeltelijk_betaald", notitie: "Betaalt maandelijks", betalingen: [{ maand: "Januari", bedrag: 75, datum: "2026-01-20", notitie: "" }, { maand: "Februari", bedrag: 75, datum: "2026-02-20", notitie: "" }] },
  { id: "3", name: "Thomas Bakker", pakket: "Pakket 4", gespaard: 350, status: "volledig_betaald", notitie: "", betalingen: [{ maand: "Januari", bedrag: 350, datum: "2026-01-05", notitie: "In één keer betaald" }] },
  { id: "4", name: "Emma Visser", pakket: "Pakket 1", gespaard: 25, status: "gedeeltelijk_betaald", notitie: "heeft aangegeven in maart meer te betalen", betalingen: [{ maand: "Januari", bedrag: 25, datum: "2026-01-28", notitie: "" }] },
  { id: "5", name: "Lotte Mulder", pakket: "Pakket 2", gespaard: 0, status: "niet_betaald", notitie: "", betalingen: [] },
  { id: "6", name: "Jan van Dijk", pakket: "Pakket 1", gespaard: 0, status: "in_afwachting", notitie: "", betalingen: [] },
  { id: "7", name: "Maria de Boer", pakket: "Pakket 3", gespaard: 200, status: "volledig_betaald", notitie: "", betalingen: [{ maand: "Januari", bedrag: 100, datum: "2026-01-10", notitie: "" }, { maand: "Februari", bedrag: 100, datum: "2026-02-10", notitie: "" }] },
  { id: "8", name: "Daan Smit", pakket: "Pakket 2", gespaard: 60, status: "herinnering_verstuurd", notitie: "Herinnering gestuurd op 5 maart", betalingen: [{ maand: "Januari", bedrag: 60, datum: "2026-01-22", notitie: "" }] },
];

const allClubMembers = [
  "Pieter de Vries", "Sophie Jansen", "Thomas Bakker", "Emma Visser",
  "Lotte Mulder", "Jan van Dijk", "Maria de Boer", "Daan Smit",
  "Anna Hendriks", "Bas Vermeer", "Clara de Wit", "David Bos",
];

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

const expenses = [
  { date: "2026-03-01", category: "Gala", description: "Locatiehuur deposit", amount: 500, by: "Thomas Bakker" },
  { date: "2026-02-20", category: "Gala", description: "DJ boeking", amount: 300, by: "Thomas Bakker" },
  { date: "2026-02-15", category: "Reis", description: "Vliegtickets (aanbetaling)", amount: 1200, by: "Sophie Jansen" },
  { date: "2026-01-28", category: "Borrel", description: "Drankjes nieuwjaarsborrel", amount: 100, by: "Pieter de Vries" },
];

const fmt = (n: number) => `€${n.toLocaleString("nl-NL")}`;

/* ── Donut chart ── */
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
      <path key={cat.name} d={`M 100 100 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={colors[i]} className="transition-opacity hover:opacity-80" />
    );
  });
  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 200 200" className="w-48 h-48">
        {arcs}
        <circle cx="100" cy="100" r="45" className="fill-card" />
        <text x="100" y="96" textAnchor="middle" className="fill-foreground text-xs font-display font-bold" style={{ fontSize: 14 }}>{fmt(totalBudget)}</text>
        <text x="100" y="112" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>totaal budget</text>
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

/* ── Sort helpers ── */
type SortKey = "name" | "pakket" | "gespaard" | "status";
type SortDir = "asc" | "desc";

/* ── Component ── */
const Financieel = () => {
  const [members, setMembers] = useState<MemberPayment[]>(initialMembers);
  const [filter, setFilter] = useState("alle");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedMember, setSelectedMember] = useState<MemberPayment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // New payment form state
  const [newPayMonth, setNewPayMonth] = useState("");
  const [newPayAmount, setNewPayAmount] = useState("");
  const [newPayNote, setNewPayNote] = useState("");

  const paidCount = 98;
  const totalMembers = 142;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  const filteredMembers = useMemo(() => {
    let result = [...members];
    // Filter
    if (filter === "volledig_betaald") result = result.filter(m => m.status === "volledig_betaald");
    else if (filter === "openstaand") result = result.filter(m => ["gedeeltelijk_betaald", "niet_betaald", "herinnering_verstuurd"].includes(m.status));
    else if (filter === "niet_betaald") result = result.filter(m => m.status === "niet_betaald");
    else if (filter === "in_afwachting") result = result.filter(m => m.status === "in_afwachting");
    // Search
    if (search) result = result.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "pakket") cmp = a.pakket.localeCompare(b.pakket);
      else if (sortKey === "gespaard") cmp = a.gespaard - b.gespaard;
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [members, filter, search, sortKey, sortDir]);

  const getPackagePrice = (pakket: string) => defaultPackages[pakket] || 0;

  const openDetail = (member: MemberPayment) => {
    setSelectedMember({ ...member });
    setDetailOpen(true);
    setNewPayMonth("");
    setNewPayAmount("");
    setNewPayNote("");
  };

  const addMemberToOverview = (name: string) => {
    if (members.find(m => m.name === name)) return;
    setMembers(prev => [...prev, {
      id: String(Date.now()),
      name,
      pakket: "Pakket 1",
      gespaard: 0,
      status: "in_afwachting",
      notitie: "",
      betalingen: [],
    }]);
  };

  const updateMemberField = (id: string, field: keyof MemberPayment, value: any) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addPaymentToMember = () => {
    if (!selectedMember || !newPayMonth || !newPayAmount) return;
    const newPayment = { maand: newPayMonth, bedrag: parseFloat(newPayAmount), datum: new Date().toISOString().split("T")[0], notitie: newPayNote };
    const updatedBetalingen = [...selectedMember.betalingen, newPayment];
    const newGespaard = updatedBetalingen.reduce((s, b) => s + b.bedrag, 0);
    setMembers(prev => prev.map(m => m.id === selectedMember.id ? { ...m, betalingen: updatedBetalingen, gespaard: newGespaard } : m));
    setSelectedMember(prev => prev ? { ...prev, betalingen: updatedBetalingen, gespaard: newGespaard } : null);
    setNewPayMonth("");
    setNewPayAmount("");
    setNewPayNote("");
  };

  const exportCSV = () => {
    const headers = ["Naam", "Pakket", "Gespaard", "Status", "Laatste betaling", "Notitie"];
    const rows = filteredMembers.map(m => [
      m.name,
      m.pakket,
      `€${m.gespaard}`,
      statusConfig[m.status].label,
      m.betalingen.length > 0 ? m.betalingen[m.betalingen.length - 1].datum : "—",
      m.notitie,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "financieel-overzicht.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const availableToAdd = allClubMembers.filter(n => !members.find(m => m.name === n));

  return (
    <div className="min-h-screen bg-background flex">
      <OwnerSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Financieel overzicht</h2>
            <p className="text-muted-foreground text-sm mt-1">Budget, betalingen en uitgaven</p>
          </div>

          <Tabs defaultValue="overzicht" className="space-y-6">
            <TabsList className="bg-muted/60 p-1 rounded-lg">
              <TabsTrigger value="overzicht" className="font-display text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-md">Overzicht</TabsTrigger>
              <TabsTrigger value="per-lid" className="font-display text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-md">Per lid</TabsTrigger>
              <TabsTrigger value="uitgaven" className="font-display text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-md">Uitgaven</TabsTrigger>
              <TabsTrigger value="budgetplan" className="font-display text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-md">Budgetplan</TabsTrigger>
            </TabsList>

            {/* ═══ TAB 1: Overzicht ═══ */}
            <TabsContent value="overzicht" className="space-y-6">
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

              <div className="glass-card rounded-xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground">Spaardoel</h3>
                  <span className="text-sm text-muted-foreground">{fmt(totalSaved)} / {fmt(totalBudget)}</span>
                </div>
                <Progress value={(totalSaved / totalBudget) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground">{Math.round((totalSaved / totalBudget) * 100)}% van het doel bereikt</p>
              </div>

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
                        <circle cx="50" cy="50" r="40" fill="none" className="stroke-primary" strokeWidth="10" strokeDasharray={`${(paidCount / totalMembers) * 251.2} 251.2`} strokeLinecap="round" />
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
              {/* Toolbar */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Zoek op naam..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 w-48 bg-card"
                      />
                    </div>
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-44 bg-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alle">Alle leden</SelectItem>
                        <SelectItem value="volledig_betaald">Volledig betaald</SelectItem>
                        <SelectItem value="openstaand">Openstaand</SelectItem>
                        <SelectItem value="niet_betaald">Niet betaald</SelectItem>
                        <SelectItem value="in_afwachting">In afwachting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    {availableToAdd.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="font-display text-sm">
                            <UserPlus className="w-4 h-4 mr-2" /> Lid toevoegen
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
                          {availableToAdd.map(name => (
                            <DropdownMenuItem key={name} onClick={() => addMemberToOverview(name)}>
                              {name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <Button variant="outline" onClick={exportCSV} className="font-display text-sm">
                      <Download className="w-4 h-4 mr-2" /> Exporteren
                    </Button>
                    <Button variant="outline" className="font-display text-sm">
                      <Send className="w-4 h-4 mr-2" /> Herinnering aan allen
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("name")}>
                        <span className="flex items-center">Naam <SortIcon col="name" /></span>
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("pakket")}>
                        <span className="flex items-center">Pakket <SortIcon col="pakket" /></span>
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none text-right" onClick={() => toggleSort("gespaard")}>
                        <span className="flex items-center justify-end">Gespaard <SortIcon col="gespaard" /></span>
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("status")}>
                        <span className="flex items-center">Status <SortIcon col="status" /></span>
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Voortgang</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((m) => {
                      const price = getPackagePrice(m.pakket);
                      const pct = price > 0 ? Math.min((m.gespaard / price) * 100, 100) : 0;
                      const sc = statusConfig[m.status];
                      return (
                        <TableRow key={m.id} className="border-border">
                          <TableCell>
                            <button
                              onClick={() => openDetail(m)}
                              className="font-medium text-foreground hover:text-primary transition-colors text-left underline-offset-2 hover:underline"
                            >
                              {m.name}
                            </button>
                          </TableCell>
                          <TableCell>
                            <Select value={m.pakket} onValueChange={v => updateMemberField(m.id, "pakket", v)}>
                              <SelectTrigger className="w-28 h-8 text-xs bg-transparent border-none shadow-none px-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(defaultPackages).map(p => (
                                  <SelectItem key={p} value={p}>{p} ({fmt(defaultPackages[p])})</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              value={m.gespaard}
                              onChange={e => updateMemberField(m.id, "gespaard", parseFloat(e.target.value) || 0)}
                              className="w-20 h-8 text-xs text-right bg-transparent border-none shadow-none p-0 font-display font-semibold"
                            />
                          </TableCell>
                          <TableCell>
                            <Select value={m.status} onValueChange={v => updateMemberField(m.id, "status", v as MemberStatus)}>
                              <SelectTrigger className="w-44 h-8 text-xs bg-transparent border-none shadow-none px-0">
                                <Badge variant={sc.variant} className="text-xs">
                                  {sc.icon} {sc.label}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusConfig).map(([key, cfg]) => (
                                  <SelectItem key={key} value={key}>{cfg.icon} {cfg.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="w-32">
                            <div className="flex items-center gap-2">
                              <Progress value={pct} className="h-2 flex-1" />
                              <span className="text-xs text-muted-foreground w-8 text-right">{Math.round(pct)}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openDetail(m)}>
                                <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                              </Button>
                              {m.status !== "volledig_betaald" && (
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                  <Send className="w-3.5 h-3.5 text-primary" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                            {budgetCategories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
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

              <div className="glass-card rounded-xl p-5">
                <h4 className="font-display font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Totaal per categorie</h4>
                <div className="space-y-2">
                  {budgetCategories.filter(c => c.spent > 0).map(c => (
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
                  const isWarning = pct >= 80 && pct < 100;
                  const isOver = pct >= 100;
                  return (
                    <div key={cat.name} className="glass-card rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-semibold text-foreground uppercase tracking-wider text-sm">{cat.name}</h4>
                        {isOver ? (
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        ) : (
                          <Wallet className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Budget</span><span className="font-display font-semibold text-foreground">{fmt(cat.budget)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Uitgegeven</span><span className="font-display font-semibold text-foreground">{fmt(cat.spent)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Resterend</span>
                          <span className={`font-display font-semibold ${isOver ? "text-destructive" : "text-primary"}`}>
                            {fmt(remaining)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                              isOver ? "bg-destructive" : isWarning ? "bg-orange-500" : "bg-primary"
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          {isOver && (
                            <span className="text-xs text-destructive font-medium flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Budget overschreden!
                            </span>
                          )}
                          {!isOver && <p className="text-xs text-muted-foreground">{Math.round(pct)}% gebruikt</p>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full font-display text-xs">
                        Budget aanpassen
                      </Button>
                    </div>
                  );
                })}
              </div>

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

      {/* ═══ Member Detail Sheet ═══ */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedMember && (() => {
            const m = members.find(x => x.id === selectedMember.id) || selectedMember;
            const price = getPackagePrice(m.pakket);
            const pct = price > 0 ? Math.min((m.gespaard / price) * 100, 100) : 0;
            const sc = statusConfig[m.status];
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="font-display flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-bold text-primary text-sm">
                        {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    {m.name}
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Pakket */}
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Pakket</Label>
                    <Select value={m.pakket} onValueChange={v => updateMemberField(m.id, "pakket", v)}>
                      <SelectTrigger className="bg-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(defaultPackages).map(([p, price]) => (
                          <SelectItem key={p} value={p}>{p} — {fmt(price)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Status</Label>
                    <Select value={m.status} onValueChange={v => updateMemberField(m.id, "status", v as MemberStatus)}>
                      <SelectTrigger className="bg-card">
                        <Badge variant={sc.variant} className="text-xs">{sc.icon} {sc.label}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([key, cfg]) => (
                          <SelectItem key={key} value={key}>{cfg.icon} {cfg.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Progress */}
                  <div className="glass-card rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Totaal gespaard</span>
                      <span className="font-display font-bold text-foreground">{fmt(m.gespaard)} / {fmt(price)}</span>
                    </div>
                    <Progress value={pct} className="h-3" />
                    <p className="text-xs text-muted-foreground">{Math.round(pct)}% van pakketprijs</p>
                  </div>

                  {/* Betalingen */}
                  <div className="space-y-3">
                    <h4 className="font-display font-semibold text-foreground text-sm">Maandelijks spaarsoverzicht</h4>
                    {m.betalingen.length > 0 ? (
                      <div className="glass-card rounded-xl overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border">
                              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Maand</TableHead>
                              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Bedrag</TableHead>
                              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Datum</TableHead>
                              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Notitie</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {m.betalingen.map((b, i) => (
                              <TableRow key={i} className="border-border">
                                <TableCell className="text-sm text-foreground">{b.maand}</TableCell>
                                <TableCell className="text-right font-display font-semibold text-foreground">{fmt(b.bedrag)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{new Date(b.datum).toLocaleDateString("nl-NL")}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{b.notitie || "—"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Nog geen betalingen geregistreerd</p>
                    )}

                    {/* Add payment form */}
                    <div className="glass-card rounded-xl p-4 space-y-3">
                      <h5 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Betaling toevoegen</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Maand" value={newPayMonth} onChange={e => setNewPayMonth(e.target.value)} className="bg-background text-sm" />
                        <div className="relative">
                          <Euro className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input type="number" placeholder="Bedrag" value={newPayAmount} onChange={e => setNewPayAmount(e.target.value)} className="pl-8 bg-background text-sm" />
                        </div>
                      </div>
                      <Input placeholder="Notitie (optioneel)" value={newPayNote} onChange={e => setNewPayNote(e.target.value)} className="bg-background text-sm" />
                      <Button size="sm" onClick={addPaymentToMember} className="w-full font-display text-xs">
                        <Plus className="w-3.5 h-3.5 mr-1" /> Toevoegen
                      </Button>
                    </div>
                  </div>

                  {/* Notitie */}
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Notities</Label>
                    <Textarea
                      value={m.notitie}
                      onChange={e => updateMemberField(m.id, "notitie", e.target.value)}
                      placeholder="Vrije tekst, bv. 'heeft aangegeven in maart te betalen'"
                      className="bg-card min-h-[80px] text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 font-display text-sm">
                      <Send className="w-4 h-4 mr-2" /> Herinnering sturen
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Financieel;
