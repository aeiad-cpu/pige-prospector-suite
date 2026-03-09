import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, User, Phone, Home } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const vendeurs = [
  { name: "Jean-Marc Leblanc", phone: "06 12 34 56 78", property: "Maison 120m²", ville: "Lyon", prix: "450 000 €", status: "Chaud", source: "LBC", lastContact: "Aujourd'hui" },
  { name: "Sophie Martin", phone: "06 23 45 67 89", property: "T3 65m²", ville: "Paris 11", prix: "520 000 €", status: "Chaud", source: "PAP", lastContact: "Hier" },
  { name: "Pierre Duval", phone: "06 34 56 78 90", property: "Villa 200m²", ville: "Aix", prix: "890 000 €", status: "Froid", source: "LBC", lastContact: "Il y a 3j" },
  { name: "Marie Rousseau", phone: "06 45 67 89 01", property: "T2 42m²", ville: "Bordeaux", prix: "245 000 €", status: "Tiède", source: "LBC", lastContact: "Il y a 5j" },
  { name: "Laurent Petit", phone: "06 56 78 90 12", property: "Maison 150m²", ville: "Nantes", prix: "380 000 €", status: "Froid", source: "PAP", lastContact: "Il y a 7j" },
  { name: "Claire Bernard", phone: "06 67 89 01 23", property: "T4 85m²", ville: "Marseille", prix: "310 000 €", status: "RDV fixé", source: "LBC", lastContact: "Aujourd'hui" },
  { name: "François Moreau", phone: "06 78 90 12 34", property: "Maison 95m²", ville: "Toulouse", prix: "275 000 €", status: "Chaud", source: "PAP", lastContact: "Hier" },
  { name: "Isabelle Leroy", phone: "06 89 01 23 45", property: "Duplex 110m²", ville: "Strasbourg", prix: "425 000 €", status: "Froid", source: "LBC", lastContact: "Il y a 10j" },
];

const BaseVendeurs = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Base Vendeurs</h1>
        <p className="text-sm text-muted-foreground mt-1">Tous vos contacts propriétaires</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Nom, ville, type de bien..." className="pl-10 h-9 text-sm bg-background" />
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-xs font-display uppercase">
          <Filter className="h-3.5 w-3.5" />
          Filtres
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Vendeur</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Bien</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Ville</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Prix</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Statut</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Source</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">Dernier contact</TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendeurs.map((v, i) => (
                <TableRow key={i} className="border-border hover:bg-accent/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 bg-muted rounded-sm flex items-center justify-center shrink-0">
                        <User className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{v.name}</p>
                        <p className="text-[10px] text-muted-foreground">{v.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{v.property}</TableCell>
                  <TableCell className="text-sm text-foreground">{v.ville}</TableCell>
                  <TableCell className="text-sm font-display font-bold text-foreground">{v.prix}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        v.status === "Chaud" ? "hot" :
                        v.status === "RDV fixé" ? "success" :
                        v.status === "Tiède" ? "default" : "cold"
                      }
                      className="text-[10px] font-display"
                    >
                      {v.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={v.source === "LBC" ? "default" : "info"} className="text-[8px] font-display">
                      {v.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{v.lastContact}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-xs text-muted-foreground">1-8 sur 1 247 vendeurs</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="text-xs h-7" disabled>Précédent</Button>
              <Button variant="outline" size="sm" className="text-xs h-7">Suivant</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default BaseVendeurs;
