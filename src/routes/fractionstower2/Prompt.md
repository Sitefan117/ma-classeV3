PROMPT MAÎTRE — FRACTIONS TOWER
Application pédagogique de fractions — SvelteKit / Svelte 5 / TypeScript

0. RÔLE
Tu es un développeur senior spécialisé en :
	•	SvelteKit ;
	•	Svelte 5 ;
	•	TypeScript ;
	•	applications web interactives ;
	•	jeux 2D ;
	•	pédagogie numérique ;
	•	conception universelle des apprentissages (CUA / UDL) ;
	•	accessibilité ;
	•	architecture logicielle modulaire.
Tu dois construire une application pédagogique appelée provisoirement :
FRACTIONS TOWER
Il s'agit d'un jeu pédagogique 2D d'apprentissage des fractions, destiné principalement à des élèves de 7H–8H, dans un contexte d'enseignement spécialisé.
L'objectif n'est PAS de créer une succession de quiz.
L'objectif est de créer un petit RPG 2D pédagogique explorable, dans lequel les apprentissages mathématiques sont intégrés au monde du jeu.

1. VISION DU PROJET
Le joueur contrôle un personnage dans une tour composée de plusieurs étages.
Le personnage :
	•	se déplace librement ;
	•	marche dans les pièces ;
	•	rencontre des obstacles ;
	•	ne traverse pas les murs ;
	•	interagit avec les objets ;
	•	peut utiliser des portes ;
	•	peut prendre des escaliers ;
	•	peut utiliser un ascenseur ;
	•	peut entrer dans des zones de mission ;
	•	peut rencontrer des personnages ou objets interactifs ;
	•	peut déclencher des activités pédagogiques.
L'expérience doit rappeler :
	•	Pokémon Game Boy ;
	•	Pokémon Game Boy Advance ;
	•	Zelda NES ;
	•	Zelda Game Boy ;
	•	Zelda Game Boy Advance.
Mais il ne faut PAS produire une copie visuelle de ces jeux.
L'objectif est :
Rétro dans les principes de jeu, moderne dans l'expérience.
Donc :
	•	vue 2D ;
	•	déplacements sur une carte ;
	•	sprites ;
	•	collisions ;
	•	interactions ;
	•	exploration ;
	•	pièces ;
	•	escaliers ;
	•	ascenseur ;
mais également :
	•	animations fluides ;
	•	interface moderne ;
	•	tactile ;
	•	responsive ;
	•	feedbacks modernes ;
	•	accessibilité ;
	•	audio ;
	•	transitions ;
	•	interactions pédagogiques riches.

2. PRIORITÉS DU PROJET
Respecter cet ordre :
	1	fonctionnement ;
	2	stabilité ;
	3	architecture propre ;
	4	pertinence pédagogique ;
	5	accessibilité / CUA ;
	6	qualité des interactions ;
	7	gamification ;
	8	esthétique / polish.
Ne jamais sacrifier une fonction pédagogique ou technique importante pour un effet visuel.

3. TECHNOLOGIES
Utiliser :
	•	SvelteKit ;
	•	Svelte 5 ;
	•	TypeScript ;
	•	CSS moderne.
L'application doit fonctionner côté navigateur.
Pas de backend pour la V1.
Pas de comptes élèves.
Pas de connexion obligatoire.
Pas de base de données distante.
Pas de dépendance à un service externe pour faire fonctionner le jeu.

4. EXPLORATION 2D
Le monde du jeu doit être un véritable environnement 2D explorable.
Le joueur dispose d'un personnage.
Le personnage peut :
	•	se déplacer haut ;
	•	bas ;
	•	gauche ;
	•	droite ;
	•	idéalement avec clavier ;
	•	idéalement avec commandes tactiles sur tablette.
Prévoir une architecture permettant ultérieurement :
	•	sprites animés ;
	•	animation de marche ;
	•	orientation du personnage ;
	•	animation d'interaction.
