import { calcPHWeakStrongGeneric } from "../core/weakStrongGeneric";
import { reagents } from "../data/reagents";

const Acetic  = reagents.find(r => r.id === "ch3cooh")!;
const NaOH    = reagents.find(r => r.id === "naoh")!;
const Ammonia = reagents.find(r => r.id === "nh3")!;
const HCl     = reagents.find(r => r.id === "hcl")!;

describe("weak–strong generic", () => {
  test("ácido fraco titulado por base forte", () => {
    const pH = calcPHWeakStrongGeneric({
      analyte: Acetic,  cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: NaOH,    cTitrant: 0.1, vTitrant: 0.04
    });
    expect(pH).toBeCloseTo(5.347, 2);
  });

  test("base fraca titulada por ácido forte", () => {
    const pH = calcPHWeakStrongGeneric({
      analyte: Ammonia, cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: HCl,     cTitrant: 0.1, vTitrant: 0.04
    });
    expect(pH).toBeCloseTo(8.653, 2);
  });
});

