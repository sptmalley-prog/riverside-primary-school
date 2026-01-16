import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Support from "./pages/Support";
import Careers from "./pages/Careers";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import { useAuth } from "./_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

function ProtectedRoute({ component: Component, adminOnly = false, ...rest }: any) {
  const { isAuthenticated, loading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    } else if (!loading && adminOnly && user?.role !== "admin") {
      setLocation("/");
    }
  }, [isAuthenticated, loading, user, adminOnly, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (adminOnly && user?.role !== "admin") return null;

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">{() => <ProtectedRoute component={Home} />}</Route>
      <Route path="/support">{() => <ProtectedRoute component={Support} />}</Route>
      <Route path="/careers">{() => <ProtectedRoute component={Careers} />}</Route>
      <Route path="/admin">{() => <ProtectedRoute component={AdminDashboard} adminOnly={true} />}</Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
