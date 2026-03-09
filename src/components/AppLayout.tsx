import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { MessageCircle } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      {/* Main area - offset by sidebar */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen transition-all duration-200">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      {/* FAB Chat */}
      <button className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-primary text-primary-foreground rounded-lg shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-colors">
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
