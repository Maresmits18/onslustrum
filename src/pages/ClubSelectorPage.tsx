import { useClub } from "@/contexts/ClubContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const roleBadge = (role: string) => {
  switch (role) {
    case "owner": return <Badge className="bg-primary/10 text-primary border-0">Eigenaar</Badge>;
    case "admin": return <Badge className="bg-secondary/20 text-secondary-foreground border-0">Admin</Badge>;
    default: return <Badge variant="secondary">Lid</Badge>;
  }
};

const ClubSelectorPage = () => {
  const { memberships, setActiveClubId } = useClub();
  const navigate = useNavigate();

  const handleSelect = (clubId: string) => {
    setActiveClubId(clubId);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Kies je club</h1>
          <p className="text-muted-foreground text-sm">Je bent lid van meerdere clubs. Kies er een om verder te gaan.</p>
        </div>

        <div className="space-y-3">
          {memberships.map((m) => (
            <button
              key={m.club.id}
              onClick={() => handleSelect(m.club.id)}
              className="w-full glass-card rounded-xl p-5 flex items-center gap-4 hover:elegant-shadow transition-all duration-200 text-left group"
              style={{ borderColor: m.club.primary_color, borderWidth: "2px" }}
            >
              {m.club.logo_url ? (
                <img src={m.club.logo_url} alt={m.club.name} className="w-12 h-12 rounded-lg object-contain" />
              ) : (
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-display font-bold text-lg"
                  style={{ background: m.club.primary_color }}
                >
                  {m.club.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-foreground truncate">{m.club.name}</p>
                <p className="text-xs text-muted-foreground">{m.club.slug}</p>
              </div>
              {roleBadge(m.role)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubSelectorPage;
