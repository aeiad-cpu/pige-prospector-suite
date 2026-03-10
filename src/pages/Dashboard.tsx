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
import {
  Users,
  Phone,
  CalendarCheck,
  FileSignature,
  TrendingUp,
  Crosshair,
  Home,
  Mic,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const kpis = [
  { label: "Propriétaires prospectés", value: "1 247", icon: Users, change: "+23 aujourd'hui" },
  { label: "Appels à passer", value: "38", icon: Phone, change: "12 urgents" },
  { label: "RDV prévus", value: "7", icon: CalendarCheck, change: "3 cette semaine" },
  { label: "Mandats signés", value: "4", icon: FileSignature, change: "+1 ce mois" },
  { label: "Vocaux déposés", value: "23", icon: Mic, change: "+5 aujourd'hui" },
];

const sources = [
  { name: "Leboncoin", total: 8432, today: 127, week: 843, color: "primary" as const },
  { name: "PAP", total: 3201, today: 54, week: 312, color: "info" as const },
];

const radarData = [
  {
    id: 1,
    type: "Maison",
    surface: "120m²",
    desc: "Maison 120m² avec jardin",
    ville: "Lyon 3ème",
    prix: "450 000 €",
    temps: "2 min",
    source: "LBC",
    isNew: true,
  },
  {
    id: 2,
    type: "Appartement",
    surface: "65m²",
    desc: "Appartement T3 lumineux",
    ville: "Paris 11ème",
    prix: "520 000 €",
    temps: "8 min",
    source: "PAP",
    isNew: true,
  },
  {
    id: 3,
    type: "Maison",
    surface: "200m²",
    desc: "Villa contemporaine piscine",
    ville: "Aix-en-Provence",
    prix: "890 000 €",
    temps: "15 min",
    source: "LBC",
    isNew: false,
  },
  {
    id: 4,
    type: "Appartement",
    surface: "42m²",
    desc: "T2 rénové centre-ville",
    ville: "Bordeaux",
    prix: "245 000 €",
    temps: "22 min",
    source: "LBC",
    isNew: false,
  },
  {
    id: 5,
    type: "Maison",
    surface: "150m²",
    desc: "Maison de ville 5 pièces",
    ville: "Nantes",
    prix: "380 000 €",
    temps: "35 min",
    source: "PAP",
    isNew: false,
  },
  {
    id: 6,
    type: "Appartement",
    surface: "85m²",
    desc: "T4 dernier étage terrasse",
    ville: "Marseille 8ème",
    prix: "310 000 €",
    temps: "47 min",
    source: "LBC",
    isNew: false,
  },
  {
    id: 7,
    type: "Maison",
    surface: "95m²",
    desc: "Maison plain-pied garage",
    ville: "Toulouse",
    prix: "275 000 €",
    temps: "1h02",
    source: "PAP",
    isNew: false,
  },
  {
    id: 8,
    type: "Appartement",
    surface: "110m²",
    desc: "Duplex standing balcon",
    ville: "Strasbourg",
    prix: "425 000 €",
    temps: "1h18",
    source: "LBC",
    isNew: false,
  },
];

const Dashboard = () => {
  return (
    <AppLayout>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Tableau de bord
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vue d'ensemble de votre activité de prospection
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
                  <kpi.icon className="h-5 w-5 text-primary" />
                </div>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              <p className="text-[10px] text-success mt-1">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {sources.map((src) => (
          <Card key={src.name} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                    {src.name}
                  </h3>
                </div>
                <Badge variant={src.color === "primary" ? "default" : "info"} className="text-[10px]">
                  ACTIF
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xl font-display font-bold text-foreground">
                    {src.total.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">Total</p>
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-primary">
                    +{src.today}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">Aujourd'hui</p>
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-foreground">
                    {src.week}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">7 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Radar Live */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                Radar Live — Derniers Biens Publiés
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] font-display">
                {radarData.length} BIENS
              </Badge>
              <Crosshair className="h-4 w-4 text-primary" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Bien
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Ville
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Prix
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Temps
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Source
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {radarData.map((item) => (
                <TableRow
                  key={item.id}
                  className={`border-border hover:bg-accent/50 transition-colors ${
                    item.isNew ? "radar-flash" : ""
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 bg-muted rounded-sm flex items-center justify-center shrink-0">
                        <Home className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.desc}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.type} · {item.surface}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{item.ville}</TableCell>
                  <TableCell className="text-sm font-display font-bold text-foreground">
                    {item.prix}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm font-medium ${
                        item.temps.includes("min") && parseInt(item.temps) <= 10
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.temps}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.source === "LBC" ? "default" : "info"}
                      className="text-[10px] font-display"
                    >
                      {item.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="attack" size="sm" className="text-xs">
                      <Crosshair className="h-3 w-3" />
                      Attaquer
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

export default Dashboard;
