import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, User, Newspaper, MessageCircle } from "lucide-react";

const newsItems = [
  {
    id: 1,
    title: "Lustrumweek programma bekend!",
    excerpt: "Van maandag tot en met vrijdag staat er een vol programma klaar voor alle leden.",
    date: "10 maart 2026",
    author: "Lustrumcommissie",
  },
  {
    id: 2,
    title: "ALV volgende week donderdag",
    excerpt: "De Algemene Ledenvergadering vindt plaats in de Senaatszaal. Vergeet je niet aan te melden.",
    date: "8 maart 2026",
    author: "Bestuur",
  },
  {
    id: 3,
    title: "Nieuwe sponsor: Bakkerij Van Dijk",
    excerpt: "We zijn trots op onze samenwerking met Bakkerij Van Dijk. Leden krijgen 10% korting.",
    date: "5 maart 2026",
    author: "Sponsorcommissie",
  },
];

const bottomNavItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/home/events", icon: Calendar, label: "Kalender" },
  { path: "/home/mededelingen", icon: Megaphone, label: "Feed" },
  { path: "/profiel", icon: User, label: "Profiel" },
];

const MemberHome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border safe-area-top">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-display font-bold text-primary text-sm">PA</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground text-lg leading-tight">Pallas Athena</h1>
            <p className="text-xs text-muted-foreground">Est. 1976 · 142 leden</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-5 py-6 max-w-lg mx-auto space-y-6 animate-fade-in">
        {/* Welcome */}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Goedemiddag, Pieter</h2>
          <p className="text-muted-foreground text-sm mt-1">Hier is het laatste nieuws van je club.</p>
        </div>

        {/* News feed */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Newspaper className="w-4 h-4 text-primary" />
            <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">Nieuws</h3>
          </div>

          {newsItems.map((item) => (
            <article
              key={item.id}
              className="glass-card rounded-xl p-5 space-y-2 hover:border-primary/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary">{item.author}</span>
                <span className="text-xs text-muted-foreground">{item.date}</span>
              </div>
              <h4 className="font-display font-semibold text-foreground leading-snug">{item.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.excerpt}</p>
            </article>
          ))}
        </section>
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

export default MemberHome;
