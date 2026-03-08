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
  Building2,
  Calendar,
  Loader2,
  MapPin,
  Plus,
  Star,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectType } from "../backend";
import type { ArchitectureProject } from "../backend";
import { ExternalBlob } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useArchitectureProjects,
  useCreateArchitectureProject,
} from "../hooks/useQueries";
import { generateId } from "../utils/format";

const projectTypeColors: Record<string, string> = {
  residential: "bg-emerald-100 text-emerald-700",
  commercial: "bg-blue-100 text-blue-700",
  interior: "bg-violet-100 text-violet-700",
};

const sampleProjects: ArchitectureProject[] = [
  {
    id: "arch-1",
    title: "The Skyline Residences",
    description:
      "A landmark 24-storey residential tower featuring sky gardens, infinity pool and panoramic city views. LEED Gold certified.",
    projectType: ProjectType.residential,
    architectName: "Ar. Rohan Mehta",
    location: "Lower Parel, Mumbai",
    completedYear: BigInt(2023),
    featured: true,
    imageUrl: ExternalBlob.fromURL(
      "/assets/generated/property-luxury-villa.dim_800x500.jpg",
    ),
    owner: {} as never,
  },
  {
    id: "arch-2",
    title: "Greenleaf Corporate Park",
    description:
      "Sustainable 6-building commercial campus with central amphitheatre, co-working zones and 40% green cover.",
    projectType: ProjectType.commercial,
    architectName: "Ar. Priya Nambiar",
    location: "Whitefield, Bangalore",
    completedYear: BigInt(2022),
    featured: true,
    imageUrl: ExternalBlob.fromURL(
      "/assets/generated/property-commercial.dim_800x500.jpg",
    ),
    owner: {} as never,
  },
  {
    id: "arch-3",
    title: "The Heritage Haveli Restoration",
    description:
      "Award-winning restoration of a 200-year-old haveli, blending heritage elements with contemporary interiors.",
    projectType: ProjectType.interior,
    architectName: "Ar. Kavitha Pillai",
    location: "Old City, Jaipur",
    completedYear: BigInt(2021),
    featured: false,
    imageUrl: ExternalBlob.fromURL(
      "/assets/generated/property-residential-1.dim_800x500.jpg",
    ),
    owner: {} as never,
  },
  {
    id: "arch-4",
    title: "Coastal Villa — Goa",
    description:
      "Tropical modern villa designed around the natural landscape. Open living spaces, natural ventilation and local materials.",
    projectType: ProjectType.residential,
    architectName: "Ar. Marcus D'Souza",
    location: "Calangute, Goa",
    completedYear: BigInt(2024),
    featured: true,
    imageUrl: ExternalBlob.fromURL(
      "/assets/generated/property-luxury-villa.dim_800x500.jpg",
    ),
    owner: {} as never,
  },
  {
    id: "arch-5",
    title: "The Atrium — Mixed Use Development",
    description:
      "Five-level mixed-use complex with retail, F&B, offices and a rooftop event space connected by dramatic sky bridges.",
    projectType: ProjectType.commercial,
    architectName: "Ar. Sanjay Gupta & Associates",
    location: "Connaught Place, Delhi",
    completedYear: BigInt(2023),
    featured: false,
    imageUrl: ExternalBlob.fromURL(
      "/assets/generated/property-commercial.dim_800x500.jpg",
    ),
    owner: {} as never,
  },
  {
    id: "arch-6",
    title: "Zen Studio Apartments — Interior",
    description:
      "Complete interior design for 48 studio apartments. Minimalist Japanese-inspired aesthetic with custom joinery.",
    projectType: ProjectType.interior,
    architectName: "Ar. Tanvi Desai",
    location: "Bandra, Mumbai",
    completedYear: BigInt(2024),
    featured: false,
    imageUrl: ExternalBlob.fromURL(
      "/assets/generated/property-residential-1.dim_800x500.jpg",
    ),
    owner: {} as never,
  },
];

