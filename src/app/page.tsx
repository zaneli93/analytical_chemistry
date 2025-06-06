'use client';
import { calcPH } from "@/core/titrationEngine";
import { generateCurveStrongStrong } from "@/core/generateCurve";

export default function Home() {
  const data = generateCurveStrongStrong(
    0.1,   // cA  (mol/L)
    0.05,  // vA  (L)  50 mL
    0.1,   // cB  (mol/L)
    0.002, // passo 2 mL  → 0,002 L
    30     // 30 passos  (0 → 60 mL)
  );

  console.table(data);   // mostra bonitinho
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <h1 className="text-3xl font-bold text-blue-800">
        Analytical Chemistry PWA
      </h1>
    </main>
  );
} 