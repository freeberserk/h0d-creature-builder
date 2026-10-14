const MODULE_ID = "h0d-creature-builder";
const MODULE_VERSION = "0.2.2";
const ROOT_FOLDER = "H0D — Faune générée";
const SOURCE_BIOME = "Dent d’Ambre";
const SOURCE_DATASET = "Faune_Dent_d_Ambre_Foundry-1.pdf";

/*
 * v0.2.0 = biome Dent d’Ambre intégré.
 * Les profils naturels et mutés viennent de la fiche Foundry validée.
 *
 * Définition de créature attendue :
 * {
 *   key, label, img?,
 *   actor: { props: { ...clés H0D_Creature_* } },
 *   weapons?: [{key,name,img?,props:{...H0D_Arme_*}}],
 *   armor?:   [{key,name,img?,props:{...H0D_Armure_*}}],
 *   objects?: [{key,name,img?,props:{...H0D_Objet_*}}],
 *   resources?: [{key,name,img?,props:{...H0D_Ressource_*}}],
 *   modifiers?: [{key,name,img?,props:{...H0D_CM_*}}],
 *   defaultMutations?: ["mutation-key", ...]
 * }
 *
 * Mutation attendue :
 * { key, label, img?, props:{...H0D_CM_*} }
 */

const CREATURES = new Map();
const MUTATIONS = new Map();

const TEMPLATE_KEYS = {
  actor: "actor-creature",
  weapon: "item-arme",
  armor: "item-armure",
  object: "item-objet",
  resource: "item-ressource",
  modifier: "item-modificateur"
};

function clone(v) { return foundry.utils.deepClone(v); }
function esc(v) { return foundry.utils.escapeHTML(String(v ?? "")); }
function notify(type, msg) { ui.notifications?.[type]?.(msg); }

function tmApi() {
  const mod = game.modules?.get("h0d-template-manager");
  return mod?.active && mod.api ? mod.api : null;
}
function template(key) {
  try { return tmApi()?.getTemplate?.(key) ?? null; }
  catch (err) { console.warn(`${MODULE_ID} | template ${key}`, err); return null; }
}
function templateVersion(t) { return Number(t?.system?.templateSystemUniqueVersion ?? 0); }

function templateState() {
  const api = tmApi();
  if (!api) return {ok:false, message:"H0D Template Manager v0.3.0+ est requis."};
  const actor = template(TEMPLATE_KEYS.actor);
  const modifier = template(TEMPLATE_KEYS.modifier);
  if (!actor || !modifier) return {ok:false, message:"Template Créature ou Modificateur introuvable."};
  return {ok:true, message:`${actor.name} · ${modifier.name}`};
}

function normalizeEntry(entry) {
  if (!entry?.key || !entry?.name) throw new Error("Entrée générée invalide : key et name requis.");
  return clone(entry);
}
function normalizeCreature(def) {
  if (!def?.key || !def?.label) throw new Error("Créature invalide : key et label requis.");
  const out = clone(def);
  out.actor ??= {};
  out.actor.props ??= {};
  out.weapons = (out.weapons ?? []).map(normalizeEntry);
  out.armor = (out.armor ?? []).map(normalizeEntry);
  out.objects = (out.objects ?? []).map(normalizeEntry);
  out.resources = (out.resources ?? []).map(normalizeEntry);
  out.modifiers = (out.modifiers ?? []).map(normalizeEntry);
  out.defaultMutations ??= [];
  return out;
}
function normalizeMutation(def) {
  if (!def?.key || !def?.label) throw new Error("Mutation invalide : key et label requis.");
  return clone(def);
}

function registerCreature(def) {
  const value = normalizeCreature(def);
  CREATURES.set(value.key, value);
  return value;
}
function registerCreatures(defs=[]) { return defs.map(registerCreature); }
function registerMutation(def) {
  const value = normalizeMutation(def);
  MUTATIONS.set(value.key, value);
  return value;
}
function registerMutations(defs=[]) { return defs.map(registerMutation); }

