# H0D Creature Builder

## v0.3.0 — Tailles canoniques de la faune

La taille de la faune est désormais indépendante du niveau de Menace. Chaque profil porte `H0D_Creature_Taille` et le Builder convertit cette taille en empreinte Foundry.

| Taille | Token |
| --- | ---: |
| Infime / Minuscule / Très petite / Petite / Moyenne | 1×1 |
| Grande | 2×2 |
| Très grande | 3×3 |
| Gigantesque | 4×4 |
| Colossale | 6×6 |

Les profils de groupe utilisent aussi une empreinte plus large : les nuées d'insectes et la meute de loups sont `Grande` (2×2).

Exemples canoniques :
- Ours brun : **Grande → 2×2**, comme l'empreinte du Dent de Scie.
- Grand cervidé alpha / marqué : **Grande → 2×2**.
- Prédateur des gorges : **Grande → 2×2**.
- Ours ancien mutant : **Très grande → 3×3**.
- Bête alpha de biome : **Très grande → 3×3**.

Le Builder met à jour le `prototypeToken.width/height` lors d'une création ou d'une mise à jour, puis redimensionne les tokens déjà placés dans les scènes. Un bouton **Synchroniser tailles existantes** permet d'appliquer seulement cette donnée aux Actors générés sans réinitialiser leurs PV, équipements ou états.

Un profil futur peut surcharger son empreinte avec `actor.tokenSize`, soit par un nombre carré, soit par `{width,height}`.

### Dépendance
H0D Template Manager **1.7.22+** est requis pour le template Créature / PNJ v1.27 et son champ `H0D_Creature_Taille`.

## v0.2.2 — Création de créatures en série

Fenêtre persistante après génération, avec sélections conservées, progression et protection contre les doubles clics. Par défaut les Actors existants sont conservés ; mise à jour et recréation sur confirmation uniquement.

**Mode d'emploi :** lancer la macro habituelle, choisir les données et cliquer sur **Générer / Exécuter**. La fenêtre demeure ouverte. Modifier la sélection et recommencer, puis cliquer sur **Fermer**. La création d'un Actor/item existant respecte le mode conservateur par défaut. Pour les actions modifiant des entrées existantes, une confirmation supplémentaire protège les personnalisations.


## v0.2.2 — Faune de la Dent d’Ambre

Cette version intègre le premier biome validé du bestiaire.

### Données incluses
- **12 créatures naturelles**
- **10 créatures mutées / altérées**
- **28 composants biologiques / améliorations mutées**
- niveaux de Menace **0 à 7**

Les profils sont rangés automatiquement :
`H0D — Faune générée / Dent d’Ambre / Naturelles ou Mutées / Menace X`

### Mutations
Les créatures mutées reçoivent automatiquement les composants biologiques indiqués par la fiche source.

Le template `H0D_Modificateur` gère immédiatement les contributions **+PV** et **+DEF**.  
Les données propres de chaque composant — PV, DEF, emplacement, Dét./Destr., effet si détruit — sont également enregistrées dans les flags du module pour ne pas perdre l’information et préparer une future gestion ciblable des composants biologiques.

### Fidélité aux données
Le PDF ne chiffre pas l’initiative, les sauvegardes, les caractéristiques ni l’XP de ces profils. Ces valeurs restent donc volontairement à **0** au lieu d’être inventées.

Pour le Rapace, le Builder conserve une vitesse de base de **3 m** et ajoute la capacité **Vol 15 m**.  
Pour la Bête alpha, la vitesse de base est **9 m** et la plage source **9–12 m** est conservée dans ses capacités/notes.

### Lancement
Macro automatique :
**H0D — Générateur faune**

Commande :
`game.h0dCreatureBuilder.open();`

### Dépendances
- Foundry VTT 14
- Custom System Builder 6.0.2+
- H0D Template Manager 0.3.0+

### Correctif 0.2.1
La fenêtre utilise désormais le même mécanisme de formulaire que H0D Machine Builder (`DialogV2.input`).
La sélection du profil et le bouton de génération fonctionnent donc correctement sous Foundry V14.
