import { useFormContext } from "react-hook-form";
import {
  inputClass,
  labelClass,
  errorClass,
} from "@/components/ui/form-fields";
import { budgetRanges, timelineOptions, type QuoteRequestFormData } from "./types";

export function StepTimeline() {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuoteRequestFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Timeline & Budget</h2>
        <p className="text-text-muted text-sm">
          This helps me scope and prioritize your project.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>
            Desired Timeline <span className="text-red-400">*</span>
          </label>
          <select
            className={inputClass}
            {...register("timelineBudget.timeline")}
          >
            <option value="" className="bg-surface-light">
              Select...
            </option>
            {timelineOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-surface-light">
                {opt}
              </option>
            ))}
          </select>
          {errors.timelineBudget?.timeline && (
            <p className={errorClass}>
              {errors.timelineBudget.timeline.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Budget Range</label>
          <select
            className={inputClass}
            {...register("timelineBudget.budgetRange")}
          >
            <option value="" className="bg-surface-light">
              Select... (optional)
            </option>
            {budgetRanges.map((opt) => (
              <option key={opt} value={opt} className="bg-surface-light">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Additional Notes</label>
        <textarea
          placeholder="Anything else I should know? Context, constraints, inspiration links..."
          rows={4}
          className={`${inputClass} !h-auto resize-none`}
          {...register("timelineBudget.additionalNotes")}
        />
      </div>
    </div>
  );
}