const DENT_AMBRE_MUTATIONS = [
  {
    "key": "rat-glande-infectieuse",
    "label": "Glande infectieuse",
    "props": {
      "H0D_CM_Type": "Mutation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "1",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Mutation / toxine (Gorge). Si détruit : Morsure infectieuse devient morsure simple.",
      "H0D_CM_Notes": "Créature source : Rat pâle contaminé | PV composant : 1 | DEF composant : 9 | +PV : 1 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Rat pâle contaminé",
      "sourceType": "Mutation / toxine",
      "emplacement": "Gorge",
      "pv": 1,
      "def": 9,
      "bonusPV": 1,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Morsure infectieuse devient morsure simple."
    }
  },
  {
    "key": "rat-crocs-jaunis",
    "label": "Crocs jaunis",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "1",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Arme naturelle (Gueule). Si détruit : Dégâts réduits à 1.",
      "H0D_CM_Notes": "Créature source : Rat pâle contaminé | PV composant : 1 | DEF composant : 9 | +PV : 1 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Rat pâle contaminé",
      "sourceType": "Arme naturelle",
      "emplacement": "Gueule",
      "pv": 1,
      "def": 9,
      "bonusPV": 1,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Dégâts réduits à 1."
    }
  },
  {
    "key": "serpent-glande-venin-rouge",
    "label": "Glande à venin rouge",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "2",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Toxine (Tête). Si détruit : Plus de poison, morsure simple 1d4.",
      "H0D_CM_Notes": "Créature source : Serpent à venin rouge | PV composant : 2 | DEF composant : 11 | +PV : 2 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Serpent à venin rouge",
      "sourceType": "Toxine",
      "emplacement": "Tête",
      "pv": 2,
      "def": 11,
      "bonusPV": 2,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Plus de poison, morsure simple 1d4."
    }
  },
  {
    "key": "serpent-ecailles-durcies",
    "label": "Écailles durcies",
    "props": {
      "H0D_CM_Type": "Adaptation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "2",
      "H0D_CM_Bonus_DEF": "1",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Protection (Corps). Si détruit : Perte du +1 DEF.",
      "H0D_CM_Notes": "Créature source : Serpent à venin rouge | PV composant : 2 | DEF composant : 11 | +PV : 2 | +DEF : 1 | Dét./Destr. : Non | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Serpent à venin rouge",
      "sourceType": "Protection",
      "emplacement": "Corps",
      "pv": 2,
      "def": 11,
      "bonusPV": 2,
      "bonusDEF": 1,
      "detachDestruct": "Non",
      "countPV": true,
      "destroyedEffect": "Perte du +1 DEF."
    }
  },
  {
    "key": "chien-nodule-nerveux-blanc",
    "label": "Nodule nerveux blanc",
    "props": {
      "H0D_CM_Type": "Mutation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "2",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Mutation / signal (Nuque). Si détruit : Perd la frénésie signal.",
      "H0D_CM_Notes": "Créature source : Chien sauvage brouillé | PV composant : 2 | DEF composant : 10 | +PV : 2 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Chien sauvage brouillé",
      "sourceType": "Mutation / signal",
      "emplacement": "Nuque",
      "pv": 2,
      "def": 10,
      "bonusPV": 2,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Perd la frénésie signal."
    }
  },
  {
    "key": "chien-machoire-deformee",
    "label": "Mâchoire déformée",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "2",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Arme naturelle (Gueule). Si détruit : Morsure réduite à 1d4+1.",
      "H0D_CM_Notes": "Créature source : Chien sauvage brouillé | PV composant : 2 | DEF composant : 10 | +PV : 2 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Chien sauvage brouillé",
      "sourceType": "Arme naturelle",
      "emplacement": "Gueule",
      "pv": 2,
      "def": 10,
      "bonusPV": 2,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Morsure réduite à 1d4+1."
    }
  },
  {
    "key": "chien-muscles-spasmodiques",
    "label": "Muscles spasmodiques",
    "props": {
      "H0D_CM_Type": "Adaptation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "2",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Mobilité (Pattes). Si détruit : Vitesse -3 m, ne bondit plus.",
      "H0D_CM_Notes": "Créature source : Chien sauvage brouillé | PV composant : 2 | DEF composant : 10 | +PV : 2 | +DEF : 0 | Dét./Destr. : Non | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Chien sauvage brouillé",
      "sourceType": "Mobilité",
      "emplacement": "Pattes",
      "pv": 2,
      "def": 10,
      "bonusPV": 2,
      "bonusDEF": 0,
      "detachDestruct": "Non",
      "countPV": true,
      "destroyedEffect": "Vitesse -3 m, ne bondit plus."
    }
  },
  {
    "key": "nuee-reine-pale",
    "label": "Reine pâle",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "4",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Cœur de nuée (Centre de la nuée). Si détruit : La nuée se disperse à mi-PV.",
      "H0D_CM_Notes": "Créature source : Nuée d’insectes blancs | PV composant : 4 | DEF composant : 13 | +PV : 4 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Nuée d’insectes blancs",
      "sourceType": "Cœur de nuée",
      "emplacement": "Centre de la nuée",
      "pv": 4,
      "def": 13,
      "bonusPV": 4,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "La nuée se disperse à mi-PV."
    }
  },
  {
    "key": "nuee-poches-toxiques",
    "label": "Poches toxiques",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "3",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Toxine (Corps multiples). Si détruit : Piqûres toxiques deviennent dégâts simples.",
      "H0D_CM_Notes": "Créature source : Nuée d’insectes blancs | PV composant : 3 | DEF composant : 13 | +PV : 3 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Nuée d’insectes blancs",
      "sourceType": "Toxine",
      "emplacement": "Corps multiples",
      "pv": 3,
      "def": 13,
      "bonusPV": 3,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Piqûres toxiques deviennent dégâts simples."
    }
  },
  {
    "key": "loup-implant-parasite",
    "label": "Implant parasite",
    "props": {
      "H0D_CM_Type": "Mutation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "3",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Signal / mutation (Crâne). Si détruit : Perd coordination anormale et immunité peur.",
      "H0D_CM_Notes": "Créature source : Loup à Focus parasité | PV composant : 3 | DEF composant : 12 | +PV : 3 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Loup à Focus parasité",
      "sourceType": "Signal / mutation",
      "emplacement": "Crâne",
      "pv": 3,
      "def": 12,
      "bonusPV": 3,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Perd coordination anormale et immunité peur."
    }
  },
  {
    "key": "loup-crocs-renforces",
    "label": "Crocs renforcés",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "2",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Arme naturelle (Gueule). Si détruit : Morsure réduite à 1d6+1.",
      "H0D_CM_Notes": "Créature source : Loup à Focus parasité | PV composant : 2 | DEF composant : 12 | +PV : 2 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Loup à Focus parasité",
      "sourceType": "Arme naturelle",
      "emplacement": "Gueule",
      "pv": 2,
      "def": 12,
      "bonusPV": 2,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Morsure réduite à 1d6+1."
    }
  },
  {
    "key": "loup-nerfs-blanchis",
    "label": "Nerfs blanchis",
    "props": {
      "H0D_CM_Type": "Adaptation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "2",
      "H0D_CM_Bonus_DEF": "1",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Mobilité (Échine). Si détruit : Perte du +1 DEF, vitesse -3 m.",
      "H0D_CM_Notes": "Créature source : Loup à Focus parasité | PV composant : 2 | DEF composant : 12 | +PV : 2 | +DEF : 1 | Dét./Destr. : Non | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Loup à Focus parasité",
      "sourceType": "Mobilité",
      "emplacement": "Échine",
      "pv": 2,
      "def": 12,
      "bonusPV": 2,
      "bonusDEF": 1,
      "detachDestruct": "Non",
      "countPV": true,
      "destroyedEffect": "Perte du +1 DEF, vitesse -3 m."
    }
  },
  {
    "key": "lynx-fourrure-cameleon",
    "label": "Fourrure caméléon pâle",
    "props": {
      "H0D_CM_Type": "Adaptation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "3",
      "H0D_CM_Bonus_DEF": "1",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Camouflage (Corps). Si détruit : Perte du +1 DEF, discrétion réduite.",
      "H0D_CM_Notes": "Créature source : Lynx pâle des falaises | PV composant : 3 | DEF composant : 13 | +PV : 3 | +DEF : 1 | Dét./Destr. : Non | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Lynx pâle des falaises",
      "sourceType": "Camouflage",
      "emplacement": "Corps",
      "pv": 3,
      "def": 13,
      "bonusPV": 3,
      "bonusDEF": 1,
      "detachDestruct": "Non",
      "countPV": true,
      "destroyedEffect": "Perte du +1 DEF, discrétion réduite."
    }
  },
  {
    "key": "lynx-griffes-allongees",
    "label": "Griffes allongées",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "3",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Arme naturelle (Pattes avant). Si détruit : Bond + griffes réduit à 1d8+1.",
      "H0D_CM_Notes": "Créature source : Lynx pâle des falaises | PV composant : 3 | DEF composant : 13 | +PV : 3 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Lynx pâle des falaises",
      "sourceType": "Arme naturelle",
      "emplacement": "Pattes avant",
      "pv": 3,
      "def": 13,
      "bonusPV": 3,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Bond + griffes réduit à 1d8+1."
    }
  },
  {
    "key": "lynx-yeux-laiteux",
    "label": "Yeux laiteux",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "2",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Capteur (Tête). Si détruit : Perception -4, embuscade moins fiable.",
      "H0D_CM_Notes": "Créature source : Lynx pâle des falaises | PV composant : 2 | DEF composant : 13 | +PV : 2 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Lynx pâle des falaises",
      "sourceType": "Capteur",
      "emplacement": "Tête",
      "pv": 2,
      "def": 13,
      "bonusPV": 2,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Perception -4, embuscade moins fiable."
    }
  },
  {
    "key": "cervide-bois-cristallises",
    "label": "Bois cristallisés",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "4",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Arme naturelle (Tête). Si détruit : Charge réduite à 1d8+1.",
      "H0D_CM_Notes": "Créature source : Grand cervidé marqué | PV composant : 4 | DEF composant : 13 | +PV : 4 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Grand cervidé marqué",
      "sourceType": "Arme naturelle",
      "emplacement": "Tête",
      "pv": 4,
      "def": 13,
      "bonusPV": 4,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Charge réduite à 1d8+1."
    }
  },
  {
    "key": "cervide-marque-gaia",
    "label": "Marque GAIA luminescente",
    "props": {
      "H0D_CM_Type": "Mutation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "3",
      "H0D_CM_Bonus_DEF": "1",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Signal / mutation (Flanc). Si détruit : Perte du +1 DEF, comportement redevient animal.",
      "H0D_CM_Notes": "Créature source : Grand cervidé marqué | PV composant : 3 | DEF composant : 13 | +PV : 3 | +DEF : 1 | Dét./Destr. : Non | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Grand cervidé marqué",
      "sourceType": "Signal / mutation",
      "emplacement": "Flanc",
      "pv": 3,
      "def": 13,
      "bonusPV": 3,
      "bonusDEF": 1,
      "detachDestruct": "Non",
      "countPV": true,
      "destroyedEffect": "Perte du +1 DEF, comportement redevient animal."
    }
  },
  {
    "key": "cervide-tendons-renforces",
    "label": "Tendons renforcés",
    "props": {
      "H0D_CM_Type": "Adaptation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "3",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Mobilité (Pattes). Si détruit : Vitesse -3 m, charge impossible.",
      "H0D_CM_Notes": "Créature source : Grand cervidé marqué | PV composant : 3 | DEF composant : 13 | +PV : 3 | +DEF : 0 | Dét./Destr. : Non | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Grand cervidé marqué",
      "sourceType": "Mobilité",
      "emplacement": "Pattes",
      "pv": 3,
      "def": 13,
      "bonusPV": 3,
      "bonusDEF": 0,
      "detachDestruct": "Non",
      "countPV": true,
      "destroyedEffect": "Vitesse -3 m, charge impossible."
    }
  },
  {
    "key": "ours-plaques-osseuses",
    "label": "Plaques osseuses",
    "props": {
      "H0D_CM_Type": "Adaptation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "8",
      "H0D_CM_Bonus_DEF": "1",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Protection (Dos / épaules). Si détruit : Perte du +1 DEF.",
      "H0D_CM_Notes": "Créature source : Ours ancien mutant | PV composant : 8 | DEF composant : 13 | +PV : 8 | +DEF : 1 | Dét./Destr. : Non | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Ours ancien mutant",
      "sourceType": "Protection",
      "emplacement": "Dos / épaules",
      "pv": 8,
      "def": 13,
      "bonusPV": 8,
      "bonusDEF": 1,
      "detachDestruct": "Non",
      "countPV": true,
      "destroyedEffect": "Perte du +1 DEF."
    }
  },
  {
    "key": "ours-griffes-hypertrophiees",
    "label": "Griffes hypertrophiées",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "6",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Arme naturelle (Pattes avant). Si détruit : Griffes réduites à 2d6.",
      "H0D_CM_Notes": "Créature source : Ours ancien mutant | PV composant : 6 | DEF composant : 13 | +PV : 6 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Ours ancien mutant",
      "sourceType": "Arme naturelle",
      "emplacement": "Pattes avant",
      "pv": 6,
      "def": 13,
      "bonusPV": 6,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Griffes réduites à 2d6."
    }
  },
  {
    "key": "ours-glande-rage",
    "label": "Glande de rage",
    "props": {
      "H0D_CM_Type": "Mutation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "5",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Mutation (Poitrine). Si détruit : Perd frénésie / bonus d’attaque éventuel.",
      "H0D_CM_Notes": "Créature source : Ours ancien mutant | PV composant : 5 | DEF composant : 13 | +PV : 5 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Ours ancien mutant",
      "sourceType": "Mutation",
      "emplacement": "Poitrine",
      "pv": 5,
      "def": 13,
      "bonusPV": 5,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Perd frénésie / bonus d’attaque éventuel."
    }
  },
  {
    "key": "predateur-pattes-accroche",
    "label": "Pattes d’accroche",
    "props": {
      "H0D_CM_Type": "Adaptation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "5",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Mobilité (Membres). Si détruit : Ne grimpe plus correctement, bond rocheux impossible.",
      "H0D_CM_Notes": "Créature source : Prédateur des gorges | PV composant : 5 | DEF composant : 13 | +PV : 5 | +DEF : 0 | Dét./Destr. : Non | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Prédateur des gorges",
      "sourceType": "Mobilité",
      "emplacement": "Membres",
      "pv": 5,
      "def": 13,
      "bonusPV": 5,
      "bonusDEF": 0,
      "detachDestruct": "Non",
      "countPV": true,
      "destroyedEffect": "Ne grimpe plus correctement, bond rocheux impossible."
    }
  },
  {
    "key": "predateur-crete-sensorielle",
    "label": "Crête sensorielle",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "4",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Capteur (Tête / dos). Si détruit : Perception -4, embuscade moins fiable.",
      "H0D_CM_Notes": "Créature source : Prédateur des gorges | PV composant : 4 | DEF composant : 13 | +PV : 4 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Prédateur des gorges",
      "sourceType": "Capteur",
      "emplacement": "Tête / dos",
      "pv": 4,
      "def": 13,
      "bonusPV": 4,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Perception -4, embuscade moins fiable."
    }
  },
  {
    "key": "predateur-crocs-traction",
    "label": "Crocs de traction",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "5",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Arme naturelle (Gueule). Si détruit : Bond rocheux ne renverse plus.",
      "H0D_CM_Notes": "Créature source : Prédateur des gorges | PV composant : 5 | DEF composant : 13 | +PV : 5 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Prédateur des gorges",
      "sourceType": "Arme naturelle",
      "emplacement": "Gueule",
      "pv": 5,
      "def": 13,
      "bonusPV": 5,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Bond rocheux ne renverse plus."
    }
  },
  {
    "key": "alpha-cuirasse-organique",
    "label": "Cuirasse organique",
    "props": {
      "H0D_CM_Type": "Adaptation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "12",
      "H0D_CM_Bonus_DEF": "2",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Protection (Torse). Si détruit : Perte du +2 DEF, devient beaucoup plus vulnérable.",
      "H0D_CM_Notes": "Créature source : Bête alpha de biome | PV composant : 12 | DEF composant : 15 | +PV : 12 | +DEF : 2 | Dét./Destr. : Non | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Bête alpha de biome",
      "sourceType": "Protection",
      "emplacement": "Torse",
      "pv": 12,
      "def": 15,
      "bonusPV": 12,
      "bonusDEF": 2,
      "detachDestruct": "Non",
      "countPV": true,
      "destroyedEffect": "Perte du +2 DEF, devient beaucoup plus vulnérable."
    }
  },
  {
    "key": "alpha-arme-naturelle-dominante",
    "label": "Arme naturelle dominante",
    "props": {
      "H0D_CM_Type": "TraitBio",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "10",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Arme naturelle (Tête / griffes / bois). Si détruit : Attaque principale réduite d’un cran.",
      "H0D_CM_Notes": "Créature source : Bête alpha de biome | PV composant : 10 | DEF composant : 15 | +PV : 10 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Bête alpha de biome",
      "sourceType": "Arme naturelle",
      "emplacement": "Tête / griffes / bois",
      "pv": 10,
      "def": 15,
      "bonusPV": 10,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Attaque principale réduite d’un cran."
    }
  },
  {
    "key": "alpha-noyau-mutagene",
    "label": "Noyau mutagène",
    "props": {
      "H0D_CM_Type": "Mutation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "12",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Mutation (Poitrine / gorge). Si détruit : Perd aura, régénération ou effet spécial de biome.",
      "H0D_CM_Notes": "Créature source : Bête alpha de biome | PV composant : 12 | DEF composant : 15 | +PV : 12 | +DEF : 0 | Dét./Destr. : Oui | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Bête alpha de biome",
      "sourceType": "Mutation",
      "emplacement": "Poitrine / gorge",
      "pv": 12,
      "def": 15,
      "bonusPV": 12,
      "bonusDEF": 0,
      "detachDestruct": "Oui",
      "countPV": true,
      "destroyedEffect": "Perd aura, régénération ou effet spécial de biome."
    }
  },
  {
    "key": "alpha-membres-puissants",
    "label": "Membres puissants",
    "props": {
      "H0D_CM_Type": "Adaptation",
      "H0D_CM_Actif": true,
      "H0D_CM_Origine": "Faune mutée — Dent d’Ambre",
      "H0D_CM_Bonus_PV": "8",
      "H0D_CM_Bonus_DEF": "0",
      "H0D_CM_Bonus_Attaque": "0",
      "H0D_CM_Bonus_Degats": "0",
      "H0D_CM_Bonus_Initiative": "0",
      "H0D_CM_Bonus_Vitesse": "0",
      "H0D_CM_Bonus_Vigueur": "0",
      "H0D_CM_Bonus_Reflexes": "0",
      "H0D_CM_Bonus_Volonte": "0",
      "H0D_CM_Resistances": "",
      "H0D_CM_Faiblesses": "",
      "H0D_CM_Effet": "Composant biologique — Mobilité (Pattes). Si détruit : Vitesse -3 m, charge/bond impossible.",
      "H0D_CM_Notes": "Créature source : Bête alpha de biome | PV composant : 8 | DEF composant : 15 | +PV : 8 | +DEF : 0 | Dét./Destr. : Non | Compte PV : Oui."
    },
    "component": {
      "sourceCreature": "Bête alpha de biome",
      "sourceType": "Mobilité",
      "emplacement": "Pattes",
      "pv": 8,
      "def": 15,
      "bonusPV": 8,
      "bonusDEF": 0,
      "detachDestruct": "Non",
      "countPV": true,
      "destroyedEffect": "Vitesse -3 m, charge/bond impossible."
    }
  }
];

