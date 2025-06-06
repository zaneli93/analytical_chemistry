# Analytical Chemistry PWA 🚀  
*Simulador potencialométrico de titulações ácido-base – mobile-first, offline-first.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🧭 Visão Geral

Este projeto é uma **Progressive Web Application (PWA)** educativa:  
o usuário escolhe um ácido, uma base, suas concentrações/volumes e o app gera a **curva de titulação** (pH × volume adicionado).  

> **Status atual (jun 2025)**  
> * Motor forte × forte implementado e validado por testes  
> * Geração de pontos da curva em array pronto para plotagem  
> * Ambiente Jest/ts-jest configurado  
> * Mini-banco de reagentes (HCl, NaOH) disponível

---

## ✨ Funcionalidades

| ✅ Implementado | 🔜 Próximos passos |
|-----------------|-------------------|
| Motor de cálculo **ácido forte × base forte** | Ácido fraco × base forte (Ka) |
| Geração de **array (vol,pH)** para gráfico | Gráfico Chart.js interativo |
| Testes unitários Jest + ts-jest | Derivada 1.ª/2.ª e detecção de equivalência |
| PWA básica (offline) | Exportar CSV / PNG |
| Mobile-first (Tailwind) | Motor para polipróticos / sais ácidos |

---

## 🏗️ Arquitetura (Clean Architecture)

```
src/
├─ core/                   # Lógica de negócio
│  ├─ strongAcidBase.ts    # pH forte×forte ✅
│  ├─ generateCurve.ts     # gera array de pontos ✅
│  └─ … futuros engines
├─ data/
│  └─ reagents.ts          # mini-banco HCl / NaOH
├─ ui/                     # componentes (a implementar)
├─ app/                    # rotas Next.js (App Router)
└─ infra/                  # config, scripts, tests
```

---

## 🛠️ Tech Stack

| Camada | Tecnologias |
|--------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Linguagem** | TypeScript 5.3 |
| **Styling** | Tailwind CSS + Headless UI |
| **Estado** | Zustand |
| **Gráficos** | Chart.js + react-chartjs-2 (pendente) |
| **Cálculos** | Math.js + engines próprios |
| **PWA** | next-pwa + Workbox |
| **Storage** | IndexedDB (Dexie.js) |
| **Testes** | Jest + ts-jest (+ Cypress E2E em breve) |

---

## ⚡ Instalação & Execução

### 1. Pré-requisitos
* **Node.js ≥ 18**     |    **npm ≥ 9**

### 2. Clone & instale
```bash
git clone https://github.com/zaneli93/analytical_chemistry.git
cd analytical_chemistry
npm install
```

### 3. Variáveis de ambiente:
```bash
cp .env.example .env.local
```

### 4. Desenvolvimento:
```bash
npm run dev
# Abra http://localhost:3000
```

> **Windows / PowerShell** – Caso scripts .ps1 sejam bloqueados:  
> `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

### 5. Testes:
```bash
npm test        # roda Jest + ts-jest
```
Configurações em `jest.config.js` já incluem o alias `@/` → `src/`.

---

## 📋 Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | servidor Next.js com Fast Refresh |
| `npm run build` / `start` | build e servir produção |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run type-check` | checagem de tipos |
| `npm run storybook` | Storybook (UI isolada) |
| `npm run test:e2e` | Cypress (em breve) |
| `npm run analyze` | análise de bundle |
| `npm run clean` | remove .next, dist, coverage |

---

## 🛣️ Roadmap

### **Fase 1** : Fundamentos
- [x] Setup inicial  
- [x] Motor forte×forte  
- [x] Testes unitários básicos  

### **Fase 2** : UI & Simulação
- [ ] Design System + componentes base  
- [ ] Integração do gráfico Chart.js  
- [ ] Interface de simulação (formulário)  

### **Fase 3** : Química avançada
- [ ] Ácido fraco × base forte (Kas e Kbs)  
- [ ] Polipróticos & tampões  
- [ ] Derivada 1.ª/2.ª para equivalência  

### **Fase 4** : PWA & Deploy
- [ ] Offline-first completo  
- [ ] Pipeline CI/CD (Vercel)  
- [ ] Exportações (CSV, PNG)  

---

## 🤝 Contribuindo

1. **fork** → `git checkout -b feature/suaFeature`  
2. `git commit -m 'feat: minha feature'`  
3. `git push origin feature/suaFeature`  
4. **Abra um Pull Request**  

> Branch principal: **main**  
> Padrão de nome para feature: `feature/xxx`

---

## 📜 Licença

**MIT** – consulte [LICENSE](LICENSE).

---

## 📇 Contato

**Bruno Zaneli**  
GitHub: [@zaneli93](https://github.com/zaneli93)  
Projeto: [https://github.com/zaneli93/analytical_chemistry](https://github.com/zaneli93/analytical_chemistry)
