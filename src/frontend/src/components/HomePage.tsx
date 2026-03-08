import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  Building2,
  Calculator,
  CheckCircle2,
  Home,
  Ruler,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

interface HomePageProps {
  onTabChange: (tab: string) => void;
}

const features = [
  {
    icon: Home,
    title: "Buy & Sell Properties",
    desc: "Discover residential, commercial, and plot listings across India. Connect directly with sellers.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Ruler,
    title: "Floor Plans",
    desc: "Browse professionally crafted floor plans in modern, traditional and contemporary styles.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Building2,
    title: "Architecture Projects",
    desc: "Explore curated architecture projects from top professionals across the country.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Calculator,
    title: "Construction Estimator",
    desc: "Get instant cost breakdowns for your construction project with our smart estimator.",
    color: "bg-violet-50 text-violet-600",
  },
];

const stats = [
  { value: "2,400+", label: "Properties Listed" },
  { value: "850+", label: "Floor Plans" },
  { value: "320+", label: "Architecture Projects" },
  { value: "₹5,200 Cr", label: "Transactions Facilitated" },
];

const whyChoose = [
  "Verified listings with transparent pricing",
  "Direct contact with architects & engineers",
  "Instant construction cost estimates",
  "Trusted by 50,000+ home buyers",
  "All property types: Residential, Commercial, Plots",
  "End-to-end infrastructure solutions",
];

const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Property Buyer, Delhi",
    quote:
      "Found my dream home in just 2 weeks. The platform's floor plan viewer helped me visualize the space perfectly.",
    rating: 5,
  },
  {
    name: "Priya Menon",
    role: "Architect, Bangalore",
    quote:
      "Royal Infrastructure has transformed how I showcase my projects. Leads have grown 3x since joining.",
    rating: 5,
  },
  {
    name: "Vikram Patel",
    role: "Real Estate Developer, Mumbai",
    quote:
      "The construction estimator saves us hours of manual calculation. Incredibly accurate for Indian market rates.",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HomePage({ onTabChange }: HomePageProps) {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[580px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-royal-bg.dim_1920x600.jpg')",
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <Badge className="mb-5 bg-gold/20 text-gold border-gold/30 font-cabinet tracking-wide text-xs uppercase">
              India's Complete Infrastructure Platform
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
              Your Complete{" "}
              <span className="text-gold-gradient">Real Estate &</span>
              <br />
              Infrastructure Partner
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8 font-body leading-relaxed">
              From plotting and floor planning to architecture, construction
              estimation, and buying or selling your dream home — everything in
              one trusted platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                data-ocid="hero.properties_button"
                size="lg"
                onClick={() => onTabChange("properties")}
                className="bg-gold hover:bg-gold/90 text-accent-foreground font-semibold shadow-gold px-8"
              >
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                data-ocid="hero.estimator_button"
                size="lg"
                variant="outline"
                onClick={() => onTabChange("estimator")}
                className="border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-8"
              >
                Cost Estimator
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={itemVariants}>
                <div className="font-display text-2xl md:text-3xl font-bold text-gold">
                  {s.value}
                </div>
                <div className="text-sm text-primary-foreground/70 font-cabinet mt-1">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need, In One Place
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Royal Infrastructure brings together all aspects of real estate
              and construction into a single, seamless platform.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((f) => {
              const Icon = f.icon;
              const tabId = f.title.toLowerCase().includes("properties")
                ? "properties"
                : f.title.toLowerCase().includes("floor")
                  ? "floorplans"
                  : f.title.toLowerCase().includes("architecture")
                    ? "architecture"
                    : "estimator";
              return (
                <motion.div key={f.title} variants={itemVariants}>
                  <Card
                    className="card-hover cursor-pointer h-full border border-border/60 shadow-xs"
                    onClick={() => onTabChange(tabId)}
                  >
                    <CardContent className="p-6">
                      <div
                        className={`inline-flex p-3 rounded-xl mb-4 ${f.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                        {f.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {f.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Sample property showcase */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Properties
            </h2>
            <p className="text-muted-foreground text-lg">
              Hand-picked listings across India's top cities
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                img: "/assets/generated/property-residential-1.dim_800x500.jpg",
                title: "3BHK Modern Villa",
                location: "Whitefield, Bangalore",
                price: "₹1.2 Cr",
                type: "Residential",
                badge: "For Sale",
              },
              {
                img: "/assets/generated/property-luxury-villa.dim_800x500.jpg",
                title: "Luxury Pool Villa",
                location: "Koregaon Park, Pune",
                price: "₹3.8 Cr",
                type: "Residential",
                badge: "Premium",
              },
              {
                img: "/assets/generated/property-commercial.dim_800x500.jpg",
                title: "Grade A Office Space",
                location: "BKC, Mumbai",
                price: "₹2.5 Cr",
                type: "Commercial",
                badge: "Investment",
              },
            ].map((p) => (
              <motion.div key={p.title} variants={itemVariants}>
                <Card
                  className="card-hover cursor-pointer overflow-hidden border border-border/60 shadow-xs"
                  onClick={() => onTabChange("properties")}
                >
                  <div className="relative">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">
                      {p.badge}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-semibold text-foreground text-base">
                          {p.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {p.location}
                        </p>
                      </div>
                      <span className="font-display font-bold text-primary text-base whitespace-nowrap">
                        {p.price}
                      </span>
                    </div>
                    <Badge variant="outline" className="mt-3 text-xs">
                      {p.type}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Button
              size="lg"
              onClick={() => onTabChange("properties")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-5 bg-primary/10 text-primary border-primary/20 font-cabinet text-xs uppercase tracking-wide">
                Why Royal Infrastructure
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Trusted by Thousands of
                <br />
                Home Buyers & Builders
              </h2>
              <div className="space-y-3">
                {whyChoose.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-5"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Shield,
                  label: "Verified & Secure",
                  desc: "100% verified listings",
                },
                {
                  icon: TrendingUp,
                  label: "Market Insights",
                  desc: "Live price trends",
                },
                {
                  icon: Users,
                  label: "Expert Network",
                  desc: "500+ professionals",
                },
                {
                  icon: Award,
                  label: "Award Winning",
                  desc: "Best PropTech 2024",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.label} variants={itemVariants}>
                    <Card className="border border-border/60 shadow-xs">
                      <CardContent className="p-5">
                        <div className="p-2.5 bg-primary/10 text-primary inline-flex rounded-lg mb-3">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="font-display text-sm font-semibold text-foreground">
                          {item.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.desc}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-primary-foreground/70 text-lg">
              Real experiences from real customers
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={itemVariants}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex gap-1 mb-4">
                    {"★"
                      .repeat(t.rating)
                      .split("")
                      .map((star, i) => (
                        <span
                          key={`star-${String(i)}`}
                          className="text-gold text-base"
                        >
                          {star}
                        </span>
                      ))}
                  </div>
                  <p className="text-primary-foreground/90 text-sm leading-relaxed mb-5">
                    "{t.quote}"
                  </p>
                  <div>
                    <div className="font-display font-semibold text-primary-foreground text-sm">
                      {t.name}
                    </div>
                    <div className="text-xs text-primary-foreground/60 mt-0.5">
                      {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of satisfied clients who found their perfect
              property through Royal Infrastructure and Solution.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onTabChange("properties")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10"
              >
                Explore Properties
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onTabChange("estimator")}
                className="px-10"
              >
                Estimate Construction Cost
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
