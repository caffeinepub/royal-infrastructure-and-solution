import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Bath,
  BedDouble,
  DoorOpen,
  Layers,
  Loader2,
  Plus,
  Ruler,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { FloorStyle } from "../backend";
import type { FloorPlan } from "../backend";
import { ExternalBlob } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateFloorPlan, useFloorPlans } from "../hooks/useQueries";
import { formatArea, formatINR, generateId } from "../utils/format";

const styleColors: Record<string, string> = {
  modern: "bg-blue-50 text-blue-700",
  traditional: "bg-amber-50 text-amber-700",
  contemporary: "bg-violet-50 text-violet-700",
};

const sampleFloorPlans: FloorPlan[] = [
  {
    id: "fp-1",
    title: "Modern 3BHK Single Floor Villa",
    description:
      "Open-plan living with seamless indoor-outdoor transition. Master bedroom with walk-in wardrobe.",
    rooms: BigInt(3),
    bathrooms: BigInt(2),
    totalArea: BigInt(2200),
    floors: BigInt(1),
    style: FloorStyle.modern,
    authorName: "Ar. Suhas Kulkarni",
    price: BigInt(45000),
    imageUrl: ExternalBlob.fromURL(
      "/assets/generated/floorplan-modern-house.dim_800x600.jpg",
    ),
    owner: {} as never,
  },
  {
    id: "fp-2",
    title: "Contemporary Duplex — 4BHK",
    description:
      "Double-storey family home with dedicated study, home theatre and open kitchen.",
    rooms: BigInt(4),
    bathrooms: BigInt(3),
    totalArea: BigInt(3600),
    floors: BigInt(2),
    style: FloorStyle.contemporary,
    authorName: "Ar. Deepa Ramesh",
    price: BigInt(75000),
    imageUrl: ExternalBlob.fromURL(
      "/assets/generated/floorplan-modern-house.dim_800x600.jpg",
    ),
    owner: {} as never,
  },
  {
    id: "fp-3",
    title: "Traditional South Indian Home",
    description:
      "Vastu-compliant design with central courtyard, prayer room and traditional elements.",
    rooms: BigInt(3),
    bathrooms: BigInt(2),
    totalArea: BigInt(1800),
    floors: BigInt(1),
    style: FloorStyle.traditional,
    authorName: "Ar. Ramaswamy",
    price: BigInt(35000),
    imageUrl: ExternalBlob.fromURL(
      "/assets/generated/floorplan-modern-house.dim_800x600.jpg",
    ),
    owner: {} as never,
  },
  {
    id: "fp-4",
    title: "Compact Studio Apartment Plan",
    description:
      "Efficient studio layout with multifunctional spaces. Perfect for urban living.",
    rooms: BigInt(1),
    bathrooms: BigInt(1),
    totalArea: BigInt(550),
    floors: BigInt(1),
    style: FloorStyle.modern,
    authorName: "Ar. Meenakshi Singh",
    price: BigInt(15000),
    imageUrl: ExternalBlob.fromURL(
      "/assets/generated/floorplan-modern-house.dim_800x600.jpg",
    ),
    owner: {} as never,
  },
  {
    id: "fp-5",
    title: "5BHK Luxury Estate Plan",
    description:
      "Three-floor luxury estate with home office, gym, pool deck and rooftop garden.",
    rooms: BigInt(5),
    bathrooms: BigInt(5),
    totalArea: BigInt(7200),
    floors: BigInt(3),
    style: FloorStyle.contemporary,
    authorName: "Ar. Vikrant Sharma",
    price: BigInt(150000),
    imageUrl: ExternalBlob.fromURL(
      "/assets/generated/floorplan-modern-house.dim_800x600.jpg",
    ),
    owner: {} as never,
  },
];

