const LoginPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-6">
    <div className="glass-card rounded-2xl p-8 w-full max-w-sm text-center">
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Inloggen</h1>
      <p className="text-muted-foreground text-sm mb-6">Login wordt binnenkort geactiveerd</p>
      <div className="space-y-3">
        <div className="h-10 rounded-lg bg-muted animate-pulse" />
        <div className="h-10 rounded-lg bg-muted animate-pulse" />
      </div>
    </div>
  </div>
);

export default LoginPage;
