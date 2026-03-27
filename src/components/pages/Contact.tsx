import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Palette,
  Monitor,
  Zap,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ─── Types ───────────────────────────────────────────────────────────────────

type SubmitStatus = "idle" | "loading" | "success" | "error";

interface BookingFormData {
  name: string;
  email: string;
  eventName: string;
  eventDate: string;
  eventType: string;
  eventLocation: string;
  details: string;
}

const defaultFormData: BookingFormData = {
  name: "",
  email: "",
  eventName: "",
  eventDate: "",
  eventType: "",
  eventLocation: "",
  details: "",
};

// ─── Constants ───────────────────────────────────────────────────────────────

const socials = [
  {
    name: "TikTok",
    handle: "@PhazerLabs",
    url: "https://tiktok.com/@PhazerLabs",
  },
  {
    name: "Instagram",
    handle: "@phazervisuals",
    url: "https://instagram.com/phazervisuals",
  },
  {
    name: "Facebook",
    handle: "phazervisuals",
    url: "https://facebook.com/phazervisuals",
  },
];

const eventTypes = [
  "Festival",
  "Multi-Day Festival",
  "Concert",
  "Club Night",
  "Private Event",
  "Corporate",
  "Other",
];

const valueProps = [
  {
    icon: Palette,
    title: "Custom Visuals, Every Show",
    description:
      "Visuals designed and programmed for your lineup, theme, and venue. No generic loops.",
    color: "text-primary",
    borderColor: "border-primary/50",
    numberColor: "text-primary/10",
  },
  {
    icon: Monitor,
    title: "Full Rig, Ready to Go",
    description:
      "Self-contained setup with projectors, media servers, and backup systems. Plug in and go.",
    color: "text-accent",
    borderColor: "border-accent/50",
    numberColor: "text-accent/10",
  },
  {
    icon: Zap,
    title: "Festival-Tested",
    description:
      "Experienced across multi-stage festivals, intimate club shows, and corporate events.",
    color: "text-warm",
    borderColor: "border-warm/50",
    numberColor: "text-warm/10",
  },
  {
    icon: MessageSquare,
    title: "Collaborative Process",
    description:
      "I work directly with you to match the visual identity to your artists, brand, and audience.",
    color: "text-secondary",
    borderColor: "border-secondary/50",
    numberColor: "text-secondary/10",
  },
];

const valuePropContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const valuePropItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const inputClass =
  "w-full h-12 px-4 py-3 rounded-xl bg-surface-light border border-border text-text text-base placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all appearance-none";

// ─── WaveformBars ─────────────────────────────────────────────────────────────
// 5 equalizer-style bars that peak at the center — on-brand for a DJ/VJ

