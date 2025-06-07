import { calcPHStrongStrongGeneric } from "../core/strongStrongGeneric";
import { reagents } from "../data/reagents";

const HCl  = reagents.find(r => r.id === "hcl")!;
const NaOH = reagents.find(r => r.id === "naoh")!;

describe("strong–strong generic", () => {
  test("ácido (análito) titulado por base (titrante)", () => {
    // 0,1 M HCl 50 mL + 0,1 M NaOH 40 mL
    const pH = calcPHStrongStrongGeneric({
      analyte: HCl,   cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: NaOH,  cTitrant: 0.1, vTitrant: 0.04
    });
    expect(pH).toBeCloseTo(1.954, 2);
  });

  test("base (análito) titulada por ácido (titrante)", () => {
    // 0,1 M NaOH 50 mL + 0,1 M HCl 40 mL
    const pH = calcPHStrongStrongGeneric({
      analyte: NaOH,  cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: HCl,   cTitrant: 0.1, vTitrant: 0.04
    });
    expect(pH).toBeCloseTo(12.046, 2);   // espelho de 1,954
  });
}); 