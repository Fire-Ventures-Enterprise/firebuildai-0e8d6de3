import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle, ArrowLeft, Search } from "lucide-react";
import { R } from "@/routes/routeMap";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center space-y-6 p-8 bg-card rounded-lg shadow-card max-w-lg">
        <div className="flex justify-center">
          <div className="p-4 bg-destructive/10 rounded-full">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
          <p className="text-xl text-muted-foreground mb-4">Page Not Found</p>
          <p className="text-sm text-muted-foreground mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-xs text-muted-foreground">
            Requested path: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          {user ? (
            <>
              <Button asChild>
                <Link to={R.dashboard}>
                  <Home className="w-4 h-4 mr-2" />
                  Return to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={R.jobs}>
                  <Search className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild>
                <Link to={R.home}>
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={R.login}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            </>
          )}
        </div>
        
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Need help? <Link to={R.help} className="text-primary hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
