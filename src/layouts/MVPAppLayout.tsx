import { MVPAppSidebar } from '@/components/navigation/MVPAppSidebar';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';

export function MVPAppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden">
      <MVPAppSidebar />
      <main className={cn(
        "flex-1 overflow-y-auto bg-background",
        isMobile ? "pb-16" : "" // Add padding for mobile bottom nav
      )}>
        {/* Mobile Header with logo */}
        <div className="lg:hidden sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center h-14 px-4 pl-14">
            <Logo width={120} height={35} />
          </div>
        </div>
        
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
}