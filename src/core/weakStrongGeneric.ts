import type { reagents } from "@/data/reagents";

type Reagent = (typeof reagents)[number];

interface Params {
  analyte: Reagent;    // reagente no erlenmeyer (solução inicial)
  cAnalyte: number;    // concentração do analito (mol/L)
  vAnalyte: number;    // volume do analito (L)
  titrant: Reagent;    // reagente no titulador (bureta)
  cTitrant: number;    // concentração do titulante (mol/L)
  vTitrant: number;    // volume de titulante adicionado (L)
}

/**
 * Resolve o cúbico completo derivado dos balanços de carga e massa para um ácido fraco.
 * f(x) = x³ + Ka·x² − x·(Ka·F + Kw) − Ka·Kw
 * Usa Newton-Raphson iniciando pela solução da quadrática que ignora Kw.
 */
function solveCubicWeakAcid(F: number, Ka: number, tol = 1e-12): number {
  const Kw = 1e-14;
  const disc = Ka * Ka + 4 * Ka * F;
  let x = (-Ka + Math.sqrt(disc)) / 2;
  const f = (h: number) => h ** 3 + Ka * h ** 2 - h * (Ka * F + Kw) - Ka * Kw;
  const df = (h: number) => 3 * h ** 2 + 2 * Ka * h - (Ka * F + Kw);
  for (let i = 0; i < 40; i++) {
    const hNext = x - f(x) / df(x);
    if (Math.abs(hNext - x) < tol) return hNext;
    x = hNext;
  }
  return x;
}

/**
 * Resolve o cúbico análogo para uma base fraca.
 */
function solveCubicWeakBase(F: number, Kb: number, tol = 1e-12): number {
  const Kw = 1e-14;
  const disc = Kb * Kb + 4 * Kb * F;
  let y = (-Kb + Math.sqrt(disc)) / 2;
  const f = (o: number) => o ** 3 + Kb * o ** 2 - o * (Kb * F + Kw) - Kb * Kw;
  const df = (o: number) => 3 * o ** 2 + 2 * Kb * o - (Kb * F + Kw);
  for (let i = 0; i < 40; i++) {
    const next = y - f(y) / df(y);
    if (Math.abs(next - y) < tol) return next;
    y = next;
  }
  return y;
}

/**
 * Calcula o pH para titulação ácido fraco × base forte (genérico para ácido ou base fracos).
 */
