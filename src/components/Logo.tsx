import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className = "", width = 140, height = 40 }: LogoProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className}`} style={{ width, height }} />
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
      className={className}
      style={{ 
        width: width ? `${width}px` : 'auto', 
        height: height ? `${height}px` : 'auto',
        objectFit: 'contain'
      }}
    />
  );
};