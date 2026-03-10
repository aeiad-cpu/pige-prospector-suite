import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, Filter, User, Phone, Home, MessageSquare, Clock, ChevronLeft, ChevronRight, Images,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";

interface Lead {
  id: number;
  name: string;
  phone: string;
  property: string;
  ville: string;
  prix: string;
  surface: string;
  status: string;
  source: string;
  lastContact: string;
  description: string;
  photos: string[];
  history: { date: string; action: string; channel: string; detail: string }[];
}

const leadsData: Lead[] = [
  {
    id: 1, name: "Jean-Marc Leblanc", phone: "06 12 34 56 78", property: "Maison 120m²", ville: "Lyon", prix: "450 000 €", surface: "120m²", status: "Chaud", source: "LBC", lastContact: "Aujourd'hui",
    description: "Magnifique maison de 120m² avec jardin arboré de 250m², garage double, 4 chambres, salon lumineux avec cheminée. Cuisine équipée ouverte. DPE: C. Proximité métro ligne D.",
    photos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=260&fit=crop"],
    history: [
      { date: "10/03 09:12", action: "SMS Auto envoyé", channel: "LBC", detail: "Message de premier contact envoyé automatiquement" },
      { date: "09/03 14:30", action: "Appel sortant", channel: "Tél", detail: "Pas de réponse — messagerie pleine" },
      { date: "08/03 08:00", action: "Bien détecté", channel: "Système", detail: "Annonce détectée sur Leboncoin — ajouté au pipeline" },
    ],
  },
  {
    id: 2, name: "Sophie Martin", phone: "06 23 45 67 89", property: "T3 65m²", ville: "Paris 11", prix: "520 000 €", surface: "65m²", status: "Chaud", source: "PAP", lastContact: "Hier",
    description: "Appartement T3 lumineux de 65m² au 4ème étage avec ascenseur. Séjour double, 2 chambres, balcon filant. Parquet chêne, moulures. Cave.",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop"],
    history: [
      { date: "09/03 16:00", action: "Message WhatsApp", channel: "WA", detail: "Réponse positive — intéressée par un RDV" },
      { date: "09/03 10:00", action: "SMS envoyé", channel: "SMS", detail: "Relance personnalisée" },
      { date: "08/03 09:00", action: "Bien détecté", channel: "Système", detail: "Annonce détectée sur PAP" },
    ],
  },
  {
    id: 3, name: "Pierre Duval", phone: "06 34 56 78 90", property: "Villa 200m²", ville: "Aix", prix: "890 000 €", surface: "200m²", status: "Froid", source: "LBC", lastContact: "Il y a 3j",
    description: "Villa contemporaine 200m² avec piscine, terrain 800m², 5 chambres, suite parentale, bureau. Vue dégagée. DPE: B.",
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop"],
    history: [
      { date: "07/03 11:00", action: "SMS Auto envoyé", channel: "LBC", detail: "Pas de réponse" },
      { date: "07/03 08:00", action: "Bien détecté", channel: "Système", detail: "Annonce détectée sur Leboncoin" },
    ],
  },
  {
    id: 4, name: "Marie Rousseau", phone: "06 45 67 89 01", property: "T2 42m²", ville: "Bordeaux", prix: "245 000 €", surface: "42m²", status: "Tiède", source: "LBC", lastContact: "Il y a 5j",
    description: "T2 rénové de 42m², cuisine américaine, chambre avec placard, salle d'eau moderne. Résidence calme avec gardien.",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop"],
    history: [
      { date: "05/03 14:00", action: "Appel sortant", channel: "Tél", detail: "Discussion 5 min — réflexion en cours" },
      { date: "04/03 09:00", action: "SMS Auto envoyé", channel: "LBC", detail: "Premier contact" },
    ],
  },
  {
    id: 5, name: "Laurent Petit", phone: "06 56 78 90 12", property: "Maison 150m²", ville: "Nantes", prix: "380 000 €", surface: "150m²", status: "Froid", source: "PAP", lastContact: "Il y a 7j",
    description: "Maison de ville 150m² sur 3 niveaux, 4 chambres, jardin 100m², garage. Proche centre-ville et gare.",
    photos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=260&fit=crop"],
    history: [
      { date: "03/03 10:00", action: "Message PAP", channel: "LBC", detail: "Pas de réponse" },
    ],
  },
  {
    id: 6, name: "Claire Bernard", phone: "06 67 89 01 23", property: "T4 85m²", ville: "Marseille", prix: "310 000 €", surface: "85m²", status: "RDV fixé", source: "LBC", lastContact: "Aujourd'hui",
    description: "T4 avec terrasse de 20m², vue mer, 3 chambres, cuisine équipée, parking en sous-sol. Résidence récente.",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=260&fit=crop"],
    history: [
      { date: "10/03 09:00", action: "RDV confirmé", channel: "Tél", detail: "RDV estimation prévu le 12/03 à 14h" },
      { date: "09/03 15:00", action: "Appel sortant", channel: "Tél", detail: "Intéressée, RDV proposé" },
      { date: "08/03 09:00", action: "SMS Auto envoyé", channel: "LBC", detail: "Premier contact automatique" },
    ],
  },
  {
    id: 7, name: "François Moreau", phone: "06 78 90 12 34", property: "Maison 95m²", ville: "Toulouse", prix: "275 000 €", surface: "95m²", status: "Chaud", source: "PAP", lastContact: "Hier",
    description: "Plain-pied 95m², 3 chambres, jardin 350m², véranda. Quartier résidentiel calme. DPE: D.",
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop"],
    history: [
      { date: "09/03 17:00", action: "WhatsApp vocal", channel: "WA", detail: "Message vocal envoyé — 15s" },
      { date: "09/03 10:00", action: "Bien détecté", channel: "Système", detail: "PAP — ajouté au pipeline" },
    ],
  },
  {
    id: 8, name: "Isabelle Leroy", phone: "06 89 01 23 45", property: "Duplex 110m²", ville: "Strasbourg", prix: "425 000 €", surface: "110m²", status: "Froid", source: "LBC", lastContact: "Il y a 10j",
    description: "Duplex 110m² en dernier étage, rooftop privé 40m², 3 chambres, 2 SDB, parking. Quartier Orangerie.",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop"],
    history: [
      { date: "28/02 09:00", action: "SMS Auto envoyé", channel: "LBC", detail: "Pas de réponse" },
    ],
  },
];