export function FloorPlansPage() {
  const { identity, login } = useInternetIdentity();
  const [addOpen, setAddOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: apiPlans, isLoading } = useFloorPlans();
  const createMutation = useCreateFloorPlan();

  const apiData = apiPlans ?? [];
  const plans = [...apiData, ...sampleFloorPlans];

  const [form, setForm] = useState({
    title: "",
    description: "",
    rooms: "3",
    bathrooms: "2",
    totalArea: "",
    floors: "1",
    style: FloorStyle.modern,
    authorName: "",
    price: "",
  });

  function resetForm() {
    setForm({
      title: "",
      description: "",
      rooms: "3",
      bathrooms: "2",
      totalArea: "",
      floors: "1",
      style: FloorStyle.modern,
      authorName: "",
      price: "",
    });
    setUploadFile(null);
    setUploadProgress(0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identity) {
      login();
      return;
    }
    if (!form.title || !form.totalArea || !form.price) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      let imageUrl: ExternalBlob;
      if (uploadFile) {
        const bytes = new Uint8Array(await uploadFile.arrayBuffer());
        imageUrl = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
          setUploadProgress(pct),
        );
      } else {
        imageUrl = ExternalBlob.fromURL("");
      }

      const plan: FloorPlan = {
        id: generateId(),
        title: form.title,
        description: form.description,
        rooms: BigInt(Number(form.rooms)),
        bathrooms: BigInt(Number(form.bathrooms)),
        totalArea: BigInt(Math.round(Number(form.totalArea))),
        floors: BigInt(Number(form.floors)),
        style: form.style,
        authorName: form.authorName,
        price: BigInt(Math.round(Number(form.price))),
        imageUrl,
        owner: identity.getPrincipal(),
      };
      await createMutation.mutateAsync(plan);
      toast.success("Floor plan published!");
      setAddOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to publish floor plan. Please try again.");
    }
  }

  return (
    <main className="container py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Floor Plans
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Professional floor plans for every home style
          </p>
        </div>
        <Button
          data-ocid="floorplans.add_button"
          onClick={() => {
            if (!identity) {
              toast.info("Please login to add a floor plan");
              login();
              return;
            }
            setAddOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Floor Plan
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((sk) => (
            <Card key={sk} className="overflow-hidden">
              <Skeleton className="h-44 w-full rounded-none" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && plans.length === 0 && (
        <div data-ocid="floorplans.empty_state" className="text-center py-20">
          <Layers className="h-14 w-14 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            No floor plans yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Share your floor plan designs with the community.
          </p>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Plan
          </Button>
        </div>
      )}

      {/* Plans grid */}
      {!isLoading && plans.length > 0 && (
        <div
          data-ocid="floorplans.list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {plans.map((plan, idx) => {
            const imgUrl = plan.imageUrl?.getDirectURL?.() ?? null;
            return (
              <motion.div
                key={plan.id}
                data-ocid={`floorplans.item.${idx + 1}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="card-hover overflow-hidden border border-border/60 shadow-xs h-full">
                  <div className="h-44 overflow-hidden relative bg-muted/30">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={plan.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Layers className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <Badge
                      className={`absolute top-3 left-3 text-xs capitalize ${styleColors[plan.style] ?? ""}`}
                    >
                      {plan.style}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-display font-semibold text-foreground text-base leading-snug line-clamp-2 mb-1">
                      {plan.title}
                    </h3>
                    {plan.authorName && (
                      <p className="text-xs text-muted-foreground mb-3">
                        by {plan.authorName}
                      </p>
                    )}
                    {plan.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                        {plan.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <BedDouble className="h-3.5 w-3.5" />
                        <span>{String(plan.rooms)} Rooms</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="h-3.5 w-3.5" />
                        <span>{String(plan.bathrooms)} Baths</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Ruler className="h-3.5 w-3.5" />
                        <span>{formatArea(plan.totalArea)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DoorOpen className="h-3.5 w-3.5" />
                        <span>
                          {String(plan.floors)} Floor
                          {Number(plan.floors) > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="font-display font-bold text-primary text-lg">
                      {formatINR(plan.price)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Floor Plan Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Add Floor Plan
            </DialogTitle>
            <DialogDescription>
              Share your floor plan design with the Royal Infrastructure
              community.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            className="space-y-4 mt-2"
          >
            <div className="space-y-1">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Modern 3BHK Single Floor Villa"
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe the floor plan..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Rooms</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.rooms}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, rooms: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Bathrooms</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.bathrooms}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bathrooms: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Total Area (sq.ft) *</Label>
                <Input
                  type="number"
                  value={form.totalArea}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, totalArea: e.target.value }))
                  }
                  placeholder="e.g. 2200"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Floors</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.floors}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, floors: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Style</Label>
                <Select
                  value={form.style}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, style: v as FloorStyle }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FloorStyle.modern}>Modern</SelectItem>
                    <SelectItem value={FloorStyle.traditional}>
                      Traditional
                    </SelectItem>
                    <SelectItem value={FloorStyle.contemporary}>
                      Contemporary
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Price (₹) *</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="e.g. 45000"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Architect / Author Name</Label>
              <Input
                value={form.authorName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, authorName: e.target.value }))
                }
                placeholder="e.g. Ar. Suhas Kulkarni"
              />
            </div>
            <div className="space-y-1">
              <Label>Floor Plan Image (optional)</Label>
              <Input
                data-ocid="floorplans.upload_button"
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <p className="text-xs text-muted-foreground">
                  Uploading: {uploadProgress}%
                </p>
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Plan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
