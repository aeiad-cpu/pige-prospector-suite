import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Gift, Copy, Wallet, Users, Percent, User } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";

const filleuls = [
  { name: "Sophie Martin", status: "Actif", commissions: "124 €", date: "12/02/2026" },
  { name: "Pierre Duval", status: "Actif", commissions: "89 €", date: "05/01/2026" },
  { name: "Claire Bernard", status: "Inactif", commissions: "0 €", date: "20/12/2025" },
  { name: "Thomas Garcia", status: "Actif", commissions: "210 €", date: "18/11/2025" },
  { name: "Marie Rousseau", status: "Essai", commissions: "0 €", date: "01/03/2026" },
];

const Ambassadeur = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://pigeimmo.com/ref/MARC-DUPONT-2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Programme Ambassadeur</h1>
        <p className="text-sm text-muted-foreground mt-1">Parrainez et gagnez des commissions récurrentes</p>
      </div>

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
              <p className="text-2xl font-display font-bold text-foreground">423 €</p>
              <p className="text-xs text-muted-foreground">Solde disponible</p>
            </div>
            <Button variant="attack" size="sm" className="ml-auto text-xs">
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
              <p className="text-xs text-muted-foreground">Commission actuelle</p>
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
    </AppLayout>
  );
};

export default Ambassadeur;