Le déplacement doit être fluide mais rester dans l'esprit des RPG 2D rétro.

5. COLLISIONS
Le joueur ne doit pas pouvoir traverser :
	•	murs ;
	•	meubles bloquants ;
	•	éléments de décor bloquants ;
	•	limites de pièces ;
	•	objets définis comme obstacles.
Le système de collision doit être indépendant du graphisme.
NE PAS analyser directement les pixels d'une image pour décider si le joueur peut passer.
Les collisions doivent être définies explicitement.
Exemple conceptuel :
{
    type: "collision",
    x: 320,
    y: 180,
    width: 64,
    height: 32
}
ou via une structure équivalente adaptée au moteur choisi.

6. TROIS COUCHES DISTINCTES
L'architecture du monde doit distinguer au minimum trois couches.
LAYER 1 — GRAPHISME
Ce que le joueur voit.
Exemples :
	•	sol ;
	•	murs ;
	•	meubles ;
	•	plantes ;
	•	décorations ;
	•	escaliers ;
	•	ascenseur ;
	•	portes ;
	•	personnages ;
	•	objets.
Ces éléments sont visuels.

LAYER 2 — COLLISION
Couche invisible contenant les zones bloquantes.
Exemples :
	•	mur ;
	•	meuble ;
	•	obstacle ;
	•	limite.
Cette couche n'a pas besoin d'être visible en mode normal.

LAYER 3 — INTERACTION
Couche invisible contenant les zones interactives.
Exemples :
	•	escalier ;
	•	ascenseur ;
	•	porte ;
	•	PNJ ;
	•	objet ;
	•	panneau ;
	•	zone de mission ;
	•	déclencheur ;
	•	objet pédagogique.
Exemple :
{
    type: "interaction",
    interaction: "elevator",
    x: 500,
    y: 200,
    width: 48,
    height: 48,
    destination: "floor-select"
}

7. MODE DEBUG
Créer un mode debug activable par le développeur.
Il doit pouvoir afficher :
	•	zones de collision ;
	•	zones d'interaction ;
	•	position du joueur ;
	•	coordonnées ;
	•	identifiants des objets ;
	•	éventuellement hitbox du joueur.
Exemple :
[DEBUG]

PLAYER
x: 320
y: 184

COLLISIONS
████████

INTERACTIONS
[ELEVATOR]
[STAIRS]
[MISSION]
Ce mode est extrêmement important pour faciliter la construction des niveaux.

8. ASSETS GRAPHIQUES
L'application doit permettre d'utiliser facilement des assets externes fournis par le développeur.
Prévoir par exemple :
static/
└── assets/
    ├── characters/
    ├── environment/
    ├── objects/
    ├── npcs/
    ├── ui/
    └── audio/
Le développeur pourra déposer :
	•	personnages ;
	•	sprites ;
	•	murs ;
	•	sols ;
	•	escaliers ;
	•	ascenseurs ;
	•	meubles ;
	•	objets ;
	•	décorations ;
	•	PNJ ;
	•	éléments d'interface.
Le code doit pouvoir appeler ces assets par chemin ou via une configuration.

9. INDÉPENDANCE ENTRE GRAPHISME ET LOGIQUE
Ceci est une règle fondamentale.
Un asset graphique doit pouvoir être remplacé sans devoir réécrire le moteur.
Exemple :
stairs.png
représente visuellement un escalier.
Mais la logique peut être :
{
    id: "stairs-floor-2",
    type: "stairs",
    destination: 2,
    interactionZone: {...}
}
Si demain stairs.png est remplacé par une autre image :
	•	la collision ;
	•	l'interaction ;
	•	la destination ;
doivent continuer à fonctionner.

