import { Star, MessageSquare, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const reviews = [
  {
    id: 1,
    platform: "Google Review",
    rating: 5,
    content: "Excellent work on our kitchen renovation. Very professional team!",
    time: "Today",
  },
  {
    id: 2,
    platform: "Facebook Review",
    rating: 5,
    content: "Fast service and great communication throughout the project.",
    time: "Yesterday",
  },
];

export const ReviewsCard = () => {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Recent Reviews Generated
          </CardTitle>
          <p className="text-sm text-muted-foreground">Latest customer feedback collected</p>
        </div>
        <Button variant="outline" size="sm">
          View All Reviews
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">{review.platform}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                  ))}
                </div>
                <Badge variant="outline" className="text-xs">
                  {review.time}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">"{review.content}"</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};