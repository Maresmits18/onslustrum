import AppLayout from "@/components/AppLayout";
import { useClub } from "@/contexts/ClubContext";
import { Calendar, Users, Megaphone, PiggyBank } from "lucide-react";

const stats = [
  { label: "Dagen tot lustrum", value: "42", icon: Calendar, color: "bg-primary/10 text-primary" },
  { label: "Leden", value: "—", icon: Users, color: "bg-secondary/20 text-secondary-foreground" },
  { label: "Aankondigingen", value: "0", icon: Megaphone, color: "bg-rose-light text-primary" },
  { label: "Gespaard", value: "€0", icon: PiggyBank, color: "bg-gold-light text-foreground" },
];

const Dashboard = () => {
  const { activeClub, activeRole } = useClub();

  return (
    <AppLayout title="Dashboard" subtitle={`Welkom terug bij ${activeClub?.name || "je club"}`}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent News placeholder */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Laatste nieuws</h2>
        <p className="text-muted-foreground text-sm">Nog geen nieuwsberichten. {activeRole === "owner" || activeRole === "admin" ? "Plaats je eerste bericht!" : ""}</p>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
