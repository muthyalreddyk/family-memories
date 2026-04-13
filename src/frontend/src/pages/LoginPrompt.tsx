import { Button } from "@/components/ui/button";
import { BookHeart, Heart, Images, Lock, Users } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/use-auth";

const features = [
  {
    icon: Images,
    title: "Preserve Memories",
    description:
      "Upload photos and videos from your family's most cherished moments.",
  },
  {
    icon: Users,
    title: "Family Only",
    description:
      "Private and secure — only family members can access your shared memories.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Powered by the Internet Computer, your memories are yours forever.",
  },
];

const testimonials = [
  {
    quote: "Finally a place where grandma's photos are safe for generations.",
    name: "Elena M.",
    relation: "Grandmother of 6",
  },
  {
    quote: "We use it every Sunday — the kids love adding their own stories.",
    name: "James T.",
    relation: "Father of 3",
  },
  {
    quote: "Nothing brings our family together like reliving old memories.",
    name: "Priya N.",
    relation: "Family archivist",
  },
];

export function LoginPrompt() {
  const { login, isLoading } = useAuth();

  return (
    <div className="flex-1 flex flex-col" data-ocid="login-prompt">
      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden texture-paper py-20 px-4">
        {/* Decorative warm glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-accent/6 blur-3xl" />
        </div>

        <div className="relative max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text + CTA */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex justify-center lg:justify-start mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                <Heart className="w-3.5 h-3.5 fill-current" />
                For your family, forever
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight"
            >
              Your Family's
              <br />
              <span className="text-primary">Story Lives Here</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto lg:mx-0"
            >
              Preserve and share the moments that matter most — photos, stories,
              and milestones treasured for generations to come.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={login}
                disabled={isLoading}
                className="rounded-full px-8 py-3 text-base font-semibold shadow-elevated transition-smooth hover:shadow-card w-full sm:w-auto"
                data-ocid="login-cta-btn"
              >
                <BookHeart className="w-5 h-5 mr-2" />
                {isLoading ? "Connecting…" : "Sign In with Internet Identity"}
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-xs text-muted-foreground mt-4"
            >
              Secure, passwordless login — no password needed.
            </motion.p>
          </div>

          {/* Right: Hero image with polaroid frame */}
          <motion.div
            initial={{ opacity: 0, x: 32, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 1.5 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm">
              {/* Shadow card stack effect */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-primary/15 rotate-3" />
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl bg-primary/10 rotate-1" />

              {/* Main polaroid */}
              <div className="relative bg-card rounded-2xl shadow-elevated border border-border/60 overflow-hidden">
                <img
                  src="/assets/generated/family-hero.dim_1200x800.jpg"
                  alt="Family gathering in warm afternoon light"
                  className="w-full h-64 sm:h-72 object-cover"
                  loading="eager"
                />
                <div className="p-4 pb-6">
                  <p className="font-display text-sm font-semibold text-foreground">
                    Summer at Grandpa's Farm
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    July 1998 · Sarah Johnson
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="absolute -top-4 -right-4 bg-card border border-border rounded-xl px-3 py-2 shadow-elevated flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-foreground">
                  Family memories safe
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/40 border-t border-border py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest mb-10"
          >
            Everything your family needs
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
                data-ocid={`feature-card-${i}`}
              >
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mx-auto mb-4 shadow-card">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background border-t border-border py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-2xl font-bold text-foreground text-center mb-10"
          >
            Families love it
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-card"
                data-ocid={`testimonial-${i}`}
              >
                <p className="text-sm text-foreground leading-relaxed mb-4 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {t.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.relation}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Start preserving your family story today
          </h2>
          <p className="text-primary-foreground/80 mb-8 leading-relaxed">
            Join families who trust their most precious memories to a secure,
            private, forever-accessible home.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={login}
            disabled={isLoading}
            className="rounded-full px-8 py-3 text-base font-semibold transition-smooth"
            data-ocid="login-cta-bottom-btn"
          >
            {isLoading ? "Connecting…" : "Get Started — It's Free"}
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
