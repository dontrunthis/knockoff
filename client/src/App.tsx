import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import CalendarPage from "@/pages/calendar";
import InsightsPage from "@/pages/insights";
import SettingsPage from "@/pages/settings";
import Header from "@/components/header";
import MobileNavigation from "@/components/mobile-navigation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CalendarPage} />
      <Route path="/insights" component={InsightsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen watercolor-bg">
          <Header />
          <Router />
          <MobileNavigation />
          <div className="pb-20 md:pb-8"></div> {/* Spacer for mobile navigation */}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
