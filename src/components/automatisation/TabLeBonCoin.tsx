import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Chrome, Copy, Zap, Shield, Clock, Keyboard, Download, Globe, Pencil, Search, Check, Settings } from "lucide-react";
import { toast } from "sonner";

const TabLeBonCoin = () => {
  const [mode, setMode] = useState<"semi" | "full">("semi");
  const [connected, setConnected] = useState(false);
  const [dailyLimit, setDailyLimit] = useState("5");
  const [sendDelay, setSendDelay] = useState("instant");
  const [excludeAutoViza, setExcludeAutoViza] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const [tplPremierContact, setTplPremierContact] = useState("Bonjour,\n\nVotre {marque} {modele} à {prix} a retenu mon attention. Je dispose actuellement d'acquéreurs qualifiés pour ce type de bien dans votre secteur.\n\nSeriez-vous ouvert à un échange rapide ?\n\nCordialement,\nMarc Dupont");
  const [tplRappel, setTplRappel] = useState("Bonjour,\n\nJe vous ai contacté par téléphone concernant votre {marque} {modele} à {ville} mais n'ai pas pu vous joindre.\n\nN'hésitez pas à me rappeler ou à me répondre directement ici.\n\nCordialement,\nMarc Dupont");
  const [tplAvantAppel, setTplAvantAppel] = useState("Bonjour,\n\nJe suis Marc Dupont, conseiller immobilier. Je vais vous appeler dans quelques instants au sujet de votre {marque} {modele} à {ville} ({prix}).\n\nÀ tout de suite !");

  return (
    <div className="space-y-6">
      {/* Update Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-success/10 border border-success/30">
        <Chrome className="h-5 w-5 text-success shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-success">Mise à jour disponible</p>
          <p className="text-xs text-foreground mt-0.5">
            LeBonCoin a mis à jour son système de messagerie. Téléchargez la dernière version de l'extension.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="default" size="sm" className="text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Télécharger
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            Fermer
          </Button>
        </div>
      </div>

      {/* Modes d'envoi LeBonCoin */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Search className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground">Modes d'envoi LeBonCoin</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
            {/* Semi-Auto */}
            <div
              onClick={() => setMode("semi")}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                mode === "semi" ? "border-primary bg-primary/5" : "border-border bg-background hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Copy className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">Mode Semi-Auto</span>
                {mode === "semi" && <Badge variant="secondary" className="text-[9px] font-display ml-auto">Par défaut</Badge>}
              </div>
              <ul className="space-y-1 text-xs text-foreground ml-6">
                <li className="list-disc">Cliquez sur <strong>"Contacter via LeBonCoin"</strong> sur la fiche lead</li>
                <li className="list-disc">Le message est copié automatiquement dans le presse-papier</li>
                <li className="list-disc">L'annonce s'ouvre dans un nouvel onglet</li>
                <li className="list-disc">Collez et envoyez votre message (Ctrl+V)</li>
              </ul>
            </div>

            {/* Full-Auto */}
            <div
              onClick={() => setMode("full")}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                mode === "full" ? "border-primary bg-primary/5" : "border-border bg-background hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">Mode Full-Auto</span>
                <Badge variant="default" className="text-[9px] font-display">Extension Chrome</Badge>
              </div>
              <ul className="space-y-1 text-xs text-foreground ml-6">
                <li className="list-disc">L'extension envoie les messages <strong>automatiquement</strong></li>
                <li className="list-disc">Aucune intervention de votre part</li>
                <li className="list-disc">Fonctionne même quand Chrome est simplement ouvert</li>
                <li className="list-disc">Zéro risque de ban (utilise votre vrai navigateur)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Extension Chrome + Priorisation */}
        <div className="space-y-6">
          {/* Extension Chrome */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-bold text-foreground">Extension Chrome</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connectez votre compte LeBonCoin pour envoyer automatiquement des messages
              </p>

              {/* How it works */}
              <div className="bg-background rounded-lg p-4 border border-border mb-4">
                <p className="text-sm font-bold text-foreground mb-2">Comment ça marche :</p>
                <ol className="space-y-1 text-sm text-foreground ml-4">
                  <li className="list-decimal">Installez l'extension depuis le Chrome Web Store</li>
                  <li className="list-decimal">Connectez-vous à LeBonCoin sur Chrome</li>
                  <li className="list-decimal">Cliquez sur l'icône de l'extension dans la barre d'extensions</li>
                  <li className="list-decimal">Activez l'envoi automatique</li>
                </ol>
              </div>

              {/* Connection status */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-success" : "bg-muted-foreground"}`} />
                <span className="text-sm text-foreground">{connected ? "Connecté" : "En attente de connexion"}</span>
              </div>

              {/* Download */}
              <div className="border border-border rounded-lg p-4">
                <p className="text-sm font-bold text-foreground mb-3">Téléchargez l'extension Chrome</p>
                <Button
                  variant="default"
                  className="w-full gap-2 text-sm bg-success hover:bg-success/90 text-success-foreground"
                  onClick={() => {
                    setConnected(true);
                    toast.success("Extension simulée — connecté !");
                  }}
                >
                  <Download className="h-4 w-4" />
                  Télécharger l'extension (.zip)
                </Button>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Installation : chrome://extensions → Mode développeur → Glisser le fichier ZIP
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Priorisation intelligente */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Priorisation intelligente des messages</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Les leads les plus "chauds" sont contactés en priorité :
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-muted-foreground">•</span>
                  <span><strong>Priorité haute:</strong> Leads de moins de 2h</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-muted-foreground">•</span>
                  <span><strong>Priorité moyenne:</strong> Leads du jour (&lt;12h)</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-muted-foreground">•</span>
                  <span><strong>Priorité normale:</strong> Leads récents (&lt;24h)</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-success">
                  <span>•</span>
                  <span><strong>Bonus Chaud:</strong> +10 priorité si lead chaud</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-primary">
                  <span>•</span>
                  <span><strong>Bonus Tiède:</strong> +5 priorité si lead tiède</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">
                Les messages en attente depuis +48h expirent automatiquement pour éviter d'encombrer la file.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Statut et Protection Anti-Ban */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-bold text-foreground">Statut et Protection Anti-Ban</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Statut de connexion et paramètres de sécurité pour éviter les blocages LeBonCoin
              </p>

              {/* Status */}
              <div className="flex items-center gap-2 mb-6">
                <span className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-success" : "bg-muted-foreground"}`} />
                <span className="text-sm text-foreground">{connected ? "Connecté" : "Non connecté"}</span>
              </div>

              {/* Mode d'envoi */}
              <div className="mb-6">
                <p className="text-sm font-bold text-foreground mb-3">Mode d'envoi LeBonCoin</p>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setMode("semi")}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      mode === "semi" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-bold text-foreground">Semi-automatique</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Le message est copié, vous collez manuellement sur LeBonCoin</p>
                  </div>
                  <div
                    onClick={() => setMode("full")}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      mode === "full" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-bold text-foreground">Full Auto</span>
                      <Badge variant="default" className="text-[8px] font-display">Nouveau</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">L'extension Chrome envoie les messages automatiquement</p>
                    {!connected && (
                      <p className="text-[10px] text-destructive mt-1">⊘ Connectez l'extension pour activer</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">Limite de messages par jour</p>
                  <div className="flex items-center gap-3">
                    <Input
                      value={dailyLimit}
                      onChange={(e) => setDailyLimit(e.target.value)}
                      className="w-16 h-9 text-sm bg-background text-center"
                    />
                    <span className="text-xs text-muted-foreground">(recommandé: 10-15 pour nouveaux comptes)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">Délai d'envoi LeBonCoin</p>
                    <p className="text-xs text-muted-foreground">Quand envoyer le message après détection du lead</p>
                  </div>
                  <Select value={sendDelay} onValueChange={setSendDelay}>
                    <SelectTrigger className="w-[160px] h-9 text-xs bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Jour J (instantané)</SelectItem>
                      <SelectItem value="1h">Après 1h</SelectItem>
                      <SelectItem value="2h">Après 2h</SelectItem>
                      <SelectItem value="j1">J+1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">Exclure les annonces AutoViza</p>
                    <p className="text-xs text-muted-foreground">Ignore les annonces LBC qui ont un rapport AutoViza</p>
                  </div>
                  <Switch checked={excludeAutoViza} onCheckedChange={setExcludeAutoViza} />
                </div>
              </div>

              {/* Protections Anti-Ban */}
              <div className="mt-6 p-4 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-success" />
                  <span className="text-sm font-bold text-success">Protections Anti-Ban Actives</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <Shield className="h-3 w-3 text-success shrink-0" />
                    Batch: 5 msg max/envoi
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <Clock className="h-3 w-3 text-success shrink-0" />
                    Intervalle: 2h entre envois
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <Clock className="h-3 w-3 text-success shrink-0" />
                    Horaires: 9h-19h
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <Keyboard className="h-3 w-3 text-success shrink-0" />
                    30-100ms par caractère
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <Clock className="h-3 w-3 text-success shrink-0" />
                    2-5 secondes entre actions
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <Zap className="h-3 w-3 text-success shrink-0" />
                    Mode direct
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template de message */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-bold text-foreground">Template de message</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Personnalisez votre message pour contacter les vendeurs LeBonCoin
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Chaque collaborateur peut configurer son propre template de message avec des variables automatiquement remplacées par les informations du lead.
              </p>

              <div className="bg-background rounded-lg p-3 border border-border mb-4">
                <p className="text-xs text-muted-foreground mb-2">Variables disponibles :</p>
                <div className="flex flex-wrap gap-1.5">
                  {["{marque}", "{modele}", "{prix}", "{année}", "{km}", "{ville}", "{vendeur}"].map((v) => (
                    <Badge key={v} variant="outline" className="text-[10px] font-mono cursor-pointer hover:bg-muted">
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2 text-sm"
                onClick={() => setEditingTemplate(editingTemplate === "lbc" ? null : "lbc")}
              >
                <Settings className="h-4 w-4" />
                Configurer mon template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modèles de messages */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Search className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground">Modèles de messages</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Messages prédéfinis avec variables: {"{marque}"}, {"{modele}"}
          </p>

          <div className="space-y-4">
            {[
              { key: "premier", title: "Premier contact", desc: "Message envoyé lors du premier contact avec le vendeur", value: tplPremierContact, setter: setTplPremierContact },
              { key: "rappel", title: "Rappel (après appel)", desc: "Message envoyé après une tentative d'appel sans réponse", value: tplRappel, setter: setTplRappel },
              { key: "avant", title: "Avant d'appeler", desc: "Message envoyé pour prévenir avant de téléphoner", value: tplAvantAppel, setter: setTplAvantAppel },
            ].map((tpl) => (
              <div key={tpl.key} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-bold text-foreground">{tpl.title}</p>
                    <p className="text-xs text-muted-foreground">{tpl.desc}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => setEditingTemplate(editingTemplate === tpl.key ? null : tpl.key)}
                  >
                    <Pencil className="h-3 w-3" />
                    Modifier
                  </Button>
                </div>
                {editingTemplate === tpl.key ? (
                  <Textarea
                    value={tpl.value}
                    onChange={(e) => tpl.setter(e.target.value)}
                    className="mt-3 min-h-[120px] text-sm bg-background"
                  />
                ) : (
                  <div className="mt-3 bg-background rounded-lg p-3 text-sm text-foreground whitespace-pre-line">
                    {tpl.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TabLeBonCoin;
