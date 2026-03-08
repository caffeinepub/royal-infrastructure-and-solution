import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calculator,
  Cpu,
  Droplets,
  HardHat,
  Home,
  Layers,
  Loader2,
  PaintBucket,
  Save,
  Trash2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectType } from "../backend";
import type { ConstructionEstimate } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteEstimate,
  useSaveEstimate,
  useUserEstimates,
} from "../hooks/useQueries";
import { formatINR, generateId } from "../utils/format";

// Cost per sqft in INR
const RATES = {
  foundation: 500,
  structure: 800,
  roofing: 300,
  flooring: 400,
  electrical: 200,
  plumbing: 250,
  finishing: 350,
};

interface CostBreakdown {
  foundation: number;
  structure: number;
  roofing: number;
  flooring: number;
  electrical: number;
  plumbing: number;
  finishing: number;
  total: number;
}

function calculateCosts(area: number): CostBreakdown {
  const foundation = area * RATES.foundation;
  const structure = area * RATES.structure;
  const roofing = area * RATES.roofing;
  const flooring = area * RATES.flooring;
  const electrical = area * RATES.electrical;
  const plumbing = area * RATES.plumbing;
  const finishing = area * RATES.finishing;
  const total =
    foundation +
    structure +
    roofing +
    flooring +
    electrical +
    plumbing +
    finishing;
  return {
    foundation,
    structure,
    roofing,
    flooring,
    electrical,
    plumbing,
    finishing,
    total,
  };
}

const costItems = [
  {
    key: "foundation",
    label: "Foundation & Excavation",
    icon: HardHat,
    color: "text-amber-600 bg-amber-50",
  },
  {
    key: "structure",
    label: "Structure & Masonry",
    icon: Layers,
    color: "text-blue-600 bg-blue-50",
  },
  {
    key: "roofing",
    label: "Roofing & Waterproofing",
    icon: Home,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    key: "flooring",
    label: "Flooring & Tiling",
    icon: Cpu,
    color: "text-violet-600 bg-violet-50",
  },
  {
    key: "electrical",
    label: "Electrical Works",
    icon: Zap,
    color: "text-yellow-600 bg-yellow-50",
  },
  {
    key: "plumbing",
    label: "Plumbing & Sanitation",
    icon: Droplets,
    color: "text-cyan-600 bg-cyan-50",
  },
  {
    key: "finishing",
    label: "Finishing & Interiors",
    icon: PaintBucket,
    color: "text-pink-600 bg-pink-50",
  },
] as const;

