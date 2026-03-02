import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "./lib/i18n";
import { lazy, Suspense } from "react";
import NotFound from "@/pages/not-found";

import Home from "./pages/Home";
import RequestForm from "./pages/RequestForm";
import TrackRequest from "./pages/TrackRequest";

// Lazy load admin pages for better performance
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminRequests = lazy(() => import("./pages/admin/Requests"));
const AdminNotices = lazy(() => import("./pages/admin/Notices"));

const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-muted-foreground font-medium animate-pulse">Loading Cyber Corner...</p>
    </div>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/request" component={RequestForm} />
        <Route path="/track" component={TrackRequest} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/requests" component={AdminRequests} />
        <Route path="/admin/notices" component={AdminNotices} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
