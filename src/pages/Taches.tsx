import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ListChecks, Clock } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const taches = [
  { label: "Rappeler Jean-Marc Leblanc (Lyon)", priority: "urgent", time: "14:00", done: false },
  { label: "Envoyer estimation à Sophie Martin", priority: "normal", time: "15:30", done: false },
  { label: "Préparer dossier Villa Aix-en-Provence", priority: "normal", time: "16:00", done: false },
  { label: "Confirmer RDV Pierre Duval demain", priority: "urgent", time: "Aujourd'hui", done: false },
  { label: "Relance SMS Marie Rousseau", priority: "auto", time: "Automatique", done: true },
  { label: "Appel découverte Laurent Petit", priority: "normal", time: "Demain 10:00", done: true },
];

const Taches = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Tâches</h1>
        <p className="text-sm text-muted-foreground mt-1">Actions de prospection à traiter</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <ListChecks className="h-4 w-4 text-primary" />
            <span className="font-display text-xs uppercase tracking-wider text-foreground font-bold">
              {taches.filter(t => !t.done).length} tâches en attente
            </span>
          </div>
          <div className="divide-y divide-border">
            {taches.map((t, i) => (
              <div key={i} className={`flex items-center gap-3 p-4 hover:bg-accent/30 transition-colors ${t.done ? "opacity-50" : ""}`}>
                <Checkbox defaultChecked={t.done} />
                <span className={`flex-1 text-sm ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {t.label}
                </span>
                <Badge
                  variant={t.priority === "urgent" ? "destructive" : t.priority === "auto" ? "violet" : "secondary"}
                  className="text-[8px] font-display"
                >
                  {t.priority === "urgent" ? "URGENT" : t.priority === "auto" ? "AUTO" : "NORMAL"}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {t.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Taches;
