import { calcPHStrongStrong } from "../core/strongAcidBase";

describe("Ácido forte × base forte", () => {
  const cA = 0.1;            // mol/L
  const vA = 0.05;           // 50 mL  → 0,05 L
  const cB = 0.1;            // mol/L

  test("antes do ponto (40 mL de base)", () => {
    expect(calcPHStrongStrong(cA, vA, cB, 0.04)).toBeCloseTo(1.954, 2);
  });

  test("no ponto (50 mL)", () => {
    expect(calcPHStrongStrong(cA, vA, cB, 0.05)).toBeCloseTo(7.0, 1);
  });

  test("depois do ponto (60 mL)", () => {
    expect(calcPHStrongStrong(cA, vA, cB, 0.06)).toBeCloseTo(11.959, 2);
  });
}); 