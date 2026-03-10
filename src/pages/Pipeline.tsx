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
  Home, Send, Sparkles, ArrowRightLeft,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TransferDialog } from "@/components/TransferDialog";
import { toast } from "sonner";

type LeadStatus =
  | "prospect" | "auto_sent" | "no_response" | "callback" | "not_interested"
  | "rdv" | "no_show" | "offer_sent" | "negotiation" | "mandate" | "no_follow" | "excluded" | "sold";

interface LeadHistory {
  date: string;
  action: string;
  channel: string;
  detail: string;
}

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
  phone?: string;
  description?: string;
  photos?: string[];
  history?: LeadHistory[];
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
  {
    id: 1, name: "Jean-Marc Leblanc", property: "Maison 120m² jardin", ville: "Lyon", prix: "450 000 €", source: "LBC", status: "prospect", heat: "hot", hasPhone: true, phone: "06 12 34 56 78",
    description: "Magnifique maison de 120m² avec jardin arboré de 250m², garage double, 4 chambres, salon lumineux avec cheminée. Cuisine équipée ouverte. DPE: C.",
    photos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop"],
    history: [
      { date: "10/03 09:12", action: "SMS Auto envoyé", channel: "LBC", detail: "Message de premier contact envoyé automatiquement" },
      { date: "09/03 14:30", action: "Appel sortant", channel: "Tél", detail: "Pas de réponse — messagerie pleine" },
      { date: "08/03 08:00", action: "Bien détecté", channel: "Système", detail: "Annonce détectée sur Leboncoin — ajouté au pipeline" },
    ],
  },
  {
    id: 2, name: "Sophie Martin", property: "T3 lumineux 65m²", ville: "Paris 11", prix: "520 000 €", source: "PAP", status: "prospect", heat: "hot", hasPhone: true, phone: "06 23 45 67 89",
    description: "Appartement T3 lumineux de 65m² au 4ème étage avec ascenseur. Séjour double, 2 chambres, balcon filant. Parquet chêne.",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop"],
    history: [
      { date: "09/03 16:00", action: "Message WhatsApp", channel: "WA", detail: "Réponse positive — intéressée par un RDV" },
      { date: "09/03 10:00", action: "SMS envoyé", channel: "SMS", detail: "Relance personnalisée" },
      { date: "08/03 09:00", action: "Bien détecté", channel: "Système", detail: "Annonce détectée sur PAP" },
    ],
  },
  {
    id: 3, name: "Pierre Duval", property: "Villa piscine 200m²", ville: "Aix", prix: "890 000 €", source: "LBC", status: "prospect", heat: "cold",
    description: "Villa contemporaine 200m² avec piscine, terrain 800m², 5 chambres, suite parentale, bureau. Vue dégagée. DPE: B.",
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop"],
    history: [
      { date: "07/03 08:00", action: "Bien détecté", channel: "Système", detail: "Annonce détectée sur Leboncoin" },
    ],
  },
  {
    id: 4, name: "Marie Rousseau", property: "T2 rénové 42m²", ville: "Bordeaux", prix: "245 000 €", source: "LBC", status: "auto_sent", heat: "hot", hasPhone: true, phone: "06 45 67 89 01",
    description: "T2 rénové de 42m², cuisine américaine, chambre avec placard, salle d'eau moderne. Résidence calme.",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop"],
    history: [
      { date: "10/03 08:00", action: "SMS Auto envoyé", channel: "LBC", detail: "Premier contact automatique" },
      { date: "09/03 08:00", action: "Bien détecté", channel: "Système", detail: "Annonce LBC ajoutée au pipeline" },
    ],
  },
  {
    id: 5, name: "Laurent Petit", property: "Maison ville 150m²", ville: "Nantes", prix: "380 000 €", source: "PAP", status: "auto_sent", heat: "cold",
    description: "Maison de ville 150m² sur 3 niveaux, 4 chambres, jardin 100m², garage. Proche centre-ville.",
    photos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=260&fit=crop"],
    history: [
      { date: "09/03 10:00", action: "Message PAP envoyé", channel: "PAP", detail: "Premier contact automatique" },
      { date: "08/03 08:00", action: "Bien détecté", channel: "Système", detail: "Annonce PAP" },
    ],
  },
  {
    id: 6, name: "Claire Bernard", property: "T4 terrasse 85m²", ville: "Marseille", prix: "310 000 €", source: "LBC", status: "no_response", heat: "cold",
    description: "T4 avec terrasse de 20m², vue mer, 3 chambres, cuisine équipée, parking. Résidence récente.",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop"],
    history: [
      { date: "08/03 09:00", action: "SMS Auto envoyé", channel: "LBC", detail: "Pas de réponse après 48h" },
      { date: "07/03 08:00", action: "Bien détecté", channel: "Système", detail: "LBC — ajouté au pipeline" },
    ],
  },
  {
    id: 7, name: "François Moreau", property: "Plain-pied 95m²", ville: "Toulouse", prix: "275 000 €", source: "PAP", status: "no_response", heat: "cold",
    description: "Plain-pied 95m², 3 chambres, jardin 350m², véranda. Quartier résidentiel calme. DPE: D.",
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop"],
    history: [
      { date: "07/03 10:00", action: "Message PAP", channel: "PAP", detail: "Pas de réponse" },
      { date: "06/03 08:00", action: "Bien détecté", channel: "Système", detail: "PAP" },
    ],
  },
  {
    id: 8, name: "Isabelle Leroy", property: "Duplex 110m²", ville: "Strasbourg", prix: "425 000 €", source: "LBC", status: "callback", heat: "hot", lastContact: "Rappel 14h", hasPhone: true, phone: "06 89 01 23 45",
    description: "Duplex 110m² en dernier étage, rooftop privé 40m², 3 chambres, 2 SDB, parking. Quartier Orangerie.",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=260&fit=crop"],
    history: [
      { date: "10/03 10:00", action: "Rappel planifié", channel: "Système", detail: "Rappel prévu à 14h" },
      { date: "09/03 15:00", action: "Appel sortant", channel: "Tél", detail: "Discussion 3 min — demande rappel demain" },
      { date: "08/03 09:00", action: "SMS Auto envoyé", channel: "LBC", detail: "Premier contact" },
      { date: "07/03 08:00", action: "Bien détecté", channel: "Système", detail: "Annonce LBC" },
    ],
  },
  {
    id: 9, name: "Thomas Garcia", property: "Studio 28m²", ville: "Lille", prix: "145 000 €", source: "PAP", status: "callback", heat: "cold", lastContact: "Rappel demain",
    description: "Studio 28m² rénové, coin cuisine, salle d'eau. Idéal investissement locatif. Proche fac.",
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=260&fit=crop"],
    history: [
      { date: "09/03 16:00", action: "Appel sortant", channel: "Tél", detail: "Rappel demain matin demandé" },
      { date: "08/03 08:00", action: "Bien détecté", channel: "Système", detail: "PAP" },
    ],
  },
  {
    id: 10, name: "Anne Dubois", property: "T5 haussmannien", ville: "Paris 8", prix: "1 200 000 €", source: "LBC", status: "not_interested", heat: "cold",
    description: "T5 haussmannien de 140m², moulures, parquet, cheminées. 4 chambres, cave. Immeuble pierre de taille.",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop"],
    history: [
      { date: "08/03 14:00", action: "Appel sortant", channel: "Tél", detail: "Vendeur pas intéressé — déjà en mandat exclusif" },
      { date: "07/03 08:00", action: "Bien détecté", channel: "Système", detail: "LBC" },
    ],
  },
  {
    id: 11, name: "Marc Dupont", property: "Loft 180m²", ville: "Lyon 6", prix: "780 000 €", source: "LC", status: "rdv", heat: "hot", hasPhone: true, phone: "06 11 22 33 44",
    description: "Loft industriel de 180m², hauteur sous plafond 4m, verrière, mezzanine, terrasse privée 30m².",
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=260&fit=crop"],
    history: [
      { date: "10/03 09:00", action: "RDV confirmé", channel: "Tél", detail: "RDV estimation prévu le 12/03 à 10h" },
      { date: "09/03 11:00", action: "Appel sortant", channel: "Tél", detail: "Très intéressé, RDV fixé" },
      { date: "08/03 09:00", action: "WhatsApp envoyé", channel: "WA", detail: "Premier contact vocal" },
      { date: "07/03 08:00", action: "Bien détecté", channel: "Système", detail: "Logic-Immo — ajouté au pipeline" },
    ],
  },
  {
    id: 12, name: "Julie Favre", property: "T3 balcon 72m²", ville: "Nice", prix: "395 000 €", source: "LBC", status: "negotiation", heat: "warm", hasPhone: true, phone: "06 55 66 77 88",
    description: "T3 de 72m² avec balcon, vue dégagée, 2 chambres, séjour lumineux. Quartier Cimiez, calme.",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop"],
    history: [
      { date: "10/03 10:00", action: "Offre envoyée", channel: "Email", detail: "Proposition mandat à 3.5%" },
      { date: "09/03 14:00", action: "RDV estimation", channel: "Tél", detail: "Estimation à 410k — vendeur ok pour 395k" },
      { date: "08/03 10:00", action: "Appel sortant", channel: "Tél", detail: "Discussion 10 min — RDV fixé" },
      { date: "07/03 09:00", action: "SMS Auto envoyé", channel: "LBC", detail: "Premier contact" },
      { date: "06/03 08:00", action: "Bien détecté", channel: "Système", detail: "LBC" },
    ],
  },
];

