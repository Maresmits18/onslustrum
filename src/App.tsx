import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
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
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/kalender" element={<Kalender />} />
          <Route path="/nieuws" element={<Nieuws />} />
          <Route path="/sparen" element={<Sparen />} />
          <Route path="/commissies" element={<Commissies />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/geschiedenis" element={<Geschiedenis />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/profiel" element={<Profiel />} />
          <Route path="/instellingen" element={<Instellingen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