export function calcPHWeakStrongGeneric(p: Params): number {
  const { analyte, titrant, cAnalyte: cA, vAnalyte: vA, cTitrant: cT, vTitrant: vT } = p;
  const vTotal = vA + vT;
  const nAnal = cA * vA;
  const nTit  = cT * vT;
  const Kw = 1e-14;
  const EPS = 1e-9;

  // Determina se o reagente fraco está na bureta
  const weakInBurette = titrant.strength === "weak";

  // Teste de equivalência com tolerância
  const atEq = Math.abs(nAnal - nTit) < EPS;

  if (analyte.type === "acid" && analyte.strength === "weak" && titrant.type === "base" && titrant.strength === "strong") {
    const Ka = analyte.Ka!;
    if (vT === 0) {
      let H: number;
      const ratio = Ka / cA;
      if (ratio > 1e-4) {
        H = solveCubicWeakAcid(cA, Ka);
      } else if (ratio > 1e-6) {
        H = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * cA)) / 2;
      } else {
        H = Math.sqrt(Ka * cA);
      }
      return Number((-Math.log10(H)).toFixed(3));
    }
    if (nAnal > nTit) {
      const molesHA = nAnal - nTit;
      const molesA  = nTit;
      const [HA, A] = [molesHA / vTotal, molesA / vTotal];
      const pKa = -Math.log10(Ka);
      const pH = pKa + Math.log10(A / HA);
      return Number(pH.toFixed(3));
    }

    if (atEq) {
      if (weakInBurette) {
        // Reagente forte na bureta → sal do ácido fraco em água → hidrólise do sal A⁻
        const concA = nAnal / vTotal;
        const Kb = Kw / Ka;
        const OH = Kb * concA > 1e-4 ? solveCubicWeakBase(concA, Kb) : Math.sqrt(Kb * concA);
        const pOH = -Math.log10(OH);
        const pH = 14 - pOH;
        return Number(pH.toFixed(3));
      } else {
        // Reagente fraco no béquer → tampão 1:1 → pH = pKa
        const pKa = -Math.log10(Ka);
        return Number(pKa.toFixed(3));
      }
    }

    const excessOH = nTit - nAnal;
    const OH = excessOH / vTotal;
    const pOH = -Math.log10(OH);
    const pH = 14 - pOH;
    return Number(pH.toFixed(3));
  }

  if (analyte.type === "base" && analyte.strength === "weak" && titrant.type === "acid" && titrant.strength === "strong") {
    const Kb = analyte.Kb!;
    if (vT === 0) {
      let OH: number;
      const ratio = Kb / cA;
      if (ratio > 1e-4) {
        OH = solveCubicWeakBase(cA, Kb);
      } else if (ratio > 1e-6) {
        OH = (-Kb + Math.sqrt(Kb * Kb + 4 * Kb * cA)) / 2;
      } else {
        OH = Math.sqrt(Kb * cA);
      }
      const pOH = -Math.log10(OH);
      return Number((14 - pOH).toFixed(3));
    }
    if (nAnal > nTit) {
      const molesB  = nAnal - nTit;
      const molesBH = nTit;
      const [B, BH] = [molesB / vTotal, molesBH / vTotal];
      const pKb = -Math.log10(Kb);
      const pOH = pKb + Math.log10(BH / B);
      const pH = 14 - pOH;
      return Number(pH.toFixed(3));
    }

    if (atEq) {
      // No ponto de equivalência → somente NH4⁺ em solução
      const C_NH4 = nAnal / vTotal;
      const Ka_conj = Kw / Kb;
      const H = Ka_conj * C_NH4 > 1e-4 
        ? solveCubicWeakAcid(C_NH4, Ka_conj) 
        : Math.sqrt(Ka_conj * C_NH4);
      const pH = -Math.log10(H);
      return Number(pH.toFixed(3));
    }
    const excessH = nTit - nAnal;
    const H = excessH / vTotal;
    return Number((-Math.log10(H)).toFixed(3));
  }

  // ─── CASO ───  base forte (analito)   ×   ácido fraco (titulante)
  if (analyte.type === "base" && analyte.strength === "strong"
    && titrant.type === "acid" && titrant.strength === "weak") {

    const Ka = titrant.Ka!;              // Ka do ácido fraco da bureta
    const nStrong = cA * vA;             // mol inicial de OH– forte
    const nWeak   = cT * vT;             // mol acumulado de HA fraco
    const vTotal  = vA + vT;
    const atEq = Math.abs(nStrong - nWeak) < EPS;

    // (A) Antes da equivalência : OH– em excesso
    if (nStrong > nWeak) {
      const excessOH = nStrong - nWeak;
      const OH = excessOH / vTotal;
      const pOH = -Math.log10(OH);
      return +(14 - pOH).toFixed(3);
    }

    // (B) Equivalência
    if (atEq) {
      if (weakInBurette) {
        // Ácido fraco na bureta → sal A⁻ em água → hidrólise básica
        const concA = nStrong / vTotal;
        const Kb = Kw / Ka;
        const OH = Kb * concA > 1e-4 ? solveCubicWeakBase(concA, Kb) : Math.sqrt(Kb * concA);
        const pOH = -Math.log10(OH);
        const pH = 14 - pOH;
        return Number(pH.toFixed(3));
      } else {
        // Base forte no béquer → tampão 1:1 → pH = pKa
        const pKa = -Math.log10(Ka);
        return Number(pKa.toFixed(3));
      }
    }

    // (C) Depois da equivalência : HA fraco em excesso → tampão
    const molesA  = nStrong;             // todo OH– virou A–
    const molesHA = nWeak - nStrong;     // HA remanescente
    const [A, HA] = [molesA / vTotal, molesHA / vTotal];
    const pKa = -Math.log10(Ka);
    const pH  = pKa + Math.log10(A / HA);   // Henderson-Hasselbalch
    return +pH.toFixed(3);
  }

  // ─── CASO ───  ácido forte (analito)   ×   base fraca (titulante)
  if (analyte.type === "acid" && analyte.strength === "strong"
    && titrant.type === "base" && titrant.strength === "weak") {

    const Kb = titrant.Kb!;              // Kb da base fraca na bureta
    const nStrong = cA * vA;             // mols de H+ forte no início
    const nWeak   = cT * vT;             // mols de B (base fraca) adicionados
    const vTotal  = vA + vT;
    const atEq = Math.abs(nStrong - nWeak) < EPS;

    // (A) Antes da equivalência – H+ forte em excesso
    if (nStrong > nWeak) {
      const excessH = nStrong - nWeak;
      const H = excessH / vTotal;
      return Number((-Math.log10(H)).toFixed(3));
    }

    // (B) Equivalência
    if (atEq) {
      if (weakInBurette) {
        // Base fraca na bureta → sal BH⁺ em água → hidrólise ácida
        const concBH = nStrong / vTotal;
        const Ka_conj = Kw / Kb;
        const H = Ka_conj * concBH > 1e-4
          ? solveCubicWeakAcid(concBH, Ka_conj)
          : Math.sqrt(Ka_conj * concBH);
        return Number((-Math.log10(H)).toFixed(3));
      } else {
        // Ácido forte no béquer → tampão 1:1 → pOH = pKb → pH = 14 - pKb
        const pKb = -Math.log10(Kb);
        const pH = 14 - pKb;
        return Number(pH.toFixed(3));
      }
    }

    // (C) Depois da equivalência – tampão B/BH+
    const molesB  = nWeak   - nStrong;       // excesso de base fraca não protonada
    const molesBH = nStrong;                 // BH+ remanescente
    const [B, BH] = [molesB / vTotal, molesBH / vTotal];
    const pKb = -Math.log10(Kb);
    const pOH = pKb + Math.log10(BH / B);    // Henderson–Hasselbalch (base)
    const pH  = 14 - pOH;
    return Number(pH.toFixed(3));
  }

  throw new Error("Combinação de reagentes não suportada no motor fraco–forte");
}

export function generateCurveWeakStrongGeneric(
  params: Omit<Params, 'vTitrant'>,
  step: number,
  points: number
) {
  const data: { vol: number; pH: number }[] = [];
  for (let i = 0; i <= points; i++) {
    const vTitrant = step * i;
    const pH = calcPHWeakStrongGeneric({ ...params, vTitrant });
    data.push({ vol: Number((vTitrant * 1000).toFixed(4)), pH });
  }
  return data;
}
