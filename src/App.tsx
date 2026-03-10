import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoginModal } from "@/components/LoginModal";
import Dashboard from "./pages/Dashboard";
import Pipeline from "./pages/Pipeline";
import PowerDialer from "./pages/PowerDialer";
import Automatisation from "./pages/Automatisation";
import Ambassadeur from "./pages/Ambassadeur";
import BaseVendeurs from "./pages/BaseVendeurs";
import NoShows from "./pages/NoShows";
import Equipe from "./pages/Equipe";
import Taches from "./pages/Taches";
import Agenda from "./pages/Agenda";
import CockpitOmnicanal from "./pages/CockpitOmnicanal";
import Suggestions from "./pages/Suggestions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(() => !!sessionStorage.getItem("pigeimmo_user"));

  const handleLogin = (email: string) => {
    sessionStorage.setItem("pigeimmo_user", email);
    setLoggedIn(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LoginModal open={!loggedIn} onLogin={handleLogin} />
        {loggedIn && (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/dialer" element={<PowerDialer />} />
              <Route path="/automatisation" element={<Automatisation />} />
              <Route path="/ambassadeur" element={<Ambassadeur />} />
              <Route path="/vendeurs" element={<BaseVendeurs />} />
              <Route path="/noshows" element={<NoShows />} />
              <Route path="/equipe" element={<Equipe />} />
              <Route path="/taches" element={<Taches />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/cockpit" element={<CockpitOmnicanal />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
