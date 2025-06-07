import type { reagents } from "@/data/reagents";

type Reagent = (typeof reagents)[number];   // Inferir tipo do banco

interface Params {
  analyte: Reagent;     // solução inicial
  cAnalyte: number;     // mol/L
  vAnalyte: number;     // L
  titrant: Reagent;     // solução que goteja
  cTitrant: number;     // mol/L
  vTitrant: number;     // L adicionados até o momento
}

/**
 * pH para ácido forte × base forte (genérico: usuário decide quem é quem)
 */
export function calcPHStrongStrongGeneric(p: Params): number {
  // Mol de H+ (se ácido) ou OH- (se base) do ANALITO
  const nAnal = p.analyte.type === "acid"
    ?  p.cAnalyte * p.vAnalyte       // mol de H+
    :  p.cAnalyte * p.vAnalyte;      // mol de OH-

  // Mol de Titrante
  const nTit  = p.titrant.type === "acid"
    ?  p.cTitrant * p.vTitrant       // mol de H+
    :  p.cTitrant * p.vTitrant;      // mol de OH-

  const vTot = p.vAnalyte + p.vTitrant;        // volume total

  // Caso 1 : analito ácido & titulante base  → modelo anterior
  if (p.analyte.type === "acid" && p.titrant.type === "base") {
    if (nAnal === nTit) return 7;
    if (nAnal > nTit) {          // excesso de H+
      const h = (nAnal - nTit) / vTot;
      return Number((-Math.log10(h)).toFixed(3));
    }
    // excesso de OH-
    const oh = (nTit - nAnal) / vTot;
    return Number((14 + Math.log10(oh)).toFixed(3));   // 14 − pOH
  }

  // Caso 2 : analito base & titulante ácido  (espelho)
  if (p.analyte.type === "base" && p.titrant.type === "acid") {
    if (nAnal === nTit) return 7;
    if (nAnal > nTit) {          // excesso de OH-
      const oh = (nAnal - nTit) / vTot;
      return Number((14 + Math.log10(oh)).toFixed(3));
    }
    // excesso de H+
    const h = (nTit - nAnal) / vTot;
    return Number((-Math.log10(h)).toFixed(3));
  }

  // Qualquer outra combinação (ácido×ácido ou base×base) não faz sentido
  throw new Error("Combination not supported in strong–strong engine");
}

/**
 * Gera um array de pontos {vol, pH} para gráfico (versão genérica).
 * @param params - Parâmetros do analito e titulante
 * @param step - Passo de adição do titulante **em litros**
 * @param points - Quantos pontos gerar
 */
export function generateCurveStrongStrongGeneric(
  params: Omit<Params, 'vTitrant'>,
  step: number,
  points: number
) {
  const data: { vol: number; pH: number }[] = [];

  for (let i = 0; i <= points; i++) {
    const vTitrant = step * i;
    const pH = calcPHStrongStrongGeneric({
      ...params,
      vTitrant
    });
    data.push({ vol: Number(vTitrant.toFixed(4)), pH });
  }
  return data;
} 