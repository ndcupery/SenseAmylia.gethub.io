// ─── Service Categories ─────────────────────────────────────────────────────

export const serviceCategories = [
  "graphic-design",
  "web-design",
  "interactive-campaigns",
  "sla-3d-prints",
  "fdm-3d-prints",
  "technical-consultation",
] as const;

export type ServiceCategory = (typeof serviceCategories)[number];

export const serviceCategoryLabels: Record<ServiceCategory, string> = {
  "graphic-design": "Graphic Design",
  "web-design": "Web Design",
  "interactive-campaigns": "Interactive Campaigns",
  "sla-3d-prints": "SLA 3D Prints (Resin)",
  "fdm-3d-prints": "FDM 3D Prints (PLA)",
  "technical-consultation": "Technical Consultation",
};

export const serviceCategoryDescriptions: Record<ServiceCategory, string> = {
  "graphic-design": "Logos, posters, merch, album art, motion graphics",
  "web-design": "Custom-built sites, landing pages, web applications",
  "interactive-campaigns":
    "Gamified web experiences that drive user engagement",
  "sla-3d-prints": "High-detail resin prints on the Formlabs Form 4",
  "fdm-3d-prints": "PLA prints on the Bambu A1 for functional & decorative use",
  "technical-consultation":
    "AI, web architecture, performance, live visuals workflows",
};

// ─── Graphic Design ─────────────────────────────────────────────────────────

export const graphicDesignProjectTypes = [
  "Logo / Brand Identity",
  "Print (flyers, posters, merch)",
  "Social Media Assets",
  "Album / EP Artwork",
  "Motion Graphics",
] as const;

export const deliverableMediums = ["Web", "Print", "Both"] as const;

export const dimensionUnits = [
  "pixels",
  "inches",
  "cm",
  "mm",
  "feet",
] as const;

export type DimensionUnit = (typeof dimensionUnits)[number];

// ─── Web Design ─────────────────────────────────────────────────────────────

export const webDesignProjectTypes = [
  "New site",
  "Landing page",
  "Web application",
  "Add-on / module (hand off build to client)",
] as const;

export const webPageCounts = ["1-3", "4-8", "9+", "Not sure"] as const;

export const webFeatures = [
  "Contact form",
  "E-commerce",
  "Blog",
  "Gallery / Portfolio",
  "Booking / Calendar",
  "Custom animations",
] as const;

export const contentReadiness = [
  "Yes",
  "Partially",
  "No — need help",
] as const;

// ─── Interactive Campaigns ──────────────────────────────────────────────────

export const experienceTypes = [
  "Gamified Landing Page",
  "Interactive Product Explorer",
  "Reward / Loyalty Campaign",
  "Contest / Giveaway",
  "Lead Generation Funnel",
  "Other",
] as const;

export const campaignDurations = [
  "One-time event",
  "1-4 weeks",
  "1-3 months",
  "Ongoing",
] as const;

export const analyticsOptions = [
  "Google Analytics",
  "Mixpanel",
  "Segment",
  "PostHog",
  "Other",
  "None",
] as const;

// ─── 3D Prints (shared) ────────────────────────────────────────────────────

export const modelFileStatus = [
  "Yes (STL/OBJ)",
  "Need modeling help",
  "Have a sketch/reference",
] as const;

export const printDimensionUnits = ["mm", "inches"] as const;

// SLA-specific
export const slaFinishes = [
  "Raw",
  "Sanded",
  "Painted",
  "Clear coat",
] as const;

export const slaMaterialColors = [
  "Grey",
  "White",
  "Black",
  "Clear",
  "Custom",
] as const;

export const slaTolerances = [
  "Standard (±0.1mm)",
  "High precision (±0.05mm)",
  "Not sure",
] as const;

// FDM-specific
export const fdmStructuralRequirements = [
  "Display / decorative only",
  "Light functional use",
  "Load-bearing / mechanical",
] as const;

export const fdmInfillOptions = [
  "Light (15%)",
  "Standard (25%)",
  "Solid (80%+)",
  "Not sure",
] as const;

export const fdmLayerQualities = [
  "Draft (0.3mm)",
  "Standard (0.2mm)",
  "Fine (0.12mm)",
] as const;

// Build volume limits
export const SLA_MAX_DIMENSIONS = { l: 200, w: 125, h: 210 } as const; // mm
export const FDM_MAX_DIMENSIONS = { l: 256, w: 256, h: 256 } as const; // mm

// ─── Technical Consultation ─────────────────────────────────────────────────

export const consultationAreas = [
  "AI / Machine Learning",
  "Website Architecture",
  "Performance Optimization",
  "Scalable Systems",
  "Live Visual Performance Workflows",
  "Other",
] as const;

export const consultationFormats = [
  "Single session (1hr)",
  "Ongoing advisory",
  "Project-based engagement",
] as const;

export const consultationUrgencies = [
  "Exploring options",
  "Active project",
  "Production issue",
] as const;

// ─── Budget & Timeline ──────────────────────────────────────────────────────

export const budgetRanges = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Not sure yet",
] as const;

export const timelineOptions = [
  "ASAP",
  "Within 2 weeks",
  "Within 1 month",
  "Within 3 months",
  "Flexible / no rush",
] as const;

// ─── Form Data ──────────────────────────────────────────────────────────────

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  company: string;
}

export interface GraphicDesignDetails {
  projectTypes: string[];
  brandKitUrl: string;
  styleDirection: string;
  deliverableMedium: string;
  dimensionWidth: string;
  dimensionHeight: string;
  dimensionUnit: string;
}

export interface WebDesignDetails {
  projectType: string;
  currentSiteUrl: string;
  currentCms: string;
  brandKitUrl: string;
  pageCount: string;
  features: string[];
  contentReady: string;
}

export interface InteractiveCampaignDetails {
  experienceType: string;
  desiredOutcome: string;
  brandKitUrl: string;
  targetAudience: string;
  campaignDuration: string;
  existingAnalytics: string;
  goalsKpis: string;
}

export interface Sla3dPrintDetails {
  modelFileStatus: string;
  dimensionL: string;
  dimensionW: string;
  dimensionH: string;
  dimensionUnit: string;
  quantity: string;
  surfaceFinish: string;
  materialColor: string;
  tolerance: string;
  useCase: string;
}

export interface Fdm3dPrintDetails {
  modelFileStatus: string;
  dimensionL: string;
  dimensionW: string;
  dimensionH: string;
  dimensionUnit: string;
  quantity: string;
  structuralRequirement: string;
  infill: string;
  plaColor: string;
  layerQuality: string;
}

export interface TechnicalConsultationDetails {
  consultationAreas: string[];
  currentTechStack: string;
  painPoint: string;
  preferredFormat: string;
  urgency: string;
}

export interface TimelineBudget {
  budgetRange: string;
  timeline: string;
  additionalNotes: string;
}

export type ServiceDetails =
  | GraphicDesignDetails
  | WebDesignDetails
  | InteractiveCampaignDetails
  | Sla3dPrintDetails
  | Fdm3dPrintDetails
  | TechnicalConsultationDetails;

export interface QuoteRequestFormData {
  contactInfo: ContactInfo;
  serviceCategory: ServiceCategory | "";
  serviceDetails: Partial<ServiceDetails>;
  timelineBudget: TimelineBudget;
}
