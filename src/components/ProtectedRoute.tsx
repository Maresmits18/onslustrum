import { useClub } from "@/contexts/ClubContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireClub?: boolean;
}

const ProtectedRoute = ({ children, requireClub = true }: ProtectedRouteProps) => {
  const { user, loading, activeClub, memberships } = useClub();

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

  // Auto-select single club
  if (requireClub && !activeClub && memberships.length === 1) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
