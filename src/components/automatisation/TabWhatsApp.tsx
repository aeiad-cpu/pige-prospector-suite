import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, AlertTriangle, Mic, Clock, Shield, MessageSquare, RefreshCw, Bell, Check, Search, CalendarDays, Pencil } from "lucide-react";
import { toast } from "sonner";

const TabWhatsApp = () => {
  const [connected, setConnected] = useState(false);
  const [autoSend, setAutoSend] = useState(false);
  const [startHour, setStartHour] = useState("9h");
  const [endHour, setEndHour] = useState("19h");
  const [messageType, setMessageType] = useState<"text" | "vocal">("text");
  const [autoRDV, setAutoRDV] = useState(false);
  const [targetHot, setTargetHot] = useState(true);
  const [targetWarm, setTargetWarm] = useState(true);
  const [targetCold, setTargetCold] = useState(true);

  // Templates
  const [tplPremierContact, setTplPremierContact] = useState("Bonjour {prenom},\n\nJe me permets de vous contacter suite à votre annonce pour votre {type_bien} à {ville}.\n\nJe suis conseiller immobilier spécialisé dans votre secteur et j'ai actuellement des acquéreurs qualifiés en recherche active.\n\nSeriez-vous ouvert à un échange rapide ?\n\nCordialement,\n{agent}");
  const [tplRappel, setTplRappel] = useState("Bonjour {prenom},\n\nJe vous ai contacté par téléphone concernant votre {type_bien} à {ville} mais n'ai pas pu vous joindre.\n\nN'hésitez pas à me rappeler au {tel_agent} ou à me répondre ici.\n\nCordialement,\n{agent}");
  const [tplAvantAppel, setTplAvantAppel] = useState("Bonjour {prenom},\n\nJe suis {agent}, conseiller immobilier. Je vais vous appeler dans quelques instants au sujet de votre {type_bien} à {ville} ({prix}).\n\nÀ tout de suite !");
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  // RDV Messages
  const [agenceAdresse, setAgenceAdresse] = useState("123 rue de Paris, 75001 Paris");
  const [rdvConfirmation, setRdvConfirmation] = useState("Bonjour {prenom}, votre RDV est confirmé le {date} à {heure}. Adresse: {adresse}. À bientôt !");
  const [rdvVeille, setRdvVeille] = useState("Rappel : RDV demain à {heure} pour votre {marque} {modele}. Adresse: {adresse}. À demain !");
  const [rdvJourJ, setRdvJourJ] = useState("Rappel : RDV aujourd'hui à {heure}. Nous vous attendons !");

  const hours = Array.from({ length: 15 }, (_, i) => `${i + 6}h`);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Auto-prospection</h2>
          <p className="text-sm text-muted-foreground">Automatisez vos premiers contacts via WhatsApp</p>
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1.5 font-display">
          <MessageSquare className="h-3.5 w-3.5" />
          Historique
        </Button>
      </div>

      {/* Meta Warning Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30">
        <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-primary">Avertissement important</p>
          <p className="text-xs text-foreground mt-0.5">
            L'utilisation de WhatsApp Web pour l'automatisation viole les conditions d'utilisation de Meta. Votre compte personnel pourrait être banni. Utilisez à vos propres risques.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Connexion WhatsApp */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <QrCode className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-bold text-foreground">Connexion WhatsApp</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Scannez le QR code avec votre téléphone pour connecter WhatsApp
              </p>

              {!connected ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
                    <span className="text-sm text-foreground">Déconnecté</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-success" />
                  <span className="text-sm text-foreground font-medium">Connecté — +33 6 12 34 56 78</span>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant={connected ? "outline" : "default"}
                  size="sm"
                  className="text-xs gap-1.5"
                  onClick={() => setConnected(!connected)}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {connected ? "Déconnecter" : "Connecter WhatsApp"}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Message Vocal Personnalisé */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <Mic className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-bold text-foreground">Message Vocal Personnalisé</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Enregistrez votre propre message vocal pour une prospection plus authentique et personnelle. Les prospects recevront votre voix au lieu d'un message texte.
              </p>

              {/* Conseils */}
              <div className="bg-background rounded-lg p-4 border border-border mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-bold text-foreground">Conseils pour un bon message :</span>
                </div>
                <ul className="space-y-1.5 text-sm text-foreground ml-6">
                  <li className="list-disc">Durée idéale : 10-20 secondes</li>
                  <li className="list-disc">Présentez-vous et mentionnez l'annonce</li>
                  <li className="list-disc">Proposez un rendez-vous ou un appel</li>
                  <li className="list-disc">Parlez clairement et naturellement</li>
                </ul>
              </div>

              {/* Mic Button */}
              <div className="flex flex-col items-center gap-4">
                <button className="h-24 w-24 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                  <Mic className="h-10 w-10 text-muted-foreground" />
                </button>
                <Button
                  variant="default"
                  className="gap-2 text-sm px-8"
                  onClick={() => toast.info("🎙️ Enregistrement en cours...")}
                >
                  <Mic className="h-4 w-4" />
                  Commencer l'enregistrement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN — Configuration */}
        <Card className="bg-card border-border h-fit">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-bold text-foreground">Configuration</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Paramètres de l'envoi automatique de messages
            </p>

            <div className="space-y-6">
              {/* Envoi automatique */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">Envoi automatique</p>
                    <p className="text-xs text-muted-foreground">Envoyer un message aux nouveaux leads avec téléphone</p>
                  </div>
                  <Switch checked={autoSend} onCheckedChange={setAutoSend} />
                </div>
              </div>

              {/* Horaires d'envoi */}
              <div>
                <p className="text-sm font-bold text-foreground mb-1">Horaires d'envoi</p>
                <p className="text-xs text-muted-foreground mb-3">Plage horaire pendant laquelle les messages peuvent être envoyés</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">De</span>
                  <Select value={startHour} onValueChange={setStartHour}>
                    <SelectTrigger className="w-20 h-9 text-sm bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">à</span>
                  <Select value={endHour} onValueChange={setEndHour}>
                    <SelectTrigger className="w-20 h-9 text-sm bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">Défaut : 9h - 19h (heure de Paris)</p>
              </div>

              {/* Type de message */}
              <div>
                <p className="text-sm font-bold text-foreground mb-3">Type de message à envoyer</p>
                <div className="space-y-2">
                  <div
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      messageType === "text" ? "border-primary bg-primary/5" : "border-border bg-background"
                    }`}
                    onClick={() => setMessageType("text")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          messageType === "text" ? "border-primary" : "border-muted-foreground"
                        }`}>
                          {messageType === "text" && <div className="h-2 w-2 rounded-full bg-primary" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">Message texte</p>
                          <p className="text-xs text-muted-foreground">Envoi du template texte configuré</p>
                        </div>
                      </div>
                      {messageType === "text" && (
                        <Badge variant="default" className="text-[10px] font-display">Actif</Badge>
                      )}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      messageType === "vocal" ? "border-primary bg-primary/5" : "border-border bg-background"
                    }`}
                    onClick={() => setMessageType("vocal")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                        messageType === "vocal" ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {messageType === "vocal" && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <p className={`text-sm ${messageType === "vocal" ? "font-bold text-foreground" : "text-muted-foreground"}`}>Message vocal</p>
                        <p className="text-xs text-muted-foreground">Enregistrez d'abord un message vocal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rappels RDV */}
              <div className="flex items-start gap-3">
                <Bell className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-foreground">Rappels automatiques RDV</p>
                      <p className="text-xs text-muted-foreground">Envoyer des rappels avant les rendez-vous (veille 18h, jour J 8h)</p>
                    </div>
                    <Switch checked={autoRDV} onCheckedChange={setAutoRDV} />
                  </div>
                </div>
              </div>

              {/* Températures */}
              <div>
                <p className="text-sm font-bold text-foreground mb-1">Températures à prospecter</p>
                <p className="text-xs text-muted-foreground mb-3">Choisir quels leads contacter automatiquement</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Checkbox checked={targetHot} onCheckedChange={(v) => setTargetHot(!!v)} />
                    <Badge variant="hot" className="text-[10px] font-display">Chaud</Badge>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Checkbox checked={targetWarm} onCheckedChange={(v) => setTargetWarm(!!v)} />
                    <Badge variant="default" className="text-[10px] font-display">Tiède</Badge>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Checkbox checked={targetCold} onCheckedChange={(v) => setTargetCold(!!v)} />
                    <Badge variant="cold" className="text-[10px] font-display">Froid</Badge>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">Les leads "rejetés" (qui refusent les pros) ne sont jamais contactés</p>
              </div>

              {/* Protection anti-blocage */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Protection anti-blocage</span>
                  <Badge variant="default" className="text-[10px] font-display">Active</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2.5 bg-background rounded-lg border border-border">
                    <Shield className="h-3.5 w-3.5 text-success shrink-0" />
                    <span className="text-[11px] text-foreground">Délais aléatoires 2-4 min</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-background rounded-lg border border-border">
                    <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-[11px] text-foreground">Simulation de frappe humaine</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-background rounded-lg border border-border">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-[11px] text-foreground">Horaires: 8h - 20h uniquement</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-background rounded-lg border border-border">
                    <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-[11px] text-foreground">Limite 50 msg/jour max</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <Button
                variant="default"
                className="w-full gap-2 text-sm font-display uppercase"
                onClick={() => toast.success("✅ Configuration sauvegardée")}
              >
                <Check className="h-4 w-4" />
                Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TabWhatsApp;
