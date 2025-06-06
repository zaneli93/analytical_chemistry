// src/core/titrationEngine.ts

/**
 * Calcula o pH em cada etapa da titulação.
 * @param cA  Concentração do ácido (mol/L)
 * @param vA  Volume inicial do ácido (L)
 * @param cB  Concentração da base titulante (mol/L)
 * @param vB  Volume de base já adicionado (L)
 * @returns   pH estimado (neste rascunho devolve 7)
 */
export function calcPH(
    cA: number,
    vA: number,
    cB: number,
    vB: number
  ): number {
    // TODO: implementar fórmula real
    return 7.0;
  }
  