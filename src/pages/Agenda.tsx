import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const events = [
  { time: "09:00", title: "Appel découverte — Sophie Martin", type: "call", duration: "30 min" },
  { time: "10:30", title: "RDV estimation — Maison Lyon 3ème", type: "rdv", duration: "1h" },
  { time: "14:00", title: "Rappel Jean-Marc Leblanc", type: "callback", duration: "15 min" },
  { time: "15:30", title: "Visite Villa Aix-en-Provence", type: "rdv", duration: "1h30" },
  { time: "17:00", title: "Session Power Dialer", type: "dialer", duration: "2h" },
];

const Agenda = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Agenda</h1>
        <p className="text-sm text-muted-foreground mt-1">Lundi 9 Mars 2026</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="font-display text-xs uppercase tracking-wider text-foreground font-bold">
              {events.length} événements aujourd'hui
            </span>
          </div>
          <div className="divide-y divide-border">
            {events.map((e, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors">
                <div className="w-16 text-right">
                  <span className="font-display font-bold text-sm text-foreground">{e.time}</span>
                </div>
                <div className={`h-10 w-1 rounded-full ${
                  e.type === "rdv" ? "bg-success" :
                  e.type === "call" ? "bg-info" :
                  e.type === "callback" ? "bg-primary" : "bg-violet"
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{e.title}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                    <Clock className="h-3 w-3" />
                    {e.duration}
                  </div>
                </div>
                <Badge
                  variant={
                    e.type === "rdv" ? "success" :
                    e.type === "call" ? "info" :
                    e.type === "callback" ? "default" : "violet"
                  }
                  className="text-[8px] font-display uppercase"
                >
                  {e.type === "rdv" ? "RDV" : e.type === "call" ? "APPEL" : e.type === "callback" ? "RAPPEL" : "DIALER"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Agenda;
