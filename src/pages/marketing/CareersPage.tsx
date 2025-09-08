import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { R } from "@/routes/routeMap";
import { MapPin, Clock, DollarSign, Users } from "lucide-react";

const jobOpenings = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $160k",
    description: "Join our engineering team to build the future of construction management software."
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    salary: "$110k - $140k",
    description: "Lead product strategy and development for our contractor management platform."
  },
  {
    id: 3,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    salary: "$70k - $90k",
    description: "Help construction businesses succeed with our platform through onboarding and support."
  }
];

export const CareersPage = () => {
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
              <Link to={R.about}>
                <Button variant="ghost">About</Button>
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
            Join Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us revolutionize the construction industry with innovative technology
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Work With Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Innovation First</h3>
              <p className="text-muted-foreground">
                Work with cutting-edge technology to solve real-world construction challenges
              </p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Remote Friendly</h3>
              <p className="text-muted-foreground">
                Flexible work arrangements with a distributed team across the globe
              </p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Growth Opportunities</h3>
              <p className="text-muted-foreground">
                Continuous learning and career development in a fast-growing company
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          <div className="grid gap-6 max-w-4xl mx-auto">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="p-6 hover-scale">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{job.description}</p>
                <Button>Apply Now</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We're always looking for talented individuals to join our team
          </p>
          <Button size="lg">Send Your Resume</Button>
        </div>
      </section>
    </div>
  );
};