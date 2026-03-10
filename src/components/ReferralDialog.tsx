import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Send, Users, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ReferralDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReferralDialog({ open, onOpenChange }: ReferralDialogProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState(
    "Bonjour, je vous recommande PIGE IMMO, un outil de prospection immobilière ultra-performant pour les conseillers IAD. Inscrivez-vous et boostez votre activité !"
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Requis";
    if (!lastName.trim()) e.lastName = "Requis";
    if (!email.trim() || !email.includes("@")) e.email = "Email invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success(`🎁 Invitation envoyée à ${firstName} ${lastName} !`);
    }, 1500);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setEmail("");
      setFirstName("");
      setLastName("");
      setMessage("Bonjour, je vous recommande PIGE IMMO, un outil de prospection immobilière ultra-performant pour les conseillers IAD. Inscrivez-vous et boostez votre activité !");
      setSending(false);
      setSent(false);
      setErrors({});
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Gift className="h-5 w-5 text-primary" />
            <DialogTitle className="font-display text-lg">Parrainer un conseiller IAD</DialogTitle>
          </div>
          <DialogDescription>
            Invitez un collègue conseiller IAD à rejoindre PIGE IMMO
          </DialogDescription>
        </DialogHeader>

        {!sent ? (
          <div className="space-y-4 pt-1">
            {/* Benefits */}
            <div className="flex gap-3 p-3.5 bg-primary/5 border border-primary/20 rounded-lg">
              <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Parrainez et gagnez !</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Invitez un conseiller IAD à rejoindre la plateforme. Lorsqu'il s'inscrit avec votre lien, vous bénéficiez tous les deux d'avantages exclusifs.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Prénom du conseiller</label>
                <Input placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-background" />
                {errors.firstName && <p className="text-[10px] text-destructive mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Nom du conseiller</label>
                <Input placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-background" />
                {errors.lastName && <p className="text-[10px] text-destructive mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Email du conseiller</label>
              <Input type="email" placeholder="conseiller@iadfrance.fr" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }} className="bg-background" />
              {errors.email && <p className="text-[10px] text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Message personnalisé</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="bg-background text-sm min-h-[80px]" />
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose}>Annuler</Button>
              <Button variant="attack" className="gap-1.5" onClick={handleSend} disabled={sending}>
                {sending ? (
                  <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {sending ? "Envoi en cours..." : "Envoyer l'invitation"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="h-14 w-14 mx-auto bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-display font-bold text-foreground text-lg">Invitation envoyée ! 🎉</h3>
            <p className="text-sm text-muted-foreground">
              Un email d'invitation a été envoyé à <span className="font-medium text-foreground">{firstName} {lastName}</span> ({email})
            </p>
            <Button variant="outline" className="mt-4" onClick={handleClose}>Fermer</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
