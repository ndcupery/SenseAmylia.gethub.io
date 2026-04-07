import { useFormContext } from "react-hook-form";
import {
  inputClass,
  labelClass,
  errorClass,
} from "@/components/ui/form-fields";
import { cn } from "@/lib/utils";
import {
  type ServiceCategory,
  type QuoteRequestFormData,
  graphicDesignProjectTypes,
  deliverableMediums,
  dimensionUnits,
  webDesignProjectTypes,
  webPageCounts,
  webFeatures,
  contentReadiness,
  experienceTypes,
  campaignDurations,
  analyticsOptions,
  modelFileStatus,
  printDimensionUnits,
  slaFinishes,
  slaMaterialColors,
  slaTolerances,
  fdmStructuralRequirements,
  fdmInfillOptions,
  fdmLayerQualities,
  consultationAreas,
  consultationFormats,
  consultationUrgencies,
  serviceCategoryLabels,
  SLA_MAX_DIMENSIONS,
  FDM_MAX_DIMENSIONS,
} from "./types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function SelectField({
  label,
  name,
  options,
  required,
  error,
  register,
}: {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
  error?: string;
  register: ReturnType<typeof useFormContext<QuoteRequestFormData>>["register"];
}) {
  return (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select className={inputClass} {...register(name as keyof QuoteRequestFormData)}>
        <option value="" className="bg-surface-light">
          Select...
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-surface-light">
            {opt}
          </option>
        ))}
      </select>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

