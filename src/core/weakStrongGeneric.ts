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
 * Calcula o pH para titulação ácido fraco × base forte (genérico para ácido ou base fracos).
 */
export function calcPHWeakStrongGeneric(p: Params): number {
  const { analyte, titrant, cAnalyte: cA, vAnalyte: vA, cTitrant: cT, vTitrant: vT } = p;
  const vTotal = vA + vT;               // volume total após adição (L)
  const nAnal = cA * vA;               // mols de HA (se ácido) ou B (se base) inicialmente
  const nTit  = cT * vT;               // mols de OH- adicionados (se base forte) ou H+ adicionados (se ácido forte)

  const Kw = 1e-14; // constante de ionização da água a 25 °C

  // Caso 1: Analito = ácido fraco, Titrante = base forte
  if (analyte.type === "acid" && analyte.strength === "weak" && titrant.type === "base" && titrant.strength === "strong") {
    const Ka = analyte.Ka!;
    // (a) Nenhum titulante adicionado ainda (volume = 0)
    if (vT === 0) {
      // Calcula pH inicial do ácido fraco (equilíbrio HA ⇌ H+ + A-)
      const H = Math.sqrt(Ka * cA);                      // aproximação [H+] ≈ √(Ka * C_acid)
      return Number((-Math.log10(H)).toFixed(3));
    }
    // (b) Antes da equivalência (ácido em excesso, forma solução tampão HA/A-)
    if (nAnal > nTit) {
      // Sobram mols de HA não neutralizado e formam-se mols de A- equivalentes ao titulante adicionado
      const molesHA = nAnal - nTit;
      const molesA  = nTit;
      // Concentrações molares de HA e A- no volume total
      const [HA, A] = [molesHA / vTotal, molesA / vTotal];
      // Henderson–Hasselbalch: pH = pKa + log10([A-]/[HA])
      const pKa = -Math.log10(Ka);
      const pH = pKa + Math.log10(A / HA);
      return Number(pH.toFixed(3));
    }
    // (c) Ponto de equivalência (todos HA neutralizados -> solução de sal A- em água)
    if (nAnal === nTit) {
      // Toda a HA virou A-. Calcula pH pela hidrólise de A- (base fraca)
      const concA = nAnal / vTotal;            // concentração de A- formada
      const Kb = Kw / Ka;                     // constante básica da base conjugada (A-)
      const OH = Math.sqrt(Kb * concA);        // [OH-] ≈ √(Kb * C_salg)
      const pOH = -Math.log10(OH);
      const pH = 14 - pOH;
      return Number(pH.toFixed(3));
    }
    // (d) Após a equivalência (base forte em excesso)
    // Todo o ácido foi neutralizado e há OH- em excesso livre na solução.
    const excessOH = nTit - nAnal;             // mols de OH- em excesso
    const OH = excessOH / vTotal;             // [OH-] mol/L no volume total
    const pOH = -Math.log10(OH);
    const pH = 14 - pOH;
    return Number(pH.toFixed(3));
  }

  // Caso 2: Analito = base fraca, Titrante = ácido forte
  if (analyte.type === "base" && analyte.strength === "weak" && titrant.type === "acid" && titrant.strength === "strong") {
    const Kb = analyte.Kb!;
    // (a) Nenhum titulante adicionado (base fraca pura em água)
    if (vT === 0) {
      // Calcula pH inicial da base fraca (equilíbrio B + H2O ⇌ BH+ + OH-)
      const OH = Math.sqrt(Kb * cA);                     // [OH-] ≈ √(Kb * C_base)
      const pOH = -Math.log10(OH);
      return Number((14 - pOH).toFixed(3));              // converte pOH em pH
    }
    // (b) Antes da equivalência (base em excesso, solução tampão B/BH+)
    if (nAnal > nTit) {
      // Sobram mols de base B não neutralizada; formam-se mols de BH+ (ácido conjugado) iguais aos H+ adicionados
      const molesB  = nAnal - nTit;
      const molesBH = nTit;
      const [B, BH] = [molesB / vTotal, molesBH / vTotal];    // [B] e [BH+] no volume total
      // Henderson–Hasselbalch para base: pOH = pKb + log10([BH+]/[B]) -> então pH = 14 - pOH
      const pKb = -Math.log10(Kb);
      const pOH = pKb + Math.log10(BH / B);
      const pH = 14 - pOH;
      return Number(pH.toFixed(3));
    }
    // (c) Equivalência (toda base virou BH+, ácido conjugado em água)
    if (nAnal === nTit) {
      // Toda base B virou BH+. Calcula pH via dissociação ácida de BH+ (ácido fraco)
      const concBH = nAnal / vTotal;           // concentração de BH+ formada
      const Ka_conjugado = Kw / Kb;           // Ka do ácido conjugado BH+
      const H = Math.sqrt(Ka_conjugado * concBH); // [H+] ≈ √(Ka * C_acid_conjugado)
      const pH = -Math.log10(H);
      return Number(pH.toFixed(3));
    }
    // (d) Após a equivalência (ácido forte em excesso)
    // Toda base neutralizada; H+ em excesso determina o pH.
    const excessH = nTit - nAnal;             // mols de H+ em excesso
    const H = excessH / vTotal;              // [H+] mol/L restante
    return Number((-Math.log10(H)).toFixed(3));
  }

  // Qualquer outro caso (combinações não suportadas por este motor)
  throw new Error("Combinação de reagentes não suportada no motor fraco–forte");
}

/**
 * Gera um array de pontos {vol, pH} para a curva de titulação (ácido fraco × base forte).
 * @param params - Parâmetros do analito e titulante (igual a Params, mas sem vTitrant)
 * @param step - Incremento de volume do titulante **em litros**
 * @param points - Quantidade de pontos a gerar
 */
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
