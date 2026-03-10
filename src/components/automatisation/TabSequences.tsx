import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, MessageSquare, Phone, Mic, ArrowRight, Plus } from "lucide-react";

const sequenceSteps = [
  { day: "J0", action: "Audio WhatsApp", icon: Mic, color: "success" },
  { day: "J+1", action: "SMS personnalisé", icon: MessageSquare, color: "info" },
  { day: "J+2", action: "Appel direct", icon: Phone, color: "primary" },
  { day: "J+4", action: "Relance WhatsApp", icon: MessageSquare, color: "success" },
  { day: "J+7", action: "Appel final", icon: Phone, color: "destructive" },
];

const TabSequences = () => {
  return (
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
  );
};

export default TabSequences;
