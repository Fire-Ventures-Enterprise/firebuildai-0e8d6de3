import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { R } from "@/routes/routeMap";
import { Code, Key, Shield, Zap } from "lucide-react";

export const ApiDocsPage = () => {
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
              <Link to={R.documentation}>
                <Button variant="ghost">Documentation</Button>
              </Link>
              <Link to={R.login}>
                <Button>Login</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            FireBuild API
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Integrate FireBuild.ai into your existing workflow with our powerful REST API
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <Code className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">RESTful API</h3>
              <p className="text-sm text-muted-foreground">
                Simple and intuitive REST endpoints
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Secure</h3>
              <p className="text-sm text-muted-foreground">
                OAuth 2.0 authentication & encryption
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fast</h3>
              <p className="text-sm text-muted-foreground">
                Low latency with 99.9% uptime
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Key className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Simple key management system
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Core Endpoints</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded">GET</span>
                    <code className="text-sm font-mono">/api/v1/jobs</code>
                  </div>
                  <p className="text-muted-foreground">List all jobs with filtering and pagination</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-600 text-xs font-medium rounded">POST</span>
                    <code className="text-sm font-mono">/api/v1/estimates</code>
                  </div>
                  <p className="text-muted-foreground">Create a new estimate</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 text-xs font-medium rounded">PUT</span>
                    <code className="text-sm font-mono">/api/v1/invoices/:id</code>
                  </div>
                  <p className="text-muted-foreground">Update invoice details</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-red-500/10 text-red-600 text-xs font-medium rounded">DELETE</span>
                    <code className="text-sm font-mono">/api/v1/work-orders/:id</code>
                  </div>
                  <p className="text-muted-foreground">Delete a work order</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get your API key and start building today
          </p>
          <div className="flex gap-4 justify-center">
            <Link to={R.signup}>
              <Button size="lg">Get API Key</Button>
            </Link>
            <Button size="lg" variant="outline">View Full Documentation</Button>
          </div>
        </div>
      </section>
    </div>
  );
};