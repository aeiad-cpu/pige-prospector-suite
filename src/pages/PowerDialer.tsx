import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Phone, PhoneOff, Voicemail, CalendarCheck, ChevronRight, Clock, Home, User,
  MessageSquare, Mic, Images, ChevronLeft, ChevronRightIcon, UserPlus, Smartphone,
  RefreshCw, CheckCircle2, Info, Search, Contact, Lock, Sparkles, Brain,
} from "lucide-react";
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

// ---------- OBJECTIONS (beaucoup plus complètes) ----------

interface ObjectionCategory {
  label: string;
  id: string;
  emoji: string;
}

const objectionCategories: { group: string; items: ObjectionCategory[] }[] = [
  {
    group: "Agence & Mandat",
    items: [
      { label: "Déjà en agence", id: "agency", emoji: "🏢" },
      { label: "Mandat exclusif ailleurs", id: "exclusive", emoji: "📝" },
      { label: "Mauvaise expérience agence", id: "bad_xp", emoji: "😤" },
      { label: "Je veux vendre seul", id: "solo", emoji: "🙋" },
      { label: "Trop d'agences m'appellent", id: "too_many", emoji: "📞" },
    ],
  },
  {
    group: "Honoraires & Argent",
    items: [
      { label: "Pas de frais d'agence", id: "fees", emoji: "💰" },
      { label: "Commission trop élevée", id: "commission_high", emoji: "📊" },
      { label: "Je ne veux rien payer", id: "no_pay", emoji: "🚫" },
      { label: "Combien ça me coûte ?", id: "cost", emoji: "❓" },
    ],
  },
  {
    group: "Prix & Estimation",
    items: [
      { label: "Prix non négociable", id: "price", emoji: "🔒" },
      { label: "Déjà fait estimer", id: "already_estimated", emoji: "📋" },
      { label: "Mon prix est le bon", id: "right_price", emoji: "✅" },
      { label: "Le marché est en baisse", id: "market_down", emoji: "📉" },
      { label: "Je veux plus que le marché", id: "above_market", emoji: "📈" },
    ],
  },
  {
    group: "Timing & Disponibilité",
    items: [
      { label: "Pas pressé de vendre", id: "time", emoji: "⏳" },
      { label: "Ce n'est pas le bon moment", id: "bad_timing", emoji: "🕐" },
      { label: "J'attends le printemps", id: "wait_spring", emoji: "🌸" },
      { label: "Je réfléchis encore", id: "thinking", emoji: "🤔" },
      { label: "Rappeler plus tard", id: "call_later", emoji: "📅" },
    ],
  },
  {
    group: "Confiance & Légitimité",
    items: [
      { label: "Je ne vous connais pas", id: "unknown", emoji: "👤" },
      { label: "Comment avez-vous mon numéro ?", id: "how_number", emoji: "📱" },
      { label: "C'est une arnaque ?", id: "scam", emoji: "⚠️" },
      { label: "Vous n'êtes pas du coin", id: "not_local", emoji: "🗺️" },
      { label: "Quelle est votre expérience ?", id: "experience", emoji: "🏆" },
    ],
  },
  {
    group: "Situation Personnelle",
    items: [
      { label: "Pas encore trouvé où aller", id: "no_next", emoji: "🏠" },
      { label: "Divorce en cours", id: "divorce", emoji: "💔" },
      { label: "Succession / Indivision", id: "inheritance", emoji: "📜" },
      { label: "Crédit pas encore remboursé", id: "credit", emoji: "🏦" },
      { label: "Locataire en place", id: "tenant", emoji: "🔑" },
    ],
  },
  {
    group: "Refus Net",
    items: [
      { label: "Non merci, pas intéressé", id: "not_interested", emoji: "🙅" },
      { label: "Ne rappelez plus", id: "dont_call", emoji: "🔇" },
      { label: "Bien déjà vendu", id: "already_sold", emoji: "✅" },
      { label: "Annonce retirée", id: "removed", emoji: "🗑️" },
    ],
  },
];

