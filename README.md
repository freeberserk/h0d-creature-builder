# H0D Creature Builder

## v0.1.0 — socle

Cette première version prépare le générateur de faune sans figer de statistiques non validées.

### Architecture
- Actor canonique : `actor-creature` via H0D Template Manager.
- Mutations / améliorations : `item-modificateur`.
- Attaques naturelles ou armes : `item-arme`.
- Support préparé pour armures, objets et ressources.
- Mise à jour en deux phases pour éviter l'écrasement des `system.props` par Custom System Builder.
- Conservation des images personnalisées lors d'une régénération.

### API
`game.modules.get("h0d-creature-builder").api`

Méthodes principales :
- `registerCreature(definition)`
- `registerMutation(definition)`
- `buildCreature(key, { mutationKeys, mode })`
- `open()`

Aucune créature n'est incluse dans la v0.1.0 : les données seront intégrées après validation dans le chantier Bestiaire.
