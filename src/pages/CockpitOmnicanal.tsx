import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Phone,
  Send,
  Search,
  Home,
  User,
  CalendarCheck,
  Clock,
  Smartphone,
  MessageCircle,
  Mail,
  Globe,
  Sparkles,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

type Channel = "sms" | "whatsapp" | "lbc" | "pap";

interface Conversation {
  id: number;
  name: string;
  bien: string;
  ville: string;
  lastMessage: string;
  time: string;
  channel: Channel;
  unread: boolean;
  tag?: "objection" | "chaud" | "attente";
}

const conversations: Conversation[] = [
  { id: 1, name: "Jean-Marc Leblanc", bien: "Maison 120m²", ville: "Lyon 3ème", lastMessage: "Je ne suis pas intéressé par les agences...", time: "2 min", channel: "whatsapp", unread: true, tag: "objection" },
  { id: 2, name: "Sophie Martin", bien: "T3 65m²", ville: "Paris 11ème", lastMessage: "Oui pourquoi pas, vous proposez quoi ?", time: "4 min", channel: "sms", unread: true, tag: "chaud" },
  { id: 3, name: "Pierre Durand", bien: "Villa 200m²", ville: "Aix-en-Provence", lastMessage: "Rappelez-moi demain svp", time: "12 min", channel: "pap", unread: false, tag: "attente" },
  { id: 4, name: "Marie Leclerc", bien: "T2 42m²", ville: "Bordeaux", lastMessage: "C'est noté, à bientôt", time: "1h", channel: "whatsapp", unread: false },
  { id: 5, name: "François Petit", bien: "Maison 150m²", ville: "Nantes", lastMessage: "Quel est votre taux de commission ?", time: "2h", channel: "sms", unread: false, tag: "objection" },
  { id: 6, name: "Laurent Moreau", bien: "T4 90m²", ville: "Toulouse", lastMessage: "Bonjour, j'ai vu votre message sur LeBonCoin", time: "3h", channel: "lbc", unread: true, tag: "chaud" },
  { id: 7, name: "Anne Dubois", bien: "Maison 110m²", ville: "Lille", lastMessage: "Je vais y réfléchir", time: "5h", channel: "lbc", unread: false },
];

const threadMessages = [
  { id: 1, from: "agent", text: "Bonjour M. Leblanc, j'ai vu votre annonce pour votre maison à Lyon 3ème. J'ai des acquéreurs qualifiés intéressés.", time: "09:12", channel: "whatsapp" as Channel },
  { id: 2, from: "prospect", text: "Bonjour, merci mais je ne suis pas intéressé par les agences.", time: "09:18", channel: "whatsapp" as Channel },
  { id: 3, from: "agent", text: "Je comprends. Notre approche est différente : nos honoraires sont à la charge de l'acquéreur, pas du vendeur.", time: "09:20", channel: "whatsapp" as Channel },
  { id: 4, from: "prospect", text: "Je ne suis pas intéressé par les agences...", time: "09:22", channel: "whatsapp" as Channel },
];

const channelIcon: Record<Channel, React.ReactNode> = {
  sms: <Smartphone className="h-3 w-3" />,
  whatsapp: <MessageCircle className="h-3 w-3" />,
  lbc: <Globe className="h-3 w-3" />,
  pap: <Mail className="h-3 w-3" />,
};

const channelLabel: Record<Channel, string> = { sms: "SMS", whatsapp: "WhatsApp", lbc: "LBC", pap: "PàP" };

const channelColor: Record<Channel, string> = {
  sms: "text-info",
  whatsapp: "text-success",
  lbc: "text-primary",
  pap: "text-violet",
};

const tagConfig: Record<string, { label: string; variant: "destructive" | "default" | "info" }> = {
  objection: { label: "Objection", variant: "destructive" },
  chaud: { label: "🔥 Chaud", variant: "default" },
  attente: { label: "Attente < 5 min", variant: "info" },
};

