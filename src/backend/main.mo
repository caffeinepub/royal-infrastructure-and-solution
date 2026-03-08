import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Initialize storage and authorization
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    role : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Property Listings
  public type PropertyType = { #residential; #commercial; #plot };
  public type ListingType = { #buy; #sell; #rent };
  public type ListingStatus = { #active; #sold; #rented };

  public type PropertyListing = {
    id : Text;
    title : Text;
    description : Text;
    price : Nat;
    location : Text;
    propertyType : PropertyType;
    listingType : ListingType;
    bedrooms : Nat;
    bathrooms : Nat;
    area : Nat;
    contactName : Text;
    contactPhone : Text;
    status : ListingStatus;
    owner : Principal;
  };

  // Floor Plans
  public type FloorStyle = { #modern; #traditional; #contemporary };

  public type FloorPlan = {
    id : Text;
    title : Text;
    description : Text;
    rooms : Nat;
    bathrooms : Nat;
    totalArea : Nat;
    floors : Nat;
    style : FloorStyle;
    imageUrl : Storage.ExternalBlob;
    authorName : Text;
    price : Nat;
    owner : Principal;
  };

  // Architecture Projects
  public type ProjectType = {
    #residential;
    #commercial;
    #interior;
  };

  public type ArchitectureProject = {
    id : Text;
    title : Text;
    description : Text;
    projectType : ProjectType;
    imageUrl : Storage.ExternalBlob;
    architectName : Text;
    location : Text;
    completedYear : Nat;
    featured : Bool;
    owner : Principal;
  };

  // Construction Estimates
  public type ConstructionEstimate = {
    id : Text;
    projectName : Text;
    projectType : ProjectType;
    totalArea : Nat;
    foundationCost : Nat;
    structureCost : Nat;
    roofingCost : Nat;
    flooringCost : Nat;
    electricalCost : Nat;
    plumbingCost : Nat;
    finishingCost : Nat;
    totalCost : Nat;
    notes : Text;
    owner : Principal;
  };

  // Storage maps
  let propertyListings = Map.empty<Text, PropertyListing>();
  let floorPlans = Map.empty<Text, FloorPlan>();
  let architectureProjects = Map.empty<Text, ArchitectureProject>();
  let constructionEstimates = Map.empty<Text, ConstructionEstimate>();

  // Property Listings CRUD
  public shared ({ caller }) func createPropertyListing(listing : PropertyListing) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create listings");
    };
    // Verify ownership
    if (listing.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot create listing for another user");
    };
    propertyListings.add(listing.id, listing);
  };

  public query func getPropertyListing(id : Text) : async PropertyListing {
    // Public read access - no authorization needed
    switch (propertyListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };
  };

  public shared ({ caller }) func updatePropertyListing(id : Text, updatedListing : PropertyListing) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update listings");
    };
    switch (propertyListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existingListing) {
        // Verify ownership
        if (existingListing.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own listings");
        };
        // Prevent ownership transfer unless admin
        if (updatedListing.owner != existingListing.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot transfer listing ownership");
        };
        propertyListings.add(id, updatedListing);
      };
    };
  };

  public shared ({ caller }) func deletePropertyListing(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete listings");
    };
    switch (propertyListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        // Verify ownership
        if (listing.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own listings");
        };
        propertyListings.remove(id);
      };
    };
  };

  public query func browsePropertyListings() : async [PropertyListing] {
    // Public read access - no authorization needed
    propertyListings.values().toArray();
  };

  public query func filterListingsByType(listingType : ListingType) : async [PropertyListing] {
    // Public read access - no authorization needed
    let filtered = List.empty<PropertyListing>();
    for ((_, listing) in propertyListings.entries()) {
      if (listing.listingType == listingType) {
        filtered.add(listing);
      };
    };
    filtered.toArray();
  };

  // Floor Plans CRUD
  public shared ({ caller }) func createFloorPlan(plan : FloorPlan) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create floor plans");
    };
    // Verify ownership
    if (plan.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot create floor plan for another user");
    };
    floorPlans.add(plan.id, plan);
  };

  public query func browseFloorPlans() : async [FloorPlan] {
    // Public read access - no authorization needed
    floorPlans.values().toArray();
  };

  public query func getFloorPlan(id : Text) : async FloorPlan {
    // Public read access - no authorization needed
    switch (floorPlans.get(id)) {
      case (null) { Runtime.trap("Floor plan not found") };
      case (?plan) { plan };
    };
  };

  public shared ({ caller }) func updateFloorPlan(id : Text, updatedPlan : FloorPlan) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update floor plans");
    };
    switch (floorPlans.get(id)) {
      case (null) { Runtime.trap("Floor plan not found") };
      case (?existingPlan) {
        // Verify ownership
        if (existingPlan.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own floor plans");
        };
        // Prevent ownership transfer unless admin
        if (updatedPlan.owner != existingPlan.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot transfer floor plan ownership");
        };
        floorPlans.add(id, updatedPlan);
      };
    };
  };

  public shared ({ caller }) func deleteFloorPlan(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete floor plans");
    };
    switch (floorPlans.get(id)) {
      case (null) { Runtime.trap("Floor plan not found") };
      case (?plan) {
        // Verify ownership
        if (plan.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own floor plans");
        };
        floorPlans.remove(id);
      };
    };
  };

  // Architecture Projects CRUD
  public shared ({ caller }) func createArchitectureProject(project : ArchitectureProject) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };
    // Verify ownership
    if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot create project for another user");
    };
    architectureProjects.add(project.id, project);
  };

  public query func browseArchitectureProjects() : async [ArchitectureProject] {
    // Public read access - no authorization needed
    architectureProjects.values().toArray();
  };

  public query func getArchitectureProject(id : Text) : async ArchitectureProject {
    // Public read access - no authorization needed
    switch (architectureProjects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) { project };
    };
  };

  public shared ({ caller }) func updateArchitectureProject(id : Text, updatedProject : ArchitectureProject) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update projects");
    };
    switch (architectureProjects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?existingProject) {
        // Verify ownership
        if (existingProject.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own projects");
        };
        // Prevent ownership transfer unless admin
        if (updatedProject.owner != existingProject.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot transfer project ownership");
        };
        architectureProjects.add(id, updatedProject);
      };
    };
  };

  public shared ({ caller }) func deleteArchitectureProject(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete projects");
    };
    switch (architectureProjects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        // Verify ownership
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own projects");
        };
        architectureProjects.remove(id);
      };
    };
  };

  // Construction Estimates CRUD
  public shared ({ caller }) func saveConstructionEstimate(estimate : ConstructionEstimate) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save estimates");
    };
    // Verify ownership
    if (estimate.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot create estimate for another user");
    };
    constructionEstimates.add(estimate.id, estimate);
  };

  public query ({ caller }) func getUserEstimates(user : Principal) : async [ConstructionEstimate] {
    // Users can only view their own estimates, admins can view any
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own estimates");
    };
    let userEstimates = List.empty<ConstructionEstimate>();
    for ((_, estimate) in constructionEstimates.entries()) {
      if (estimate.owner == user) {
        userEstimates.add(estimate);
      };
    };
    userEstimates.toArray();
  };

  public query ({ caller }) func getConstructionEstimate(id : Text) : async ConstructionEstimate {
    switch (constructionEstimates.get(id)) {
      case (null) { Runtime.trap("Estimate not found") };
      case (?estimate) {
        // Users can only view their own estimates, admins can view any
        if (estimate.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own estimates");
        };
        estimate;
      };
    };
  };

  public shared ({ caller }) func updateConstructionEstimate(id : Text, updatedEstimate : ConstructionEstimate) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update estimates");
    };
    switch (constructionEstimates.get(id)) {
      case (null) { Runtime.trap("Estimate not found") };
      case (?existingEstimate) {
        // Verify ownership
        if (existingEstimate.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own estimates");
        };
        // Prevent ownership transfer unless admin
        if (updatedEstimate.owner != existingEstimate.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot transfer estimate ownership");
        };
        constructionEstimates.add(id, updatedEstimate);
      };
    };
  };

  public shared ({ caller }) func deleteConstructionEstimate(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete estimates");
    };
    switch (constructionEstimates.get(id)) {
      case (null) { Runtime.trap("Estimate not found") };
      case (?estimate) {
        // Verify ownership
        if (estimate.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own estimates");
        };
        constructionEstimates.remove(id);
      };
    };
  };

  // Admin-only functions
  public shared ({ caller }) func adminDeleteListing(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    propertyListings.remove(id);
  };

  public shared ({ caller }) func adminDeleteFloorPlan(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    floorPlans.remove(id);
  };

  public shared ({ caller }) func adminDeleteProject(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    architectureProjects.remove(id);
  };
};
