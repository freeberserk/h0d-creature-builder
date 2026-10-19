## 0.2.3 — Perception, DET et sens de la faune

- Chaque profil de faune Dent d’Ambre reçoit une Perception, une portée normale et, si pertinent, un sens spécial avec sa portée.
- La DET reste calculée par le template Créature/PNJ v1.25 : `DET = 10 + PER`.
- Ajout d’un bouton **Synchroniser PER / DET existantes** qui ne modifie que les quatre champs de perception/sens des Actors générés.
- Aucun PV actuel, équipement, mutation, état ou modification de séance n’est réinitialisé.

# Changelog

## 0.2.2 — Création de créatures en série

- Fenêtre persistante après génération, avec sélections conservées, progression et protection contre les doubles clics. Par défaut les Actors existants sont conservés ; mise à jour et recréation sur confirmation uniquement.
- Aucun changement aux templates H0D ni aux règles de combat.



## 0.2.1
- Correction bloquante de la fenêtre de génération.
- Remplacement de `DialogV2.wait` par `DialogV2.input`, comme dans H0D Machine Builder.
- Le profil sélectionné est maintenant correctement renvoyé au Builder.
- Ajout du mode Mettre à jour / Ignorer / Recréer.
- Conservation des images personnalisées en mode Mettre à jour.
- Aucune modification des 22 profils ni des 28 composants biologiques validés.


## 0.2.0
- Intégration de la faune validée du biome de la Dent d’Ambre.
- 12 profils naturels.
- 10 profils mutés / altérés.
- 28 composants biologiques.
- Génération automatique des attaques naturelles via H0D_Arme.
- Génération des mutations via H0D_Modificateur.
- Les +PV et +DEF des composants alimentent les calculs du template Créature.
- Conservation des PV, DEF, emplacement, Dét./Destr. et effet de destruction des composants dans les métadonnées du module.
- Classement par biome, type de faune et niveau de Menace.
- Les données absentes de la source ne sont pas inventées.


## 0.1.1
- Suppression du bouton ajouté aux contrôles de scène.
- Création automatique d'une macro de lancement globale, sur le modèle de H0D Machine Builder.
- API globale `game.h0dCreatureBuilder` exposée pour la macro et les appels futurs.
- Aucune donnée bestiaire ajoutée ou modifiée.


## 0.1.0
- Création du socle H0D Creature Builder.
- Intégration obligatoire de H0D Template Manager v0.3.0+.
- Registres extensibles pour créatures et mutations.
- Assemblage préparé Actor + armes + armures + objets + ressources + modificateurs.
- Mutations représentées par le template canonique H0D_Modificateur.
- Conservation des images personnalisées.
- Aucune donnée bestiaire non validée incluse.