const DENT_AMBRE_CREATURES = [
  {
    "key": "petit-nuisible",
    "label": "Petit nuisible",
    "group": "Naturelles — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Naturelles",
    "sourceFinalPV": 2,
    "sourceFinalDEF": 7,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Petit nuisible",
        "H0D_Creature_Role": "Faune naturelle",
        "H0D_Creature_Menace": "0",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "2",
        "H0D_Creature_PV_Actuels": "2",
        "H0D_Creature_DEF_Base": "7",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "0",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "6",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {},
        "H0D_Creature_Notes": "Biome Foundry : Vallée / village / réserves.\nNotes Foundry : Rat, fouine, lézard. Ambiance, maladie mineure, bruit dans les réserves.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur."
      }
    },
    "weapons": [
      {
        "key": "petit-nuisible-attaque",
        "name": "Morsure",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "",
          "H0D_Arme_Notes": "Type d’attaque source : Morsure."
        }
      }
    ],
    "defaultMutations": []
  },
  {
    "key": "cerf-herbivore-rapide",
    "label": "Cerf / herbivore rapide",
    "group": "Naturelles — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Naturelles",
    "sourceFinalPV": 8,
    "sourceFinalDEF": 10,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Cerf / herbivore rapide",
        "H0D_Creature_Role": "Faune naturelle",
        "H0D_Creature_Menace": "1",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "8",
        "H0D_Creature_PV_Actuels": "8",
        "H0D_Creature_DEF_Base": "10",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "2",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "12",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {},
        "H0D_Creature_Notes": "Biome Foundry : Forêt claire / vallée.\nNotes Foundry : Source de nourriture, fuit presque toujours. Bon pour scènes de chasse.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur."
      }
    },
    "weapons": [
      {
        "key": "cerf-herbivore-rapide-attaque",
        "name": "Coup / fuite",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1d4+1",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "",
          "H0D_Arme_Notes": "Type d’attaque source : Coup / fuite."
        }
      }
    ],
    "defaultMutations": []
  },
  {
    "key": "chien-sauvage",
    "label": "Chien sauvage",
    "group": "Naturelles — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Naturelles",
    "sourceFinalPV": 6,
    "sourceFinalDEF": 9,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Chien sauvage",
        "H0D_Creature_Role": "Faune naturelle",
        "H0D_Creature_Menace": "1",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "6",
        "H0D_Creature_PV_Actuels": "6",
        "H0D_Creature_DEF_Base": "9",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "2",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "9",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {},
        "H0D_Creature_Notes": "Biome Foundry : Lisière / ruines proches.\nNotes Foundry : Menace faible en meute, traque les isolés.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur."
      }
    },
    "weapons": [
      {
        "key": "chien-sauvage-attaque",
        "name": "Morsure",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1d4+1",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "",
          "H0D_Arme_Notes": "Type d’attaque source : Morsure."
        }
      }
    ],
    "defaultMutations": []
  },
  {
    "key": "rapace-charognard",
    "label": "Rapace charognard",
    "group": "Naturelles — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Naturelles",
    "sourceFinalPV": 5,
    "sourceFinalDEF": 10,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Rapace charognard",
        "H0D_Creature_Role": "Faune naturelle",
        "H0D_Creature_Menace": "1",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "5",
        "H0D_Creature_PV_Actuels": "5",
        "H0D_Creature_DEF_Base": "10",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "3",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "3",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Vol",
            "H0D_Creature_Capacite_DD": "0",
            "H0D_Creature_Capacite_Effet": "Vitesse de vol : 15 m."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Falaises / aplombs rocheux.\nNotes Foundry : Attaque les blessés ou les carcasses, fuit vite.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur."
      }
    },
    "weapons": [
      {
        "key": "rapace-charognard-attaque",
        "name": "Serres",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1d4",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "",
          "H0D_Arme_Notes": "Type d’attaque source : Serres."
        }
      }
    ],
    "defaultMutations": []
  },
  {
    "key": "serpent-venimeux",
    "label": "Serpent venimeux",
    "group": "Naturelles — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Naturelles",
    "sourceFinalPV": 4,
    "sourceFinalDEF": 10,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Serpent venimeux",
        "H0D_Creature_Role": "Faune naturelle",
        "H0D_Creature_Menace": "1",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "4",
        "H0D_Creature_PV_Actuels": "4",
        "H0D_Creature_DEF_Base": "10",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "3",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "6",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Poison",
            "H0D_Creature_Capacite_DD": "11",
            "H0D_Creature_Capacite_Effet": "Vigueur DD 11."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Forêt claire / pierres chaudes.\nNotes Foundry : Piège naturel, pas combat frontal. Vigueur DD 11.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur."
      }
    },
    "weapons": [
      {
        "key": "serpent-venimeux-attaque",
        "name": "Morsure poison",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1d3",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "Vigueur DD 11.",
          "H0D_Arme_Notes": "Type d’attaque source : Morsure poison."
        }
      }
    ],
    "defaultMutations": []
  },
  {
    "key": "sanglier-territorial",
    "label": "Sanglier territorial",
    "group": "Naturelles — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Naturelles",
    "sourceFinalPV": 14,
    "sourceFinalDEF": 10,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Sanglier territorial",
        "H0D_Creature_Role": "Faune naturelle",
        "H0D_Creature_Menace": "2",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "14",
        "H0D_Creature_PV_Actuels": "14",
        "H0D_Creature_DEF_Base": "10",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "4",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "9",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {},
        "H0D_Creature_Notes": "Biome Foundry : Forêt / broussailles.\nNotes Foundry : Charge si acculé. Bon danger de chasse.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur."
      }
    },
    "weapons": [
      {
        "key": "sanglier-territorial-attaque",
        "name": "Défenses / charge",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1d6+1",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "",
          "H0D_Arme_Notes": "Type d’attaque source : Défenses / charge."
        }
      }
    ],
    "defaultMutations": []
  },
  {
    "key": "loup-solitaire",
    "label": "Loup solitaire",
    "group": "Naturelles — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Naturelles",
    "sourceFinalPV": 12,
    "sourceFinalDEF": 11,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Loup solitaire",
        "H0D_Creature_Role": "Faune naturelle",
        "H0D_Creature_Menace": "2",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "12",
        "H0D_Creature_PV_Actuels": "12",
        "H0D_Creature_DEF_Base": "11",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "4",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "12",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {},
        "H0D_Creature_Notes": "Biome Foundry : Forêt / gorges proches.\nNotes Foundry : Traque, appelle parfois une meute.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur."
      }
    },
    "weapons": [
      {
        "key": "loup-solitaire-attaque",
        "name": "Morsure",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1d6+1",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "",
          "H0D_Arme_Notes": "Type d’attaque source : Morsure."
        }
      }
    ],
    "defaultMutations": []
  },
  {
    "key": "nuee-insectes",
    "label": "Nuée d’insectes",
    "group": "Naturelles — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Naturelles",
    "sourceFinalPV": 10,
    "sourceFinalDEF": 12,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Nuée d’insectes",
        "H0D_Creature_Role": "Faune naturelle",
        "H0D_Creature_Menace": "2",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "10",
        "H0D_Creature_PV_Actuels": "10",
        "H0D_Creature_DEF_Base": "12",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "0",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "6",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Nuée",
            "H0D_Creature_Capacite_DD": "0",
            "H0D_Creature_Capacite_Effet": "Piqûres : 1d4/round. Aucun bonus d’attaque chiffré n’est indiqué dans la fiche source."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Sous-bois / zone humide.\nNotes Foundry : Ignore terrain, feu utile. Danger d’ambiance ou bivouac.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur."
      }
    },
    "weapons": [
      {
        "key": "nuee-insectes-attaque",
        "name": "Piqûres",
        "props": {
          "H0D_Arme_Categorie": "speciale",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1d4",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "",
          "H0D_Arme_Notes": "Type d’attaque source : Piqûres. Aucun bonus d’attaque chiffré n’est fourni par la fiche source."
        }
      }
    ],
    "defaultMutations": []
  },
  {
    "key": "meute-loups",
    "label": "Meute de loups",
    "group": "Naturelles — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Naturelles",
    "sourceFinalPV": 28,
    "sourceFinalDEF": 11,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Meute de loups",
        "H0D_Creature_Role": "Faune naturelle",
        "H0D_Creature_Menace": "3",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "28",
        "H0D_Creature_PV_Actuels": "28",
        "H0D_Creature_DEF_Base": "11",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "5",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "12",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {},
        "H0D_Creature_Notes": "Biome Foundry : Forêt / vallée reculée.\nNotes Foundry : Profil groupe simplifié. Rencontre de survie.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur."
      }
    },
    "weapons": [
      {
        "key": "meute-loups-attaque",
        "name": "Morsures coordonnées",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "2d6",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "",
          "H0D_Arme_Notes": "Type d’attaque source : Morsures coordonnées."
        }
      }
    ],
    "defaultMutations": []
  },
  {
    "key": "lynx-felin-sauvage",
    "label": "Lynx / félin sauvage",
    "group": "Naturelles — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Naturelles",
    "sourceFinalPV": 20,
    "sourceFinalDEF": 12,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Lynx / félin sauvage",
        "H0D_Creature_Role": "Faune naturelle",
        "H0D_Creature_Menace": "3",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "20",
        "H0D_Creature_PV_Actuels": "20",
        "H0D_Creature_DEF_Base": "12",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "5",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "12",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {},
        "H0D_Creature_Notes": "Biome Foundry : Forêt / falaises.\nNotes Foundry : Prédateur furtif, embuscade courte.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur."
      }
    },
    "weapons": [
      {
        "key": "lynx-felin-sauvage-attaque",
        "name": "Bond + griffes",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1d8+1",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "",
          "H0D_Arme_Notes": "Type d’attaque source : Bond + griffes."
        }
      }
    ],
    "defaultMutations": []
  },
  {
    "key": "grand-cervide-alpha",
    "label": "Grand cervidé alpha",
    "group": "Naturelles — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Naturelles",
    "sourceFinalPV": 38,
    "sourceFinalDEF": 12,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Grand cervidé alpha",
        "H0D_Creature_Role": "Faune naturelle",
        "H0D_Creature_Menace": "4",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "38",
        "H0D_Creature_PV_Actuels": "38",
        "H0D_Creature_DEF_Base": "12",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "6",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "12",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {},
        "H0D_Creature_Notes": "Biome Foundry : Forêt GAIA / vallée sacrée.\nNotes Foundry : Faune sacrée, anomalie GAIA ou symbole de territoire.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur."
      }
    },
    "weapons": [
      {
        "key": "grand-cervide-alpha-attaque",
        "name": "Bois / charge",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "2d6+2",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "",
          "H0D_Arme_Notes": "Type d’attaque source : Bois / charge."
        }
      }
    ],
    "defaultMutations": []
  },
  {
    "key": "ours-brun",
    "label": "Ours brun",
    "group": "Naturelles — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Naturelles",
    "sourceFinalPV": 45,
    "sourceFinalDEF": 12,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Ours brun",
        "H0D_Creature_Role": "Faune naturelle",
        "H0D_Creature_Menace": "4",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "45",
        "H0D_Creature_PV_Actuels": "45",
        "H0D_Creature_DEF_Base": "12",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "6",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "9",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {},
        "H0D_Creature_Notes": "Biome Foundry : Forêt profonde / montagne proche.\nNotes Foundry : Brutalité, intimidation, évite le village sauf perturbation.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur."
      }
    },
    "weapons": [
      {
        "key": "ours-brun-attaque",
        "name": "Griffes / morsure",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "2d8",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "",
          "H0D_Arme_Notes": "Type d’attaque source : Griffes / morsure."
        }
      }
    ],
    "defaultMutations": []
  },
  {
    "key": "rat-pale-contamine",
    "label": "Rat pâle contaminé",
    "group": "Mutées / altérées — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Mutées / altérées",
    "sourceFinalPV": 5,
    "sourceFinalDEF": 9,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Rat pâle contaminé",
        "H0D_Creature_Role": "Faune mutée / altérée",
        "H0D_Creature_Menace": "1",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "3",
        "H0D_Creature_PV_Actuels": "5",
        "H0D_Creature_DEF_Base": "9",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "2",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "6",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Morsure infectieuse",
            "H0D_Creature_Capacite_DD": "11",
            "H0D_Creature_Capacite_Effet": "Vigueur DD 11."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Ruines sous la Dent / réserves.\nNotes Foundry : Petite nuisance, maladie légère.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur.\nLes améliorations biologiques listées dans la fiche sont générées comme modules H0D_Modificateur actifs. Leurs PV/DEF propres sont conservés dans les métadonnées et les notes du module."
      }
    },
    "weapons": [
      {
        "key": "rat-pale-contamine-attaque",
        "name": "Morsure infectieuse",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1d4",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune mutée — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "Vigueur DD 11.",
          "H0D_Arme_Notes": "Type d’attaque source : Morsure infectieuse."
        }
      }
    ],
    "defaultMutations": [
      "rat-glande-infectieuse",
      "rat-crocs-jaunis"
    ]
  },
  {
    "key": "serpent-venin-rouge",
    "label": "Serpent à venin rouge",
    "group": "Mutées / altérées — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Mutées / altérées",
    "sourceFinalPV": 8,
    "sourceFinalDEF": 11,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Serpent à venin rouge",
        "H0D_Creature_Role": "Faune mutée / altérée",
        "H0D_Creature_Menace": "2",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "4",
        "H0D_Creature_PV_Actuels": "8",
        "H0D_Creature_DEF_Base": "10",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "4",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "6",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Poison",
            "H0D_Creature_Capacite_DD": "12",
            "H0D_Creature_Capacite_Effet": "Vigueur DD 12."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Pierres chaudes / ancien conduit.\nNotes Foundry : Piège naturel plus dangereux.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur.\nLes améliorations biologiques listées dans la fiche sont générées comme modules H0D_Modificateur actifs. Leurs PV/DEF propres sont conservés dans les métadonnées et les notes du module."
      }
    },
    "weapons": [
      {
        "key": "serpent-venin-rouge-attaque",
        "name": "Morsure poison",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1d4",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune mutée — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "Vigueur DD 12.",
          "H0D_Arme_Notes": "Type d’attaque source : Morsure poison."
        }
      }
    ],
    "defaultMutations": [
      "serpent-glande-venin-rouge",
      "serpent-ecailles-durcies"
    ]
  },
  {
    "key": "chien-sauvage-brouille",
    "label": "Chien sauvage brouillé",
    "group": "Mutées / altérées — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Mutées / altérées",
    "sourceFinalPV": 12,
    "sourceFinalDEF": 10,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Chien sauvage brouillé",
        "H0D_Creature_Role": "Faune mutée / altérée",
        "H0D_Creature_Menace": "2",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "6",
        "H0D_Creature_PV_Actuels": "12",
        "H0D_Creature_DEF_Base": "10",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "4",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "9",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Frénésie signal",
            "H0D_Creature_Capacite_DD": "12",
            "H0D_Creature_Capacite_Effet": "Sag/Vol DD 12."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Lisière / ruines proches.\nNotes Foundry : Frénésie signal, attaque anormale.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur.\nLes améliorations biologiques listées dans la fiche sont générées comme modules H0D_Modificateur actifs. Leurs PV/DEF propres sont conservés dans les métadonnées et les notes du module."
      }
    },
    "weapons": [
      {
        "key": "chien-sauvage-brouille-attaque",
        "name": "Morsure frénétique",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1d6+1",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune mutée — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "Sag/Vol DD 12.",
          "H0D_Arme_Notes": "Type d’attaque source : Morsure frénétique."
        }
      }
    ],
    "defaultMutations": [
      "chien-nodule-nerveux-blanc",
      "chien-machoire-deformee",
      "chien-muscles-spasmodiques"
    ]
  },
  {
    "key": "nuee-insectes-blancs",
    "label": "Nuée d’insectes blancs",
    "group": "Mutées / altérées — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Mutées / altérées",
    "sourceFinalPV": 20,
    "sourceFinalDEF": 13,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Nuée d’insectes blancs",
        "H0D_Creature_Role": "Faune mutée / altérée",
        "H0D_Creature_Menace": "3",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "13",
        "H0D_Creature_PV_Actuels": "20",
        "H0D_Creature_DEF_Base": "13",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "0",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "6",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Piqûres toxiques",
            "H0D_Creature_Capacite_DD": "12",
            "H0D_Creature_Capacite_Effet": "Réflexes DD 12. Dégâts : 1d6/round."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Cavité humide / ruine ancienne.\nNotes Foundry : Danger de zone, feu très efficace.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur.\nLes améliorations biologiques listées dans la fiche sont générées comme modules H0D_Modificateur actifs. Leurs PV/DEF propres sont conservés dans les métadonnées et les notes du module."
      }
    },
    "weapons": [
      {
        "key": "nuee-insectes-blancs-attaque",
        "name": "Piqûres toxiques",
        "props": {
          "H0D_Arme_Categorie": "speciale",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "1d6",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune mutée — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "Réflexes DD 12. Dégâts : 1d6/round.",
          "H0D_Arme_Notes": "Type d’attaque source : Piqûres toxiques. Aucun bonus d’attaque chiffré n’est fourni par la fiche source."
        }
      }
    ],
    "defaultMutations": [
      "nuee-reine-pale",
      "nuee-poches-toxiques"
    ]
  },
  {
    "key": "loup-focus-parasite",
    "label": "Loup à Focus parasité",
    "group": "Mutées / altérées — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Mutées / altérées",
    "sourceFinalPV": 26,
    "sourceFinalDEF": 12,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Loup à Focus parasité",
        "H0D_Creature_Role": "Faune mutée / altérée",
        "H0D_Creature_Menace": "3",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "19",
        "H0D_Creature_PV_Actuels": "26",
        "H0D_Creature_DEF_Base": "11",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "5",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "12",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Comportement réseau",
            "H0D_Creature_Capacite_DD": "13",
            "H0D_Creature_Capacite_Effet": "Volonté DD 13."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Forêt / bordure de signal.\nNotes Foundry : Ignore parfois la peur, comportement réseau.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur.\nLes améliorations biologiques listées dans la fiche sont générées comme modules H0D_Modificateur actifs. Leurs PV/DEF propres sont conservés dans les métadonnées et les notes du module."
      }
    },
    "weapons": [
      {
        "key": "loup-focus-parasite-attaque",
        "name": "Morsure coordonnée",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "2d6",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune mutée — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "Volonté DD 13.",
          "H0D_Arme_Notes": "Type d’attaque source : Morsure coordonnée."
        }
      }
    ],
    "defaultMutations": [
      "loup-implant-parasite",
      "loup-crocs-renforces",
      "loup-nerfs-blanchis"
    ]
  },
  {
    "key": "lynx-pale-falaises",
    "label": "Lynx pâle des falaises",
    "group": "Mutées / altérées — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Mutées / altérées",
    "sourceFinalPV": 34,
    "sourceFinalDEF": 13,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Lynx pâle des falaises",
        "H0D_Creature_Role": "Faune mutée / altérée",
        "H0D_Creature_Menace": "4",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "26",
        "H0D_Creature_PV_Actuels": "34",
        "H0D_Creature_DEF_Base": "12",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "6",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "12",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Bond depuis la hauteur",
            "H0D_Creature_Capacite_DD": "13",
            "H0D_Creature_Capacite_Effet": "Réflexes DD 13."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Falaises / aplombs.\nNotes Foundry : Camouflage clair, attaque depuis hauteur.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur.\nLes améliorations biologiques listées dans la fiche sont générées comme modules H0D_Modificateur actifs. Leurs PV/DEF propres sont conservés dans les métadonnées et les notes du module."
      }
    },
    "weapons": [
      {
        "key": "lynx-pale-falaises-attaque",
        "name": "Bond + griffes",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "2d6",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune mutée — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "Réflexes DD 13.",
          "H0D_Arme_Notes": "Type d’attaque source : Bond + griffes."
        }
      }
    ],
    "defaultMutations": [
      "lynx-fourrure-cameleon",
      "lynx-griffes-allongees",
      "lynx-yeux-laiteux"
    ]
  },
  {
    "key": "grand-cervide-marque",
    "label": "Grand cervidé marqué",
    "group": "Mutées / altérées — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Mutées / altérées",
    "sourceFinalPV": 45,
    "sourceFinalDEF": 13,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Grand cervidé marqué",
        "H0D_Creature_Role": "Faune mutée / altérée",
        "H0D_Creature_Menace": "4",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "35",
        "H0D_Creature_PV_Actuels": "45",
        "H0D_Creature_DEF_Base": "12",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "6",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "12",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Charge",
            "H0D_Creature_Capacite_DD": "13",
            "H0D_Creature_Capacite_Effet": "Réflexes DD 13."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Clairière sacrée / forêt GAIA.\nNotes Foundry : Non agressif sauf profanation.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur.\nLes améliorations biologiques listées dans la fiche sont générées comme modules H0D_Modificateur actifs. Leurs PV/DEF propres sont conservés dans les métadonnées et les notes du module."
      }
    },
    "weapons": [
      {
        "key": "grand-cervide-marque-attaque",
        "name": "Bois / charge",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "2d6+2",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune mutée — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "Réflexes DD 13.",
          "H0D_Arme_Notes": "Type d’attaque source : Bois / charge."
        }
      }
    ],
    "defaultMutations": [
      "cervide-bois-cristallises",
      "cervide-marque-gaia",
      "cervide-tendons-renforces"
    ]
  },
  {
    "key": "ours-ancien-mutant",
    "label": "Ours ancien mutant",
    "group": "Mutées / altérées — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Mutées / altérées",
    "sourceFinalPV": 70,
    "sourceFinalDEF": 13,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Ours ancien mutant",
        "H0D_Creature_Role": "Faune mutée / altérée",
        "H0D_Creature_Menace": "5",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "51",
        "H0D_Creature_PV_Actuels": "70",
        "H0D_Creature_DEF_Base": "12",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "7",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "9",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Puissance mutante",
            "H0D_Creature_Capacite_DD": "14",
            "H0D_Creature_Capacite_Effet": "Vigueur DD 14."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Forêt profonde.\nNotes Foundry : Rencontre de survie majeure.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur.\nLes améliorations biologiques listées dans la fiche sont générées comme modules H0D_Modificateur actifs. Leurs PV/DEF propres sont conservés dans les métadonnées et les notes du module."
      }
    },
    "weapons": [
      {
        "key": "ours-ancien-mutant-attaque",
        "name": "Griffes lourdes",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "3d6+2",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune mutée — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "Vigueur DD 14.",
          "H0D_Arme_Notes": "Type d’attaque source : Griffes lourdes."
        }
      }
    ],
    "defaultMutations": [
      "ours-plaques-osseuses",
      "ours-griffes-hypertrophiees",
      "ours-glande-rage"
    ]
  },
  {
    "key": "predateur-gorges",
    "label": "Prédateur des gorges",
    "group": "Mutées / altérées — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Mutées / altérées",
    "sourceFinalPV": 60,
    "sourceFinalDEF": 13,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Prédateur des gorges",
        "H0D_Creature_Role": "Faune mutée / altérée",
        "H0D_Creature_Menace": "5",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "46",
        "H0D_Creature_PV_Actuels": "60",
        "H0D_Creature_DEF_Base": "13",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "7",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "12",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Bond rocheux",
            "H0D_Creature_Capacite_DD": "14",
            "H0D_Creature_Capacite_Effet": "Réflexes DD 14."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Gorges / rochers.\nNotes Foundry : Mini-boss naturel furtif.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur.\nLes améliorations biologiques listées dans la fiche sont générées comme modules H0D_Modificateur actifs. Leurs PV/DEF propres sont conservés dans les métadonnées et les notes du module."
      }
    },
    "weapons": [
      {
        "key": "predateur-gorges-attaque",
        "name": "Bond rocheux",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "3d6",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune mutée — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "Réflexes DD 14.",
          "H0D_Arme_Notes": "Type d’attaque source : Bond rocheux."
        }
      }
    ],
    "defaultMutations": [
      "predateur-pattes-accroche",
      "predateur-crete-sensorielle",
      "predateur-crocs-traction"
    ]
  },
  {
    "key": "bete-alpha-biome",
    "label": "Bête alpha de biome",
    "group": "Mutées / altérées — Dent d’Ambre",
    "biomeFolder": "Dent d’Ambre",
    "variantFolder": "Mutées / altérées",
    "sourceFinalPV": 120,
    "sourceFinalDEF": 15,
    "actor": {
      "props": {
        "H0D_Creature_Type": "Creature",
        "H0D_Creature_Profil": "Bête alpha de biome",
        "H0D_Creature_Role": "Faune mutée / altérée",
        "H0D_Creature_Menace": "7",
        "H0D_Creature_XP": "0",
        "H0D_Creature_Faction": "Independant",
        "H0D_Creature_Faction_Autre": "",
        "H0D_Creature_FOR_MOD": "0",
        "H0D_Creature_DEX_MOD": "0",
        "H0D_Creature_CON_MOD": "0",
        "H0D_Creature_INT_MOD": "0",
        "H0D_Creature_SAG_MOD": "0",
        "H0D_Creature_CHA_MOD": "0",
        "H0D_Creature_PV_Base": "78",
        "H0D_Creature_PV_Actuels": "120",
        "H0D_Creature_DEF_Base": "13",
        "H0D_Creature_DEF_Divers": "0",
        "H0D_Creature_Attaque_Base": "9",
        "H0D_Creature_Attaque_Divers": "0",
        "H0D_Creature_Degats_Divers": "0",
        "H0D_Creature_Initiative_Base": "0",
        "H0D_Creature_Initiative_Divers": "0",
        "H0D_Creature_Vitesse_Base": "9",
        "H0D_Creature_Vitesse_Divers": "0",
        "H0D_Creature_Vigueur_Base": "0",
        "H0D_Creature_Vigueur_Divers": "0",
        "H0D_Creature_Reflexes_Base": "0",
        "H0D_Creature_Reflexes_Divers": "0",
        "H0D_Creature_Volonte_Base": "0",
        "H0D_Creature_Volonte_Divers": "0",
        "H0D_Creature_Resistances": "",
        "H0D_Creature_Faiblesses": "",
        "H0D_Creature_Etat_Feu": "Aucun",
        "H0D_Creature_Etat_Gel": "Aucun",
        "H0D_Creature_Etat_Choc": "Aucun",
        "H0D_Creature_Etat_Acide": "Aucun",
        "H0D_Creature_Etats_Notes": "",
        "H0D_Creature_Aptitudes_Table": {},
        "H0D_Creature_Capacites_Table": {
          "0": {
            "H0D_Creature_Capacite_Nom": "Effet spécial de biome",
            "H0D_Creature_Capacite_DD": "15",
            "H0D_Creature_Capacite_Effet": "DD 15. Le type de sauvegarde n’est pas précisé dans la fiche source."
          },
          "1": {
            "H0D_Creature_Capacite_Nom": "Vitesse variable",
            "H0D_Creature_Capacite_DD": "0",
            "H0D_Creature_Capacite_Effet": "Vitesse indiquée par la fiche source : 9–12 m."
          }
        },
        "H0D_Creature_Notes": "Biome Foundry : Dent d’Ambre / anomalie majeure.\nNotes Foundry : Boss faune rare. Vitesse indiquée par la fiche source : 9–12 m.\nInitiative, sauvegardes, caractéristiques et XP ne sont pas chiffrés dans cette fiche source : laissés à 0 dans le générateur.\nLes améliorations biologiques listées dans la fiche sont générées comme modules H0D_Modificateur actifs. Leurs PV/DEF propres sont conservés dans les métadonnées et les notes du module."
      }
    },
    "weapons": [
      {
        "key": "bete-alpha-biome-attaque",
        "name": "Attaque naturelle",
        "props": {
          "H0D_Arme_Categorie": "melee",
          "H0D_Arme_Carac_Attaque": "aucune",
          "H0D_Arme_Carac_Degats": "aucune",
          "H0D_Arme_Bonus_Attaque": "0",
          "H0D_Arme_Degats": "4d8",
          "H0D_Arme_Bonus_Degats": "0",
          "H0D_Arme_Type_Degats": "Autre",
          "H0D_Arme_Portee": "0",
          "H0D_Arme_Mains": "1",
          "H0D_Arme_Critique_Seuil": "20",
          "H0D_Arme_Critique_Multiplicateur": "2",
          "H0D_Arme_Equipee": true,
          "H0D_Stockage": "PJ",
          "H0D_Arme_Active": true,
          "H0D_Arme_Encombrement": "0",
          "H0D_Arme_Zone": "",
          "H0D_Arme_Mode_Munition": "Aucune",
          "H0D_Arme_Type_Munition": "Fleche",
          "H0D_Arme_Consommation_Munition": "1",
          "H0D_Arme_Recharge": "",
          "H0D_Arme_Munitions": "0",
          "H0D_Arme_Munitions_Max": "0",
          "H0D_Arme_Element": "Aucun",
          "H0D_Arme_Origine": "Faune mutée — Dent d’Ambre",
          "H0D_Arme_Cout": "",
          "H0D_Arme_Traits_Table": {},
          "H0D_Arme_Effet_Special": "DD 15. Le type de sauvegarde n’est pas précisé dans la fiche source.",
          "H0D_Arme_Notes": "Type d’attaque source : Attaque naturelle."
        }
      }
    ],
    "defaultMutations": [
      "alpha-cuirasse-organique",
      "alpha-arme-naturelle-dominante",
      "alpha-noyau-mutagene",
      "alpha-membres-puissants"
    ]
  }
];

