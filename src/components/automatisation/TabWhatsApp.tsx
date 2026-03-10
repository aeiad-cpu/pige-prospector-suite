import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { QrCode, AlertTriangle, Mic, Clock, Shield, MessageSquare } from "lucide-react";

const TabWhatsApp = () => {
  const [connected, setConnected] = useState(false);
  const [autoSend, setAutoSend] = useState(false);
  const [audioPreset, setAudioPreset] = useState(true);
  const [targetHot, setTargetHot] = useState(true);
  const [targetWarm, setTargetWarm] = useState(true);
  const [targetCold, setTargetCold] = useState(false);

  return (
    <div className="space-y-4">
      {/* Meta Warning Banner */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
        <AlertTriangle className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Avertissement Meta</p>
          <p className="text-xs text-muted-foreground">
            L'automatisation WhatsApp enfreint les conditions d'utilisation de Meta. Utilisez cette fonctionnalité à vos risques. Nos protections anti-blocage minimisent les risques.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* QR Connection */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
              Connexion WhatsApp
            </h3>
            <div className="bg-background rounded-lg p-6 flex flex-col items-center gap-4 border border-border">
              {!connected ? (
                <>
                  <QrCode className="h-28 w-28 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    Scannez le QR Code avec WhatsApp pour connecter votre compte
                  </p>
                  <Badge variant="destructive" className="text-[10px] font-display">DÉCONNECTÉ</Badge>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setConnected(true)}>
                    Simuler connexion
                  </Button>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-success" />
                  </div>
                  <p className="text-sm text-foreground font-medium">+33 6 12 34 56 78</p>
                  <Badge variant="success" className="text-[10px] font-display">CONNECTÉ</Badge>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setConnected(false)}>
                    Déconnecter
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Vocal */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
              Message Vocal
            </h3>
            <div className="bg-background rounded-lg p-6 flex flex-col items-center gap-4 border border-border">
              <Button
                variant="outline"
                className="h-20 w-20 rounded-full border-2 border-primary hover:bg-primary/10 transition-all"
              >
                <Mic className="h-8 w-8 text-primary" />
              </Button>
              <p className="text-sm text-muted-foreground">Appuyez pour enregistrer</p>
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Durée idéale : <span className="text-foreground font-medium">10-20 secondes</span></span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Mic className="h-3 w-3" />
                  <span>Conseil : Parlez naturellement, mentionnez le bien</span>
                </div>
              </div>
            </div>
            <div className="mt-3 p-2 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Audio pré-enregistré</span>
                <Badge variant="success" className="text-[10px]">audio_intro_v3.ogg</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-3">
              Configuration d'envoi
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Envoi automatique</span>
                <Switch checked={autoSend} onCheckedChange={setAutoSend} />
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Audio pré-enregistré</span>
                <Switch checked={audioPreset} onCheckedChange={setAudioPreset} />
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Plages horaires</span>
                </div>
                <div className="flex gap-2">
                  <Input className="h-8 text-xs bg-card" defaultValue="08:00" />
                  <span className="text-muted-foreground self-center">—</span>
                  <Input className="h-8 text-xs bg-card" defaultValue="20:00" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Lead targets */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-3">
                Cibles par chaleur
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
                    <span className="text-sm text-foreground">Leads Chauds</span>
                  </div>
                  <Switch checked={targetHot} onCheckedChange={setTargetHot} />
                </div>
                <div className="flex items-center justify-between p-2.5 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    <span className="text-sm text-foreground">Leads Tièdes</span>
                  </div>
                  <Switch checked={targetWarm} onCheckedChange={setTargetWarm} />
                </div>
                <div className="flex items-center justify-between p-2.5 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-info" />
                    <span className="text-sm text-foreground">Leads Froids</span>
                  </div>
                  <Switch checked={targetCold} onCheckedChange={setTargetCold} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Anti-blocage */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-success" />
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                  Protection anti-blocage
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" className="text-[10px]">Délais aléatoires 2-4 min</Badge>
                <Badge variant="success" className="text-[10px]">Limite 50 msg/jour</Badge>
                <Badge variant="success" className="text-[10px]">Rotation numéros</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TabWhatsApp;
