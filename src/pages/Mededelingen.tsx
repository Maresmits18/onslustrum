import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Megaphone, Heart, Send, Pin, Plus, MessageCircle,
  ExternalLink, BarChart3, Link2, Trash2, X
} from "lucide-react";
import MemberBottomNav from "@/components/MemberBottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// --- Types ---
interface Reply {
  id: number;
  author: string;
  initials: string;
  text: string;
  timestamp: string;
}

interface Announcement {
  kind: "announcement";
  id: number;
  author: string;
  initials: string;
  timestamp: string;
  text: string;
  image?: string;
  likes: number;
  liked: boolean;
  pinned: boolean;
  replies: Reply[];
}

interface Poll {
  kind: "poll";
  id: number;
  author: string;
  initials: string;
  timestamp: string;
  question: string;
  options: { label: string; votes: number }[];
  totalVotes: number;
  deadline: string;
  voted: number | null; // index
  pinned: boolean;
}

interface LinkCard {
  kind: "link";
  id: number;
  title: string;
  url: string;
  type: "whatsapp" | "instagram" | "drive" | "website" | "anders";
  pinned: boolean;
}

type FeedItem = Announcement | Poll | LinkCard;

// --- Static data ---
const linkIcons: Record<string, string> = {
  whatsapp: "💬",
  instagram: "📸",
  drive: "📁",
  website: "🌐",
  anders: "🔗",
};

const linkColors: Record<string, string> = {
  whatsapp: "bg-emerald-100 text-emerald-800 border-emerald-200",
  instagram: "bg-pink-100 text-pink-800 border-pink-200",
  drive: "bg-blue-100 text-blue-800 border-blue-200",
  website: "bg-slate-100 text-slate-700 border-slate-200",
  anders: "bg-muted text-muted-foreground border-border",
};

const initialFeed: FeedItem[] = [
  {
    kind: "announcement",
    id: 1,
    author: "Bestuur",
    initials: "BE",
    timestamp: "Vandaag, 14:30",
    text: "Lieve leden, de lustrumweek begint volgende week maandag! Zorg dat je je hebt aangemeld voor de evenementen. Het belooft een onvergetelijke week te worden. 🎉",
    likes: 24,
    liked: false,
    pinned: true,
    replies: [
      { id: 1, author: "Sophie", initials: "SV", text: "Kan niet wachten! 🥳", timestamp: "14:45" },
    ],
  },
  {
    kind: "poll",
    id: 2,
    author: "Lustrumcommissie",
    initials: "LC",
    timestamp: "Gisteren, 18:00",
    question: "Welk thema willen jullie voor de afsluitborrel?",
    options: [
      { label: "Gatsby / Roaring Twenties", votes: 45 },
      { label: "Tropical Night", votes: 32 },
      { label: "All White Party", votes: 28 },
      { label: "Casino Royale", votes: 37 },
    ],
    totalVotes: 142,
    deadline: "20 maart 2026",
    voted: null,
    pinned: false,
  },
  {
    kind: "announcement",
    id: 3,
    author: "Penningmeester",
    initials: "PM",
    timestamp: "Gisteren, 10:15",
    text: "Herinnering: de deadline voor het betalen van Pakket 2 is 15 maart. Neem contact op als je vragen hebt over je spaarsaldo.",
    likes: 8,
    liked: false,
    pinned: false,
    replies: [],
  },
  {
    kind: "link",
    id: 4,
    title: "WhatsApp Groep — Lustrumweek",
    url: "https://chat.whatsapp.com/example",
    type: "whatsapp",
    pinned: false,
  },
  {
    kind: "link",
    id: 5,
    title: "Instagram @pallasathena",
    url: "https://instagram.com/pallasathena",
    type: "instagram",
    pinned: false,
  },
  {
    kind: "link",
    id: 6,
    title: "Google Drive — Foto's & Documenten",
    url: "https://drive.google.com/example",
    type: "drive",
    pinned: false,
  },
  {
    kind: "announcement",
    id: 7,
    author: "Praeses",
    initials: "PR",
    timestamp: "11 maart, 09:00",
    text: "De commissieverdeling is definitief! Check je profiel om te zien in welke commissie je bent geplaatst. Bij vragen kun je altijd bij het bestuur terecht.",
    likes: 15,
    liked: false,
    pinned: false,
    replies: [
      { id: 1, author: "Thomas", initials: "TK", text: "Top, ik zit bij de reiscommissie!", timestamp: "09:12" },
      { id: 2, author: "Lisa", initials: "LB", text: "Leuk! Galacommissie hier 🎭", timestamp: "09:20" },
    ],
  },
];

const bottomNavItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/home/events", icon: Calendar, label: "Kalender" },
  { path: "/home/mededelingen", icon: Megaphone, label: "Feed" },
  { path: "/profiel", icon: User, label: "Profiel" },
];

// Simulate owner
const IS_OWNER = false;

const Mededelingen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [feed, setFeed] = useState<FeedItem[]>(initialFeed);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});
  const [showReplyFor, setShowReplyFor] = useState<number | null>(null);

  // Owner dialogs
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostType, setNewPostType] = useState<"announcement" | "poll" | "link">("announcement");
  const [newText, setNewText] = useState("");
  const [newPollQuestion, setNewPollQuestion] = useState("");
  const [newPollOptions, setNewPollOptions] = useState(["", ""]);
  const [newPollDeadline, setNewPollDeadline] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkType, setNewLinkType] = useState<string>("website");

  // Sort: pinned first, then by id desc
  const sortedFeed = [...feed].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.id - a.id;
  });

  // Separate links from main feed
  const mainFeed = sortedFeed.filter((i) => i.kind !== "link");
  const links = sortedFeed.filter((i) => i.kind === "link") as LinkCard[];

  const handleLike = (id: number) => {
    setFeed((f) =>
      f.map((item) =>
        item.kind === "announcement" && item.id === id
          ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 }
          : item
      )
    );
  };

  const handleReply = (id: number) => {
    const text = replyTexts[id]?.trim();
    if (!text) return;
    setFeed((f) =>
      f.map((item) =>
        item.kind === "announcement" && item.id === id
          ? {
              ...item,
              replies: [
                ...item.replies,
                { id: Date.now(), author: "Jij", initials: "PV", text, timestamp: "Nu" },
              ],
            }
          : item
      )
    );
    setReplyTexts((r) => ({ ...r, [id]: "" }));
    setShowReplyFor(null);
  };

  const handleVote = (pollId: number, optionIndex: number) => {
    setFeed((f) =>
      f.map((item) =>
        item.kind === "poll" && item.id === pollId && item.voted === null
          ? {
              ...item,
              voted: optionIndex,
              totalVotes: item.totalVotes + 1,
              options: item.options.map((o, i) => (i === optionIndex ? { ...o, votes: o.votes + 1 } : o)),
            }
          : item
      )
    );
  };

  const handlePin = (id: number) => {
    setFeed((f) =>
      f.map((item) => ({ ...item, pinned: item.id === id ? !item.pinned : false }))
    );
  };

  const handleDelete = (id: number) => {
    setFeed((f) => f.filter((item) => item.id !== id));
  };

  const handleNewPost = () => {
    const nextId = Math.max(...feed.map((f) => f.id)) + 1;
    if (newPostType === "announcement" && newText.trim()) {
      setFeed((f) => [
        ...f,
        {
          kind: "announcement",
          id: nextId,
          author: "Bestuur",
          initials: "BE",
          timestamp: "Zojuist",
          text: newText.trim(),
          likes: 0,
          liked: false,
          pinned: false,
          replies: [],
        },
      ]);
    } else if (newPostType === "poll" && newPollQuestion.trim() && newPollOptions.filter((o) => o.trim()).length >= 2) {
      setFeed((f) => [
        ...f,
        {
          kind: "poll",
          id: nextId,
          author: "Bestuur",
          initials: "BE",
          timestamp: "Zojuist",
          question: newPollQuestion.trim(),
          options: newPollOptions.filter((o) => o.trim()).map((o) => ({ label: o.trim(), votes: 0 })),
          totalVotes: 0,
          deadline: newPollDeadline || "Geen deadline",
          voted: null,
          pinned: false,
        },
      ]);
    } else if (newPostType === "link" && newLinkTitle.trim() && newLinkUrl.trim()) {
      setFeed((f) => [
        ...f,
        {
          kind: "link",
          id: nextId,
          title: newLinkTitle.trim(),
          url: newLinkUrl.trim(),
          type: newLinkType as LinkCard["type"],
          pinned: false,
        },
      ]);
    }
    // Reset
    setNewText("");
    setNewPollQuestion("");
    setNewPollOptions(["", ""]);
    setNewPollDeadline("");
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkType("website");
    setShowNewPost(false);
  };

  // --- Render helpers ---
  const renderAnnouncement = (item: Announcement) => (
    <div
      key={item.id}
      className={`glass-card rounded-xl p-5 space-y-3 transition-all ${
        item.pinned ? "ring-2 ring-[hsl(var(--gold))]/40 border-[hsl(var(--gold))]/30" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-display font-bold text-primary">{item.initials}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{item.author}</span>
              {item.pinned && <Pin className="w-3.5 h-3.5 text-primary fill-primary" />}
            </div>
            <span className="text-xs text-muted-foreground">{item.timestamp}</span>
          </div>
        </div>
        {IS_OWNER && (
          <div className="flex gap-1">
            <button
              onClick={() => handlePin(item.id)}
              className={`p-1.5 rounded-md transition-colors ${
                item.pinned ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              title={item.pinned ? "Losmaken" : "Vastpinnen"}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Text */}
      <p className="text-sm text-foreground leading-relaxed">{item.text}</p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => handleLike(item.id)}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all ${
            item.liked
              ? "text-primary bg-primary/10 font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${item.liked ? "fill-primary" : ""}`} />
          <span>{item.likes}</span>
        </button>
        <button
          onClick={() => setShowReplyFor(showReplyFor === item.id ? null : item.id)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-md hover:bg-muted/50 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{item.replies.length > 0 ? item.replies.length : "Reageer"}</span>
        </button>
      </div>

      {/* Replies */}
      {item.replies.length > 0 && (
        <div className="space-y-2 pt-1 border-t border-border">
          {item.replies.map((r) => (
            <div key={r.id} className="flex items-start gap-2 pt-2">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-muted-foreground">{r.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-foreground">{r.author}</span>
                  <span className="text-[10px] text-muted-foreground">{r.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply input */}
      {showReplyFor === item.id && (
        <div className="flex gap-2 pt-1">
          <Input
            value={replyTexts[item.id] || ""}
            onChange={(e) => setReplyTexts((r) => ({ ...r, [item.id]: e.target.value }))}
            placeholder="Schrijf een reactie..."
            className="text-sm h-8"
            maxLength={150}
            onKeyDown={(e) => e.key === "Enter" && handleReply(item.id)}
          />
          <Button size="sm" className="h-8 px-3" onClick={() => handleReply(item.id)}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  );

  const renderPoll = (item: Poll) => {
    const maxVotes = Math.max(...item.options.map((o) => o.votes), 1);
    return (
      <div
        key={item.id}
        className={`glass-card rounded-xl p-5 space-y-4 transition-all ${
          item.pinned ? "ring-2 ring-[hsl(var(--gold))]/40 border-[hsl(var(--gold))]/30" : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{item.author}</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">Poll</Badge>
                {item.pinned && <Pin className="w-3.5 h-3.5 text-primary fill-primary" />}
              </div>
              <span className="text-xs text-muted-foreground">{item.timestamp}</span>
            </div>
          </div>
          {IS_OWNER && (
            <div className="flex gap-1">
              <button
                onClick={() => handlePin(item.id)}
                className={`p-1.5 rounded-md transition-colors ${
                  item.pinned ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <h4 className="font-display font-semibold text-foreground leading-snug">{item.question}</h4>

        {/* Options */}
        <div className="space-y-2">
          {item.options.map((opt, i) => {
            const pct = item.totalVotes > 0 ? Math.round((opt.votes / item.totalVotes) * 100) : 0;
            const hasVoted = item.voted !== null;
            return (
              <button
                key={i}
                disabled={hasVoted}
                onClick={() => handleVote(item.id, i)}
                className={`w-full text-left rounded-lg border p-3 transition-all relative overflow-hidden ${
                  hasVoted
                    ? item.voted === i
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-background"
                    : "border-border hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
                }`}
              >
                {hasVoted && (
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <span className="text-sm text-foreground">{opt.label}</span>
                  {hasVoted && (
                    <span className="text-xs font-medium text-muted-foreground ml-2">{pct}%</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{item.totalVotes} stemmen</span>
          <span>Deadline: {item.deadline}</span>
        </div>
      </div>
    );
  };

  const renderLinkCard = (item: LinkCard) => (
    <a
      key={item.id}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 rounded-xl border p-4 transition-all hover:shadow-sm group ${linkColors[item.type]}`}
    >
      <span className="text-lg">{linkIcons[item.type]}</span>
      <span className="flex-1 text-sm font-medium truncate">{item.title}</span>
      <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
      {IS_OWNER && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDelete(item.id);
          }}
          className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-background/50 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </a>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground text-lg leading-tight">Mededelingen</h1>
              <p className="text-xs text-muted-foreground">Nieuws, polls & links</p>
            </div>
          </div>
          {IS_OWNER && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  Nieuw
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => { setNewPostType("announcement"); setShowNewPost(true); }}>
                  <Megaphone className="w-4 h-4 mr-2" /> Nieuwe mededeling
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setNewPostType("poll"); setShowNewPost(true); }}>
                  <BarChart3 className="w-4 h-4 mr-2" /> Poll aanmaken
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setNewPostType("link"); setShowNewPost(true); }}>
                  <Link2 className="w-4 h-4 mr-2" /> Link toevoegen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <main className="px-5 py-6 max-w-lg mx-auto animate-fade-in space-y-6">
        {/* Quick links section */}
        {links.length > 0 && (
          <section className="space-y-2">
            <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider flex items-center gap-2">
              <Link2 className="w-3.5 h-3.5 text-primary" />
              Snelle links
            </h3>
            <div className="space-y-2">
              {links.map(renderLinkCard)}
            </div>
          </section>
        )}

        {/* Divider */}
        {links.length > 0 && mainFeed.length > 0 && (
          <div className="h-px bg-border" />
        )}

        {/* Main feed */}
        <section className="space-y-4">
          {mainFeed.map((item) => {
            if (item.kind === "announcement") return renderAnnouncement(item);
            if (item.kind === "poll") return renderPoll(item);
            return null;
          })}
        </section>
      </main>

      {/* New Post Dialog */}
      <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {newPostType === "announcement" && "Nieuwe mededeling"}
              {newPostType === "poll" && "Poll aanmaken"}
              {newPostType === "link" && "Link toevoegen"}
            </DialogTitle>
          </DialogHeader>

          {newPostType === "announcement" && (
            <div className="space-y-3">
              <Textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value.slice(0, 500))}
                placeholder="Schrijf je mededeling..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">{newText.length}/500</p>
            </div>
          )}

          {newPostType === "poll" && (
            <div className="space-y-3">
              <Input
                value={newPollQuestion}
                onChange={(e) => setNewPollQuestion(e.target.value)}
                placeholder="Stel je vraag..."
              />
              {newPollOptions.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newPollOptions];
                      updated[i] = e.target.value;
                      setNewPollOptions(updated);
                    }}
                    placeholder={`Optie ${i + 1}`}
                  />
                  {newPollOptions.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setNewPollOptions(newPollOptions.filter((_, j) => j !== i))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {newPollOptions.length < 4 && (
                <Button variant="outline" size="sm" onClick={() => setNewPollOptions([...newPollOptions, ""])}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Optie toevoegen
                </Button>
              )}
              <Input
                value={newPollDeadline}
                onChange={(e) => setNewPollDeadline(e.target.value)}
                placeholder="Deadline (bv. 20 maart 2026)"
              />
            </div>
          )}

          {newPostType === "link" && (
            <div className="space-y-3">
              <Input
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="Link titel"
              />
              <Input
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://..."
              />
              <Select value={newLinkType} onValueChange={setNewLinkType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                  <SelectItem value="instagram">📸 Instagram</SelectItem>
                  <SelectItem value="drive">📁 Google Drive</SelectItem>
                  <SelectItem value="website">🌐 Website</SelectItem>
                  <SelectItem value="anders">🔗 Anders</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPost(false)}>Annuleren</Button>
            <Button onClick={handleNewPost}>Plaatsen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-40">
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

export default Mededelingen;
