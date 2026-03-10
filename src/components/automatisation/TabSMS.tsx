import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { MessageSquare, CreditCard, Search, Pencil } from "lucide-react";

const smsTemplate = `Bonjour {prenom},

J'ai vu votre {type_bien} à {ville} publié à {prix}. J'ai actuellement des acquéreurs qualifiés pour ce type de bien.

Seriez-vous disponible pour un échange rapide ?

Marc Dupont - PIGE IMMO`;

const smsHistory = [
  { id: 1, dest: "Jean-Marc L.", tel: "06 12 ** ** 78", date: "10/03 09:14", statut: "Délivré", bien: "Maison 120m² Lyon" },
  { id: 2, dest: "Sophie M.", tel: "07 45 ** ** 12", date: "10/03 08:42", statut: "Délivré", bien: "Appt T3 Paris 11" },
  { id: 3, dest: "Pierre D.", tel: "06 89 ** ** 34", date: "09/03 17:30", statut: "Erreur", bien: "Appt T2 Marseille" },
  { id: 4, dest: "Marie C.", tel: "06 33 ** ** 56", date: "09/03 14:15", statut: "Délivré", bien: "Maison 95m² Nantes" },
  { id: 5, dest: "Luc B.", tel: "07 22 ** ** 90", date: "09/03 11:05", statut: "Délivré", bien: "Appt T4 Bordeaux" },
];

