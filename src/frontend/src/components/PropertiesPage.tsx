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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bath,
  BedDouble,
  Building,
  Loader2,
  MapPin,
  Maximize2,
  Phone,
  Plus,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ListingStatus, ListingType, PropertyType } from "../backend";
import type { PropertyListing } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreatePropertyListing,
  useFilteredListings,
} from "../hooks/useQueries";
import { formatArea, formatINR, generateId } from "../utils/format";

const listingTypeBadge: Record<string, string> = {
  buy: "bg-emerald-100 text-emerald-700",
  sell: "bg-blue-100 text-blue-700",
  rent: "bg-amber-100 text-amber-700",
};

const propertyTypeIcon: Record<string, React.ReactNode> = {
  residential: <BedDouble className="h-3.5 w-3.5" />,
  commercial: <Building className="h-3.5 w-3.5" />,
  plot: <Maximize2 className="h-3.5 w-3.5" />,
};

const sampleListings: PropertyListing[] = [
  {
    id: "prop-1",
    title: "Spacious 3BHK Apartment in Koramangala",
    description:
      "Beautiful apartment with modern amenities, close to tech parks and shopping.",
    price: BigInt(9500000),
    location: "Koramangala, Bangalore",
    propertyType: PropertyType.residential,
    listingType: ListingType.sell,
    bedrooms: BigInt(3),
    bathrooms: BigInt(2),
    area: BigInt(1450),
    contactName: "Arun Krishnamurthy",
    contactPhone: "+91 98765 43210",
    status: ListingStatus.active,
    owner: {} as never,
  },
  {
    id: "prop-2",
    title: "Premium Villa with Pool",
    description:
      "Luxury 4BHK villa with private swimming pool and landscaped garden.",
    price: BigInt(38000000),
    location: "Whitefield, Bangalore",
    propertyType: PropertyType.residential,
    listingType: ListingType.sell,
    bedrooms: BigInt(4),
    bathrooms: BigInt(4),
    area: BigInt(4200),
    contactName: "Meera Sharma",
    contactPhone: "+91 87654 32109",
    status: ListingStatus.active,
    owner: {} as never,
  },
  {
    id: "prop-3",
    title: "Commercial Office Space — 2500 sqft",
    description:
      "Ready-to-move commercial office space in prime business district.",
    price: BigInt(25000000),
    location: "BKC, Mumbai",
    propertyType: PropertyType.commercial,
    listingType: ListingType.sell,
    bedrooms: BigInt(0),
    bathrooms: BigInt(2),
    area: BigInt(2500),
    contactName: "Suresh Patel",
    contactPhone: "+91 76543 21098",
    status: ListingStatus.active,
    owner: {} as never,
  },
  {
    id: "prop-4",
    title: "Residential Plot — 1800 sqft",
    description:
      "North-facing plot in gated community, BBMP approved, loan assistance available.",
    price: BigInt(7200000),
    location: "Electronic City, Bangalore",
    propertyType: PropertyType.plot,
    listingType: ListingType.sell,
    bedrooms: BigInt(0),
    bathrooms: BigInt(0),
    area: BigInt(1800),
    contactName: "Ravi Nair",
    contactPhone: "+91 65432 10987",
    status: ListingStatus.active,
    owner: {} as never,
  },
  {
    id: "prop-5",
    title: "2BHK Flat for Rent — Furnished",
    description:
      "Fully furnished 2BHK flat available for rent. All utilities included.",
    price: BigInt(35000),
    location: "Powai, Mumbai",
    propertyType: PropertyType.residential,
    listingType: ListingType.rent,
    bedrooms: BigInt(2),
    bathrooms: BigInt(2),
    area: BigInt(980),
    contactName: "Priya Iyer",
    contactPhone: "+91 54321 09876",
    status: ListingStatus.active,
    owner: {} as never,
  },
  {
    id: "prop-6",
    title: "Buy Luxury Penthouse",
    description:
      "Top floor penthouse with panoramic city views, private terrace and gym.",
    price: BigInt(55000000),
    location: "Bandra West, Mumbai",
    propertyType: PropertyType.residential,
    listingType: ListingType.buy,
    bedrooms: BigInt(5),
    bathrooms: BigInt(5),
    area: BigInt(6500),
    contactName: "Arjun Kapoor",
    contactPhone: "+91 43210 98765",
    status: ListingStatus.active,
    owner: {} as never,
  },
];