const BaseVendeurs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const filtered = leadsData.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return l.name.toLowerCase().includes(q) || l.property.toLowerCase().includes(q) || l.ville.toLowerCase().includes(q);
  });

  const handleSms = (channel: string, name: string) => {
    toast.success(`📩 ${channel} envoyé à ${name}`);
  };

  const handleCall = (name: string) => {
    toast.success(`📞 Appel en cours vers ${name}...`);
  };

  const openHistory = (lead: Lead) => {
    setSelectedLead(lead);
    setCurrentPhoto(0);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Base de biens (leads)</h1>
        <p className="text-sm text-muted-foreground mt-1">Tous vos biens en prospection</p>
      </div>

      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Bien, ville, vendeur..."
            className="pl-10 h-9 text-sm bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Badge variant="secondary" className="text-[10px] font-display">
          {filtered.length} bien{filtered.length > 1 ? "s" : ""}
        </Badge>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Bien</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Vendeur</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Ville</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Prix</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Statut</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Source</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Dernier contact</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.id} className="border-border hover:bg-accent/50 cursor-pointer" onClick={() => openHistory(v)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-14 rounded overflow-hidden shrink-0 bg-muted">
                        <img src={v.photos[0]} alt={v.property} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{v.property}</p>
                        <p className="text-[10px] text-muted-foreground">{v.surface}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-foreground">{v.name}</p>
                      <p className="text-[10px] text-muted-foreground">{v.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{v.ville}</TableCell>
                  <TableCell className="text-sm font-display font-bold text-foreground">{v.prix}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        v.status === "Chaud" ? "hot" :
                        v.status === "RDV fixé" ? "success" :
                        v.status === "Tiède" ? "default" : "cold"
                      }
                      className="text-[10px] font-display"
                    >
                      {v.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={v.source === "LBC" ? "default" : "info"} className="text-[8px] font-display">
                      {v.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{v.lastContact}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs gap-1 h-7">
                            <MessageSquare className="h-3 w-3" />
                            SMS
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSms("LBC", v.name)}>
                            <span className="text-xs font-display font-bold text-primary mr-2">LBC</span>
                            Leboncoin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSms("WhatsApp", v.name)}>
                            <span className="text-xs font-display font-bold text-success mr-2">WA</span>
                            WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSms("SMS", v.name)}>
                            <span className="text-xs font-display font-bold text-info mr-2">SMS</span>
                            SMS classique
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleCall(v.name)}>
                        <Phone className="h-3.5 w-3.5 text-primary" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-xs text-muted-foreground">1-{filtered.length} sur {leadsData.length} biens</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="text-xs h-7" disabled>Précédent</Button>
              <Button variant="outline" size="sm" className="text-xs h-7">Suivant</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card p-0">
          {selectedLead && (
            <>
              {/* Photo Header */}
              <div className="relative">
                <img
                  src={selectedLead.photos[currentPhoto]}
                  alt={selectedLead.property}
                  className="w-full h-64 object-cover"
                />
                {selectedLead.photos.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 flex items-center justify-center text-foreground hover:bg-background"
                      onClick={() => setCurrentPhoto(p => p === 0 ? selectedLead.photos.length - 1 : p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 flex items-center justify-center text-foreground hover:bg-background"
                      onClick={() => setCurrentPhoto(p => p === selectedLead.photos.length - 1 ? 0 : p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-2 right-2 bg-background/80 rounded px-2 py-0.5 text-[10px] font-display text-foreground">
                  {currentPhoto + 1}/{selectedLead.photos.length}
                </div>
                <Badge variant="default" className="absolute top-3 left-3 font-display text-[10px]">
                  {selectedLead.source}
                </Badge>
              </div>

              {/* Thumbnails */}
              {selectedLead.photos.length > 1 && (
                <div className="flex gap-1.5 px-6 pt-4">
                  {selectedLead.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`Photo ${i + 1}`}
                      className={`h-12 w-16 object-cover rounded cursor-pointer border-2 shrink-0 transition-colors ${
                        i === currentPhoto ? "border-primary" : "border-border hover:border-muted-foreground"
                      }`}
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
                    <Badge
                      variant={
                        selectedLead.status === "Chaud" ? "hot" :
                        selectedLead.status === "RDV fixé" ? "success" :
                        selectedLead.status === "Tiède" ? "default" : "cold"
                      }
                      className="text-[10px] font-display mt-1"
                    >
                      {selectedLead.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4 p-3 bg-background rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedLead.name}</p>
                    <p className="text-xs text-primary">{selectedLead.phone}</p>
                  </div>
                </div>

                <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2">Description</h3>
                <p className="text-sm text-foreground leading-relaxed mb-6">{selectedLead.description}</p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mb-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Envoyer un message
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleSms("LBC", selectedLead.name)}>
                        <span className="text-xs font-display font-bold text-primary mr-2">LBC</span> Leboncoin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSms("WhatsApp", selectedLead.name)}>
                        <span className="text-xs font-display font-bold text-success mr-2">WA</span> WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSms("SMS", selectedLead.name)}>
                        <span className="text-xs font-display font-bold text-info mr-2">SMS</span> SMS classique
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="attack" size="sm" className="text-xs gap-1.5" onClick={() => handleCall(selectedLead.name)}>
                    <Phone className="h-3.5 w-3.5" />
                    Appeler
                  </Button>
                </div>

                {/* History Timeline */}
                <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Historique des actions
                </h3>
                <div className="space-y-0">
                  {selectedLead.history.map((h, i) => (
                    <div key={i} className="flex gap-3 relative">
                      {/* Timeline line */}
                      {i < selectedLead.history.length - 1 && (
                        <div className="absolute left-[11px] top-6 w-px h-full bg-border" />
                      )}
                      {/* Dot */}
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        h.channel === "Tél" ? "bg-primary/20" :
                        h.channel === "WA" ? "bg-success/20" :
                        h.channel === "SMS" ? "bg-info/20" :
                        h.channel === "LBC" ? "bg-primary/20" :
                        "bg-muted"
                      }`}>
                        {h.channel === "Tél" ? <Phone className="h-3 w-3 text-primary" /> :
                         h.channel === "WA" ? <MessageSquare className="h-3 w-3 text-success" /> :
                         h.channel === "SMS" ? <MessageSquare className="h-3 w-3 text-info" /> :
                         h.channel === "LBC" ? <Home className="h-3 w-3 text-primary" /> :
                         <Clock className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      {/* Content */}
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default BaseVendeurs;
