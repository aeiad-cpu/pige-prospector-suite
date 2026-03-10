import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, Phone, User, MessageSquare, Home, Clock, ChevronLeft, ChevronRight, Sparkles, Send, Pencil } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";

interface NoShow {
  id: number;
  name: string;
  phone: string;
  property: string;
  ville: string;
  prix: string;
  date: string;
  attempts: number;
  photos: string[];
  description: string;
  history: { date: string; action: string; channel: string; detail: string }[];
}

const noshows: NoShow[] = [
  {
    id: 1, name: "Marc Lefevre", phone: "06 11 22 33 44", property: "T3 75m²", ville: "Nice", prix: "320 000 €", date: "08/03/2026 14:00", attempts: 2,
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop"],
    description: "T3 de 75m² avec balcon, 2 chambres, cuisine équipée, parking. Résidence sécurisée proche plage.",
    history: [
      { date: "08/03 14:00", action: "RDV non honoré", channel: "Système", detail: "Le vendeur ne s'est pas présenté au RDV" },
      { date: "08/03 14:15", action: "Appel de relance", channel: "Tél", detail: "Pas de réponse" },
      { date: "07/03 10:00", action: "Confirmation RDV", channel: "SMS", detail: "RDV confirmé par SMS" },
      { date: "05/03 16:00", action: "RDV fixé", channel: "Tél", detail: "RDV estimation prévu le 08/03 à 14h" },
    ],
  },
  {
    id: 2, name: "Julie Perrin", phone: "06 22 33 44 55", property: "Maison 140m²", ville: "Montpellier", prix: "480 000 €", date: "07/03/2026 10:30", attempts: 1,
    photos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=260&fit=crop"],
    description: "Maison 140m² avec jardin 300m², 4 chambres, garage. Quartier résidentiel calme.",
    history: [
      { date: "07/03 10:30", action: "RDV non honoré", channel: "Système", detail: "Absente au RDV — porte fermée" },
      { date: "06/03 18:00", action: "SMS de confirmation", channel: "SMS", detail: "Confirmé" },
    ],
  },
  {
    id: 3, name: "David Simon", phone: "06 33 44 55 66", property: "T2 50m²", ville: "Rennes", prix: "195 000 €", date: "06/03/2026 16:00", attempts: 3,
    photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=260&fit=crop"],
    description: "T2 de 50m² refait à neuf, cuisine ouverte, chambre spacieuse. Proche gare et centre.",
    history: [
      { date: "06/03 16:00", action: "RDV non honoré", channel: "Système", detail: "3ème absence consécutive" },
      { date: "06/03 16:10", action: "Appel relance", channel: "Tél", detail: "Téléphone éteint" },
      { date: "05/03 16:00", action: "2ème RDV annulé", channel: "Tél", detail: "Annulé 30 min avant" },
    ],
  },
  {
    id: 4, name: "Nathalie Faure", phone: "06 44 55 66 77", property: "Villa 180m²", ville: "Cannes", prix: "950 000 €", date: "05/03/2026 11:00", attempts: 1,
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop"],
    description: "Villa 180m² avec vue mer, piscine, 5 chambres, terrain 600m². Quartier Californie.",
    history: [
      { date: "05/03 11:00", action: "RDV non honoré", channel: "Système", detail: "Absence sans prévenir" },
    ],
  },
];

