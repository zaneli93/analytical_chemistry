import { calcPHStrongStrong } from "./strongAcidBase";

/**
 * Gera um array de pontos {vol, pH} para gráfico.
 * @param cA, vA  – ácido   (mol L⁻¹, L)
 * @param cB      – base    (mol L⁻¹)
 * @param step    – passo de adição da base **em litros**
 * @param points  – quantos pontos gerar
 */
export function generateCurveStrongStrong(
  cA: number,
  vA: number,
  cB: number,
  step: number,
  points: number
) {
  const data: { vol: number; pH: number }[] = [];

  for (let i = 0; i <= points; i++) {
    const vB = step * i;
    const pH = calcPHStrongStrong(cA, vA, cB, vB);
    data.push({ vol: Number(vB.toFixed(4)), pH });
  }
  return data;
} 