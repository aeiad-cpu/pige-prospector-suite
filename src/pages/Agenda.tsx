import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, ChevronLeft, ChevronRight, Link2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const events: Record<string, { time: string; title: string; type: string; duration: string; color?: string }[]> = {
  "2026-03-09": [
    { time: "09:00", title: "Appel découverte — Sophie Martin", type: "call", duration: "30 min" },
    { time: "10:30", title: "RDV estimation — Maison Lyon 3ème", type: "rdv", duration: "1h" },
    { time: "14:00", title: "Rappel Jean-Marc Leblanc", type: "callback", duration: "15 min" },
    { time: "15:30", title: "Visite Villa Aix-en-Provence", type: "rdv", duration: "1h30" },
    { time: "17:00", title: "Session Power Dialer", type: "dialer", duration: "2h" },
  ],
  "2026-03-10": [
    { time: "09:30", title: "Appel Laurent Petit (Nantes)", type: "call", duration: "20 min" },
    { time: "11:00", title: "Visite T3 Marseille — Claire Bernard", type: "rdv", duration: "1h" },
    { time: "14:30", title: "Réunion équipe commerciale", type: "rdv", duration: "1h", color: "violet" },
    { time: "16:00", title: "Power Dialer — Session après-midi", type: "dialer", duration: "2h" },
  ],
  "2026-03-11": [
    { time: "10:00", title: "Estimation Villa Cannes", type: "rdv", duration: "1h30" },
    { time: "15:00", title: "Rappel Thomas Garcia", type: "callback", duration: "15 min" },
  ],
  "2026-03-12": [
    { time: "09:00", title: "Formation IA Setter", type: "rdv", duration: "2h", color: "violet" },
    { time: "14:00", title: "Visite T5 Paris 8ème", type: "rdv", duration: "1h" },
  ],
  "2026-03-13": [
    { time: "10:00", title: "Bilan hebdomadaire", type: "rdv", duration: "1h" },
  ],
};

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState("2026-03-10");
  const [viewMode, setViewMode] = useState<"day" | "week">("day");

  const dateObj = new Date(currentDate);
  const dayName = dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const todayEvents = events[currentDate] || [];

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + dir);
    setCurrentDate(d.toISOString().split("T")[0]);
  };

  // Week view: get Mon-Sun of current week
  const getWeekDates = () => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const mon = new Date(d);
    mon.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(mon);
      dd.setDate(mon.getDate() + i);
      return dd.toISOString().split("T")[0];
    });
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Agenda</h1>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{dayName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-display gap-1 cursor-pointer hover:bg-muted">
            <Link2 className="h-3 w-3" />
            Connecter Google Agenda
          </Badge>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button variant={viewMode === "day" ? "default" : "ghost"} size="sm" className="h-7 px-2.5 text-[10px] font-display uppercase" onClick={() => setViewMode("day")}>
              Jour
            </Button>
            <Button variant={viewMode === "week" ? "default" : "ghost"} size="sm" className="h-7 px-2.5 text-[10px] font-display uppercase" onClick={() => setViewMode("week")}>
              Semaine
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "day" ? (
        /* Day View */
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="font-display text-xs uppercase tracking-wider text-foreground font-bold">
                {todayEvents.length} événement{todayEvents.length > 1 ? "s" : ""} aujourd'hui
              </span>
            </div>
            {todayEvents.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">Aucun événement ce jour</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {todayEvents.map((e, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors">
                    <div className="w-16 text-right">
                      <span className="font-display font-bold text-sm text-foreground">{e.time}</span>
                    </div>
                    <div className={`h-10 w-1 rounded-full ${
                      e.color === "violet" ? "bg-violet" :
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
                        e.color === "violet" ? "violet" :
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
            )}
          </CardContent>
        </Card>
      ) : (
        /* Week View */
        <div className="grid grid-cols-7 gap-2">
          {getWeekDates().map((date, i) => {
            const dayEvents = events[date] || [];
            const d = new Date(date);
            const isToday = date === currentDate;
            return (
              <Card key={date} className={`bg-card border-border ${isToday ? "ring-1 ring-primary" : ""}`}>
                <CardContent className="p-2">
                  <div className={`text-center mb-2 py-1 rounded ${isToday ? "bg-primary/10" : ""}`}>
                    <p className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">{weekDays[i]}</p>
                    <p className={`font-display font-bold text-lg ${isToday ? "text-primary" : "text-foreground"}`}>
                      {d.getDate()}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {dayEvents.length === 0 ? (
                      <p className="text-[9px] text-muted-foreground/50 text-center py-2">—</p>
                    ) : (
                      dayEvents.map((e, j) => (
                        <div key={j} className="bg-background rounded p-1.5 cursor-pointer hover:bg-accent/30 transition-colors">
                          <p className="text-[9px] font-display font-bold text-primary">{e.time}</p>
                          <p className="text-[10px] text-foreground leading-tight truncate">{e.title}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default Agenda;
