import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, Phone, CalendarCheck, FileSignature, TrendingUp, Crosshair,
  Home, Mic, MessageSquare, User, Clock, Send, Sparkles,
  ChevronLeft, ChevronRight, ArrowRightLeft,
  Thermometer, Building2, Ruler, DoorOpen, BedDouble, Bath,
  Car, Compass, Zap, Flame,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TransferDialog } from "@/components/TransferDialog";
import { toast } from "sonner";

// ---------- types ----------

interface PropertyDetails {
  typeBien: string;
  surface: string;
  nbPieces: number;
  nbChambres: number;
  nbSDB: number;
  etat: string;
  etage?: number;
  nbEtagesImmeuble?: number;
  ascenseur?: boolean;
  anneeConstruction?: number;
  caracteristiques?: string[];
  exterieur?: string[];
  parking?: number;
  exposition?: string;
  typeVente?: string;
  typeChauffage?: string;
  modeChauffage?: string;
  classeEnergie?: string;
  ges?: string;
  coutEnergieMin?: number;
  coutEnergieMax?: number;
  taxeFonciere?: number;
  chargesCopro?: number;
}

interface RadarItem {
  id: number;
  type: string;
  surface: string;
  desc: string;
  ville: string;
  prix: string;
  temps: string;
  source: "LBC" | "PAP";
  isNew: boolean;
  photo: string;
  photos?: string[];
  description?: string;
  vendeur?: string;
  telephone?: string;
  email?: string;
  details?: PropertyDetails;
}

// ---------- KPI & Sources ----------

const kpis = [
  { label: "Propriétaires prospectés", value: "1 247", icon: Users, change: "+23 aujourd'hui" },
  { label: "Appels à passer", value: "38", icon: Phone, change: "12 urgents" },
  { label: "RDV prévus", value: "7", icon: CalendarCheck, change: "3 cette semaine" },
  { label: "Mandats signés", value: "4", icon: FileSignature, change: "+1 ce mois" },
  { label: "Vocaux déposés", value: "23", icon: Mic, change: "+5 aujourd'hui" },
];

const sources = [
  { name: "Leboncoin", total: 8432, today: 127, week: 843, color: "primary" as const },
  { name: "PAP", total: 3201, today: 54, week: 312, color: "info" as const },
];

// ---------- Radar data with full LBC details ----------

