import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Send, ArrowRightLeft, Info } from "lucide-react";
import { toast } from "sonner";

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

  const handleSend = () => {
    if (!email.trim()) return;
    if (!email.includes("@")) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }
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
      setEmail("");
      setSending(false);
      setSent(false);
      setError("");
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
          {propertyName && (
            <div className="flex items-center gap-2 mt-2 p-2.5 bg-background rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{propertyName}</p>
                <p className="text-[10px] text-muted-foreground">{ville} — {prix}</p>
              </div>
            </div>
          )}
        </DialogHeader>

        {!sent ? (
          <div className="space-y-4 pt-1">
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
