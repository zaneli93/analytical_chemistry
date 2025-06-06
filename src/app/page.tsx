'use client';
import { calcPH } from "@/core/titrationEngine";
export default function Home() {
  console.log("pH de teste:", calcPH(0.1, 0.05, 0.1, 0));
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <h1 className="text-3xl font-bold text-blue-800">
        Analytical Chemistry PWA
      </h1>
    </main>
  );
} 