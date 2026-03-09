import AppLayout from "@/components/AppLayout";
import { Calendar, Users, Megaphone, PiggyBank } from "lucide-react";

const stats = [
  { label: "Dagen tot lustrum", value: "42", icon: Calendar, color: "bg-primary/10 text-primary" },
  { label: "Leden", value: "87", icon: Users, color: "bg-secondary/20 text-secondary-foreground" },
  { label: "Aankondigingen", value: "12", icon: Megaphone, color: "bg-rose-light text-primary" },
  { label: "Gespaard", value: "€4.230", icon: PiggyBank, color: "bg-gold-light text-foreground" },
];

const recentNews = [
  { title: "Lustrum commissie zoekt leden!", date: "8 mrt 2026", tag: "Commissie" },
  { title: "Eerste betaalronde geopend", date: "5 mrt 2026", tag: "Financieel" },
  { title: "Save the date: Gala op 15 mei", date: "1 mrt 2026", tag: "Evenement" },
];

const Dashboard = () => {
  return (
    <AppLayout title="Dashboard" subtitle="Welkom terug bij Pallas Athena">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      {/* Recent News */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Laatste nieuws</h2>
        <div className="space-y-3">
          {recentNews.map((item) => (
            <div key={item.title} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-rose-light text-primary font-medium">
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