10. COMMENTAIRES DANS LE CODE
Le code doit être compréhensible par un enseignant qui n'est pas développeur professionnel.
Ajouter des commentaires utiles.
NE PAS commenter chaque ligne.
Les commentaires doivent expliquer :
	•	le rôle du fichier ;
	•	la logique importante ;
	•	les systèmes non évidents ;
	•	les interactions ;
	•	les collisions ;
	•	les données pédagogiques ;
	•	les sauvegardes ;
	•	les règles de progression.
Exemple :
// -----------------------------------------------------------------------------
// COLLISION DU JOUEUR
// Vérifie si la prochaine position du personnage entrerait dans une zone
// bloquante avant d'autoriser le déplacement.
// -----------------------------------------------------------------------------
Autre exemple :
// -----------------------------------------------------------------------------
// INTERACTION ASCENSEUR
// Cette zone invisible permet au joueur d'activer l'ascenseur lorsqu'il
// se trouve suffisamment près de celui-ci.
// -----------------------------------------------------------------------------
Chaque fichier important doit commencer par un commentaire indiquant brièvement son rôle.

11. STRUCTURE DE LA TOUR
La tour possède 8 étages.
NE PAS séparer visuellement les étages en :
	•	7H ;
	•	8H.
L'ensemble doit être présenté comme une progression continue.
Le nombre de compétences par étage doit être déterminé par la pertinence pédagogique.
Ne pas créer artificiellement huit niveaux de même taille.

12. PERSONNAGE ET PROGRESSION
Le personnage doit être visible dans la tour.
La progression doit être matérialisée physiquement.
Le joueur doit sentir :
« Je monte dans la tour. »
Les escaliers et l'ascenseur servent réellement à changer d'étage.

13. ASCENSEUR
L'ascenseur est utilisable par le joueur.
Il peut permettre :
	•	accéder à un étage déjà débloqué ;
	•	accéder à un étage ciblé par l'enseignant ;
	•	revenir à une compétence ;
	•	effectuer une remédiation.
L'enseignant doit pouvoir fournir un mot de passe permettant un accès ciblé à un étage.

14. ESCALIERS
Les escaliers sont de véritables éléments du monde.
Le personnage peut :
	•	s'en approcher ;
	•	interagir ;
	•	monter/descendre ;
	•	changer de pièce ou d'étage.
L'interaction doit être visuelle et compréhensible.

15. PIÈCES
Chaque étage peut comporter plusieurs pièces ou zones.
Exemples :
	•	salle de découverte ;
	•	salle d'entraînement ;
	•	salle de défi ;
	•	salle du boss.
Mais ne pas imposer artificiellement cette structure à tous les étages.
Le niveau doit servir la pédagogie.

16. OBJECTIFS PÉDAGOGIQUES
7H — NIVEAU BLEU
L'élève doit pouvoir :
	•	représenter et lire des fractions simples sur une droite graduée ;
	•	à partir d'une unité donnée, construire/mesurer des surfaces dont l'aire est exprimée avec des fractions décimales ;
	•	représenter et lire des fractions décimales sur une droite graduée.
7H — NIVEAU NOIR
L'élève doit pouvoir :
	•	convertir une fraction décimale en nombre décimal ;
	•	convertir un nombre décimal en fraction décimale.
8H — NIVEAU BLANC
L'élève doit pouvoir passer :
	•	d'un nombre écrit ou exprimé en mots ;
	•	à sa décomposition en millièmes ;
	•	jusqu'aux milliards ;
	•	et inversement ;
	•	y compris avec les fractions décimales.
8H — NIVEAU VERT
L'élève doit pouvoir :
	•	comparer ;
	•	ordonner ;
	•	encadrer ;
	•	intercaler des nombres ;
	•	y compris des fractions.

17. PRÉREQUIS
Tenir compte notamment de :
	•	notion d'unité ;
	•	partage équitable ;
	•	parts égales ;
	•	comptage ;
	•	comparaison ;
	•	égalité ;
	•	supérieur / inférieur ;
	•	droite graduée ;
	•	lecture des nombres ;
	•	système décimal ;
	•	valeur de position ;
	•	dixièmes ;
	•	centièmes ;
	•	millièmes ;
	•	écriture décimale.

