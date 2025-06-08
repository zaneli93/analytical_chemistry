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
    expect(pH).toBeCloseTo(2.18, 1);
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
    expect(pH).toBeCloseTo(10.62, 1);
  });

  test("ácido forte (analito) + base fraca (titulante) – antes da equivalência", () => {
    // 50 mL HCl 0,1 M + 30 mL NH₃ 0,1 M  → H+ forte em excesso (pH ~1,60)
    const pH = calcPHWeakStrongGeneric({
      analyte: HCl,   cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: Ammonia, cTitrant: 0.1, vTitrant: 0.03,
    });
    expect(pH).toBeCloseTo(1.60, 2);
  });

  test("ácido forte + base fraca – ponto de equivalência", () => {
    // 50 mL HCl 0,1 M + 50 mL NH₃ 0,1 M  → solução de NH₄⁺ (pH ~5,28)
    const pH = calcPHWeakStrongGeneric({
      analyte: HCl,   cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: Ammonia, cTitrant: 0.1, vTitrant: 0.05,
    });
    expect(pH).toBeCloseTo(5.28, 2);
  });

  test("ácido forte + base fraca – depois da equivalência", () => {
    // 50 mL HCl 0,1 M + 60 mL NH₃ 0,1 M  → tampão NH₃/NH₄⁺ (pH ~8,56)
    const pH = calcPHWeakStrongGeneric({
      analyte: HCl,   cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: Ammonia, cTitrant: 0.1, vTitrant: 0.06,
    });
    expect(pH).toBeCloseTo(8.56, 2);
  });

  // ─── TESTES DA REGRA ÚNICA NO PONTO DE EQUIVALÊNCIA ───

  test("NaOH (béquer) titulado por CH₃COOH (bureta) – fraco na bureta → hidrólise", () => {
    // 50 mL NaOH 0,2 M + 50 mL CH₃COOH 0,2 M → sal acetato → hidrólise básica (pH ≈ 8,87)
    const pH = calcPHWeakStrongGeneric({
      analyte: NaOH,    cAnalyte: 0.2, vAnalyte: 0.05,
      titrant: Acetic,  cTitrant: 0.2, vTitrant: 0.05,
    });
    expect(pH).toBeCloseTo(8.87, 1);
  });

  test("CH₃COOH (béquer) titulado por NaOH (bureta) – fraco no béquer → tampão 1:1", () => {
    // 50 mL CH₃COOH 0,1 M + 50 mL NaOH 0,1 M → tampão 1:1 → pH = pKa ≈ 4,74
    // (Este teste deveria dar pH ≈ 4,74, não 8,72 como antes)
    const pH = calcPHWeakStrongGeneric({
      analyte: Acetic, cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: NaOH,   cTitrant: 0.1, vTitrant: 0.05,
    });
    expect(pH).toBeCloseTo(4.74, 2);
  });

  test("HCl (béquer) titulado por NH₃ (bureta) – fraco na bureta → hidrólise ácida", () => {
    // 50 mL HCl 0,1 M + 50 mL NH₃ 0,1 M → sal NH₄⁺ → hidrólise ácida (pH ≈ 5,28)
    const pH = calcPHWeakStrongGeneric({
      analyte: HCl,     cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: Ammonia, cTitrant: 0.1, vTitrant: 0.05,
    });
    expect(pH).toBeCloseTo(5.28, 2);
  });

  test("NH₃ (béquer) titulado por HCl (bureta) – fraco no béquer → somente NH₄⁺", () => {
    // 50 mL NH₃ 0,1 M + 50 mL HCl 0,1 M → somente NH₄⁺ → hidrólise ácida (pH ≈ 5,28)
    const pH = calcPHWeakStrongGeneric({
      analyte: Ammonia, cAnalyte: 0.1, vAnalyte: 0.05,
      titrant: HCl,     cTitrant: 0.1, vTitrant: 0.05,
    });
    expect(pH).toBeCloseTo(5.28, 1);
  });

  // ─── TESTES ESPECÍFICOS NH₃ + HCl ───

  test("NH₃ + HCl equivalência exata (10 mL + 10 mL)", () => {
    // 10 mL NH₃ 0,1 M + 10 mL HCl 0,1 M → somente NH₄⁺ (pH ≈ 5,28)
    const pH = calcPHWeakStrongGeneric({
      analyte: Ammonia, cAnalyte: 0.1, vAnalyte: 0.01,
      titrant: HCl,     cTitrant: 0.1, vTitrant: 0.01,
    });
    expect(pH).toBeCloseTo(5.28, 2);
  });

  test("NH₃ + HCl antes da equivalência (10 mL + 9 mL)", () => {
    // 10 mL NH₃ 0,1 M + 9 mL HCl 0,1 M → tampão NH₃/NH₄⁺ (pH ≈ 8,30)
    const pH = calcPHWeakStrongGeneric({
      analyte: Ammonia, cAnalyte: 0.1, vAnalyte: 0.01,
      titrant: HCl,     cTitrant: 0.1, vTitrant: 0.009,
    });
    expect(pH).toBeCloseTo(8.30, 1);
  });

  test("NH₃ + HCl depois da equivalência (10 mL + 11 mL)", () => {
    // 10 mL NH₃ 0,1 M + 11 mL HCl 0,1 M → HCl em excesso (pH ≈ 2,3)
    const pH = calcPHWeakStrongGeneric({
      analyte: Ammonia, cAnalyte: 0.1, vAnalyte: 0.01,
      titrant: HCl,     cTitrant: 0.1, vTitrant: 0.011,
    });
    expect(pH).toBeCloseTo(2.3, 1);
  });

  // ─── TESTES ESPECÍFICOS CH₃COOH + NaOH ───

  test("CH₃COOH + NaOH equivalência exata (5 mL + 5 mL)", () => {
    // 5 mL CH₃COOH 0,1 M + 5 mL NaOH 0,1 M → tampão 1:1 → pH = pKa ≈ 4,74
    const pH = calcPHWeakStrongGeneric({
      analyte: Acetic, cAnalyte: 0.1, vAnalyte: 0.005,
      titrant: NaOH,   cTitrant: 0.1, vTitrant: 0.005,
    });
    expect(pH).toBeCloseTo(4.74, 1);
  });

  test("CH₃COOH + NaOH antes da equivalência (5 mL + 4,5 mL)", () => {
    // 5 mL CH₃COOH 0,1 M + 4,5 mL NaOH 0,1 M → tampão CH₃COOH/CH₃COO⁻ (pH ≈ 5,70)
    const pH = calcPHWeakStrongGeneric({
      analyte: Acetic, cAnalyte: 0.1, vAnalyte: 0.005,
      titrant: NaOH,   cTitrant: 0.1, vTitrant: 0.0045,
    });
    expect(pH).toBeCloseTo(5.70, 1);
  });

  test("CH₃COOH + NaOH depois da equivalência (5 mL + 5,5 mL)", () => {
    // 5 mL CH₃COOH 0,1 M + 5,5 mL NaOH 0,1 M → NaOH em excesso (pH ≈ 11,68)
    const pH = calcPHWeakStrongGeneric({
      analyte: Acetic, cAnalyte: 0.1, vAnalyte: 0.005,
      titrant: NaOH,   cTitrant: 0.1, vTitrant: 0.0055,
    });
    expect(pH).toBeCloseTo(11.68, 1);
  });
});