export function EstimatorPage() {
  const { identity, login } = useInternetIdentity();
  const [form, setForm] = useState({
    projectName: "",
    projectType: ProjectType.residential,
    totalArea: "",
  });
  const [result, setResult] = useState<CostBreakdown | null>(null);

  const { data: savedEstimates, isLoading: estimatesLoading } =
    useUserEstimates();
  const saveMutation = useSaveEstimate();
  const deleteMutation = useDeleteEstimate();

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.projectName || !form.totalArea) {
      toast.error("Please fill in project name and area");
      return;
    }
    const area = Number(form.totalArea);
    if (Number.isNaN(area) || area <= 0) {
      toast.error("Please enter a valid area");
      return;
    }
    const costs = calculateCosts(area);
    setResult(costs);
  }

  async function handleSave() {
    if (!identity) {
      toast.info("Please login to save estimates");
      login();
      return;
    }
    if (!result || !form.projectName || !form.totalArea) {
      toast.error("Calculate first before saving");
      return;
    }
    try {
      const estimate: ConstructionEstimate = {
        id: generateId(),
        projectName: form.projectName,
        projectType: form.projectType,
        totalArea: BigInt(Math.round(Number(form.totalArea))),
        foundationCost: BigInt(result.foundation),
        structureCost: BigInt(result.structure),
        roofingCost: BigInt(result.roofing),
        flooringCost: BigInt(result.flooring),
        electricalCost: BigInt(result.electrical),
        plumbingCost: BigInt(result.plumbing),
        finishingCost: BigInt(result.finishing),
        totalCost: BigInt(result.total),
        notes: "",
        owner: identity.getPrincipal(),
      };
      await saveMutation.mutateAsync(estimate);
      toast.success("Estimate saved successfully!");
    } catch {
      toast.error("Failed to save estimate.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Estimate deleted");
    } catch {
      toast.error("Failed to delete estimate.");
    }
  }

  const area = Number(form.totalArea) || 0;
  const maxCost = result
    ? Math.max(
        result.foundation,
        result.structure,
        result.roofing,
        result.flooring,
        result.electrical,
        result.plumbing,
        result.finishing,
      )
    : 0;

  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Construction Cost Estimator
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Get instant cost breakdowns based on Indian market rates (per sq.ft)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator form */}
        <div className="space-y-6">
          <Card className="border border-border/60 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-4">
                <div className="space-y-1">
                  <Label>Project Name *</Label>
                  <Input
                    value={form.projectName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, projectName: e.target.value }))
                    }
                    placeholder="e.g. My Dream Home"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Project Type</Label>
                  <Select
                    value={form.projectType}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, projectType: v as ProjectType }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProjectType.residential}>
                        Residential
                      </SelectItem>
                      <SelectItem value={ProjectType.commercial}>
                        Commercial
                      </SelectItem>
                      <SelectItem value={ProjectType.interior}>
                        Interior Only
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Total Built-up Area (sq.ft) *</Label>
                  <Input
                    data-ocid="estimator.area_input"
                    type="number"
                    min="100"
                    max="100000"
                    value={form.totalArea}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, totalArea: e.target.value }))
                    }
                    placeholder="e.g. 2000"
                    required
                  />
                  {area > 0 && (
                    <p className="text-xs text-muted-foreground">
                      ≈ {(area / 10.764).toFixed(0)} sq.m
                    </p>
                  )}
                </div>

                {/* Rate card */}
                <div className="bg-muted/40 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Rates (₹ per sq.ft)
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {costItems.map((item) => (
                      <div
                        key={item.key}
                        className="flex justify-between text-xs"
                      >
                        <span className="text-muted-foreground">
                          {item.label.split(" ")[0]}
                        </span>
                        <span className="font-medium text-foreground">
                          ₹{RATES[item.key]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  data-ocid="estimator.calculate_button"
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Cost
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                data-ocid="estimator.result_panel"
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border border-border/60 shadow-xs">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="font-display text-lg">
                          {form.projectName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {form.totalArea} sq.ft · {form.projectType}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-2xl font-bold text-primary">
                          {formatINR(result.total)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total Estimate
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Separator />
                    <div className="space-y-3">
                      {costItems.map((item) => {
                        const value = result[item.key];
                        const pct = maxCost > 0 ? (value / maxCost) * 100 : 0;
                        const Icon = item.icon;
                        return (
                          <div key={item.key}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`p-1.5 rounded-md ${item.color}`}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-sm text-foreground">
                                  {item.label}
                                </span>
                              </div>
                              <span className="font-medium text-sm text-foreground">
                                {formatINR(value)}
                              </span>
                            </div>
                            <Progress value={pct} className="h-1.5" />
                          </div>
                        );
                      })}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-foreground">
                        Grand Total
                      </span>
                      <span className="font-display font-bold text-xl text-primary">
                        {formatINR(result.total)}
                      </span>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">
                        * Estimates are approximate and based on average Indian
                        market rates. Actual costs may vary by location,
                        material quality, and contractor.
                      </p>
                    </div>
                    <Button
                      data-ocid="estimator.save_button"
                      onClick={() => {
                        void handleSave();
                      }}
                      disabled={saveMutation.isPending || !identity}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {saveMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {identity ? "Save Estimate" : "Login to Save"}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border border-border/60 shadow-xs h-96 flex items-center justify-center">
                  <div className="text-center text-muted-foreground/50">
                    <Calculator className="h-14 w-14 mx-auto mb-4" />
                    <p className="font-display text-lg font-semibold text-muted-foreground">
                      Enter Details to Calculate
                    </p>
                    <p className="text-sm mt-1">
                      Fill in your project details and click Calculate
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Saved estimates */}
          {identity && (
            <div data-ocid="estimator.saved_list">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                Saved Estimates
              </h3>
              {estimatesLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : !savedEstimates || savedEstimates.length === 0 ? (
                <div
                  data-ocid="estimator.empty_state"
                  className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl"
                >
                  <Save className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No saved estimates yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedEstimates.map((est, idx) => (
                    <motion.div
                      key={est.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="border border-border/60 shadow-xs">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="font-display font-semibold text-sm text-foreground truncate">
                              {est.projectName}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {est.projectType}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {String(est.totalArea)} sq.ft
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-right">
                              <div className="font-display font-bold text-primary text-sm">
                                {formatINR(est.totalCost)}
                              </div>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Estimate
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "
                                    {est.projectName}"? This cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      void handleDelete(est.id);
                                    }}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
