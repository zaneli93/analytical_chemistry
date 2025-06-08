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

    if (nAnal === nTit) {
      const concA = nAnal / vTotal;
      const Kb = Kw / Ka;
      const OH = Kb * concA > 1e-4 ? solveCubicWeakBase(concA, Kb) : Math.sqrt(Kb * concA);

      const pOH = -Math.log10(OH);
      const pH = 14 - pOH;
      return Number(pH.toFixed(3));
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

    if (nAnal === nTit) {
      const concBH = nAnal / vTotal;
      const Ka_conj = Kw / Kb;
      const H = Ka_conj * concBH > 1e-4 ? solveCubicWeakAcid(concBH, Ka_conj) : Math.sqrt(Ka_conj * concBH);
      const pH = -Math.log10(H);
      return Number(pH.toFixed(3));
    }
    const excessH = nTit - nAnal;
    const H = excessH / vTotal;
    return Number((-Math.log10(H)).toFixed(3));
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