function WaveformBars() {
  // Symmetric stagger: outer bars lag, center bar leads
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

// ─── MorphingSubmitButton ─────────────────────────────────────────────────────

interface MorphingSubmitButtonProps {
  status: SubmitStatus;
  successExpanded: boolean;
  onRetry: () => void;
}

function MorphingSubmitButton({
  status,
  successExpanded,
  onRetry,
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
          // Size
          isCompact
            ? "h-12 px-5 min-w-[56px]"
            : "h-12 px-8 text-base w-full sm:w-auto",
          // Color
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
                Send Request
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

// ─── Contact ──────────────────────────────────────────────────────────────────

export function Contact() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [formData, setFormData] = useState<BookingFormData>(defaultFormData);
  const [successExpanded, setSuccessExpanded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleReset() {
    setStatus("idle");
    setSuccessExpanded(false);
    setFormData(defaultFormData);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");

    const issueTitle = `Booking Request — ${formData.name} | ${formData.eventType} | ${formData.eventDate}`;
    const issueBody = [
      "## Booking Request",
      "",
      `**Name:** ${formData.name}`,
      `**Email:** ${formData.email}`,
      "",
      "---",
      "",
      `**Event Name:** ${formData.eventName}`,
      `**Event Date:** ${formData.eventDate}`,
      `**Event Type:** ${formData.eventType}`,
      `**Event Location:** ${formData.eventLocation}`,
      "",
      "---",
      "",
      "### Additional Details",
      "",
      formData.details || "_No additional details provided._",
      "",
      "---",
      "_Submitted via phazerlabs.com contact form_",
    ].join("\n");

    try {
      const res = await fetch(
        "https://api.github.com/repos/wattrobert/wattrobert.github.io/issues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${import.meta.env.VITE_GITHUB_ISSUES_TOKEN}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          body: JSON.stringify({
            title: issueTitle,
            body: issueBody,
            labels: ["booking-request"],
          }),
        },
      );

      if (!res.ok) throw new Error(`${res.status}`);

      setStatus("success");
      timerRef.current = setTimeout(() => setSuccessExpanded(true), 1500);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 mb-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
              Elevate{" "}
              <span className="gradient-text">Your Stage</span>
            </h1>
            <p className="text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
              Custom live visuals that transform your festival, show, or event
              into an immersive experience. Trusted by promoters and producers
              across the Midwest.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="lg:col-span-3"
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
                        <Send size={28} className="text-accent" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        Booking Request Sent!
                      </h3>
                      <p className="text-text-muted">
                        Thanks for reaching out. I&apos;ll be in touch within 48
                        hours to discuss your event and put together a visual
                        plan.
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your name or organization"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Event Name
                        </label>
                        <input
                          type="text"
                          name="eventName"
                          value={formData.eventName}
                          onChange={handleChange}
                          required
                          placeholder="What's the event called?"
                          className={inputClass}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">
                            Event Date
                          </label>
                          <input
                            type="date"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleChange}
                            required
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">
                            Event Type
                          </label>
                          <select
                            name="eventType"
                            value={formData.eventType}
                            onChange={handleChange}
                            required
                            className={inputClass}
                          >
                            <option value="" className="bg-surface-light">
                              Select type...
                            </option>
                            {eventTypes.map((type) => (
                              <option
                                key={type}
                                value={type}
                                className="bg-surface-light"
                              >
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Event Location
                        </label>
                        <input
                          type="text"
                          name="eventLocation"
                          value={formData.eventLocation}
                          onChange={handleChange}
                          required
                          placeholder="City, State or Venue"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Additional Details
                        </label>
                        <textarea
                          name="details"
                          value={formData.details}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell me about your event — headliners, expected attendance, stage dimensions, visual vibe, anything that helps me prepare..."
                          className={`${inputClass} !h-auto resize-none`}
                        />
                      </div>

                      <MorphingSubmitButton
                        status={status}
                        successExpanded={successExpanded}
                        onRetry={() => setStatus("idle")}
                      />
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Availability */}
              <Card className="border-secondary/20">
                <CardContent className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Calendar size={16} className="text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">
                        Availability
                      </p>
                      <p className="text-sm text-text-muted">
                        Now booking for Midwest festival season 2026
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">Location</p>
                      <p className="text-sm text-text-muted">
                        Based in the Midwest
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">
                        General Inquiries
                      </p>
                      <p className="text-sm text-text-muted">
                        hello@phazerlabs.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-warm/10 flex items-center justify-center shrink-0">
                      <Clock size={16} className="text-warm" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">
                        Response Time
                      </p>
                      <p className="text-sm text-text-muted">
                        Typically within 24–48 hours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Socials */}
              <Card>
                <CardContent>
                  <h3 className="font-semibold text-text mb-4">
                    Find me online
                  </h3>
                  <div className="space-y-3">
                    {socials.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-surface-light transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-text">
                            {social.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {social.handle}
                          </p>
                        </div>
                        <ExternalLink
                          size={14}
                          className="text-text-muted group-hover:text-primary transition-colors"
                        />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="px-6 mt-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={valuePropContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {valueProps.map((prop, index) => (
              <motion.div key={prop.title} variants={valuePropItem}>
                <Card className={`h-full border-l-2 ${prop.borderColor} relative overflow-hidden`}>
                  <CardContent className="space-y-3 relative">
                    <span
                      className={`absolute top-2 right-3 text-6xl font-black ${prop.numberColor} select-none pointer-events-none leading-none`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-lg bg-surface-light flex items-center justify-center ring-1 ring-current/20 ${prop.color}`}
                    >
                      <prop.icon size={22} />
                    </div>
                    <h3 className="font-semibold text-text text-sm">
                      {prop.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {prop.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