const scripts: Record<string, string> = {
  default: `Bonjour M. Leblanc, je suis Marc Dupont, conseiller immobilier spécialisé sur Lyon 3ème.

J'ai vu votre annonce pour votre maison de 120m² à 450 000€. J'ai actuellement des acquéreurs qualifiés qui recherchent exactement ce type de bien dans votre secteur.

Seriez-vous ouvert à ce que je vous présente nos services ? Mon objectif serait de vous obtenir le meilleur prix dans les meilleurs délais.`,

  // Agence & Mandat
  agency: `Je comprends tout à fait. Ce que je vous propose est complémentaire : grâce à notre réseau d'acquéreurs qualifiés et notre stratégie de mise en marché digitale, nous obtenons en moyenne 15% de visites qualifiées en plus.

Accepteriez-vous un rendez-vous de 20 minutes pour que je vous montre concrètement ce que nous pourrions apporter de plus ?`,

  exclusive: `Je respecte totalement votre engagement. Cependant, sachez que si votre mandat exclusif arrive à son terme sans résultat, je serais ravi de vous présenter notre approche différente.

Puis-je vous rappeler à l'échéance de votre mandat ? En attendant, je prépare gratuitement une analyse de marché comparative pour vous.`,

  bad_xp: `Je suis vraiment désolé d'entendre ça, et malheureusement ce n'est pas rare. C'est justement pour ça que chez IAD, nous fonctionnons différemment : pas de vitrine, pas de frais fixes, ce qui nous permet de nous concentrer à 100% sur votre dossier.

Je vous propose un RDV sans engagement de 20 minutes pour vous montrer concrètement notre méthode. Si ça ne vous convainc pas, aucun problème.`,

  solo: `C'est tout à fait votre droit et je le respecte. Cependant, sachez que les biens vendus par des particuliers restent en moyenne 3 à 6 mois de plus sur le marché et se négocient 5 à 8% en dessous du prix initial.

Je peux vous accompagner gratuitement dans l'estimation de votre bien et vous fournir des conseils pour optimiser votre annonce. Sans engagement.`,

  too_many: `Je comprends votre agacement et je m'en excuse. Contrairement aux autres, je ne vous appelle pas pour récupérer un mandat rapidement. Mon approche est basée sur la qualité : je travaille un nombre limité de biens pour garantir un service premium.

Si je peux vous proposer quelque chose de différent en 2 minutes, ça vaut le coup d'écouter ?`,

  // Honoraires
  fees: `C'est un point essentiel et je vous remercie de l'aborder. Nos honoraires sont à la charge de l'acquéreur, donc aucun impact sur votre prix net vendeur.

Concrètement, vous recevez exactement le montant que vous demandez. Puis-je vous expliquer notre processus en détail lors d'un court rendez-vous ?`,

  commission_high: `Je comprends votre préoccupation. Nos honoraires sont parmi les plus compétitifs du marché, car notre modèle sans agence physique réduit nos charges fixes.

De plus, nos honoraires sont entièrement à la charge de l'acquéreur. Votre prix net vendeur est garanti. Voulez-vous que je vous détaille notre grille ?`,

  no_pay: `C'est justement notre promesse : vous ne payez rien. Nos honoraires sont intégralement supportés par l'acquéreur. Votre prix de vente est le montant que vous recevez.

C'est l'un de nos avantages majeurs. Puis-je vous l'expliquer en détail ?`,

  cost: `Excellente question ! Notre modèle est transparent : nos honoraires sont à la charge de l'acquéreur. En tant que vendeur, vous ne versez aucun euro.

Votre prix affiché est votre prix net vendeur. Aucune commission déduite. Je peux vous remettre notre grille de tarifs en toute transparence lors d'un RDV.`,

  // Prix & Estimation
  price: `Je respecte votre positionnement. D'ailleurs, notre analyse du marché sur Lyon 3ème montre que les biens comme le vôtre se sont vendus entre 3 800€ et 4 200€/m² ces 3 derniers mois.

Votre prix est cohérent. Ce que je peux vous apporter, c'est la garantie d'atteindre ce prix grâce à notre stratégie de mise en concurrence des acquéreurs.`,

  already_estimated: `Très bien, vous avez déjà cette base. Savez-vous que les estimations peuvent varier de 10 à 20% selon la méthode utilisée ?

Je vous propose une contre-estimation gratuite basée sur les ventes réelles dans votre rue et votre quartier ces 6 derniers mois. C'est un complément utile et sans engagement.`,

  right_price: `Je n'en doute pas ! Vous connaissez votre bien mieux que quiconque. Mon rôle n'est pas de remettre en question votre prix, mais de vous aider à trouver l'acquéreur qui acceptera de le payer.

Notre stratégie de mise en concurrence permet justement d'obtenir le prix juste. Un RDV rapide pour vous expliquer ?`,

  market_down: `C'est vrai que le marché a connu des ajustements, mais sur Lyon 3ème, le segment des maisons avec jardin reste très demandé. Les prix ont baissé de 3% en moyenne, mais les biens de qualité comme le vôtre trouvent toujours preneur.

Justement, c'est le moment d'agir avec un professionnel pour sécuriser votre vente au meilleur prix.`,

  above_market: `Je comprends votre souhait d'obtenir le maximum. Notre rôle est justement de créer les conditions pour y parvenir : photos professionnelles, home-staging virtuel, diffusion multi-portails, et surtout mise en concurrence des acquéreurs.

Un bien bien présenté et bien mis en marché se vend en moyenne 4% au-dessus d'un bien vendu de particulier à particulier.`,

  // Timing
  time: `Je comprends parfaitement. Justement, préparer la vente en amont est la meilleure stratégie pour obtenir le meilleur prix le moment venu.

Sans engagement, je peux vous fournir une analyse complète de votre bien et du marché. Vous aurez toutes les cartes en main quand vous serez prêt.`,

  bad_timing: `Je comprends. Le bon timing est essentiel dans l'immobilier. Cependant, la préparation en amont est souvent la clé d'une vente réussie.

Puis-je vous rappeler dans quelques semaines ? En attendant, je vous envoie gratuitement une veille de marché personnalisée sur votre secteur.`,

  wait_spring: `Le printemps est effectivement une période dynamique. Mais savoir que les meilleurs résultats viennent d'une préparation en amont : photos prises quand le jardin est beau, dossier technique complet, stratégie de prix...

Si nous commençons maintenant, vous serez prêt pour lancer au moment idéal. Un RDV de préparation ?`,

  thinking: `Prenez tout le temps nécessaire, c'est une décision importante. En attendant, je peux vous envoyer par email une analyse de marché gratuite avec les prix de vente récents dans votre quartier.

Ça vous aidera dans votre réflexion, sans aucun engagement de votre part.`,

  call_later: `Bien sûr, je respecte votre emploi du temps. À quel moment seriez-vous plus disponible pour un échange de 5 minutes ?

Je vous rappellerai au créneau qui vous convient. Matin ou après-midi ?`,

  // Confiance
  unknown: `Vous avez raison d'être prudent. Je suis Marc Dupont, conseiller immobilier chez IAD France, le premier réseau de mandataires en France avec plus de 17 000 conseillers.

Vous pouvez vérifier mon profil sur le site IAD et consulter les avis de mes clients. Je travaille exclusivement sur Lyon et sa proche banlieue depuis 5 ans.`,

  how_number: `Très bonne question, et c'est normal de se la poser. Votre numéro est affiché publiquement sur votre annonce Leboncoin. C'est justement ce qui nous permet de vous contacter directement.

Mon but n'est pas de vous déranger, mais de vous proposer un service qui pourrait vous aider à vendre plus rapidement et au meilleur prix.`,

  scam: `Je comprends votre méfiance, c'est sain ! Je suis Marc Dupont, inscrit au RSAC de Lyon, titulaire de la carte T (Transaction). Vous pouvez vérifier mon identité sur le site du réseau IAD France.

Je ne vous demanderai jamais d'argent, de coordonnées bancaires ou de signer quoi que ce soit par téléphone. Tout se fait en rendez-vous physique.`,

  not_local: `Je suis basé à Lyon 6ème et je travaille exclusivement sur Lyon et les arrondissements proches depuis 5 ans. Je connais votre quartier parfaitement : les écoles, les transports, les prix au m² rue par rue.

C'est cette expertise locale qui me permet d'obtenir les meilleurs résultats pour mes clients.`,

  experience: `Depuis 5 ans chez IAD, j'ai accompagné plus de 80 ventes sur Lyon. Mon taux de satisfaction client est de 96%, et 60% de mes mandats viennent de recommandations.

Je serai ravi de vous montrer des exemples de ventes similaires à votre bien lors d'un RDV rapide. Qu'en dites-vous ?`,

  // Situation personnelle
  no_next: `C'est effectivement un point important. Beaucoup de vendeurs sont dans cette situation. Ce que je peux vous proposer, c'est de commencer par estimer votre bien et lancer une recherche active pour votre futur logement en parallèle.

Notre réseau nous permet souvent d'identifier des biens avant leur mise sur le marché public. Un RDV pour en discuter ?`,

  divorce: `C'est une situation délicate et je suis sensible à ça. J'ai l'habitude d'accompagner des ventes dans ce contexte, toujours avec discrétion et professionnalisme.

Je peux gérer les échanges avec les deux parties et le notaire pour faciliter le processus. Souhaitez-vous qu'on en parle dans un cadre plus privé ?`,

  inheritance: `Les ventes en indivision ont leurs particularités. J'ai l'expérience de ce type de dossier : coordination avec le notaire, accord entre les co-indivisaires, estimation contradictoire si nécessaire.

Je peux vous accompagner dans toutes ces démarches. Un premier échange pour comprendre votre situation ?`,

  credit: `C'est une situation courante. Le remboursement anticipé du crédit est souvent possible et peut même être avantageux avec les taux actuels.

Je travaille avec des courtiers partenaires qui peuvent simuler gratuitement votre situation. On peut en discuter lors d'un RDV ?`,

  tenant: `La vente avec locataire en place est tout à fait possible, et c'est même recherché par certains investisseurs ! Le préavis légal de 6 mois en cas de vente doit être respecté.

Je maîtrise parfaitement ces procédures. Un RDV pour analyser votre situation et vos options ?`,

  // Refus net
  not_interested: `Je comprends et je respecte votre décision. Avant de vous laisser, sachez que je suis à votre disposition si vous changez d'avis.

Puis-je simplement vous envoyer ma carte par SMS ? Comme ça, vous aurez mon contact si besoin.`,

  dont_call: `Je m'en excuse sincèrement et je note votre demande. Vous ne serez plus contacté par notre équipe.

Si vous changez d'avis un jour, n'hésitez pas à nous contacter directement. Bonne journée M. Leblanc.`,

  already_sold: `Félicitations pour votre vente ! Puis-je vous demander dans quelles conditions le bien a été vendu ? Prix, délai ?

Et si vous connaissez des propriétaires dans votre quartier qui souhaitent vendre, je serais ravi de les accompagner. Bonne continuation !`,

  removed: `D'accord, merci de me le préciser. Est-ce que le bien a été vendu, ou avez-vous simplement retiré l'annonce temporairement ?

Si c'est temporaire, je reste à votre disposition pour en discuter quand vous serez prêt.`,
};

