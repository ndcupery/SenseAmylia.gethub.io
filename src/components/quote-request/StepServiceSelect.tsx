import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import type { LucideProps } from "lucide-react";
import {
  Palette,
  Monitor,
  Gamepad2,
  Droplets,
  Box,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  serviceCategories,
  serviceCategoryLabels,
  serviceCategoryDescriptions,
  type ServiceCategory,
  type QuoteRequestFormData,
} from "./types";
import { errorClass } from "@/components/ui/form-fields";

const categoryIcons: Record<ServiceCategory, React.FC<LucideProps>> = {
  "graphic-design": Palette,
  "web-design": Monitor,
  "interactive-campaigns": Gamepad2,
  "sla-3d-prints": Droplets,
  "fdm-3d-prints": Box,
  "technical-consultation": BrainCircuit,
};

const categorySelectedStyles: Record<ServiceCategory, string> = {
  "graphic-design":
    "border-primary/50 shadow-[0_0_25px_rgba(0,229,255,0.15)] ring-1 ring-primary/30",
  "web-design":
    "border-accent/50 shadow-[0_0_25px_rgba(57,255,20,0.15)] ring-1 ring-accent/30",
  "interactive-campaigns":
    "border-warm/50 shadow-[0_0_25px_rgba(255,140,0,0.15)] ring-1 ring-warm/30",
  "sla-3d-prints":
    "border-secondary/50 shadow-[0_0_25px_rgba(123,47,190,0.15)] ring-1 ring-secondary/30",
  "fdm-3d-prints":
    "border-primary/50 shadow-[0_0_25px_rgba(0,229,255,0.15)] ring-1 ring-primary/30",
  "technical-consultation":
    "border-accent/50 shadow-[0_0_25px_rgba(57,255,20,0.15)] ring-1 ring-accent/30",
};

const categoryIconActiveStyles: Record<ServiceCategory, string> = {
  "graphic-design": "bg-primary/20 text-primary",
  "web-design": "bg-accent/20 text-accent",
  "interactive-campaigns": "bg-warm/20 text-warm",
  "sla-3d-prints": "bg-secondary/20 text-secondary",
  "fdm-3d-prints": "bg-primary/20 text-primary",
  "technical-consultation": "bg-accent/20 text-accent",
};

export function StepServiceSelect() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<QuoteRequestFormData>();

  const selected = watch("serviceCategory");

  function handleSelect(category: ServiceCategory) {
    setValue("serviceCategory", category, { shouldValidate: true });
    // Clear previous service details when category changes
    setValue("serviceDetails", {});
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">What can I help with?</h2>
        <p className="text-text-muted text-sm">
          Select the service category that best fits your project.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceCategories.map((category, index) => {
          const Icon = categoryIcons[category];
          const isSelected = selected === category;

          return (
            <motion.button
              key={category}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleSelect(category)}
              className={cn(
                "glass p-5 rounded-2xl text-left transition-all cursor-pointer group",
                "hover:border-primary/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]",
                isSelected && categorySelectedStyles[category],
              )}
            >
              <div
                className={cn(
                  "w-11 h-11 rounded-lg flex items-center justify-center mb-3 transition-colors",
                  isSelected
                    ? categoryIconActiveStyles[category]
                    : "bg-surface-light text-text-muted group-hover:text-primary",
                )}
              >
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-text text-sm mb-1">
                {serviceCategoryLabels[category]}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {serviceCategoryDescriptions[category]}
              </p>
            </motion.button>
          );
        })}
      </div>

      {errors.serviceCategory && (
        <p className={errorClass}>{errors.serviceCategory.message}</p>
      )}
    </div>
  );
}
