import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Club {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  font: string;
}

interface ClubMembership {
  club: Club;
  role: "owner" | "admin" | "member";
  status: "pending" | "active" | "rejected";
  full_name: string | null;
}

interface ClubContextType {
  user: User | null;
  loading: boolean;
  memberships: ClubMembership[];
  activeClub: Club | null;
  activeRole: "owner" | "admin" | "member" | null;
  activeMembership: ClubMembership | null;
  setActiveClubId: (clubId: string) => void;
  refreshMemberships: () => Promise<void>;
  signOut: () => Promise<void>;
  isOwnerOrAdmin: boolean;
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export const useClub = () => {
  const ctx = useContext(ClubContext);
  if (!ctx) throw new Error("useClub must be used within ClubProvider");
  return ctx;
};

function applyClubTheme(club: Club | null) {
  const root = document.documentElement;
  if (club) {
    root.style.setProperty("--color-primary", club.primary_color);
    root.style.setProperty("--color-secondary", club.secondary_color);
  } else {
    root.style.removeProperty("--color-primary");
    root.style.removeProperty("--color-secondary");
  }
}

export const ClubProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [activeClubId, setActiveClubIdState] = useState<string | null>(
    () => localStorage.getItem("activeClubId")
  );

  const fetchMemberships = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("club_members")
      .select("role, status, full_name, club:clubs(id, name, slug, logo_url, primary_color, secondary_color, font)")
      .eq("user_id", userId);

    if (error || !data) {
      setMemberships([]);
      return [];
    }

    const mapped: ClubMembership[] = data.map((m: any) => ({
      club: m.club,
      role: m.role,
      status: m.status ?? "active",
      full_name: m.full_name,
    }));
    setMemberships(mapped);
    return mapped;
  }, []);

  const refreshMemberships = useCallback(async () => {
    if (user) await fetchMemberships(user.id);
  }, [user, fetchMemberships]);

  const setActiveClubId = useCallback((clubId: string) => {
    setActiveClubIdState(clubId);
    localStorage.setItem("activeClubId", clubId);
  }, []);

  // Auth state — single listener, no separate getSession call
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);

        if (u) {
          const ms = await fetchMemberships(u.id);
          const activeMs = ms.filter(m => m.status === "active");
          if (activeMs.length === 1 && !activeClubId) {
            setActiveClubId(activeMs[0].club.id);
          }
        } else {
          setMemberships([]);
          setActiveClubIdState(null);
          localStorage.removeItem("activeClubId");
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Derive active club
  const activeMembership = memberships.find((m) => m.club.id === activeClubId) ?? null;
  const activeClub = activeMembership?.club ?? null;
  const activeRole = activeMembership?.role ?? null;

  // Apply theme whenever active club changes
  useEffect(() => {
    applyClubTheme(activeClub);
  }, [activeClub]);

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("activeClubId");
  };

  const isOwnerOrAdmin = activeRole === "owner" || activeRole === "admin";

  return (
    <ClubContext.Provider
      value={{
        user,
        loading,
        memberships,
        activeClub,
        activeRole,
        activeMembership,
        setActiveClubId,
        refreshMemberships,
        signOut,
        isOwnerOrAdmin,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
};
