import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── WaveformBars ─────────────────────────────────────────────────────────────

function WaveformBars() {
  const delays = [0.15, 0.05, 0, 0.05, 0.15];
  return (
    <div className="flex items-center gap-[3px] h-5">
      {delays.map((delay, i) => (
        <motion.span
          key={i}
          className="block w-[3px] rounded-full bg-background"
          style={{ height: "100%", transformOrigin: "bottom" }}
          animate={{ scaleY: [0.25, 1, 0.25] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        />
      ))}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type SubmitStatus = "idle" | "loading" | "success" | "error";

interface MorphingSubmitButtonProps {
  status: SubmitStatus;
  successExpanded: boolean;
  onRetry: () => void;
  label?: string;
}

// ─── MorphingSubmitButton ─────────────────────────────────────────────────────

export function MorphingSubmitButton({
  status,
  successExpanded,
  onRetry,
  label = "Send Request",
}: MorphingSubmitButtonProps) {
  const isLoading = status === "loading";
  const isError = status === "error";
  const isSuccessCompact = status === "success" && !successExpanded;
  const isSuccessExpanded = status === "success" && successExpanded;
  const isCompact = isLoading || isSuccessCompact;

  type ContentKey =
    | "idle"
    | "loading"
    | "success-compact"
    | "success-expanded"
    | "error";

  const contentKey: ContentKey =
    status === "idle"
      ? "idle"
      : status === "loading"
        ? "loading"
        : isSuccessCompact
          ? "success-compact"
          : isSuccessExpanded
            ? "success-expanded"
            : "error";

  return (
    <div className="flex justify-start">
      <motion.button
        layout
        type={isError ? "button" : "submit"}
        onClick={isError ? onRetry : undefined}
        disabled={isLoading}
        animate={isError ? { x: [-5, 5, -5, 5, -3, 3, 0] } : { x: 0 }}
        transition={
          isError
            ? { type: "tween", duration: 0.45, ease: "easeOut" }
            : { type: "spring", stiffness: 400, damping: 30 }
        }
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          "disabled:pointer-events-none disabled:opacity-80",
          "overflow-hidden whitespace-nowrap cursor-pointer",
          isCompact
            ? "h-12 px-5 min-w-[56px]"
            : "h-12 px-8 text-base w-full sm:w-auto",
          isError
            ? "bg-red-500/80 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)]"
            : status === "success"
              ? "bg-accent/90 text-background shadow-[0_0_20px_rgba(57,255,20,0.35)]"
              : "bg-primary text-background shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_32px_rgba(0,229,255,0.55)]",
        )}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={contentKey}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2"
          >
            {contentKey === "idle" && (
              <>
                {label}
                <Send size={16} />
              </>
            )}
            {contentKey === "loading" && <WaveformBars />}
            {contentKey === "success-compact" && <CheckCircle size={22} />}
            {contentKey === "success-expanded" && (
              <>
                Request Sent!
                <CheckCircle size={16} />
              </>
            )}
            {contentKey === "error" && (
              <>
                <XCircle size={16} />
                Failed — Try Again
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
