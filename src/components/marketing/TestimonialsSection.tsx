import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Mike Johnson",
    company: "Johnson Electric LLC",
    role: "Owner",
    content: "FireBuild transformed how we run our electrical business. We're closing 30% more jobs and getting paid twice as fast. The mobile app is a game-changer for our field techs.",
    rating: 5,
    initials: "MJ",
  },
  {
    name: "Sarah Martinez",
    company: "Martinez Plumbing & HVAC",
    role: "Operations Manager",
    content: "Finally, software that understands contractors! Creating estimates takes minutes instead of hours. Our customers love the professional proposals.",
    rating: 5,
    initials: "SM",
  },
  {
    name: "David Chen",
    company: "Premier Construction Group",
    role: "General Contractor",
    content: "Managing 15+ subs used to be a nightmare. Now everything is in one place - schedules, documents, invoices. We've cut admin time by 70%.",
    rating: 5,
    initials: "DC",
  },
  {
    name: "Tom Wilson",
    company: "Wilson Roofing",
    role: "Founder",
    content: "The ROI was immediate. We're tracking job costs in real-time and our profit margins have increased by 25%. Best investment we've made.",
    rating: 5,
    initials: "TW",
  },
  {
    name: "Lisa Anderson",
    company: "Green Thumb Landscaping",
    role: "CEO",
    content: "Our crews love how easy it is to use. Time tracking, photo uploads, customer signatures - everything syncs perfectly. Customer satisfaction is at an all-time high.",
    rating: 5,
    initials: "LA",
  },
  {
    name: "Robert Taylor",
    company: "Taylor Custom Homes",
    role: "Project Manager",
    content: "We've built over 200 homes using FireBuild. The project tracking and client portal features keep everyone on the same page. Couldn't imagine going back.",
    rating: 5,
    initials: "RT",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Contractors Love FireBuild
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of contractors who've transformed their business with FireBuild
          </p>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-primary text-primary" />
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-card relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
              
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-primary">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-muted-foreground italic">
                "{testimonial.content}"
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};