18. CUA / UDL
La CUA est une exigence centrale.
Elle doit être intégrée au gameplay.
Pour une même notion, proposer autant que pertinent :
Représentations
	•	texte ;
	•	audio ;
	•	animation ;
	•	manipulation ;
	•	image ;
	•	forme ;
	•	barre ;
	•	cercle ;
	•	rectangle ;
	•	grille ;
	•	droite graduée ;
	•	jauge ;
	•	représentation symbolique.
Actions
	•	cliquer ;
	•	déplacer ;
	•	glisser ;
	•	positionner ;
	•	construire ;
	•	sélectionner ;
	•	ordonner ;
	•	compléter.
Engagement
	•	exploration ;
	•	mission ;
	•	défi ;
	•	boss ;
	•	contexte ;
	•	progression.

19. CONCRET → ABSTRAIT
Privilégier :
CONCRET→ REPRÉSENTATION→ LANGAGE→ SYMBOLE→ ABSTRACTION
Ne pas commencer systématiquement par :
« Calcule 3/4 + ... »
si la notion peut être introduite par une manipulation.

20. COURS INTERACTIF
Le cours doit être intégré au monde.
Le joueur peut rencontrer une zone d'apprentissage.
Le cours doit être interactif.
Éviter les longues pages de texte.
Privilégier :
ANIMATION→ MANIPULATION→ COURTE EXPLICATION→ MANIPULATION→ MICRO-VÉRIFICATION.

21. STRUCTURE D'UN ÉTAGE
Chaque étage suit globalement :
	1	découverte ;
	2	cours ;
	3	micro-validations ;
	4	entraînement ;
	5	défis ;
	6	boss ;
	7	bilan.
La durée indicative est de :
15 à 20 minutes.
Mais le système doit accepter une durée variable.

22. ACCÈS DIRECT AU BOSS
L'élève peut décider :
« Je connais déjà cette notion. »
Il peut accéder directement au boss.
Si le boss est réussi :
→ compétence/étage validé.
Si le boss échoue :
→ analyse des erreurs ;
→ retour ciblé au cours ou à la remédiation.

23. BOSSES
Les boss comportent plusieurs phases.
Exemple :
	1	lire ;
	2	représenter ;
	3	placer ;
	4	comparer ;
	5	résoudre une situation concrète.
Un boss ne doit pas être un simple questionnaire répétitif.

24. BOSS DE SYNTHÈSE
Après l'étage 5 :
boss de synthèse des étages 1–5.
Après l'étage 8 :
boss final des 8 étages.
Les anciennes compétences doivent continuer à apparaître.

25. GÉNÉRATION DYNAMIQUE
Les exercices doivent être générés.
Ne pas créer uniquement des questions statiques.
Faire varier :
	•	nombres ;
	•	fractions ;
	•	dénominateurs ;
	•	numérateurs ;
	•	représentations ;
	•	positions ;
	•	contextes ;
	•	ordre des réponses ;
	•	difficulté.
Un même objectif doit pouvoir être évalué sous plusieurs formes.

26. MAÎTRISE
Chaque compétence possède son état :
🟢 maîtrisée
🟠 consolidation
🔴 à reprendre
Un seul succès ne suffit pas à déclarer une maîtrise.
Utiliser plusieurs :
	•	exercices ;
	•	représentations ;
	•	contextes ;
	•	niveaux de difficulté.

27. RÉACTIVATION
Une compétence ancienne peut réapparaître.
Une compétence auparavant maîtrisée peut redevenir fragile.
Exemple :
🟢 → 🟠 → 🔴
si les performances ultérieures montrent une difficulté.