function seedDentAmbreData() {
  registerMutations(DENT_AMBRE_MUTATIONS);
  registerCreatures(DENT_AMBRE_CREATURES);
}
seedDentAmbreData();

async function ensureFolder(name, parent=null) {
  let f = game.folders?.find(x => x.type === "Actor" && x.name === name && String(x.folder?.id ?? x.folder ?? "") === String(parent ?? ""));
  if (!f) f = await Folder.create({name, type:"Actor", folder:parent});
  return f;
}

function systemFromTemplate(t) {
  const s = clone(t.system ?? {});
  s.template = t.id;
  s.templateSystemUniqueVersion = templateVersion(t);
  if (Object.prototype.hasOwnProperty.call(s, "uniqueId")) s.uniqueId = foundry.utils.randomID();
  return s;
}

async function forceTemplateAndProps(doc, t, props) {
  const base = clone(t.system ?? {});
  base.template = t.id;
  base.templateSystemUniqueVersion = templateVersion(t);
  if (Object.prototype.hasOwnProperty.call(base, "uniqueId")) base.uniqueId = doc.system?.uniqueId || foundry.utils.randomID();
  await doc.update({system:base});
  await doc.update({
    "system.template":t.id,
    "system.templateSystemUniqueVersion":templateVersion(t),
    "system.props":clone(props ?? {})
  });
}

