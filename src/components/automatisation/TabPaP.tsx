import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Chrome, Copy, Zap, Shield, Clock, Keyboard } from "lucide-react";

const TabPaP = () => {
  const [mode, setMode] = useState<"semi" | "full">("full");
  const [message, setMessage] = useState(
    `Bonjour,\n\nVotre {type_bien} à {ville} ({prix}) a retenu mon attention. Je dispose actuellement d'acquéreurs qualifiés pour ce type de bien dans votre secteur.\n\nSeriez-vous ouvert à un échange rapide ?\n\nCordialement,\nMarc Dupont`
  );

  return (
    <div className="space-y-4">
      {/* Chrome Alert Banner */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
        <Chrome className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Mise à jour disponible de l'extension Chrome PàP</p>
          <p className="text-xs text-muted-foreground">v2.4.1 → v2.5.0 — Corrections anti-détection et amélioration des délais</p>
        </div>
        <Badge variant="default" className="text-[10px] font-display cursor-pointer shrink-0">METTRE À JOUR</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Mode Selector - Radio Cards */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-3">
              Mode d'envoi
            </h3>
            <div className="space-y-3">
              <div
                onClick={() => setMode("semi")}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  mode === "semi" ? "border-primary bg-primary/5" : "border-border bg-background hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-bold text-foreground">Mode Semi-Auto</span>
                  {mode === "semi" && <div className="h-2.5 w-2.5 rounded-full bg-primary ml-auto" />}
                </div>
                <p className="text-xs text-muted-foreground">Copie automatique dans le presse-papier. Vous collez manuellement.</p>
              </div>
              <div
                onClick={() => setMode("full")}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  mode === "full" ? "border-primary bg-primary/5" : "border-border bg-background hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Mode Full-Auto</span>
                  <Badge variant="default" className="text-[9px] font-display">NOUVEAU</Badge>
                  {mode === "full" && <div className="h-2.5 w-2.5 rounded-full bg-primary ml-auto" />}
                </div>
                <p className="text-xs text-muted-foreground">Envoi via l'extension Chrome en arrière-plan. Zéro risque de ban.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priorisation Intelligente */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-3">
              Priorisation intelligente
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <div className="h-3 w-3 rounded-full bg-destructive shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Priorité Haute</p>
                  <p className="text-[11px] text-muted-foreground">Annonces publiées il y a moins de 2h</p>
                </div>
                <Badge variant="hot" className="text-[10px]">&lt; 2h</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <div className="h-3 w-3 rounded-full bg-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Priorité Moyenne</p>
                  <p className="text-[11px] text-muted-foreground">Annonces publiées il y a moins de 12h</p>
                </div>
                <Badge variant="default" className="text-[10px]">&lt; 12h</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <div className="h-3 w-3 rounded-full bg-info shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Priorité Normale</p>
                  <p className="text-[11px] text-muted-foreground">Annonces publiées il y a moins de 24h</p>
                </div>
                <Badge variant="cold" className="text-[10px]">&lt; 24h</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anti-Ban + Message Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Protections Anti-Ban */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-success" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                Protections Anti-Ban
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2.5 bg-success/10 rounded-lg border border-success/20">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-xs text-foreground font-medium">Batch : 5 msg max/envoi</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-success/10 rounded-lg border border-success/20">
                <Clock className="h-3 w-3 text-success" />
                <span className="text-xs text-foreground font-medium">Intervalle : 2h entre lots</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-success/10 rounded-lg border border-success/20">
                <Keyboard className="h-3 w-3 text-success" />
                <span className="text-xs text-foreground font-medium">Simulation de frappe : 30-100ms</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 text-center">Toutes les protections sont actives ✓</p>
          </CardContent>
        </Card>

        {/* Éditeur de message */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardContent className="p-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-3">
              Template de message PàP
            </h3>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[180px] text-sm bg-background font-mono"
            />
            <div className="flex gap-2 mt-3 flex-wrap">
              {["{type_bien}", "{prix}", "{ville}", "{surface}", "{nb_pieces}", "{quartier}"].map((v) => (
                <Badge key={v} variant="violet" className="text-[10px] cursor-pointer font-mono hover:opacity-80 transition-opacity">
                  {v}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-[11px] text-muted-foreground">{message.length} caractères</span>
              <Badge variant="success" className="text-[10px]">Template valide</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TabPaP;
