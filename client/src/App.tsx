import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/home";
import DoctorDetails from "@/pages/doctor-details";
import Apply from "@/pages/apply";
import Track from "@/pages/track";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/admin-dashboard";
import DoctorDashboard from "@/pages/doctor-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/doctor/dashboard" component={DoctorDashboard} />
      <Route path="/doctor/:license" component={DoctorDetails} />
      <Route path="/apply" component={Apply} />
      <Route path="/track" component={Track} />
      <Route path="/login" component={Login} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
