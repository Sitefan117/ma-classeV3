import type { BeltContent, BeltId } from '../types/exercise';

export const belts: {
  id: BeltId;
  label: string;
  icon: string;
  color: string;
  short: string;
}[] = [
  { id: 'white', label: 'Ceinture blanche', icon: '⚪', color: '#f8fafc', short: 'Découvrir' },
  { id: 'yellow', label: 'Ceinture jaune', icon: '🟡', color: '#fde047', short: 'Construire' },
  { id: 'green', label: 'Ceinture verte', icon: '🟢', color: '#4ade80', short: 'Distinguer' },
  { id: 'blue', label: 'Ceinture bleue', icon: '🔵', color: '#38bdf8', short: 'Mesurer' },
  { id: 'black', label: 'Ceinture noire', icon: '⚫', color: '#334155', short: 'Maîtriser' }
];

const lengthTheory = {
  title: 'Le monde des longueurs',
  text: 'Pour comparer ou convertir une longueur, choisis une unité de référence. Dans le tableau km – hm – dam – m – dm – cm – mm, chaque déplacement d’une colonne correspond à un facteur 10.',
  audioText: 'Pour convertir une longueur, utilise le tableau des unités. À chaque colonne, on multiplie ou on divise par dix.',
  animation: 'length' as const
};

const areaTheory = {
  title: 'Aire et périmètre',
  text: 'Le périmètre mesure le contour. L’aire mesure la surface. Pour un rectangle, le périmètre se calcule en additionnant les côtés et l’aire en multipliant longueur par largeur.',
  audioText: 'Le périmètre mesure le contour. L’aire mesure la surface. Pour un rectangle, aire égale longueur multipliée par largeur.',
  animation: 'area' as const
};

const volumeTheory = {
  title: 'Capacités et volumes',
  text: 'Une capacité indique ce qu’un récipient peut contenir. Le volume mesure l’espace occupé. Pour un pavé droit, volume égale longueur multipliée par largeur multipliée par hauteur.',
  audioText: 'La capacité indique ce qu’un récipient peut contenir. Le volume mesure l’espace occupé. Pour un pavé droit, on multiplie longueur, largeur et hauteur.',
  animation: 'volume' as const
};

const massTheory = {
  title: 'Masses et durées',
  text: 'Pour comparer des masses ou des durées, choisis une unité commune. Les unités conventionnelles permettent de mesurer et d’ordonner précisément.',
  audioText: 'Pour comparer des masses ou des durées, choisis une unité commune puis compare les valeurs.',
  animation: 'mass' as const
};

const angleTheory = {
  title: 'Les angles',
  text: 'Un angle mesure une ouverture. On peut comparer deux angles directement ou utiliser une mesure en degrés.',
  audioText: 'Un angle mesure une ouverture. On peut comparer deux angles directement ou les mesurer en degrés.',
  animation: 'angle' as const
};

const pointTheory = {
  title: 'Construire avec des distances',
  text: 'Pour construire un point C à une distance a de A et à une distance b de B, utilise deux cercles : le premier centré sur A avec le rayon a, le second centré sur B avec le rayon b.',
  audioText: 'Pour construire le point C, trace un cercle autour de A avec le rayon a et un cercle autour de B avec le rayon b. Leur intersection donne C.',
  animation: 'point' as const
};

const conversion = (
  id: string,
  instruction: string,
  givenValue: number,
  givenUnit: string,
  targetUnit: string,
  expectedValue: number,
  hint: string,
  helpText: string
) => ({
  id, type: 'conversion' as const, instruction, givenValue, givenUnit, targetUnit,
  expectedValue, hint, helpText, audioText: instruction
});

