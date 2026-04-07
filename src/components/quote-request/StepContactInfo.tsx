import { useFormContext } from "react-hook-form";
import { inputClass, labelClass, errorClass } from "@/components/ui/form-fields";
import type { QuoteRequestFormData } from "./types";

export function StepContactInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuoteRequestFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Let's get started</h2>
        <p className="text-text-muted text-sm">
          Tell me a bit about yourself so I can follow up on your request.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Your name"
            className={inputClass}
            {...register("contactInfo.fullName")}
          />
          {errors.contactInfo?.fullName && (
            <p className={errorClass}>{errors.contactInfo.fullName.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className={inputClass}
            {...register("contactInfo.email")}
          />
          {errors.contactInfo?.email && (
            <p className={errorClass}>{errors.contactInfo.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>
            Phone Number <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            placeholder="(555) 123-4567"
            className={inputClass}
            {...register("contactInfo.phone")}
          />
          {errors.contactInfo?.phone && (
            <p className={errorClass}>{errors.contactInfo.phone.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Company / Organization</label>
          <input
            type="text"
            placeholder="Optional"
            className={inputClass}
            {...register("contactInfo.company")}
          />
        </div>
      </div>
    </div>
  );
}