const CockpitOmnicanal = () => {
  const [selected, setSelected] = useState(0);
  const [message, setMessage] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "action">("all");
  const [channelFilter, setChannelFilter] = useState<"all" | Channel>("all");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showAiReply, setShowAiReply] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const active = conversations[selected];

  const filtered = conversations.filter((c) => {
    if (statusFilter === "unread" && !c.unread) return false;
    if (statusFilter === "action" && !c.tag) return false;
    if (channelFilter !== "all" && c.channel !== channelFilter) return false;
    if (searchFilter && !c.name.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  const generateAiReply = () => {
    setAiLoading(true);
    setTimeout(() => {
      const replies: Record<string, string> = {
        objection: `Bonjour ${active.name.split(" ")[0]}, je comprends tout à fait votre réticence. Sachez que chez iad, nos honoraires sont parmi les plus bas du marché et à la charge de l'acquéreur. Je vous propose simplement un avis de valeur gratuit et sans engagement. Qu'en pensez-vous ?`,
        chaud: `Bonjour ${active.name.split(" ")[0]}, merci pour votre intérêt ! Je vous propose un rendez-vous cette semaine pour estimer votre ${active.bien} à ${active.ville}. Quelles sont vos disponibilités ?`,
        attente: `Bonjour ${active.name.split(" ")[0]}, je me permets de revenir vers vous concernant votre ${active.bien} à ${active.ville}. Avez-vous eu le temps de réfléchir ? Je reste disponible pour répondre à vos questions.`,
      };
      setAiSuggestion(replies[active.tag || "attente"] || replies.attente);
      setShowAiReply(true);
      setAiLoading(false);
    }, 1000);
  };

  const insertAiReply = () => {
    setMessage(aiSuggestion);
    setShowAiReply(false);
    toast.success("Réponse IA insérée — modifiez-la avant d'envoyer");
  };

  const handleSend = () => {
    if (!message.trim()) return;
    toast.success(`Message envoyé via ${channelLabel[active.channel]} à ${active.name}`);
    setMessage("");
  };

  return (
    <AppLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Cockpit Omnicanal</h1>
        <p className="text-sm text-muted-foreground mt-1">Boîte de réception unifiée — SMS, WhatsApp, LBC, PàP</p>
      </div>

      <div className="grid grid-cols-12 gap-3 h-[calc(100vh-10rem)]">
        {/* LEFT — Conversations list */}
        <Card className="col-span-3 bg-card border-border flex flex-col overflow-hidden">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="p-3 border-b border-border space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Rechercher..." className="pl-8 h-8 text-xs bg-background" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
              </div>
              {/* Channel filter */}
              <div className="flex gap-1 flex-wrap">
                {(["all", "sms", "whatsapp", "lbc", "pap"] as const).map((ch) => (
                  <Badge
                    key={ch}
                    variant={channelFilter === ch ? "default" : "secondary"}
                    className="text-[9px] cursor-pointer gap-0.5"
                    onClick={() => setChannelFilter(ch)}
                  >
                    {ch !== "all" && channelIcon[ch]}
                    {ch === "all" ? "Tous" : channelLabel[ch]}
                  </Badge>
                ))}
              </div>
              {/* Status filter */}
              <div className="flex gap-1">
                {(["all", "unread", "action"] as const).map((s) => (
                  <Badge key={s} variant={statusFilter === s ? "default" : "secondary"} className="text-[9px] cursor-pointer" onClick={() => setStatusFilter(s)}>
                    {s === "all" ? "Tous" : s === "unread" ? "Non lu" : "À traiter"}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">Aucune conversation</p>
              ) : filtered.map((conv) => {
                const idx = conversations.indexOf(conv);
                return (
                  <button key={conv.id} onClick={() => setSelected(idx)} className={`w-full text-left p-3 border-b border-border transition-colors hover:bg-accent/50 ${idx === selected ? "bg-accent" : ""}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${conv.unread ? "text-foreground font-bold" : "text-foreground"}`}>{conv.name}</span>
                      <span className="text-[10px] text-muted-foreground">{conv.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge variant="secondary" className={`text-[8px] px-1 py-0 gap-0.5 ${channelColor[conv.channel]}`}>
                        {channelIcon[conv.channel]} {channelLabel[conv.channel]}
                      </Badge>
                      {conv.tag && <Badge variant={tagConfig[conv.tag].variant} className="text-[8px] px-1 py-0">{tagConfig[conv.tag].label}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CENTER — Thread */}
        <Card className="col-span-6 bg-card border-border flex flex-col overflow-hidden">
          <CardContent className="p-0 flex flex-col h-full">
            {/* Thread header */}
            <div className="p-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-muted rounded-sm flex items-center justify-center"><User className="h-4 w-4 text-muted-foreground" /></div>
                <div>
                  <p className="text-sm font-display font-bold text-foreground">{active.name}</p>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className={`text-[8px] px-1 py-0 gap-0.5 ${channelColor[active.channel]}`}>
                      {channelIcon[active.channel]} {channelLabel[active.channel]}
                    </Badge>
                    {active.tag && <Badge variant={tagConfig[active.tag].variant} className="text-[8px] px-1 py-0">{tagConfig[active.tag].label}</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="text-xs gap-1"><Phone className="h-3 w-3" /> Appeler</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1"><CalendarCheck className="h-3 w-3" /> RDV</Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {threadMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "agent" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-lg p-3 text-sm ${msg.from === "agent" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge variant="secondary" className="text-[7px] px-1 py-0 bg-background/20 text-inherit gap-0.5">{channelIcon[msg.channel]} {channelLabel[msg.channel]}</Badge>
                      <span className="text-[10px] opacity-70">{msg.time}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Suggestion */}
            {showAiReply && (
              <div className="mx-3 mb-2 p-3 bg-violet/10 border border-violet/30 rounded-lg">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-violet" />
                  <span className="font-display text-[10px] uppercase tracking-wider text-violet font-bold">Suggestion IA</span>
                </div>
                <Textarea
                  value={aiSuggestion}
                  onChange={(e) => setAiSuggestion(e.target.value)}
                  className="bg-background text-sm min-h-[80px] mb-2"
                />
                <div className="flex gap-2">
                  <Button size="sm" className="text-xs gap-1" onClick={insertAiReply}>
                    <Pencil className="h-3 w-3" /> Insérer dans le message
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowAiReply(false)}>Ignorer</Button>
                </div>
              </div>
            )}

            {/* Composer */}
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Textarea placeholder="Votre réponse..." className="min-h-[60px] text-sm bg-background resize-none" value={message} onChange={(e) => setMessage(e.target.value)} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5 text-violet border-violet/30 hover:bg-violet/10"
                    onClick={generateAiReply}
                    disabled={aiLoading}
                  >
                    <Sparkles className="h-3 w-3" />
                    {aiLoading ? "Génération..." : "Répondre avec l'IA"}
                  </Button>
                </div>
                <Button variant="default" size="lg" className="gap-2 shrink-0 self-end" onClick={handleSend}>
                  {channelIcon[active.channel]}
                  <Send className="h-4 w-4" />
                  <span className="text-xs font-display uppercase">{channelLabel[active.channel]}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT — Lead card */}
        <Card className="col-span-3 bg-card border-border flex flex-col overflow-hidden">
          <CardContent className="p-4 space-y-4 overflow-y-auto">
            <div className="text-center">
              <div className="h-14 w-14 bg-muted rounded-sm flex items-center justify-center mx-auto mb-2"><User className="h-7 w-7 text-muted-foreground" /></div>
              <h3 className="font-display font-bold text-foreground">{active.name}</h3>
              <p className="text-xs text-muted-foreground">{active.ville}</p>
            </div>

            <div className="bg-background rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2"><Home className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium text-foreground">{active.bien}</span></div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><p className="text-muted-foreground">Ville</p><p className="font-medium text-foreground">{active.ville}</p></div>
                <div><p className="text-muted-foreground">Canal</p><Badge variant="default" className={`text-[8px] gap-0.5 ${channelColor[active.channel]}`}>{channelIcon[active.channel]} {channelLabel[active.channel]}</Badge></div>
              </div>
            </div>

            <div>
              <h4 className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Historique CRM</h4>
              <div className="space-y-1.5">
                {[{ action: "SMS Auto envoyé", time: "Aujourd'hui 09:12" }, { action: "Appel — Pas de réponse", time: "Hier 14:30" }, { action: "Lead détecté", time: "Il y a 2 jours" }].map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 bg-background rounded-md">
                    <span className="text-foreground">{h.action}</span>
                    <span className="text-muted-foreground text-[10px]">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Actions rapides</h4>
              <Button variant="attack" size="sm" className="w-full text-xs gap-1"><Phone className="h-3 w-3" /> Power Dialer</Button>
              <Button variant="outline" size="sm" className="w-full text-xs gap-1"><CalendarCheck className="h-3 w-3" /> Planifier RDV</Button>
              <Button variant="outline" size="sm" className="w-full text-xs gap-1"><MessageSquare className="h-3 w-3" /> Envoyer SMS</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CockpitOmnicanal;
