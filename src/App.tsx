import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClubProvider } from "@/contexts/ClubContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import ClubSelectorPage from "./pages/ClubSelectorPage";
import Dashboard from "./pages/Dashboard";
import Kalender from "./pages/Kalender";
import Nieuws from "./pages/Nieuws";
import Sparen from "./pages/Sparen";
import Commissies from "./pages/Commissies";
import Chat from "./pages/Chat";
import Polls from "./pages/Polls";
import Geschiedenis from "./pages/Geschiedenis";
import Sponsors from "./pages/Sponsors";
import Profiel from "./pages/Profiel";
import Instellingen from "./pages/Instellingen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Protected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ClubProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<ProtectedRoute requireClub={false}><OnboardingPage /></ProtectedRoute>} />
            <Route path="/club-selector" element={<ProtectedRoute requireClub={false}><ClubSelectorPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/kalender" element={<Protected><Kalender /></Protected>} />
            <Route path="/nieuws" element={<Protected><Nieuws /></Protected>} />
            <Route path="/sparen" element={<Protected><Sparen /></Protected>} />
            <Route path="/commissies" element={<Protected><Commissies /></Protected>} />
            <Route path="/chat" element={<Protected><Chat /></Protected>} />
            <Route path="/polls" element={<Protected><Polls /></Protected>} />
            <Route path="/geschiedenis" element={<Protected><Geschiedenis /></Protected>} />
            <Route path="/sponsors" element={<Protected><Sponsors /></Protected>} />
            <Route path="/profiel" element={<Protected><Profiel /></Protected>} />
            <Route path="/instellingen" element={<Protected><Instellingen /></Protected>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ClubProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
