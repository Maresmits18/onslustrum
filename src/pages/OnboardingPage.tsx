import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useClub } from "@/contexts/ClubContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, KeyRound } from "lucide-react";

type Mode = "choose" | "create" | "join";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, refreshMemberships, setActiveClubId } = useClub();
  const [mode, setMode] = useState<Mode>("choose");

  // Create state
  const [clubName, setClubName] = useState("");
  const [slug, setSlug] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#C85A7C");
  const [secondaryColor, setSecondaryColor] = useState("#D4A853");
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Join state
  const [inviteCode, setInviteCode] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    // Create club
    const { data: club, error: clubError } = await supabase
      .from("clubs")
      .insert({
        name: clubName,
        slug: slug || generateSlug(clubName),
        primary_color: primaryColor,
        secondary_color: secondaryColor,
      })
      .select()
      .single();

    if (clubError || !club) {
      toast.error(clubError?.message || "Kon club niet aanmaken");
      setLoading(false);
      return;
    }

    // Add as owner (always active)
    const { error: memberError } = await supabase.from("club_members").insert({
      user_id: user.id,
      club_id: club.id,
      role: "owner",
      status: "active",
      full_name: user.user_metadata?.full_name || null,
    });

    if (memberError) {
      toast.error(memberError.message);
      setLoading(false);
      return;
    }

    // Generate invite code
    const code = generateInviteCode();
    await supabase.from("invite_codes").insert({
      club_id: club.id,
      code,
      created_by: user.id,
    });

    setGeneratedCode(code);
    setActiveClubId(club.id);
    await refreshMemberships();
    setLoading(false);
    toast.success("Club aangemaakt!");
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const normalizedCode = inviteCode.toUpperCase().trim();

    // Find invite code
    const { data: invite, error: invError } = await supabase
      .from("invite_codes")
      .select("*")
      .eq("code", normalizedCode)
      .is("used_by", null)
      .single();

    if (invError || !invite) {
      toast.error("Ongeldige of al gebruikte uitnodigingscode");
      setLoading(false);
      return;
    }

    // Check expiry
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      toast.error("Deze code is verlopen");
      setLoading(false);
      return;
    }

    // Add as pending member
    const { error: memberError } = await supabase.from("club_members").insert({
      user_id: user.id,
      club_id: invite.club_id,
      role: "member",
      full_name: user.user_metadata?.full_name || null,
      status: "pending",
    });

    if (memberError) {
      toast.error(memberError.message);
      setLoading(false);
      return;
    }

    // Mark code as used
    await supabase
      .from("invite_codes")
      .update({ used_by: user.id, used_at: new Date().toISOString() })
      .eq("id", invite.id);

    setActiveClubId(invite.club_id);
    await refreshMemberships();
    toast.success("Aanmelding verstuurd! Het bestuur beoordeelt je aanvraag.");
    navigate("/dashboard");
    setLoading(false);
  };

  if (generatedCode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card rounded-2xl p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Club aangemaakt! 🎉</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Deel deze code met je leden zodat zij kunnen joinen:
          </p>
          <div className="bg-muted rounded-xl p-4 mb-6">
            <p className="font-mono text-3xl font-bold text-foreground tracking-[0.3em]">{generatedCode}</p>
          </div>
          <Button className="w-full" onClick={() => navigate("/dashboard")}>
            Ga naar dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "create") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card rounded-2xl p-8 w-full max-w-sm">
          <button onClick={() => setMode("choose")} className="text-sm text-muted-foreground hover:text-foreground mb-4 block">
            ← Terug
          </button>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Club aanmaken</h1>
          <p className="text-muted-foreground text-sm mb-6">Stel je club in en nodig leden uit</p>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Clubnaam</Label>
              <Input
                value={clubName}
                onChange={(e) => {
                  setClubName(e.target.value);
                  setSlug(generateSlug(e.target.value));
                }}
                placeholder="Dames Dispuut Pallas Athena"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug (URL)</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="pallas-athena"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Primaire kleur</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Secundaire kleur</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1" />
                </div>
              </div>
            </div>

            {/* Live preview */}
            <div className="rounded-xl border border-border p-4" style={{ borderColor: primaryColor }}>
              <p className="text-sm font-medium mb-2">Preview</p>
              <div className="flex gap-2">
                <div className="h-8 rounded-lg px-4 flex items-center text-sm font-medium text-white" style={{ background: primaryColor }}>
                  Primair
                </div>
                <div className="h-8 rounded-lg px-4 flex items-center text-sm font-medium" style={{ background: secondaryColor, color: "#1a1a1a" }}>
                  Secundair
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Aanmaken..." : "Club aanmaken"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (mode === "join") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card rounded-2xl p-8 w-full max-w-sm">
          <button onClick={() => setMode("choose")} className="text-sm text-muted-foreground hover:text-foreground mb-4 block">
            ← Terug
          </button>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Club joinen</h1>
          <p className="text-muted-foreground text-sm mb-6">Voer de uitnodigingscode in die je hebt ontvangen</p>

          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Uitnodigingscode</Label>
              <Input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="text-center font-mono text-2xl tracking-[0.3em] uppercase"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Joinen..." : "Club joinen"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Choose mode
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="glass-card rounded-2xl p-8 w-full max-w-sm text-center">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Welkom!</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Maak een nieuwe club aan of join een bestaande club met een uitnodigingscode.
        </p>
        <div className="space-y-3">
          <Button className="w-full" onClick={() => setMode("create")}>
            <Plus className="w-4 h-4 mr-2" />
            Club aanmaken
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setMode("join")}>
            <KeyRound className="w-4 h-4 mr-2" />
            Club joinen met code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
