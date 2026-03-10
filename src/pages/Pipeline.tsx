import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, LayoutGrid, Columns3, RefreshCw, SlidersHorizontal,
  Phone, User, Clock, MapPin, Filter, MessageSquare, ChevronLeft, ChevronRight,
  Home, Send, Sparkles, ArrowRightLeft, Globe, Wifi, Eye,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TransferDialog } from "@/components/TransferDialog";
import { toast } from "sonner";

type PipelineStatus =
  | "prospect" | "auto_sent" | "no_response" | "callback" | "not_interested"
  | "rdv" | "no_show" | "offer_sent" | "negotiation" | "mandate" | "no_follow" | "excluded" | "sold";

const pipelineStatuses: { key: PipelineStatus; label: string; dotColor: string }[] = [
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

interface ScrapedLead {
  id: number;
  property: string;
  ville: string;
  prix: string;
  surface: string;
  pieces: number;
  source: "LBC" | "PAP";
  publishedAt: string;
  description: string;
  photos: string[];
  vendeur?: string;
  phone?: string;
  url?: string;
  isNew?: boolean;
  addedToLeads?: boolean;
  status: PipelineStatus;
}

const scrapedData: ScrapedLead[] = [
  {
    id: 1, property: "Maison 120m² avec jardin", ville: "Lyon 3ème", prix: "450 000 €", surface: "120m²", pieces: 5, source: "LBC", publishedAt: "Il y a 2 min", isNew: true, status: "prospect",
    description: "Magnifique maison de 120m² avec jardin arboré de 250m², garage double, 4 chambres, salon lumineux avec cheminée. Cuisine équipée ouverte. DPE: C.",
    photos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop"],
    vendeur: "Jean-Marc Leblanc", phone: "06 12 34 56 78", url: "https://www.leboncoin.fr/ventes_immobilieres/1234567890.htm",
  },
  {
    id: 2, property: "T3 lumineux 65m²", ville: "Paris 11ème", prix: "520 000 €", surface: "65m²", pieces: 3, source: "LBC", publishedAt: "Il y a 5 min", isNew: true, status: "auto_sent",
    description: "Appartement T3 lumineux de 65m² au 4ème étage avec ascenseur. Séjour double, 2 chambres, balcon filant. Parquet chêne.",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop"],
    vendeur: "Sophie Martin", phone: "06 23 45 67 89",
  },
  {
    id: 3, property: "Villa contemporaine piscine 200m²", ville: "Aix-en-Provence", prix: "890 000 €", surface: "200m²", pieces: 7, source: "LBC", publishedAt: "Il y a 12 min", status: "no_response",
    description: "Villa contemporaine 200m² avec piscine, terrain 800m², 5 chambres, suite parentale, bureau. Vue dégagée. DPE: B.",
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop"],
    vendeur: "Pierre Duval",
  },
  {
    id: 4, property: "T2 rénové centre-ville 42m²", ville: "Bordeaux", prix: "245 000 €", surface: "42m²", pieces: 2, source: "LBC", publishedAt: "Il y a 18 min", isNew: true, status: "callback",
    description: "T2 rénové de 42m², cuisine américaine, chambre avec placard, salle d'eau moderne. Résidence calme, proche tram.",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop"],
    vendeur: "Marie Rousseau", phone: "06 45 67 89 01",
  },
  {
    id: 5, property: "Maison de ville 150m²", ville: "Nantes", prix: "380 000 €", surface: "150m²", pieces: 5, source: "PAP", publishedAt: "Il y a 25 min", status: "prospect",
    description: "Maison de ville 150m² sur 3 niveaux, 4 chambres, jardin 100m², garage. Proche centre-ville. DPE: D.",
    photos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=260&fit=crop"],
    vendeur: "Laurent Petit",
  },
  {
    id: 6, property: "T4 dernier étage terrasse 85m²", ville: "Marseille 8ème", prix: "310 000 €", surface: "85m²", pieces: 4, source: "LBC", publishedAt: "Il y a 32 min", status: "rdv",
    description: "T4 avec terrasse de 20m², vue mer, 3 chambres, cuisine équipée, parking. Résidence récente avec piscine.",
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=260&fit=crop"],
    vendeur: "Claire Bernard", phone: "06 78 90 12 34",
  },
  {
    id: 7, property: "Plain-pied 95m² avec véranda", ville: "Toulouse", prix: "275 000 €", surface: "95m²", pieces: 4, source: "PAP", publishedAt: "Il y a 45 min", status: "auto_sent",
    description: "Plain-pied 95m², 3 chambres, jardin 350m², véranda. Quartier résidentiel calme. DPE: D.",
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop"],
    vendeur: "François Moreau", phone: "06 34 56 78 90",
  },
  {
    id: 8, property: "Duplex 110m² rooftop", ville: "Strasbourg", prix: "425 000 €", surface: "110m²", pieces: 5, source: "LBC", publishedAt: "Il y a 1h", status: "negotiation",
    description: "Duplex 110m² en dernier étage, rooftop privé 40m², 3 chambres, 2 SDB, parking. Quartier Orangerie.",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=260&fit=crop"],
    vendeur: "Isabelle Leroy", phone: "06 89 01 23 45",
  },
  {
    id: 9, property: "Studio rénové 28m²", ville: "Lille", prix: "145 000 €", surface: "28m²", pieces: 1, source: "PAP", publishedAt: "Il y a 1h15", status: "prospect",
    description: "Studio 28m² rénové, coin cuisine, salle d'eau. Idéal investissement locatif. Proche fac.",
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=260&fit=crop"],
    vendeur: "Thomas Garcia",
  },
  {
    id: 10, property: "T5 haussmannien 140m²", ville: "Paris 8ème", prix: "1 200 000 €", surface: "140m²", pieces: 5, source: "LBC", publishedAt: "Il y a 1h30", status: "offer_sent",
    description: "T5 haussmannien de 140m², moulures, parquet, cheminées. 4 chambres, cave. Immeuble pierre de taille.",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop"],
    vendeur: "Anne Dubois", phone: "06 56 78 90 12",
  },
  {
    id: 11, property: "Loft industriel 180m²", ville: "Lyon 6ème", prix: "780 000 €", surface: "180m²", pieces: 6, source: "LBC", publishedAt: "Il y a 2h", status: "mandate",
    description: "Loft industriel de 180m², hauteur sous plafond 4m, verrière, mezzanine, terrasse privée 30m².",
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=260&fit=crop"],
    vendeur: "Marc Dupont", phone: "06 11 22 33 44",
  },
  {
    id: 12, property: "T3 vue mer balcon 72m²", ville: "Nice", prix: "395 000 €", surface: "72m²", pieces: 3, source: "LBC", publishedAt: "Il y a 2h30", status: "prospect",
    description: "T3 de 72m² avec balcon, vue dégagée, 2 chambres, séjour lumineux. Quartier Cimiez, calme.",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop"],
    vendeur: "Julie Favre", phone: "06 55 66 77 88",
  },
];

const Pipeline = () => {
  const [leads, setLeads] = useState<ScrapedLead[]>(scrapedData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [phoneFilter, setPhoneFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedLead, setSelectedLead] = useState<ScrapedLead | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [replyTarget, setReplyTarget] = useState<{ lead: ScrapedLead; channel: string } | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [transferLead, setTransferLead] = useState<ScrapedLead | null>(null);
  const [scraping, setScraping] = useState(false);

  const filteredLeads = leads.filter((lead) => {
    if (sourceFilter && lead.source !== sourceFilter) return false;
    if (phoneFilter === "has" && !lead.phone) return false;
    if (phoneFilter === "no" && lead.phone) return false;
    if (statusFilter && lead.status !== statusFilter) return false;
    if (searchQuery && !lead.property.toLowerCase().includes(searchQuery.toLowerCase()) && !lead.ville.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const phoneCount = leads.filter(l => l.phone).length;
  const noPhoneCount = leads.filter(l => !l.phone).length;
  const lbcCount = leads.filter(l => l.source === "LBC").length;
  const papCount = leads.filter(l => l.source === "PAP").length;
  const newCount = leads.filter(l => l.isNew).length;
  const addedCount = leads.filter(l => l.addedToLeads).length;

  const toggleFilter = (type: "source" | "phone", value: string) => {
    if (type === "source") setSourceFilter(prev => prev === value ? null : value);
    if (type === "phone") setPhoneFilter(prev => prev === value ? null : value);
  };

  const activeFilters = [sourceFilter, phoneFilter].filter(Boolean).length;

  const openDetail = (lead: ScrapedLead) => { setSelectedLead(lead); setCurrentPhoto(0); };

  const addToLeads = (lead: ScrapedLead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, addedToLeads: true } : l));
    toast.success(`⭐ "${lead.property}" ajouté à Mes Leads !`, { description: `${lead.ville} — ${lead.prix}` });
  };

  const openReplyPopup = (lead: ScrapedLead, channel: string) => {
    setReplyTarget({ lead, channel });
    setAiLoading(true);
    setTimeout(() => {
      setReplyMessage(`Bonjour ${lead.vendeur?.split(" ")[0] || ""}, j'ai vu votre annonce pour votre ${lead.property} à ${lead.ville} (${lead.prix}). J'ai actuellement des acquéreurs qualifiés intéressés par ce type de bien. Seriez-vous disponible pour un échange rapide ?`);
      setAiLoading(false);
    }, 800);
  };

  const sendReply = () => {
    if (!replyTarget || !replyMessage.trim()) return;
    toast.success(`📩 ${replyTarget.channel} envoyé à ${replyTarget.lead.vendeur}`);
    setReplyTarget(null); setReplyMessage("");
  };

  const handleCall = (lead: ScrapedLead) => { toast.success(`📞 Appel en cours vers ${lead.vendeur}...`); };

  const handleScrape = () => {
    setScraping(true);
    toast.info("🔍 Scraping Leboncoin en cours...", { description: "Recherche de nouvelles annonces..." });
    setTimeout(() => {
      setScraping(false);
      toast.success("✅ Scraping terminé !", { description: `${leads.length} annonces trouvées — ${newCount} nouvelles` });
    }, 2500);
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-foreground">Pipeline</h1>
            <Badge variant="default" className="text-[10px] font-display gap-1">
              <Globe className="h-3 w-3" /> SCRAPING LBC
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredLeads.length} annonces scrapées — {newCount} nouvelles — {addedCount} ajoutées à Mes Leads
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="attack"
            size="sm"
            className="text-xs gap-1.5"
            onClick={handleScrape}
            disabled={scraping}
          >
            {scraping ? (
              <span className="animate-spin h-3.5 w-3.5 border-2 border-primary-foreground border-t-transparent rounded-full" />
            ) : (
              <Wifi className="h-3.5 w-3.5" />
            )}
            {scraping ? "Scraping..." : "Lancer le scraping"}
          </Button>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" className="h-8 px-3 text-xs font-display uppercase" onClick={() => setViewMode("grid")}>
              <Columns3 className="h-3.5 w-3.5 mr-1.5" /> Grille
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" className="h-8 px-3 text-xs font-display uppercase" onClick={() => setViewMode("list")}>
              <LayoutGrid className="h-3.5 w-3.5 mr-1.5" /> Liste
            </Button>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="h-2.5 w-2.5 bg-success rounded-full animate-pulse" />
        <span className="text-xs font-display font-bold uppercase tracking-wider text-foreground">Scraping actif</span>
        <span className="text-xs text-muted-foreground">— Leboncoin scanné toutes les 2 minutes</span>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] font-display">{lbcCount} LBC</Badge>
          <Badge variant="info" className="text-[10px] font-display">{papCount} PAP</Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative w-52">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Rechercher un bien..." className="pl-8 h-8 text-xs bg-card border-border" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Select><SelectTrigger className="w-[130px] h-8 text-xs bg-card border-border"><SelectValue placeholder="Plus récentes" /></SelectTrigger><SelectContent><SelectItem value="recent">Plus récentes</SelectItem><SelectItem value="oldest">Plus anciennes</SelectItem><SelectItem value="price-asc">Prix croissant</SelectItem><SelectItem value="price-desc">Prix décroissant</SelectItem></SelectContent></Select>
        <div className="h-5 w-px bg-border mx-1" />
        <Badge variant={phoneFilter === "has" ? "success" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("phone", "has")}>
          <Phone className="h-3 w-3 mr-1" /> Avec tél ({phoneCount})
        </Badge>
        <Badge variant={phoneFilter === "no" ? "secondary" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("phone", "no")}>
          Sans tél ({noPhoneCount})
        </Badge>
        <Badge variant={sourceFilter === "LBC" ? "default" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("source", "LBC")}>
          Leboncoin ({lbcCount})
        </Badge>
        <Badge variant={sourceFilter === "PAP" ? "info" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("source", "PAP")}>
          PAP ({papCount})
        </Badge>
        <Badge variant="outline" className="h-7 text-[10px] font-display cursor-pointer border-primary/50 text-primary hover:bg-primary/10">
          <MapPin className="h-3 w-3 mr-1" /> Filtrer par ville
        </Badge>
        {activeFilters > 0 && <Badge variant="default" className="h-7 text-[10px] font-display"><Filter className="h-3 w-3 mr-1" />{activeFilters} filtre{activeFilters > 1 ? "s" : ""}</Badge>}
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className={`bg-card border-border hover:border-primary/40 transition-colors cursor-pointer group overflow-hidden ${lead.isNew ? "ring-1 ring-primary/30" : ""}`}>
              {/* Photo */}
              <div className="relative h-36 w-full" onClick={() => openDetail(lead)}>
                <img src={lead.photos[0]} alt={lead.property} className="w-full h-full object-cover" />
                <Badge variant={lead.source === "LBC" ? "default" : "info"} className="text-[8px] h-4 font-display absolute top-2 right-2">
                  {lead.source}
                </Badge>
                {lead.isNew && (
                  <Badge variant="hot" className="text-[8px] h-4 font-display absolute top-2 left-2">
                    🆕 NOUVEAU
                  </Badge>
                )}
                {lead.addedToLeads && (
                  <div className="absolute bottom-2 left-2 bg-success/90 text-success-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm">
                    ⭐
                  </div>
                )}
                {lead.photos.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-background/80 rounded px-1.5 py-0.5 text-[9px] font-display text-foreground">
                    📷 {lead.photos.length}
                  </div>
                )}
              </div>

              <CardContent className="p-3">
                <p className="text-xs font-medium text-foreground truncate" onClick={() => openDetail(lead)}>{lead.property}</p>
                <p className="text-[10px] text-muted-foreground">{lead.ville}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs font-display font-bold text-primary">{lead.prix}</p>
                  <span className="text-[10px] text-muted-foreground">{lead.surface} · {lead.pieces}p</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {lead.publishedAt}
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-success">
                    <Phone className="h-3 w-3" /> Téléphone disponible
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 mt-2.5">
                  {!lead.addedToLeads ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-sm px-2.5 gap-1 hover:bg-primary/10 hover:border-primary/40"
                      onClick={(e) => { e.stopPropagation(); addToLeads(lead); }}
                      title="Ajouter à Mes Leads"
                    >
                      ⭐
                    </Button>
                  ) : (
                    <div className="h-7 px-2.5 flex items-center text-[10px] text-success font-display font-bold">
                      ✅ Ajouté
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 px-2">
                        <MessageSquare className="h-2.5 w-2.5" /> SMS
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => openReplyPopup(lead, "LBC")}><span className="text-xs font-display font-bold text-primary mr-2">LBC</span> Leboncoin</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openReplyPopup(lead, "WhatsApp")}><span className="text-xs font-display font-bold text-success mr-2">WA</span> WhatsApp</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openReplyPopup(lead, "SMS")}><span className="text-xs font-display font-bold text-info mr-2">SMS</span> SMS</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {lead.phone && (
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 px-2" onClick={() => handleCall(lead)}>
                      <Phone className="h-2.5 w-2.5" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 px-2 ml-auto" onClick={() => setTransferLead(lead)}>
                    <ArrowRightLeft className="h-2.5 w-2.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-display uppercase tracking-wider text-muted-foreground font-bold">
                <div className="col-span-1">Photo</div>
                <div className="col-span-3">Bien</div>
                <div className="col-span-1">Prix</div>
                <div className="col-span-1">Surface</div>
                <div className="col-span-1">Source</div>
                <div className="col-span-1">Publié</div>
                <div className="col-span-1">Tél</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>
              {filteredLeads.map((lead) => (
                <div key={lead.id} className={`grid grid-cols-12 gap-2 px-4 py-2 items-center hover:bg-accent/30 transition-colors group ${lead.isNew ? "bg-primary/5" : ""}`}>
                  <div className="col-span-1">
                    <img src={lead.photos[0]} alt={lead.property} className="h-10 w-14 object-cover rounded cursor-pointer" onClick={() => openDetail(lead)} />
                  </div>
                  <div className="col-span-3 cursor-pointer min-w-0" onClick={() => openDetail(lead)}>
                    <p className="text-sm font-medium text-foreground truncate">{lead.property}</p>
                    <p className="text-[10px] text-muted-foreground">{lead.ville}</p>
                  </div>
                  <div className="col-span-1"><p className="text-xs font-display font-bold text-foreground">{lead.prix}</p></div>
                  <div className="col-span-1"><p className="text-xs text-muted-foreground">{lead.surface} · {lead.pieces}p</p></div>
                  <div className="col-span-1"><Badge variant={lead.source === "LBC" ? "default" : "info"} className="text-[8px] font-display">{lead.source}</Badge></div>
                  <div className="col-span-1"><span className="text-[10px] text-muted-foreground">{lead.publishedAt}</span></div>
                  <div className="col-span-1">
                    {lead.phone ? <Phone className="h-3.5 w-3.5 text-success" /> : <span className="text-[10px] text-muted-foreground">—</span>}
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-1">
                    {!lead.addedToLeads ? (
                      <Button variant="outline" size="sm" className="h-7 text-sm px-2.5 hover:bg-primary/10" onClick={() => addToLeads(lead)} title="Ajouter à Mes Leads">
                        ⭐
                      </Button>
                    ) : (
                      <span className="text-[10px] text-success font-display font-bold mr-1">✅</span>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 px-2"><MessageSquare className="h-2.5 w-2.5" /> SMS</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openReplyPopup(lead, "LBC")}>LBC</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openReplyPopup(lead, "WhatsApp")}>WhatsApp</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openReplyPopup(lead, "SMS")}>SMS</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {lead.phone && (
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 px-2" onClick={() => handleCall(lead)}><Phone className="h-2.5 w-2.5" /></Button>
                    )}
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 px-2" onClick={() => setTransferLead(lead)}><ArrowRightLeft className="h-2.5 w-2.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card p-0">
          {selectedLead && (
            <>
              {/* Photo */}
              <div className="relative">
                <img src={selectedLead.photos[currentPhoto]} alt={selectedLead.property} className="w-full h-64 object-cover" />
                {selectedLead.photos.length > 1 && (
                  <>
                    <button className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 flex items-center justify-center text-foreground" onClick={() => setCurrentPhoto(p => p === 0 ? selectedLead.photos.length - 1 : p - 1)}><ChevronLeft className="h-4 w-4" /></button>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 flex items-center justify-center text-foreground" onClick={() => setCurrentPhoto(p => p === selectedLead.photos.length - 1 ? 0 : p + 1)}><ChevronRight className="h-4 w-4" /></button>
                  </>
                )}
                <div className="absolute bottom-2 right-2 bg-background/80 rounded px-2 py-0.5 text-[10px] font-display text-foreground">{currentPhoto + 1}/{selectedLead.photos.length}</div>
                <Badge variant="default" className="absolute top-3 left-3 font-display text-[10px]">{selectedLead.source}</Badge>
              </div>

              {selectedLead.photos.length > 1 && (
                <div className="flex gap-1.5 px-6 pt-4">
                  {selectedLead.photos.map((photo, i) => (
                    <img key={i} src={photo} alt={`Photo ${i + 1}`} className={`h-12 w-16 object-cover rounded cursor-pointer border-2 shrink-0 transition-colors ${i === currentPhoto ? "border-primary" : "border-border"}`} onClick={() => setCurrentPhoto(i)} />
                  ))}
                </div>
              )}

              <div className="px-6 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">{selectedLead.property}</h2>
                    <p className="text-sm text-muted-foreground">{selectedLead.ville}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{selectedLead.surface} · {selectedLead.pieces} pièces · Publié {selectedLead.publishedAt}</p>
                  </div>
                  <p className="text-xl font-display font-bold text-primary">{selectedLead.prix}</p>
                </div>

                {/* Vendeur */}
                {selectedLead.vendeur && (
                  <div className="flex items-center gap-3 mb-4 p-3 bg-background rounded-lg">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{selectedLead.vendeur}</p>
                      {selectedLead.phone && <p className="text-xs text-primary">{selectedLead.phone}</p>}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mb-5">
                  {!selectedLead.addedToLeads ? (
                    <Button variant="attack" size="sm" className="text-sm gap-1.5" onClick={() => { addToLeads(selectedLead); setSelectedLead({ ...selectedLead, addedToLeads: true }); }}>
                      ⭐ Ajouter à Mes Leads
                    </Button>
                  ) : (
                    <Badge variant="success" className="text-xs font-display gap-1 py-1 px-3">✅ Ajouté à Mes Leads</Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Écrire</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => { setSelectedLead(null); openReplyPopup(selectedLead, "LBC"); }}>Leboncoin</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedLead(null); openReplyPopup(selectedLead, "WhatsApp"); }}>WhatsApp</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedLead(null); openReplyPopup(selectedLead, "SMS"); }}>SMS</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {selectedLead.phone && (
                    <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => handleCall(selectedLead)}><Phone className="h-3.5 w-3.5" /> Appeler</Button>
                  )}
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => { setSelectedLead(null); setTransferLead(selectedLead); }}><ArrowRightLeft className="h-3.5 w-3.5" /> Transférer</Button>
                </div>

                {/* Description */}
                <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2">Description de l'annonce</h3>
                <p className="text-sm text-foreground leading-relaxed mb-4">{selectedLead.description}</p>

                {selectedLead.url && (
                  <a href={selectedLead.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline">
                    <Eye className="h-3.5 w-3.5" /> Voir l'annonce originale sur Leboncoin
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Popup */}
      <Dialog open={!!replyTarget} onOpenChange={(open) => !open && setReplyTarget(null)}>
        <DialogContent className="max-w-2xl bg-card p-0 overflow-hidden">
          {replyTarget && (
            <>
              <div className="flex border-b border-border">
                <div className="w-48 h-36 shrink-0 bg-muted">
                  <img src={replyTarget.lead.photos[0]} alt={replyTarget.lead.property} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-foreground text-lg">{replyTarget.lead.property}</h3>
                      <p className="text-sm text-muted-foreground">{replyTarget.lead.ville}</p>
                    </div>
                    <p className="text-lg font-display font-bold text-primary">{replyTarget.lead.prix}</p>
                  </div>
                  {replyTarget.lead.vendeur && (
                    <div className="flex items-center gap-3 mt-3 p-2 bg-background rounded">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{replyTarget.lead.vendeur}</p>
                        {replyTarget.lead.phone && <p className="text-xs text-primary">{replyTarget.lead.phone}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <Badge variant="default" className="text-xs font-display gap-1"><Send className="h-3 w-3" /> {replyTarget.channel}</Badge>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-violet" />
                  <span className="font-display text-[10px] uppercase tracking-wider text-violet font-bold">Réponse IA — modifiez avant d'envoyer</span>
                </div>
                {aiLoading ? (
                  <div className="flex items-center gap-2 p-4 bg-violet/5 rounded-lg">
                    <span className="animate-spin h-4 w-4 border-2 border-violet border-t-transparent rounded-full" />
                    <span className="text-sm text-muted-foreground">Génération...</span>
                  </div>
                ) : (
                  <Textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="bg-background text-sm min-h-[120px]" />
                )}
              </div>
              <DialogFooter className="p-4 pt-0 gap-2">
                <Button variant="outline" onClick={() => setReplyTarget(null)}>Annuler</Button>
                <Button variant="attack" className="gap-1.5" onClick={sendReply} disabled={aiLoading || !replyMessage.trim()}>
                  <Send className="h-3.5 w-3.5" /> Envoyer via {replyTarget.channel}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <TransferDialog
        open={!!transferLead}
        onOpenChange={(open) => !open && setTransferLead(null)}
        propertyName={transferLead?.property}
        ville={transferLead?.ville}
        prix={transferLead?.prix}
      />
    </AppLayout>
  );
};

export default Pipeline;
