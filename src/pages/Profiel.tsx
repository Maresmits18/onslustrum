import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, User, MessageCircle, Camera, LogOut, Trash2, ExternalLink, Save, Bell, Mail, CreditCard, UserCheck, ChevronRight, Newspaper } from "lucide-react";
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

const bottomNavItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/home/events", icon: Calendar, label: "Kalender" },
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/profiel", icon: User, label: "Profiel" },
];

const packagePrices: Record<string, number> = {
  "Pakket 1": 100,
  "Pakket 2": 175,
  "Pakket 3": 250,
  "Pakket 4": 350,
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
  herinnering_verstuurd: { label: "Herinnering verstuurd", emoji: "📩", className: "bg-blue-100 text-blue-800 border-blue-200" },
};

const Profiel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bio, setBio] = useState("Derdejaarsstudent Rechten, altijd in voor een borrel.");
  const [naam, setNaam] = useState("Pieter van den Berg");
  const [interests, setInterests] = useState<string[]>(["borrel", "gala"]);
  const [andersText, setAndersText] = useState("");
  const [notifications, setNotifications] = useState({
    nieuws: true,
    events: true,
    betalingen: true,
    aanmeldingen: false,
  });

  // Mock profile data
  const profile = {
    initials: "PB",
    naam: "Pieter van den Berg",
    functie: "Commissaris",
    lidSinds: "september 2023",
    email: "p.vandenberg@student.nl",
    pakket: "Pakket 3",
    gespaard: 125,
    status: "gedeeltelijk_betaald",
    commissies: ["Borrelcommissie", "PR & Social Media"],
  };

  const pakketPrijs = packagePrices[profile.pakket] || 250;
  const voortgang = Math.round((profile.gespaard / pakketPrijs) * 100);
  const currentStatus = statusConfig[profile.status];

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const eventTypeColors: Record<string, string> = {
    borrel: "bg-amber-100 text-amber-800 border-amber-200",
    gala: "bg-primary/10 text-primary border-primary/20",
    reis: "bg-emerald-100 text-emerald-800 border-emerald-200",
    vergadering: "bg-muted text-muted-foreground border-border",
    anders: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border safe-area-top">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-display font-bold text-primary text-sm">PA</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground text-lg leading-tight">Mijn Profiel</h1>
            <p className="text-xs text-muted-foreground">Persoonlijke gegevens</p>
          </div>
        </div>
      </header>

      <main className="px-4 lg:px-8 py-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Profile Card */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-2 border-primary/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary font-display text-2xl font-bold">
                    {profile.initials}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <h2 className="font-display text-xl font-bold text-foreground">{profile.naam}</h2>
                <Badge variant="outline" className="border-primary/30 text-primary font-medium">
                  {profile.functie}
                </Badge>
                <p className="text-sm text-muted-foreground">Lid sinds {profile.lidSinds}</p>
                <div className="pt-1">
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 150))}
                    placeholder="Vertel iets over jezelf..."
                    className="resize-none text-sm bg-background/50 border-border/50 min-h-[60px]"
                    maxLength={150}
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">{bio.length}/150</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="lustrum" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-muted/50">
            <TabsTrigger value="lustrum" className="text-xs sm:text-sm font-display">Lustrum</TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm font-display">Events</TabsTrigger>
            <TabsTrigger value="commissies" className="text-xs sm:text-sm font-display">Commissies</TabsTrigger>
            <TabsTrigger value="instellingen" className="text-xs sm:text-sm font-display">Instellingen</TabsTrigger>
          </TabsList>

          {/* TAB 1 - Lustrum */}
          <TabsContent value="lustrum" className="space-y-4 mt-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">Mijn Pakket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-semibold text-foreground">{profile.pakket}</p>
                    <p className="text-sm text-muted-foreground">€{pakketPrijs.toFixed(2)}</p>
                  </div>
                  <Badge variant="outline" className={`${currentStatus.className} border`}>
                    {currentStatus.emoji} {currentStatus.label}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gespaard</span>
                    <span className="font-semibold text-foreground">€{profile.gespaard.toFixed(2)} / €{pakketPrijs.toFixed(2)}</span>
                  </div>
                  <Progress value={voortgang} className="h-3" />
                  <p className="text-xs text-muted-foreground text-right">{voortgang}% voltooid</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">Betaalhistorie</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2 - Events */}
          <TabsContent value="events" className="space-y-4 mt-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">Mijn Aanmeldingen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">
                  Je gaat naar <span className="font-semibold text-foreground">{upcomingEvents.length}</span> van de <span className="font-semibold text-foreground">5</span> events
                </p>

                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${eventTypeColors[event.type]} cursor-pointer hover:opacity-80 transition-opacity`}
                      onClick={() => navigate("/home/events")}
                    >
                      <span className="text-2xl">{event.emoji}</span>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-sm">{event.title}</p>
                        <p className="text-xs opacity-70">{event.date}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Je hebt je nog niet aangemeld voor events</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/home/events")}
                      className="border-primary/30 text-primary hover:bg-primary/5"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Bekijk events
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3 - Commissies */}
          <TabsContent value="commissies" className="space-y-4 mt-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">Mijn Commissies</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.commissies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.commissies.map((c) => (
                      <Badge key={c} variant="outline" className="border-primary/30 text-primary bg-primary/5">
                        {c}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Je zit nog niet in een commissie.</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">Commissie Interesse</CardTitle>
                <p className="text-xs text-muted-foreground">Geef aan welke commissies je interesseren. Het bestuur kan dit zien.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {commissies.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <Checkbox
                      checked={interests.includes(c.id)}
                      onCheckedChange={() => toggleInterest(c.id)}
                    />
                    <span className="text-sm text-foreground">{c.label}</span>
                  </label>
                ))}

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Checkbox
                      checked={interests.includes("anders")}
                      onCheckedChange={() => toggleInterest("anders")}
                    />
                    <span className="text-sm text-foreground">Anders</span>
                  </label>
                  {interests.includes("anders") && (
                    <Input
                      value={andersText}
                      onChange={(e) => setAndersText(e.target.value)}
                      placeholder="Beschrijf je interesse..."
                      className="ml-9 w-auto bg-background/50"
                    />
                  )}
                </div>

                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => toast.success("Interesse opgeslagen!")}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Interesse opslaan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4 - Instellingen */}
          <TabsContent value="instellingen" className="space-y-4 mt-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-display uppercase tracking-wider text-muted-foreground">Naam</Label>
                  <Input
                    value={naam}
                    onChange={(e) => setNaam(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-display uppercase tracking-wider text-muted-foreground">E-mailadres</Label>
                  <Input
                    value={profile.email}
                    readOnly
                    className="bg-muted/50 text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">E-mail kan niet worden gewijzigd</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-display uppercase tracking-wider text-muted-foreground">Wachtwoord</Label>
                  <Button variant="outline" size="sm" className="w-full border-border/50">
                    Wachtwoord wijzigen
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base font-display">Notificaties</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "nieuws" as const, label: "Nieuwsberichten", icon: Newspaper },
                  { key: "events" as const, label: "Event herinneringen", icon: Calendar },
                  { key: "betalingen" as const, label: "Betalingsherinneringen", icon: CreditCard },
                  { key: "aanmeldingen" as const, label: "Aanmeldingen goedgekeurd", icon: UserCheck },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Separator className="my-2" />

            <div className="space-y-3">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  toast.success("Uitgelogd");
                  navigate("/login");
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Uitloggen
              </Button>

              <Button
                variant="ghost"
                className="w-full text-muted-foreground text-xs hover:text-destructive"
                onClick={() => toast.error("Neem contact op met het bestuur om je account te verwijderen.")}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Account verwijderen
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom z-40">
        <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Profiel;