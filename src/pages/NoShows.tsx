import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Phone, User } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const noshows = [
  { name: "Marc Lefevre", property: "T3 75m²", ville: "Nice", date: "08/03/2026 14:00", attempts: 2 },
  { name: "Julie Perrin", property: "Maison 140m²", ville: "Montpellier", date: "07/03/2026 10:30", attempts: 1 },
  { name: "David Simon", property: "T2 50m²", ville: "Rennes", date: "06/03/2026 16:00", attempts: 3 },
  { name: "Nathalie Faure", property: "Villa 180m²", ville: "Cannes", date: "05/03/2026 11:00", attempts: 1 },
];

const NoShows = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">No-shows</h1>
        <p className="text-sm text-muted-foreground mt-1">RDV manqués — relance prioritaire</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="font-display text-xs uppercase tracking-wider text-foreground font-bold">
              {noshows.length} no-shows à traiter
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Vendeur</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Bien</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">RDV prévu</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Tentatives</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {noshows.map((n, i) => (
                <TableRow key={i} className="border-border hover:bg-accent/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 bg-muted rounded-sm flex items-center justify-center">
                        <User className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{n.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{n.property} — {n.ville}</TableCell>
                  <TableCell className="text-sm text-destructive font-medium">{n.date}</TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="text-[10px] font-display">{n.attempts}x</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="attack" size="sm" className="text-xs gap-1">
                      <Phone className="h-3 w-3" />
                      Relancer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default NoShows;
