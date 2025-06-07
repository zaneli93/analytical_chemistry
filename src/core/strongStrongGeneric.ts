import type { reagents } from '@/data/reagents';

type Reagent = (typeof reagents)[number];

interface Params {
  analyte: Reagent;
  cAnalyte: number;  // mol/L
  vAnalyte: number;  // L
  titrant: Reagent;
  cTitrant: number;  // mol/L
  vTitrant: number;  // L
}

/** pH para ácido forte × base forte (qualquer direção) */
export function calcPHStrongStrongGeneric(p: Params): number {
  const nAnal = p.cAnalyte * p.vAnalyte;             // mol de H+ ou OH- do analito
  const nTit  = p.cTitrant * p.vTitrant;             // mol do titulante
  const vTot  = p.vAnalyte + p.vTitrant;             // volume total

  // analito ácido, titulante base
  if (p.analyte.type === 'acid' && p.titrant.type === 'base') {
    if (nAnal === nTit) return 7;
    if (nAnal > nTit) {                              // excesso de H+
      const h = (nAnal - nTit) / vTot;
      return +( -Math.log10(h) ).toFixed(3);
    }
    const oh = (nTit - nAnal) / vTot;                // excesso de OH-
    return +( 14 + Math.log10(oh) ).toFixed(3);
  }

  // analito base, titulante ácido
  if (p.analyte.type === 'base' && p.titrant.type === 'acid') {
    if (nAnal === nTit) return 7;
    if (nAnal > nTit) {                              // excesso de OH-
      const oh = (nAnal - nTit) / vTot;
      return +( 14 + Math.log10(oh) ).toFixed(3);
    }
    const h = (nTit - nAnal) / vTot;                 // excesso de H+
    return +( -Math.log10(h) ).toFixed(3);
  }

  throw new Error('Combination not supported');
} 