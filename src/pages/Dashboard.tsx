import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useClub } from "@/contexts/ClubContext";
import { supabase } from "@/lib/supabase";
import { Calendar, Users, Megaphone, PiggyBank, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const stats = [
  { label: "Dagen tot lustrum", value: "42", icon: Calendar, color: "bg-primary/10 text-primary" },
  { label: "Leden", value: "—", icon: Users, color: "bg-secondary/20 text-secondary-foreground" },
  { label: "Aankondigingen", value: "0", icon: Megaphone, color: "bg-rose-light text-primary" },
  { label: "Gespaard", value: "€0", icon: PiggyBank, color: "bg-gold-light text-foreground" },
];

interface PendingMember {
  id: string;
  full_name: string | null;
  user_id: string;
  joined_at: string | null;
}

const Dashboard = () => {
  const { activeClub, activeRole, isOwnerOrAdmin } = useClub();
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);

  useEffect(() => {
    if (!activeClub || !isOwnerOrAdmin) return;
    fetchPending();
  }, [activeClub, isOwnerOrAdmin]);

  const fetchPending = async () => {
    if (!activeClub) return;
    const { data } = await supabase
      .from("club_members")
      .select("id, full_name, user_id, joined_at")
      .eq("club_id", activeClub.id)
      .eq("status", "pending");
    setPendingMembers(data || []);
  };

  const handleApprove = async (memberId: string) => {
    const { error } = await supabase
      .from("club_members")
      .update({ status: "active" })
      .eq("id", memberId);
    if (error) { toast.error("Kon lid niet goedkeuren"); return; }
    toast.success("Lid goedgekeurd!");
    fetchPending();
  };

  const handleReject = async (memberId: string) => {
    const { error } = await supabase
      .from("club_members")
      .delete()
      .eq("id", memberId);
    if (error) { toast.error("Kon lid niet afwijzen"); return; }
    toast.success("Aanmelding afgewezen");
    fetchPending();
  };

  return (
    <AppLayout title="Dashboard" subtitle={`Welkom terug bij ${activeClub?.name || "je club"}`}>
      {/* Pending members for owners/admins */}
      {isOwnerOrAdmin && pendingMembers.length > 0 && (
        <div className="glass-card rounded-xl p-6 mb-6 border-l-4 border-primary">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Aanmeldingen ({pendingMembers.length})
          </h2>
          <div className="space-y-3">
            {pendingMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                <div>
                  <p className="font-medium text-foreground">{m.full_name || "Onbekend"}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.joined_at ? new Date(m.joined_at).toLocaleDateString("nl-NL") : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleReject(m.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => handleApprove(m.id)}>
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
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

      {/* Recent News placeholder */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Laatste nieuws</h2>
        <p className="text-muted-foreground text-sm">Nog geen nieuwsberichten. {isOwnerOrAdmin ? "Plaats je eerste bericht!" : ""}</p>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
