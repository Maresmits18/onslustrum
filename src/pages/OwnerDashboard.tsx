import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Settings,
  Calendar,
  LogOut,
  Send,
  CheckCircle2,
  Clock,
} from "lucide-react";

const sidebarItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/dashboard", icon: Users, label: "Leden" },
  { path: "/dashboard", icon: Newspaper, label: "Nieuws" },
  { path: "/dashboard", icon: Calendar, label: "Kalender" },
  { path: "/dashboard", icon: Settings, label: "Instellingen" },
];

const members = [
  { id: 1, name: "Pieter de Vries", email: "pieter@example.nl", role: "Lid", status: "active", joinedAt: "2024-01-15" },
  { id: 2, name: "Sophie Jansen", email: "sophie@example.nl", role: "Lid", status: "active", joinedAt: "2024-02-20" },
  { id: 3, name: "Thomas Bakker", email: "thomas@example.nl", role: "Admin", status: "active", joinedAt: "2023-11-05" },
  { id: 4, name: "Emma Visser", email: "emma@example.nl", role: "Lid", status: "pending", joinedAt: "2026-03-10" },
  { id: 5, name: "Lotte Mulder", email: "lotte@example.nl", role: "Lid", status: "pending", joinedAt: "2026-03-09" },
];

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newsTitle, setNewsTitle] = useState("");
  const [newsBody, setNewsBody] = useState("");

  const stats = [
    { label: "Leden", value: "142", icon: Users },
    { label: "Aanvragen", value: "2", icon: Clock },
    { label: "Berichten", value: "24", icon: Newspaper },
  ];

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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                i === 0
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

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
          {/* Header */}
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground text-sm mt-1">Beheer je vereniging</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Members table */}
          <section>
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Ledenlijst</h3>
            <div className="glass-card rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Naam</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Rol</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{member.email}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{member.role}</span>
                      </TableCell>
                      <TableCell>
                        {member.status === "active" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Actief
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" /> In afwachting
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* News post form */}
          <section>
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Nieuwsbericht plaatsen</h3>
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Titel</Label>
                <Input
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Titel van het bericht"
                  className="bg-background/60"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Bericht</Label>
                <Textarea
                  value={newsBody}
                  onChange={(e) => setNewsBody(e.target.value)}
                  placeholder="Schrijf je bericht..."
                  className="bg-background/60 min-h-[120px]"
                />
              </div>
              <Button className="font-display tracking-wide">
                <Send className="w-4 h-4 mr-2" /> Publiceren
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