const TabSMS = () => {
  const [smsText, setSmsText] = useState(smsTemplate);
  const [weeklyQuota, setWeeklyQuota] = useState([50]);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const [tplPremierContact, setTplPremierContact] = useState("Bonjour {prenom},\n\nJ'ai vu votre {type_bien} à {ville} publié à {prix}. J'ai des acquéreurs qualifiés pour ce type de bien.\n\nDisponible pour un échange ?\n\nMarc Dupont - PIGE IMMO");
  const [tplRappel, setTplRappel] = useState("Bonjour {prenom},\n\nJe vous ai appelé concernant votre {type_bien} à {ville} sans réponse.\n\nRappelez-moi au 06 XX XX XX XX ou répondez ici.\n\nCordialement,\nMarc Dupont");
  const [tplAvantAppel, setTplAvantAppel] = useState("Bonjour {prenom},\n\nJe suis Marc Dupont, conseiller immobilier. Je vais vous appeler dans quelques instants au sujet de votre {type_bien} à {ville}.\n\nÀ tout de suite !");

  const charCount = smsText.length;
  const smsCount = Math.ceil(charCount / 160);
  const costPerSms = 0.065;
  const weeklyCost = (weeklyQuota[0] * costPerSms).toFixed(2);
  const monthlyCost = (weeklyQuota[0] * 4 * costPerSms).toFixed(2);
  const weeklyUsed = 32;
  const weeklyProgress = (weeklyUsed / weeklyQuota[0]) * 100;

  const previewText = smsText
    .replace("{prenom}", "Jean-Marc")
    .replace("{type_bien}", "maison 120m²")
    .replace("{ville}", "Lyon")
    .replace("{prix}", "450 000€");

  return (
    <div className="space-y-4">
      {/* Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left - Editor */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-3">
              Éditeur de Template
            </h3>
            <Textarea
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              className="min-h-[200px] text-sm bg-background font-mono"
            />
            <div className="flex gap-2 mt-3 flex-wrap">
              {["{prenom}", "{type_bien}", "{ville}", "{prix}", "{surface}", "{nb_pieces}"].map((v) => (
                <Badge key={v} variant="violet" className="text-[10px] cursor-pointer font-mono hover:opacity-80 transition-opacity">
                  {v}
                </Badge>
              ))}
            </div>

            {/* Character counter */}
            <div className="mt-4 p-3 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Compteur intelligent</span>
                <Badge variant={charCount <= 160 ? "success" : "info"} className="text-[10px]">
                  {charCount} car. = {smsCount} SMS = {smsCount} crédit{smsCount > 1 ? "s" : ""}
                </Badge>
              </div>
              <Progress value={Math.min((charCount / 160) * 100, 100)} className="h-1.5" />
              <p className="text-[10px] text-muted-foreground mt-1">
                {charCount <= 160 ? `${160 - charCount} caractères restants pour 1 SMS` : `${smsCount} segments SMS nécessaires`}
              </p>
            </div>

            {/* Quota slider */}
            <div className="mt-4 p-3 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-foreground">Quota hebdomadaire</span>
                <Badge variant="default" className="text-[10px] font-display">{weeklyQuota[0]} SMS/sem</Badge>
              </div>
              <Slider
                value={weeklyQuota}
                onValueChange={setWeeklyQuota}
                max={200}
                min={10}
                step={10}
                className="mb-2"
              />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>10</span>
                <span>Coût estimé : <span className="text-primary font-medium">{weeklyCost}€/sem</span></span>
                <span>200</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right - Preview */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-3">
                Aperçu
              </h3>
              <div className="mx-auto w-[280px] bg-background rounded-[2rem] border-2 border-border p-4 shadow-lg">
                <div className="h-5 w-20 bg-muted rounded-full mx-auto mb-4" />
                <div className="bg-success/20 rounded-xl p-3 text-xs text-foreground leading-relaxed whitespace-pre-line max-h-[220px] overflow-y-auto">
                  {previewText}
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground px-1">
                  <span>{charCount} caractères</span>
                  <span>{smsCount} SMS</span>
                </div>
                <div className="mt-2 h-1 w-28 bg-muted rounded-full mx-auto" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4 text-primary" />
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                  Récap mensuel
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs p-2 bg-background rounded-lg">
                  <span className="text-muted-foreground">Limite hebdomadaire</span>
                  <span className="text-foreground font-medium">{weeklyQuota[0]} SMS</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 bg-background rounded-lg">
                  <span className="text-muted-foreground">Limite mensuelle estimée</span>
                  <span className="text-foreground font-medium">{weeklyQuota[0] * 4} SMS</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 bg-background rounded-lg">
                  <span className="text-muted-foreground">Coût mensuel estimé</span>
                  <span className="text-primary font-bold">{monthlyCost}€</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Consommation semaine</span>
                  <span className="text-foreground font-medium">{weeklyUsed}/{weeklyQuota[0]}</span>
                </div>
                <Progress value={weeklyProgress} className="h-2" />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {weeklyQuota[0] - weeklyUsed} SMS restants cette semaine
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modèles de messages SMS */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Search className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground">Modèles de messages SMS</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Messages prédéfinis avec variables: {"{prenom}"}, {"{type_bien}"}, {"{ville}"}
          </p>

          <div className="space-y-4">
            {[
              { key: "premier", title: "Premier contact", desc: "SMS envoyé lors du premier contact avec le vendeur", value: tplPremierContact, setter: setTplPremierContact },
              { key: "rappel", title: "Rappel (après appel)", desc: "SMS envoyé après une tentative d'appel sans réponse", value: tplRappel, setter: setTplRappel },
              { key: "avant", title: "Avant d'appeler", desc: "SMS envoyé pour prévenir avant de téléphoner", value: tplAvantAppel, setter: setTplAvantAppel },
            ].map((tpl) => (
              <div key={tpl.key} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-bold text-foreground">{tpl.title}</p>
                    <p className="text-xs text-muted-foreground">{tpl.desc}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => setEditingTemplate(editingTemplate === tpl.key ? null : tpl.key)}
                  >
                    <Pencil className="h-3 w-3" />
                    Modifier
                  </Button>
                </div>
                {editingTemplate === tpl.key ? (
                  <Textarea
                    value={tpl.value}
                    onChange={(e) => tpl.setter(e.target.value)}
                    className="mt-3 min-h-[100px] text-sm bg-background"
                  />
                ) : (
                  <div className="mt-3 bg-background rounded-lg p-3 text-sm text-foreground whitespace-pre-line">
                    {tpl.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SMS History Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-info" />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
              Historique des envois
            </h3>
            <Badge variant="secondary" className="text-[10px] ml-auto">{smsHistory.length} derniers</Badge>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-background">
                  <TableHead className="text-[11px] font-display uppercase">Destinataire</TableHead>
                  <TableHead className="text-[11px] font-display uppercase">Téléphone</TableHead>
                  <TableHead className="text-[11px] font-display uppercase">Bien</TableHead>
                  <TableHead className="text-[11px] font-display uppercase">Date</TableHead>
                  <TableHead className="text-[11px] font-display uppercase">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {smsHistory.map((sms) => (
                  <TableRow key={sms.id}>
                    <TableCell className="text-xs font-medium">{sms.dest}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{sms.tel}</TableCell>
                    <TableCell className="text-xs">{sms.bien}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{sms.date}</TableCell>
                    <TableCell>
                      <Badge variant={sms.statut === "Délivré" ? "success" : "destructive"} className="text-[10px]">
                        {sms.statut}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TabSMS;
