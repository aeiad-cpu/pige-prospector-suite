import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Crosshair, Zap, Home, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const pepites = [
  { id: 1, desc: "Maison 140m² jardin + piscine", ville: "Lyon 6ème", prix: "620 000 €", time: "1 min", source: "LBC", score: 98 },
  { id: 2, desc: "T4 85m² dernier étage terrasse", ville: "Paris 16ème", prix: "780 000 €", time: "2 min", source: "PAP", score: 95 },
  { id: 3, desc: "Loft 110m² rénové parking", ville: "Bordeaux Centre", prix: "410 000 €", time: "3 min", source: "LBC", score: 92 },
];

export function RadarPepites() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-md hover:bg-accent transition-colors group">
          <Zap className="h-4 w-4 text-primary animate-pulse" />
          <span className="absolute top-0.5 right-0.5 h-2.5 w-2.5 bg-destructive rounded-full animate-ping" />
          <span className="absolute top-0.5 right-0.5 h-2.5 w-2.5 bg-destructive rounded-full" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-[420px] sm:w-[420px] bg-card border-border">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display text-foreground">
            <Zap className="h-5 w-5 text-primary" />
            Radar Pépites
            <Badge variant="destructive" className="text-[9px] font-display uppercase animate-pulse">LIVE</Badge>
          </SheetTitle>
          <p className="text-xs text-muted-foreground">Biens parfaits publiés il y a moins de 3 minutes</p>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {pepites.map((p) => (
            <div key={p.id} className="p-3 bg-background rounded-lg border border-primary/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{p.desc}</span>
                </div>
                <Badge variant="default" className="text-[8px] font-display">{p.source}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{p.ville}</span>
                <span className="font-display font-bold text-foreground">{p.prix}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary font-medium">Il y a {p.time}</span>
                  <Badge variant="secondary" className="text-[8px]">Score {p.score}%</Badge>
                </div>
                <Button
                  variant="attack"
                  size="sm"
                  className="text-xs gap-1"
                  onClick={() => { setOpen(false); navigate("/dialer"); }}
                >
                  <Crosshair className="h-3 w-3" /> Attaquer
                </Button>
              </div>
            </div>
          ))}

          {pepites.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Aucune pépite détectée pour le moment
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
