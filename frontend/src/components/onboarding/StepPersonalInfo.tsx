import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createWorker } from "@/api/onboarding";
import { cn } from "@/lib/utils";
import { User, Calendar, Phone, ArrowRight } from "lucide-react";

interface StepPersonalInfoProps {
  onNext: (workerId: string) => void;
}

interface FormData {
  first_name: string;
  last_name: string;
  dob: string;
  phone: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  dob?: string;
  phone?: string;
}

export function StepPersonalInfo({ onNext }: StepPersonalInfoProps) {
  const [form, setForm] = useState<FormData>({
    first_name: "",
    last_name: "",
    dob: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!form.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dobDate = new Date(form.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      if (age < 18) newErrors.dob = "You must be at least 18 years old";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    try {
      const res = await createWorker(form);
      onNext(res.worker_id);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { detail?: string } };
        message?: string;
      };
      setApiError(
        error?.response?.data?.detail ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">
          Tell us about yourself
        </h2>
        <p className="text-muted-foreground text-sm">
          We'll use this information to set up your worker profile.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label
            htmlFor="first_name"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            First Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="first_name"
              placeholder="John"
              value={form.first_name}
              onChange={handleChange("first_name")}
              className={cn(
                "pl-9 bg-white/5 border-white/10 focus:border-primary/60 transition-colors",
                errors.first_name && "border-destructive/60",
              )}
            />
          </div>
          {errors.first_name && (
            <p className="text-xs text-destructive">{errors.first_name}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label
            htmlFor="last_name"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Last Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="last_name"
              placeholder="Doe"
              value={form.last_name}
              onChange={handleChange("last_name")}
              className={cn(
                "pl-9 bg-white/5 border-white/10 focus:border-primary/60 transition-colors",
                errors.last_name && "border-destructive/60",
              )}
            />
          </div>
          {errors.last_name && (
            <p className="text-xs text-destructive">{errors.last_name}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label
            htmlFor="dob"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Date of Birth
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="dob"
              type="date"
              value={form.dob}
              onChange={handleChange("dob")}
              max={
                new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                  .toISOString()
                  .split("T")[0]
              }
              className={cn(
                "pl-9 bg-white/5 border-white/10 focus:border-primary/60 transition-colors [color-scheme:dark]",
                errors.dob && "border-destructive/60",
              )}
            />
          </div>
          {errors.dob && (
            <p className="text-xs text-destructive">{errors.dob}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange("phone")}
              className={cn(
                "pl-9 bg-white/5 border-white/10 focus:border-primary/60 transition-colors",
                errors.phone && "border-destructive/60",
              )}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>
      </div>

      {apiError && (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardContent className="py-3 px-4">
            <p className="text-sm text-destructive">{apiError}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          size="lg"
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px] h-10 text-sm font-medium"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
