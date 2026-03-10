import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Search, LayoutGrid, Columns3, RefreshCw, SlidersHorizontal,
  Phone, User, Clock, MapPin, Filter
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

type LeadStatus =
  | "prospect" | "auto_sent" | "no_response" | "callback" | "not_interested"
  | "rdv" | "no_show" | "offer_sent" | "negotiation" | "mandate" | "no_follow" | "excluded" | "sold";

interface Lead {
  id: number;
  name: string;
  property: string;
  ville: string;
  prix: string;
  source: "LBC" | "PAP" | "LC";
  status: LeadStatus;
  heat: "hot" | "warm" | "cold";
  lastContact?: string;
  hasPhone?: boolean;
}

const columns: { key: LeadStatus; label: string; dotColor: string; isNew?: boolean }[] = [
  { key: "prospect", label: "À Prospecter", dotColor: "bg-green-500" },
  { key: "auto_sent", label: "Message Auto Envoyé", dotColor: "bg-blue-500", isNew: true },
  { key: "no_response", label: "Pas de Réponse", dotColor: "bg-red-500" },
  { key: "callback", label: "Rappel Prévu", dotColor: "bg-orange-500" },
  { key: "not_interested", label: "Non Intéressé", dotColor: "bg-gray-400" },
  { key: "rdv", label: "RDV Prévu", dotColor: "bg-green-500" },
  { key: "no_show", label: "No-Show", dotColor: "bg-red-500" },
  { key: "offer_sent", label: "Offre Envoyée", dotColor: "bg-blue-500" },
  { key: "negotiation", label: "En Négociation", dotColor: "bg-orange-500" },
  { key: "mandate", label: "Mandat Signé", dotColor: "bg-violet-500" },
  { key: "no_follow", label: "Pas de Suite", dotColor: "bg-gray-400" },
  { key: "excluded", label: "Exclu", dotColor: "bg-gray-600" },
  { key: "sold", label: "Vendu", dotColor: "bg-emerald-700" },
];

const initialLeads: Lead[] = [
  { id: 1, name: "Jean-Marc Leblanc", property: "Maison 120m² jardin", ville: "Lyon", prix: "450 000 €", source: "LBC", status: "prospect", heat: "hot", hasPhone: true },
  { id: 2, name: "Sophie Martin", property: "T3 lumineux 65m²", ville: "Paris 11", prix: "520 000 €", source: "PAP", status: "prospect", heat: "hot", hasPhone: true },
  { id: 3, name: "Pierre Duval", property: "Villa piscine 200m²", ville: "Aix", prix: "890 000 €", source: "LBC", status: "prospect", heat: "cold" },
  { id: 4, name: "Marie Rousseau", property: "T2 rénové 42m²", ville: "Bordeaux", prix: "245 000 €", source: "LBC", status: "auto_sent", heat: "hot", hasPhone: true },
  { id: 5, name: "Laurent Petit", property: "Maison ville 150m²", ville: "Nantes", prix: "380 000 €", source: "PAP", status: "auto_sent", heat: "cold" },
  { id: 6, name: "Claire Bernard", property: "T4 terrasse 85m²", ville: "Marseille", prix: "310 000 €", source: "LBC", status: "no_response", heat: "cold" },
  { id: 7, name: "François Moreau", property: "Plain-pied 95m²", ville: "Toulouse", prix: "275 000 €", source: "PAP", status: "no_response", heat: "cold" },
  { id: 8, name: "Isabelle Leroy", property: "Duplex 110m²", ville: "Strasbourg", prix: "425 000 €", source: "LBC", status: "callback", heat: "hot", lastContact: "Rappel 14h", hasPhone: true },
  { id: 9, name: "Thomas Garcia", property: "Studio 28m²", ville: "Lille", prix: "145 000 €", source: "PAP", status: "callback", heat: "cold", lastContact: "Rappel demain" },
  { id: 10, name: "Anne Dubois", property: "T5 haussmannien", ville: "Paris 8", prix: "1 200 000 €", source: "LBC", status: "not_interested", heat: "cold" },
  { id: 11, name: "Marc Dupont", property: "Loft 180m²", ville: "Lyon 6", prix: "780 000 €", source: "LC", status: "rdv", heat: "hot", hasPhone: true },
  { id: 12, name: "Julie Favre", property: "T3 balcon 72m²", ville: "Nice", prix: "395 000 €", source: "LBC", status: "negotiation", heat: "warm", hasPhone: true },
];

