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

const columns: { key: LeadStatus; label: string; dotColor: string }[] = [
  { key: "prospect", label: "À Prospecter", dotColor: "bg-green-500" },
  { key: "auto_sent", label: "Message Auto Envoyé", dotColor: "bg-blue-500" },
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

// Only MY leads — assigned to me
const myLeads: Lead[] = [
  { id: 1, name: "Jean-Marc Leblanc", property: "Maison 120m² jardin", ville: "Lyon", prix: "450 000 €", source: "LBC", status: "callback", heat: "hot", hasPhone: true, lastContact: "Rappel 14h" },
  { id: 2, name: "Sophie Martin", property: "T3 lumineux 65m²", ville: "Paris 11", prix: "520 000 €", source: "PAP", status: "rdv", heat: "hot", hasPhone: true, lastContact: "RDV demain 10h" },
  { id: 4, name: "Marie Rousseau", property: "T2 rénové 42m²", ville: "Bordeaux", prix: "245 000 €", source: "LBC", status: "auto_sent", heat: "warm", hasPhone: true },
  { id: 8, name: "Isabelle Leroy", property: "Duplex 110m²", ville: "Strasbourg", prix: "425 000 €", source: "LBC", status: "negotiation", heat: "hot", lastContact: "Offre en cours", hasPhone: true },
  { id: 11, name: "Marc Dupont", property: "Loft 180m²", ville: "Lyon 6", prix: "780 000 €", source: "LC", status: "mandate", heat: "hot", hasPhone: true },
  { id: 12, name: "Julie Favre", property: "T3 balcon 72m²", ville: "Nice", prix: "395 000 €", source: "LBC", status: "prospect", heat: "warm", hasPhone: true },
  { id: 13, name: "Claire Bernard", property: "T4 terrasse 85m²", ville: "Marseille", prix: "310 000 €", source: "LBC", status: "rdv", heat: "hot", hasPhone: true, lastContact: "RDV 12/03 14h" },
];

const BaseVendeurs = () => {
  const [leads] = useState<Lead[]>(myLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [heatFilter, setHeatFilter] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [phoneFilter, setPhoneFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

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
          <h1 className="text-2xl font-display font-bold text-foreground">Mes Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredLeads.length} leads qui me sont assignés
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
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-3 text-xs font-display uppercase"
            onClick={() => setViewMode("list")}
          >
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
            Liste
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-display uppercase">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Synchroniser
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative w-52">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="pl-8 h-8 text-xs bg-card border-border" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

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

        <Badge variant={phoneFilter === "has" ? "success" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("phone", "has")}>
          <Phone className="h-3 w-3 mr-1" /> Tél ({phoneCount})
        </Badge>
        <Badge variant={phoneFilter === "no" ? "secondary" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("phone", "no")}>
          Sans tél ({noPhoneCount})
        </Badge>

        <Badge variant={heatFilter === "hot" ? "hot" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("heat", "hot")}>
          🔥 Chauds ({hotCount})
        </Badge>
        <Badge variant={heatFilter === "warm" ? "hot" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("heat", "warm")}>
          Tièdes ({warmCount})
        </Badge>
        <Badge variant={heatFilter === "cold" ? "cold" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("heat", "cold")}>
          ❄️ Froids ({coldCount})
        </Badge>

        <Badge variant={sourceFilter === "LBC" ? "default" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("source", "LBC")}>
          Leboncoin ({lbcCount})
        </Badge>

        {activeFilters > 0 && (
          <Badge variant="default" className="h-7 text-[10px] font-display">
            <Filter className="h-3 w-3 mr-1" />
            {activeFilters} filtre{activeFilters > 1 ? "s" : ""} actif{activeFilters > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Content */}
      {viewMode === "kanban" ? (
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-4" style={{ minWidth: columns.length * 200 }}>
            {columns.map((col) => {
              const colLeads = filteredLeads.filter((l) => l.status === col.key);
              return (
                <div key={col.key} className="w-[200px] shrink-0">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${col.dotColor}`} />
                    <h3 className="font-display text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">{col.label}</h3>
                    <Badge variant="secondary" className="text-[10px] font-display h-5 min-w-[20px] flex items-center justify-center ml-auto shrink-0">{colLeads.length}</Badge>
                  </div>
                  <div className="space-y-2 min-h-[300px]">
                    {colLeads.length === 0 ? (
                      <div className="border border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center">
                        <p className="font-display text-3xl font-bold text-muted-foreground/30 mb-1">0</p>
                        <p className="font-display text-[10px] uppercase tracking-wider text-muted-foreground text-center">Aucun lead</p>
                      </div>
                    ) : (
                      colLeads.map((lead) => (
                        <Card key={lead.id} className="bg-card border-border hover:border-primary/40 transition-colors cursor-pointer">
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
                              <Badge variant={lead.source === "LBC" ? "default" : lead.source === "LC" ? "violet" : "info"} className="text-[8px] h-4 font-display shrink-0">{lead.source}</Badge>
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
                                <Clock className="h-3 w-3" />{lead.lastContact}
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
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-display uppercase tracking-wider text-muted-foreground font-bold">
                <div className="col-span-3">Vendeur</div>
                <div className="col-span-3">Bien</div>
                <div className="col-span-1">Prix</div>
                <div className="col-span-1">Source</div>
                <div className="col-span-2">Statut</div>
                <div className="col-span-1">Temp.</div>
                <div className="col-span-1">Tél</div>
              </div>
              {filteredLeads.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">Aucun lead trouvé</div>
              ) : (
                filteredLeads.map((lead) => {
                  const col = columns.find(c => c.key === lead.status);
                  return (
                    <div key={lead.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-accent/30 transition-colors cursor-pointer">
                      <div className="col-span-3 flex items-center gap-2">
                        <div className="h-7 w-7 bg-muted rounded-sm flex items-center justify-center shrink-0">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                          <p className="text-[10px] text-muted-foreground">{lead.ville}</p>
                        </div>
                      </div>
                      <div className="col-span-3"><p className="text-sm text-foreground truncate">{lead.property}</p></div>
                      <div className="col-span-1"><p className="text-xs font-display font-bold text-foreground">{lead.prix}</p></div>
                      <div className="col-span-1">
                        <Badge variant={lead.source === "LBC" ? "default" : lead.source === "LC" ? "violet" : "info"} className="text-[8px] font-display">{lead.source}</Badge>
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${col?.dotColor}`} />
                        <span className="text-xs text-foreground truncate">{col?.label}</span>
                      </div>
                      <div className="col-span-1">
                        <Badge variant={lead.heat === "hot" ? "hot" : lead.heat === "warm" ? "default" : "cold"} className="text-[8px]">
                          {lead.heat === "hot" ? "🔥" : lead.heat === "warm" ? "🌤" : "❄️"}
                        </Badge>
                      </div>
                      <div className="col-span-1">
                        {lead.hasPhone ? <Phone className="h-3.5 w-3.5 text-success" /> : <span className="text-[10px] text-muted-foreground">—</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
};

export default BaseVendeurs;
