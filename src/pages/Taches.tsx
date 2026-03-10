import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListChecks, Clock, Plus, Archive, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";

interface Task {
  id: number;
  label: string;
  priority: "urgent" | "normal" | "auto";
  time: string;
  done: boolean;
  archived: boolean;
}

const initialTasks: Task[] = [
  { id: 1, label: "Rappeler Jean-Marc Leblanc (Lyon)", priority: "urgent", time: "14:00", done: false, archived: false },
  { id: 2, label: "Envoyer estimation à Sophie Martin", priority: "normal", time: "15:30", done: false, archived: false },
  { id: 3, label: "Préparer dossier Villa Aix-en-Provence", priority: "normal", time: "16:00", done: false, archived: false },
  { id: 4, label: "Confirmer RDV Pierre Duval demain", priority: "urgent", time: "Aujourd'hui", done: false, archived: false },
  { id: 5, label: "Relance SMS Marie Rousseau", priority: "auto", time: "Automatique", done: true, archived: false },
  { id: 6, label: "Appel découverte Laurent Petit", priority: "normal", time: "Demain 10:00", done: true, archived: false },
  { id: 7, label: "Relance Thomas Garcia (Lille)", priority: "normal", time: "Hier", done: true, archived: true },
  { id: 8, label: "Envoi dossier Anne Dubois", priority: "normal", time: "05/03", done: true, archived: true },
];

const Taches = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"urgent" | "normal">("normal");
  const [showArchives, setShowArchives] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const activeTasks = tasks.filter(t => !t.archived);
  const archivedTasks = tasks.filter(t => t.archived);
  const pendingCount = activeTasks.filter(t => !t.done).length;

  const toggleDone = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = () => {
    if (!newTaskLabel.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      label: newTaskLabel.trim(),
      priority: newTaskPriority,
      time: "À planifier",
      done: false,
      archived: false,
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskLabel("");
    setShowAddForm(false);
    toast.success("Tâche ajoutée !");
  };

  const archiveTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, archived: true } : t));
    toast("Tâche archivée");
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    toast("Tâche supprimée");
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Tâches</h1>
          <p className="text-sm text-muted-foreground mt-1">Actions de prospection à traiter</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-display uppercase gap-1.5"
            onClick={() => setShowArchives(!showArchives)}
          >
            <Archive className="h-3.5 w-3.5" />
            Archives ({archivedTasks.length})
          </Button>
          <Button
            variant="attack"
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="h-3.5 w-3.5" />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <Card className="bg-card border-primary/30 mb-4">
          <CardContent className="p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                  Description de la tâche
                </label>
                <Input
                  placeholder="Ex: Rappeler le vendeur de la maison à Lyon..."
                  className="h-9 text-sm bg-background"
                  value={newTaskLabel}
                  onChange={(e) => setNewTaskLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  autoFocus
                />
              </div>
              <div className="w-32">
                <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                  Priorité
                </label>
                <Select value={newTaskPriority} onValueChange={(v) => setNewTaskPriority(v as "urgent" | "normal")}>
                  <SelectTrigger className="h-9 text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">🔴 Urgent</SelectItem>
                    <SelectItem value="normal">🟢 Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" className="h-9" onClick={addTask}>
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Tasks */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <ListChecks className="h-4 w-4 text-primary" />
            <span className="font-display text-xs uppercase tracking-wider text-foreground font-bold">
              {pendingCount} tâche{pendingCount > 1 ? "s" : ""} en attente
            </span>
          </div>
          <div className="divide-y divide-border">
            {activeTasks.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">Aucune tâche active</p>
              </div>
            ) : (
              activeTasks.map((t) => (
                <div key={t.id} className={`flex items-center gap-3 p-4 hover:bg-accent/30 transition-colors group ${t.done ? "opacity-50" : ""}`}>
                  <Checkbox
                    checked={t.done}
                    onCheckedChange={() => toggleDone(t.id)}
                  />
                  <span className={`flex-1 text-sm ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {t.label}
                  </span>
                  <Badge
                    variant={t.priority === "urgent" ? "destructive" : t.priority === "auto" ? "violet" : "secondary"}
                    className="text-[8px] font-display"
                  >
                    {t.priority === "urgent" ? "URGENT" : t.priority === "auto" ? "AUTO" : "NORMAL"}
                  </Badge>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground min-w-[80px]">
                    <Clock className="h-3 w-3" />
                    {t.time}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      onClick={() => archiveTask(t.id)}
                      title="Archiver"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={() => deleteTask(t.id)}
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Archives */}
      {showArchives && archivedTasks.length > 0 && (
        <Card className="bg-card border-border mt-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <Archive className="h-4 w-4 text-muted-foreground" />
              <span className="font-display text-xs uppercase tracking-wider text-muted-foreground font-bold">
                {archivedTasks.length} tâche{archivedTasks.length > 1 ? "s" : ""} archivée{archivedTasks.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="divide-y divide-border">
              {archivedTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-4 opacity-40">
                  <Checkbox checked disabled />
                  <span className="flex-1 text-sm line-through text-muted-foreground">{t.label}</span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {t.time}
                  </div>
                  <button
                    className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={() => deleteTask(t.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
};

export default Taches;
