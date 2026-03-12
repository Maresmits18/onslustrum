import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Euro, Save } from "lucide-react";
import OwnerSidebar from "@/components/OwnerSidebar";

const defaultPrices = { "Pakket 1": 75, "Pakket 2": 125, "Pakket 3": 200, "Pakket 4": 350 };

const Instellingen = () => {
  const [prices, setPrices] = useState(defaultPrices);

  const updatePrice = (key: string, value: string) => {
    setPrices(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <OwnerSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Instellingen</h2>
            <p className="text-muted-foreground text-sm mt-1">App- en club-instellingen</p>
          </div>

          {/* Pakketten */}
          <section className="glass-card rounded-xl p-6 space-y-5">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Pakketten</h3>
              <p className="text-sm text-muted-foreground mt-1">Stel de prijs in voor elk pakket. Deze worden gebruikt in het financieel overzicht.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(prices).map(([name, price]) => (
                <div key={name} className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">{name}</Label>
                  <div className="relative">
                    <Euro className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="number"
                      value={price}
                      onChange={e => updatePrice(name, e.target.value)}
                      className="pl-9 bg-background"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button className="font-display tracking-wide">
              <Save className="w-4 h-4 mr-2" /> Opslaan
            </Button>
          </section>

          {/* Placeholder for other settings */}
          <section className="glass-card rounded-xl p-8 text-center">
            <p className="text-muted-foreground">Club branding, notificatie-voorkeuren en accountbeheer komen hier.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Instellingen;
