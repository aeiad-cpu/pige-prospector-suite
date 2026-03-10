import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Gift, Copy, Wallet, Users, Percent, User, AlertCircle, CheckCircle2, DollarSign, Info } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";

const filleuls = [
  { name: "Sophie Martin", status: "Actif", commissions: "124 €", date: "12/02/2026" },
  { name: "Pierre Duval", status: "Actif", commissions: "89 €", date: "05/01/2026" },
  { name: "Claire Bernard", status: "Inactif", commissions: "0 €", date: "20/12/2025" },
  { name: "Thomas Garcia", status: "Actif", commissions: "210 €", date: "18/11/2025" },
  { name: "Marie Rousseau", status: "Essai", commissions: "0 €", date: "01/03/2026" },
];

const Ambassadeur = () => {
  const [copied, setCopied] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const referralLink = "https://pigeimmo.com/ref/MARC-DUPONT-2026";
  const solde = 423;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!paypalEmail || !paypalEmail.includes("@")) {
      toast.error("Veuillez entrer une adresse PayPal valide");
      return;
    }
    if (!amount || amount < 50) {
      toast.error("Le montant minimum de retrait est de 50 €");
      return;
    }
    if (amount > solde) {
      toast.error("Solde insuffisant");
      return;
    }
    toast.success(`Retrait de ${amount} € demandé vers ${paypalEmail}`);
    setShowWithdraw(false);
    setPaypalEmail("");
    setWithdrawAmount("");
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Programme Ambassadeur</h1>
        <p className="text-sm text-muted-foreground mt-1">Parrainez et gagnez des commissions récurrentes</p>
      </div>

      {/* Explanation banner */}
      <Card className="bg-primary/5 border-primary/20 mb-6">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display font-bold text-foreground text-sm uppercase tracking-wider">Comment fonctionne le programme ?</h2>
              <p className="text-sm text-foreground/80 leading-relaxed">
                En tant qu'ambassadeur PigeImmo, vous touchez <span className="font-bold text-primary">20% des revenus générés</span> par chaque filleul que vous parrainez, et ce <span className="font-bold text-primary">de manière récurrente</span> tant que votre filleul reste abonné.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-card rounded-lg p-3 text-center">
                  <p className="text-lg font-display font-bold text-primary">1.</p>
                  <p className="text-xs text-muted-foreground">Partagez votre lien de parrainage</p>
                </div>
                <div className="bg-card rounded-lg p-3 text-center">
                  <p className="text-lg font-display font-bold text-primary">2.</p>
                  <p className="text-xs text-muted-foreground">Votre filleul s'abonne à PigeImmo</p>
                </div>
                <div className="bg-card rounded-lg p-3 text-center">
                  <p className="text-lg font-display font-bold text-primary">3.</p>
                  <p className="text-xs text-muted-foreground">Vous touchez 20% chaque mois</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 p-2 bg-card rounded border border-border">
                <Info className="h-4 w-4 text-info shrink-0" />
                <p className="text-[11px] text-muted-foreground">
                  Retrait possible à partir de <span className="font-bold text-foreground">50 €</span> — exclusivement par <span className="font-bold text-foreground">PayPal</span>. Les paiements sont traités sous 48h ouvrées.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                Rang Actuel : Silver
              </h3>
            </div>
            <Badge variant="default" className="font-display text-xs">Prochain : Gold (8/10 filleuls)</Badge>
          </div>
          <Progress value={80} className="h-2" />
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 bg-success/10 rounded-md flex items-center justify-center">
              <Wallet className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{solde} €</p>
              <p className="text-xs text-muted-foreground">Solde disponible</p>
            </div>
            <Button
              variant="attack"
              size="sm"
              className="ml-auto text-xs gap-1"
              onClick={() => setShowWithdraw(true)}
              disabled={solde < 50}
            >
              <DollarSign className="h-3 w-3" />
              Retirer
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 bg-info/10 rounded-md flex items-center justify-center">
              <Users className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">8</p>
              <p className="text-xs text-muted-foreground">Filleuls actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
              <Percent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">20%</p>
              <p className="text-xs text-muted-foreground">Commission récurrente</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card className="bg-background border-border mb-6">
        <CardContent className="p-4">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Votre lien de parrainage
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-card rounded-md p-3 font-mono text-sm text-foreground border border-border truncate">
              {referralLink}
            </div>
            <Button variant="attack" size="sm" className="gap-2 text-xs shrink-0" onClick={handleCopy}>
              <Copy className="h-3 w-3" />
              {copied ? "Copié !" : "Copier le lien"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filleuls Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
              Mes Filleuls
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Nom</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Statut</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Commissions</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Inscription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filleuls.map((f, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 bg-muted rounded-sm flex items-center justify-center">
                        <User className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{f.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={f.status === "Actif" ? "success" : f.status === "Essai" ? "info" : "secondary"}
                      className="text-[10px] font-display"
                    >
                      {f.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-display font-bold text-sm text-foreground">{f.commissions}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{f.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Retrait PayPal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-info/10 border border-info/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-info shrink-0 mt-0.5" />
              <div className="text-xs text-foreground">
                <p className="font-bold mb-1">Conditions de retrait :</p>
                <ul className="space-y-0.5 text-muted-foreground">
                  <li>• Montant minimum : <span className="font-bold text-foreground">50 €</span></li>
                  <li>• Méthode : <span className="font-bold text-foreground">PayPal uniquement</span></li>
                  <li>• Délai : 48h ouvrées</li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-background rounded-lg flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Solde disponible</span>
              <span className="text-xl font-display font-bold text-success">{solde} €</span>
            </div>

            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Adresse PayPal *</label>
              <Input
                type="email"
                placeholder="votre-email@paypal.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="bg-background"
              />
            </div>

            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Montant à retirer (€) *</label>
              <Input
                type="number"
                min={50}
                max={solde}
                placeholder="Min. 50 €"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowWithdraw(false)}>Annuler</Button>
            <Button variant="attack" className="gap-1.5" onClick={handleWithdraw}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Confirmer le retrait
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Ambassadeur;
