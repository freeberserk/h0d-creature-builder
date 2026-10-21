import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const src=await readFile(new URL("../scripts/h0d-creature-builder.js", import.meta.url),"utf8");
assert.match(src,/const MODULE_VERSION = "0\.3\.0"/);
for(const key of ["H0D_Creature_Perception","H0D_Creature_Perception_Portee","H0D_Creature_Sens_Speciaux","H0D_Creature_Sens_Portee"])
  assert.ok(src.includes(key),"Champ absent : "+key);
for(const creature of ["chien-sauvage","loup-solitaire","rapace-charognard","predateur-gorges"])
  assert.ok(src.includes('"'+creature+'"'),"Profil PER absent : "+creature);
assert.ok(src.includes("syncPerceptionGeneratedCreatures"),"Synchronisation ciblée absente");
assert.ok(src.includes("data-h0d-sync-perception"),"Bouton de synchro absent");
console.log("Creature perception sync OK");
