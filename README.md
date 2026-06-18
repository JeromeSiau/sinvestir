# Simulateur crypto S'investir

Démo technique Next.js qui transpose la logique du simulateur crypto `sinvestir.fr` dans l'univers visuel de `simulateurs.sinvestir.fr`.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

Commandes utiles :

```bash
npm run test
npm run typecheck
npm run build
```

## Partis pris techniques

- **Next.js + React + TypeScript** : choix aligné avec la stack indiquée dans le brief et prêt pour Vercel.
- **Composant réutilisable** : le simulateur est isolé dans `components/CryptoSimulator.tsx`; la route `/embed` affiche une version compacte pensée pour un aperçu iframe.
- **Calcul séparé de l'UI** : `lib/simulation.ts` contient la logique de DCA, one-shot, prix moyen d'acquisition, capital final et performance.
- **Données robustes pour la démo** : `/api/prices` utilise Coinbase comme source live en EUR, puis bascule sur une série déterministe locale si l'API est indisponible.
- **Prix d'achat traçables** : le calendrier reprend le cours de clôture disponible à la date d'achat, ou le dernier cours précédent si la date exacte n'existe pas dans la série.
- **Tailwind CSS** : le simulateur cible utilise des classes utilitaires; cette démo reprend donc cette approche avec des tokens locaux (`blue-sky`, `blue-night`, `yellow`, etc.).
- **Habillage précis simulateurs.sinvestir.fr** : sidebar fixe avec réduction, liens de compte, logo SVG officiel, header qui part au scroll comme sur la suite, fond bleu depuis le haut droit, formulaire sous-ligné et cartes de résultats dans l'esprit de l'espace connecté.
- **Onglets comme la suite S'investir** : `Graphiques` affiche deux visualisations pleine largeur avec slider de période au-dessus des graphes, `Calendrier` détaille les achats DCA.
- **Chiffres clés fidèles au simulateur crypto source** : Investi, Acquis, Prix moyen d'acquisition, Capital final et Performance.

## Suggestions d'amélioration pour l'existant

- Ajouter un mode "comparer deux scénarios" dans un même écran : DCA mensuel vs hebdomadaire, ou Bitcoin vs Ethereum.
- Rendre les hypothèses partageables via URL afin de faciliter les échanges avec la communauté et le support.
- Ajouter un encart "frais de plateforme" et "fiscalité estimative" pour rapprocher le résultat du net investisseur.
- Prévoir un export image/PDF des résultats pour les simulateurs les plus utilisés.
- Centraliser un kit de composants simulateurs pour accélérer les prochains outils internes et publics.

## Angle différenciant du rendu

Pour sortir d'un simple copier-coller du simulateur source, la démo ajoute :

- deux graphes crypto avec séries proches du simulateur source : Capital / Investi / Acquis, puis Valeur / Gain-perte / Investi ;
- un calendrier des achats DCA, inspiré de l'onglet calendrier du simulateur d'intérêts composés ;
- une interface plus proche de l'espace connecté `simulateurs.sinvestir.fr` que de la landing publique ;
- une route `/embed` pour montrer que le composant peut être intégré proprement dans une page existante. La home et l'embed importent le même composant, ce qui évite toute divergence fonctionnelle.

## Références utilisées

- Simulateur source : https://sinvestir.fr/simulateur-crypto-monnaie/
- Standards visuels cibles : https://simulateurs.sinvestir.fr/
