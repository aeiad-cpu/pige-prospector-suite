

## Plan: Refonte Pipeline des Leads (conforme aux maquettes)

### Changements principaux sur `src/pages/Pipeline.tsx`

**1. En-tête** 
- Titre "Pipeline des Leads" + sous-titre "0 annonces filtrées" (compteur dynamique)
- Boutons Kanban / Grille / Synchroniser en haut à droite (toggle group style, Kanban actif en orange)

**2. Barre de filtres (2 lignes)**

Ligne 1 (dropdowns + action badges):
- Champ recherche
- Select "Tous les leads"
- Select "Tous les agents"  
- Badge outline "Non attribué (0)"
- Select "Plus récentes"
- Badges d'action : Filtres, Tous, **Tél (0)** (vert), Sans tél (0), **Republication (0)** (orange rempli), Multi-plateforme (0), **Chauds (0)** (orange outline)

Ligne 2 (badges de chaleur/source):
- Badges outline cliquables : Tièdes (0), Froids (0), Leboncoin (0), La Centrale (0)
- Badge spécial orange outline : "Renseignez votre adresse pour filtrer par distance"
- Select "Toutes parutions"
- Badge "2 filtres actifs"

**3. Colonnes Kanban (13 colonnes, scroll horizontal)**

Chaque colonne a un dot coloré + label uppercase + compteur. Colonnes :
- À PROSPECTER (vert)
- MESSAGE AUTO ENV... + badge "NOUVEAU" (bleu)
- PAS DE RÉPONSE (rouge)
- RAPPEL PRÉVU (orange)
- NON INTÉRESSÉ (gris)
- RDV PRÉVU (vert)
- NO-SHOW (rouge)
- OFFRE ENVOYÉE (bleu)
- EN NÉGOCIATION (orange)
- MANDAT SIGNÉ (violet)
- PAS DE SUITE (gris)
- EXCLU (gris foncé)
- VENDU (vert foncé)

**4. Empty states améliorés**
- Grand compteur "0" centré
- Texte "Aucun lead"
- Sous-texte "Déposez un lead ici"

**5. Cards de leads** conservées mais adaptées au nouveau système de statuts.

### Fichier modifié
- `src/pages/Pipeline.tsx` : réécriture complète

### Composants shadcn utilisés
- Select (dropdowns), Badge, Button, Input, Card, ScrollArea (horizontal scroll)

