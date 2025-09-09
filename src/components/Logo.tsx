import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className = "", width, height }: LogoProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
  const logoSrc = currentTheme === "dark" 
    ? "/lovable-uploads/467a434f-0eee-4143-bd64-3d716cce95b1.png" // Light logo for dark mode
    : "/lovable-uploads/6051e38e-b331-47c4-b218-10bea1030315.png"; // Dark logo for light mode

  return (
    <img 
      src={logoSrc} 
      alt="FireBuild.ai" 
      className={`${className} object-contain`}
      style={{ 
        width: width || 'auto',
        height: height || 'auto',
        maxWidth: '100%',
        display: 'block'
      }}
      onError={(e) => {
        console.error('Logo failed to load:', logoSrc);
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};