function itemTemplateForKind(kind) {
  const key = TEMPLATE_KEYS[kind];
  return key ? template(key) : null;
}

function itemData(entry, kind, imgOverride=null) {
  const t = itemTemplateForKind(kind);
  if (!t) throw new Error(`Template ${kind} introuvable via H0D Template Manager.`);
  return {
    name:entry.name,
    type:"equippableItem",
    img:imgOverride || entry.img || t.img || "icons/svg/item-bag.svg",
    system:systemFromTemplate(t),
    flags:{[MODULE_ID]:{generated:true, kind, entryKey:entry.key, sourceTemplateId:t.id, ...(entry.component ? {bioComponent:clone(entry.component)} : {})}}
  };
}

function mutationToEntry(key) {
  const m = MUTATIONS.get(key);
  if (!m) throw new Error(`Mutation inconnue : ${key}`);
  return {key:m.key, name:m.label, img:m.img, props:clone(m.props ?? {}), component:clone(m.component ?? null)};
}

function assembledEntries(def, mutationKeys=[]) {
  const rows = [];
  for (const e of def.weapons ?? []) rows.push({kind:"weapon", entry:e});
  for (const e of def.armor ?? []) rows.push({kind:"armor", entry:e});
  for (const e of def.objects ?? []) rows.push({kind:"object", entry:e});
  for (const e of def.resources ?? []) rows.push({kind:"resource", entry:e});
  for (const e of def.modifiers ?? []) rows.push({kind:"modifier", entry:e});
  const allMutations = Array.from(new Set([...(def.defaultMutations ?? []), ...mutationKeys]));
  for (const key of allMutations) rows.push({kind:"modifier", entry:mutationToEntry(key)});
  return rows;
}

