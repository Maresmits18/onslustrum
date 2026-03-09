import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import pallasLogo from "@/assets/pallas-logo.png";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName },
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account aangemaakt! Check je e-mail om te bevestigen.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="glass-card rounded-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <img src={pallasLogo} alt="Pallas Athena" className="h-14 w-14 object-contain mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isSignUp ? "Account aanmaken" : "Welkom terug"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isSignUp ? "Maak een account aan om te beginnen" : "Log in bij je club"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Volledige naam</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Je volledige naam"
                required
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="naam@voorbeeld.nl"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Wachtwoord</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Even geduld..." : isSignUp ? "Registreren" : "Inloggen"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSignUp ? "Heb je al een account? " : "Nog geen account? "}
            <span className="text-primary font-medium">
              {isSignUp ? "Inloggen" : "Registreren"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