28. AIDES
Chaque exercice peut proposer :
AIDE
Prévoir plusieurs niveaux :
Aide 1
Indice léger.
Aide 2
Rappel visuel.
Aide 3
Guidage.
Aide 4
Explication explicite.
L'aide ne doit pas révéler immédiatement la réponse.
Le nombre et le type d'aides utilisées sont enregistrés.

29. ANALYSE DES ERREURS
Le moteur doit tenter d'identifier :
	•	confusion numérateur/dénominateur ;
	•	mauvaise compréhension de l'unité ;
	•	mauvais nombre de parts ;
	•	mauvaise sélection des parts ;
	•	mauvaise lecture ;
	•	erreur sur droite graduée ;
	•	mauvaise comparaison ;
	•	erreur de valeur de position ;
	•	confusion dixièmes/centièmes/millièmes ;
	•	erreur fraction décimale / nombre décimal ;
	•	erreur de stratégie ;
	•	problème de compréhension de consigne ;
	•	erreur de manipulation ;
	•	autre.
Le système doit associer les erreurs aux compétences.

30. FEEDBACK
Éviter :
❌ Faux.
Préférer un feedback lié à l'erreur.
Exemple :
Le dénominateur indique en combien de parts égales l'unité est partagée.
Le feedback peut utiliser :
	•	texte ;
	•	animation ;
	•	mise en évidence ;
	•	représentation graphique ;
	•	audio.

31. ARRÊT PÉDAGOGIQUE
Si trop d'erreurs apparaissent :
🛑 HALTE !

Cette mission semble encore difficile.

Appelle ton enseignant pour continuer.
Le système peut déclencher l'arrêt en cas de :
	•	erreurs consécutives ;
	•	même erreur répétée ;
	•	trop d'aides ;
	•	compétence fragile ;
	•	échec répété d'une micro-compétence ;
	•	échec de boss.
Les seuils doivent être configurables.

32. ESPACE ENSEIGNANT
Créer :
/teacher
Protégé par un seul mot de passe enseignant.
Le tableau de bord doit permettre de voir rapidement :
	•	élèves ;
	•	étage ;
	•	progression ;
	•	compétences ;
	•	erreurs ;
	•	alertes ;
	•	aides ;
	•	temps ;
	•	boss ;
	•	historique.

33. INTERVENTION ENSEIGNANT
Lorsqu'un élève est bloqué :
l'enseignant peut choisir :
CONTINUER
REMÉDIATION
RETOUR AU COURS
Le système doit enregistrer cette intervention.

34. FICHIER DE SAUVEGARDE ÉLÈVE
Créer un format :
.fracsave
Il contient :
	•	version ;
	•	identifiant anonyme ;
	•	progression ;
	•	étage ;
	•	compétences ;
	•	maîtrise ;
	•	tentatives ;
	•	erreurs ;
	•	aides ;
	•	temps ;
	•	boss ;
	•	historique nécessaire à la reprise.
Ne pas stocker de données personnelles inutiles.

35. IMPORT / EXPORT
Élève :
Exporter ma progression
Importer ma progression
L'import doit :
	•	vérifier le format ;
	•	vérifier la version ;
	•	détecter les fichiers corrompus ;
	•	demander confirmation avant écrasement ;
	•	restaurer correctement la progression.

36. EXPORT ENSEIGNANT EXCEL
L'enseignant peut exporter :
.xlsx
avec au minimum :
Synthèse
Compétences
Erreurs
Tentatives
Boss
Historique
L'export doit être réellement exploitable dans Excel.

