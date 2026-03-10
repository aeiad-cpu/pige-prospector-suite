import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bot, Zap, CalendarCheck, MessageCircle, User } from "lucide-react";

const defaultDirectives = `Tu es un assistant IA spécialisé en immobilier. Tu représentes un conseiller immobilier professionnel.

RÈGLES :
- Si le vendeur dit "pas d'agence" → Expliquez que vous avez des acheteurs en recherche active sur ce secteur et que vos honoraires sont à la charge de l'acquéreur.
- Si le vendeur dit "j'ai déjà un mandat" → Proposez un mandat simple non-exclusif comme complément.
- Si le vendeur hésite → Proposez un RDV de 20 minutes sans engagement.
- Toujours rester courtois et professionnel.
- Ne jamais mentir sur les prix ou les délais.`;

const simulatedChat = [
  { from: "ia", text: "Bonjour M. Dupuis, je suis l'assistant de Marc Dupont, conseiller sur Lyon 6ème. J'ai remarqué votre annonce pour votre T4. Seriez-vous ouvert à un échange ?" },
  { from: "prospect", text: "Non merci, je ne veux pas d'agence." },
  { from: "ia", text: "Je comprends parfaitement. Ce qui est intéressant c'est que nos honoraires sont 100% à la charge de l'acquéreur. Vous recevez exactement votre prix net. Puis-je vous proposer un court échange de 15 min pour vous montrer notre approche ?" },
  { from: "prospect", text: "Hmm... pourquoi pas. C'est quand ?" },
  { from: "ia", text: "Parfait ! Je vous propose demain à 10h ou 14h, qu'est-ce qui vous arrange le mieux ? 📅" },
];

const TabAgentIA = () => {
  const [relaisObjection, setRelaisObjection] = useState(true);
  const [autoRdv, setAutoRdv] = useState(true);
  const [autoRequalif, setAutoRequalif] = useState(false);
  const [directives, setDirectives] = useState(defaultDirectives);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Badge variant="violet" className="text-[10px] font-display uppercase gap-1">
          <Bot className="h-3 w-3" /> Agent IA Setter
        </Badge>
        <span className="text-[10px] text-muted-foreground">Automatise la qualification et la prise de RDV</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT — Config */}
        <div className="space-y-4">
          {/* Toggles */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground">Paramétrage</h3>

              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Prise de relais IA si objection classique</p>
                    <p className="text-[10px] text-muted-foreground">L'IA répond automatiquement aux objections fréquentes</p>
                  </div>
                </div>
                <Switch checked={relaisObjection} onCheckedChange={setRelaisObjection} />
              </div>

              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <CalendarCheck className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Proposition automatique de RDV</p>
                    <p className="text-[10px] text-muted-foreground">Propose des créneaux si le prospect est réceptif</p>
                  </div>
                </div>
                <Switch checked={autoRdv} onCheckedChange={setAutoRdv} />
              </div>

              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-info" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Requalification automatique</p>
                    <p className="text-[10px] text-muted-foreground">Change le statut du lead selon la réponse IA</p>
                  </div>
                </div>
                <Switch checked={autoRequalif} onCheckedChange={setAutoRequalif} />
              </div>
            </CardContent>
          </Card>

          {/* Directives */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground">Directives de l'IA</h3>
              <Textarea
                value={directives}
                onChange={(e) => setDirectives(e.target.value)}
                className="min-h-[220px] text-sm bg-background font-mono"
                placeholder="Instructions pour l'agent IA..."
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{directives.length} caractères</span>
                <Button variant="default" size="sm" className="text-xs font-display uppercase">Sauvegarder</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — Simulator */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-[10px] font-display uppercase">Simulateur</Badge>
              <span className="text-[10px] text-muted-foreground">Aperçu conversation IA</span>
            </div>

            {/* Phone mockup */}
            <div className="mx-auto max-w-[320px]">
              <div className="border-[3px] border-muted rounded-[2rem] p-1 bg-background">
                {/* Phone top bar */}
                <div className="bg-muted rounded-t-[1.5rem] px-4 py-2 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">09:41</span>
                  <div className="h-4 w-16 bg-foreground/20 rounded-full" />
                  <span className="text-[10px] text-muted-foreground">●●●</span>
                </div>

                {/* Chat header */}
                <div className="bg-muted px-4 py-2 flex items-center gap-2 border-b border-border">
                  <div className="h-7 w-7 bg-primary/20 rounded-full flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Agent IA — PIGE IMMO</p>
                    <p className="text-[9px] text-success">● En ligne</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="px-3 py-3 space-y-2 min-h-[350px] max-h-[400px] overflow-y-auto bg-background">
                  {simulatedChat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === "ia" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        msg.from === "ia"
                          ? "bg-muted text-foreground rounded-bl-sm"
                          : "bg-primary text-primary-foreground rounded-br-sm"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom bar */}
                <div className="bg-muted rounded-b-[1.5rem] px-4 py-3 flex items-center gap-2">
                  <div className="flex-1 h-7 bg-background rounded-full px-3 flex items-center">
                    <span className="text-[10px] text-muted-foreground">Message...</span>
                  </div>
                  <div className="h-7 w-7 bg-primary rounded-full flex items-center justify-center">
                    <MessageCircle className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TabAgentIA;