const NoShows = () => {
  const [selectedNoShow, setSelectedNoShow] = useState<NoShow | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  // Reply popup state
  const [replyTarget, setReplyTarget] = useState<{ noshow: NoShow; channel: string } | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const openReplyPopup = (noshow: NoShow, channel: string) => {
    setReplyTarget({ noshow, channel });
    // Auto-generate AI reply
    setAiLoading(true);
    setTimeout(() => {
      const msg = `Bonjour ${noshow.name.split(" ")[0]}, je me permets de revenir vers vous suite à notre rendez-vous manqué du ${noshow.date}. Votre ${noshow.property} à ${noshow.ville} (${noshow.prix}) suscite un réel intérêt auprès de nos acquéreurs. Souhaitez-vous que nous reprogrammions un créneau à votre convenance ?`;
      setReplyMessage(msg);
      setAiLoading(false);
    }, 800);
  };

  const sendReply = () => {
    if (!replyTarget || !replyMessage.trim()) return;
    toast.success(`📩 ${replyTarget.channel} envoyé à ${replyTarget.noshow.name}`);
    setReplyTarget(null);
    setReplyMessage("");
  };

  const handleCall = (name: string) => {
    toast.success(`📞 Appel en cours vers ${name}...`);
  };

  const openHistory = (n: NoShow) => {
    setSelectedNoShow(n);
    setCurrentPhoto(0);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Rendez-vous annulés</h1>
        <p className="text-sm text-muted-foreground mt-1">RDV manqués — relance prioritaire</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="font-display text-xs uppercase tracking-wider text-foreground font-bold">
              {noshows.length} rendez-vous annulés à traiter
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Bien</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Vendeur</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">RDV prévu</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Tentatives</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {noshows.map((n) => (
                <TableRow key={n.id} className="border-border hover:bg-accent/50 cursor-pointer" onClick={() => openHistory(n)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-14 rounded overflow-hidden shrink-0 bg-muted">
                        <img src={n.photos[0]} alt={n.property} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{n.property}</p>
                        <p className="text-[10px] text-muted-foreground">{n.ville} — {n.prix}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-foreground">{n.name}</p>
                      <p className="text-[10px] text-muted-foreground">{n.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-destructive font-medium">{n.date}</TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="text-[10px] font-display">{n.attempts}x</Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs gap-1 h-7">
                            <MessageSquare className="h-3 w-3" /> Écrire
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openReplyPopup(n, "LBC")}>
                            <span className="text-xs font-display font-bold text-primary mr-2">LBC</span> Leboncoin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openReplyPopup(n, "WhatsApp")}>
                            <span className="text-xs font-display font-bold text-success mr-2">WA</span> WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openReplyPopup(n, "SMS")}>
                            <span className="text-xs font-display font-bold text-info mr-2">SMS</span> SMS classique
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="attack" size="sm" className="text-xs gap-1 h-7" onClick={() => handleCall(n.name)}>
                        <Phone className="h-3 w-3" /> Appeler
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reply Popup — Cockpit-style */}
      <Dialog open={!!replyTarget} onOpenChange={(open) => !open && setReplyTarget(null)}>
        <DialogContent className="max-w-2xl bg-card p-0 overflow-hidden">
          {replyTarget && (
            <>
              {/* Property preview */}
              <div className="flex border-b border-border">
                <div className="w-48 h-36 shrink-0 bg-muted">
                  <img src={replyTarget.noshow.photos[0]} alt={replyTarget.noshow.property} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-foreground text-lg">{replyTarget.noshow.property}</h3>
                      <p className="text-sm text-muted-foreground">{replyTarget.noshow.ville}</p>
                    </div>
                    <p className="text-lg font-display font-bold text-primary">{replyTarget.noshow.prix}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-3 p-2 bg-background rounded">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{replyTarget.noshow.name}</p>
                      <p className="text-xs text-primary">{replyTarget.noshow.phone}</p>
                    </div>
                    <Badge variant="destructive" className="text-[10px] font-display ml-auto">{replyTarget.noshow.attempts} tentative{replyTarget.noshow.attempts > 1 ? "s" : ""}</Badge>
                  </div>
                </div>
              </div>

              {/* Message composition */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs font-display gap-1">
                    <Send className="h-3 w-3" /> {replyTarget.channel}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Réponse de relance</span>
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-violet" />
                  <span className="font-display text-[10px] uppercase tracking-wider text-violet font-bold">Réponse générée par l'IA — modifiez avant d'envoyer</span>
                </div>

                {aiLoading ? (
                  <div className="flex items-center gap-2 p-4 bg-violet/5 rounded-lg">
                    <span className="animate-spin h-4 w-4 border-2 border-violet border-t-transparent rounded-full" />
                    <span className="text-sm text-muted-foreground">L'IA génère une réponse...</span>
                  </div>
                ) : (
                  <Textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="bg-background text-sm min-h-[120px]"
                  />
                )}
              </div>

              <DialogFooter className="p-4 pt-0 gap-2">
                <Button variant="outline" onClick={() => setReplyTarget(null)}>Annuler</Button>
                <Button variant="attack" className="gap-1.5" onClick={sendReply} disabled={aiLoading || !replyMessage.trim()}>
                  <Send className="h-3.5 w-3.5" />
                  Envoyer via {replyTarget.channel}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={!!selectedNoShow} onOpenChange={(open) => !open && setSelectedNoShow(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card p-0">
          {selectedNoShow && (
            <>
              <div className="relative">
                <img src={selectedNoShow.photos[currentPhoto]} alt={selectedNoShow.property} className="w-full h-64 object-cover" />
                {selectedNoShow.photos.length > 1 && (
                  <>
                    <button className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 flex items-center justify-center text-foreground" onClick={() => setCurrentPhoto(p => p === 0 ? selectedNoShow.photos.length - 1 : p - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 flex items-center justify-center text-foreground" onClick={() => setCurrentPhoto(p => p === selectedNoShow.photos.length - 1 ? 0 : p + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-2 right-2 bg-background/80 rounded px-2 py-0.5 text-[10px] font-display text-foreground">
                  {currentPhoto + 1}/{selectedNoShow.photos.length}
                </div>
              </div>

              {selectedNoShow.photos.length > 1 && (
                <div className="flex gap-1.5 px-6 pt-4">
                  {selectedNoShow.photos.map((photo, i) => (
                    <img key={i} src={photo} alt={`Photo ${i + 1}`}
                      className={`h-12 w-16 object-cover rounded cursor-pointer border-2 shrink-0 transition-colors ${i === currentPhoto ? "border-primary" : "border-border"}`}
                      onClick={() => setCurrentPhoto(i)}
                    />
                  ))}
                </div>
              )}

              <div className="px-6 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">{selectedNoShow.property}</h2>
                    <p className="text-sm text-muted-foreground">{selectedNoShow.ville}</p>
                  </div>
                  <p className="text-xl font-display font-bold text-primary">{selectedNoShow.prix}</p>
                </div>

                <div className="flex items-center gap-3 mb-4 p-3 bg-background rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedNoShow.name}</p>
                    <p className="text-xs text-primary">{selectedNoShow.phone}</p>
                  </div>
                  <Badge variant="destructive" className="text-[10px] font-display ml-auto">{selectedNoShow.attempts} tentative{selectedNoShow.attempts > 1 ? "s" : ""}</Badge>
                </div>

                <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2">Description</h3>
                <p className="text-sm text-foreground leading-relaxed mb-6">{selectedNoShow.description}</p>

                <div className="flex items-center gap-2 mb-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" /> Écrire un message
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => { setSelectedNoShow(null); openReplyPopup(selectedNoShow, "LBC"); }}>
                        <span className="text-xs font-display font-bold text-primary mr-2">LBC</span> Leboncoin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedNoShow(null); openReplyPopup(selectedNoShow, "WhatsApp"); }}>
                        <span className="text-xs font-display font-bold text-success mr-2">WA</span> WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedNoShow(null); openReplyPopup(selectedNoShow, "SMS"); }}>
                        <span className="text-xs font-display font-bold text-info mr-2">SMS</span> SMS classique
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="attack" size="sm" className="text-xs gap-1.5" onClick={() => handleCall(selectedNoShow.name)}>
                    <Phone className="h-3.5 w-3.5" /> Appeler
                  </Button>
                </div>

                <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-3">Historique</h3>
                <div className="space-y-0">
                  {selectedNoShow.history.map((h, i) => (
                    <div key={i} className="flex gap-3 relative">
                      {i < selectedNoShow.history.length - 1 && (
                        <div className="absolute left-[11px] top-6 w-px h-full bg-border" />
                      )}
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        h.channel === "Tél" ? "bg-primary/20" :
                        h.channel === "WA" ? "bg-success/20" :
                        h.channel === "SMS" ? "bg-info/20" :
                        "bg-muted"
                      }`}>
                        {h.channel === "Tél" ? <Phone className="h-3 w-3 text-primary" /> :
                         h.channel === "WA" ? <MessageSquare className="h-3 w-3 text-success" /> :
                         h.channel === "SMS" ? <MessageSquare className="h-3 w-3 text-info" /> :
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default NoShows;