const Pipeline = () => {
  const [leads] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [heatFilter, setHeatFilter] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [phoneFilter, setPhoneFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  // Reply popup
  const [replyTarget, setReplyTarget] = useState<{ lead: Lead; channel: string } | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [transferLead, setTransferLead] = useState<Lead | null>(null);

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

  const openHistory = (lead: Lead) => {
    setSelectedLead(lead);
    setCurrentPhoto(0);
  };

  const openReplyPopup = (lead: Lead, channel: string) => {
    setReplyTarget({ lead, channel });
    setAiLoading(true);
    setTimeout(() => {
      setReplyMessage(`Bonjour ${lead.name.split(" ")[0]}, j'ai vu votre annonce pour votre ${lead.property} à ${lead.ville} (${lead.prix}). J'ai actuellement des acquéreurs qualifiés intéressés par ce type de bien. Seriez-vous disponible pour un échange rapide ?`);
      setAiLoading(false);
    }, 800);
  };

  const sendReply = () => {
    if (!replyTarget || !replyMessage.trim()) return;
    toast.success(`📩 ${replyTarget.channel} envoyé à ${replyTarget.lead.name}`);
    setReplyTarget(null);
    setReplyMessage("");
  };

  const handleCall = (lead: Lead) => {
    toast.success(`📞 Appel en cours vers ${lead.name}...`);
  };

  const getStatusLabel = (status: LeadStatus) => columns.find(c => c.key === status)?.label || status;
  const getStatusDot = (status: LeadStatus) => columns.find(c => c.key === status)?.dotColor || "";

  // Shared lead card for kanban
  const renderLeadCard = (lead: Lead) => (
    <Card key={lead.id} className="bg-card border-border hover:border-primary/40 transition-colors cursor-pointer group overflow-hidden">
      {/* Photo du bien */}
      <div className="relative h-28 w-full" onClick={() => openHistory(lead)}>
        {lead.photos && lead.photos.length > 0 ? (
          <img src={lead.photos[0]} alt={lead.property} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Home className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <Badge variant={lead.source === "LBC" ? "default" : lead.source === "LC" ? "violet" : "info"} className="text-[8px] h-4 font-display shrink-0 absolute top-2 right-2">
          {lead.source}
        </Badge>
        <Badge variant={lead.heat === "hot" ? "hot" : lead.heat === "warm" ? "default" : "cold"} className="text-[8px] h-4 absolute top-2 left-2">
          {lead.heat === "hot" ? "🔥" : lead.heat === "warm" ? "🌤" : "❄️"}
        </Badge>
      </div>
      <CardContent className="p-3">
        <p className="text-xs font-medium text-foreground truncate" onClick={() => openHistory(lead)}>{lead.property}</p>
        <p className="text-[10px] text-muted-foreground">{lead.ville}</p>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs font-display font-bold text-primary">{lead.prix}</p>
          {lead.hasPhone && <Phone className="h-3 w-3 text-success" />}
        </div>
        {lead.lastContact && (
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-primary">
            <Clock className="h-3 w-3" />{lead.lastContact}
          </div>
        )}
        {/* Actions */}
        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2">
                <MessageSquare className="h-2.5 w-2.5" /> SMS
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => openReplyPopup(lead, "LBC")}>
                <span className="text-xs font-display font-bold text-primary mr-2">LBC</span> Leboncoin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openReplyPopup(lead, "WhatsApp")}>
                <span className="text-xs font-display font-bold text-success mr-2">WA</span> WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openReplyPopup(lead, "SMS")}>
                <span className="text-xs font-display font-bold text-info mr-2">SMS</span> SMS classique
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2" onClick={() => handleCall(lead)}>
            <Phone className="h-2.5 w-2.5" /> Tél
          </Button>
          <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2" onClick={() => setTransferLead(lead)}>
            <ArrowRightLeft className="h-2.5 w-2.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Pipeline des Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filteredLeads.length} annonces filtrées</p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button variant={viewMode === "kanban" ? "default" : "ghost"} size="sm" className="h-8 px-3 text-xs font-display uppercase" onClick={() => setViewMode("kanban")}>
            <Columns3 className="h-3.5 w-3.5 mr-1.5" /> Kanban
          </Button>
          <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" className="h-8 px-3 text-xs font-display uppercase" onClick={() => setViewMode("list")}>
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5" /> Liste
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-display uppercase">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Synchroniser
          </Button>
        </div>
      </div>

      {/* Filters Row 1 */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <div className="relative w-52">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="pl-8 h-8 text-xs bg-card border-border" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Select><SelectTrigger className="w-[130px] h-8 text-xs bg-card border-border"><SelectValue placeholder="Tous les leads" /></SelectTrigger><SelectContent><SelectItem value="all">Tous les leads</SelectItem><SelectItem value="new">Nouveaux</SelectItem><SelectItem value="active">Actifs</SelectItem></SelectContent></Select>
        <Select><SelectTrigger className="w-[130px] h-8 text-xs bg-card border-border"><SelectValue placeholder="Tous les agents" /></SelectTrigger><SelectContent><SelectItem value="all">Tous les agents</SelectItem><SelectItem value="me">Mes leads</SelectItem></SelectContent></Select>
        <Badge variant="outline" className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted">Non attribué (0)</Badge>
        <Select><SelectTrigger className="w-[130px] h-8 text-xs bg-card border-border"><SelectValue placeholder="Plus récentes" /></SelectTrigger><SelectContent><SelectItem value="recent">Plus récentes</SelectItem><SelectItem value="oldest">Plus anciennes</SelectItem><SelectItem value="price-asc">Prix croissant</SelectItem><SelectItem value="price-desc">Prix décroissant</SelectItem></SelectContent></Select>
        <div className="h-5 w-px bg-border mx-1" />
        <Badge variant="outline" className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted"><SlidersHorizontal className="h-3 w-3 mr-1" />Filtres</Badge>
        <Badge variant={phoneFilter === "has" ? "success" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("phone", "has")}><Phone className="h-3 w-3 mr-1" />Tél ({phoneCount})</Badge>
        <Badge variant={phoneFilter === "no" ? "secondary" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("phone", "no")}>Sans tél ({noPhoneCount})</Badge>
        <Badge variant="default" className="h-7 text-[10px] font-display cursor-pointer">Republication (0)</Badge>
        <Badge variant="outline" className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted">Multi-plateforme (0)</Badge>
        <Badge variant={heatFilter === "hot" ? "hot" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("heat", "hot")}>🔥 Chauds ({hotCount})</Badge>
      </div>

      {/* Filters Row 2 */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Badge variant={heatFilter === "warm" ? "hot" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("heat", "warm")}>Tièdes ({warmCount})</Badge>
        <Badge variant={heatFilter === "cold" ? "cold" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("heat", "cold")}>❄️ Froids ({coldCount})</Badge>
        <Badge variant={sourceFilter === "LBC" ? "default" : "outline"} className="h-7 text-[10px] font-display cursor-pointer hover:bg-muted" onClick={() => toggleFilter("source", "LBC")}>Leboncoin ({lbcCount})</Badge>
        <Badge variant="outline" className="h-7 text-[10px] font-display cursor-pointer border-primary/50 text-primary hover:bg-primary/10"><MapPin className="h-3 w-3 mr-1" />Renseignez votre adresse pour filtrer par distance</Badge>
        <Select><SelectTrigger className="w-[140px] h-8 text-xs bg-card border-border"><SelectValue placeholder="Toutes parutions" /></SelectTrigger><SelectContent><SelectItem value="all">Toutes parutions</SelectItem><SelectItem value="today">Aujourd'hui</SelectItem><SelectItem value="week">Cette semaine</SelectItem><SelectItem value="month">Ce mois</SelectItem></SelectContent></Select>
        {activeFilters > 0 && <Badge variant="default" className="h-7 text-[10px] font-display"><Filter className="h-3 w-3 mr-1" />{activeFilters} filtre{activeFilters > 1 ? "s" : ""} actif{activeFilters > 1 ? "s" : ""}</Badge>}
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
                    {col.isNew && <Badge variant="info" className="text-[8px] h-4 px-1.5 font-display shrink-0">NOUVEAU</Badge>}
                    <Badge variant="secondary" className="text-[10px] font-display h-5 min-w-[20px] flex items-center justify-center ml-auto shrink-0">{colLeads.length}</Badge>
                  </div>
                  <div className="space-y-2 min-h-[300px]">
                    {colLeads.length === 0 ? (
                      <div className="border border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center">
                        <p className="font-display text-3xl font-bold text-muted-foreground/30 mb-1">0</p>
                        <p className="font-display text-[10px] uppercase tracking-wider text-muted-foreground text-center">Aucun lead</p>
                      </div>
                    ) : colLeads.map(renderLeadCard)}
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
                <div className="col-span-2">Vendeur</div>
                <div className="col-span-2">Bien</div>
                <div className="col-span-1">Prix</div>
                <div className="col-span-1">Source</div>
                <div className="col-span-2">Statut</div>
                <div className="col-span-1">Temp.</div>
                <div className="col-span-1">Tél</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {filteredLeads.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">Aucun lead trouvé</div>
              ) : filteredLeads.map((lead) => (
                <div key={lead.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-accent/30 transition-colors group">
                  <div className="col-span-2 flex items-center gap-2 cursor-pointer" onClick={() => openHistory(lead)}>
                    <div className="h-7 w-7 bg-muted rounded-sm flex items-center justify-center shrink-0"><User className="h-3 w-3 text-muted-foreground" /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                      <p className="text-[10px] text-muted-foreground">{lead.ville}</p>
                    </div>
                  </div>
                  <div className="col-span-2 cursor-pointer" onClick={() => openHistory(lead)}><p className="text-sm text-foreground truncate">{lead.property}</p></div>
                  <div className="col-span-1"><p className="text-xs font-display font-bold text-foreground">{lead.prix}</p></div>
                  <div className="col-span-1"><Badge variant={lead.source === "LBC" ? "default" : lead.source === "LC" ? "violet" : "info"} className="text-[8px] font-display">{lead.source}</Badge></div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${getStatusDot(lead.status)}`} />
                    <span className="text-xs text-foreground truncate">{getStatusLabel(lead.status)}</span>
                  </div>
                  <div className="col-span-1">
                    <Badge variant={lead.heat === "hot" ? "hot" : lead.heat === "warm" ? "default" : "cold"} className="text-[8px]">
                      {lead.heat === "hot" ? "🔥" : lead.heat === "warm" ? "🌤" : "❄️"}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    {lead.hasPhone ? <Phone className="h-3.5 w-3.5 text-success" /> : <span className="text-[10px] text-muted-foreground">—</span>}
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2">
                          <MessageSquare className="h-2.5 w-2.5" /> SMS
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openReplyPopup(lead, "LBC")}><span className="text-xs font-display font-bold text-primary mr-2">LBC</span> Leboncoin</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openReplyPopup(lead, "WhatsApp")}><span className="text-xs font-display font-bold text-success mr-2">WA</span> WhatsApp</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openReplyPopup(lead, "SMS")}><span className="text-xs font-display font-bold text-info mr-2">SMS</span> SMS classique</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2" onClick={() => handleCall(lead)}>
                      <Phone className="h-2.5 w-2.5" /> Tél
                    </Button>
                    <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2" onClick={() => setTransferLead(lead)}>
                      <ArrowRightLeft className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lead History Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card p-0">
          {selectedLead && (
            <>
              {/* Photo header */}
              {selectedLead.photos && selectedLead.photos.length > 0 && (
                <div className="relative">
                  <img src={selectedLead.photos[currentPhoto]} alt={selectedLead.property} className="w-full h-64 object-cover" />
                  {selectedLead.photos.length > 1 && (
                    <>
                      <button className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 flex items-center justify-center text-foreground" onClick={() => setCurrentPhoto(p => p === 0 ? selectedLead.photos!.length - 1 : p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 flex items-center justify-center text-foreground" onClick={() => setCurrentPhoto(p => p === selectedLead.photos!.length - 1 ? 0 : p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-2 right-2 bg-background/80 rounded px-2 py-0.5 text-[10px] font-display text-foreground">
                    {currentPhoto + 1}/{selectedLead.photos.length}
                  </div>
                  <Badge variant="default" className="absolute top-3 left-3 font-display text-[10px]">{selectedLead.source}</Badge>
                </div>
              )}

              {/* Thumbnails */}
              {selectedLead.photos && selectedLead.photos.length > 1 && (
                <div className="flex gap-1.5 px-6 pt-4">
                  {selectedLead.photos.map((photo, i) => (
                    <img key={i} src={photo} alt={`Photo ${i + 1}`}
                      className={`h-12 w-16 object-cover rounded cursor-pointer border-2 shrink-0 transition-colors ${i === currentPhoto ? "border-primary" : "border-border"}`}
                      onClick={() => setCurrentPhoto(i)}
                    />
                  ))}
                </div>
              )}

              {/* Property Info */}
              <div className="px-6 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">{selectedLead.property}</h2>
                    <p className="text-sm text-muted-foreground">{selectedLead.ville}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-display font-bold text-primary">{selectedLead.prix}</p>
                    <div className="flex items-center gap-1.5 mt-1 justify-end">
                      <span className={`h-2 w-2 rounded-full ${getStatusDot(selectedLead.status)}`} />
                      <span className="text-xs text-foreground">{getStatusLabel(selectedLead.status)}</span>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-background rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedLead.name}</p>
                    {selectedLead.phone && <p className="text-xs text-primary">{selectedLead.phone}</p>}
                  </div>
                  <Badge variant={selectedLead.heat === "hot" ? "hot" : selectedLead.heat === "warm" ? "default" : "cold"} className="text-[10px] font-display ml-auto">
                    {selectedLead.heat === "hot" ? "🔥 Chaud" : selectedLead.heat === "warm" ? "🌤 Tiède" : "❄️ Froid"}
                  </Badge>
                </div>

                {/* Description */}
                {selectedLead.description && (
                  <>
                    <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2">Description</h3>
                    <p className="text-sm text-foreground leading-relaxed mb-6">{selectedLead.description}</p>
                  </>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mb-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" /> Écrire un message
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => { setSelectedLead(null); openReplyPopup(selectedLead, "LBC"); }}>
                        <span className="text-xs font-display font-bold text-primary mr-2">LBC</span> Leboncoin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedLead(null); openReplyPopup(selectedLead, "WhatsApp"); }}>
                        <span className="text-xs font-display font-bold text-success mr-2">WA</span> WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedLead(null); openReplyPopup(selectedLead, "SMS"); }}>
                        <span className="text-xs font-display font-bold text-info mr-2">SMS</span> SMS classique
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="attack" size="sm" className="text-xs gap-1.5" onClick={() => handleCall(selectedLead)}>
                    <Phone className="h-3.5 w-3.5" /> Appeler
                  </Button>
                </div>

                {/* History timeline */}
                <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-3">Historique des actions</h3>
                {selectedLead.history && selectedLead.history.length > 0 ? (
                  <div className="space-y-0">
                    {selectedLead.history.map((h, i) => (
                      <div key={i} className="flex gap-3 relative">
                        {i < selectedLead.history!.length - 1 && (
                          <div className="absolute left-[11px] top-6 w-px h-full bg-border" />
                        )}
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          h.channel === "Tél" ? "bg-primary/20" :
                          h.channel === "WA" ? "bg-success/20" :
                          h.channel === "SMS" ? "bg-info/20" :
                          h.channel === "LBC" || h.channel === "PAP" ? "bg-primary/20" :
                          h.channel === "Email" ? "bg-violet/20" :
                          "bg-muted"
                        }`}>
                          {h.channel === "Tél" ? <Phone className="h-3 w-3 text-primary" /> :
                           h.channel === "WA" ? <MessageSquare className="h-3 w-3 text-success" /> :
                           h.channel === "SMS" ? <MessageSquare className="h-3 w-3 text-info" /> :
                           h.channel === "LBC" || h.channel === "PAP" ? <Home className="h-3 w-3 text-primary" /> :
                           h.channel === "Email" ? <Send className="h-3 w-3 text-violet" /> :
                           <Clock className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <div className="pb-4 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{h.action}</p>
                            <Badge variant="secondary" className="text-[8px] font-display">{h.channel}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{h.detail}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5">{h.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun historique disponible</p>
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
                {replyTarget.lead.photos && replyTarget.lead.photos.length > 0 && (
                  <div className="w-48 h-36 shrink-0 bg-muted">
                    <img src={replyTarget.lead.photos[0]} alt={replyTarget.lead.property} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-foreground text-lg">{replyTarget.lead.property}</h3>
                      <p className="text-sm text-muted-foreground">{replyTarget.lead.ville}</p>
                    </div>
                    <p className="text-lg font-display font-bold text-primary">{replyTarget.lead.prix}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-3 p-2 bg-background rounded">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{replyTarget.lead.name}</p>
                      {replyTarget.lead.phone && <p className="text-xs text-primary">{replyTarget.lead.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs font-display gap-1"><Send className="h-3 w-3" /> {replyTarget.channel}</Badge>
                </div>
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
