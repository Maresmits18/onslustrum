import pallasLogo from "@/assets/pallas-logo.png";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Users, Megaphone, PiggyBank, MessageCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: Calendar, title: "Kalender", desc: "Alle activiteiten op één plek" },
  { icon: Megaphone, title: "Nieuws", desc: "Updates direct van het bestuur" },
  { icon: PiggyBank, title: "Sparen", desc: "Transparant financieel overzicht" },
  { icon: Users, title: "Commissies", desc: "Beheer en interesse-peiling" },
  { icon: MessageCircle, title: "Chat", desc: "Groeps- en privéberichten" },
  { icon: Award, title: "Sponsors", desc: "Partners en merchandise" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-light/50 via-background to-cream opacity-80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container mx-auto px-6 pt-8 pb-20">
          {/* Nav */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-20"
          >
            <div className="flex items-center gap-3">
              <img src={pallasLogo} alt="Pallas Athena" className="h-10 w-10 object-contain" />
              <span className="font-display text-lg font-semibold text-foreground tracking-wide">Lustrum Hub</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Inloggen
              </Button>
              <Button variant="hero" size="sm" onClick={() => navigate("/login")}>
                Aan de slag
              </Button>
            </div>
          </motion.nav>

          {/* Hero Content */}
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-secondary font-display text-sm tracking-[0.3em] uppercase mb-4">
                Dames Dispuut Pallas Athena
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-4 lg:mb-6">
                Jullie Lustrum,
                <br />
                <span className="text-gradient">Één Platform</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
                De centrale hub voor alles rondom jullie lustrum. Van kalender tot commissies, 
                van sparen tot chatten — alles op één elegante plek.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")}>
                Bekijk demo
              </Button>
              <Button variant="heroOutline" size="lg">
                Meer informatie
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-cream/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Alles wat je nodig hebt
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Eén app voor de volledige lustrumervaring
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-8 hover:elegant-shadow transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-rose-light flex items-center justify-center mb-5 group-hover:bg-secondary/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 via-rose-light/30 to-secondary/10 rounded-2xl p-12 border border-border/50"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Klaar voor jullie lustrum?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Start vandaag nog met het organiseren van een onvergetelijk lustrum.
            </p>
            <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")}>
              Start nu — het is gratis
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={pallasLogo} alt="Pallas Athena" className="h-6 w-6 object-contain" />
            <span className="font-display text-sm text-muted-foreground">Lustrum Hub</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Lustrum Hub. Met liefde gemaakt voor studentenverenigingen.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
