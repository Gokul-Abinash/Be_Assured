import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  labels?: string[];
}

const DEFAULT_LABELS = ["Personal Info", "Zone Setup", "KYC Verification"];

export function StepIndicator({
  currentStep,
  totalSteps = 3,
  labels = DEFAULT_LABELS,
}: StepIndicatorProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Connector lines */}
        <div className="absolute top-4 left-0 right-0 flex">
          {Array.from({ length: totalSteps - 1 }).map((_, i) => (
            <div key={i} className="flex-1 flex items-center">
              <div className="w-full mx-8 h-px" style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    i + 1 < currentStep
                      ? "bg-primary"
                      : "bg-white/10"
                  )}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          ))}
        </div>

        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={i} className="flex flex-col items-center gap-2 z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300",
                  isCompleted &&
                    "bg-primary text-primary-foreground",
                  isCurrent &&
                    "bg-primary text-primary-foreground ring-4 ring-primary/25 step-active",
                  !isCompleted &&
                    !isCurrent &&
                    "bg-white/5 text-muted-foreground border border-white/10"
                )}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium text-center transition-colors duration-300 hidden sm:block",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
