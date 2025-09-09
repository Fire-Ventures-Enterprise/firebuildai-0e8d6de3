import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { getLogoUrl } from "@/config/branding.config";
import { useCompanySettings } from "@/hooks/useCompanySettings";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className = "", width, height }: LogoProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { settings } = useCompanySettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className={`bg-muted animate-pulse rounded ${className}`} 
        style={{ 
          width: width || 180, 
          height: height || 50,
          minWidth: width || 180,
          minHeight: height || 50
        }} 
      />
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  
  // Use dynamic logo URL from configuration
  const logoSrc = getLogoUrl(
    currentTheme === "dark" ? 'dark' : 'light',
    settings?.logo_url
  );
  
  // Get company name dynamically
  const companyName = settings?.company_name || 'Company Logo';

  return (
    <img 
      src={logoSrc} 
      alt={companyName}
      className={`${className} object-contain`}
      style={{ 
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        display: 'block'
      }}
      onError={(e) => {
        console.error('Logo failed to load:', logoSrc);
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};