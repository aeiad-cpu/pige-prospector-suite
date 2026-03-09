import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Filter } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const CartePage = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Carte des Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">Visualisation géolocalisée des biens</p>
      </div>

      <div className="grid grid-cols-[240px_1fr] gap-4 h-[calc(100vh-180px)]">
        {/* Sidebar Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-foreground mb-4">
              Filtres
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-display mb-2">Chaleur</p>
                <div className="space-y-1">
                  <button className="w-full text-left text-xs p-2 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-2">
                    <span className="h-2 w-2 bg-destructive rounded-full" />
                    Chaud (23)
                  </button>
                  <button className="w-full text-left text-xs p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary rounded-full" />
                    Tiède (45)
                  </button>
                  <button className="w-full text-left text-xs p-2 rounded-md bg-info/10 text-info hover:bg-info/20 transition-colors flex items-center gap-2">
                    <span className="h-2 w-2 bg-info rounded-full" />
                    Froid (89)
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-display mb-2">Type</p>
                <div className="space-y-1">
                  <Badge variant="secondary" className="cursor-pointer text-xs w-full justify-start">Maison</Badge>
                  <Badge variant="secondary" className="cursor-pointer text-xs w-full justify-start">Appartement</Badge>
                  <Badge variant="secondary" className="cursor-pointer text-xs w-full justify-start">Terrain</Badge>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-display mb-2">Source</p>
                <div className="space-y-1">
                  <Badge variant="default" className="cursor-pointer text-xs w-full justify-start">Leboncoin</Badge>
                  <Badge variant="info" className="cursor-pointer text-xs w-full justify-start">PAP</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className="bg-card border-border overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="flex items-center gap-2">
                <MapIcon className="h-4 w-4 text-primary" />
                <span className="font-display text-xs uppercase tracking-wider text-foreground font-bold">
                  157 biens géolocalisés
                </span>
              </div>
              <Button variant="outline" size="sm" className="text-xs font-display uppercase gap-1">
                <Filter className="h-3 w-3" />
                Zone
              </Button>
            </div>
            <div className="flex-1 bg-muted/30 flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="h-16 w-16 text-muted-foreground mx-auto mb-3" />
                <p className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                  Intégration carte Leaflet
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">Connectez votre clé API pour activer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CartePage;
