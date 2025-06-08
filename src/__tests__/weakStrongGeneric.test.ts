import { calcPHWeakStrongGeneric } from "../core/weakStrongGeneric";
import { reagents } from "../data/reagents";

const Acetic  = reagents.find(r => r.id === "ch3cooh")!;
const NaOH    = reagents.find(r => r.id === "naoh")!;
const Ammonia = reagents.find(r => r.id === "nh3")!;
const HCl     = reagents.find(r => r.id === "hcl")!;

describe("weak–strong titration engine", () => {
  test("ácido fraco (analito) titulado por base forte (titrante)", () => {
    const pH = calcPHWeakStrongGeneric({
      analyte: Acetic, cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: NaOH,  cTitrant: 0.1, vTitrant: 0.04
    });
    expect(pH).toBeCloseTo(5.34, 2);
  });

  test("base fraca (analito) titulada por ácido forte (titrante)", () => {
    const pH = calcPHWeakStrongGeneric({
      analyte: Ammonia, cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: HCl,    cTitrant: 0.1, vTitrant: 0.04
    });
    expect(pH).toBeCloseTo(8.65, 2);
  });

  test("ponto de equivalência ácido fraco × base forte", () => {
    const pH = calcPHWeakStrongGeneric({
      analyte: Acetic, cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: NaOH,  cTitrant: 0.1, vTitrant: 0.05
    });
    expect(pH).toBeCloseTo(8.72, 2);
  });
});