async function buildCreature(creatureKey, {mutationKeys=[], mode="update"}={}) {
  const state = templateState();
  if (!state.ok) throw new Error(state.message);
  const def = CREATURES.get(creatureKey);
  if (!def) throw new Error(`Créature non enregistrée : ${creatureKey}`);

  const actorTemplate = template(TEMPLATE_KEYS.actor);
  const root = await ensureFolder(ROOT_FOLDER);
  const biomeFolder = await ensureFolder(def.biomeFolder || SOURCE_BIOME, root.id);
  const variantFolder = await ensureFolder(def.variantFolder || "Autres", biomeFolder.id);
  const threat = Number(def.actor?.props?.H0D_Creature_Menace ?? 0);
  const threatFolder = await ensureFolder(`Menace ${threat}`, variantFolder.id);

  let actor = Array.from(game.actors ?? []).find(a =>
    a.getFlag(MODULE_ID,"generated") === true &&
    a.getFlag(MODULE_ID,"creatureKey") === creatureKey
  );

  if (actor && mode === "skip") return actor;
  if (actor && mode === "replace") { await actor.delete(); actor = null; }

  const oldImages = new Map();
  if (actor) {
    for (const i of actor.items ?? []) {
      if (i.getFlag(MODULE_ID,"generated") !== true) continue;
      oldImages.set(`${i.getFlag(MODULE_ID,"kind")}::${i.getFlag(MODULE_ID,"entryKey")}`, i.img);
    }
    const generated = Array.from(actor.items ?? []).filter(i => i.getFlag(MODULE_ID,"generated") === true);
    if (generated.length) await actor.deleteEmbeddedDocuments("Item", generated.map(i => i.id));
  }

  if (!actor) {
    const sys = systemFromTemplate(actorTemplate);
    const [created] = await Actor.implementation.createDocuments([{
      name:def.label,
      type:"character",
      img:def.img || actorTemplate.img || "systems/custom-system-builder/img/template-logo.svg",
      folder:threatFolder.id,
      system:sys,
      prototypeToken:{...clone(actorTemplate.prototypeToken ?? {}), name:def.label, actorLink:false},
      flags:{[MODULE_ID]:{generated:true, creatureKey, sourceTemplateId:actorTemplate.id, sourceDataset:SOURCE_DATASET, sourceGroup:def.group || ""}}
    }]);
    actor = created;
  }

  const props = {
    H0D_Creature_Type:"Creature",
    H0D_Creature_Faction:"Independant",
    ...clone(def.actor?.props ?? {})
  };
  await forceTemplateAndProps(actor, actorTemplate, props);
  await actor.update({
    name:def.label,
    folder:threatFolder.id,
    "prototypeToken.name":def.label,
    [`flags.${MODULE_ID}.generated`]:true,
    [`flags.${MODULE_ID}.creatureKey`]:creatureKey,
    [`flags.${MODULE_ID}.sourceDataset`]:SOURCE_DATASET,
    [`flags.${MODULE_ID}.sourceGroup`]:def.group || ""
  });

  const rows = assembledEntries(def, mutationKeys);
  const payload = rows.map(({kind,entry}) => {
    const sig = `${kind}::${entry.key}`;
    return itemData(entry, kind, oldImages.get(sig) ?? null);
  });
  const created = payload.length ? await actor.createEmbeddedDocuments("Item", payload) : [];
  for (let idx=0; idx<created.length; idx++) {
    const doc = created[idx];
    const row = rows[idx];
    const t = itemTemplateForKind(row.kind);
    await forceTemplateAndProps(doc, t, row.entry.props ?? {});
  }

  if (def.sourceFinalPV !== undefined) {
    await actor.update({"system.props.H0D_Creature_PV_Actuels": String(def.sourceFinalPV)});
  }

  return actor;
}

