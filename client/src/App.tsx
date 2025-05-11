import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import MainLayout from "@/pages/MainLayout";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";
import DestinationPage from "@/pages/DestinationPage";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/explore" component={Explore} />
          <Route path="/destination/:id">
            {(params) => (
              <MainLayout>
                <DestinationPage />
              </MainLayout>
            )}
          </Route>
          <Route path="/edit-trip/:id">
            {(params) => (
              <MainLayout>
                <Home editMode={true} tripId={params.id} />
              </MainLayout>
            )}
          </Route>
          <Route path="/">
            {() => (
              <MainLayout>
                <Home />
              </MainLayout>
            )}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
