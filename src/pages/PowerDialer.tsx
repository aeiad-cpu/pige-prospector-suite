import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Phone, PhoneOff, Voicemail, CalendarCheck, ChevronRight, Clock, Home, User, MessageSquare, Mic, Images, ChevronLeft, ChevronRightIcon } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";

const vendeur = {
  name: "Jean-Marc Leblanc",
  phone: "06 12 34 56 78",
  property: "Maison 120m² avec jardin et garage",
  ville: "Lyon 3ème",
  prix: "450 000 €",
  source: "Leboncoin",
  publishedAt: "Il y a 8 min",
  description: `Magnifique maison de 120m² située dans le quartier prisé de Lyon 3ème. Cette propriété dispose de 4 chambres spacieuses, un salon/séjour lumineux de 35m² avec cheminée, une cuisine équipée ouverte sur le jardin.

Le jardin arboré de 250m² offre un espace de vie extérieur agréable avec terrasse en bois. Garage double et cave. DPE: C.

Points forts :
• Proximité transports (métro ligne D à 5 min)
• École primaire et collège à 200m
• Commerces et marché à pied
• Rénovation toiture 2024
• Double vitrage PVC récent`,
  photos: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  ],
  contacts: [
    { date: "Aujourd'hui 09:12", type: "SMS Auto", status: "Envoyé" },
    { date: "Hier 14:30", type: "Appel", status: "Pas de réponse" },
  ],
};

const objections = [
  { label: "Déjà en agence", id: "agency" },
  { label: "Pas de frais", id: "fees" },
  { label: "Prix non négociable", id: "price" },
  { label: "Pas pressé", id: "time" },
];

const scripts: Record<string, string> = {
  default: `Bonjour M. Leblanc, je suis Marc Dupont, conseiller immobilier spécialisé sur Lyon 3ème.

J'ai vu votre annonce pour votre maison de 120m² à 450 000€. J'ai actuellement des acquéreurs qualifiés qui recherchent exactement ce type de bien dans votre secteur.

Seriez-vous ouvert à ce que je vous présente nos services ? Mon objectif serait de vous obtenir le meilleur prix dans les meilleurs délais.`,
  agency: `Je comprends tout à fait. Ce que je vous propose est complémentaire : grâce à notre réseau d'acquéreurs qualifiés et notre stratégie de mise en marché digitale, nous obtenons en moyenne 15% de visites qualifiées en plus.

Accepteriez-vous un rendez-vous de 20 minutes pour que je vous montre concrètement ce que nous pourrions apporter de plus ?`,
  fees: `C'est un point essentiel et je vous remercie de l'aborder. Nos honoraires sont à la charge de l'acquéreur, donc aucun impact sur votre prix net vendeur.

Concrètement, vous recevez exactement le montant que vous demandez. Puis-je vous expliquer notre processus en détail lors d'un court rendez-vous ?`,
  price: `Je respecte votre positionnement. D'ailleurs, notre analyse du marché sur Lyon 3ème montre que les biens comme le vôtre se sont vendus entre 3 800€ et 4 200€/m² ces 3 derniers mois.

Votre prix est cohérent. Ce que je peux vous apporter, c'est la garantie d'atteindre ce prix grâce à notre stratégie de mise en concurrence des acquéreurs.`,
  time: `Je comprends parfaitement. Justement, préparer la vente en amont est la meilleure stratégie pour obtenir le meilleur prix le moment venu.

Sans engagement, je peux vous fournir une analyse complète de votre bien et du marché. Vous aurez toutes les cartes en main quand vous serez prêt.`,
};

