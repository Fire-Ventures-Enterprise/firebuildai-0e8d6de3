import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { R } from "@/routes/routeMap";

interface MarketingLayoutProps {
  children: ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-12">
              <Link to="/" className="flex items-center py-2">
                <Logo width={220} height={62} />
              </Link>
              
              <nav className="hidden lg:flex items-center gap-8">
                <Link to="/#features" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link to="/#trades" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Industries
                </Link>
                <Link to="/tutorials" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Tutorials
                </Link>
                <Link to="/#testimonials" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Testimonials
                </Link>
                <Link to="/#pricing" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden sm:inline-flex"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              
              <Link to={R.login}>
                <Button variant="ghost" size="lg" className="hidden sm:inline-flex text-base">
                  Sign In
                </Button>
              </Link>
              <Link to={R.signup}>
                <Button size="lg" className="text-base px-6 bg-gradient-primary hover:opacity-90 shadow-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      {children}

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo />
              </div>
              <p className="text-sm text-muted-foreground">
                The all-in-one platform for modern contractors.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to={R.tutorials} className="hover:text-foreground transition-colors">Tutorials</Link></li>
                <li><Link to={R.download} className="hover:text-foreground transition-colors">Download</Link></li>
                <li><Link to={R.api} className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to={R.about} className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to={R.blog} className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to={R.careers} className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to={R.contact} className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to={R.helpCenter} className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to={R.documentation} className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link to={R.status} className="hover:text-foreground transition-colors">Status</Link></li>
                <li><Link to={R.terms} className="hover:text-foreground transition-colors">Terms & Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 FireBuild. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}