export const content: BeltContent[] = [
  {
    grade: '7H', belt: 'white', title: 'Longueurs', zone: 'Vallée des mesures', icon: '📏', color: '#38bdf8',
    objectives: [
      'Je compare et j’ordonne des longueurs en mm, cm, dm, m et km.',
      'Je mesure et j’estime des longueurs, y compris des lignes brisées ou des périmètres.'
    ],
    theory: lengthTheory,
    flashCheck: {
      question: 'Combien de centimètres y a-t-il dans 1 mètre ?',
      audioText: 'Combien de centimètres y a-t-il dans un mètre ?',
      options: ['10 cm', '100 cm', '1000 cm'], expectedIndex: 1
    },
    exercises: [
      conversion('7w1', 'Convertis cette longueur.', 3, 'm', 'cm', 300, '1 m = 100 cm.', 'Dans le tableau, de m vers cm, avance de deux colonnes : ×100.'),
      conversion('7w2', 'Convertis cette longueur.', 2500, 'm', 'km', 2.5, '1 km = 1000 m.', 'De m vers km, recule de trois colonnes : ÷1000.'),
      { id:'7w3', type:'choice', instruction:'Quelle longueur est la plus réaliste pour un crayon ?', options:['18 mm','18 cm','18 m'], expected:'18 cm', hint:'Un crayon tient dans la main.', helpText:'Compare les trois ordres de grandeur.', audioText:'Quelle longueur est la plus réaliste pour un crayon ?' },
      { id:'7w4', type:'order', instruction:'Range de la plus petite à la plus grande.', items:['5 m','5 cm','5 km'], expectedOrder:['5 cm','5 m','5 km'], hint:'Compare les unités.', helpText:'Les centimètres sont plus petits que les mètres, eux-mêmes plus petits que les kilomètres.', audioText:'Range ces longueurs de la plus petite à la plus grande.' }
    ],
    boss: { name:'Le Géant des Longueurs', icon:'📏👹', intro:'Montre que tu sais comparer et convertir les longueurs.' }
  },
  {
    grade:'7H', belt:'yellow', title:'Périmètres et aires', zone:'Plaine des surfaces', icon:'▣', color:'#facc15',
    objectives:[
      'Je calcule le périmètre du carré ou du rectangle.',
      'Je compare, j’ordonne, je mesure et j’estime des aires.',
      'Je calcule l’aire du carré et du rectangle avec des mesures entières.'
    ],
    theory: areaTheory,
    flashCheck:{ question:'Quelle formule donne l’aire d’un rectangle ?', audioText:'Quelle formule donne l’aire d’un rectangle ?', options:['longueur + largeur','longueur × largeur','2 × longueur + largeur'], expectedIndex:1 },
    exercises:[
      {id:'7y1',type:'number',instruction:'Un rectangle mesure 8 cm sur 3 cm. Quelle est son aire ?',expectedValue:24,hint:'Aire = longueur × largeur.',helpText:'Multiplie 8 par 3.',audioText:'Un rectangle mesure huit centimètres sur trois centimètres. Quelle est son aire ?'},
      {id:'7y2',type:'number',instruction:'Un rectangle mesure 8 cm sur 3 cm. Quel est son périmètre ?',expectedValue:22,hint:'Additionne les quatre côtés.',helpText:'8 + 3 + 8 + 3.',audioText:'Un rectangle mesure huit centimètres sur trois centimètres. Quel est son périmètre ?'},
      {id:'7y3',type:'choice',instruction:'Une surface de 20 cm² est-elle plus grande qu’une surface de 15 cm² ?',options:['Oui','Non'],expected:'Oui',hint:'Compare les nombres.',helpText:'20 est plus grand que 15.',audioText:'Une surface de vingt centimètres carrés est-elle plus grande qu’une surface de quinze centimètres carrés ?'}
    ],
    boss:{name:'Le Gardien des Surfaces',icon:'▣👹',intro:'Attention : ne confonds pas le contour et la surface.'}
  },
  {
    grade:'7H', belt:'green', title:'Aire ou périmètre ?', zone:'Forêt des polygones', icon:'🌲', color:'#4ade80',
    objectives:['Je distingue l’aire du périmètre.','Je mesure le périmètre et l’aire de polygones.'],
    theory: areaTheory,
    flashCheck:{question:'Le périmètre mesure-t-il une surface ?',audioText:'Le périmètre mesure-t-il une surface ?',options:['Oui','Non'],expectedIndex:1},
    exercises:[
      {id:'7g1',type:'choice',instruction:'Je veux connaître la longueur du contour. Je cherche…',options:['l’aire','le périmètre'],expected:'le périmètre',hint:'Le contour fait le tour de la figure.',helpText:'Périmètre = contour.',audioText:'Je veux connaître la longueur du contour. Je cherche quoi ?'},
      {id:'7g2',type:'choice',instruction:'Je veux connaître la place occupée par une figure. Je cherche…',options:['l’aire','le périmètre'],expected:'l’aire',hint:'La surface correspond à l’intérieur.',helpText:'Aire = surface intérieure.',audioText:'Je veux connaître la place occupée par une figure. Je cherche quoi ?'},
      {id:'7g3',type:'number',instruction:'Un carré a un côté de 6 cm. Quel est son périmètre ?',expectedValue:24,hint:'Un carré possède quatre côtés égaux.',helpText:'6 × 4 = 24.',audioText:'Un carré a un côté de six centimètres. Quel est son périmètre ?'}
    ],
    boss:{name:'Le Polygone Gardien',icon:'🔷👹',intro:'Choisis correctement entre aire et périmètre.'}
  },
  {
    grade:'7H', belt:'blue', title:'Capacités et volumes', zone:'Lac des contenants', icon:'🧪', color:'#0ea5e9',
    objectives:['Je compare, j’ordonne, je mesure et j’estime des capacités.','Je compare et j’ordonne des pavés droits selon le volume par mesurage.'],
    theory: volumeTheory,
    flashCheck:{question:'Quel objet a généralement la plus grande capacité ?',audioText:'Quel objet a généralement la plus grande capacité ?',options:['Une tasse','Une bouteille de 1 litre','Une cuillère'],expectedIndex:1},
    exercises:[
      {id:'7b1',type:'choice',instruction:'Quelle capacité est la plus grande ?',options:['2 dl','1 l','5 cl'],expected:'1 l',hint:'1 l = 10 dl.',helpText:'Un litre contient dix décilitres.',audioText:'Quelle capacité est la plus grande : deux décilitres, un litre ou cinq centilitres ?'},
      {id:'7b2',type:'choice',instruction:'Quel pavé droit occupe le plus d’espace ?',options:['2 × 2 × 2','3 × 2 × 2','3 × 3 × 1'],expected:'3 × 2 × 2',hint:'Calcule chaque volume.',helpText:'Les volumes sont 8, 12 et 9 unités cubes.',audioText:'Quel pavé droit occupe le plus d’espace ?'},
      {id:'7b3',type:'number',instruction:'Calcule le volume : 4 × 3 × 2.',expectedValue:24,hint:'Multiplie les trois dimensions.',helpText:'4 × 3 = 12, puis 12 × 2 = 24.',audioText:'Calcule le volume de quatre fois trois fois deux.'}
    ],
    boss:{name:'Le Gardien du Volume',icon:'🧪👹',intro:'Mesure l’espace sans te faire piéger par les apparences.'}
  },
  {
    grade:'7H', belt:'black', title:'Masses, durées et angles', zone:'Montagne du temps', icon:'⏱️', color:'#475569',
    objectives:['Je compare, j’ordonne, je mesure et j’estime des masses.','Je compare, j’ordonne, je mesure et j’estime des durées.','Je compare et j’ordonne des angles par comparaison directe ou indirecte.'],
    theory: massTheory,
    flashCheck:{question:'Qu’est-ce qui est le plus lourd ?',audioText:'Qu’est-ce qui est le plus lourd ?',options:['500 g','1 kg','100 g'],expectedIndex:1},
    exercises:[
      {id:'7k1',type:'choice',instruction:'Quelle masse est la plus grande ?',options:['500 g','1 kg','750 g'],expected:'1 kg',hint:'1 kg = 1000 g.',helpText:'Compare les masses dans la même unité.',audioText:'Quelle masse est la plus grande ?'},
      {id:'7k2',type:'choice',instruction:'Quelle durée est la plus longue ?',options:['30 min','1 h','45 min'],expected:'1 h',hint:'1 h = 60 min.',helpText:'Convertis les heures en minutes.',audioText:'Quelle durée est la plus longue ?'},
      {id:'7k3',type:'choice',instruction:'Quel angle est le plus ouvert ?',options:['30°','60°','45°'],expected:'60°',hint:'Une plus grande mesure correspond à une plus grande ouverture.',helpText:'Compare les mesures en degrés.',audioText:'Quel angle est le plus ouvert ?'}
    ],
    boss:{name:'Le Maître des Grandeurs',icon:'⏱️👹',intro:'Dernière zone 7H : masses, durées et angles.'}
  },

  {
    grade:'8H', belt:'white', title:'Longueurs et construction', zone:'Vallée des mesures', icon:'📏', color:'#38bdf8',
    objectives:['Je compare, ordonne, mesure et estime des longueurs avec les unités conventionnelles.','Je calcule le périmètre du carré ou du rectangle.','Je construis un point C à une distance a de A et à une distance b de B.'],
    theory: pointTheory,
    flashCheck:{question:'Pour construire C à une distance donnée de A, quel outil est utile ?',audioText:'Pour construire C à une distance donnée de A, quel outil est utile ?',options:['Un compas','Une gomme','Une règle sans mesure'],expectedIndex:0},
    exercises:[
      conversion('8w1','Convertis cette longueur.',0.75,'km','m',750,'1 km = 1000 m.','Déplace-toi de km vers m : ×1000.'),
      {id:'8w2',type:'number',instruction:'Un rectangle mesure 7 cm sur 4 cm. Quel est son périmètre ?',expectedValue:22,hint:'Additionne les quatre côtés.',helpText:'7 + 4 + 7 + 4 = 22.',audioText:'Un rectangle mesure sept centimètres sur quatre centimètres. Quel est son périmètre ?'},
      {id:'8w3',type:'choice',instruction:'Pour construire C à distance a de A, je trace…',options:['un cercle centré en A','un carré centré en A','une droite au hasard'],expected:'un cercle centré en A',hint:'Tous les points à une même distance d’un point forment un cercle.',helpText:'Le cercle permet de garder une distance constante.',audioText:'Pour construire C à distance a de A, je trace quoi ?'}
    ],
    boss:{name:'Le Cartographe',icon:'🧭👹',intro:'Construis avec précision.'}
  },
  {
    grade:'8H', belt:'yellow', title:'Aires', zone:'Plaine des surfaces', icon:'▣', color:'#facc15',
    objectives:['Je compare, ordonne, mesure et estime des aires en cm², dm² et m².','Je calcule l’aire du carré et du rectangle avec des mesures entières.'],
    theory: areaTheory,
    flashCheck:{question:'Quelle unité convient pour la surface d’un cahier ?',audioText:'Quelle unité convient pour la surface d’un cahier ?',options:['cm²','m²','km²'],expectedIndex:0},
    exercises:[
      {id:'8y1',type:'number',instruction:'Calcule l’aire d’un rectangle de 9 cm sur 4 cm.',expectedValue:36,hint:'Aire = longueur × largeur.',helpText:'9 × 4 = 36 cm².',audioText:'Calcule l’aire d’un rectangle de neuf centimètres sur quatre centimètres.'},
      {id:'8y2',type:'choice',instruction:'Quelle surface est la plus grande ?',options:['1 m²','50 dm²','900 cm²'],expected:'1 m²',hint:'1 m² = 100 dm² = 10 000 cm².',helpText:'Convertis dans la même unité.',audioText:'Quelle surface est la plus grande ?'},
      {id:'8y3',type:'number',instruction:'Un carré a un côté de 5 cm. Quelle est son aire ?',expectedValue:25,hint:'Aire du carré = côté × côté.',helpText:'5 × 5 = 25 cm².',audioText:'Un carré a un côté de cinq centimètres. Quelle est son aire ?'}
    ],
    boss:{name:'Le Gardien des Aires',icon:'▣👹',intro:'Compare les surfaces et calcule sans confondre les unités.'}
  },
  {
    grade:'8H', belt:'green', title:'Capacités et volumes', zone:'Lac des contenants', icon:'🧪', color:'#4ade80',
    objectives:['Je compare, ordonne, mesure et estime des capacités en l et dl.','Je compare, ordonne, mesure et estime le volume de pavés droits.','Je calcule le volume du cube et du pavé droit.'],
    theory: volumeTheory,
    flashCheck:{question:'Combien de décilitres y a-t-il dans 1 litre ?',audioText:'Combien de décilitres y a-t-il dans un litre ?',options:['1 dl','10 dl','100 dl'],expectedIndex:1},
    exercises:[
      {id:'8g1',type:'number',instruction:'Combien de décilitres y a-t-il dans 3 litres ?',expectedValue:30,hint:'1 l = 10 dl.',helpText:'3 × 10 = 30 dl.',audioText:'Combien de décilitres y a-t-il dans trois litres ?'},
      {id:'8g2',type:'number',instruction:'Calcule le volume d’un pavé de 5 cm × 2 cm × 3 cm.',expectedValue:30,hint:'Multiplie les trois dimensions.',helpText:'5 × 2 × 3 = 30 cm³.',audioText:'Calcule le volume d’un pavé de cinq centimètres sur deux sur trois.'},
      {id:'8g3',type:'choice',instruction:'Quelle unité convient au volume d’un petit dé ?',options:['cm³','cm','kg'],expected:'cm³',hint:'Le volume mesure un espace en trois dimensions.',helpText:'Une unité cube correspond au volume.',audioText:'Quelle unité convient au volume d’un petit dé ?'}
    ],
    boss:{name:'Le Seigneur des Volumes',icon:'🧪👹',intro:'Maîtrise capacités et volumes.'}
  },
  {
    grade:'8H', belt:'blue', title:'Masses et durées', zone:'Montagne du temps', icon:'⚖️', color:'#38bdf8',
    objectives:['Je compare, ordonne, mesure et estime des masses en g, kg et t.','Je compare, ordonne, mesure et estime des durées en s, min et h.'],
    theory: massTheory,
    flashCheck:{question:'Combien de grammes y a-t-il dans 1 kg ?',audioText:'Combien de grammes y a-t-il dans un kilogramme ?',options:['10 g','100 g','1000 g'],expectedIndex:2},
    exercises:[
      {id:'8b1',type:'number',instruction:'Convertis 2 kg en grammes.',expectedValue:2000,hint:'1 kg = 1000 g.',helpText:'2 × 1000 = 2000 g.',audioText:'Convertis deux kilogrammes en grammes.'},
      {id:'8b2',type:'number',instruction:'Combien de minutes y a-t-il dans 2 heures ?',expectedValue:120,hint:'1 h = 60 min.',helpText:'2 × 60 = 120 minutes.',audioText:'Combien de minutes y a-t-il dans deux heures ?'},
      {id:'8b3',type:'choice',instruction:'Quelle durée est la plus courte ?',options:['90 s','2 min','1 min'],expected:'90 s',hint:'2 min = 120 s.',helpText:'Convertis en secondes.',audioText:'Quelle durée est la plus courte ?'}
    ],
    boss:{name:'Le Chronomaître',icon:'⏱️👹',intro:'Gère masses et durées avec précision.'}
  },
  {
    grade:'8H', belt:'black', title:'Angles', zone:'Sommet des angles', icon:'📐', color:'#334155',
    objectives:['Je compare, ordonne, mesure et estime des angles en degrés.'],
    theory: angleTheory,
    flashCheck:{question:'Combien mesure un angle droit ?',audioText:'Combien mesure un angle droit ?',options:['45°','90°','180°'],expectedIndex:1},
    exercises:[
      {id:'8k1',type:'choice',instruction:'Quel angle est le plus grand ?',options:['45°','90°','60°'],expected:'90°',hint:'Compare les nombres.',helpText:'90 est supérieur à 60 et 45.',audioText:'Quel angle est le plus grand ?'},
      {id:'8k2',type:'choice',instruction:'Quel angle est aigu ?',options:['30°','90°','120°'],expected:'30°',hint:'Un angle aigu est plus petit qu’un angle droit.',helpText:'30° est inférieur à 90°.',audioText:'Quel angle est aigu ?'},
      {id:'8k3',type:'number',instruction:'Combien mesure un angle droit ?',expectedValue:90,hint:'Pense au coin d’une feuille.',helpText:'Un angle droit mesure 90 degrés.',audioText:'Combien mesure un angle droit ?'}
    ],
    boss:{name:'Le Maître des Angles',icon:'📐👹',intro:'Mesure les ouvertures et termine le parcours 8H.'}
  }
];

export function getContent(grade: '7H' | '8H', belt: BeltId) {
  return content.find((item) => item.grade === grade && item.belt === belt);
}
