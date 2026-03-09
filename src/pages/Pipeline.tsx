import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, List, GripVertical, Phone, Clock, User } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

type LeadStatus = "prospect" | "auto_sent" | "no_response" | "callback" | "not_interested";

interface Lead {
  id: number;
  name: string;
  property: string;
  ville: string;
  prix: string;
  source: "LBC" | "PAP";
  status: LeadStatus;
  heat: "hot" | "cold";
  lastContact?: string;
}

const columns: { key: LeadStatus; label: string; color: string }[] = [
  { key: "prospect", label: "À Prospecter", color: "info" },
  { key: "auto_sent", label: "Message Auto Envoyé", color: "violet" },
  { key: "no_response", label: "Pas de Réponse", color: "secondary" },
  { key: "callback", label: "Rappel Prévu", color: "default" },
  { key: "not_interested", label: "Non Intéressé", color: "destructive" },
];

const initialLeads: Lead[] = [
  { id: 1, name: "Jean-Marc Leblanc", property: "Maison 120m² jardin", ville: "Lyon", prix: "450 000 €", source: "LBC", status: "prospect", heat: "hot" },
  { id: 2, name: "Sophie Martin", property: "T3 lumineux 65m²", ville: "Paris 11", prix: "520 000 €", source: "PAP", status: "prospect", heat: "hot" },
  { id: 3, name: "Pierre Duval", property: "Villa piscine 200m²", ville: "Aix", prix: "890 000 €", source: "LBC", status: "prospect", heat: "cold" },
  { id: 4, name: "Marie Rousseau", property: "T2 rénové 42m²", ville: "Bordeaux", prix: "245 000 €", source: "LBC", status: "auto_sent", heat: "hot" },
  { id: 5, name: "Laurent Petit", property: "Maison ville 150m²", ville: "Nantes", prix: "380 000 €", source: "PAP", status: "auto_sent", heat: "cold" },
  { id: 6, name: "Claire Bernard", property: "T4 terrasse 85m²", ville: "Marseille", prix: "310 000 €", source: "LBC", status: "no_response", heat: "cold" },
  { id: 7, name: "François Moreau", property: "Plain-pied 95m²", ville: "Toulouse", prix: "275 000 €", source: "PAP", status: "no_response", heat: "cold" },
  { id: 8, name: "Isabelle Leroy", property: "Duplex 110m²", ville: "Strasbourg", prix: "425 000 €", source: "LBC", status: "callback", heat: "hot", lastContact: "Rappel 14h" },
  { id: 9, name: "Thomas Garcia", property: "Studio 28m²", ville: "Lille", prix: "145 000 €", source: "PAP", status: "callback", heat: "cold", lastContact: "Rappel demain" },
  { id: 10, name: "Anne Dubois", property: "T5 haussmannien", ville: "Paris 8", prix: "1 200 000 €", source: "LBC", status: "not_interested", heat: "cold" },
];

const Pipeline = () => {
  const [leads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leads.filter((lead) => {
    if (filter === "hot" && lead.heat !== "hot") return false;
    if (filter === "cold" && lead.heat !== "cold") return false;
    if (filter === "LBC" && lead.source !== "LBC") return false;
    if (filter === "PAP" && lead.source !== "PAP") return false;
    if (searchQuery && !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) && !lead.property.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Pipeline des Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestion du cycle de prospection</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button variant={filter === null ? "default" : "outline"} size="sm" onClick={() => setFilter(null)} className="text-xs font-display uppercase">
            Tous
          </Button>
          <Button variant={filter === "LBC" ? "default" : "outline"} size="sm" onClick={() => setFilter("LBC")} className="text-xs font-display uppercase">
            LBC
          </Button>
          <Button variant={filter === "PAP" ? "default" : "outline"} size="sm" onClick={() => setFilter("PAP")} className="text-xs font-display uppercase">
            PAP
          </Button>
          <Badge variant="hot" className="cursor-pointer text-xs" onClick={() => setFilter(filter === "hot" ? null : "hot")}>
            🔥 Chaud
          </Badge>
          <Badge variant="cold" className="cursor-pointer text-xs" onClick={() => setFilter(filter === "cold" ? null : "cold")}>
            ❄️ Froid
          </Badge>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-10 h-9 text-sm bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-3 overflow-x-auto">
        {columns.map((col) => {
          const colLeads = filteredLeads.filter((l) => l.status === col.key);
          return (
            <div key={col.key} className="min-w-[220px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {col.label}
                </h3>
                <Badge variant="secondary" className="text-[10px] font-display h-5 min-w-[20px] flex items-center justify-center">
                  {colLeads.length}
                </Badge>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {colLeads.length === 0 ? (
                  <div className="border border-dashed border-border rounded-lg p-6 flex items-center justify-center">
                    <p className="font-display text-[10px] uppercase tracking-wider text-muted-foreground text-center">
                      Aucune donnée.
                      <br />
                      Vérifiez vos filtres.
                    </p>
                  </div>
                ) : (
                  colLeads.map((lead) => (
                    <Card key={lead.id} className="bg-card border-border hover:border-primary/40 transition-colors cursor-pointer group">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 bg-muted rounded-sm flex items-center justify-center shrink-0">
                              <User className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground">{lead.name}</p>
                              <p className="text-[10px] text-muted-foreground">{lead.ville}</p>
                            </div>
                          </div>
                          <Badge variant={lead.source === "LBC" ? "default" : "info"} className="text-[8px] h-4 font-display">
                            {lead.source}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-foreground mb-1">{lead.property}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-display font-bold text-foreground">{lead.prix}</p>
                          <Badge variant={lead.heat === "hot" ? "hot" : "cold"} className="text-[8px] h-4">
                            {lead.heat === "hot" ? "🔥" : "❄️"}
                          </Badge>
                        </div>
                        {lead.lastContact && (
                          <div className="flex items-center gap-1 mt-2 text-[10px] text-primary">
                            <Clock className="h-3 w-3" />
                            {lead.lastContact}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Pipeline;
