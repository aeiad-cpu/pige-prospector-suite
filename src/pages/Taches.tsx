import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ListChecks, Clock, Plus, AlertTriangle, CalendarDays, CheckCircle2, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";

interface Task {
  id: number;
  label: string;
  description: string;
  priority: "haute" | "moyenne" | "basse";
  dueDate: string;
  status: "retard" | "aujourdhui" | "avenir" | "terminee";
  done: boolean;
  assignee: string;
  lead: string;
}

const initialTasks: Task[] = [
  { id: 1, label: "Rappeler Jean-Marc Leblanc", description: "Relance suite visite Lyon 3e", priority: "haute", dueDate: "Hier", status: "retard", done: false, assignee: "Marc Dupont", lead: "Jean-Marc Leblanc" },
  { id: 2, label: "Envoyer estimation Sophie Martin", description: "Estimation T3 Marseille", priority: "moyenne", dueDate: "Aujourd'hui", status: "aujourdhui", done: false, assignee: "Marc Dupont", lead: "Sophie Martin" },
  { id: 3, label: "Préparer dossier Villa Aix", description: "Photos + comparatifs marché", priority: "basse", dueDate: "15/03/2026", status: "avenir", done: false, assignee: "Marc Dupont", lead: "Pierre Duval" },
  { id: 4, label: "Confirmer RDV Pierre Duval", description: "RDV estimation demain 14h", priority: "haute", dueDate: "Aujourd'hui", status: "aujourdhui", done: false, assignee: "Marc Dupont", lead: "Pierre Duval" },
  { id: 5, label: "Relance SMS Marie Rousseau", description: "Relance auto envoyée", priority: "moyenne", dueDate: "05/03", status: "terminee", done: true, assignee: "IA", lead: "Marie Rousseau" },
  { id: 6, label: "Appel découverte Laurent Petit", description: "Premier contact fait", priority: "basse", dueDate: "04/03", status: "terminee", done: true, assignee: "Marc Dupont", lead: "Laurent Petit" },
];

const statusConfig = {
  retard: { label: "En retard", dot: "bg-destructive", icon: AlertTriangle, cardBg: "bg-card border-border" },
  aujourdhui: { label: "Aujourd'hui", dot: "bg-primary", icon: Clock, cardBg: "bg-card border-border" },
  avenir: { label: "À venir", dot: "bg-info", icon: CalendarDays, cardBg: "bg-info text-info-foreground" },
  terminee: { label: "Terminées", dot: "bg-success", icon: CheckCircle2, cardBg: "bg-success text-success-foreground" },
};

const priorityConfig = {
  haute: { label: "HAUTE", variant: "destructive" as const },
  moyenne: { label: "MOYENNE", variant: "secondary" as const },
  basse: { label: "BASSE", variant: "secondary" as const },
};