const radarData: RadarItem[] = [
  {
    id: 1, type: "Maison", surface: "120m²", desc: "Maison 120m² avec jardin", ville: "Lyon 3ème", prix: "450 000 €", temps: "2 min", source: "LBC", isNew: true,
    photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=260&fit=crop",
    photos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop"],
    description: "Magnifique maison de 120m² avec jardin arboré de 250m², garage double, 4 chambres, salon lumineux avec cheminée. Cuisine équipée ouverte sur séjour. DPE: C. Proche transports et commodités.",
    vendeur: "Jean-Marc Leblanc", telephone: "06 12 34 56 78", email: "jm.leblanc@email.com",
    details: {
      typeBien: "Maison", surface: "120 m²", nbPieces: 5, nbChambres: 4, nbSDB: 2, etat: "Bon état",
      etage: 0, anneeConstruction: 1985, caracteristiques: ["Cheminée", "Double vitrage", "Alarme"],
      exterieur: ["Jardin", "Terrasse"], parking: 2, exposition: "Sud-Ouest",
      typeVente: "Ancien", typeChauffage: "Individuel", modeChauffage: "Gaz",
      classeEnergie: "C", ges: "D", coutEnergieMin: 1200, coutEnergieMax: 1800,
      taxeFonciere: 1850, chargesCopro: 0,
    },
  },
  {
    id: 2, type: "Appartement", surface: "65m²", desc: "Appartement T3 lumineux", ville: "Paris 11ème", prix: "520 000 €", temps: "8 min", source: "PAP", isNew: true,
    photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop"],
    description: "Appartement T3 lumineux de 65m² au 4ème étage avec ascenseur. Séjour double, 2 chambres, balcon filant. Parquet chêne massif. Quartier très recherché.",
    vendeur: "Sophie Martin", telephone: "06 23 45 67 89", email: "s.martin@email.com",
    details: {
      typeBien: "Appartement", surface: "65 m²", nbPieces: 3, nbChambres: 2, nbSDB: 1, etat: "Bon état",
      etage: 4, nbEtagesImmeuble: 6, ascenseur: true, anneeConstruction: 1920,
      caracteristiques: ["Parquet", "Moulures", "Double vitrage"], exterieur: ["Balcon"],
      parking: 0, exposition: "Sud", typeVente: "Ancien",
      typeChauffage: "Collectif", modeChauffage: "Gaz", classeEnergie: "D", ges: "D",
      coutEnergieMin: 900, coutEnergieMax: 1400,
      taxeFonciere: 980, chargesCopro: 3600,
    },
  },
  {
    id: 3, type: "Maison", surface: "200m²", desc: "Villa contemporaine piscine", ville: "Aix-en-Provence", prix: "890 000 €", temps: "15 min", source: "LBC", isNew: false,
    photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop",
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=260&fit=crop"],
    description: "Villa contemporaine 200m² avec piscine, terrain 800m², 5 chambres, suite parentale, bureau. Vue dégagée. DPE: B. Calme absolu.",
    vendeur: "Pierre Duval", telephone: "", email: "p.duval@email.com",
    details: {
      typeBien: "Maison", surface: "200 m²", nbPieces: 7, nbChambres: 5, nbSDB: 3, etat: "Bon état",
      anneeConstruction: 2015, caracteristiques: ["Piscine", "Domotique", "Climatisation", "Alarme"],
      exterieur: ["Jardin", "Terrasse", "Piscine"], parking: 3, exposition: "Sud",
      typeVente: "Ancien", typeChauffage: "Individuel", modeChauffage: "Pompe à chaleur",
      classeEnergie: "B", ges: "B", coutEnergieMin: 800, coutEnergieMax: 1200,
      taxeFonciere: 3200, chargesCopro: 0,
    },
  },
  {
    id: 4, type: "Appartement", surface: "42m²", desc: "T2 rénové centre-ville", ville: "Bordeaux", prix: "245 000 €", temps: "22 min", source: "LBC", isNew: false,
    photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop"],
    description: "T2 rénové de 42m², cuisine américaine, chambre avec placard, salle d'eau moderne. Résidence calme, proche tram.",
    vendeur: "Marie Rousseau", telephone: "06 45 67 89 01", email: "m.rousseau@email.com",
    details: {
      typeBien: "Appartement", surface: "42 m²", nbPieces: 2, nbChambres: 1, nbSDB: 1, etat: "Refait à neuf",
      etage: 2, nbEtagesImmeuble: 4, ascenseur: false, anneeConstruction: 1970,
      caracteristiques: ["Double vitrage", "Interphone"], exterieur: [],
      parking: 1, exposition: "Est", typeVente: "Ancien",
      typeChauffage: "Individuel", modeChauffage: "Électrique", classeEnergie: "D", ges: "C",
      coutEnergieMin: 600, coutEnergieMax: 900,
      taxeFonciere: 620, chargesCopro: 1800,
    },
  },
  {
    id: 5, type: "Maison", surface: "150m²", desc: "Maison de ville 5 pièces", ville: "Nantes", prix: "380 000 €", temps: "35 min", source: "PAP", isNew: false,
    photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop"],
    description: "Maison de ville 150m² sur 3 niveaux, 4 chambres, jardin 100m², garage. Proche centre-ville. DPE: D.",
    vendeur: "Laurent Petit", email: "l.petit@email.com",
    details: {
      typeBien: "Maison", surface: "150 m²", nbPieces: 5, nbChambres: 4, nbSDB: 1, etat: "Bon état",
      anneeConstruction: 1930, caracteristiques: ["Cheminée", "Cave"],
      exterieur: ["Jardin"], parking: 1, exposition: "Ouest", typeVente: "Ancien",
      typeChauffage: "Individuel", modeChauffage: "Gaz", classeEnergie: "D", ges: "E",
      coutEnergieMin: 1500, coutEnergieMax: 2200,
      taxeFonciere: 1400, chargesCopro: 0,
    },
  },
  {
    id: 6, type: "Appartement", surface: "85m²", desc: "T4 dernier étage terrasse", ville: "Marseille 8ème", prix: "310 000 €", temps: "47 min", source: "LBC", isNew: false,
    photo: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=260&fit=crop",
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=260&fit=crop"],
    description: "T4 avec terrasse de 20m², vue mer, 3 chambres, cuisine équipée, parking. Résidence récente avec piscine.",
    vendeur: "Claire Bernard", telephone: "06 78 90 12 34", email: "c.bernard@email.com",
    details: {
      typeBien: "Appartement", surface: "85 m²", nbPieces: 4, nbChambres: 3, nbSDB: 1, etat: "Bon état",
      etage: 5, nbEtagesImmeuble: 5, ascenseur: true, anneeConstruction: 2018,
      caracteristiques: ["Climatisation", "Double vitrage", "Interphone", "Digicode"],
      exterieur: ["Terrasse", "Piscine collective"], parking: 1, exposition: "Sud-Est",
      typeVente: "Ancien", typeChauffage: "Individuel", modeChauffage: "Électrique",
      classeEnergie: "B", ges: "A", coutEnergieMin: 500, coutEnergieMax: 800,
      taxeFonciere: 890, chargesCopro: 2400,
    },
  },
];

