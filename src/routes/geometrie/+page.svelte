<script lang="ts">
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { getStudentName, submitActivityResult } from '$lib/client/activity';

  // ==========================================
  // 1. TYPES & ARCHITECTURE GÉOMÉTRIQUE
  // ==========================================
  type Level = '6H' | '7H' | '8H';
  type Mode = 'A' | 'B' | 'C' | 'D' | 'Mixte';
  type PlayMode = 'A' | 'B' | 'C' | 'D';

  export type GeometryProperties = {
    sides?: number;
    vertices?: number;
    angles?: number;
    rightAngles?: number;
    equalSides?: number; // 0: aucun, 2: isocèle, 3: équilatéral, 4: carré/losange
    parallelPairs?: number;
    faces?: number;
    edges?: number;
    faceShapes?: string[];
    triangularFaces?: number;
    quadrilateralFaces?: number;
    baseShape?: string;
    isConvex?: boolean;
    axesOfSymmetry?: number;
  };

  export type GeometryFigure = {
    id: string;
    name: string;
    kind: 'plane' | 'solid';
    isTriangle: boolean;
    levels: Level[];
    vocab: string;
    properties: GeometryProperties;
  };

  export type QuestionType = 'single' | 'multiple';

  export type Question = {
    mode: PlayMode;
    text: string;
    type: QuestionType;
    options: { id: string; label: string; figure?: GeometryFigure }[];
    correctIds: string[];
    explanation: string;
    hints?: string[];
    progressiveHints?: string[];
    targetFigure?: GeometryFigure;
    commonPropertyExplanation?: string;
  };

  // ==========================================
  // 2. BASE DE DONNÉES GÉOMÉTRIQUE STRUCTURÉE
  // ==========================================
  const figures: GeometryFigure[] = [
    {
      id: 'tri_scalene',
      name: 'Triangle quelconque',
      kind: 'plane',
      isTriangle: true,
      levels: ['6H', '7H', '8H'],
      vocab: 'Un triangle classique à 3 côtés de longueurs différentes et sans angle droit.',
      properties: { sides: 3, vertices: 3, angles: 3, rightAngles: 0, equalSides: 0, parallelPairs: 0, axesOfSymmetry: 0, isConvex: true }
    },
    {
      id: 'tri_rectangle',
      name: 'Triangle rectangle',
      kind: 'plane',
      isTriangle: true,
      levels: ['7H', '8H'],
      vocab: 'Possède exactement 1 angle droit mesurable à l\'équerre.',
      properties: { sides: 3, vertices: 3, angles: 3, rightAngles: 1, equalSides: 0, parallelPairs: 0, axesOfSymmetry: 0, isConvex: true }
    },
    {
      id: 'tri_isocele',
      name: 'Triangle isocèle',
      kind: 'plane',
      isTriangle: true,
      levels: ['8H'],
      vocab: 'Possède au moins 2 côtés de même longueur et 1 axe de symétrie.',
      properties: { sides: 3, vertices: 3, angles: 3, rightAngles: 0, equalSides: 2, parallelPairs: 0, axesOfSymmetry: 1, isConvex: true }
    },
    {
      id: 'tri_equilateral',
      name: 'Triangle équilatéral',
      kind: 'plane',
      isTriangle: true,
      levels: ['8H'],
      vocab: 'Possède 3 côtés de même longueur et 3 axes de symétrie.',
      properties: { sides: 3, vertices: 3, angles: 3, rightAngles: 0, equalSides: 3, parallelPairs: 0, axesOfSymmetry: 3, isConvex: true }
    },
    {
      id: 'tri_isocele_rectangle',
      name: 'Triangle isocèle rectangle',
      kind: 'plane',
      isTriangle: true,
      levels: ['8H'],
      vocab: 'Combine 1 angle droit et 2 côtés égaux.',
      properties: { sides: 3, vertices: 3, angles: 3, rightAngles: 1, equalSides: 2, parallelPairs: 0, axesOfSymmetry: 1, isConvex: true }
    },
    {
      id: 'carre',
      name: 'Carré',
      kind: 'plane',
      isTriangle: false,
      levels: ['6H', '7H', '8H'],
      vocab: '4 côtés égaux, 4 angles droits, 2 paires de côtés parallèles, 4 axes de symétrie.',
      properties: { sides: 4, vertices: 4, angles: 4, rightAngles: 4, equalSides: 4, parallelPairs: 2, axesOfSymmetry: 4, isConvex: true }
    },
    {
      id: 'rectangle',
      name: 'Rectangle',
      kind: 'plane',
      isTriangle: false,
      levels: ['6H', '7H', '8H'],
      vocab: 'Côtés opposés égaux et parallèles, 4 angles droits, 2 axes de symétrie.',
      properties: { sides: 4, vertices: 4, angles: 4, rightAngles: 4, equalSides: 2, parallelPairs: 2, axesOfSymmetry: 2, isConvex: true }
    },
    {
      id: 'cercle',
      name: 'Cercle',
      kind: 'plane',
      isTriangle: false,
      levels: ['6H', '7H', '8H'],
      vocab: 'Ligne courbe fermée dont tous les points sont à égale distance du centre.',
      properties: { sides: 0, vertices: 0, angles: 0, rightAngles: 0, equalSides: 0, parallelPairs: 0, axesOfSymmetry: Infinity, isConvex: true }
    },
    {
      id: 'losange',
      name: 'Losange',
      kind: 'plane',
      isTriangle: false,
      levels: ['7H', '8H'],
      vocab: '4 côtés égaux, 2 paires de côtés parallèles, 2 axes de symétrie.',
      properties: { sides: 4, vertices: 4, angles: 4, rightAngles: 0, equalSides: 4, parallelPairs: 2, axesOfSymmetry: 2, isConvex: true }
    },
    {
      id: 'parallelogramme',
      name: 'Parallélogramme',
      kind: 'plane',
      isTriangle: false,
      levels: ['7H', '8H'],
      vocab: 'Côtés opposés parallèles et égaux 2 à 2, aucun axe de symétrie.',
      properties: { sides: 4, vertices: 4, angles: 4, rightAngles: 0, equalSides: 2, parallelPairs: 2, axesOfSymmetry: 0, isConvex: true }
    },
    {
      id: 'trapeze_quelconque',
      name: 'Trapèze quelconque',
      kind: 'plane',
      isTriangle: false,
      levels: ['7H', '8H'],
      vocab: 'Quadrilatère ayant exactement 1 paire de côtés opposés parallèles.',
      properties: { sides: 4, vertices: 4, angles: 4, rightAngles: 0, equalSides: 0, parallelPairs: 1, axesOfSymmetry: 0, isConvex: true }
    },
    {
      id: 'cerf_volant',
      name: 'Cerf-volant',
      kind: 'plane',
      isTriangle: false,
      levels: ['7H', '8H'],
      vocab: '2 paires de côtés adjacents égaux, 1 axe de symétrie.',
      properties: { sides: 4, vertices: 4, angles: 4, rightAngles: 0, equalSides: 2, parallelPairs: 0, axesOfSymmetry: 1, isConvex: true }
    },
    {
      id: 'fer_de_lance',
      name: 'Fer de lance',
      kind: 'plane',
      isTriangle: false,
      levels: ['7H', '8H'],
      vocab: 'Quadrilatère non convexe en forme de flèche, possède un angle rentrant.',
      properties: { sides: 4, vertices: 4, angles: 4, rightAngles: 0, equalSides: 2, parallelPairs: 0, axesOfSymmetry: 1, isConvex: false }
    },
    {
      id: 'trapeze_rectangle',
      name: 'Trapèze rectangle',
      kind: 'plane',
      isTriangle: false,
      levels: ['8H'],
      vocab: '1 paire de côtés parallèles et 2 angles droits.',
      properties: { sides: 4, vertices: 4, angles: 4, rightAngles: 2, equalSides: 0, parallelPairs: 1, axesOfSymmetry: 0, isConvex: true }
    },
    {
      id: 'trapeze_isocele',
      name: 'Trapèze isocèle',
      kind: 'plane',
      isTriangle: false,
      levels: ['8H'],
      vocab: '1 paire de côtés parallèles, côtés non parallèles de même longueur, 1 axe de symétrie.',
      properties: { sides: 4, vertices: 4, angles: 4, rightAngles: 0, equalSides: 2, parallelPairs: 1, axesOfSymmetry: 1, isConvex: true }
    },
    {
      id: 'cube',
      name: 'Cube',
      kind: 'solid',
      isTriangle: false,
      levels: ['7H', '8H'],
      vocab: '6 faces carrées identiques, 12 arêtes de même longueur, 8 sommets.',
      properties: { faces: 6, edges: 12, vertices: 8, faceShapes: ['carré'], quadrilateralFaces: 6, triangularFaces: 0, baseShape: 'carré' }
    },
    {
      id: 'pave_droit',
      name: 'Pavé droit',
      kind: 'solid',
      isTriangle: false,
      levels: ['7H', '8H'],
      vocab: '6 faces rectangulaires, 12 arêtes, 8 sommets.',
      properties: { faces: 6, edges: 12, vertices: 8, faceShapes: ['rectangle'], quadrilateralFaces: 6, triangularFaces: 0, baseShape: 'rectangle' }
    },
    {
      id: 'pyramide_carree',
      name: 'Pyramide à base carrée',
      kind: 'solid',
      isTriangle: false,
      levels: ['7H', '8H'],
      vocab: '1 base carrée, 4 faces latérales triangulaires, 8 arêtes, 5 sommets.',
      properties: { faces: 5, edges: 8, vertices: 5, faceShapes: ['carré', 'triangle'], quadrilateralFaces: 1, triangularFaces: 4, baseShape: 'carré' }
    },
    {
      id: 'tetraedre',
      name: 'Tétraèdre',
      kind: 'solid',
      isTriangle: false,
      levels: ['7H', '8H'],
      vocab: 'Pyramide à base triangulaire : 4 faces triangulaires, 6 arêtes, 4 sommets.',
      properties: { faces: 4, edges: 6, vertices: 4, faceShapes: ['triangle'], quadrilateralFaces: 0, triangularFaces: 4, baseShape: 'triangle' }
    }
  ];

  // ==========================================
  // 3. ÉTATS ET ÉTATS RÉACTIFS DU JEU
  // ==========================================
  let studentName = 'Explorateur';
  let phase: 'config' | 'play' | 'done' = 'config';
  let level: Level | '' = '';
  let mode: Mode | '' = '';
  let questionIndex = 1;
  let score = 0;
  let xp = 0;

  let currentMode: PlayMode = 'A';
  let currentQuestion: Question | null = null;
  let selectedOptionIds: string[] = [];
  
  let currentHintIndex = 0;
  let points = 30;

  let feedback = '';
  let feedbackDetails = '';
  let blocked = false;
  let errorFamilies: any[] = [];

  let isXlMode = false;
  let showAideModal = false;
  let showRadarModal = false;

  onMount(() => {
    studentName = getStudentName();
  });

  function availableFigures(): GeometryFigure[] {
    return figures.filter((f) => level && f.levels.includes(level));
  }

  function shuffle<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function choose<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  // ==========================================
  // 4. MOTEUR ET VALIDATEUR DE QUESTIONS
  // ==========================================
  function validateQuestion(q: Question): boolean {
    if (!q.options || q.options.length < 2) return false;
    if (!q.correctIds || q.correctIds.length === 0) return false;

    if (q.type === 'single') {
      if (q.correctIds.length !== 1) return false;
    } else if (q.type === 'multiple') {
      if (q.correctIds.length < 1 || q.correctIds.length >= q.options.length) return false;
    }

    // Vérification des doublons d'options
    const labels = q.options.map(o => o.label.trim().toLowerCase());
    if (new Set(labels).size !== labels.length) return false;

    return true;
  }

  function generateQuestionForMode(targetMode: PlayMode): Question {
    const pool = availableFigures();
    let attempts = 0;

    while (attempts < 50) {
      attempts++;
      let q: Question | null = null;

      if (targetMode === 'A') {
        q = buildModeAQuestion(pool);
      } else if (targetMode === 'B') {
        q = buildModeBQuestion(pool);
      } else if (targetMode === 'C') {
        q = buildModeCQuestion(pool);
      } else if (targetMode === 'D') {
        q = buildModeDQuestion(pool);
      }

      if (q && validateQuestion(q)) {
        return q;
      }
    }

    // Fallback sécurisé
    return buildFallbackQuestion(pool, targetMode);
  }

  function buildModeAQuestion(pool: GeometryFigure[]): Question {
    const target = choose(pool);
    
    // Contruire des indices progressifs rigoureux
    const hints: string[] = [];
    if (target.kind === 'plane') {
      if (target.properties.sides !== undefined) hints.push(`Je suis une figure plane à ${target.properties.sides === 0 ? '0 côté droit' : target.properties.sides + ' côtés'}.`);
      if (target.properties.rightAngles !== undefined) {
        hints.push(target.properties.rightAngles > 0 ? `J'ai exactement ${target.properties.rightAngles} angle(s) droit(s).` : `Je n'ai aucun angle droit.`);
      }
      if (target.properties.equalSides !== undefined && target.properties.sides && target.properties.sides > 0) {
        if (target.properties.equalSides === target.properties.sides) hints.push(`Tous mes ${target.properties.sides} côtés sont de même longueur.`);
        else if (target.properties.equalSides >= 2) hints.push(`J'ai au moins ${target.properties.equalSides} côtés de même longueur.`);
        else hints.push(`Mes côtés sont tous de longueurs différentes.`);
      }
      if (target.properties.parallelPairs !== undefined && target.properties.parallelPairs > 0) {
        hints.push(`J'ai ${target.properties.parallelPairs} paire(s) de côtés parallèles.`);
      }
    } else {
      hints.push(`Je suis un solide volumétrique (3D).`);
      if (target.properties.faces) hints.push(`J'ai ${target.properties.faces} faces au total.`);
      if (target.properties.vertices) hints.push(`J'ai ${target.properties.vertices} sommets.`);
      if (target.properties.baseShape) hints.push(`Ma base est un ${target.properties.baseShape}.`);
    }

    // Sélection des distracteurs qui ne satisfont pas la même combinaison stricte
    const distractors = shuffle(pool.filter(f => f.id !== target.id));
    const chosenOptions = shuffle([target, ...distractors.slice(0, 3)]);

    return {
      mode: 'A',
      text: `Devine la figure d'après ses propriétés géométriques :`,
      type: 'single',
      options: chosenOptions.map(f => ({ id: f.id, label: f.name, figure: f })),
      correctIds: [target.id],
      explanation: `${target.name} : ${target.vocab}`,
      progressiveHints: hints,
      targetFigure: target
    };
  }

  function buildModeBQuestion(pool: GeometryFigure[]): Question {
    // Mode Intrus Logique avec justification pédagogique
    const rules = [
      {
        name: '4 côtés (Quadrilatères)',
        filter: (f: GeometryFigure) => f.kind === 'plane' && f.properties.sides === 4,
        explanation: 'Les trois autres figures sont des quadrilatères (4 côtés).'
      },
      {
        name: '3 côtés (Triangles)',
        filter: (f: GeometryFigure) => f.kind === 'plane' && f.properties.sides === 3,
        explanation: 'Les trois autres figures sont des triangles (3 côtés).'
      },
      {
        name: 'Solides (3D)',
        filter: (f: GeometryFigure) => f.kind === 'solid',
        explanation: 'Les trois autres éléments sont des solides en 3 dimensions.'
      },
      {
        name: 'Figures planes (2D)',
        filter: (f: GeometryFigure) => f.kind === 'plane',
        explanation: 'Les trois autres éléments sont des figures planes (2D).'
      },
      {
        name: 'Possède au moins un angle droit',
        filter: (f: GeometryFigure) => f.kind === 'plane' && (f.properties.rightAngles || 0) > 0,
        explanation: 'Les trois autres figures possèdent toutes au moins un angle droit.'
      }
    ];

    const rule = choose(rules);
    const compliant = pool.filter(rule.filter);
    const nonCompliant = pool.filter(f => !rule.filter(f));

    if (compliant.length >= 3 && nonCompliant.length >= 1) {
      const group = shuffle(compliant).slice(0, 3);
      const intruder = choose(nonCompliant);
      const opts = shuffle([...group, intruder]);

      return {
        mode: 'B',
        text: `Trouve l'intrus géométrique parmi ces figures :`,
        type: 'single',
        options: opts.map(f => ({ id: f.id, label: f.name, figure: f })),
        correctIds: [intruder.id],
        explanation: `L'intrus est le **${intruder.name}**. ${rule.explanation}`,
        commonPropertyExplanation: rule.explanation,
        targetFigure: intruder
      };
    }

    // Revenir à 2D vs 3D si problème de pool
    const solids = pool.filter(f => f.kind === 'solid');
    const planes = pool.filter(f => f.kind === 'plane');
    const group = shuffle(planes).slice(0, 3);
    const intruder = choose(solids);
    const opts = shuffle([...group, intruder]);

    return {
      mode: 'B',
      text: `Trouve l'intrus parmi ces figures :`,
      type: 'single',
      options: opts.map(f => ({ id: f.id, label: f.name, figure: f })),
      correctIds: [intruder.id],
      explanation: `L'intrus est le **${intruder.name}**. Les trois autres sont des figures planes (2D).`,
      targetFigure: intruder
    };
  }

  function buildModeCQuestion(pool: GeometryFigure[]): Question {
    // Mode Tri ou Questions de propriétés précises
    const solidTarget = choose(pool);
    
    return {
      mode: 'C',
      text: `Dans quelle catégorie classe-t-on le "${solidTarget.name}" ?`,
      type: 'single',
      options: [
        { id: 'plane', label: 'Figure plane (2D)' },
        { id: 'solid', label: 'Solide volumétrique (3D)' }
      ],
      correctIds: [solidTarget.kind],
      explanation: `${solidTarget.name} est un ${solidTarget.kind === 'plane' ? 'figure plane (2D)' : 'solide volumétrique (3D)'}. (${solidTarget.vocab})`,
      targetFigure: solidTarget
    };
  }

  function buildModeDQuestion(pool: GeometryFigure[]): Question {
    // Mode QCM Multi-réponses ou Réponse Unique sur propriété explicite
    const isMultiChoice = Math.random() > 0.4;

    if (isMultiChoice) {
      const criteriaList = [
        {
          label: 'Quelles figures possèdent exactement 4 côtés ?',
          check: (f: GeometryFigure) => f.kind === 'plane' && f.properties.sides === 4,
          exp: 'Ce sont tous des quadrilatères (4 côtés).'
        },
        {
          label: 'Quelles figures possèdent au moins un angle droit ?',
          check: (f: GeometryFigure) => f.kind === 'plane' && (f.properties.rightAngles || 0) > 0,
          exp: 'Ces figures possèdent au moins un angle droit.'
        },
        {
          label: 'Quels éléments sont des solides en 3 dimensions ?',
          check: (f: GeometryFigure) => f.kind === 'solid',
          exp: 'Ce sont des solides volumétriques.'
        }
      ];

      const criterion = choose(criteriaList);
      const matches = pool.filter(criterion.check);
      const nonMatches = pool.filter(f => !criterion.check(f));

      if (matches.length >= 2 && nonMatches.length >= 2) {
        const selectedMatches = shuffle(matches).slice(0, 2);
        const selectedNonMatches = shuffle(nonMatches).slice(0, 2);
        const optionsList = shuffle([...selectedMatches, ...selectedNonMatches]);

        return {
          mode: 'D',
          text: `${criterion.label} (Plusieurs réponses possibles)`,
          type: 'multiple',
          options: optionsList.map(f => ({ id: f.id, label: f.name, figure: f })),
          correctIds: selectedMatches.map(f => f.id),
          explanation: criterion.exp
        };
      }
    }

    // Réponse unique si pas assez de matches pour du multi
    const target = choose(pool);
    const hints = [
      target.kind === 'plane' ? `Figures à ${target.properties.sides} côtés` : `Solide à ${target.properties.faces} faces`,
      target.vocab
    ];

    const distractors = shuffle(pool.filter(f => f.id !== target.id)).slice(0, 5);
    const opts = shuffle([target, ...distractors]);

    return {
      mode: 'D',
      text: `Trouve la figure correspondant aux caractéristiques :`,
      type: 'single',
      options: opts.map(f => ({ id: f.id, label: f.name, figure: f })),
      correctIds: [target.id],
      explanation: `${target.name} : ${target.vocab}`,
      hints,
      targetFigure: target
    };
  }

  function buildFallbackQuestion(pool: GeometryFigure[], targetMode: PlayMode): Question {
    const target = pool[0];
    return {
      mode: targetMode,
      text: `Identifie la figure suivante : ${target.name}`,
      type: 'single',
      options: pool.slice(0, 4).map(f => ({ id: f.id, label: f.name, figure: f })),
      correctIds: [target.id],
      explanation: target.vocab,
      targetFigure: target
    };
  }

  // ==========================================
  // 5. GESTION DU GAMEPLAY & INTERACTIONS
  // ==========================================
  function startMission() {
    if (!level || !mode) return;
    phase = 'play';
    questionIndex = 1;
    score = 0;
    xp = 0;
    errorFamilies = [];
    loadNextQuestion();
  }

  function loadNextQuestion() {
    if (questionIndex > 10) {
      finishMission();
      return;
    }

    blocked = false;
    feedback = '';
    feedbackDetails = '';
    selectedOptionIds = [];
    currentHintIndex = 0;
    points = 30;

    currentMode = mode === 'Mixte' ? choose<PlayMode>(['A', 'B', 'C', 'D']) : (mode as PlayMode);
    currentQuestion = generateQuestionForMode(currentMode);
  }

  function toggleOptionSelection(id: string) {
    if (blocked || !currentQuestion) return;

    if (currentQuestion.type === 'single') {
      selectedOptionIds = [id];
      submitAnswer();
    } else {
      if (selectedOptionIds.includes(id)) {
        selectedOptionIds = selectedOptionIds.filter(item => item !== id);
      } else {
        selectedOptionIds = [...selectedOptionIds, id];
      }
    }
  }

  function submitAnswer() {
    if (blocked || !currentQuestion || selectedOptionIds.length === 0) return;
    blocked = true;

    const correctSet = new Set(currentQuestion.correctIds);
    const selectedSet = new Set(selectedOptionIds);

    let isCorrect = correctSet.size === selectedSet.size && [...correctSet].every(id => selectedSet.has(id));

    if (isCorrect) {
      score += 1;
      xp += points;
      feedback = ` ANALYSE VALIDE (+${points} XP)`;
      feedbackDetails = currentQuestion.explanation;
    } else {
      const correctLabels = currentQuestion.options
        .filter(o => currentQuestion?.correctIds.includes(o.id))
        .map(o => o.label)
        .join(', ');

      const selectedLabels = currentQuestion.options
        .filter(o => selectedOptionIds.includes(o.id))
        .map(o => o.label)
        .join(', ');

      errorFamilies = [...errorFamilies, { target: correctLabels, answered: selectedLabels, mode: currentMode }];

      feedback = ` APPRENTISSAGE EN COURS`;
      feedbackDetails = `Réponse attendue : **${correctLabels}**.<br>${currentQuestion.explanation}`;
    }

    window.setTimeout(() => {
      questionIndex += 1;
      loadNextQuestion();
    }, isCorrect ? 2200 : 5500);
  }

  function showHint() {
    if (blocked || !currentQuestion || !currentQuestion.progressiveHints) return;
    if (currentHintIndex < currentQuestion.progressiveHints.length - 1) {
      currentHintIndex += 1;
      points = Math.max(10, points - 10);
    }
  }

  function lireConsigneAudio() {
    if (!currentQuestion) return;
    let texte = currentQuestion.text;

    if (currentQuestion.progressiveHints) {
      texte += " Indice : " + currentQuestion.progressiveHints[currentHintIndex];
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texte);
      utterance.lang = 'fr-CH';
      window.speechSynthesis.speak(utterance);
    }
  }

  async function finishMission() {
    phase = 'done';
    await submitActivityResult({
      studentName,
      world: 'geometrie',
      mission: `${level} mode ${mode}`,
      score,
      total: 10,
      scoreBasis: 'last',
      errorCount: 10 - score,
      errorFamilies: errorFamilies,
      metadata: { xp }
    });
  }

  // ==========================================
  // 6. RENDU GEOMETRIQUE VECTORIEL SVG (2D / 2.5D)
  // ==========================================
  function renderSVG(name: string, customClass = ""): string {
    const s = `<svg class="${customClass}" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" style="width:100%; height:100%; display:block;">`;
    const e = `</svg>`;

    switch (name) {
      // FIGURES PLANES
      case 'Triangle quelconque': return s + `<polygon points="15,25 85,40 35,85" fill="rgba(34,211,238,0.1)"/>` + e;
      case 'Triangle rectangle': return s + `<polygon points="20,15 20,85 85,85" fill="rgba(34,211,238,0.1)"/><polyline points="20,70 35,70 35,85" stroke-width="2"/>` + e;
      case 'Triangle isocèle': return s + `<polygon points="50,15 15,85 85,85" fill="rgba(34,211,238,0.1)"/><line x1="30" y1="50" x2="40" y2="50" stroke-width="2"/><line x1="60" y1="50" x2="70" y2="50" stroke-width="2"/>` + e;
      case 'Triangle équilatéral': return s + `<polygon points="50,15 12,85 88,85" fill="rgba(34,211,238,0.1)"/>` + e;
      case 'Triangle isocèle rectangle': return s + `<polygon points="20,20 20,85 85,85" fill="rgba(34,211,238,0.1)"/><polyline points="20,70 35,70 35,85" stroke-width="2"/>` + e;
      case 'Carré': return s + `<rect x="15" y="15" width="70" height="70" fill="rgba(34,211,238,0.1)"/>` + e;
      case 'Rectangle': return s + `<rect x="10" y="25" width="80" height="50" fill="rgba(34,211,238,0.1)"/>` + e;
      case 'Cercle': return s + `<circle cx="50" cy="50" r="38" fill="rgba(34,211,238,0.1)"/>` + e;
      case 'Losange': return s + `<polygon points="50,10 88,50 50,90 12,50" fill="rgba(34,211,238,0.1)"/>` + e;
      case 'Parallélogramme': return s + `<polygon points="30,20 90,20 70,80 10,80" fill="rgba(34,211,238,0.1)"/>` + e;
      case 'Trapèze quelconque': return s + `<polygon points="25,25 75,25 90,80 10,80" fill="rgba(34,211,238,0.1)"/>` + e;
      case 'Cerf-volant': return s + `<polygon points="50,10 88,40 50,90 12,40" fill="rgba(34,211,238,0.1)"/><line x1="50" y1="10" x2="50" y2="90" stroke-dasharray="3,3" stroke-width="2"/>` + e;
      case 'Fer de lance': return s + `<polygon points="50,10 90,90 50,65 10,90" fill="rgba(34,211,238,0.1)"/>` + e;
      case 'Trapèze rectangle': return s + `<polygon points="20,25 75,25 90,80 20,80" fill="rgba(34,211,238,0.1)"/><polyline points="20,40 35,40 35,25" stroke-width="2"/>` + e;
      case 'Trapèze isocèle': return s + `<polygon points="30,25 70,25 88,80 12,80" fill="rgba(34,211,238,0.1)"/>` + e;

      // SOLIDES 2.5D VECTORIELS PROPRES AVEC ARÊTES CACHÉES ET PROPORTIONS STABLES
      case 'Cube':
        return s + `
          <polygon points="18,32 50,15 82,32 50,48" fill="rgba(34,211,238,0.2)"/>
          <polygon points="18,32 50,48 50,85 18,68" fill="rgba(34,211,238,0.1)"/>
          <polygon points="50,48 82,32 82,68 50,85" fill="rgba(34,211,238,0.15)"/>
        ` + e;

      case 'Pavé droit':
        return s + `
          <polygon points="10,35 60,20 90,35 40,50" fill="rgba(34,211,238,0.2)"/>
          <polygon points="10,35 40,50 40,80 10,65" fill="rgba(34,211,238,0.1)"/>
          <polygon points="40,50 90,35 90,65 40,80" fill="rgba(34,211,238,0.15)"/>
        ` + e;

      case 'Pyramide à base carrée':
        return s + `
          <polygon points="50,12 15,68 50,85" fill="rgba(34,211,238,0.15)"/>
          <polygon points="50,12 50,85 85,68" fill="rgba(34,211,238,0.25)"/>
          <line x1="15" y1="68" x2="85" y2="68" stroke-dasharray="3,3" stroke-width="2"/>
        ` + e;

      case 'Tétraèdre':
        return s + `
          <polygon points="50,15 15,80 52,88" fill="rgba(34,211,238,0.15)"/>
          <polygon points="50,15 52,88 85,72" fill="rgba(34,211,238,0.25)"/>
          <line x1="15" y1="80" x2="85" y2="72" stroke-dasharray="3,3" stroke-width="2"/>
        ` + e;

      default:
        return s + `<text x="50" y="55" font-size="24" text-anchor="middle" fill="currentColor" stroke="none">?</text>` + e;
    }
  }