const PowerDialer = () => {
  const [activeScript, setActiveScript] = useState("default");
  const [isCallActive, setIsCallActive] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  return (
    <AppLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Power Dialer</h1>
        <p className="text-sm text-muted-foreground mt-1">Appel en cours — Session de prospection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Col 1: Fiche Vendeur */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            {isCallActive && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                <Phone className="h-4 w-4 text-success animate-pulse-call" />
                <span className="text-sm font-display font-bold text-success uppercase tracking-wider">
                  Appel en cours...
                </span>
                <span className="text-xs text-muted-foreground ml-auto font-mono">02:34</span>
              </div>
            )}

            <div className="flex items-start gap-3 mb-4">
              <div className="h-12 w-12 bg-muted rounded-sm flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">{vendeur.name}</h3>
                <p className="text-sm text-primary font-medium">{vendeur.phone}</p>
              </div>
            </div>

            <div className="bg-background rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">{vendeur.property}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Ville</p>
                  <p className="font-medium text-foreground">{vendeur.ville}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Prix</p>
                  <p className="font-display font-bold text-foreground">{vendeur.prix}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Source</p>
                  <Badge variant="default" className="text-[8px] font-display">{vendeur.source}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-primary">
                <Clock className="h-3 w-3" />
                Publié {vendeur.publishedAt}
              </div>
            </div>

            <div>
              <h4 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Historique contacts
              </h4>
              <div className="space-y-2">
                {vendeur.contacts.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 bg-background rounded-md">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                      <span className="text-foreground">{c.type}</span>
                    </div>
                    <span className="text-muted-foreground">{c.date}</span>
                    <Badge variant="secondary" className="text-[8px]">{c.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Col 2: AI Prompter */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="violet" className="text-[10px] font-display uppercase">
                IA Prompteur
              </Badge>
              <span className="text-[10px] text-muted-foreground">Script dynamique</span>
            </div>

            <div className="bg-background rounded-lg p-4 mb-4 min-h-[200px]">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {scripts[activeScript]}
              </p>
            </div>

            <div>
              <h4 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Objections
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {objections.map((obj) => (
                  <Button
                    key={obj.id}
                    variant={activeScript === obj.id ? "default" : "outline"}
                    size="sm"
                    className="text-xs justify-start font-body"
                    onClick={() => setActiveScript(activeScript === obj.id ? "default" : obj.id)}
                  >
                    <ChevronRight className="h-3 w-3 shrink-0" />
                    {obj.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Col 3: Photos & Descriptif du bien */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="info" className="text-[10px] font-display uppercase">
                <Images className="h-3 w-3 mr-1" />
                Fiche du bien
              </Badge>
              <span className="text-[10px] text-muted-foreground">{vendeur.photos.length} photos</span>
            </div>

            {/* Photo Carousel */}
            <div className="relative rounded-lg overflow-hidden mb-4 group">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer">
                    <img
                      src={vendeur.photos[currentPhoto]}
                      alt={`Photo du bien ${currentPhoto + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 right-2 bg-background/80 rounded px-2 py-0.5 text-[10px] font-display text-foreground">
                      {currentPhoto + 1}/{vendeur.photos.length}
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-2 bg-card">
                  <img
                    src={vendeur.photos[currentPhoto]}
                    alt={`Photo du bien ${currentPhoto + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="flex justify-center gap-2 mt-2">
                    {vendeur.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt={`Miniature ${i + 1}`}
                        className={`h-14 w-20 object-cover rounded cursor-pointer border-2 transition-colors ${
                          i === currentPhoto ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        onClick={() => setCurrentPhoto(i)}
                      />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Nav arrows */}
              <button
                className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/70 flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); setCurrentPhoto(p => p === 0 ? vendeur.photos.length - 1 : p - 1); }}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/70 flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); setCurrentPhoto(p => p === vendeur.photos.length - 1 ? 0 : p + 1); }}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
              {vendeur.photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`Miniature ${i + 1}`}
                  className={`h-12 w-16 object-cover rounded cursor-pointer border-2 shrink-0 transition-colors ${
                    i === currentPhoto ? "border-primary" : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => setCurrentPhoto(i)}
                />
              ))}
            </div>

            {/* Description */}
            <div>
              <h4 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Descriptif de l'annonce
              </h4>
              <div className="bg-background rounded-lg p-3 text-sm text-foreground leading-relaxed whitespace-pre-line max-h-[280px] overflow-y-auto">
                {vendeur.description}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Action Bar */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button variant="success" size="lg" className="gap-2 text-sm">
              <CalendarCheck className="h-5 w-5" />
              RDV Fixé
            </Button>
            <Button
              variant="default"
              size="lg"
              className="gap-2 text-sm font-display uppercase bg-violet-600 hover:bg-violet-700 text-white"
              onClick={() => {
                toast.success("🎙️ Message vocal déposé avec succès !", { description: "Passage au prospect suivant..." });
                setTimeout(() => setIsCallActive(false), 1200);
              }}
            >
              <Mic className="h-5 w-5" />
              Drop Voicemail
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="gap-2 text-sm font-display uppercase"
              onClick={() => setIsCallActive(false)}
            >
              <PhoneOff className="h-5 w-5" />
              Raccrocher & Suivant
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default PowerDialer;
