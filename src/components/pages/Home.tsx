import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Play, Code2, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const pillars = [
  {
    icon: Play,
    title: "Content Creator",
    description:
      "Deep-dive tutorials, project builds, and tech explorations on YouTube. I learn by building, one project at a time.",
    color: "text-warm",
    borderColor: "hover:border-warm/40 hover:shadow-[0_0_30px_rgba(255,140,0,0.15)]",
  },
  {
    icon: Code2,
    title: "Software Builder",
    description:
      "From concept to deployment — I build tools, apps, and platforms that solve real problems with modern tech stacks.",
    color: "text-primary",
    borderColor: "hover:border-primary/40 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]",
  },
  {
    icon: Palette,
    title: "Creative Agency",
    description:
      "Bringing ideas to life through design, development, and creative direction. Where technology meets imagination.",
    color: "text-accent",
    borderColor: "hover:border-accent/40 hover:shadow-[0_0_30px_rgba(57,255,20,0.15)]",
  },
  {
    icon: Sparkles,
    title: "Live Visuals",
    description:
      "Phazer Visuals — immersive live visual performances for festivals and events. Now booking for Midwest festival season.",
    color: "text-secondary",
    borderColor: "hover:border-secondary/40 hover:shadow-[0_0_30px_rgba(123,47,190,0.15)]",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Home() {
  return (
    <>
      {/* Video + Hero + Pillars shared container */}
      <div className="relative">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center">
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Now experimenting
              </div>

              <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
                <span className="text-glow-primary gradient-text">Build.</span>{" "}
                <span className="text-glow-accent text-accent">Create.</span>{" "}
                <br />
                <span className="text-text">Experiment.</span>
              </h1>

              <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                Sense Amylia is where technology meets creativity. I build
                software, create content, perform live visuals, and push the
                boundaries of what&apos;s possible.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/laboratory">
                  <Button size="lg">
                    Explore the Lab
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Book Phazer Visuals
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-text-muted/30 flex items-start justify-center p-1.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </motion.div>
          </motion.div>
        </section>

        {/* Pillars Section — over the video background */}
        <section className="relative py-32 px-6">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                What I <span className="gradient-text">Do</span>
              </h2>
              <p className="text-text-muted max-w-xl mx-auto">
                Four pillars, one mission — pushing the boundaries of technology
                and creativity.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {pillars.map((pillar) => (
                <motion.div key={pillar.title} variants={item}>
                  <Card
                    className={`h-full group cursor-default glass !bg-transparent backdrop-blur-xl ${pillar.borderColor}`}
                  >
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-xl bg-surface-light/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${pillar.color}`}
                      >
                        <pillar.icon size={24} />
                      </div>
                      <CardTitle>{pillar.title}</CardTitle>
                    </CardHeader>
                    <CardDescription className="leading-relaxed">
                      {pillar.description}
                    </CardDescription>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      {/* CTA Section — video shows through */}
      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl glass !bg-transparent backdrop-blur-xl border border-white/10 p-12 sm:p-16 text-center overflow-hidden"
          >

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to <span className="text-accent">Experiment</span>?
              </h2>
              <p className="text-text-muted max-w-lg mx-auto mb-8">
                Whether you&apos;re looking to collaborate, book live visuals
                for your next event, or just want to say hi — let&apos;s make
                it happen.
              </p>
              <Link to="/contact">
                <Button size="lg">
                  Book Phazer Visuals
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