// ---------- Component ----------

const PowerDialer = () => {
  const [activeScript, setActiveScript] = useState("default");
  const [isCallActive, setIsCallActive] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [searchObjection, setSearchObjection] = useState("");
  // Client card
  const [showClientCard, setShowClientCard] = useState(false);
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState(vendeur.name.split(" ").slice(1).join(" ") || "");
  const [clientPhone, setClientPhone] = useState(vendeur.phone);
  const [clientEmail, setClientEmail] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [showSyncInfo, setShowSyncInfo] = useState(false);
  const [clientSaved, setClientSaved] = useState(false);

  // Filter objections
  const filteredCategories = objectionCategories.map((cat) => ({
    ...cat,
    items: cat.items.filter((o) =>
      o.label.toLowerCase().includes(searchObjection.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  const handleSaveClient = () => {
    setClientSaved(true);
    toast.success("✅ Fiche client créée et synchronisée avec Google Contacts !", {
      description: `${clientFirstName || vendeur.name.split(" ")[0]} ${clientLastName} — ${clientPhone}`,
    });
  };

  return (
    <AppLayout>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Power Dialer</h1>
          <p className="text-sm text-muted-foreground mt-1">Appel en cours — Session de prospection</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => setShowSyncInfo(true)}>
            <Smartphone className="h-3.5 w-3.5" /> Google Contacts
          </Button>
          <Button variant="attack" size="sm" className="text-xs gap-1.5" onClick={() => setShowClientCard(true)}>
            <UserPlus className="h-3.5 w-3.5" /> Créer fiche client
          </Button>
        </div>
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

        {/* Col 2: AI Prompter + Objections */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="violet" className="text-[10px] font-display uppercase">
                IA Prompteur
              </Badge>
              <span className="text-[10px] text-muted-foreground">Script dynamique</span>
              {activeScript !== "default" && (
                <Button variant="ghost" size="sm" className="h-5 text-[10px] px-2 ml-auto" onClick={() => setActiveScript("default")}>
                  ↩ Script initial
                </Button>
              )}
            </div>

            <div className="bg-background rounded-lg p-4 mb-4 min-h-[160px]">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {scripts[activeScript] || scripts.default}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                  Objections ({objectionCategories.reduce((a, c) => a + c.items.length, 0)})
                </h4>
              </div>
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une objection..."
                  className="pl-7 h-7 text-[10px] bg-background border-border"
                  value={searchObjection}
                  onChange={(e) => setSearchObjection(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[280px]">
                <div className="space-y-3 pr-2">
                  {filteredCategories.map((cat) => (
                    <div key={cat.group}>
                      <p className="text-[9px] font-display font-bold uppercase tracking-widest text-muted-foreground mb-1.5 px-1">
                        {cat.group}
                      </p>
                      <div className="space-y-1">
                        {cat.items.map((obj) => (
                          <Button
                            key={obj.id}
                            variant={activeScript === obj.id ? "default" : "outline"}
                            size="sm"
                            className="w-full text-[11px] justify-start font-body h-7 gap-1.5"
                            onClick={() => setActiveScript(activeScript === obj.id ? "default" : obj.id)}
                          >
                            <span className="text-xs">{obj.emoji}</span>
                            {obj.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredCategories.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">Aucune objection trouvée</p>
                  )}
                </div>
              </ScrollArea>
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

      {/* Client Card Dialog */}
      <Dialog open={showClientCard} onOpenChange={setShowClientCard}>
        <DialogContent className="sm:max-w-lg bg-card">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <UserPlus className="h-5 w-5 text-primary" />
              <DialogTitle className="font-display text-lg">Créer une fiche client</DialogTitle>
            </div>
            <DialogDescription>
              Les informations seront synchronisées avec Google Contacts
            </DialogDescription>
          </DialogHeader>

          {!clientSaved ? (
            <div className="space-y-4 pt-1">
              {/* Sync info banner */}
              <div className="flex gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => setShowSyncInfo(true)}>
                <RefreshCw className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-foreground">Synchronisation Google Contacts activée</p>
                  <p className="text-[10px] text-muted-foreground">Le nom s'affichera automatiquement lors des appels entrants</p>
                </div>
                <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Prénom</label>
                  <Input placeholder="Jean-Marc" value={clientFirstName || vendeur.name.split(" ")[0]} onChange={(e) => setClientFirstName(e.target.value)} className="bg-background" />
                </div>
                <div>
                  <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Nom</label>
                  <Input placeholder="Leblanc" value={clientLastName} onChange={(e) => setClientLastName(e.target.value)} className="bg-background" />
                </div>
              </div>

              <div>
                <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Téléphone</label>
                <Input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="bg-background" />
              </div>

              <div>
                <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Email (optionnel)</label>
                <Input type="email" placeholder="email@example.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="bg-background" />
              </div>

              <div>
                <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Notes</label>
                <Input placeholder="Ex: Propriétaire maison Lyon 3ème, 450k" value={clientNotes} onChange={(e) => setClientNotes(e.target.value)} className="bg-background" />
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Ce qui sera synchronisé :</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Contact ajouté à Google Contacts
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Nom affiché à l'écran lors des appels entrants
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Fiche liée au bien dans PIGE IMMO
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowClientCard(false)}>Annuler</Button>
                <Button variant="attack" className="gap-1.5" onClick={handleSaveClient}>
                  <Contact className="h-3.5 w-3.5" /> Créer et synchroniser
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="h-14 w-14 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg">Fiche client créée ! ✅</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{clientFirstName || vendeur.name.split(" ")[0]} {clientLastName}</span> a été ajouté à Google Contacts.
              </p>
              <p className="text-xs text-primary">📱 Son nom s'affichera désormais quand il vous appellera</p>
              <Button variant="outline" className="mt-4" onClick={() => { setShowClientCard(false); setClientSaved(false); }}>Fermer</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Google Contacts Sync Info Dialog */}
      <Dialog open={showSyncInfo} onOpenChange={setShowSyncInfo}>
        <DialogContent className="sm:max-w-lg bg-card">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="h-5 w-5 text-primary" />
              <DialogTitle className="font-display text-lg">Synchronisation Google Contacts</DialogTitle>
            </div>
            <DialogDescription>
              Comment fonctionne la synchronisation automatique
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {/* Step 1 */}
            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-display font-bold">1</div>
              <div>
                <p className="text-sm font-medium text-foreground">Vous créez une fiche client dans PIGE IMMO</p>
                <p className="text-xs text-muted-foreground mt-0.5">Renseignez le nom, prénom et numéro de téléphone du vendeur</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-display font-bold">2</div>
              <div>
                <p className="text-sm font-medium text-foreground">Le contact est ajouté à Google Contacts</p>
                <p className="text-xs text-muted-foreground mt-0.5">Via l'API Google People, le contact est synchronisé instantanément avec votre compte Google connecté</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-display font-bold">3</div>
              <div>
                <p className="text-sm font-medium text-foreground">Votre téléphone synchronise automatiquement</p>
                <p className="text-xs text-muted-foreground mt-0.5">Si Google Contacts est activé sur votre smartphone (Android ou iPhone), le contact apparaît automatiquement</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-full bg-success text-success-foreground flex items-center justify-center shrink-0 text-sm font-display font-bold">✓</div>
              <div>
                <p className="text-sm font-medium text-foreground">Le nom s'affiche lors des appels</p>
                <p className="text-xs text-muted-foreground mt-0.5">Quand le vendeur vous rappelle, son nom et prénom s'affichent à l'écran — <span className="font-medium text-foreground">sans l'avoir enregistré manuellement</span></p>
              </div>
            </div>

            {/* Info box */}
            <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Prérequis</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Compte Google connecté à PIGE IMMO (via la connexion @iadfrance.fr)</li>
                    <li>• Google Contacts activé sur votre smartphone</li>
                    <li>• Synchronisation automatique activée dans les paramètres du téléphone</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 <span className="font-medium text-foreground">Astuce :</span> Sur Android, allez dans Paramètres → Comptes → Google → Activer "Contacts". Sur iPhone, allez dans Réglages → Contacts → Comptes → Gmail → Activer "Contacts".
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSyncInfo(false)}>Compris !</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default PowerDialer;
