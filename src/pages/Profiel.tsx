import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, LogOut, Trash2, Save, Bell, Calendar, CreditCard, UserCheck, Newspaper, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import MemberBottomNav from "@/components/MemberBottomNav";

const packagePrices: Record<string, number> = {
  "Pakket 1": 100, "Pakket 2": 175, "Pakket 3": 250, "Pakket 4": 350,
};

const paymentHistory = [
  { datum: "15 feb 2026", bedrag: 50, notitie: "Eerste termijn" },
  { datum: "1 jan 2026", bedrag: 50, notitie: "Kerstactie bijdrage" },
  { datum: "10 dec 2025", bedrag: 25, notitie: "Startbedrag" },
];

const upcomingEvents = [
  { id: 1, title: "Borrel bij De Kroeg", date: "22 maart 2026", type: "borrel", emoji: "🥂" },
  { id: 2, title: "Lustrumgala", date: "15 april 2026", type: "gala", emoji: "🎭" },
];

const commissies = [
  { id: "gala", label: "Galacommissie" },
  { id: "reis", label: "Reiscommissie" },
  { id: "borrel", label: "Borrelcommissie" },
  { id: "gadgets", label: "Gadgetscommissie" },
  { id: "pr", label: "PR & Social Media" },
];

const statusConfig: Record<string, { label: string; emoji: string; className: string }> = {
  volledig_betaald: { label: "Volledig betaald", emoji: "✅", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  in_afwachting: { label: "In afwachting", emoji: "⏳", className: "bg-amber-100 text-amber-800 border-amber-200" },
  gedeeltelijk_betaald: { label: "Gedeeltelijk betaald", emoji: "⚠️", className: "bg-orange-100 text-orange-800 border-orange-200" },
  niet_betaald: { label: "Niet betaald", emoji: "❌", className: "bg-red-100 text-red-800 border-red-200" },
};

const eventTypeColors: Record<string, string> = {
  borrel: "bg-amber-100 text-amber-800 border-amber-200",
  gala: "bg-primary/10 text-primary border-primary/20",
  reis: "bg-emerald-100 text-emerald-800 border-emerald-200",
  vergadering: "bg-muted text-muted-foreground border-border",
  anders: "bg-blue-100 text-blue-800 border-blue-200",
};

const Profiel = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState("Derdejaarsstudent Rechten, altijd in voor een borrel.");
  const [naam, setNaam] = useState("Pieter van den Berg");
  const [interests, setInterests] = useState<string[]>(["borrel", "gala"]);
  const [andersText, setAndersText] = useState("");
  const [notifications, setNotifications] = useState({
    nieuws: true, events: true, betalingen: true, aanmeldingen: false,
  });

  const profile = {
    initials: "PB", naam: "Pieter van den Berg", functie: "Commissaris",
    lidSinds: "september 2023", email: "p.vandenberg@student.nl",
    pakket: "Pakket 3", gespaard: 125, status: "gedeeltelijk_betaald",
    commissies: ["Borrelcommissie", "PR & Social Media"],
  };

  const pakketPrijs = packagePrices[profile.pakket] || 250;
  const voortgang = Math.round((profile.gespaard / pakketPrijs) * 100);
  const currentStatus = statusConfig[profile.status];

  const toggleInterest = (id: string) => {
    setInterests((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border safe-area-top">
        <div className="flex items-center gap-3 px-5 py-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-display font-bold text-primary text-xs">PA</span>
          </div>
          <h1 className="font-display font-bold text-foreground text-base">Mijn Profiel</h1>
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-5 animate-fade-in">
        {/* Profile Card */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-2 border-primary/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary font-display text-xl font-bold">
                    {profile.initials}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 space-y-1.5">
                <h2 className="font-display text-lg font-bold text-foreground">{profile.naam}</h2>
                <Badge variant="outline" className="border-primary/30 text-primary font-medium text-xs">
                  {profile.functie}
                </Badge>
                <p className="text-xs text-muted-foreground">Lid sinds {profile.lidSinds}</p>
              </div>
            </div>
            <div className="mt-4">
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 150))}
                placeholder="Vertel iets over jezelf..."
                className="resize-none text-sm bg-background/50 border-border/50 min-h-[56px]"
                maxLength={150}
              />
              <p className="text-[10px] text-muted-foreground text-right mt-0.5">{bio.length}/150</p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="lustrum" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-muted/50">
            <TabsTrigger value="lustrum" className="text-[11px] font-display">Lustrum</TabsTrigger>
            <TabsTrigger value="events" className="text-[11px] font-display">Events</TabsTrigger>
            <TabsTrigger value="commissies" className="text-[11px] font-display">Commissies</TabsTrigger>
            <TabsTrigger value="instellingen" className="text-[11px] font-display">Instellingen</TabsTrigger>
          </TabsList>

          {/* Lustrum */}
          <TabsContent value="lustrum" className="space-y-4 mt-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Mijn Pakket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">{profile.pakket}</p>
                    <p className="text-xs text-muted-foreground">€{pakketPrijs.toFixed(2)}</p>
                  </div>
                  <Badge variant="outline" className={`${currentStatus.className} border text-[10px]`}>
                    {currentStatus.emoji} {currentStatus.label}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Gespaard</span>
                    <span className="font-semibold text-foreground">€{profile.gespaard} / €{pakketPrijs}</span>
                  </div>
                  <Progress value={voortgang} className="h-2.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Betaalhistorie</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-display text-[10px]">Datum</TableHead>
                      <TableHead className="font-display text-[10px]">Bedrag</TableHead>
                      <TableHead className="font-display text-[10px]">Notitie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs">{p.datum}</TableCell>
                        <TableCell className="text-xs font-medium">€{p.bedrag.toFixed(2)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.notitie}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="space-y-4 mt-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Mijn Aanmeldingen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Je gaat naar <span className="font-semibold text-foreground">{upcomingEvents.length}</span> van de <span className="font-semibold text-foreground">5</span> events
                </p>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${eventTypeColors[event.type]} cursor-pointer hover:opacity-80 transition-opacity`}
                      onClick={() => navigate("/home/kalender")}
                    >
                      <span className="text-xl">{event.emoji}</span>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-xs">{event.title}</p>
                        <p className="text-[10px] opacity-70">{event.date}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-xs text-muted-foreground">Je hebt je nog niet aangemeld</p>
                    <Button variant="outline" size="sm" onClick={() => navigate("/home/kalender")} className="text-xs border-primary/30 text-primary">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" /> Bekijk events
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commissies */}
          <TabsContent value="commissies" className="space-y-4 mt-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Mijn Commissies</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.commissies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.commissies.map((c) => (
                      <Badge key={c} variant="outline" className="border-primary/30 text-primary bg-primary/5 text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Je zit nog niet in een commissie.</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Commissie Interesse</CardTitle>
                <p className="text-[10px] text-muted-foreground">Geef aan welke commissies je interesseren.</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {commissies.map((c) => (
                  <label key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Checkbox checked={interests.includes(c.id)} onCheckedChange={() => toggleInterest(c.id)} />
                    <span className="text-xs text-foreground">{c.label}</span>
                  </label>
                ))}
                <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <Checkbox checked={interests.includes("anders")} onCheckedChange={() => toggleInterest("anders")} />
                  <span className="text-xs text-foreground">Anders</span>
                </label>
                {interests.includes("anders") && (
                  <Input value={andersText} onChange={(e) => setAndersText(e.target.value)} placeholder="Beschrijf je interesse..." className="ml-8 w-auto bg-background/50 text-xs" />
                )}
                <Button size="sm" className="mt-2 text-xs" onClick={() => toast.success("Interesse opgeslagen!")}>
                  <Save className="w-3.5 h-3.5 mr-1.5" /> Interesse opslaan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Instellingen */}
          <TabsContent value="instellingen" className="space-y-4 mt-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-display uppercase tracking-wider text-muted-foreground">Naam</Label>
                  <Input value={naam} onChange={(e) => setNaam(e.target.value)} className="bg-background/50 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-display uppercase tracking-wider text-muted-foreground">E-mailadres</Label>
                  <Input value={profile.email} readOnly className="bg-muted/50 text-muted-foreground cursor-not-allowed text-sm" />
                </div>
                <Button variant="outline" size="sm" className="w-full border-border/50 text-xs">
                  Wachtwoord wijzigen
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-primary" />
                  <CardTitle className="text-sm font-display">Notificaties</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: "nieuws" as const, label: "Nieuwsberichten", icon: Newspaper },
                  { key: "events" as const, label: "Event herinneringen", icon: Calendar },
                  { key: "betalingen" as const, label: "Betalingsherinneringen", icon: CreditCard },
                  { key: "aanmeldingen" as const, label: "Aanmeldingen goedgekeurd", icon: UserCheck },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-foreground">{item.label}</span>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [item.key]: checked }))}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Separator className="my-2" />

            <div className="space-y-2">
              <Button variant="destructive" className="w-full text-xs" onClick={() => { toast.success("Uitgelogd"); navigate("/login"); }}>
                <LogOut className="w-3.5 h-3.5 mr-1.5" /> Uitloggen
              </Button>
              <Button variant="ghost" className="w-full text-muted-foreground text-[10px] hover:text-destructive" onClick={() => toast.error("Neem contact op met het bestuur.")}>
                <Trash2 className="w-3 h-3 mr-1" /> Account verwijderen
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <MemberBottomNav />
    </div>
  );
};

export default Profiel;