37. ARCHITECTURE DES FICHIERS
Utiliser une architecture modulaire.
src/
├── lib/
│   ├── components/
│   │   ├── game/
│   │   ├── fraction/
│   │   ├── exercises/
│   │   ├── course/
│   │   ├── teacher/
│   │   └── ui/
│   │
│   ├── data/
│   │   ├── floors.ts
│   │   ├── competencies.ts
│   │   ├── contexts.ts
│   │   └── errorTypes.ts
│   │
│   ├── engines/
│   │   ├── FractionEngine.ts
│   │   ├── ExerciseGenerator.ts
│   │   ├── MasteryEngine.ts
│   │   ├── ErrorAnalyzer.ts
│   │   └── ProgressionEngine.ts
│   │
│   ├── game/
│   │   ├── GameState.ts
│   │   ├── FloorManager.ts
│   │   ├── BossManager.ts
│   │   ├── CollisionEngine.ts
│   │   └── InteractionEngine.ts
│   │
│   ├── persistence/
│   │   ├── SaveManager.ts
│   │   ├── SaveFormat.ts
│   │   ├── ImportExport.ts
│   │   └── ExcelExport.ts
│   │
│   ├── audio/
│   │   └── AudioManager.ts
│   │
│   └── types/
│       ├── fraction.ts
│       ├── exercise.ts
│       ├── progression.ts
│       ├── student.ts
│       ├── world.ts
│       └── interaction.ts
│
├── routes/
│   ├── +page.svelte
│   ├── play/
│   │   └── +page.svelte
│   └── teacher/
│       └── +page.svelte
│
└── app.css
Cette architecture est une référence.
Ne pas créer artificiellement des dizaines de fichiers.
Mais ne pas créer non plus un gigantesque composant monolithique.

38. MONDE ET DONNÉES
Les cartes doivent être définies par des données.
Ne pas coder chaque étage directement dans un énorme composant.
Une carte doit pouvoir définir :
	•	taille ;
	•	décor ;
	•	collisions ;
	•	interactions ;
	•	objets ;
	•	portes ;
	•	escaliers ;
	•	ascenseur ;
	•	missions ;
	•	PNJ ;
	•	position du joueur.
Conceptuellement :
{
    id: "floor-01-room-01",

    visualLayer: [...],

    collisions: [...],

    interactions: [...],

    objects: [...],

    spawnPoints: [...]
}

39. COMPOSANTS FRACTIONS
Créer des composants réutilisables :
	•	FractionDisplay ;
	•	FractionBar ;
	•	FractionCircle ;
	•	NumberLine ;
	•	DecimalGrid ;
	•	DraggableFraction.
Ils doivent être utilisés dans plusieurs activités.

40. DROITE GRADUÉE
La droite graduée doit être interactive.
Elle doit pouvoir permettre :
	•	lire ;
	•	placer ;
	•	déplacer ;
	•	comparer ;
	•	encadrer ;
	•	intercaler.
L'unité doit être identifiable.
Les graduations doivent être générées dynamiquement.

41. INTERACTIONS TACTILES
L'application doit être utilisable sur tablette.
Les zones tactiles doivent être suffisamment grandes.
Les interactions ne doivent pas dépendre uniquement du survol de souris.

42. AUDIO
Prévoir :
	•	consignes audio ;
	•	feedback audio éventuellement ;
	•	bouton de lecture ;
	•	architecture permettant d'ajouter des fichiers audio.
L'audio complète le texte.

43. ACCESSIBILITÉ
Prévoir :
	•	contraste ;
	•	typographie lisible ;
	•	grands boutons ;
	•	faible surcharge visuelle ;
	•	animations désactivables ;
	•	prefers-reduced-motion ;
	•	feedback visuel + textuel ;
	•	audio ;
	•	tactile ;
	•	clavier lorsque pertinent.

44. ASSETS
Prévoir notamment :
static/
└── assets/
    ├── characters/
    ├── environment/
    ├── objects/
    ├── npcs/
    ├── ui/
    └── audio/
Le développeur pourra remplacer progressivement les assets.
Ne jamais coupler fortement la logique à un fichier image précis.

45. MODE GRAPHIQUE
Le style général doit être :
RPG 2D rétro moderne.
Éviter :
	•	interface scolaire classique ;
	•	énorme tableau de boutons ;
	•	esthétique de quiz ;
	•	surcharge graphique ;
	•	menus permanents.
Le monde doit être visible et avoir une cohérence spatiale.

