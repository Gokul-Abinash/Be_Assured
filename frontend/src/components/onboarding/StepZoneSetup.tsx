import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  assignZone,
  getPrimaryZones,
  getSecondaryZones,
  type Zone,
} from "@/api/onboarding";
import { cn } from "@/lib/utils";
import {
  MapPin,
  ChevronDown,
  Search,
  X,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface StepZoneSetupProps {
  workerId: string;
  onNext: () => void;
  onBack: () => void;
}

// ─── Searchable Zone Dropdown ────────────────────────────────────────────────

interface ZoneSelectProps {
  id: string;
  label: string;
  placeholder: string;
  zones: Zone[];
  value: Zone | null;
  onChange: (zone: Zone | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  excludeIds?: number[];
}

function ZoneSelect({
  id,
  label,
  placeholder,
  zones,
  value,
  onChange,
  disabled,
  required,
  error,
  excludeIds = [],
}: ZoneSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = zones.filter(
    (z) =>
      !excludeIds.includes(z.zone_id) &&
      z.zone_name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label
          htmlFor={id}
          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
        >
          {label}
        </label>
        {required && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            Required
          </Badge>
        )}
      </div>

      <div ref={ref} className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) setOpen((o) => !o);
          }}
          className={cn(
            "w-full h-9 px-3 flex items-center justify-between rounded-md text-sm transition-all",
            "bg-white/5 border border-white/10 hover:border-white/20",
            open && "border-primary/60 ring-2 ring-primary/20",
            error && "border-destructive/60",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {value ? (
              <span className="text-foreground truncate">
                {value.zone_name}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {value && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="w-4 h-4 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          </div>
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-[oklch(0.17_0.018_264)] shadow-2xl shadow-black/50 overflow-hidden animate-fade-in">
            {/* Search input */}
            <div className="p-2 border-b border-white/8">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search zones..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-md outline-none focus:border-primary/60 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-3 text-sm text-muted-foreground text-center">
                  No zones found
                </p>
              ) : (
                filtered.map((zone) => (
                  <button
                    key={zone.zone_id}
                    type="button"
                    onClick={() => {
                      onChange(zone);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left flex items-center gap-2 transition-colors",
                      "hover:bg-white/8 text-foreground",
                      value?.zone_id === zone.zone_id &&
                        "bg-primary/15 text-primary",
                    )}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {zone.zone_name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function StepZoneSetup({
  workerId,
  onNext,
  onBack,
}: StepZoneSetupProps) {
  const [primaryZones, setPrimaryZones] = useState<Zone[]>([]);
  const [secondaryZones, setSecondaryZones] = useState<Zone[]>([]);
  const [loadingZones, setLoadingZones] = useState(true);

  const [primary, setPrimary] = useState<Zone | null>(null);
  const [secondary1, setSecondary1] = useState<Zone | null>(null);
  const [secondary2, setSecondary2] = useState<Zone | null>(null);

  const [errors, setErrors] = useState<{ primary?: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZones = async () => {
      setLoadingZones(true);
      const [p, s] = await Promise.all([
        getPrimaryZones(),
        getSecondaryZones(),
      ]);
      setPrimaryZones(p);
      setSecondaryZones(s);
      setLoadingZones(false);
    };
    fetchZones();
  }, []);

  // When secondary1 is cleared, also clear secondary2
  const handleSecondary1Change = (zone: Zone | null) => {
    setSecondary1(zone);
    if (!zone) setSecondary2(null);
  };

  const validate = (): boolean => {
    const newErrors: { primary?: string } = {};
    if (!primary) newErrors.primary = "Please select a primary zone";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError(null);

    const secondaryIds: number[] = [];
    if (secondary1) secondaryIds.push(secondary1.zone_id);
    if (secondary2) secondaryIds.push(secondary2.zone_id);

    try {
      await assignZone({
        worker_id: workerId,
        primary: primary!.zone_id,
        secondary: secondaryIds,
      });
      onNext();
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { detail?: string } };
        message?: string;
      };
      setApiError(
        error?.response?.data?.detail ||
          "Failed to assign zones. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Select your zones</h2>
        <p className="text-muted-foreground text-sm">
          Choose where you'll be working. Your primary zone is required.
        </p>
      </div>

      {loadingZones ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-9 rounded-md bg-white/5 animate-pulse border border-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Primary Zone */}
          <ZoneSelect
            id="primary-zone"
            label="Primary Zone"
            placeholder="Select primary zone..."
            zones={primaryZones}
            value={primary}
            onChange={(z) => {
              setPrimary(z);
              if (errors.primary) setErrors({});
            }}
            required
            error={errors.primary}
            excludeIds={[]}
          />

          {/* Secondary Zone 1 */}
          <ZoneSelect
            id="secondary-zone-1"
            label="Secondary Zone"
            placeholder="Select secondary zone (optional)..."
            zones={secondaryZones}
            value={secondary1}
            onChange={handleSecondary1Change}
            excludeIds={secondary2 ? [secondary2.zone_id] : []}
          />

          {/* Secondary Zone 2 — only shown after secondary1 is selected */}
          {secondary1 && (
            <div className="animate-fade-in-up">
              <ZoneSelect
                id="secondary-zone-2"
                label="Additional Secondary Zone"
                placeholder="Select another zone (optional)..."
                zones={secondaryZones}
                value={secondary2}
                onChange={setSecondary2}
                excludeIds={secondary1 ? [secondary1.zone_id] : []}
              />
            </div>
          )}

          {/* Summary card */}
          {primary && (
            <Card className="border-white/8 bg-white/3 animate-fade-in">
              <CardContent className="py-3 px-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                  Your selections
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="text-xs bg-primary/20 text-primary border border-primary/30 hover:bg-primary/25">
                    <MapPin className="w-2.5 h-2.5 mr-1" />
                    {primary.zone_name} (Primary)
                  </Badge>
                  {secondary1 && (
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="w-2.5 h-2.5 mr-1" />
                      {secondary1.zone_name}
                    </Badge>
                  )}
                  {secondary2 && (
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="w-2.5 h-2.5 mr-1" />
                      {secondary2.zone_name}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

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
          disabled={loading || loadingZones}
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
