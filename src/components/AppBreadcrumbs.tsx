import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { R, getBreadcrumbPath } from '@/routes/routeMap';

export function AppBreadcrumbs() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbPath(location.pathname);

  // Don't show breadcrumbs on dashboard
  if (location.pathname === R.dashboard) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-1 text-sm text-muted-foreground">
        <li>
          <Link
            to={R.dashboard}
            className="flex items-center hover:text-foreground transition-colors"
            aria-label="Dashboard"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1" />
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}