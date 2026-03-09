import { Search, Bell, CreditCard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card shrink-0">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un bien, vendeur, ville..."
          className="pl-10 bg-background border-border h-9 text-sm"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2 font-display uppercase text-xs tracking-wider">
          <CreditCard className="h-3.5 w-3.5" />
          Abonnement
        </Button>

        <button className="relative p-2 rounded-md hover:bg-accent transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="h-8 w-8 bg-muted rounded-sm flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-foreground">Marc Dupont</p>
            <p className="text-[10px] text-muted-foreground">Agent Senior</p>
          </div>
        </div>
      </div>
    </header>
  );
}
