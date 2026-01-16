import { DiscordLoginButton } from "@/components/DiscordLoginButton";
import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Dark blue background matching site theme */}
      <div className="absolute inset-0 bg-background"></div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
      
      {/* Floating shapes for visual interest */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl p-12">
          {/* Logo and branding */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-primary/10 rounded-2xl mb-6">
              <img 
                src="/images/logo.png" 
                alt="Riverside Primary School" 
                className="h-20 w-20 mx-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to access Riverside Primary School
            </p>
          </div>

          {/* Discord login button - centered */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <DiscordLoginButton />
            </div>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Secure Login</span>
              </div>
            </div>

            {/* Info text */}
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our Terms of Service
              </p>
              <p className="text-xs text-muted-foreground">
                🔒 Your data is protected and secure
              </p>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          © 2026 Riverside Primary School • Roblox Roleplay Community
        </p>
      </div>
    </div>
  );
}
