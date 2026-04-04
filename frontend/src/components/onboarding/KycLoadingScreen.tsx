import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const STAGES = [
  { label: "Submitting KYC documents", icon: "📄", duration: 1200 },
  { label: "Verifying identity", icon: "🔍", duration: 1300 },
  { label: "Cross-checking records", icon: "🛡️", duration: 1200 },
  { label: "Setting up your profile", icon: "⚡", duration: 1300 },
];

export function KycLoadingScreen() {
  const navigate = useNavigate();
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    // Animate progress from 0 → 95 over ~5 seconds
    const TOTAL_MS = 5000;
    const TICK_MS = 50;
    const increment = (95 / TOTAL_MS) * TICK_MS;
    let current = 0;

    const progressTimer = setInterval(() => {
      current = Math.min(current + increment, 95);
      setProgress(current);
      if (current >= 95) clearInterval(progressTimer);
    }, TICK_MS);

    // Cycle through stages
    let stageIdx = 0;
    const stageTimers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;

    for (let i = 0; i < STAGES.length; i++) {
      const delay = elapsed;
      stageTimers.push(
        setTimeout(() => {
          setStageIndex(i);
          stageIdx = i;
        }, delay),
      );
      elapsed += STAGES[i].duration;
    }

    // Complete at 5s
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setComplete(true);
      setStageIndex(stageIdx);
    }, TOTAL_MS);

    // Redirect at 5.5s
    const redirectTimer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, TOTAL_MS + 500);

    return () => {
      clearInterval(progressTimer);
      stageTimers.forEach(clearTimeout);
      clearTimeout(completeTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  const stage = STAGES[Math.min(stageIndex, STAGES.length - 1)];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animated-bg px-6">
      <div className="w-full max-w-md space-y-10 text-center animate-fade-in">
        {/* Animated orb */}
        <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-primary/15 animate-pulse" />
          <div className="relative w-16 h-16 rounded-full bg-primary/25 border border-primary/40 flex items-center justify-center">
            {complete ? (
              <svg
                className="w-8 h-8 text-primary animate-fade-in"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <span className="text-2xl">{stage.icon}</span>
            )}
          </div>
        </div>

        {/* Status text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">
            {complete ? "All done!" : "Verifying your identity"}
          </h2>
          <p className="text-sm text-muted-foreground transition-all duration-500">
            {complete ? "Redirecting you to your dashboard..." : stage.label}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-3">
          <Progress value={progress} className="h-1.5 bg-white/10" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>KYC Processing</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Stage dots */}
        <div className="flex items-center justify-center gap-2">
          {STAGES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i <= stageIndex
                  ? "bg-primary scale-110"
                  : "bg-white/15 scale-100"
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-muted-foreground/60">
          This usually takes a few seconds. Please don't close this page.
        </p>
      </div>
    </div>
  );
}