function MultiSelectField({
  label,
  name,
  options,
  required,
  error,
  watch,
  setValue,
}: {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
  error?: string;
  watch: ReturnType<typeof useFormContext<QuoteRequestFormData>>["watch"];
  setValue: ReturnType<typeof useFormContext<QuoteRequestFormData>>["setValue"];
}) {
  const current = (watch(name as keyof QuoteRequestFormData) as string[]) || [];

  function toggle(opt: string) {
    const next = current.includes(opt)
      ? current.filter((v) => v !== opt)
      : [...current, opt];
    setValue(name as keyof QuoteRequestFormData, next as never, {
      shouldValidate: true,
    });
  }

  return (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = current.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                isActive
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : "bg-surface-light border-border text-text-muted hover:border-primary/30",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

// ─── Brand Kit URL Field ────────────────────────────────────────────────────

function BrandKitUrlField({
  error,
  register,
}: {
  error?: string;
  register: ReturnType<typeof useFormContext<QuoteRequestFormData>>["register"];
}) {
  return (
    <div>
      <label className={labelClass}>
        Brand Kit / Design Guidelines Link <span className="text-red-400">*</span>
      </label>
      <input
        type="url"
        placeholder="https://drive.google.com/... or brand portal URL"
        className={inputClass}
        {...register("serviceDetails.brandKitUrl" as keyof QuoteRequestFormData)}
      />
      <p className="text-text-muted text-xs mt-2 leading-relaxed">
        Don't have one? Create an empty shared folder (Google Drive, Dropbox, etc.) and
        paste the link here. Be sure to share access with{" "}
        <span className="text-primary font-medium">admin@stratanova.org</span>{" "}
        after submitting. If you have any logo or brand design assets, upload them to the
        folder as soon as possible.
      </p>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

// ─── Graphic Design ─────────────────────────────────────────────────────────

function GraphicDesignFields() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuoteRequestFormData>();
  const e = errors.serviceDetails as Record<string, { message?: string }> | undefined;

  return (
    <div className="space-y-6">
      <MultiSelectField
        label="Project Type"
        name="serviceDetails.projectTypes"
        options={graphicDesignProjectTypes}
        required
        error={e?.projectTypes?.message}
        watch={watch}
        setValue={setValue}
      />
      <BrandKitUrlField error={e?.brandKitUrl?.message} register={register} />
      <div>
        <label className={labelClass}>Brand Colors / Style Direction</label>
        <textarea
          placeholder="Mood, references, color preferences..."
          rows={3}
          className={`${inputClass} !h-auto resize-none`}
          {...register("serviceDetails.styleDirection" as keyof QuoteRequestFormData)}
        />
      </div>
      <SelectField
        label="Deliverable Medium"
        name="serviceDetails.deliverableMedium"
        options={deliverableMediums}
        required
        error={e?.deliverableMedium?.message}
        register={register}
      />
      <div>
        <label className={labelClass}>Primary Asset Dimensions</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Width"
            className={cn(inputClass, "w-28")}
            {...register("serviceDetails.dimensionWidth" as keyof QuoteRequestFormData)}
          />
          <span className="text-text-muted">×</span>
          <input
            type="number"
            placeholder="Height"
            className={cn(inputClass, "w-28")}
            {...register("serviceDetails.dimensionHeight" as keyof QuoteRequestFormData)}
          />
          <select
            className={cn(inputClass, "w-28")}
            {...register("serviceDetails.dimensionUnit" as keyof QuoteRequestFormData)}
          >
            {dimensionUnits.map((u) => (
              <option key={u} value={u} className="bg-surface-light">
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── Web Design ─────────────────────────────────────────────────────────────

function WebDesignFields() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuoteRequestFormData>();
  const e = errors.serviceDetails as Record<string, { message?: string }> | undefined;

  return (
    <div className="space-y-6">
      <SelectField
        label="Project Type"
        name="serviceDetails.projectType"
        options={webDesignProjectTypes}
        required
        error={e?.projectType?.message}
        register={register}
      />
      <div>
        <label className={labelClass}>Current Site URL</label>
        <input
          type="url"
          placeholder="https://yoursite.com (optional)"
          className={inputClass}
          {...register("serviceDetails.currentSiteUrl" as keyof QuoteRequestFormData)}
        />
      </div>
      <div>
        <label className={labelClass}>Current CMS, if any?</label>
        <input
          type="text"
          placeholder="e.g. WordPress, Shopify, Squarespace, none..."
          className={inputClass}
          {...register("serviceDetails.currentCms" as keyof QuoteRequestFormData)}
        />
      </div>
      <BrandKitUrlField error={e?.brandKitUrl?.message} register={register} />
      <SelectField
        label="Estimated Page Count"
        name="serviceDetails.pageCount"
        options={webPageCounts}
        required
        error={e?.pageCount?.message}
        register={register}
      />
      <MultiSelectField
        label="Key Features Needed"
        name="serviceDetails.features"
        options={webFeatures}
        watch={watch}
        setValue={setValue}
      />
      <SelectField
        label="Do you have content ready?"
        name="serviceDetails.contentReady"
        options={contentReadiness}
        required
        error={e?.contentReady?.message}
        register={register}
      />
    </div>
  );
}

// ─── Interactive Campaigns ──────────────────────────────────────────────────

function InteractiveCampaignFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuoteRequestFormData>();
  const e = errors.serviceDetails as Record<string, { message?: string }> | undefined;

  return (
    <div className="space-y-6">
      <SelectField
        label="Experience Type"
        name="serviceDetails.experienceType"
        options={experienceTypes}
        required
        error={e?.experienceType?.message}
        register={register}
      />
      <div>
        <label className={labelClass}>
          Desired End-User Outcome <span className="text-red-400">*</span>
        </label>
        <textarea
          placeholder='What should the user do / feel / buy at the end? (e.g. "sign up for waitlist", "claim discount code")'
          rows={3}
          className={`${inputClass} !h-auto resize-none`}
          {...register("serviceDetails.desiredOutcome" as keyof QuoteRequestFormData)}
        />
        {e?.desiredOutcome && (
          <p className={errorClass}>{e.desiredOutcome.message}</p>
        )}
      </div>
      <BrandKitUrlField error={e?.brandKitUrl?.message} register={register} />
      <div>
        <label className={labelClass}>Target Audience</label>
        <input
          type="text"
          placeholder="Who is this for?"
          className={inputClass}
          {...register("serviceDetails.targetAudience" as keyof QuoteRequestFormData)}
        />
      </div>
      <SelectField
        label="Campaign Duration"
        name="serviceDetails.campaignDuration"
        options={campaignDurations}
        required
        error={e?.campaignDuration?.message}
        register={register}
      />
      <SelectField
        label="Existing Analytics?"
        name="serviceDetails.existingAnalytics"
        options={analyticsOptions}
        register={register}
      />
      <div>
        <label className={labelClass}>Goals / KPIs</label>
        <textarea
          placeholder="What metrics define success? (conversions, signups, time on page, shares, etc.)"
          rows={3}
          className={`${inputClass} !h-auto resize-none`}
          {...register("serviceDetails.goalsKpis" as keyof QuoteRequestFormData)}
        />
      </div>
    </div>
  );
}

// ─── 3D Print Dimension Fields ──────────────────────────────────────────────

function PrintDimensionFields({
  prefix,
  maxDimensions,
  printerName,
}: {
  prefix: string;
  maxDimensions: { l: number; w: number; h: number };
  printerName: string;
}) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<QuoteRequestFormData>();
  const e = errors.serviceDetails as Record<string, { message?: string }> | undefined;
  const unit = (watch(`${prefix}.dimensionUnit` as keyof QuoteRequestFormData) as string) || "mm";

  const maxLabel =
    unit === "inches"
      ? `${(maxDimensions.l / 25.4).toFixed(1)} × ${(maxDimensions.w / 25.4).toFixed(1)} × ${(maxDimensions.h / 25.4).toFixed(1)} in`
      : `${maxDimensions.l} × ${maxDimensions.w} × ${maxDimensions.h} mm`;

  return (
    <div>
      <label className={labelClass}>
        Dimensions (L × W × H)
        <span className="text-text-muted text-xs ml-2">
          Max: {maxLabel} ({printerName})
        </span>
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="L"
          className={cn(inputClass, "w-24")}
          {...register(`${prefix}.dimensionL` as keyof QuoteRequestFormData)}
        />
        <span className="text-text-muted">×</span>
        <input
          type="number"
          placeholder="W"
          className={cn(inputClass, "w-24")}
          {...register(`${prefix}.dimensionW` as keyof QuoteRequestFormData)}
        />
        <span className="text-text-muted">×</span>
        <input
          type="number"
          placeholder="H"
          className={cn(inputClass, "w-24")}
          {...register(`${prefix}.dimensionH` as keyof QuoteRequestFormData)}
        />
        <select
          className={cn(inputClass, "w-24")}
          {...register(`${prefix}.dimensionUnit` as keyof QuoteRequestFormData)}
        >
          {printDimensionUnits.map((u) => (
            <option key={u} value={u} className="bg-surface-light">
              {u}
            </option>
          ))}
        </select>
      </div>
      {e?.dimensionL && (
        <p className={cn(errorClass, "mt-2")}>{e.dimensionL.message}</p>
      )}
    </div>
  );
}

// ─── SLA 3D Prints ─────────────────────────────────────────────────────────

function Sla3dPrintFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuoteRequestFormData>();
  const e = errors.serviceDetails as Record<string, { message?: string }> | undefined;

  return (
    <div className="space-y-6">
      <SelectField
        label="Do you have a 3D model file?"
        name="serviceDetails.modelFileStatus"
        options={modelFileStatus}
        required
        error={e?.modelFileStatus?.message}
        register={register}
      />
      <PrintDimensionFields
        prefix="serviceDetails"
        maxDimensions={SLA_MAX_DIMENSIONS}
        printerName="Form 4"
      />
      <div>
        <label className={labelClass}>
          Quantity <span className="text-red-400">*</span>
        </label>
        <input
          type="number"
          min="1"
          placeholder="1"
          className={cn(inputClass, "w-28")}
          {...register("serviceDetails.quantity" as keyof QuoteRequestFormData)}
        />
        {e?.quantity && <p className={errorClass}>{e.quantity.message}</p>}
      </div>
      <SelectField
        label="Surface Finish"
        name="serviceDetails.surfaceFinish"
        options={slaFinishes}
        required
        error={e?.surfaceFinish?.message}
        register={register}
      />
      <SelectField
        label="Material Color"
        name="serviceDetails.materialColor"
        options={slaMaterialColors}
        required
        error={e?.materialColor?.message}
        register={register}
      />
      <SelectField
        label="Tolerance Requirements"
        name="serviceDetails.tolerance"
        options={slaTolerances}
        required
        error={e?.tolerance?.message}
        register={register}
      />
      <div>
        <label className={labelClass}>Application / Use Case</label>
        <input
          type="text"
          placeholder="What will this part be used for?"
          className={inputClass}
          {...register("serviceDetails.useCase" as keyof QuoteRequestFormData)}
        />
      </div>
    </div>
  );
}

// ─── FDM 3D Prints ─────────────────────────────────────────────────────────

function Fdm3dPrintFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuoteRequestFormData>();
  const e = errors.serviceDetails as Record<string, { message?: string }> | undefined;

  return (
    <div className="space-y-6">
      <SelectField
        label="Do you have a 3D model file?"
        name="serviceDetails.modelFileStatus"
        options={modelFileStatus}
        required
        error={e?.modelFileStatus?.message}
        register={register}
      />
      <PrintDimensionFields
        prefix="serviceDetails"
        maxDimensions={FDM_MAX_DIMENSIONS}
        printerName="Bambu A1"
      />
      <div>
        <label className={labelClass}>
          Quantity <span className="text-red-400">*</span>
        </label>
        <input
          type="number"
          min="1"
          placeholder="1"
          className={cn(inputClass, "w-28")}
          {...register("serviceDetails.quantity" as keyof QuoteRequestFormData)}
        />
        {e?.quantity && <p className={errorClass}>{e.quantity.message}</p>}
      </div>
      <SelectField
        label="Structural Requirements"
        name="serviceDetails.structuralRequirement"
        options={fdmStructuralRequirements}
        required
        error={e?.structuralRequirement?.message}
        register={register}
      />
      <SelectField
        label="Infill Preference"
        name="serviceDetails.infill"
        options={fdmInfillOptions}
        required
        error={e?.infill?.message}
        register={register}
      />
      <div>
        <label className={labelClass}>PLA Color</label>
        <input
          type="text"
          placeholder="e.g. Black, White, or specific color"
          className={inputClass}
          {...register("serviceDetails.plaColor" as keyof QuoteRequestFormData)}
        />
      </div>
      <SelectField
        label="Layer Quality"
        name="serviceDetails.layerQuality"
        options={fdmLayerQualities}
        required
        error={e?.layerQuality?.message}
        register={register}
      />
    </div>
  );
}

// ─── Technical Consultation ─────────────────────────────────────────────────

function TechnicalConsultationFields() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuoteRequestFormData>();
  const e = errors.serviceDetails as Record<string, { message?: string }> | undefined;

  return (
    <div className="space-y-6">
      <MultiSelectField
        label="Consultation Area"
        name="serviceDetails.consultationAreas"
        options={consultationAreas}
        required
        error={e?.consultationAreas?.message}
        watch={watch}
        setValue={setValue}
      />
      <div>
        <label className={labelClass}>Current Tech Stack</label>
        <textarea
          placeholder="What are you working with now?"
          rows={3}
          className={`${inputClass} !h-auto resize-none`}
          {...register("serviceDetails.currentTechStack" as keyof QuoteRequestFormData)}
        />
      </div>
      <div>
        <label className={labelClass}>
          Primary Pain Point <span className="text-red-400">*</span>
        </label>
        <textarea
          placeholder="What problem are you trying to solve?"
          rows={3}
          className={`${inputClass} !h-auto resize-none`}
          {...register("serviceDetails.painPoint" as keyof QuoteRequestFormData)}
        />
        {e?.painPoint && <p className={errorClass}>{e.painPoint.message}</p>}
      </div>
      <SelectField
        label="Preferred Format"
        name="serviceDetails.preferredFormat"
        options={consultationFormats}
        required
        error={e?.preferredFormat?.message}
        register={register}
      />
      <SelectField
        label="Urgency"
        name="serviceDetails.urgency"
        options={consultationUrgencies}
        required
        error={e?.urgency?.message}
        register={register}
      />
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

const fieldComponents: Record<ServiceCategory, React.FC> = {
  "graphic-design": GraphicDesignFields,
  "web-design": WebDesignFields,
  "interactive-campaigns": InteractiveCampaignFields,
  "sla-3d-prints": Sla3dPrintFields,
  "fdm-3d-prints": Fdm3dPrintFields,
  "technical-consultation": TechnicalConsultationFields,
};

export function StepServiceDetails() {
  const { watch } = useFormContext<QuoteRequestFormData>();
  const category = watch("serviceCategory") as ServiceCategory;

  if (!category) return null;

  const Fields = fieldComponents[category];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">
          {serviceCategoryLabels[category]}
        </h2>
        <p className="text-text-muted text-sm">
          Tell me more about what you need.
        </p>
      </div>
      <Fields />
    </div>
  );
}