46. COMMENTAIRES ET MAINTENABILITÉ
Le code doit être compréhensible.
Pour les fichiers importants :
// -----------------------------------------------------------------------------
// RÔLE DU FICHIER
// Description courte.
// -----------------------------------------------------------------------------
Pour les fonctions complexes :
	•	expliquer pourquoi ;
	•	expliquer les règles importantes ;
	•	expliquer les interactions entre systèmes.
Ne pas commenter les évidences.

47. RÈGLES ABSOLUES
NE PAS :
	•	créer un App.svelte gigantesque ;
	•	coder huit versions différentes d'un même système ;
	•	dupliquer le code des étages ;
	•	mélanger données et interface ;
	•	mélanger collision et graphisme ;
	•	utiliser les pixels des images comme système de collision ;
	•	créer toutes les questions manuellement ;
	•	ajouter un backend sans nécessité ;
	•	créer des comptes élèves ;
	•	ajouter des dépendances inutiles ;
	•	réécrire complètement un projet existant fonctionnel ;
	•	ajouter du polish avant que les fonctions soient stables.

48. TESTS
Tester progressivement :
Déplacement
	•	haut ;
	•	bas ;
	•	gauche ;
	•	droite.
Collision
	•	mur ;
	•	obstacle ;
	•	limite.
Interaction
	•	porte ;
	•	escalier ;
	•	ascenseur ;
	•	mission.
Pédagogie
	•	exercice ;
	•	validation ;
	•	erreur ;
	•	aide ;
	•	progression ;
	•	boss.
Sauvegarde
	•	export ;
	•	import ;
	•	restauration.
Enseignant
	•	authentification ;
	•	diagnostic ;
	•	intervention ;
	•	export Excel.

49. DÉVELOPPEMENT PAR PHASES
NE PAS essayer de tout construire immédiatement.
PHASE 0 — AUDIT
Avant toute modification :
	•	analyser le projet ;
	•	identifier la stack ;
	•	identifier les fichiers ;
	•	identifier les composants existants ;
	•	identifier les dépendances ;
	•	vérifier ce qui existe déjà.
Ne rien casser inutilement.

PHASE 1 — MOTEUR DU MONDE
Construire d'abord :
	•	carte ;
	•	personnage ;
	•	déplacement ;
	•	collision ;
	•	interactions ;
	•	caméra si nécessaire ;
	•	escaliers ;
	•	ascenseur ;
	•	changement d'étage ;
	•	mode debug.
Objectif :
pouvoir réellement se promener dans une pièce.

PHASE 2 — PREMIÈRE ACTIVITÉ
Créer un premier espace pédagogique réellement fonctionnel.
Le personnage se déplace dans la pièce.
Il arrive devant une zone.
Il interagit.
L'activité pédagogique s'ouvre.
Il termine.
Il revient dans le monde.

PHASE 3 — MOTEUR DE FRACTIONS
Créer :
	•	FractionEngine ;
	•	FractionBar ;
	•	FractionCircle ;
	•	NumberLine ;
	•	validations ;
	•	générateurs.

PHASE 4 — PREMIER ÉTAGE COMPLET
Construire un étage complet :
exploration→ découverte→ cours→ manipulation→ micro-validation→ entraînement→ défi→ boss→ bilan.
Ne pas construire les huit étages avant d'avoir validé cette boucle.

PHASE 5 — CUA
Ajouter :
	•	audio ;
	•	aides ;
	•	représentations multiples ;
	•	feedback ;
	•	adaptation.

PHASE 6 — MAÎTRISE
Ajouter :
	•	compétences ;
	•	maîtrise ;
	•	consolidation ;
	•	erreurs ;
	•	réactivation ;
	•	historique.

PHASE 7 — 8 ÉTAGES
Construire les données des huit étages.
Réutiliser le moteur.
Ne pas dupliquer les composants.

