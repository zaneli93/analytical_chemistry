import { calcPHWeakStrongGeneric } from "../core/weakStrongGeneric";
import { reagents } from "../data/reagents";

const Acetic   = reagents.find(r => r.id === "ch3cooh")!;
const NaOH     = reagents.find(r => r.id === "naoh")!;
const Ammonia  = reagents.find(r => r.id === "nh3")!;
const HCl      = reagents.find(r => r.id === "hcl")!;
const OHBenzo  = {
  id: "ohba", name: "Ácido o-hidroxibenzoico", type: "acid", strength: "weak", protons: 1, Ka: 1.0e-3,
} as const;

describe("weak–strong titration engine", () => {
  test("pH inicial – ácido relativamente forte precisa cúbico", () => {
    const pH = calcPHWeakStrongGeneric({
      analyte: OHBenzo, cAnalyte: 0.05, vAnalyte: 0.05,
      titrant: NaOH,    cTitrant: 0.1,  vTitrant: 0
    });
    expect(pH).toBeCloseTo(2.17, 2);
  });

  test("pH inicial – ácido acético continua na aproximação √", () => {
    const pH = calcPHWeakStrongGeneric({
      analyte: Acetic, cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: NaOH,   cTitrant: 0.1, vTitrant: 0
    });
    expect(pH).toBeCloseTo(2.88, 2);
  });

  test("pH inicial – base fraca diluída requer cúbico", () => {
    const pH = calcPHWeakStrongGeneric({
      analyte: Ammonia, cAnalyte: 0.01, vAnalyte: 0.05,
      titrant: HCl,     cTitrant: 0.1,  vTitrant: 0
    });
    expect(pH).toBeCloseTo(8.98, 2);
  });
});
