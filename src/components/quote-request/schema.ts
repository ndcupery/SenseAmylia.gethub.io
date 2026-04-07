import { z } from "zod";
import {
  serviceCategories,
  SLA_MAX_DIMENSIONS,
  FDM_MAX_DIMENSIONS,
} from "./types";

// ─── Contact Info ───────────────────────────────────────────────────────────

export const contactInfoSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().optional().default(""),
});

// ─── Service Selection ──────────────────────────────────────────────────────

export const serviceSelectionSchema = z.object({
  serviceCategory: z.enum(serviceCategories, {
    message: "Please select a service",
  }),
});

// ─── Graphic Design ─────────────────────────────────────────────────────────

export const graphicDesignSchema = z.object({
  projectTypes: z.array(z.string()).min(1, "Select at least one project type"),
  brandKitUrl: z
    .string()
    .min(1, "Brand kit URL is required")
    .url("Must be a valid URL"),
  styleDirection: z.string().optional().default(""),
  deliverableMedium: z.string().min(1, "Select a deliverable medium"),
  dimensionWidth: z.string().optional().default(""),
  dimensionHeight: z.string().optional().default(""),
  dimensionUnit: z.string().optional().default("pixels"),
});

// ─── Web Design ─────────────────────────────────────────────────────────────

export const webDesignSchema = z.object({
  projectType: z.string().min(1, "Select a project type"),
  currentSiteUrl: z.string().optional().default(""),
  currentCms: z.string().optional().default(""),
  brandKitUrl: z
    .string()
    .min(1, "Brand kit URL is required")
    .url("Must be a valid URL"),
  pageCount: z.string().min(1, "Select estimated page count"),
  features: z.array(z.string()).optional().default([]),
  contentReady: z.string().min(1, "Select content readiness"),
});

// ─── Interactive Campaigns ──────────────────────────────────────────────────

export const interactiveCampaignSchema = z.object({
  experienceType: z.string().min(1, "Select an experience type"),
  desiredOutcome: z
    .string()
    .min(1, "Describe the desired end-user outcome"),
  brandKitUrl: z
    .string()
    .min(1, "Brand kit URL is required")
    .url("Must be a valid URL"),
  targetAudience: z.string().optional().default(""),
  campaignDuration: z.string().min(1, "Select a campaign duration"),
  existingAnalytics: z.string().optional().default(""),
  goalsKpis: z.string().optional().default(""),
});

// ─── 3D Print dimension validation helper ───────────────────────────────────

function mmValue(val: string, unit: string): number {
  const n = parseFloat(val);
  if (isNaN(n)) return 0;
  return unit === "inches" ? n * 25.4 : n;
}

// ─── SLA 3D Prints ─────────────────────────────────────────────────────────

export const sla3dPrintSchema = z
  .object({
    modelFileStatus: z.string().min(1, "Select model file status"),
    dimensionL: z.string().optional().default(""),
    dimensionW: z.string().optional().default(""),
    dimensionH: z.string().optional().default(""),
    dimensionUnit: z.string().optional().default("mm"),
    quantity: z.string().min(1, "Quantity is required"),
    surfaceFinish: z.string().min(1, "Select a surface finish"),
    materialColor: z.string().min(1, "Select a material color"),
    tolerance: z.string().min(1, "Select tolerance requirements"),
    useCase: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    const l = mmValue(data.dimensionL, data.dimensionUnit);
    const w = mmValue(data.dimensionW, data.dimensionUnit);
    const h = mmValue(data.dimensionH, data.dimensionUnit);
    if (l > SLA_MAX_DIMENSIONS.l || w > SLA_MAX_DIMENSIONS.w || h > SLA_MAX_DIMENSIONS.h) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Exceeds Form 4 build volume (${SLA_MAX_DIMENSIONS.l} × ${SLA_MAX_DIMENSIONS.w} × ${SLA_MAX_DIMENSIONS.h} mm)`,
        path: ["dimensionL"],
      });
    }
  });

// ─── FDM 3D Prints ─────────────────────────────────────────────────────────

export const fdm3dPrintSchema = z
  .object({
    modelFileStatus: z.string().min(1, "Select model file status"),
    dimensionL: z.string().optional().default(""),
    dimensionW: z.string().optional().default(""),
    dimensionH: z.string().optional().default(""),
    dimensionUnit: z.string().optional().default("mm"),
    quantity: z.string().min(1, "Quantity is required"),
    structuralRequirement: z.string().min(1, "Select structural requirements"),
    infill: z.string().min(1, "Select infill preference"),
    plaColor: z.string().optional().default(""),
    layerQuality: z.string().min(1, "Select layer quality"),
  })
  .superRefine((data, ctx) => {
    const l = mmValue(data.dimensionL, data.dimensionUnit);
    const w = mmValue(data.dimensionW, data.dimensionUnit);
    const h = mmValue(data.dimensionH, data.dimensionUnit);
    if (l > FDM_MAX_DIMENSIONS.l || w > FDM_MAX_DIMENSIONS.w || h > FDM_MAX_DIMENSIONS.h) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Exceeds Bambu A1 build volume (${FDM_MAX_DIMENSIONS.l} × ${FDM_MAX_DIMENSIONS.w} × ${FDM_MAX_DIMENSIONS.h} mm)`,
        path: ["dimensionL"],
      });
    }
  });

// ─── Technical Consultation ─────────────────────────────────────────────────

export const technicalConsultationSchema = z.object({
  consultationAreas: z
    .array(z.string())
    .min(1, "Select at least one consultation area"),
  currentTechStack: z.string().optional().default(""),
  painPoint: z.string().min(1, "Describe your primary pain point"),
  preferredFormat: z.string().min(1, "Select a preferred format"),
  urgency: z.string().min(1, "Select urgency level"),
});

// ─── Timeline & Budget ──────────────────────────────────────────────────────

export const timelineBudgetSchema = z.object({
  budgetRange: z.string().optional().default(""),
  timeline: z.string().min(1, "Select a timeline"),
  additionalNotes: z.string().optional().default(""),
});

// ─── Schema map by category ─────────────────────────────────────────────────

export const serviceSchemas = {
  "graphic-design": graphicDesignSchema,
  "web-design": webDesignSchema,
  "interactive-campaigns": interactiveCampaignSchema,
  "sla-3d-prints": sla3dPrintSchema,
  "fdm-3d-prints": fdm3dPrintSchema,
  "technical-consultation": technicalConsultationSchema,
} as const;
