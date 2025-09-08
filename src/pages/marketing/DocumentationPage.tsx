import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { R } from "@/routes/routeMap";
import { Book, Code, Settings, Shield, Zap, Database } from "lucide-react";

const docSections = [
  {
    icon: Book,
    title: "Quick Start Guide",
    description: "Get up and running with FireBuild.ai in minutes",
    link: "#quickstart"
  },
  {
    icon: Code,
    title: "API Reference",
    description: "Complete API documentation with examples",
    link: R.api
  },
  {
    icon: Settings,
    title: "Configuration",
    description: "Customize FireBuild.ai for your business",
    link: "#config"
  },
  {
    icon: Shield,
    title: "Security",
    description: "Security best practices and compliance",
    link: "#security"
  },
  {
    icon: Database,
    title: "Integrations",
    description: "Connect with your existing tools",
    link: "#integrations"
  },
  {
    icon: Zap,
    title: "Webhooks",
    description: "Real-time event notifications",
    link: "#webhooks"
  }
];

export const DocumentationPage = () => {
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
              <Link to={R.api}>
                <Button variant="ghost">API</Button>
              </Link>
              <Link to={R.helpCenter}>
                <Button variant="ghost">Help</Button>
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
            Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know to build and integrate with FireBuild.ai
          </p>
        </div>
      </section>

      {/* Documentation Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {docSections.map((section, index) => (
              <Card key={index} className="p-6 hover-scale cursor-pointer">
                <section.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                <p className="text-muted-foreground mb-4">{section.description}</p>
                <Link to={section.link} className="text-primary hover:underline">
                  Learn more →
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Example</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 bg-background">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Creating an Estimate</h3>
                <p className="text-muted-foreground">Use our API to create estimates programmatically</p>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">
{`const estimate = await fetch('https://api.firebuildai.com/v1/estimates', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customer_id: 'cust_123',
    items: [
      { description: 'Kitchen Renovation', amount: 15000 },
      { description: 'Bathroom Remodel', amount: 8000 }
    ],
    valid_until: '2024-12-31'
  })
});

const result = await estimate.json();
console.log('Estimate created:', result.id);`}
                </code>
              </pre>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Additional Resources</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={R.tutorials}>
              <Button variant="outline" size="lg">Video Tutorials</Button>
            </Link>
            <Link to={R.blog}>
              <Button variant="outline" size="lg">Developer Blog</Button>
            </Link>
            <Link to={R.helpCenter}>
              <Button variant="outline" size="lg">Support Center</Button>
            </Link>
            <Button variant="outline" size="lg">Download SDK</Button>
          </div>
        </div>
      </section>
    </div>
  );
};