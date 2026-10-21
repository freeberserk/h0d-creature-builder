import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const src=await readFile(new URL("../scripts/h0d-creature-builder.js",import.meta.url),"utf8");

assert.match(src,/const MODULE_VERSION = "0\.3\.0"/);
assert.ok(src.includes("const CREATURE_TOKEN_SIZE_BY_CATEGORY"),"Table taille -> token absente");
assert.ok(src.includes('Grande:2'),"Grande doit produire un token 2x2");
assert.ok(src.includes('TresGrande:3'),"Très grande doit produire un token 3x3");
assert.ok(src.includes('Gigantesque:4'),"Gigantesque doit produire un token 4x4");
assert.ok(src.includes('Colossale:6'),"Colossale doit produire un token 6x6");

for (const [key,size] of [
  ["ours-brun","Grande"],
  ["grand-cervide-alpha","Grande"],
  ["nuee-insectes","Grande"],
  ["meute-loups","Grande"],
  ["ours-ancien-mutant","TresGrande"],
  ["predateur-gorges","Grande"],
  ["bete-alpha-biome","TresGrande"]
]) {
  assert.ok(src.includes('"'+key+'":"'+size+'"'),key+" : taille canonique absente ou incorrecte");
}

assert.ok(src.includes("H0D_Creature_Taille"),"Le Builder doit écrire H0D_Creature_Taille");
assert.ok(src.includes("tokenDimensionsForCreature"),"Résolution de taille token absente");
assert.ok(src.includes("applyCanonicalPrototypeTokenSize"),"Synchronisation du prototype absente");
assert.ok(src.includes("syncPlacedTokensToCanonicalSize"),"Synchronisation des tokens placés absente");
assert.ok(src.includes("syncSizeGeneratedCreatures"),"Synchronisation ciblée des tailles absente");
assert.ok(src.includes('data-h0d-sync-size'),"Bouton Synchroniser tailles existantes absent");
assert.ok(src.includes("syncSizes: syncSizeGeneratedCreatures"),"API syncSizes absente");
assert.ok(src.includes('"prototypeToken.width"'),"Largeur du prototype non mise à jour");
assert.ok(src.includes('"prototypeToken.height"'),"Hauteur du prototype non mise à jour");
assert.ok(src.includes('scene.updateEmbeddedDocuments("Token",updates)'),"Tokens de scène non redimensionnés");

assert.equal(/H0D_Creature_Menace[^\n]{0,120}(width|height)/.test(src),false,
  "La taille ne doit pas être calculée directement depuis la Menace");

console.log("Creature canonical size sync OK");