export function PropertiesPage() {
  const { identity, login } = useInternetIdentity();
  const [filterTab, setFilterTab] = useState<"all" | ListingType>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyListing | null>(null);

  const { data: apiListings, isLoading } = useFilteredListings(filterTab);
  const createMutation = useCreatePropertyListing();

  // Merge API + sample listings
  const apiData = apiListings ?? [];
  const allListings = [...apiData, ...sampleListings];
  const listings =
    filterTab === "all"
      ? allListings
      : allListings.filter((l) => l.listingType === filterTab);

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    propertyType: PropertyType.residential,
    listingType: ListingType.sell,
    bedrooms: "0",
    bathrooms: "0",
    area: "",
    contactName: "",
    contactPhone: "",
  });

  function resetForm() {
    setForm({
      title: "",
      description: "",
      price: "",
      location: "",
      propertyType: PropertyType.residential,
      listingType: ListingType.sell,
      bedrooms: "0",
      bathrooms: "0",
      area: "",
      contactName: "",
      contactPhone: "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identity) {
      login();
      return;
    }
    if (!form.title || !form.price || !form.location || !form.area) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const listing: PropertyListing = {
        id: generateId(),
        title: form.title,
        description: form.description,
        price: BigInt(Math.round(Number(form.price))),
        location: form.location,
        propertyType: form.propertyType,
        listingType: form.listingType,
        bedrooms: BigInt(Number(form.bedrooms)),
        bathrooms: BigInt(Number(form.bathrooms)),
        area: BigInt(Math.round(Number(form.area))),
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        status: ListingStatus.active,
        owner: identity.getPrincipal(),
      };
      await createMutation.mutateAsync(listing);
      toast.success("Property listing created!");
      setAddOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to create listing. Please try again.");
    }
  }

  const priceLabel = form.listingType === ListingType.rent ? "/month" : "";

  return (
    <main className="container py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Properties
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse and discover properties across India
          </p>
        </div>
        <Button
          data-ocid="properties.add_button"
          onClick={() => {
            if (!identity) {
              toast.info("Please login to add a listing");
              login();
              return;
            }
            setAddOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Listing
        </Button>
      </div>

      {/* Filter tabs */}
      <Tabs
        value={filterTab}
        onValueChange={(v) => setFilterTab(v as typeof filterTab)}
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger data-ocid="properties.filter.tab" value="all">
            All
          </TabsTrigger>
          <TabsTrigger
            data-ocid="properties.filter.tab"
            value={ListingType.buy}
          >
            Buy
          </TabsTrigger>
          <TabsTrigger
            data-ocid="properties.filter.tab"
            value={ListingType.sell}
          >
            Sell
          </TabsTrigger>
          <TabsTrigger
            data-ocid="properties.filter.tab"
            value={ListingType.rent}
          >
            Rent
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading state */}
      {isLoading && (
        <div
          data-ocid="properties.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((sk) => (
            <Card key={sk} className="overflow-hidden">
              <Skeleton className="h-44 w-full rounded-none" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && listings.length === 0 && (
        <div data-ocid="properties.empty_state" className="text-center py-20">
          <Building className="h-14 w-14 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            No properties found
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Be the first to add a property listing.
          </p>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Listing
          </Button>
        </div>
      )}

      {/* Property cards */}
      {!isLoading && listings.length > 0 && (
        <div
          data-ocid="properties.list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {listings.map((property, idx) => (
            <motion.div
              key={property.id}
              data-ocid={`properties.item.${idx + 1}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card
                className="card-hover cursor-pointer overflow-hidden border border-border/60 shadow-xs h-full"
                onClick={() => {
                  setSelectedProperty(property);
                  setDetailOpen(true);
                }}
              >
                {/* Property image placeholder */}
                <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                  <Building className="h-12 w-12 text-primary/30" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge
                      className={`text-xs capitalize ${listingTypeBadge[property.listingType] ?? ""}`}
                    >
                      {property.listingType}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className="absolute top-3 right-3 text-xs capitalize bg-background/80"
                  >
                    {property.propertyType}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-display font-semibold text-foreground text-base leading-snug line-clamp-2 mb-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{property.location}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    {Number(property.bedrooms) > 0 && (
                      <div className="flex items-center gap-1.5">
                        <BedDouble className="h-3.5 w-3.5" />
                        <span>{String(property.bedrooms)} Beds</span>
                      </div>
                    )}
                    {Number(property.bathrooms) > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Bath className="h-3.5 w-3.5" />
                        <span>{String(property.bathrooms)} Baths</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>{formatArea(property.area)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-primary text-lg">
                      {formatINR(property.price)}
                      {property.listingType === ListingType.rent && (
                        <span className="text-xs font-normal text-muted-foreground">
                          /mo
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {propertyTypeIcon[property.propertyType]}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Listing Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Add Property Listing
            </DialogTitle>
            <DialogDescription>
              Fill in the details to list your property on Royal Infrastructure.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            className="space-y-4 mt-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <Label>Title *</Label>
                <Input
                  data-ocid="property_form.title_input"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. 3BHK Apartment in Koramangala"
                  required
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Describe the property..."
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <Label>Price (₹) *</Label>
                <Input
                  data-ocid="property_form.price_input"
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="e.g. 5000000"
                  required
                />
                {priceLabel && (
                  <p className="text-xs text-muted-foreground">
                    Price per month for rent
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label>Location *</Label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, location: e.target.value }))
                  }
                  placeholder="e.g. Koramangala, Bangalore"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Property Type</Label>
                <Select
                  value={form.propertyType}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, propertyType: v as PropertyType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PropertyType.residential}>
                      Residential
                    </SelectItem>
                    <SelectItem value={PropertyType.commercial}>
                      Commercial
                    </SelectItem>
                    <SelectItem value={PropertyType.plot}>Plot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Listing Type</Label>
                <Select
                  value={form.listingType}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, listingType: v as ListingType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ListingType.sell}>Sell</SelectItem>
                    <SelectItem value={ListingType.buy}>Buy</SelectItem>
                    <SelectItem value={ListingType.rent}>Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.bedrooms}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bedrooms: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Bathrooms</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.bathrooms}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bathrooms: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Area (sq.ft) *</Label>
                <Input
                  type="number"
                  value={form.area}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, area: e.target.value }))
                  }
                  placeholder="e.g. 1200"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Contact Name</Label>
                <Input
                  value={form.contactName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contactName: e.target.value }))
                  }
                  placeholder="Your name"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <Label>Contact Phone</Label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contactPhone: e.target.value }))
                  }
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                data-ocid="property_form.cancel_button"
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
                data-ocid="property_form.submit_button"
                type="submit"
                disabled={createMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Create Listing"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Property Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent data-ocid="property_detail.dialog" className="max-w-lg">
          {selectedProperty && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl pr-6">
                  {selectedProperty.title}
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {selectedProperty.location}
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={`text-xs capitalize ${listingTypeBadge[selectedProperty.listingType] ?? ""}`}
                  >
                    {selectedProperty.listingType}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {selectedProperty.propertyType}
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {selectedProperty.status}
                  </Badge>
                </div>

                <div className="text-2xl font-display font-bold text-primary">
                  {formatINR(selectedProperty.price)}
                  {selectedProperty.listingType === ListingType.rent && (
                    <span className="text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  )}
                </div>

                {selectedProperty.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedProperty.description}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-3">
                  {Number(selectedProperty.bedrooms) > 0 && (
                    <div className="flex items-center gap-2 bg-muted/40 rounded-lg p-3">
                      <BedDouble className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-semibold text-sm">
                          {String(selectedProperty.bedrooms)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Beds
                        </div>
                      </div>
                    </div>
                  )}
                  {Number(selectedProperty.bathrooms) > 0 && (
                    <div className="flex items-center gap-2 bg-muted/40 rounded-lg p-3">
                      <Bath className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-semibold text-sm">
                          {String(selectedProperty.bathrooms)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Baths
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-muted/40 rounded-lg p-3">
                    <Maximize2 className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-semibold text-sm">
                        {String(selectedProperty.area)}
                      </div>
                      <div className="text-xs text-muted-foreground">sq.ft</div>
                    </div>
                  </div>
                </div>

                {(selectedProperty.contactName ||
                  selectedProperty.contactPhone) && (
                  <div className="border border-border/60 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">
                      Contact Information
                    </h4>
                    {selectedProperty.contactName && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        {selectedProperty.contactName}
                      </div>
                    )}
                    {selectedProperty.contactPhone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {selectedProperty.contactPhone}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  data-ocid="property_detail.close_button"
                  variant="outline"
                  onClick={() => setDetailOpen(false)}
                >
                  Close
                </Button>
                {selectedProperty.contactPhone && (
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    asChild
                  >
                    <a href={`tel:${selectedProperty.contactPhone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
