import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Users, Newspaper, Clock, Send, CheckCircle2 } from "lucide-react";
import OwnerSidebar from "@/components/OwnerSidebar";

const members = [
  { id: 1, name: "Pieter de Vries", email: "pieter@example.nl", role: "Lid", status: "active", joinedAt: "2024-01-15" },
  { id: 2, name: "Sophie Jansen", email: "sophie@example.nl", role: "Lid", status: "active", joinedAt: "2024-02-20" },
  { id: 3, name: "Thomas Bakker", email: "thomas@example.nl", role: "Admin", status: "active", joinedAt: "2023-11-05" },
  { id: 4, name: "Emma Visser", email: "emma@example.nl", role: "Lid", status: "pending", joinedAt: "2026-03-10" },
  { id: 5, name: "Lotte Mulder", email: "lotte@example.nl", role: "Lid", status: "pending", joinedAt: "2026-03-09" },
];

const OwnerDashboard = () => {
  const [newsTitle, setNewsTitle] = useState("");
  const [newsBody, setNewsBody] = useState("");

  const stats = [
    { label: "Leden", value: "142", icon: Users },
    { label: "Aanvragen", value: "2", icon: Clock },
    { label: "Berichten", value: "24", icon: Newspaper },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <OwnerSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground text-sm mt-1">Beheer je vereniging</p>
          </div>

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
                      <TableCell><span className="text-sm text-muted-foreground">{member.role}</span></TableCell>
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

          <section>
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Nieuwsbericht plaatsen</h3>
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Titel</Label>
                <Input value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} placeholder="Titel van het bericht" className="bg-background/60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Bericht</Label>
                <Textarea value={newsBody} onChange={(e) => setNewsBody(e.target.value)} placeholder="Schrijf je bericht..." className="bg-background/60 min-h-[120px]" />
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
