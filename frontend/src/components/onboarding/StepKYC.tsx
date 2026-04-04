import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { uploadKYC } from "@/api/onboarding";
import { cn } from "@/lib/utils";
import { CreditCard, Shield, ArrowLeft, CheckCircle2 } from "lucide-react";

interface StepKYCProps {
  workerId: string;
  onSubmit: () => void;
  onBack: () => void;
}

interface FormData {
  aadhaar_number: string;
  pan_number: string;
}

interface FormErrors {
  aadhaar_number?: string;
  pan_number?: string;
}

export function StepKYC({ workerId, onSubmit, onBack }: StepKYCProps) {
  const [form, setForm] = useState<FormData>({
    aadhaar_number: "",
    pan_number: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const aadhaar = form.aadhaar_number.replace(/\s/g, "");
    if (!aadhaar) {
      newErrors.aadhaar_number = "Aadhaar number is required";
    } else if (!/^\d{12}$/.test(aadhaar)) {
      newErrors.aadhaar_number = "Aadhaar must be exactly 12 digits";
    }

    const pan = form.pan_number.trim().toUpperCase();
    if (!pan) {
      newErrors.pan_number = "PAN number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      newErrors.pan_number = "Enter a valid PAN (e.g. ABCDE1234F)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    try {
      await uploadKYC({
        worker_id: workerId,
        aadhaar_number: form.aadhaar_number.replace(/\s/g, ""),
        pan_number: form.pan_number.trim().toUpperCase(),
      });
      onSubmit();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      setApiError(
        error?.response?.data?.detail || "KYC submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-format: groups of 4
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setForm((prev) => ({ ...prev, aadhaar_number: formatted }));
    if (errors.aadhaar_number) setErrors((prev) => ({ ...prev, aadhaar_number: undefined }));
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 10);
    setForm((prev) => ({ ...prev, pan_number: value }));
    if (errors.pan_number) setErrors((prev) => ({ ...prev, pan_number: undefined }));
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Identity verification</h2>
        <p className="text-muted-foreground text-sm">
          Your documents are encrypted and stored securely.
        </p>
      </div>

      {/* Security badge */}
      <Card className="border-primary/20 bg-primary/8">
        <CardContent className="py-3 px-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">256-bit encrypted</p>
            <p className="text-xs text-muted-foreground">
              Your KYC data is protected and never shared without consent.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {/* Aadhaar Number */}
        <div className="space-y-2">
          <Label
            htmlFor="aadhaar"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Aadhaar Number
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="aadhaar"
              placeholder="0000 0000 0000"
              value={form.aadhaar_number}
              onChange={handleAadhaarChange}
              className={cn(
                "pl-9 bg-white/5 border-white/10 focus:border-primary/60 transition-colors font-mono tracking-widest text-sm",
                errors.aadhaar_number && "border-destructive/60"
              )}
            />
          </div>
          {errors.aadhaar_number ? (
            <p className="text-xs text-destructive">{errors.aadhaar_number}</p>
          ) : (
            <p className="text-xs text-muted-foreground">12-digit Aadhaar UID</p>
          )}
        </div>

        {/* PAN Number */}
        <div className="space-y-2">
          <Label
            htmlFor="pan"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            PAN Number
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="pan"
              placeholder="ABCDE1234F"
              value={form.pan_number}
              onChange={handlePanChange}
              className={cn(
                "pl-9 bg-white/5 border-white/10 focus:border-primary/60 transition-colors font-mono tracking-widest text-sm uppercase",
                errors.pan_number && "border-destructive/60"
              )}
            />
          </div>
          {errors.pan_number ? (
            <p className="text-xs text-destructive">{errors.pan_number}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              10-character PAN (e.g. ABCDE1234F)
            </p>
          )}
        </div>
      </div>

      {/* Consent notice */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
        <p>
          By submitting, I consent to Be Assured verifying my identity using the
          provided documents in accordance with our privacy policy.
        </p>
      </div>

      {apiError && (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardContent className="py-3 px-4">
            <p className="text-sm text-destructive">{apiError}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 h-10 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          size="lg"
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground min-w-[160px] h-10 text-sm font-medium"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Submit KYC
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