</script>

<svelte:head>
  <title>Secteur : Géométrie — Hub de Mission V2</title>
</svelte:head>

<div class="dark-page page" class:xl-mode={isXlMode}>
  <!-- EN-TÊTE -->
  <header class="dark-header">
    <div class="header-inner">
      <div class="brand">
        <span class="brand-icon"></span>
        <div>
          <h1 class="brand-title">Secteur : Géométrie</h1>
          <p class="brand-subtitle">Agent : {studentName}</p>
        </div>
      </div>
      <div class="actions">
        <button class="btn dark" type="button" on:click={() => (isXlMode = !isXlMode)}>
          {isXlMode ? ' Boutons XL' : ' Boutons Standard'}
        </button>
        <a class="btn dark" href="{base}/"> QG</a>
      </div>
    </div>
  </header>

  <main class="main">
    <!-- ECRAN 1 : CONFIGURATION -->
    {#if phase === 'config'}
      <section class="dark-card stack" style="max-width: 50rem; margin: 0 auto;">
        <div class="center">
          <h2>Configuration de la Mission</h2>
          <p class="muted">Sélectionne un niveau et un mode de raisonnement géométrique.</p>
        </div>

        <div class="stack">
          <strong class="kicker">1. Niveau de l’Agent</strong>
          <div class="grid" style="grid-template-columns: repeat(3, 1fr);">
            {#each ['6H', '7H', '8H'] as item}
              <button class="dark-option" class:selected={level === item} type="button" on:click={() => (level = item as Level)}>
                {item}
              </button>
            {/each}
          </div>
        </div>

        <div class="stack">
          <strong class="kicker">2. Mode d’analyse</strong>
          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));">
            <button class="dark-option" class:selected={mode === 'A'} type="button" on:click={() => (mode = 'A')}> Qui suis-je ?</button>
            <button class="dark-option" class:selected={mode === 'B'} type="button" on:click={() => (mode = 'B')}> L’intrus Logique</button>
            <button class="dark-option" class:selected={mode === 'C'} type="button" on:click={() => (mode = 'C')}> 2D vs 3D</button>
            <button class="dark-option" class:selected={mode === 'D'} type="button" on:click={() => (mode = 'D')}> Défis & QCM</button>
            <button class="dark-option" style="grid-column: 1 / -1;" class:selected={mode === 'Mixte'} type="button" on:click={() => (mode = 'Mixte')}> Mode Mixte</button>
          </div>
        </div>

        <button class="btn primary" disabled={!level || !mode} type="button" on:click={startMission}>
          Initialiser la Mission
        </button>
      </section>

    <!-- ECRAN 2 : ZONE DE JEU -->
    {:else if phase === 'play' && currentQuestion}
      <section class="dark-card stack play-zone" class:error-state={feedback.startsWith(' APPRENTISSAGE')} class:success-state={feedback.startsWith(' ANALYSE')}>
        <div class="mission-top">
          <div>
            <span class="badge">Question {Math.min(questionIndex, 10)} / 10</span>
            <span class="badge">Mode {currentMode}</span>
          </div>
          <div class="actions">
            <button class="btn dark small" on:click={() => (showAideModal = true)}> Aide-Mémoire</button>
            <span class="badge xp">XP : {xp}</span>
          </div>
        </div>

        <!-- OUTILS ET CONSIGNES -->
        <div class="tools-floating">
          <button class="tool-btn audio" on:click={lireConsigneAudio} title="Écouter la consigne"></button>
          {#if currentQuestion.progressiveHints}
            <button class="tool-btn hint" class:hidden={currentHintIndex >= currentQuestion.progressiveHints.length - 1 || blocked} on:click={showHint} title="Demander un indice"></button>
          {/if}
          {#if currentQuestion.targetFigure}
            <button class="tool-btn radar" on:click={() => (showRadarModal = true)} title="Agrandir / Radar"></button>
          {/if}
        </div>

        <div class="consigne-box center">
          <p class="kicker">{currentQuestion.text}</p>
          {#if currentQuestion.type === 'multiple'}
            <p class="sub-kicker">Sélectionne toutes les réponses correctes puis valide.</p>
          {/if}
        </div>

        <!-- INDICES PROGRESSIFS SI MODE A -->
        {#if currentQuestion.progressiveHints}
          <div class="dark-card compact center">
            <p class="kicker">Indices géométriques</p>
            {#each currentQuestion.progressiveHints.slice(0, currentHintIndex + 1) as hint}
              <p class="italic-hint">« {hint} »</p>
            {/each}
          </div>
        {/if}

        <!-- OPTIONS DE RÉPONSE -->
        <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
          {#each currentQuestion.options as option}
            <button
              class="dark-option stack center"
              class:selected={selectedOptionIds.includes(option.id)}
              type="button"
              on:click={() => toggleOptionSelection(option.id)}
            >
              {#if option.figure}
                <span class="shape-box">
                  {@html renderSVG(option.figure.name, "svg-icon")}
                </span>
              {/if}
              <span>{option.label}</span>
            </button>
          {/each}
        </div>

        {#if currentQuestion.type === 'multiple' && !blocked}
          <div class="center mt-4">
            <button class="btn primary" disabled={selectedOptionIds.length === 0} on:click={submitAnswer}>
              VALIDER
            </button>
          </div>
        {/if}

        <!-- FEEDBACK PÉDAGOGIQUE EN SÉCURITÉ -->
        {#if feedback}
          <div class="feedback-panel">
            <p class:good={feedback.startsWith(' ANALYSE')} class:bad={feedback.startsWith(' APPRENTISSAGE')} class="feedback-title">
              {feedback}
            </p>
            {#if feedbackDetails}
              <p class="feedback-details">{@html feedbackDetails}</p>
            {/if}
          </div>
        {/if}
      </section>

    <!-- ECRAN 3 : BILAN -->
    {:else}
      <section class="dark-card stack center" style="max-width: 36rem; margin: 0 auto;">
        <h2> Rapport de Mission Validé</h2>
        <div class="score-display">
          <div class="score-box"><p class="kicker">XP Totale</p><p class="score xp">{xp}</p></div>
          <div class="score-box"><p class="kicker">Précision</p><p class="score">{score} / 10</p></div>
        </div>
        <p>
          {score === 10 ? ' Secteur géométrique entièrement maîtrisé !' : score >= 7 ? ' Très bon travail !' : ' Mission accomplie. N’hésite pas à consulter l’Aide-Mémoire.'}
        </p>
        <div class="actions" style="justify-content: center;">
          <button class="btn primary" type="button" on:click={startMission}>Rejouer</button>
          <a class="btn dark" href="{base}/">Retour au QG</a>
        </div>
      </section>
    {/if}
  </main>
</div>

<!-- MODAL AIDE-MÉMOIRE (CONSERVÉE ET ENRICHIE) -->
{#if showAideModal}
  <div class="modal-backdrop" on:click={() => (showAideModal = false)}>
    <div class="modal-content aide-modal" on:click|stopPropagation>
      <div class="modal-header">
        <h3> Aide-Mémoire Géométrique</h3>
        <button on:click={() => (showAideModal = false)}>×</button>
      </div>
      <div class="modal-body">
        <strong class="kicker"> Triangles</strong>
        <div class="aide-grid">
          {#each figures.filter(s => s.isTriangle) as s}
            <div class="aide-card">
              <span>{s.name}</span>
              <div class="shape-box">{@html renderSVG(s.name, 'svg-icon')}</div>
              <p>{s.vocab}</p>
            </div>
          {/each}
        </div>

        <strong class="kicker mt-4"> Figures Planes</strong>
        <div class="aide-grid">
          {#each figures.filter(s => !s.isTriangle && s.kind === 'plane') as s}
            <div class="aide-card">
              <span>{s.name}</span>
              <div class="shape-box">{@html renderSVG(s.name, 'svg-icon')}</div>
              <p>{s.vocab}</p>
            </div>
          {/each}
        </div>

        <strong class="kicker mt-4"> Solides</strong>
        <div class="aide-grid">
          {#each figures.filter(s => s.kind === 'solid') as s}
            <div class="aide-card">
              <span>{s.name}</span>
              <div class="shape-box">{@html renderSVG(s.name, 'svg-icon')}</div>
              <p>{s.vocab}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- MODAL RADAR / AGRANDISSEMENT -->
{#if showRadarModal && currentQuestion?.targetFigure}
  <div class="modal-backdrop" on:click={() => (showRadarModal = false)}>
    <div class="modal-content radar-modal center" on:click|stopPropagation>
      <h3 class="kicker">Radar Géométrique : {currentQuestion.targetFigure.name}</h3>
      <div class="shape-box huge my-4" style="margin: 1.5rem auto;">
        {@html renderSVG(currentQuestion.targetFigure.name, "svg-icon-huge")}
      </div>
      <p class="muted">{currentQuestion.targetFigure.vocab}</p>
      <button class="btn dark" on:click={() => (showRadarModal = false)}>Fermer</button>
    </div>
  </div>
{/if}

<style>
  .center { text-align: center; }
  .stack { display: flex; flex-direction: column; gap: 1.25rem; }
  .grid { display: grid; gap: 1rem; }
  .mt-4 { margin-top: 1rem; }
  .my-4 { margin: 1rem 0; }

  .badge.xp { color: var(--gold, #fbbf24); border-color: var(--gold, #fbbf24); }
  .kicker { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--cyan, #22d3ee); font-weight: bold; }
  .sub-kicker { font-size: 0.75rem; color: #94a3b8; margin-top: 0.25rem; }
  .italic-hint { font-style: italic; color: #cbd5e1; margin: 0.4rem 0; }

  /* OPTIONS DARK UI (STYLE ARCADE CONSERVÉ) */
  .dark-option {
    background: #172033;
    border: 2px solid #2e3e65;
    border-radius: 0.75rem;
    padding: 1rem;
    color: #f1f5f9;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .dark-option:hover { border-color: #22d3ee; }
  .dark-option.selected { background: #0e3f47; border-color: #22d3ee; box-shadow: 0 0 12px rgba(34, 211, 238, 0.25); }

  .play-zone .dark-option { min-height: 120px; }
  .xl-mode .play-zone .dark-option { min-height: 160px; font-size: 1.15rem; }

  .tools-floating { position: absolute; top: 1rem; right: 1rem; display: flex; gap: 0.5rem; z-index: 10; }
  .tool-btn { width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 1px solid; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .tool-btn.hidden { display: none; }
  .tool-btn.audio { background: #3b0764; border-color: #9333ea; color: #d8b4fe; }
  .tool-btn.hint { background: #422006; border-color: #d97706; color: #fcd34d; }
  .tool-btn.radar { background: #083344; border-color: #0891b2; color: #67e8f9; }

  .feedback-panel { margin-top: 1rem; padding: 1rem; border-radius: 0.75rem; text-align: center; }
  .error-state .feedback-panel { background: rgba(159, 18, 57, 0.2); border: 1px solid #e11d48; }
  .success-state .feedback-panel { background: rgba(6, 78, 59, 0.2); border: 1px solid #10b981; }
  .feedback-title { font-weight: 900; margin-bottom: 0.5rem; }
  .feedback-title.bad { color: #f43f5e; }
  .feedback-title.good { color: #34d399; }
  .feedback-details { font-size: 0.875rem; color: #cbd5e1; line-height: 1.4; }

  .score-display { display: flex; gap: 2rem; justify-content: center; margin: 1.5rem 0; }
  .score-box { background: #090d16; border: 1px solid #24324f; padding: 1.25rem; border-radius: 1rem; min-width: 8rem; }
  .score-box .score { font-size: 2.25rem; font-weight: 900; margin-top: 0.5rem; }
  .score-box .score.xp { color: var(--gold, #fbbf24); }

  /* CASED VECTORIELLES ET RENDU SVG 2.5D */
  .shape-box {
    background: #05070f; border: 1px solid #1e293b; border-radius: 0.5rem;
    display: flex; align-items: center; justify-content: center;
    width: 75px; height: 75px; box-sizing: border-box; overflow: hidden; position: relative;
  }
  .shape-box.huge { width: 170px; height: 170px; }

  :global(.svg-icon) { width: 85%; height: 85%; color: #22d3ee; }
  :global(.svg-icon-huge) { width: 90%; height: 90%; color: #fbbf24; }

  /* MODALS */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(2, 6, 23, 0.85); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem; }
  .modal-content { background: #0f1524; border: 1px solid #3b82f6; border-radius: 1rem; padding: 1.5rem; max-width: 100%; max-height: 90vh; overflow-y: auto; }
  .radar-modal { width: 24rem; border-color: #06b6d4; }
  .aide-modal { width: 56rem; }
  .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 1rem; margin-bottom: 1rem; }
  .modal-header button { background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; }

  .aide-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr)); gap: 1rem; }
  .aide-card { background: #090d16; border: 1px solid #1e293b; border-radius: 0.75rem; padding: 1rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  .aide-card span { font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: #e2e8f0; }
  .aide-card p { font-size: 0.7rem; color: #94a3b8; }
</style>