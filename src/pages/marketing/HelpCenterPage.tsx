import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { R } from "@/routes/routeMap";
import { Search, Book, MessageSquare, FileText, Video, Users } from "lucide-react";

const helpCategories = [
  {
    icon: Book,
    title: "Getting Started",
    description: "Learn the basics of FireBuild.ai",
    articles: 12
  },
  {
    icon: FileText,
    title: "Estimates & Invoices",
    description: "Managing quotes and billing",
    articles: 24
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Adding and managing team members",
    articles: 8
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    articles: 15
  }
];

const popularArticles = [
  "How to create your first estimate",
  "Setting up automatic invoicing",
  "Managing work orders and crews",
  "Integrating with QuickBooks",
  "Mobile app setup guide"
];

export const HelpCenterPage = () => {
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
              <Link to={R.contact}>
                <Button variant="ghost">Contact</Button>
              </Link>
              <Link to={R.login}>
                <Button>Login</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="py-20 text-center bg-primary/5">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            How Can We Help?
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Search our knowledge base or browse categories below
          </p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search for articles..." 
              className="pl-10 pr-4 py-6 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="p-6 hover-scale cursor-pointer">
                <category.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                <p className="text-sm text-primary">{category.articles} articles →</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Articles</h2>
          <div className="max-w-3xl mx-auto">
            <Card className="p-6">
              <ul className="space-y-4">
                {popularArticles.map((article, index) => (
                  <li key={index} className="flex items-center justify-between p-3 hover:bg-primary/5 rounded-lg cursor-pointer">
                    <span>{article}</span>
                    <span className="text-primary">→</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our support team is here to assist you
          </p>
          <div className="flex gap-4 justify-center">
            <Link to={R.contact}>
              <Button size="lg" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </Link>
            <Button size="lg">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Live Chat
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};