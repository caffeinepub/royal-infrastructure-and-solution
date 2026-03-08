import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface FloorPlan {
    id: string;
    title: string;
    owner: Principal;
    floors: bigint;
    authorName: string;
    totalArea: bigint;
    description: string;
    style: FloorStyle;
    imageUrl: ExternalBlob;
    bathrooms: bigint;
    price: bigint;
    rooms: bigint;
}
export interface ConstructionEstimate {
    id: string;
    foundationCost: bigint;
    projectName: string;
    projectType: ProjectType;
    owner: Principal;
    plumbingCost: bigint;
    totalArea: bigint;
    totalCost: bigint;
    flooringCost: bigint;
    finishingCost: bigint;
    roofingCost: bigint;
    notes: string;
    electricalCost: bigint;
    structureCost: bigint;
}
export interface PropertyListing {
    id: string;
    status: ListingStatus;
    title: string;
    contactName: string;
    propertyType: PropertyType;
    bedrooms: bigint;
    owner: Principal;
    area: bigint;
    description: string;
    listingType: ListingType;
    bathrooms: bigint;
    price: bigint;
    location: string;
    contactPhone: string;
}
export interface ArchitectureProject {
    id: string;
    title: string;
    completedYear: bigint;
    featured: boolean;
    architectName: string;
    projectType: ProjectType;
    owner: Principal;
    description: string;
    imageUrl: ExternalBlob;
    location: string;
}
export interface UserProfile {
    name: string;
    role: string;
    email: string;
    phone: string;
}
export enum FloorStyle {
    traditional = "traditional",
    modern = "modern",
    contemporary = "contemporary"
}
export enum ListingStatus {
    rented = "rented",
    active = "active",
    sold = "sold"
}
export enum ListingType {
    buy = "buy",
    rent = "rent",
    sell = "sell"
}
export enum ProjectType {
    interior = "interior",
    commercial = "commercial",
    residential = "residential"
}
export enum PropertyType {
    commercial = "commercial",
    plot = "plot",
    residential = "residential"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminDeleteFloorPlan(id: string): Promise<void>;
    adminDeleteListing(id: string): Promise<void>;
    adminDeleteProject(id: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    browseArchitectureProjects(): Promise<Array<ArchitectureProject>>;
    browseFloorPlans(): Promise<Array<FloorPlan>>;
    browsePropertyListings(): Promise<Array<PropertyListing>>;
    createArchitectureProject(project: ArchitectureProject): Promise<void>;
    createFloorPlan(plan: FloorPlan): Promise<void>;
    createPropertyListing(listing: PropertyListing): Promise<void>;
    deleteArchitectureProject(id: string): Promise<void>;
    deleteConstructionEstimate(id: string): Promise<void>;
    deleteFloorPlan(id: string): Promise<void>;
    deletePropertyListing(id: string): Promise<void>;
    filterListingsByType(listingType: ListingType): Promise<Array<PropertyListing>>;
    getArchitectureProject(id: string): Promise<ArchitectureProject>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConstructionEstimate(id: string): Promise<ConstructionEstimate>;
    getFloorPlan(id: string): Promise<FloorPlan>;
    getPropertyListing(id: string): Promise<PropertyListing>;
    getUserEstimates(user: Principal): Promise<Array<ConstructionEstimate>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveConstructionEstimate(estimate: ConstructionEstimate): Promise<void>;
    updateArchitectureProject(id: string, updatedProject: ArchitectureProject): Promise<void>;
    updateConstructionEstimate(id: string, updatedEstimate: ConstructionEstimate): Promise<void>;
    updateFloorPlan(id: string, updatedPlan: FloorPlan): Promise<void>;
    updatePropertyListing(id: string, updatedListing: PropertyListing): Promise<void>;
}
