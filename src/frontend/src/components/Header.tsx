import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, Crown, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navLinks = [
  { id: "home", label: "Home" },
  { id: "properties", label: "Properties", ocid: "nav.properties_link" },
  { id: "floorplans", label: "Floor Plans", ocid: "nav.floorplans_link" },
  { id: "architecture", label: "Architecture", ocid: "nav.architecture_link" },
  { id: "estimator", label: "Cost Estimator", ocid: "nav.estimator_link" },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
    : "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/95 backdrop-blur-md shadow-xs">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onTabChange("home")}
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:shadow-md transition-shadow">
            <Crown className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-sm font-800 leading-tight text-foreground">
              Royal Infrastructure
            </div>
            <div className="font-cabinet text-[10px] text-muted-foreground tracking-wide uppercase">
              & Solution
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              data-ocid={link.ocid}
              onClick={() => onTabChange(link.id)}
              className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === link.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Auth + mobile toggle */}
        <div className="flex items-center gap-3">
          {identity ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/15 transition-colors"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {shortPrincipal.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-xs font-medium text-foreground">
                    {shortPrincipal}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={clear}
                  className="text-destructive focus:text-destructive"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              data-ocid="nav.login_button"
              size="sm"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              {isLoggingIn ? "Connecting..." : "Login"}
            </Button>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-muted/60 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-card py-3 px-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              data-ocid={link.ocid}
              onClick={() => {
                onTabChange(link.id);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors mb-1 ${
                activeTab === link.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export { Building2 };
