export function calcPH(
    cA: number, // concentração do ácido (mol/L)
    vA: number, // volume inicial do ácido  (L)
    cB: number, // concentração da base     (mol/L)
    vB: number  // volume de base adicionado (L)
  ): number {
    const nA = cA * vA;   // moles de ácido
    const nB = cB * vB;   // moles de base
    const vTot = vA + vB; // volume total (L)
  
    const Kw = 1e-14; // produto iônico da água (caso precise)
  
    if (nA === nB) {
      return 7; // ponto de equivalência (solução neutra)
    }
  
    if (nA > nB) {
      // excesso de ácido → H+
      const hPlus = (nA - nB) / vTot;
      return -Math.log10(hPlus);
    } else {
      // excesso de base → OH-
      const ohMinus = (nB - nA) / vTot;
      const pOH = -Math.log10(ohMinus);
      return 14 - pOH;
    }
  }
  