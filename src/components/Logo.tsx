import { useEffect, useState } from "react";
import { getLogoUrl } from "@/config/branding.config";
import { useCompanySettings } from "@/hooks/useCompanySettings";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className = "", width, height }: LogoProps) => {
  const [mounted, setMounted] = useState(false);
  const { settings } = useCompanySettings();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for dark mode using document root class or media query
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                     window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);
    
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  if (!mounted) {
    return (
      <div 
        className={`bg-muted animate-pulse rounded ${className}`} 
        style={{ 
          width: width || 200, 
          height: height || 60,
          minWidth: width || 200,
          minHeight: height || 60
        }} 
      />
    );
  }
  
  // Use dynamic logo URL from configuration
  const logoSrc = getLogoUrl(
    isDarkMode ? 'dark' : 'light',
    settings?.logo_url
  );
  
  // Get company name dynamically
  const companyName = settings?.company_name || 'FireBuild.ai';

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoSrc} 
        alt={companyName}
        className="h-full w-auto object-contain"
        style={{ 
          maxHeight: height ? `${height}px` : '60px',
          minHeight: '32px'
        }}
        onError={(e) => {
          // Fallback to text if logo fails to load
          e.currentTarget.style.display = 'none';
          const textFallback = document.createElement('span');
          textFallback.className = 'text-2xl font-bold text-foreground';
          textFallback.textContent = companyName;
          e.currentTarget.parentElement?.appendChild(textFallback);
        }}
      />
    </div>
  );
};