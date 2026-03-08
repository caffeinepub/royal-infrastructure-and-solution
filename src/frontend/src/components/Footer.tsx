import { Separator } from "@/components/ui/separator";
import { Crown, Heart, Mail, MapPin, Phone } from "lucide-react";

interface FooterProps {
  onTabChange: (tab: string) => void;
}

export function Footer({ onTabChange }: FooterProps) {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-navy-deep text-primary-foreground mt-auto">
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 bg-gold/20 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-gold" />
              </div>
              <div>
                <div className="font-display text-sm font-bold text-white">
                  Royal Infrastructure
                </div>
                <div className="font-cabinet text-[10px] text-primary-foreground/60 tracking-wide uppercase">
                  & Solution
                </div>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              India's complete real estate and infrastructure platform — from
              plotting to possession.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Buy / Sell Properties", tab: "properties" },
                { label: "Floor Plans", tab: "floorplans" },
                { label: "Architecture Projects", tab: "architecture" },
                { label: "Cost Estimator", tab: "estimator" },
              ].map((item) => (
                <li key={item.tab}>
                  <button
                    type="button"
                    onClick={() => onTabChange(item.tab)}
                    className="text-sm text-primary-foreground/60 hover:text-gold transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Property types */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-4">
              Property Types
            </h4>
            <ul className="space-y-2.5">
              {[
                "Residential Homes",
                "Commercial Spaces",
                "Plots & Land",
                "Luxury Villas",
                "Apartments",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-primary-foreground/60">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-primary-foreground/60">
                <MapPin className="h-4 w-4 mt-0.5 text-gold flex-shrink-0" />
                <span>
                  123 Infrastructure Tower, Koramangala, Bangalore — 560034
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-primary-foreground/60">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <span>+91 80 4000 5000</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-primary-foreground/60">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <span>hello@royalinfra.in</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/50">
          <span>
            © {year} Royal Infrastructure and Solution. All rights reserved.
          </span>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-gold transition-colors"
          >
            Built with{" "}
            <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" /> using
            <span className="font-medium text-primary-foreground/70">
              caffeine.ai
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
