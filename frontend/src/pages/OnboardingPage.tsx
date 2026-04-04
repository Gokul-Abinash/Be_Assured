import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { StepPersonalInfo } from "@/components/onboarding/StepPersonalInfo";
import { StepZoneSetup } from "@/components/onboarding/StepZoneSetup";
import { StepKYC } from "@/components/onboarding/StepKYC";
import { KycLoadingScreen } from "@/components/onboarding/KycLoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirectToLogout } from "@/api/auth";

type OnboardingStep = 1 | 2 | 3 | "loading";

export function OnboardingPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [workerId, setWorkerId] = useState<string>("");

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your session...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Show KYC loading screen after step 3
  if (step === "loading") {
    return <KycLoadingScreen />;
  }

  return (
    <div className="min-h-screen animated-bg flex flex-col">
      {/* Top nav */}
      <header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Be Assured</span>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              {user.email}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => redirectToLogout()}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl space-y-6">
          {/* Welcome message — step 1 only */}
          {step === 1 && (
            <div className="text-center space-y-1 animate-fade-in">
              <p className="text-xs font-medium text-primary uppercase tracking-widest">
                Welcome
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Let's get you onboarded
              </h1>
              <p className="text-sm text-muted-foreground">
                Just 3 quick steps and you're all set.
              </p>
            </div>
          )}

          {/* Step indicator */}
          <StepIndicator currentStep={step as number} />

          {/* Card */}
          <Card className="border-white/8 bg-white/3 shadow-2xl shadow-black/30 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              {step === 1 && (
                <StepPersonalInfo
                  onNext={(id) => {
                    setWorkerId(id);
                    setStep(2);
                  }}
                />
              )}
              {step === 2 && (
                <StepZoneSetup
                  workerId={workerId}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <StepKYC
                  workerId={workerId}
                  onSubmit={() => setStep("loading")}
                  onBack={() => setStep(2)}
                />
              )}
            </CardContent>
          </Card>

          {/* Bottom hint */}
          <p className="text-center text-xs text-muted-foreground/60 pb-8">
            Step {step} of 3 · Your progress is saved automatically
          </p>
        </div>
      </main>
    </div>
  );
}
