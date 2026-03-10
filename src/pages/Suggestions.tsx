import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Lightbulb, Clock, Rocket, CheckCircle2, XCircle, ThumbsUp, CalendarDays, Plus, ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Idea {
  id: number;
  title: string;
  description: string;
  date: string;
  votes: number;
  voted: boolean;
  status: "suggestion" | "retenue" | "encours" | "sortie" | "rejetee";
  note?: string;
}

const initialIdeas: Idea[] = [
  { id: 1, title: "Application mobile", description: "Sortie d'une application mobile sur app store et google play", date: "7 mars 2026", votes: 10, voted: false, status: "sortie" },
  { id: 2, title: "Historique profil client LBC et LC", description: "Afin de permettre plus d'information sur la baisse de prix, les mise en ligne, ça pourrait être intéressant de se baser sur les profils directement.", date: "7 mars 2026", votes: 4, voted: false, status: "sortie" },
  { id: 3, title: "Filtre température SMS indépendant", description: "Les SMS ont leur propre filtre de température (chaud/tiède/froid) séparé du WhatsApp/LBC/Voice", date: "18 février 2026", votes: 2, voted: false, status: "sortie", note: "Chaque canal peut cibler des températures différentes" },
  { id: 4, title: "Analyse de distance des leads", description: "Calcul de distance routière réelle entre l'agence et le lead, avec filtres par km dans le kanban", date: "19 février 2026", votes: 1, voted: false, status: "sortie" },
  { id: 5, title: "Cotes Marché améliorées", description: "Intégration de données marché plus précises pour les estimations", date: "15 février 2026", votes: 3, voted: false, status: "sortie" },
  { id: 6, title: "Façon rapide de retrouver une annonce", description: "Pouvoir retrouver l'annonce correspondante au numéro de téléphone grâce à un lien direct dans l'historique des messages envoyés.", date: "5 mars 2026", votes: 0, voted: false, status: "retenue" },
  { id: 7, title: "Export CSV des leads", description: "Exporter la base vendeurs en CSV avec tous les filtres actifs", date: "10 mars 2026", votes: 0, voted: false, status: "sortie" },
];

const columns = [
  { key: "suggestion", label: "Suggestions", icon: Lightbulb, color: "text-primary" },
  { key: "retenue", label: "Retenues", icon: Clock, color: "text-primary" },
  { key: "encours", label: "En cours", icon: Rocket, color: "text-info" },
  { key: "sortie", label: "Sorties", icon: CheckCircle2, color: "text-success" },
  { key: "rejetee", label: "Rejetées", icon: XCircle, color: "text-muted-foreground" },
] as const;

const Suggestions = () => {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const navigate = useNavigate();

  const vote = (id: number) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, votes: i.voted ? i.votes - 1 : i.votes + 1, voted: !i.voted } : i));
  };

  const submitIdea = () => {
    if (!newTitle.trim()) return;
    setIdeas(prev => [{
      id: Date.now(), title: newTitle.trim(), description: newDesc.trim(),
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      votes: 0, voted: false, status: "suggestion",
    }, ...prev]);
    setNewTitle(""); setNewDesc("");
    setShowCreate(false);
    toast.success("Idée proposée !");
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              Suggestions & Mises à jour <span className="text-lg">✨</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Proposez des idées, votez, suivez les développements</p>
          </div>
        </div>
        <Button variant="attack" size="sm" className="gap-1.5 text-xs" onClick={() => setShowCreate(true)}>
          <Plus className="h-3.5 w-3.5" />
          Proposer une idée
        </Button>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-5 gap-3 items-start">
        {columns.map(col => {
          const colIdeas = ideas.filter(i => i.status === col.key);
          const Icon = col.icon;
          return (
            <div key={col.key}>
              <div className="flex items-center gap-2 mb-3 px-1">
                <Icon className={`h-4 w-4 ${col.color}`} />
                <span className="font-display text-xs font-bold text-foreground uppercase tracking-wider">{col.label}</span>
                <Badge variant="secondary" className="text-[10px]">{colIdeas.length}</Badge>
              </div>
              <div className="space-y-2">
                {colIdeas.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Aucune idée</p>
                ) : (
                  colIdeas.map(idea => (
                    <Card key={idea.id} className="bg-card border-border">
                      <CardContent className="p-3 space-y-2">
                        <p className="text-sm font-semibold text-foreground">{idea.title}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{idea.description}</p>
                        {idea.note && (
                          <div className="bg-primary/10 border border-primary/20 rounded p-2">
                            <p className="text-[11px] text-primary">{idea.note}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          {idea.date}
                        </div>
                        <button
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-colors ${
                            idea.voted
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                          }`}
                          onClick={() => vote(idea.id)}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          {idea.votes}
                        </button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Proposer une idée</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Titre *</label>
              <Input placeholder="Titre de votre suggestion" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="bg-background" autoFocus />
            </div>
            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Description</label>
              <Textarea placeholder="Décrivez votre idée en détail..." value={newDesc} onChange={e => setNewDesc(e.target.value)} className="bg-background min-h-[100px]" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button variant="attack" onClick={submitIdea}>Proposer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Suggestions;
