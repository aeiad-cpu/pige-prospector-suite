import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Phone, CalendarCheck, TrendingUp, Plus, User } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const teamMembers = [
  { name: "Marc Dupont", role: "Agent Senior", calls: 142, rdv: 12, mandats: 4, status: "En ligne" },
  { name: "Sarah Leblanc", role: "Agent Junior", calls: 87, rdv: 6, mandats: 2, status: "En ligne" },
  { name: "Paul Renard", role: "Téléprospecteur", calls: 234, rdv: 18, mandats: 0, status: "Absent" },
  { name: "Julie Martin", role: "Agent", calls: 112, rdv: 9, mandats: 3, status: "En appel" },
];

const Equipe = () => {
  return (
    <AppLayout>
      <div className="relative opacity-50 pointer-events-none select-none">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Équipe & Call Center</h1>
            <p className="text-sm text-muted-foreground mt-1">Gestion de l'équipe et performance</p>
          </div>
          <Button variant="attack" size="sm" className="gap-2 text-xs">
            <Plus className="h-3 w-3" />
            Ajouter un membre
          </Button>
        </div>

        {/* Team KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-foreground">575</p>
              <p className="text-[10px] text-muted-foreground uppercase font-display">Appels total</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-foreground">45</p>
              <p className="text-[10px] text-muted-foreground uppercase font-display">RDV fixés</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-foreground">9</p>
              <p className="text-[10px] text-muted-foreground uppercase font-display">Mandats</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-primary">7.8%</p>
              <p className="text-[10px] text-muted-foreground uppercase font-display">Taux conversion</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((m, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 bg-muted rounded-sm flex items-center justify-center shrink-0">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display font-bold text-sm text-foreground">{m.name}</h3>
                      <Badge
                        variant={m.status === "En ligne" ? "success" : m.status === "En appel" ? "default" : "secondary"}
                        className="text-[8px] font-display"
                      >
                        {m.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{m.role}</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-display font-bold text-foreground">{m.calls}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CalendarCheck className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-display font-bold text-foreground">{m.rdv}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-display font-bold text-foreground">{m.mandats}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call Center */}
        <Card className="bg-card border-border mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                  Centre d'appels partenaire
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Déléguez votre pige à un centre d'appels spécialisé</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs font-display uppercase">
                Configurer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Overlay label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/80 border border-border rounded-lg px-6 py-3 shadow-lg">
            <p className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">🔒 Fonctionnalité à venir</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Equipe;