export function ArchitecturePage() {
  const { identity, login } = useInternetIdentity();
  const [addOpen, setAddOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const { data: apiProjects, isLoading } = useArchitectureProjects();
  const createMutation = useCreateArchitectureProject();

  const apiData = apiProjects ?? [];
  const projects = [...apiData, ...sampleProjects];

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectType: ProjectType.residential,
    architectName: "",
    location: "",
    completedYear: String(new Date().getFullYear()),
  });

  function resetForm() {
    setForm({
      title: "",
      description: "",
      projectType: ProjectType.residential,
      architectName: "",
      location: "",
      completedYear: String(new Date().getFullYear()),
    });
    setUploadFile(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identity) {
      login();
      return;
    }
    if (!form.title || !form.architectName || !form.location) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      let imageUrl: ExternalBlob;
      if (uploadFile) {
        const bytes = new Uint8Array(await uploadFile.arrayBuffer());
        imageUrl = ExternalBlob.fromBytes(bytes);
      } else {
        imageUrl = ExternalBlob.fromURL("");
      }

      const project: ArchitectureProject = {
        id: generateId(),
        title: form.title,
        description: form.description,
        projectType: form.projectType,
        architectName: form.architectName,
        location: form.location,
        completedYear: BigInt(Number(form.completedYear)),
        featured: false,
        imageUrl,
        owner: identity.getPrincipal(),
      };
      await createMutation.mutateAsync(project);
      toast.success("Architecture project submitted!");
      setAddOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to submit project. Please try again.");
    }
  }

  return (
    <main className="container py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Architecture Projects
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Showcase of exceptional architecture across India
          </p>
        </div>
        <Button
          data-ocid="architecture.add_button"
          onClick={() => {
            if (!identity) {
              toast.info("Please login to add a project");
              login();
              return;
            }
            setAddOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((sk) => (
            <Card key={sk} className="overflow-hidden">
              <Skeleton className="h-52 w-full rounded-none" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && projects.length === 0 && (
        <div data-ocid="architecture.empty_state" className="text-center py-20">
          <Building2 className="h-14 w-14 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            No projects yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Showcase your architecture work to thousands of clients.
          </p>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Project
          </Button>
        </div>
      )}

      {/* Projects grid */}
      {!isLoading && projects.length > 0 && (
        <div
          data-ocid="architecture.list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, idx) => {
            const imgUrl = project.imageUrl?.getDirectURL?.() ?? null;
            return (
              <motion.div
                key={project.id}
                data-ocid={`architecture.item.${idx + 1}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="card-hover overflow-hidden border border-border/60 shadow-xs h-full">
                  <div className="h-52 overflow-hidden relative bg-muted/30">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building2 className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <Badge
                      className={`absolute top-3 left-3 text-xs capitalize ${projectTypeColors[project.projectType] ?? ""}`}
                    >
                      {project.projectType}
                    </Badge>
                    {project.featured && (
                      <div className="absolute top-3 right-3 bg-gold/90 text-accent-foreground rounded-full p-1">
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-display font-semibold text-foreground text-base leading-snug line-clamp-2 mb-1">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                        {project.description}
                      </p>
                    )}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        <span>{project.architectName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Completed {String(project.completedYear)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Project Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Add Architecture Project
            </DialogTitle>
            <DialogDescription>
              Share your completed project with the Royal Infrastructure
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
              <Label>Project Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. The Skyline Residences"
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
                placeholder="Describe the project, materials, highlights..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                      Interior
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Year Completed</Label>
                <Input
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 2}
                  value={form.completedYear}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, completedYear: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Architect Name *</Label>
              <Input
                value={form.architectName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, architectName: e.target.value }))
                }
                placeholder="e.g. Ar. Rohan Mehta"
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Location *</Label>
              <Input
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="e.g. Whitefield, Bangalore"
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Project Image (optional)</Label>
              <Input
                data-ocid="architecture.upload_button"
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
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
                    Submitting...
                  </>
                ) : (
                  "Submit Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
