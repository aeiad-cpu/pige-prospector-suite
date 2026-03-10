import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, Send, ArrowRightLeft, Search, Home } from "lucide-react";
import { toast } from "sonner";

interface PropertyOption {
  id: number;
  property: string;
  ville: string;
  prix: string;
  source: string;
  photo?: string;
}

// Mock data from Pipeline + Mes Leads
const pipelineProperties: PropertyOption[] = [
  { id: 1, property: "Maison 120m² jardin", ville: "Lyon", prix: "450 000 €", source: "LBC", photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=70&fit=crop" },
  { id: 2, property: "T3 lumineux 65m²", ville: "Paris 11", prix: "520 000 €", source: "PAP", photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&h=70&fit=crop" },
  { id: 3, property: "Villa piscine 200m²", ville: "Aix", prix: "890 000 €", source: "LBC", photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=70&fit=crop" },
  { id: 4, property: "T2 rénové 42m²", ville: "Bordeaux", prix: "245 000 €", source: "LBC", photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=70&fit=crop" },
  { id: 5, property: "Maison ville 150m²", ville: "Nantes", prix: "380 000 €", source: "PAP", photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=70&fit=crop" },
];

const mesLeadsProperties: PropertyOption[] = [
  { id: 101, property: "Duplex 110m²", ville: "Strasbourg", prix: "425 000 €", source: "LBC", photo: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=70&fit=crop" },
  { id: 102, property: "Loft 180m²", ville: "Lyon 6", prix: "780 000 €", source: "LC", photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=70&fit=crop" },
  { id: 103, property: "T3 balcon 72m²", ville: "Nice", prix: "395 000 €", source: "LBC", photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&h=70&fit=crop" },
  { id: 104, property: "T4 terrasse 85m²", ville: "Marseille", prix: "310 000 €", source: "LBC", photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=70&fit=crop" },
];

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyName?: string;
  ville?: string;
  prix?: string;
}

export function TransferDialog({ open, onOpenChange, propertyName, ville, prix }: TransferDialogProps) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  // Property picker (only when no property pre-selected)
  const [pickerSource, setPickerSource] = useState<"pipeline" | "leads">("pipeline");
  const [searchProp, setSearchProp] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<PropertyOption | null>(null);

  const needsPicker = !propertyName;
  const currentList = pickerSource === "pipeline" ? pipelineProperties : mesLeadsProperties;
  const filteredList = currentList.filter((p) =>
    p.property.toLowerCase().includes(searchProp.toLowerCase()) ||
    p.ville.toLowerCase().includes(searchProp.toLowerCase())
  );

  const displayName = propertyName || selectedProperty?.property;
  const displayVille = ville || selectedProperty?.ville;
  const displayPrix = prix || selectedProperty?.prix;

  const handleSend = () => {
    if (!email.trim()) return;
    if (!email.includes("@")) { setError("Veuillez entrer une adresse email valide"); return; }
    if (needsPicker && !selectedProperty) { setError("Veuillez sélectionner un bien à transférer"); return; }
    setSending(true);
    setError("");
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success(`📧 Bien transféré par email à ${email}`);
    }, 1500);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setEmail(""); setSending(false); setSent(false); setError("");
      setSelectedProperty(null); setSearchProp(""); setPickerSource("pipeline");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            <DialogTitle className="font-display text-lg">Transférer un bien</DialogTitle>
          </div>
        </DialogHeader>

        {!sent ? (
          <div className="space-y-4 pt-1">
            {/* Property picker when opened from sidebar */}
            {needsPicker && !selectedProperty && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Choisissez l'annonce à transférer :</p>
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <Button
                    variant={pickerSource === "pipeline" ? "default" : "ghost"}
                    size="sm"
                    className="h-7 text-[10px] font-display uppercase flex-1"
                    onClick={() => setPickerSource("pipeline")}
                  >
                    Pipeline
                  </Button>
                  <Button
                    variant={pickerSource === "leads" ? "default" : "ghost"}
                    size="sm"
                    className="h-7 text-[10px] font-display uppercase flex-1"
                    onClick={() => setPickerSource("leads")}
                  >
                    Mes Leads
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un bien..."
                    className="pl-8 h-8 text-xs bg-background"
                    value={searchProp}
                    onChange={(e) => setSearchProp(e.target.value)}
                  />
                </div>
                <ScrollArea className="h-48 rounded-lg border border-border">
                  <div className="space-y-1 p-1">
                    {filteredList.map((prop) => (
                      <button
                        key={prop.id}
                        className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-accent/50 transition-colors text-left"
                        onClick={() => setSelectedProperty(prop)}
                      >
                        {prop.photo ? (
                          <img src={prop.photo} alt={prop.property} className="h-10 w-14 rounded object-cover shrink-0" />
                        ) : (
                          <div className="h-10 w-14 rounded bg-muted flex items-center justify-center shrink-0">
                            <Home className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{prop.property}</p>
                          <p className="text-[10px] text-muted-foreground">{prop.ville}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-display font-bold text-primary">{prop.prix}</p>
                          <Badge variant="secondary" className="text-[8px] h-4">{prop.source}</Badge>
                        </div>
                      </button>
                    ))}
                    {filteredList.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">Aucun bien trouvé</p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Selected property display */}
            {(displayName) && (
              <div className="flex items-center gap-2 p-2.5 bg-background rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                  <p className="text-[10px] text-muted-foreground">{displayVille} — {displayPrix}</p>
                </div>
                {needsPicker && selectedProperty && (
                  <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2" onClick={() => setSelectedProperty(null)}>
                    Changer
                  </Button>
                )}
              </div>
            )}

            {/* Show email form only when property is selected */}
            {(displayName) && (
              <>
                {/* Privacy notice */}
                <div className="flex gap-3 p-3.5 bg-primary/5 border border-primary/20 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Confidentialité garantie</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Pour des raisons de <span className="font-medium text-foreground">confidentialité</span>, nous ne pouvons pas indiquer si un conseiller IAD est déjà utilisateur de la plateforme.
                      Veuillez saisir l'adresse email du conseiller : il recevra le bien ainsi que <span className="font-medium text-foreground">l'historique complet des échanges</span> directement par email.
                    </p>
                  </div>
                </div>

                {/* Email input */}
                <div>
                  <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    Email du conseiller IAD
                  </label>
                  <Input
                    type="email"
                    placeholder="conseiller@iadfrance.fr"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="bg-background"
                  />
                  {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
                </div>

                {/* What gets sent */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Ce qui sera envoyé :</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      Fiche complète du bien (photos, description, prix)
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      Historique de toutes les conversations
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      Coordonnées du vendeur
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={handleClose}>Annuler</Button>
                  <Button variant="attack" className="gap-1.5" onClick={handleSend} disabled={sending || !email.trim()}>
                    {sending ? (
                      <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    {sending ? "Envoi en cours..." : "Transférer le bien"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="h-14 w-14 mx-auto bg-success/10 rounded-full flex items-center justify-center">
              <Send className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-display font-bold text-foreground text-lg">Bien transféré avec succès !</h3>
            <p className="text-sm text-muted-foreground">
              Un email contenant la fiche du bien et l'historique des échanges a été envoyé à <span className="font-medium text-foreground">{email}</span>
            </p>
            <Button variant="outline" className="mt-4" onClick={handleClose}>Fermer</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
