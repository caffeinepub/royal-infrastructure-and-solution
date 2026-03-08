import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ArchitectureProject,
  ConstructionEstimate,
  FloorPlan,
  PropertyListing,
} from "../backend";
import type { ListingType } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// ── Property Listings ──────────────────────────────────────────────────────────

export function usePropertyListings() {
  const { actor, isFetching } = useActor();
  return useQuery<PropertyListing[]>({
    queryKey: ["propertyListings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.browsePropertyListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilteredListings(listingType: ListingType | "all") {
  const { actor, isFetching } = useActor();
  return useQuery<PropertyListing[]>({
    queryKey: ["propertyListings", listingType],
    queryFn: async () => {
      if (!actor) return [];
      if (listingType === "all") return actor.browsePropertyListings();
      return actor.filterListingsByType(listingType);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePropertyListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listing: PropertyListing) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createPropertyListing(listing);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["propertyListings"] });
    },
  });
}

// ── Floor Plans ────────────────────────────────────────────────────────────────

export function useFloorPlans() {
  const { actor, isFetching } = useActor();
  return useQuery<FloorPlan[]>({
    queryKey: ["floorPlans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.browseFloorPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateFloorPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (plan: FloorPlan) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createFloorPlan(plan);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["floorPlans"] });
    },
  });
}

// ── Architecture Projects ──────────────────────────────────────────────────────

export function useArchitectureProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<ArchitectureProject[]>({
    queryKey: ["architectureProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.browseArchitectureProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateArchitectureProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: ArchitectureProject) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createArchitectureProject(project);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["architectureProjects"],
      });
    },
  });
}

// ── Construction Estimates ─────────────────────────────────────────────────────

export function useUserEstimates() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<ConstructionEstimate[]>({
    queryKey: ["userEstimates", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserEstimates(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSaveEstimate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (estimate: ConstructionEstimate) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveConstructionEstimate(estimate);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userEstimates"] });
    },
  });
}

export function useDeleteEstimate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteConstructionEstimate(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userEstimates"] });
    },
  });
}