function optionRows(map, emptyLabel) {
  if (!map.size) return `<option value="">${esc(emptyLabel)}</option>`;
  const groups = new Map();
  for (const x of map.values()) {
    const group = x.group || "Autres";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(x);
  }
  let html = `<option value="">— Choisir —</option>`;
  for (const [group, values] of groups.entries()) {
    html += `<optgroup label="${esc(group)}">`;
    for (const x of values) {
      const n = Number(x.defaultMutations?.length || 0);
      html += `<option value="${esc(x.key)}">${esc(x.label)}${n ? ` — ${n} composant(s)` : ""}</option>`;
    }
    html += `</optgroup>`;
  }
  return html;
}

function mutationRows() {
  return `
    <p><strong>${MUTATIONS.size}</strong> composants biologiques validés sont intégrés.</p>
    <p style="opacity:.8">Les profils mutés reçoivent automatiquement les composants indiqués dans la fiche source. Les PV et DEF propres de chaque composant sont aussi conservés dans les métadonnées H0D pour une future gestion ciblable.</p>
  `;
}

/** Garde la fenêtre ouverte entre deux générations, tout en sérialisant les clics. */
async function h0dPersistentDialog(options,run) {
  const Dialog=foundry.applications.api.DialogV2;
  await Dialog.wait({
    window:options.window,
    content:options.content+
      '<div class="h0d-batch-controls" style="margin-top:10px;display:flex;gap:8px;align-items:center;">'+
      '<button type="button" data-h0d-batch-run><i class="fa-solid fa-gears"></i> Exécuter</button>'+
      '<small data-h0d-batch-status aria-live="polite">Prêt à générer plusieurs éléments.</small></div>',
    buttons:[{action:"close",label:"Fermer",icon:"fa-solid fa-xmark"}],
    rejectClose:false,
    render:(_event,dialog)=>{
      const root=dialog.element,button=root?.querySelector("[data-h0d-batch-run]"),
        status=root?.querySelector("[data-h0d-batch-status]");
      if(!button||!status||button.dataset.bound==="yes")return;
      button.dataset.bound="yes";
      let busy=false;
      button.addEventListener("click",async()=>{
        if(busy)return;
        const form=root.querySelector("form");
        if(!form)return;
        const input=Object.fromEntries(new FormData(form).entries());
        busy=true;button.disabled=true;
        const close=root.querySelector('[data-action="close"]');
        if(close)close.disabled=true;
        status.textContent="Opération en cours…";
        try{
          await run(input);
          status.textContent="Terminé. Tu peux générer un autre élément.";
        }catch(err){
          console.error("H0D | génération",err);
          status.textContent="Erreur : "+(err?.message??err);
          ui.notifications?.error("H0D : "+(err?.message??err));
        }finally{
          busy=false;button.disabled=false;
          if(close)close.disabled=false;
        }
      });
    }
  });
}


