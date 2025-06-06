/**
 * pH para titulação ácido forte × base forte (1 : 1)
 * @param cA  Concentração do ácido (mol L⁻¹)
 * @param vA  Volume inicial do ácido (L)
 * @param cB  Concentração da base  (mol L⁻¹)
 * @param vB  Volume de base já adicionado (L)
 * @returns   pH (número com 3 casas internas; 2 casas no log)
 */
export function calcPHStrongStrong(
  cA: number,
  vA: number,
  cB: number,
  vB: number
): number {
  const nA = cA * vA;          // mol de ácido no início
  const nB = cB * vB;          // mol de base adicionados
  const vTot = vA + vB;        // volume total (L)

  if (nA === nB) return 7;     // ponto de equivalência

  if (nA > nB) {
    // excesso de H⁺
    const h = (nA - nB) / vTot;
    return Number((-Math.log10(h)).toFixed(3));
  } else {
    // excesso de OH⁻
    const oh = (nB - nA) / vTot;
    const pOH = -Math.log10(oh);
    return Number((14 - pOH).toFixed(3));
  }
} 