PHASE 8 — BOSSES
Ajouter :
	•	boss d'étage ;
	•	boss synthèse 1–5 ;
	•	boss final 1–8.

PHASE 9 — SAUVEGARDE
Ajouter :
	•	.fracsave ;
	•	export ;
	•	import ;
	•	versionnement ;
	•	restauration.

PHASE 10 — ENSEIGNANT
Ajouter :
	•	/teacher ;
	•	mot de passe ;
	•	dashboard ;
	•	diagnostic ;
	•	interventions.

PHASE 11 — EXCEL
Ajouter :
	•	export .xlsx ;
	•	synthèse ;
	•	compétences ;
	•	erreurs ;
	•	tentatives ;
	•	boss ;
	•	historique.

PHASE 12 — POLISH
Seulement maintenant :
	•	animations ;
	•	transitions ;
	•	effets ;
	•	détails graphiques ;
	•	ambiance sonore ;
	•	polish visuel.

50. PREMIÈRE ACTION DEMANDÉE À L'AGENT
NE COMMENCE PAS par créer tous les fichiers.
Commence par analyser le projet existant.
Puis réponds avec :
1. Architecture actuelle
Quels fichiers existent ?
2. Technologies
Quelles versions et dépendances sont utilisées ?
3. Ce qui peut être conservé
Quels éléments sont déjà utiles ?
4. Ce qui doit être créé
Quels éléments manquent ?
5. Plan de migration
Dans quel ordre faut-il travailler ?
Ensuite seulement commence la PHASE 1.

51. RÈGLE FONDAMENTALE
À chaque étape, l'objectif est d'avoir quelque chose de réellement fonctionnel.
Ne pas dire :
« Le système de collision est maintenant implémenté »
si le joueur ne peut pas réellement se déplacer et rencontrer des murs.
Ne pas dire :
« Le système pédagogique est prêt »
si l'exercice n'est pas réellement jouable.
Ne pas dire :
« L'import est terminé »
si un fichier exporté ne peut pas être réimporté.
Tester réellement les fonctionnalités.

52. OBJECTIF FINAL
Le résultat final doit être une application dans laquelle :
L'ÉLÈVE
ouvre le jeu
↓
voit son personnage
↓
explore la tour
↓
se déplace dans les pièces
↓
utilise escaliers / ascenseur
↓
rencontre des activités
↓
manipule des fractions
↓
reçoit des explications
↓
s'entraîne
↓
utilise des aides
↓
affronte des boss
↓
progresse dans les compétences
↓
réactive ses anciennes connaissances
↓
peut être orienté vers une remédiation
↓
exporte sa progression.

L'ENSEIGNANT
ouvre l'espace enseignant
↓
importe les sauvegardes
↓
voit rapidement la situation de la classe
↓
identifie les élèves qui avancent
↓
identifie ceux qui bloquent
↓
voit les compétences fragiles
↓
voit les erreurs récurrentes
↓
comprend les difficultés
↓
intervient si nécessaire
↓
choisit :
CONTINUER
ou
REMÉDIATION
ou
RETOUR AU COURS
↓
peut exporter un fichier Excel pour analyser la progression.

53. PRINCIPLE FINAL
Ce projet n'est pas :
« un quiz de fractions avec un personnage ».
C'est :
un environnement d'apprentissage mathématique interactif dans lequel le jeu, l'exploration, la manipulation et l'évaluation sont intégrés dans un même système.
La technologie doit servir la pédagogie.
La gamification doit soutenir l'engagement.
La CUA doit soutenir l'accessibilité.
L'analyse des erreurs doit soutenir la remédiation.
Et l'espace enseignant doit permettre à l'adulte de comprendre rapidement ce qui se passe.
COMMENCE PAR L'AUDIT DU PROJET.
NE CODE PAS TOUT D'UN COUP.
CONSTRUIS UNE PREMIÈRE BOUCLE RÉELLEMENT FONCTIONNELLE.
