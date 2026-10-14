## 0.2.2 — Génération en série sans fermeture de fenêtre

- La fenêtre reste ouverte après une génération ; conserve le profil, le mode et les champs saisis pour une nouvelle opération.
- Bouton **Exécuter** dans le formulaire et bouton **Fermer** explicite ; protection contre les doubles clics et l'exécution simultanée.
- Affichage du résultat/erreur dans la fenêtre sans la fermer.
- Les actions **Mettre à jour** et **Recréer** restent disponibles sur confirmation ; création sans écrasement par défaut.
- Données et règles de génération inchangées. La fermeture du dialogue n'annule pas un document déjà créé.

# H0D Creature Builder

## v0.2.1 — Faune de la Dent d’Ambre

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
