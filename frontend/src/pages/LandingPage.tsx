import { redirectToLogin, redirectToRegister } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Lock,
} from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "KYC Verified",
    desc: "End-to-end identity verification with enterprise-grade security.",
  },
  {
    icon: Zap,
    title: "Instant Onboarding",
    desc: "Complete your profile in under 2 minutes. No paperwork.",
  },
  {
    icon: Users,
    title: "Zone Management",
    desc: "Get assigned to your primary and secondary work zones seamlessly.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen animated-bg flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            Be Assured
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-xs border-white/10 text-muted-foreground hidden sm:flex"
        >
          <Lock className="w-2.5 h-2.5 mr-1" />
          256-bit encrypted
        </Badge>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
          {/* Pill badge */}
          <Badge className="text-xs px-3 py-1 bg-primary/15 text-primary border border-primary/25 hover:bg-primary/20">
            <Zap className="w-2.5 h-2.5 mr-1" />
            Worker Onboarding Platform
          </Badge>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.08]">
              Your work identity,{" "}
              <span className="gradient-text">verified and trusted.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Complete your onboarding in minutes. Set your zones, verify your
              identity, and start working with confidence.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              id="register-btn"
              onClick={() => redirectToRegister()}
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto h-11 px-8 text-sm font-semibold rounded-xl"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              id="login-btn"
              onClick={() => redirectToLogin()}
              variant="outline"
              size="lg"
              className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 w-full sm:w-auto h-11 px-8 text-sm font-medium rounded-xl"
            >
              Sign In
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Secured with{" "}
            <a
              href="https://kinde.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Kinde
            </a>{" "}
            authentication · No password required
          </p>
        </div>

        {/* Feature cards */}
        <Separator className="my-16 bg-white/8 max-w-4xl w-full" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full animate-fade-in">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass rounded-xl p-5 text-left space-y-3 hover:border-primary/20 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12 text-xs text-muted-foreground">
          {[
            "SOC 2 Compliant",
            "GDPR Ready",
            "99.9% Uptime",
            "24/7 Support",
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 px-6 text-xs text-muted-foreground/50">
        © {new Date().getFullYear()} Be Assured. All rights reserved.
      </footer>
    </div>
  );
}