// ---------- Helpers ----------

const dpeColors: Record<string, string> = {
  A: "bg-green-600", B: "bg-green-500", C: "bg-yellow-500", D: "bg-orange-400",
  E: "bg-orange-500", F: "bg-red-500", G: "bg-red-700",
};

function DpeBadge({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground uppercase font-display">{label}</span>
      <span className={`text-[10px] text-white font-bold px-2 py-0.5 rounded ${dpeColors[value] || "bg-muted"}`}>{value}</span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | undefined | boolean }) {
  if (value === undefined || value === null || value === "") return null;
  const display = typeof value === "boolean" ? (value ? "Oui" : "Non") : String(value);
  return (
    <div className="flex items-center gap-2 py-1.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-foreground ml-auto">{display}</span>
    </div>
  );
}

// ---------- Component ----------

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState<RadarItem | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [transferItem, setTransferItem] = useState<RadarItem | null>(null);
  const [replyTarget, setReplyTarget] = useState<{ item: RadarItem; channel: string } | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const openDetail = (item: RadarItem) => { setSelectedItem(item); setCurrentPhoto(0); };

  const openReplyPopup = (item: RadarItem, channel: string) => {
    setReplyTarget({ item, channel });
    setAiLoading(true);
    setTimeout(() => {
      setReplyMessage(`Bonjour ${item.vendeur?.split(" ")[0] || ""}, j'ai vu votre annonce "${item.desc}" à ${item.ville} (${item.prix}). J'ai actuellement des acquéreurs qualifiés intéressés par ce type de bien. Seriez-vous disponible pour un échange rapide ?`);
      setAiLoading(false);
    }, 800);
  };

  const sendReply = () => {
    if (!replyTarget || !replyMessage.trim()) return;
    toast.success(`📩 ${replyTarget.channel} envoyé à ${replyTarget.item.vendeur}`);
    setReplyTarget(null); setReplyMessage("");
  };

  const handleCall = (item: RadarItem) => { toast.success(`📞 Appel en cours vers ${item.vendeur}...`); };

  const d = selectedItem?.details;

  return (
    <AppLayout>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de votre activité de prospection</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center"><kpi.icon className="h-5 w-5 text-primary" /></div>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              <p className="text-[10px] text-success mt-1">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {sources.map((src) => (
          <Card key={src.name} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">{src.name}</h3>
                </div>
                <Badge variant={src.color === "primary" ? "default" : "info"} className="text-[10px]">ACTIF</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-xl font-display font-bold text-foreground">{src.total.toLocaleString()}</p><p className="text-[10px] text-muted-foreground uppercase">Total</p></div>
                <div><p className="text-xl font-display font-bold text-primary">+{src.today}</p><p className="text-[10px] text-muted-foreground uppercase">Aujourd'hui</p></div>
                <div><p className="text-xl font-display font-bold text-foreground">{src.week}</p><p className="text-[10px] text-muted-foreground uppercase">7 jours</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Radar Live */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">Radar Live — Derniers Biens Publiés</h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] font-display">{radarData.length} BIENS</Badge>
              <Crosshair className="h-4 w-4 text-primary" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Photo</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Bien</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Ville</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Prix</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Temps</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Source</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {radarData.map((item) => (
                <TableRow key={item.id} className={`border-border hover:bg-accent/50 transition-colors ${item.isNew ? "radar-flash" : ""}`}>
                  <TableCell>
                    <img src={item.photo} alt={item.desc} className="h-10 w-16 object-cover rounded cursor-pointer" onClick={() => openDetail(item)} />
                  </TableCell>
                  <TableCell>
                    <div className="cursor-pointer" onClick={() => openDetail(item)}>
                      <p className="text-sm font-medium text-foreground">{item.desc}</p>
                      <p className="text-[10px] text-muted-foreground">{item.type} · {item.surface}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{item.ville}</TableCell>
                  <TableCell className="text-sm font-display font-bold text-foreground">{item.prix}</TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${item.temps.includes("min") && parseInt(item.temps) <= 10 ? "text-primary" : "text-muted-foreground"}`}>
                      {item.temps}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.source === "LBC" ? "default" : "info"} className="text-[10px] font-display">{item.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="attack" size="sm" className="text-xs"><Crosshair className="h-3 w-3" /> Attaquer</Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 px-2"><MessageSquare className="h-2.5 w-2.5" /> SMS</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openReplyPopup(item, "LBC")}><span className="text-xs font-display font-bold text-primary mr-2">LBC</span> Leboncoin</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openReplyPopup(item, "WhatsApp")}><span className="text-xs font-display font-bold text-success mr-2">WA</span> WhatsApp</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openReplyPopup(item, "SMS")}><span className="text-xs font-display font-bold text-info mr-2">SMS</span> SMS classique</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 px-2" onClick={() => handleCall(item)}>
                        <Phone className="h-2.5 w-2.5" /> Tél
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 px-2" onClick={() => setTransferItem(item)}>
                        <ArrowRightLeft className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog — full LBC info */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card p-0">
          {selectedItem && (
            <>
              {/* Photo carousel */}
              {selectedItem.photos && selectedItem.photos.length > 0 && (
                <div className="relative">
                  <img src={selectedItem.photos[currentPhoto]} alt={selectedItem.desc} className="w-full h-64 object-cover" />
                  {selectedItem.photos.length > 1 && (
                    <>
                      <button className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 flex items-center justify-center text-foreground" onClick={() => setCurrentPhoto(p => p === 0 ? selectedItem.photos!.length - 1 : p - 1)}><ChevronLeft className="h-4 w-4" /></button>
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 flex items-center justify-center text-foreground" onClick={() => setCurrentPhoto(p => p === selectedItem.photos!.length - 1 ? 0 : p + 1)}><ChevronRight className="h-4 w-4" /></button>
                    </>
                  )}
                  <div className="absolute bottom-2 right-2 bg-background/80 rounded px-2 py-0.5 text-[10px] font-display text-foreground">{currentPhoto + 1}/{selectedItem.photos.length}</div>
                  <Badge variant="default" className="absolute top-3 left-3 font-display text-[10px]">{selectedItem.source}</Badge>
                </div>
              )}

              {/* Thumbnails */}
              {selectedItem.photos && selectedItem.photos.length > 1 && (
                <div className="flex gap-1.5 px-6 pt-4">
                  {selectedItem.photos.map((photo, i) => (
                    <img key={i} src={photo} alt={`Photo ${i + 1}`} className={`h-12 w-16 object-cover rounded cursor-pointer border-2 shrink-0 transition-colors ${i === currentPhoto ? "border-primary" : "border-border"}`} onClick={() => setCurrentPhoto(i)} />
                  ))}
                </div>
              )}

              <div className="px-6 py-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">{selectedItem.desc}</h2>
                    <p className="text-sm text-muted-foreground">{selectedItem.ville}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Publié il y a {selectedItem.temps}</p>
                  </div>
                  <p className="text-xl font-display font-bold text-primary">{selectedItem.prix}</p>
                </div>

                {/* Contact */}
                {selectedItem.vendeur && (
                  <div className="flex items-center gap-3 mb-4 p-3 bg-background rounded-lg">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{selectedItem.vendeur}</p>
                      {selectedItem.telephone && <p className="text-xs text-primary">{selectedItem.telephone}</p>}
                      {selectedItem.email && <p className="text-[10px] text-muted-foreground">{selectedItem.email}</p>}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mb-5">
                  <Button variant="attack" size="sm" className="text-xs gap-1.5"><Crosshair className="h-3.5 w-3.5" /> Attaquer</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Écrire</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => { setSelectedItem(null); openReplyPopup(selectedItem, "LBC"); }}><span className="text-xs font-display font-bold text-primary mr-2">LBC</span> Leboncoin</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedItem(null); openReplyPopup(selectedItem, "WhatsApp"); }}><span className="text-xs font-display font-bold text-success mr-2">WA</span> WhatsApp</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedItem(null); openReplyPopup(selectedItem, "SMS"); }}><span className="text-xs font-display font-bold text-info mr-2">SMS</span> SMS classique</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => handleCall(selectedItem)}><Phone className="h-3.5 w-3.5" /> Appeler</Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => { setSelectedItem(null); setTransferItem(selectedItem); }}><ArrowRightLeft className="h-3.5 w-3.5" /> Transférer</Button>
                </div>

                {/* Description */}
                {selectedItem.description && (
                  <>
                    <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2">Description de l'annonce</h3>
                    <p className="text-sm text-foreground leading-relaxed mb-5">{selectedItem.description}</p>
                  </>
                )}

                {/* Detailed LBC info */}
                {d && (
                  <div className="space-y-5">
                    {/* Critères principaux */}
                    <div>
                      <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2">Critères du bien</h3>
                      <div className="grid grid-cols-2 gap-x-6 bg-background rounded-lg p-3">
                        <InfoRow icon={Building2} label="Type" value={d.typeBien} />
                        <InfoRow icon={Ruler} label="Surface" value={d.surface} />
                        <InfoRow icon={DoorOpen} label="Pièces" value={d.nbPieces} />
                        <InfoRow icon={BedDouble} label="Chambres" value={d.nbChambres} />
                        <InfoRow icon={Bath} label="Salles de bain" value={d.nbSDB} />
                        <InfoRow icon={Home} label="État" value={d.etat} />
                        {d.etage !== undefined && <InfoRow icon={Building2} label="Étage" value={d.etage === 0 ? "RDC" : `${d.etage}/${d.nbEtagesImmeuble || "?"}`} />}
                        <InfoRow icon={Building2} label="Ascenseur" value={d.ascenseur} />
                        <InfoRow icon={Clock} label="Construction" value={d.anneeConstruction} />
                        <InfoRow icon={Car} label="Parking" value={d.parking ? `${d.parking} place(s)` : undefined} />
                        <InfoRow icon={Compass} label="Exposition" value={d.exposition} />
                        <InfoRow icon={Home} label="Type de vente" value={d.typeVente} />
                      </div>
                    </div>

                    {/* Caractéristiques & extérieur */}
                    {((d.caracteristiques && d.caracteristiques.length > 0) || (d.exterieur && d.exterieur.length > 0)) && (
                      <div>
                        <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2">Atouts</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {d.caracteristiques?.map((c) => <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>)}
                          {d.exterieur?.map((e) => <Badge key={e} variant="outline" className="text-[10px] border-success/30 text-success">{e}</Badge>)}
                        </div>
                      </div>
                    )}

                    {/* Performance énergétique */}
                    <div>
                      <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2">Performance énergétique</h3>
                      <div className="bg-background rounded-lg p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-x-6">
                          <InfoRow icon={Flame} label="Chauffage" value={d.typeChauffage} />
                          <InfoRow icon={Zap} label="Mode" value={d.modeChauffage} />
                        </div>
                        <div className="flex items-center gap-4 pt-1">
                          <DpeBadge label="Classe énergie" value={d.classeEnergie} />
                          <DpeBadge label="GES" value={d.ges} />
                        </div>
                        {(d.coutEnergieMin || d.coutEnergieMax) && (
                          <p className="text-[10px] text-muted-foreground">Coût annuel estimé : {d.coutEnergieMin?.toLocaleString()} € – {d.coutEnergieMax?.toLocaleString()} €</p>
                        )}
                      </div>
                    </div>

                    {/* Charges */}
                    {(d.taxeFonciere || d.chargesCopro) ? (
                      <div>
                        <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2">Charges</h3>
                        <div className="bg-background rounded-lg p-3 grid grid-cols-2 gap-x-6">
                          <InfoRow icon={Home} label="Taxe foncière" value={d.taxeFonciere ? `${d.taxeFonciere.toLocaleString()} €/an` : undefined} />
                          <InfoRow icon={Building2} label="Charges copro" value={d.chargesCopro ? `${d.chargesCopro.toLocaleString()} €/an` : undefined} />
                        </div>
                      </div>
                    ) : null}
                  </div>
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
                  <img src={replyTarget.item.photo} alt={replyTarget.item.desc} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-foreground text-lg">{replyTarget.item.desc}</h3>
                      <p className="text-sm text-muted-foreground">{replyTarget.item.ville}</p>
                    </div>
                    <p className="text-lg font-display font-bold text-primary">{replyTarget.item.prix}</p>
                  </div>
                  {replyTarget.item.vendeur && (
                    <div className="flex items-center gap-3 mt-3 p-2 bg-background rounded">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{replyTarget.item.vendeur}</p>
                        {replyTarget.item.telephone && <p className="text-xs text-primary">{replyTarget.item.telephone}</p>}
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
        open={!!transferItem}
        onOpenChange={(open) => !open && setTransferItem(null)}
        propertyName={transferItem?.desc}
        ville={transferItem?.ville}
        prix={transferItem?.prix}
      />
    </AppLayout>
  );
};

export default Dashboard;
