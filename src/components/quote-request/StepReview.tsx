import { useFormContext } from "react-hook-form";
import {
  type QuoteRequestFormData,
  type ServiceCategory,
  serviceCategoryLabels,
} from "./types";

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-border/30 last:border-0">
      <span className="text-text-muted text-sm shrink-0">{label}</span>
      <span className="text-text text-sm text-right">{value}</span>
    </div>
  );
}

// Maps service detail keys to human-readable labels
const detailLabels: Record<string, string> = {
  projectTypes: "Project Types",
  projectType: "Project Type",
  brandKitUrl: "Brand Kit URL",
  styleDirection: "Style Direction",
  deliverableMedium: "Deliverable Medium",
  dimensionWidth: "Width",
  dimensionHeight: "Height",
  dimensionUnit: "Dimension Unit",
  currentSiteUrl: "Current Site URL",
  currentCms: "Current CMS",
  pageCount: "Page Count",
  features: "Features",
  contentReady: "Content Ready",
  experienceType: "Experience Type",
  desiredOutcome: "Desired Outcome",
  targetAudience: "Target Audience",
  campaignDuration: "Campaign Duration",
  existingAnalytics: "Existing Analytics",
  goalsKpis: "Goals / KPIs",
  modelFileStatus: "3D Model File",
  dimensionL: "Length",
  dimensionW: "Width",
  dimensionH: "Height",
  quantity: "Quantity",
  surfaceFinish: "Surface Finish",
  materialColor: "Material Color",
  tolerance: "Tolerance",
  useCase: "Use Case",
  structuralRequirement: "Structural Requirements",
  infill: "Infill",
  plaColor: "PLA Color",
  layerQuality: "Layer Quality",
  consultationAreas: "Consultation Areas",
  currentTechStack: "Current Tech Stack",
  painPoint: "Pain Point",
  preferredFormat: "Preferred Format",
  urgency: "Urgency",
};

export function StepReview() {
  const { watch } = useFormContext<QuoteRequestFormData>();
  const data = watch();
  const category = data.serviceCategory as ServiceCategory;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Review Your Request</h2>
        <p className="text-text-muted text-sm">
          Confirm everything looks right, then submit.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-6">
        <ReviewSection title="Contact Info">
          <ReviewRow label="Name" value={data.contactInfo.fullName} />
          <ReviewRow label="Email" value={data.contactInfo.email} />
          <ReviewRow label="Phone" value={data.contactInfo.phone} />
          <ReviewRow label="Company" value={data.contactInfo.company} />
        </ReviewSection>

        <ReviewSection title="Service">
          <ReviewRow
            label="Category"
            value={category ? serviceCategoryLabels[category] : ""}
          />
        </ReviewSection>

        {data.serviceDetails && Object.keys(data.serviceDetails).length > 0 && (
          <ReviewSection title="Project Details">
            {Object.entries(data.serviceDetails).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0))
                return null;
              const display = Array.isArray(value) ? value.join(", ") : String(value);
              return (
                <ReviewRow
                  key={key}
                  label={detailLabels[key] || key}
                  value={display}
                />
              );
            })}
          </ReviewSection>
        )}

        <ReviewSection title="Timeline & Budget">
          <ReviewRow label="Timeline" value={data.timelineBudget.timeline} />
          <ReviewRow label="Budget" value={data.timelineBudget.budgetRange} />
          <ReviewRow label="Notes" value={data.timelineBudget.additionalNotes} />
        </ReviewSection>
      </div>
    </div>
  );
}
