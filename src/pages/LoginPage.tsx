import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Static — just navigate
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Decorative top line */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-0.5 bg-primary/40 rounded-full" />
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
              {isSignUp ? "Account aanmaken" : "Welkom terug"}
            </h1>
            <p className="text-muted-foreground text-sm mt-2 font-body">
              {isSignUp ? "Maak een account aan om te beginnen" : "Log in bij je vereniging"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs uppercase tracking-wider text-muted-foreground">Volledige naam</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Je volledige naam"
                  className="bg-background/60 border-border"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="naam@voorbeeld.nl"
                className="bg-background/60 border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background/60 border-border"
              />
            </div>

            <Button type="submit" className="w-full mt-2 font-display tracking-wide">
              {isSignUp ? "Registreren" : "Inloggen"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? "Heb je al een account? " : "Nog geen account? "}
              <span className="text-primary font-medium">{isSignUp ? "Inloggen" : "Registreren"}</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          Pallas Athena · Verenigingsapp
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
