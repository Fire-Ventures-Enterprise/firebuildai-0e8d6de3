import { MVPAppSidebar } from '@/components/navigation/MVPAppSidebar';

export function MVPAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <MVPAppSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}