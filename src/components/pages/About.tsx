import { motion } from "framer-motion";
import { Zap, Target, Rocket, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Zap,
    title: "Innovation First",
    description:
      "I don't follow trends — I experiment, iterate, and build what excites me. Every project is a chance to learn something new.",
    color: "text-warm",
  },
  {
    icon: Target,
    title: "Quality Over Quantity",
    description:
      "Whether it's code, content, or design — I believe in doing fewer things exceptionally well rather than many things mediocrely.",
    color: "text-primary",
  },
  {
    icon: Rocket,
    title: "Ship & Iterate",
    description:
      "Perfect is the enemy of done. I ship fast, gather feedback, and continuously improve. Real-world testing beats theoretical planning.",
    color: "text-accent",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description:
      "Everything I build and share is for the community. Open source, educational content, and transparent processes are in my DNA.",
    color: "text-secondary",
  },
];

const techStack = [
  "React",
  "TypeScript",
  "Node.js",
  "Three.js",
  "Tailwind",
  "Python",
  "Rust",
  "Docker",
  "AWS",
  "PostgreSQL",
  "WebGL",
  "Arduino",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function About() {
  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 mb-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
              About{" "}
              <span className="gradient-text">Sense Amylia</span>
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              A creative technology lab born from a passion for building things.
              Part YouTube channel, part software studio, part live visual
              performance — all experimental playground.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 mb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                The <span className="text-primary">Origin Story</span>
              </h2>
              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>
                  Sense Amylia started as a simple idea: document the process of
                  building cool stuff with technology. What began as a YouTube
                  channel quickly evolved into something bigger.
                </p>
                <p>
                  Today, it&apos;s a multi-faceted creative lab. I build
                  software products, create educational content, perform live
                  visuals at festivals, and take on creative projects that push
                  me to learn and grow.
                </p>
                <p>
                  My philosophy is simple — the best way to learn is by doing,
                  and the best way to grow is by sharing what you learn with
                  others.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-surface to-secondary/5 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.1),transparent_70%)]" />
                <div className="relative text-center p-8">
                  <div className="text-6xl sm:text-8xl font-black gradient-text mb-2">
                    PL
                  </div>
                  <div className="text-text-muted text-sm font-mono">
                    EST. 2024
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 mb-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              My <span className="text-accent">Values</span>
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              The principles that guide everything I build and create.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={item}>
                <Card className="h-full hover:border-primary/20 hover:shadow-[0_0_30px_rgba(0,229,255,0.08)]">
                  <CardContent className="flex gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-surface-light flex items-center justify-center shrink-0 ${value.color}`}
                    >
                      <value.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text mb-1">
                        {value.title}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              My <span className="text-primary">Tech Stack</span>
            </h2>
            <p className="text-text-muted">
              The tools and technologies I use to bring ideas to life.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {techStack.map((tech) => (
              <motion.span
                key={tech}
                variants={item}
                className="px-4 py-2 rounded-xl border border-border bg-surface text-sm text-text-muted hover:text-primary hover:border-primary/30 transition-colors font-mono cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
