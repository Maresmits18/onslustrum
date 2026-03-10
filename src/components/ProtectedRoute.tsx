import { useClub } from "@/contexts/ClubContext";
import { Navigate } from "react-router-dom";
import { Clock } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireClub?: boolean;
}

const ProtectedRoute = ({ children, requireClub = true }: ProtectedRouteProps) => {
  const { user, loading, activeClub, memberships, activeMembership } = useClub();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requireClub && memberships.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  if (requireClub && !activeClub && memberships.length > 1) {
    return <Navigate to="/club-selector" replace />;
  }

  if (requireClub && !activeClub && memberships.length === 1) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show waiting screen for pending members
  if (requireClub && activeMembership?.status === "pending") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card rounded-2xl p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Even geduld</h1>
          <p className="text-muted-foreground text-sm">
            Je aanmelding wordt beoordeeld door het bestuur. Je krijgt toegang zodra je aanvraag is goedgekeurd.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
