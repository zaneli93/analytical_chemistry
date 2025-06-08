// src/data/reagents.ts
export const reagents = [
  /* ────── ÁCIDOS FORTES (monopróticos) ────── */

  { id: "hcl",   name: "Ácido Clorídrico",  type: "acid", strength: "strong", protons: 1 },
  { id: "hbr",   name: "Ácido Bromídrico",  type: "acid", strength: "strong", protons: 1 },
  { id: "hi",    name: "Ácido Iodídrico",   type: "acid", strength: "strong", protons: 1 },
  { id: "hno3",  name: "Ácido Nítrico",     type: "acid", strength: "strong", protons: 1 },
  { id: "hclo4", name: "Ácido Perclórico",  type: "acid", strength: "strong", protons: 1 },
    
  /* ────── BASES FORTES (monopróticas) ────── */
  { id: "naoh",  name: "Hidróxido de Sódio",     type: "base", strength: "strong", protons: 1 },
  { id: "koh",   name: "Hidróxido de Potássio",  type: "base", strength: "strong", protons: 1 },
  { id: "lioh",  name: "Hidróxido de Lítio",     type: "base", strength: "strong", protons: 1 },
  { id: "rboh",  name: "Hidróxido de Rubídio",   type: "base", strength: "strong", protons: 1 },
  { id: "csoh",  name: "Hidróxido de Césio",     type: "base", strength: "strong", protons: 1 },

  /* ────── ÁCIDOS FRACOS (monopróticos) ────── */
  { id: "ch3cooh", name: "Ácido Acético",   type: "acid", strength: "weak", protons: 1, Ka: 1.8e-5 },
  { id: "hf",      name: "Ácido Fluorídrico", type: "acid", strength: "weak", protons: 1, Ka: 6.6e-4 },

  /* ────── BASES FRACAS (monopróticas) ────── */
  { id: "nh3",    name: "Amônia (NH₃)",    type: "base", strength: "weak", protons: 1, Kb: 1.8e-5 },
  { id: "ch3nh2", name: "Metilamina",      type: "base", strength: "weak", protons: 1, Kb: 4.4e-4 }
] as const;