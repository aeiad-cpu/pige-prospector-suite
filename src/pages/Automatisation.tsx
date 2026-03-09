import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Zap, MessageSquare, Phone, Clock, QrCode, Mic, ArrowRight, Plus } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const smsTemplate = `Bonjour {prenom},

J'ai vu votre {type_bien} à {ville} publié à {prix}. J'ai actuellement des acquéreurs qualifiés pour ce type de bien.

Seriez-vous disponible pour un échange rapide ?

Marc Dupont - PIGE IMMO`;

const sequenceSteps = [
  { day: "J0", action: "Audio WhatsApp", icon: Mic, color: "success" },
  { day: "J+1", action: "SMS personnalisé", icon: MessageSquare, color: "info" },
  { day: "J+2", action: "Appel direct", icon: Phone, color: "primary" },
  { day: "J+4", action: "Relance WhatsApp", icon: MessageSquare, color: "success" },
  { day: "J+7", action: "Appel final", icon: Phone, color: "destructive" },
];

const Automatisation = () => {
  const [smsText, setSmsText] = useState(smsTemplate);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Automatisation</h1>
        <p className="text-sm text-muted-foreground mt-1">Tour de contrôle des cadences de prospection</p>
      </div>

      <Tabs defaultValue="sequences" className="w-full">
        <TabsList className="bg-card border border-border mb-4 h-10">
          <TabsTrigger value="sequences" className="font-display text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Séquences
          </TabsTrigger>
          <TabsTrigger value="sms" className="font-display text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            SMS
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="font-display text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="pap" className="font-display text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            PàP
          </TabsTrigger>
        </TabsList>

        {/* Sequences */}
        <TabsContent value="sequences">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                    Cadence Standard — Nouveau Lead
                  </h3>
                </div>
                <Badge variant="success" className="text-[10px] font-display">ACTIVE</Badge>
              </div>

              {/* Visual Sequence */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4">
                {sequenceSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border border-border min-w-[140px]">
                      <Badge variant="secondary" className="text-[10px] font-display">{step.day}</Badge>
                      <div className={`h-10 w-10 rounded-md flex items-center justify-center bg-${step.color}/10`}>
                        <step.icon className={`h-5 w-5 text-${step.color}`} />
                      </div>
                      <p className="text-xs font-medium text-foreground text-center">{step.action}</p>
                    </div>
                    {i < sequenceSteps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="shrink-0 h-20">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS */}
        <TabsContent value="sms">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-3">
                  Éditeur de Template
                </h3>
                <Textarea
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  className="min-h-[250px] text-sm bg-background font-mono"
                />
                <div className="flex gap-2 mt-3 flex-wrap">
                  {["{prenom}", "{type_bien}", "{ville}", "{prix}"].map((v) => (
                    <Badge key={v} variant="violet" className="text-[10px] cursor-pointer font-mono">
                      {v}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-3">
                  Aperçu
                </h3>
                {/* Phone Mockup */}
                <div className="mx-auto w-[260px] bg-background rounded-2xl border-2 border-border p-3">
                  <div className="h-4 w-16 bg-muted rounded-full mx-auto mb-3" />
                  <div className="bg-card rounded-lg p-3 text-xs text-foreground leading-relaxed whitespace-pre-line">
                    {smsText
                      .replace("{prenom}", "Jean-Marc")
                      .replace("{type_bien}", "maison 120m²")
                      .replace("{ville}", "Lyon")
                      .replace("{prix}", "450 000€")}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground px-1">
                    <span>156 caractères</span>
                    <span>Quota : 42/200 semaine</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* WhatsApp */}
        <TabsContent value="whatsapp">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
                    Connexion WhatsApp
                  </h3>
                  <div className="bg-background rounded-lg p-8 flex flex-col items-center gap-4 border border-border">
                    <QrCode className="h-32 w-32 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground text-center">
                      Scannez le QR Code avec WhatsApp pour connecter votre compte
                    </p>
                    <Badge variant="info" className="text-[10px] font-display">EN ATTENTE</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                    Paramètres
                  </h3>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <span className="text-sm text-foreground">Envoi automatique</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <span className="text-sm text-foreground">Audio pré-enregistré</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Plages horaires</span>
                    </div>
                    <div className="flex gap-2">
                      <Input className="h-8 text-xs bg-card" defaultValue="09:00" />
                      <span className="text-muted-foreground self-center">—</span>
                      <Input className="h-8 text-xs bg-card" defaultValue="19:00" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PàP */}
        <TabsContent value="pap">
          <Card className="bg-card border-border">
            <CardContent className="p-6 flex items-center justify-center min-h-[300px]">
              <p className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                Aucune donnée. Configurez votre connexion PàP.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Automatisation;
