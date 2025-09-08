import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { R } from "@/routes/routeMap";
import { Calendar, Clock, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Efficient Job Scheduling in Construction",
    excerpt: "Learn how to optimize your construction project scheduling with these proven strategies.",
    author: "John Smith",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Scheduling"
  },
  {
    id: 2,
    title: "Digital Transformation in the Construction Industry",
    excerpt: "Discover how digital tools are revolutionizing contractor management and project delivery.",
    author: "Sarah Johnson",
    date: "2024-01-10",
    readTime: "7 min read",
    category: "Technology"
  },
  {
    id: 3,
    title: "Managing Cash Flow for Construction Businesses",
    excerpt: "Essential strategies for maintaining healthy cash flow in your contracting business.",
    author: "Mike Davis",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Finance"
  }
];

export const BlogPage = () => {
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
                <Button variant="outline">Login</Button>
              </Link>
              <Link to={R.signup}>
                <Button>Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            Construction Industry Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and best practices in construction management
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.id} className="p-6 hover-scale">
                <div className="mb-4">
                  <span className="text-sm text-primary font-medium">{post.category}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <Button className="mt-4 w-full" variant="outline">
                  Read More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Subscribe to our newsletter for construction industry insights
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};