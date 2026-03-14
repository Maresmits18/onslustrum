import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import MemberHome from "./pages/MemberHome";
import MemberEvents from "./pages/MemberEvents";
import MemberFinancieel from "./pages/MemberFinancieel";
import Mededelingen from "./pages/Mededelingen";
import Profiel from "./pages/Profiel";
import OwnerDashboard from "./pages/OwnerDashboard";
import Financieel from "./pages/Financieel";
import Instellingen from "./pages/Instellingen";
import OwnerKalender from "./pages/OwnerKalender";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<MemberHome />} />
        <Route path="/home/kalender" element={<MemberEvents />} />
        <Route path="/home/financieel" element={<MemberFinancieel />} />
        <Route path="/home/feed" element={<Mededelingen />} />
        <Route path="/home/profiel" element={<Profiel />} />
        {/* Legacy redirects */}
        <Route path="/home/events" element={<Navigate to="/home/kalender" replace />} />
        <Route path="/home/mededelingen" element={<Navigate to="/home/feed" replace />} />
        <Route path="/profiel" element={<Navigate to="/home/profiel" replace />} />
        {/* Owner */}
        <Route path="/dashboard" element={<OwnerDashboard />} />
        <Route path="/dashboard/kalender" element={<OwnerKalender />} />
        <Route path="/dashboard/financieel" element={<Financieel />} />
        <Route path="/dashboard/instellingen" element={<Instellingen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
