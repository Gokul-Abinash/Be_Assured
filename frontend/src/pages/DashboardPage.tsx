import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { redirectToLogout } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  LogOut,
  CheckCircle2,
  MapPin,
  User,
  Bell,
  Settings,
} from "lucide-react";

const QUICK_STATS = [
  { label: "Zones Assigned", value: "—", icon: MapPin },
  { label: "Status", value: "Active", icon: CheckCircle2, isGreen: true },
  { label: "KYC", value: "Verified", icon: Shield, isGreen: true },
];

export function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName =
    user?.first_name || user?.email?.split("@")[0] || "Worker";

  return (
    <div className="min-h-screen animated-bg flex flex-col">
      {/* Nav */}
      <header className="border-b border-white/6 bg-white/2 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Be Assured
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Bell className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-3.5 h-3.5" />
            </Button>
            <Separator
              orientation="vertical"
              className="h-4 bg-white/10 mx-1"
            />
            <Button
              variant="ghost"
              onClick={() => redirectToLogout()}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-7 pl-2 pr-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 px-6 py-10 max-w-5xl mx-auto w-full space-y-8 animate-fade-in-up">
        {/* Welcome */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{greeting} 👋</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, <span className="gradient-text">{displayName}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Your account is set up and ready to go.
          </p>
        </div>

        {/* Success banner */}
        <Card className="border-primary/25 bg-primary/8 animate-fade-in">
          <CardContent className="py-4 px-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Onboarding complete!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your profile is verified and you're ready to start.
              </p>
            </div>
            <Badge className="text-xs bg-primary/20 text-primary border border-primary/30 shrink-0">
              All set ✓
            </Badge>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_STATS.map(({ label, value, icon: Icon, isGreen }) => (
            <Card
              key={label}
              className="border-white/8 bg-white/3 hover:border-white/12 transition-colors"
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon
                    className={`w-4 h-4 ${isGreen ? "text-emerald-400" : "text-primary"}`}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p
                    className={`text-sm font-semibold mt-0.5 ${isGreen ? "text-emerald-400" : "text-foreground"}`}
                  >
                    {value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile card */}
        <Card className="border-white/8 bg-white/3">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/25 flex items-center justify-center shrink-0">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{displayName}</p>
                {user?.email && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {user.email}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="text-[10px] px-1.5 py-0 h-4 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                    KYC Verified
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4"
                  >
                    Worker
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
