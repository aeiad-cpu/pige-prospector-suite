import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Gift, Copy, Wallet, Users, Percent, User, AlertCircle, CheckCircle2, DollarSign, Info,
  ChevronDown, ChevronRight, TrendingUp, Layers,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";

// ---------- Multi-level data ----------

interface Filleul {
  name: string;
  status: "Actif" | "Inactif" | "Essai";
  commissions: string;
  date: string;
  niveau: number;
  filleuls?: Filleul[];
}

const niveaux = [
  { level: 1, label: "Niveau 1 — Direct", rate: "8%", color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary/20" },
  { level: 2, label: "Niveau 2", rate: "4%", color: "text-info", bgColor: "bg-info/10", borderColor: "border-info/20" },
  { level: 3, label: "Niveau 3", rate: "2%", color: "text-success", bgColor: "bg-success/10", borderColor: "border-success/20" },
  { level: 4, label: "Niveau 4", rate: "1%", color: "text-warning", bgColor: "bg-warning/10", borderColor: "border-warning/20" },
  { level: 5, label: "Niveau 5", rate: "0.5%", color: "text-muted-foreground", bgColor: "bg-muted/50", borderColor: "border-border" },
];

const networkData: Filleul[] = [
  {
    name: "Sophie Martin", status: "Actif", commissions: "124 €", date: "12/02/2026", niveau: 1,
    filleuls: [
      {
        name: "Lucas Morel", status: "Actif", commissions: "45 €", date: "20/02/2026", niveau: 2,
        filleuls: [
          { name: "Emma Blanc", status: "Actif", commissions: "12 €", date: "01/03/2026", niveau: 3 },
          {
            name: "Hugo Roux", status: "Essai", commissions: "0 €", date: "05/03/2026", niveau: 3,
            filleuls: [
              { name: "Léa Fournier", status: "Actif", commissions: "5 €", date: "08/03/2026", niveau: 4,
                filleuls: [
                  { name: "Nathan Girard", status: "Essai", commissions: "0 €", date: "09/03/2026", niveau: 5 },
                ],
              },
            ],
          },
        ],
      },
      { name: "Camille Dupuis", status: "Actif", commissions: "32 €", date: "25/02/2026", niveau: 2 },
    ],
  },
  {
    name: "Pierre Duval", status: "Actif", commissions: "89 €", date: "05/01/2026", niveau: 1,
    filleuls: [
      { name: "Julie Faure", status: "Actif", commissions: "28 €", date: "15/01/2026", niveau: 2,
        filleuls: [
          { name: "Antoine Mercier", status: "Actif", commissions: "8 €", date: "01/02/2026", niveau: 3 },
        ],
      },
    ],
  },
  { name: "Claire Bernard", status: "Inactif", commissions: "0 €", date: "20/12/2025", niveau: 1 },
  {
    name: "Thomas Garcia", status: "Actif", commissions: "210 €", date: "18/11/2025", niveau: 1,
    filleuls: [
      { name: "Sarah Lefevre", status: "Actif", commissions: "56 €", date: "01/12/2025", niveau: 2,
        filleuls: [
          { name: "Maxime Bonnet", status: "Actif", commissions: "15 €", date: "15/12/2025", niveau: 3,
            filleuls: [
              { name: "Clara Simon", status: "Essai", commissions: "0 €", date: "01/01/2026", niveau: 4 },
              { name: "Théo Lambert", status: "Actif", commissions: "6 €", date: "10/01/2026", niveau: 4,
                filleuls: [
                  { name: "Manon Petit", status: "Actif", commissions: "2 €", date: "01/02/2026", niveau: 5 },
                ],
              },
            ],
          },
        ],
      },
      { name: "Paul Moreau", status: "Actif", commissions: "41 €", date: "10/12/2025", niveau: 2 },
    ],
  },
  { name: "Marie Rousseau", status: "Essai", commissions: "0 €", date: "01/03/2026", niveau: 1 },
];

// Count all members recursively
function countNetwork(filleuls: Filleul[]): number {
  return filleuls.reduce((acc, f) => acc + 1 + (f.filleuls ? countNetwork(f.filleuls) : 0), 0);
}

function countByLevel(filleuls: Filleul[], level: number): number {
  return filleuls.reduce((acc, f) => {
    const count = f.niveau === level ? 1 : 0;
    return acc + count + (f.filleuls ? countByLevel(f.filleuls, level) : 0);
  }, 0);
}

// ---------- Tree Node ----------

function FilleulNode({ filleul, expanded, toggleExpand }: { filleul: Filleul; expanded: Set<string>; toggleExpand: (name: string) => void }) {
  const niv = niveaux[filleul.niveau - 1];
  const hasChildren = filleul.filleuls && filleul.filleuls.length > 0;
  const isOpen = expanded.has(filleul.name);

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent/50 transition-colors cursor-pointer ${hasChildren ? "" : "ml-5"}`}
        style={{ paddingLeft: `${(filleul.niveau - 1) * 20 + 12}px` }}
        onClick={() => hasChildren && toggleExpand(filleul.name)}
      >
        {hasChildren && (
          isOpen
            ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        )}
        <div className={`h-6 w-6 rounded-sm flex items-center justify-center shrink-0 ${niv?.bgColor || "bg-muted"}`}>
          <User className={`h-3 w-3 ${niv?.color || "text-muted-foreground"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-foreground">{filleul.name}</span>
        </div>
        <Badge variant="secondary" className={`text-[8px] font-display shrink-0 ${niv?.color || ""}`}>
          N{filleul.niveau} · {niv?.rate}
        </Badge>
        <Badge
          variant={filleul.status === "Actif" ? "success" : filleul.status === "Essai" ? "info" : "secondary"}
          className="text-[8px] font-display shrink-0"
        >
          {filleul.status}
        </Badge>
        <span className="text-xs font-display font-bold text-foreground shrink-0 w-16 text-right">{filleul.commissions}</span>
      </div>
      {hasChildren && isOpen && filleul.filleuls!.map((child) => (
        <FilleulNode key={child.name} filleul={child} expanded={expanded} toggleExpand={toggleExpand} />
      ))}
    </div>
  );
}

// ---------- Component ----------

const Ambassadeur = () => {
  const [copied, setCopied] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["Sophie Martin", "Thomas Garcia"]));
  const referralLink = "https://pigeimmo.com/ref/MARC-DUPONT-2026";
  const solde = 671;
  const totalNetwork = countNetwork(networkData);

  const toggleExpand = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const expandAll = () => {
    const all = new Set<string>();
    const collect = (items: Filleul[]) => items.forEach((f) => { if (f.filleuls) { all.add(f.name); collect(f.filleuls); } });
    collect(networkData);
    setExpanded(all);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!paypalEmail || !paypalEmail.includes("@")) { toast.error("Veuillez entrer une adresse PayPal valide"); return; }
    if (!amount || amount < 50) { toast.error("Le montant minimum de retrait est de 50 €"); return; }
    if (amount > solde) { toast.error("Solde insuffisant"); return; }
    toast.success(`Retrait de ${amount} € demandé vers ${paypalEmail}`);
    setShowWithdraw(false); setPaypalEmail(""); setWithdrawAmount("");
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Programme Ambassadeur</h1>
        <p className="text-sm text-muted-foreground mt-1">Développez votre réseau et gagnez des commissions sur 5 niveaux</p>
      </div>

      {/* Explanation banner */}
      <Card className="bg-primary/5 border-primary/20 mb-6">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="font-display font-bold text-foreground text-sm uppercase tracking-wider">Rémunération multi-niveaux</h2>
              <p className="text-sm text-foreground/80 leading-relaxed">
                En tant qu'ambassadeur, vous êtes rémunéré sur les abonnements générés par votre réseau étendu. Chaque personne que vous parrainez peut elle-même parrainer, et vous bénéficiez de commissions sur <span className="font-bold text-primary">5 niveaux de profondeur</span>.
              </p>

              {/* Level grid */}
              <div className="grid grid-cols-5 gap-2 mt-3">
                {niveaux.map((n) => (
                  <div key={n.level} className={`${n.bgColor} border ${n.borderColor} rounded-lg p-3 text-center`}>
                    <p className={`text-lg font-display font-bold ${n.color}`}>{n.rate}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{n.label}</p>
                    <p className="text-[9px] text-muted-foreground mt-1">{countByLevel(networkData, n.level)} membre{countByLevel(networkData, n.level) > 1 ? "s" : ""}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-card rounded-lg p-3 text-center">
                  <p className="text-lg font-display font-bold text-primary">1.</p>
                  <p className="text-xs text-muted-foreground">Partagez votre lien de parrainage</p>
                </div>
                <div className="bg-card rounded-lg p-3 text-center">
                  <p className="text-lg font-display font-bold text-primary">2.</p>
                  <p className="text-xs text-muted-foreground">Vos filleuls s'abonnent et parrainent à leur tour</p>
                </div>
                <div className="bg-card rounded-lg p-3 text-center">
                  <p className="text-lg font-display font-bold text-primary">3.</p>
                  <p className="text-xs text-muted-foreground">Vous touchez des commissions sur 5 niveaux</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 p-2 bg-card rounded border border-border">
                <Info className="h-4 w-4 text-info shrink-0" />
                <p className="text-[11px] text-muted-foreground">
                  Retrait possible à partir de <span className="font-bold text-foreground">50 €</span> — exclusivement par <span className="font-bold text-foreground">PayPal</span>. Paiements traités sous 48h ouvrées.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rang */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                Rang Actuel : Silver
              </h3>
            </div>
            <Badge variant="default" className="font-display text-xs">Prochain : Gold (8/10 filleuls directs)</Badge>
          </div>
          <Progress value={80} className="h-2" />
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 bg-success/10 rounded-md flex items-center justify-center">
              <Wallet className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{solde} €</p>
              <p className="text-xs text-muted-foreground">Solde disponible</p>
            </div>
            <Button variant="attack" size="sm" className="ml-auto text-xs gap-1" onClick={() => setShowWithdraw(true)} disabled={solde < 50}>
              <DollarSign className="h-3 w-3" /> Retirer
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{countByLevel(networkData, 1)}</p>
              <p className="text-xs text-muted-foreground">Filleuls directs (N1)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 bg-info/10 rounded-md flex items-center justify-center">
              <Layers className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{totalNetwork}</p>
              <p className="text-xs text-muted-foreground">Réseau total (5 niveaux)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 bg-success/10 rounded-md flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">+127 €</p>
              <p className="text-xs text-muted-foreground">Commissions ce mois</p>
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

      {/* Network Tree */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                Mon réseau — {totalNetwork} membres
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2" onClick={expandAll}>
                Tout déplier
              </Button>
              <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2" onClick={() => setExpanded(new Set())}>
                Tout replier
              </Button>
            </div>
          </div>

          {/* Level legend */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/30">
            {niveaux.map((n) => (
              <div key={n.level} className="flex items-center gap-1.5">
                <div className={`h-2.5 w-2.5 rounded-sm ${n.bgColor} border ${n.borderColor}`} />
                <span className={`text-[9px] font-display uppercase tracking-wider ${n.color}`}>{n.rate}</span>
              </div>
            ))}
          </div>

          <div className="py-1">
            {networkData.map((f) => (
              <FilleulNode key={f.name} filleul={f} expanded={expanded} toggleExpand={toggleExpand} />
            ))}
          </div>
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
              <Input type="email" placeholder="votre-email@paypal.com" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} className="bg-background" />
            </div>

            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Montant à retirer (€) *</label>
              <Input type="number" min={50} max={solde} placeholder="Min. 50 €" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="bg-background" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowWithdraw(false)}>Annuler</Button>
            <Button variant="attack" className="gap-1.5" onClick={handleWithdraw}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Confirmer le retrait
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Ambassadeur;
