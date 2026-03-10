import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, CalendarClock, Plus, X } from "lucide-react";

interface Rule {
  id: number;
  field: string;
  operator: string;
  value: string;
}

const GlobalRules = () => {
  const [j2Toggle, setJ2Toggle] = useState(true);
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, field: "prix", operator: ">", value: "1 000 000€" },
    { id: 2, field: "surface", operator: "<", value: "10m²" },
  ]);

  const removeRule = (id: number) => setRules(rules.filter((r) => r.id !== id));
  const addRule = () => setRules([...rules, { id: Date.now(), field: "prix", operator: ">", value: "" }]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* Disqualification auto */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
              Disqualification auto
            </h3>
            <Badge variant="destructive" className="text-[10px] font-display ml-auto">
              {rules.length} RÈGLE{rules.length > 1 ? "S" : ""}
            </Badge>
          </div>
          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-2 p-2 bg-background rounded-lg border border-border">
                <Select defaultValue={rule.field}>
                  <SelectTrigger className="h-8 w-24 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prix">Prix</SelectItem>
                    <SelectItem value="surface">Surface</SelectItem>
                    <SelectItem value="ville">Ville</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue={rule.operator}>
                  <SelectTrigger className="h-8 w-16 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=">">&gt;</SelectItem>
                    <SelectItem value="<">&lt;</SelectItem>
                    <SelectItem value="=">=</SelectItem>
                    <SelectItem value="!=">≠</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="h-8 text-xs bg-card flex-1" defaultValue={rule.value} placeholder="Valeur…" />
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeRule(rule.id)}>
                  <X className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2 text-xs" onClick={addRule}>
              <Plus className="h-3 w-3 mr-1" /> Ajouter une règle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tâches J+2 */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="h-4 w-4 text-info" />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
              Tâche de rappel J+2
            </h3>
          </div>
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-foreground">Création automatique</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Crée une tâche de rappel 2 jours après un message auto sans réponse
                </p>
              </div>
              <Switch checked={j2Toggle} onCheckedChange={setJ2Toggle} />
            </div>
            {j2Toggle && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Délai après envoi</span>
                  <Badge variant="info" className="text-[10px]">48h</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Type de tâche</span>
                  <Badge variant="secondary" className="text-[10px]">Rappel téléphonique</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Priorité</span>
                  <Badge variant="hot" className="text-[10px]">Haute</Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalRules;
