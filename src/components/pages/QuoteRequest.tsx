import { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  MorphingSubmitButton,
  type SubmitStatus,
} from "@/components/ui/MorphingSubmitButton";
import { Button } from "@/components/ui/button";

import { StepContactInfo } from "@/components/quote-request/StepContactInfo";
import { StepServiceSelect } from "@/components/quote-request/StepServiceSelect";
import { StepServiceDetails } from "@/components/quote-request/StepServiceDetails";
import { StepTimeline } from "@/components/quote-request/StepTimeline";
import { StepReview } from "@/components/quote-request/StepReview";

import {
  contactInfoSchema,
  serviceSelectionSchema,
  serviceSchemas,
  timelineBudgetSchema,
} from "@/components/quote-request/schema";

import type {
  QuoteRequestFormData,
  ServiceCategory,
} from "@/components/quote-request/types";
import { serviceCategoryLabels } from "@/components/quote-request/types";

// ─── Steps ──────────────────────────────────────────────────────────────────

const STEPS = [
  { key: "contact", label: "Contact" },
  { key: "service", label: "Service" },
  { key: "details", label: "Details" },
  { key: "timeline", label: "Timeline" },
  { key: "review", label: "Review" },
] as const;

// Schemas per step (details schema is dynamic based on category)
function getStepSchema(step: number, category?: ServiceCategory) {
  switch (step) {
    case 0:
      return z.object({ contactInfo: contactInfoSchema });
    case 1:
      return z.object({ serviceCategory: serviceSelectionSchema.shape.serviceCategory });
    case 2:
      if (category && category in serviceSchemas) {
        return z.object({
          serviceDetails: serviceSchemas[category as keyof typeof serviceSchemas],
        });
      }
      return z.object({});
    case 3:
      return z.object({ timelineBudget: timelineBudgetSchema });
    default:
      return z.object({});
  }
}

const defaultValues: QuoteRequestFormData = {
  contactInfo: { fullName: "", email: "", phone: "", company: "" },
  serviceCategory: "",
  serviceDetails: {},
  timelineBudget: { budgetRange: "", timeline: "", additionalNotes: "" },
};

// ─── Formspree config ───────────────────────────────────────────────────────

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjgplrkb";

// ─── Progress Bar ───────────────────────────────────────────────────────────

function ProgressSteps({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                i < current
                  ? "bg-primary text-background"
                  : i === current
                    ? "bg-primary/20 text-primary ring-2 ring-primary/50"
                    : "bg-surface-light text-text-muted",
              )}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "text-[10px] mt-1 hidden sm:block",
                i <= current ? "text-primary" : "text-text-muted",
              )}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "h-0.5 flex-1 mx-1 rounded-full transition-colors",
                i < current ? "bg-primary" : "bg-surface-light",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Format submission for Formspree ────────────────────────────────────────

function formatSubmission(data: QuoteRequestFormData) {
  const category = data.serviceCategory as ServiceCategory;
  const lines: string[] = [
    `Service: ${category ? serviceCategoryLabels[category] : "Unknown"}`,
    "",
    "--- Contact ---",
    `Name: ${data.contactInfo.fullName}`,
    `Email: ${data.contactInfo.email}`,
    `Phone: ${data.contactInfo.phone}`,
    `Company: ${data.contactInfo.company || "N/A"}`,
    "",
    "--- Project Details ---",
  ];

  if (data.serviceDetails) {
    for (const [key, value] of Object.entries(data.serviceDetails)) {
      if (!value || (Array.isArray(value) && value.length === 0)) continue;
      const display = Array.isArray(value) ? value.join(", ") : String(value);
      lines.push(`${key}: ${display}`);
    }
  }

  lines.push(
    "",
    "--- Timeline & Budget ---",
    `Timeline: ${data.timelineBudget.timeline}`,
    `Budget: ${data.timelineBudget.budgetRange || "Not specified"}`,
    `Notes: ${data.timelineBudget.additionalNotes || "None"}`,
  );

  return lines.join("\n");
}

// ─── QuoteRequest ───────────────────────────────────────────────────────────

export function QuoteRequest() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [successExpanded, setSuccessExpanded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const methods = useForm<QuoteRequestFormData>({
    defaultValues,
    mode: "onTouched",
  });

  const category = methods.watch("serviceCategory") as ServiceCategory;

  async function validateCurrentStep(): Promise<boolean> {
    const schema = getStepSchema(step, category);
    const values = methods.getValues();
    const result = await schema.safeParseAsync(values);

    if (!result.success) {
      // Map Zod errors to react-hook-form
      for (const issue of result.error.issues) {
        const path = issue.path.join(".") as keyof QuoteRequestFormData;
        methods.setError(path, { message: issue.message });
      }
      return false;
    }
    return true;
  }

  async function handleNext() {
    const valid = await validateCurrentStep();
    if (valid) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    if (status === "loading") return;
    setStatus("loading");

    const data = methods.getValues();

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.contactInfo.fullName,
          email: data.contactInfo.email,
          phone: data.contactInfo.phone,
          company: data.contactInfo.company,
          service: category ? serviceCategoryLabels[category] : "",
          message: formatSubmission(data),
          _subject: `Quote Request — ${data.contactInfo.fullName} | ${category ? serviceCategoryLabels[category] : ""}`,
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);

      setStatus("success");
      timerRef.current = setTimeout(() => setSuccessExpanded(true), 1500);
    } catch {
      setStatus("error");
    }
  }

  function handleReset() {
    setStatus("idle");
    setSuccessExpanded(false);
    setStep(0);
    methods.reset(defaultValues);
  }

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 mb-16">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
              Request a{" "}
              <span className="gradient-text">Quote</span>
            </h1>
            <p className="text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
              Tell me about your project and I'll put together a custom
              proposal. Most quotes are returned within 48 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Card className="p-8">
              <CardContent>
                {status === "success" && successExpanded ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                      <ArrowRight size={28} className="text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      Quote Request Submitted!
                    </h3>
                    <p className="text-text-muted">
                      Thanks for reaching out. I'll review your project details
                      and follow up within 48 hours with a custom proposal.
                    </p>
                    <Button
                      variant="ghost"
                      className="mt-6"
                      onClick={handleReset}
                    >
                      Submit another request
                    </Button>
                  </motion.div>
                ) : (
                  <FormProvider {...methods}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (isLastStep) {
                          handleSubmit();
                        }
                      }}
                    >
                      <ProgressSteps current={step} />

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                        >
                          {step === 0 && <StepContactInfo />}
                          {step === 1 && <StepServiceSelect />}
                          {step === 2 && <StepServiceDetails />}
                          {step === 3 && <StepTimeline />}
                          {step === 4 && <StepReview />}
                        </motion.div>
                      </AnimatePresence>

                      {/* Navigation */}
                      <div className="flex justify-between items-center mt-8 pt-6 border-t border-border/30">
                        {step > 0 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleBack}
                            className="gap-2"
                          >
                            <ArrowLeft size={16} /> Back
                          </Button>
                        ) : (
                          <div />
                        )}

                        {isLastStep ? (
                          <MorphingSubmitButton
                            status={status}
                            successExpanded={successExpanded}
                            onRetry={() => setStatus("idle")}
                            label="Submit Quote Request"
                          />
                        ) : (
                          <Button
                            type="button"
                            onClick={handleNext}
                            className="gap-2"
                          >
                            Next <ArrowRight size={16} />
                          </Button>
                        )}
                      </div>
                    </form>
                  </FormProvider>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
