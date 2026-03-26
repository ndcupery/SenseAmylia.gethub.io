import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const socials = [
  {
    name: "YouTube",
    handle: "@PhazerLabs",
    url: "https://youtube.com/@PhazerLabs",
  },
  {
    name: "GitHub",
    handle: "PhazerLabs",
    url: "https://github.com/PhazerLabs",
  },
  {
    name: "Twitter / X",
    handle: "@PhazerLabs",
    url: "https://x.com/PhazerLabs",
  },
];

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 mb-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
              Get in{" "}
              <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
              Have an idea, a question, or just want to say hi? We&apos;d love
              to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <Card className="p-8">
                <CardContent>
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-16 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                        <Send size={28} className="text-accent" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-text-muted">
                        Thanks for reaching out. We&apos;ll get back to you
                        soon.
                      </p>
                      <Button
                        variant="ghost"
                        className="mt-6"
                        onClick={() => setSubmitted(false)}
                      >
                        Send another message
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
                            required
                            placeholder="Your name"
                            className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border text-text placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border text-text placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="What's this about?"
                          className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border text-text placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Message
                        </label>
                        <textarea
                          required
                          rows={5}
                          placeholder="Tell us what you're thinking..."
                          className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border text-text placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all resize-none"
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full sm:w-auto">
                        Send Message
                        <Send size={16} />
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Info */}
              <Card>
                <CardContent className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">Email</p>
                      <p className="text-sm text-text-muted">
                        hello@phazerlabs.com
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
                        The Internet, Earth
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Socials */}
              <Card>
                <CardContent>
                  <h3 className="font-semibold text-text mb-4">
                    Find us online
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
    </div>
  );
}
