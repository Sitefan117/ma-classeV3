# Prototype Convertigo — intégration rapide

## 1. Copier les fichiers

Dans `src/routes/convertigo/` :

- `components/WorldMap.svelte`
- `components/HouseInterior.svelte`
- `components/objects/Tree.svelte`
- `components/objects/Grass.svelte`
- `components/objects/Path.svelte`
- `components/objects/Water.svelte`
- `components/objects/Bridge.svelte`
- `components/objects/House.svelte`
- `data/worldMap.ts`

## 2. Remplacer l'ancien WorldMap

Le nouveau `WorldMap.svelte` conserve la logique de grille :

- 20 × 15 cases
- 36 px par case
- G/F/P/B/D = marchable
- T/H/W/N = bloqué
- mêmes coordonnées de portes
- ZQSD + WASD + flèches

Le graphisme n'est jamais utilisé pour calculer une collision.

## 3. Entrée dans une maison

Le `WorldMap` appelle déjà :

```ts
onEnterHouse(beltId)
```

Le parent peut donc simplement afficher `HouseInterior.svelte` lorsque `currentScreen` passe à `house`.

Exemple :

```svelte
<script lang="ts">
  import WorldMap from './components/WorldMap.svelte';
  import HouseInterior from './components/HouseInterior.svelte';

  let screen: 'map' | 'house' = 'map';
  let activeBelt = 'white';

  function enterHouse(beltId: string) {
    activeBelt = beltId;
    screen = 'house';
  }

  function exitHouse() {
    screen = 'map';
  }
</script>

{#if screen === 'map'}
  <WorldMap grade={selectedGrade} onEnterHouse={enterHouse} />
{:else}
  <HouseInterior beltId={activeBelt} onExit={exitHouse} />
{/if}
```

## 4. Point important

Le fichier `worldMap.ts` est volontairement la source de vérité pour les collisions.

Les composants visuels peuvent évoluer sans casser le déplacement.

À la prochaine étape, on pourra :

1. remplacer progressivement les objets SVG simples par des assets pixel-art plus riches ;
2. ajouter plusieurs variantes d'arbres, fleurs, maisons et chemins ;
3. améliorer le sprite du joueur ;
4. ajouter les interactions PNJ ;
5. ajouter une vraie transition carte → intérieur → carte ;
6. seulement ensuite travailler le polish général.

## Direction artistique v2
Les objets visuels ont été rapprochés d'un pixel-art RPG rétro 16-bit original : palette verte/crème/brune, contours nets, ombres en petits aplats, toits colorés par ceinture, eau et végétation plus détaillées. La logique de collision reste séparée du décor.