const Taches = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    retard: true, aujourdhui: true, avenir: true, terminee: true,
  });
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<"haute" | "moyenne" | "basse">("moyenne");
  const [newAssignee, setNewAssignee] = useState("");
  const [newLead, setNewLead] = useState("");

  const counts = {
    retard: tasks.filter(t => t.status === "retard" && !t.done).length,
    aujourdhui: tasks.filter(t => t.status === "aujourdhui" && !t.done).length,
    avenir: tasks.filter(t => t.status === "avenir" && !t.done).length,
    terminee: tasks.filter(t => t.done).length,
  };

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleDone = (id: number) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done, status: !t.done ? "terminee" : t.status } : t));
  const deleteTask = (id: number) => { setTasks(prev => prev.filter(t => t.id !== id)); toast("Tâche supprimée"); };

  const changePriority = (id: number, priority: "haute" | "moyenne" | "basse") => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, priority } : t));
    toast.success(`Priorité changée : ${priority}`);
  };

  const createTask = () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: Date.now(), label: newTitle.trim(), description: newDesc.trim(),
      priority: newPriority, dueDate: "À planifier", status: "avenir",
      done: false, assignee: newAssignee || "Marc Dupont", lead: newLead || "Aucun lead",
    };
    setTasks(prev => [task, ...prev]);
    setNewTitle(""); setNewDesc(""); setNewPriority("moyenne"); setNewAssignee(""); setNewLead("");
    setShowCreate(false);
    toast.success("Tâche créée !");
  };

  const filteredStatuses = (["retard", "aujourdhui", "avenir", "terminee"] as const).filter(s => filter === "all" || filter === s);
  const getTasksForStatus = (status: string) => status === "terminee" ? tasks.filter(t => t.done) : tasks.filter(t => t.status === status && !t.done);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Tâches</h1>
          <p className="text-sm text-muted-foreground mt-1">Gérez vos rappels et actions à faire</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44 h-9 text-xs bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les tâches</SelectItem>
              <SelectItem value="retard">En retard</SelectItem>
              <SelectItem value="aujourdhui">Aujourd'hui</SelectItem>
              <SelectItem value="avenir">À venir</SelectItem>
              <SelectItem value="terminee">Terminées</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="attack" size="sm" className="gap-1.5 text-xs" onClick={() => setShowCreate(true)}>
            <Plus className="h-3.5 w-3.5" /> Nouvelle tâche
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(["retard", "aujourdhui", "avenir", "terminee"] as const).map((key) => {
          const cfg = statusConfig[key];
          const Icon = cfg.icon;
          const isHighlight = key === "avenir" || key === "terminee";
          return (
            <Card key={key} className={`${isHighlight ? cfg.cardBg : "bg-card border-border"} cursor-pointer hover:scale-[1.02] transition-transform`} onClick={() => setFilter(key)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold font-display ${isHighlight ? "" : "text-foreground"}`}>{counts[key]}</p>
                  <p className={`text-xs ${isHighlight ? "opacity-80" : "text-muted-foreground"}`}>{cfg.label}</p>
                </div>
                <Icon className={`h-6 w-6 ${isHighlight ? "opacity-60" : "text-muted-foreground"}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Task sections */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          {filteredStatuses.map((status) => {
            const cfg = statusConfig[status];
            const statusTasks = getTasksForStatus(status);
            const expanded = expandedSections[status];
            return (
              <div key={status}>
                <button className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-accent/30 transition-colors" onClick={() => toggleSection(status)}>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                    <span className="font-display text-sm font-bold text-foreground">{cfg.label}</span>
                    <Badge variant="secondary" className="text-[10px] ml-1">{statusTasks.length}</Badge>
                  </div>
                  {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {expanded && statusTasks.length > 0 && (
                  <div className="divide-y divide-border">
                    {statusTasks.map(t => (
                      <div key={t.id} className={`flex items-center gap-3 px-6 py-3 hover:bg-accent/20 transition-colors group ${t.done ? "opacity-50" : ""}`}>
                        <Checkbox checked={t.done} onCheckedChange={() => toggleDone(t.id)} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.label}</p>
                          {t.description && <p className="text-[11px] text-muted-foreground truncate">{t.description}</p>}
                        </div>
                        {/* Clickable priority */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="cursor-pointer">
                              <Badge variant={priorityConfig[t.priority].variant} className="text-[8px] font-display hover:ring-2 hover:ring-ring transition-all">
                                {priorityConfig[t.priority].label}
                              </Badge>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-32 p-1" align="center">
                            {(["haute", "moyenne", "basse"] as const).map(p => (
                              <button
                                key={p}
                                className={`w-full text-left px-3 py-1.5 text-xs rounded hover:bg-accent transition-colors ${t.priority === p ? "font-bold text-primary" : "text-foreground"}`}
                                onClick={() => changePriority(t.id, p)}
                              >
                                {p === "haute" ? "🔴 Haute" : p === "moyenne" ? "🟡 Moyenne" : "🟢 Basse"}
                              </button>
                            ))}
                          </PopoverContent>
                        </Popover>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 min-w-[70px]">
                          <Clock className="h-3 w-3" />{t.dueDate}
                        </span>
                        <button className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100" onClick={() => deleteTask(t.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Create Task Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Créer une tâche</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Titre *</label>
              <Input placeholder="Ex: Appeler le client" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="bg-background" autoFocus />
            </div>
            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Description</label>
              <Textarea placeholder="Détails de la tâche..." value={newDesc} onChange={e => setNewDesc(e.target.value)} className="bg-background min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Date d'échéance</label>
                <Input type="date" className="bg-background text-xs" />
              </div>
              <div>
                <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Priorité</label>
                <Select value={newPriority} onValueChange={v => setNewPriority(v as any)}>
                  <SelectTrigger className="bg-background text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="basse">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Lead associé</label>
              <Select value={newLead} onValueChange={setNewLead}>
                <SelectTrigger className="bg-background text-xs"><SelectValue placeholder="Aucun lead" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun lead</SelectItem>
                  <SelectItem value="Jean-Marc Leblanc">Jean-Marc Leblanc</SelectItem>
                  <SelectItem value="Sophie Martin">Sophie Martin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Assigné à</label>
              <Input placeholder="Nom de la personne" value={newAssignee} onChange={e => setNewAssignee(e.target.value)} className="bg-background" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button variant="attack" onClick={createTask}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Taches;