const Pipeline = () => {
  const [leads] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [heatFilter, setHeatFilter] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [phoneFilter, setPhoneFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "grid">("kanban");

  const filteredLeads = leads.filter((lead) => {
    if (heatFilter && lead.heat !== heatFilter) return false;
    if (sourceFilter && lead.source !== sourceFilter) return false;
    if (phoneFilter === "has" && !lead.hasPhone) return false;
    if (phoneFilter === "no" && lead.hasPhone) return false;
    if (searchQuery && !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) && !lead.property.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const hotCount = leads.filter(l => l.heat === "hot").length;
  const warmCount = leads.filter(l => l.heat === "warm").length;
  const coldCount = leads.filter(l => l.heat === "cold").length;
  const phoneCount = leads.filter(l => l.hasPhone).length;
  const noPhoneCount = leads.filter(l => !l.hasPhone).length;
  const lbcCount = leads.filter(l => l.source === "LBC").length;
  const lcCount = leads.filter(l => l.source === "LC").length;

  const toggleFilter = (type: "heat" | "source" | "phone", value: string) => {
    if (type === "heat") setHeatFilter(prev => prev === value ? null : value);
    if (type === "source") setSourceFilter(prev => prev === value ? null : value);
    if (type === "phone") setPhoneFilter(prev => prev === value ? null : value);
  };

  const activeFilters = [heatFilter, sourceFilter, phoneFilter].filter(Boolean).length;

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Pipeline des Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredLeads.length} annonces filtrées
          </p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "kanban" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-3 text-xs font-display uppercase"
            onClick={() => setViewMode("kanban")}
          >
            <Columns3 className="h-3.5 w-3.5 mr-1.5" />
            Kanban
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-3 text-xs font-display uppercase"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
            Grille
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-display uppercase">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Synchroniser
          </Button>
        </div>
      </div>

      {/* Filter Bar - Row 1 */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <div className="relative w-52">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8 h-8 text-xs bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select>
          <SelectTrigger className="w-[130px] h-8 text-xs bg-card border-border">
            <SelectValue placeholder="Tous les leads" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les leads</SelectItem>
            <SelectItem value="new">Nouveaux</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[130px] h-8 text-xs bg-card border-border">
            <SelectValue placeholder="Tous les agents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les agents</SelectItem>
            <SelectItem value="me">Mes leads</SelectItem>
          </SelectContent>
        </Select>

        <Badge variant="outline" className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted">
          Non attribué (0)
        </Badge>

        <Select>
          <SelectTrigger className="w-[130px] h-8 text-xs bg-card border-border">
            <SelectValue placeholder="Plus récentes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récentes</SelectItem>
            <SelectItem value="oldest">Plus anciennes</SelectItem>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
            <SelectItem value="price-desc">Prix décroissant</SelectItem>
          </SelectContent>
        </Select>

        <div className="h-5 w-px bg-border mx-1" />

        <Badge variant="outline" className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted">
          <SlidersHorizontal className="h-3 w-3 mr-1" />
          Filtres
        </Badge>

        <Badge
          variant={phoneFilter === "has" ? "success" : "outline"}
          className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted"
          onClick={() => toggleFilter("phone", "has")}
        >
          <Phone className="h-3 w-3 mr-1" />
          Tél ({phoneCount})
        </Badge>

        <Badge
          variant={phoneFilter === "no" ? "secondary" : "outline"}
          className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted"
          onClick={() => toggleFilter("phone", "no")}
        >
          Sans tél ({noPhoneCount})
        </Badge>

        <Badge variant="default" className="h-7 text-[10px] font-display cursor-pointer">
          Republication (0)
        </Badge>

        <Badge variant="outline" className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted">
          Multi-plateforme (0)
        </Badge>

        <Badge
          variant={heatFilter === "hot" ? "hot" : "outline"}
          className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted"
          onClick={() => toggleFilter("heat", "hot")}
        >
          🔥 Chauds ({hotCount})
        </Badge>
      </div>

      {/* Filter Bar - Row 2 */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Badge
          variant={heatFilter === "warm" ? "hot" : "outline"}
          className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted"
          onClick={() => toggleFilter("heat", "warm")}
        >
          Tièdes ({warmCount})
        </Badge>

        <Badge
          variant={heatFilter === "cold" ? "cold" : "outline"}
          className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted"
          onClick={() => toggleFilter("heat", "cold")}
        >
          ❄️ Froids ({coldCount})
        </Badge>

        <Badge
          variant={sourceFilter === "LBC" ? "default" : "outline"}
          className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted"
          onClick={() => toggleFilter("source", "LBC")}
        >
          Leboncoin ({lbcCount})
        </Badge>

        <Badge
          variant={sourceFilter === "LC" ? "default" : "outline"}
          className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted"
          onClick={() => toggleFilter("source", "LC")}
        >
          La Centrale ({lcCount})
        </Badge>

        <Badge variant="outline" className="h-7 text-[10px] font-display cursor-pointer border-primary/50 text-primary hover:bg-primary/10">
          <MapPin className="h-3 w-3 mr-1" />
          Renseignez votre adresse pour filtrer par distance
        </Badge>

        <Select>
          <SelectTrigger className="w-[140px] h-8 text-xs bg-card border-border">
            <SelectValue placeholder="Toutes parutions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes parutions</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
          </SelectContent>
        </Select>

        {activeFilters > 0 && (
          <Badge variant="default" className="h-7 text-[10px] font-display">
            <Filter className="h-3 w-3 mr-1" />
            {activeFilters} filtre{activeFilters > 1 ? "s" : ""} actif{activeFilters > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Kanban Board */}
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-4" style={{ minWidth: columns.length * 200 }}>
          {columns.map((col) => {
            const colLeads = filteredLeads.filter((l) => l.status === col.key);
            return (
              <div key={col.key} className="w-[200px] shrink-0">
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${col.dotColor}`} />
                  <h3 className="font-display text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                    {col.label}
                  </h3>
                  {col.isNew && (
                    <Badge variant="info" className="text-[8px] h-4 px-1.5 font-display shrink-0">
                      NOUVEAU
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-[10px] font-display h-5 min-w-[20px] flex items-center justify-center ml-auto shrink-0">
                    {colLeads.length}
                  </Badge>
                </div>

                {/* Column Content */}
                <div className="space-y-2 min-h-[300px]">
                  {colLeads.length === 0 ? (
                    <div className="border border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center">
                      <p className="font-display text-3xl font-bold text-muted-foreground/30 mb-1">0</p>
                      <p className="font-display text-[10px] uppercase tracking-wider text-muted-foreground text-center">
                        Aucun lead
                      </p>
                      <p className="text-[9px] text-muted-foreground/60 mt-1">
                        Déposez un lead ici
                      </p>
                    </div>
                  ) : (
                    colLeads.map((lead) => (
                      <Card key={lead.id} className="bg-card border-border hover:border-primary/40 transition-colors cursor-pointer group">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="h-7 w-7 bg-muted rounded-sm flex items-center justify-center shrink-0">
                                <User className="h-3 w-3 text-muted-foreground" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-foreground truncate">{lead.name}</p>
                                <p className="text-[10px] text-muted-foreground">{lead.ville}</p>
                              </div>
                            </div>
                            <Badge variant={lead.source === "LBC" ? "default" : lead.source === "LC" ? "violet" : "info"} className="text-[8px] h-4 font-display shrink-0">
                              {lead.source}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-foreground mb-1 truncate">{lead.property}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-display font-bold text-foreground">{lead.prix}</p>
                            <div className="flex items-center gap-1">
                              {lead.hasPhone && <Phone className="h-3 w-3 text-success" />}
                              <Badge variant={lead.heat === "hot" ? "hot" : lead.heat === "warm" ? "default" : "cold"} className="text-[8px] h-4">
                                {lead.heat === "hot" ? "🔥" : lead.heat === "warm" ? "🌤" : "❄️"}
                              </Badge>
                            </div>
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </AppLayout>
  );
};

export default Pipeline;
