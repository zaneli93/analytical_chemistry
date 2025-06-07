'use client';

import { useState, Fragment } from 'react';
import { Combobox } from '@headlessui/react';
import { reagents } from '@/data/reagents';
import { calcPHStrongStrongGeneric } from '@/core/strongStrongGeneric';

type Reagent = (typeof reagents)[number];
import {
  Line
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function SimulationPage() {
  // ------- constantes ----------
  const MIN_C = 0.0001;      // 1 × 10⁻⁴ M
  
  // ------- estado ----------
  const [reagentA, setReagentA] = useState<(typeof reagents)[number] | null>(null);
  const [reagentB, setReagentB] = useState<(typeof reagents)[number] | null>(null);
  const [buretteIsA, setBuretteIsA] = useState(false);   // false = B na bureta
  const [conc, setConc]   = useState(0.1);   // mol/L do analito
  // NOVO – volumes fixos
  const presetVolumes = [5, 10, 25, 50] as const;
  const [vol, setVol] =
    useState<typeof presetVolumes[number]>(25); // 25 mL default
  const [points, setPoints] = useState<{ vol: number; pH: number }[]>([]);

  function normalize(str: string) {
    return str
      .normalize('NFD')                 // separa acentos
      .replace(/[\u0300-\u036f]/g, '')  // remove acentos
      .toLowerCase();
  }

  /* busca e lista filtrada p/ A */
  const [queryA, setQueryA] = useState('');
  const filteredA =
    queryA === ''
      ? reagents
      : reagents.filter(r =>
          normalize(r.name).includes(normalize(queryA))
        );

  /* busca e lista filtrada p/ B */
  const [queryB, setQueryB] = useState('');
  const filteredB =
    queryB === ''
      ? reagents
      : reagents.filter(r =>
          normalize(r.name).includes(normalize(queryB))
        );

  // ------- helpers ----------
  function generateCurve() {
    // Validação de reagentes
    if (!reagentA || !reagentB) {
      alert('Choose both reagents');
      return;
    }
    // Validação extra - verificar concentração mínima
    if (conc < MIN_C) {
      alert(`Minimum concentration is ${MIN_C} mol/L to keep water auto-ionisation negligible.`);
      return;
    }
    const analyte  = buretteIsA ? reagentB : reagentA;
    const titrant  = buretteIsA ? reagentA : reagentB;
    const cA = conc;
    const vA = vol / 1000;          // converte mL → L
    const cT = 0.1;                 // (continuamos fixo 0,1 M por enquanto)

    // 1) volume de equivalência (L)
    const vEq = (cA * vA) / cT;     // L

    // 2) volume final com 20 % de margem, mínimo 0,02 L (20 mL)
    const vFinal = Math.max(vEq * 1.2, 0.02);

    // 3) passo: 40 pontos
    const steps = 40;
    const step = vFinal / steps;    // L
    const pts: {vol:number; pH:number}[] = [];

    for (let i = 0; i <= steps; i++) {          // ALTERADO
      const vT = step * i;
      const pH = calcPHStrongStrongGeneric({
        analyte, cAnalyte: cA, vAnalyte: vA,
        titrant, cTitrant: cT, vTitrant: vT
      });
      pts.push({ vol: +(vT*1000).toFixed(0), pH }); // guarda volume em mL
    }
    setPoints(pts);
  }

  // ------- dados para Chart.js ----------
  const chartData = {
    labels: points.map(p => p.vol),
    datasets: [
      {
        label: 'pH',
        data: points.map(p => p.pH),
        borderWidth: 2,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Volume titrant (mL)' }
      },
      y: {
        title: { display: true, text: 'pH' },
        min: 0,
        max: 14
      }
    }
  };

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Strong–Strong Titration (MVP)</h1>

      {/* --- Formulário --- */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* === COMBOBOX REAGENT A === */}
        <Combobox value={reagentA} onChange={setReagentA}>
          <Combobox.Label className="block text-sm font-medium mb-1">Reagent A</Combobox.Label>

          {/* Campo de entrada */}
          <div className="relative">
            <Combobox.Input
              className="w-full border p-2 rounded"
              placeholder="Type acid or base…"
              displayValue={(r: (typeof reagents)[number] | null) => r?.name ?? ''}
              onChange={e => setQueryA(e.target.value)}
            />

            {/* Lista  */}
            {filteredA.length > 0 && (
              <Combobox.Options
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow-lg list-none"
              >
                {filteredA.map(r => (
                  <Combobox.Option
                    key={r.id}
                    value={r}
                    className={({ active }) =>
                      `cursor-pointer px-4 py-2 ${
                        active ? 'bg-blue-600 text-white' : ''
                      }`
                    }
                  >
                    {r.name}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </div>
        </Combobox>

        {/* === COMBOBOX REAGENT B === */}
        <Combobox value={reagentB} onChange={setReagentB}>
          <Combobox.Label className="block text-sm font-medium mb-1">Reagent B</Combobox.Label>

          {/* Campo de entrada */}
          <div className="relative">
            <Combobox.Input
              className="w-full border p-2 rounded"
              placeholder="Type acid or base…"
              displayValue={(r: (typeof reagents)[number] | null) => r?.name ?? ''}
              onChange={e => setQueryB(e.target.value)}
            />

            {/* Lista  */}
            {filteredB.length > 0 && (
              <Combobox.Options
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow-lg list-none"
              >
                {filteredB.map(r => (
                  <Combobox.Option
                    key={r.id}
                    value={r}
                    className={({ active }) =>
                      `cursor-pointer px-4 py-2 ${
                        active ? 'bg-blue-600 text-white' : ''
                      }`
                    }
                  >
                    {r.name}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </div>
        </Combobox>

        <div className="md:col-span-2 flex items-center space-x-4">
          <span className="font-medium">Burette:</span>
          <label className="inline-flex items-center space-x-1">
            <input
              type="radio"
              className="form-radio"
              checked={buretteIsA}
              onChange={() => setBuretteIsA(true)}
            />
            <span>A</span>
          </label>
          <label className="inline-flex items-center space-x-1">
            <input
              type="radio"
              className="form-radio"
              checked={!buretteIsA}
              onChange={() => setBuretteIsA(false)}
            />
            <span>B</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium">Concentration of analyte (mol L⁻¹)</label>
          <input
            type="number"
            step="0.01"
            min={MIN_C}
            value={conc}
            onChange={e => setConc(+e.target.value)}
            className="mt-1 w-full border p-2 rounded"
          />
        </div>
        {/* === VOLUME PRESET === */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Initial volume of analyte (mL)
          </label>
          <div className="flex flex-wrap gap-2">
            {presetVolumes.map(v => (
              <button
                key={v}
                onClick={() => setVol(v)}
                className={`px-4 py-1 rounded border
                  ${vol === v ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={generateCurve}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Simulate
      </button>

      {/* --- Gráfico --- */}
      {points.length > 0 && (
        <div className="mt-8">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </main>
  );
} 