async function openBuilder() {
  if (!game.user?.isGM) return notify("warn", "H0D Creature Builder est réservé au MJ.");

  const state = templateState();

  await h0dPersistentDialog({
    window:{title:`H0D Creature Builder v${MODULE_VERSION}`},
    content: `
      <div class="h0d-creature-builder" style="display:flex;flex-direction:column;gap:10px;">
        <p><strong>Templates :</strong> ${state.ok ? "✅" : "❌"} ${esc(state.message)}</p>
        <p><strong>Biome intégré :</strong> Dent d’Ambre · ${CREATURES.size} profil(s) · ${MUTATIONS.size} composant(s) biologique(s).</p>

        <div class="form-group">
          <label>Profil de créature</label>
          <select name="creature">
            ${optionRows(CREATURES,"Aucune donnée bestiaire validée")}
          </select>
        </div>

        <div class="form-group">
          <label>Si l’Actor existe déjà</label>
          <select name="mode">
            <option value="update">Mettre à jour (conserve les images)</option>
            <option value="skip">Ignorer</option>
            <option value="replace">Recréer</option>
          </select>
        </div>

        <fieldset>
          <legend>Mutations / améliorations</legend>
          ${mutationRows()}
        </fieldset>

        <p style="opacity:.75">
          Les profils mutés reçoivent automatiquement leurs composants biologiques validés.
          Les valeurs non chiffrées dans la fiche source (initiative, sauvegardes, caractéristiques, XP)
          restent volontairement à 0.
        </p>
      </div>`,
  }, async result => {

  if (!result.creature) {
    notify("warn","Choisis d’abord un profil de créature.");
    return;
  }

  try {
    const actor = await buildCreature(
      String(result.creature),
      {mutationKeys:[], mode:String(result.mode || "update")}
    );
    actor.sheet?.render(true);
    notify("info",`Créature générée : ${actor.name}`);
  } catch (err) {
    console.error(`${MODULE_ID} | génération`, err);
    notify("error",`H0D Creature Builder : ${err?.message ?? err}`);
  }
  });
}

async function ensureLauncherMacro() {
  if (!game.user?.isGM) return;
  const name = "H0D — Générateur faune";
  const command = "game.h0dCreatureBuilder.open();";
  let macro = game.macros?.getName(name);

  if (macro) {
    const updates = {};
    if (macro.command !== command) updates.command = command;
    if (macro.type !== "script") updates.type = "script";
    if (Object.keys(updates).length) await macro.update(updates);
    return;
  }

  await Macro.create({
    name,
    type: "script",
    scope: "global",
    img: "icons/svg/gears.svg",
    command
  });
  notify("info", `${MODULE_ID} : macro de lancement créée.`);
}

Hooks.once("ready", async () => {
  const api = {
    open: openBuilder,
    buildCreature,
    registerCreature,
    registerCreatures,
    registerMutation,
    registerMutations,
    creatures: CREATURES,
    mutations: MUTATIONS,
    templateState,
    version: MODULE_VERSION
  };
  const mod = game.modules.get(MODULE_ID);
  if (mod) mod.api = api;
  game.h0dCreatureBuilder = api;

  await ensureLauncherMacro();

  if (game.user?.isGM) {
    console.log(`${MODULE_ID} | v${MODULE_VERSION} prêt — Dent d’Ambre : ${CREATURES.size} profils, ${MUTATIONS.size} composants biologiques.`);
  }
});
