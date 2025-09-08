import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { R } from "@/routes/routeMap";
import { Shield, Lock } from "lucide-react";

export const TermsPrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to={R.home} className="text-2xl font-bold text-primary">
              FireBuild.ai
            </Link>
            <div className="flex items-center gap-4">
              <Link to={R.home}>
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to={R.login}>
                <Button>Login</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 gradient-text">Legal & Privacy</h1>
            <p className="text-xl text-muted-foreground">
              Your privacy and security are our top priorities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
              <p className="text-muted-foreground mb-4">
                Last updated: January 2024
              </p>
              <Button className="w-full">View Terms</Button>
            </Card>
            <Card className="p-6">
              <Lock className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
              <p className="text-muted-foreground mb-4">
                Last updated: January 2024
              </p>
              <Button className="w-full">View Privacy Policy</Button>
            </Card>
          </div>

          <Card className="p-8">
            <h3 className="text-xl font-semibold mb-4">Quick Summary</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>• We never sell your personal data</li>
              <li>• Your data is encrypted and secure</li>
              <li>• You can request data deletion at any time</li>
              <li>• We comply with GDPR and CCPA regulations</li>
              <li>• Regular security audits ensure data protection</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
};