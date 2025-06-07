# Analytical Chemistry PWA 🚀  
*Simulador potencialométrico de titulações ácido-base – mobile-first, offline-first.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🧭 Visão Geral

Este projeto é uma **Progressive Web Application (PWA)** educativa para simulações potencialométricas de titulações ácido-base. O usuário escolhe reagentes (ácidos e bases), define concentrações e volumes, e o app gera a **curva de titulação** (pH × volume adicionado) com visualização gráfica interativa.

> **Status atual (Janeiro 2025)**  
> * ✅ Motor de cálculo **ácido forte × base forte** implementado e testado
> * ✅ Interface de simulação funcional com Chart.js
> * ✅ Seleção de reagentes com busca inteligente (Combobox)
> * ✅ PWA configurada com service worker e manifest
> * ✅ Testes unitários Jest + ts-jest (100% aprovação)
> * ✅ Build de produção otimizado
> * ✅ Banco de reagentes expandido (10+ ácidos/bases fortes)

---

## ✨ Funcionalidades

| ✅ **Implementado** | 🔜 **Próximos passos** |
|---------------------|------------------------|
| Motor de cálculo **ácido forte × base forte** | Ácido fraco × base forte (Ka/Kb) |
| **Interface de simulação completa** | Derivada 1.ª/2.ª e detecção automática de equivalência |
| **Gráfico Chart.js interativo** | Sistema de histórico de simulações |
| **Seleção inteligente de reagentes** | Exportar dados (CSV/PNG) |
| **PWA offline-first** | Motor para ácidos/bases polipróticos |
| **Design mobile-first responsivo** | Calculadora de pH rápida |
| **Testes unitários completos** | Testes E2E com Cypress |

---

## 🏗️ Arquitetura (Clean Architecture)

```
src/
├─ app/                    # Next.js App Router
│  ├─ page.tsx            # Página inicial ✅
│  ├─ layout.tsx          # Layout global ✅
│  ├─ globals.css         # Estilos globais ✅
│  └─ simulation/
│     └─ page.tsx         # Interface de simulação ✅
├─ core/                   # Lógica de negócio
│  ├─ strongStrongGeneric.ts    # Motor genérico forte×forte ✅
│  ├─ strongAcidBase.ts         # motor legado ✅
│  ├─ generateCurve.ts          # geração de pontos ✅
│  └─ titrationEngine.ts        # engine principal ✅
├─ data/
│  └─ reagents.ts         # banco de 10+ reagentes ✅
└─ __tests__/             # testes unitários ✅
   ├─ strongStrongGeneric.test.ts
   └─ strongAcidBase.test.ts
```

---

## 🛠️ Tech Stack

| Camada | Tecnologias | Status |
|--------|-------------|---------|
| **Framework** | Next.js 14 (App Router) | ✅ Implementado |
| **Linguagem** | TypeScript 5.3 | ✅ Implementado |
| **Styling** | Tailwind CSS + Headless UI | ✅ Implementado |
| **Estado** | Zustand | 📦 Instalado (não usado ainda) |
| **Gráficos** | Chart.js + react-chartjs-2 | ✅ Implementado |
| **Cálculos** | Math.js + engines próprios | ✅ Implementado |
| **PWA** | next-pwa + Workbox | ✅ Implementado |
| **Storage** | IndexedDB (Dexie.js) | 📦 Instalado (não usado ainda) |
| **Testes** | Jest + ts-jest | ✅ Implementado |
| **E2E** | Cypress | 📦 Instalado (não configurado) |

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
cp env.example .env.local
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
npm run test:coverage  # com cobertura
```

### 6. Build de produção:
```bash
npm run build
npm start
```

---

## 📋 Scripts disponíveis

| Comando | Descrição | Status |
|---------|-----------|---------|
| `npm run dev` | servidor Next.js com Fast Refresh | ✅ Funcional |
| `npm run build` / `start` | build e servir produção | ✅ Funcional |
| `npm run lint` / `lint:fix` | ESLint | ✅ Funcional |
| `npm run type-check` | checagem de tipos TypeScript | ✅ Funcional |
| `npm run test` | Jest + ts-jest | ✅ Funcional |
| `npm run test:coverage` | testes com cobertura | ✅ Funcional |
| `npm run storybook` | Storybook (UI isolada) | 📦 Instalado (não configurado) |
| `npm run test:e2e` | Cypress E2E | 📦 Instalado (não configurado) |
| `npm run analyze` | análise de bundle | ✅ Funcional |
| `npm run clean` | remove .next, dist, coverage | ✅ Funcional |

---

## 🎯 Como usar

### Simulação Básica
1. Acesse `/simulation` 
2. Escolha **Reagente A** e **Reagente B** (ácido + base)
3. Configure **concentração** e **volume** do analito
4. Defina qual reagente está na **bureta** (titulante)
5. Clique **"Generate Curve"** para ver o gráfico pH × volume

### Reagentes Disponíveis
**Ácidos Fortes:** HCl, HBr, HI, HNO₃, HClO₄  
**Bases Fortes:** NaOH, KOH, LiOH, RbOH, CsOH

---

## 🛣️ Roadmap

### **Fase 1** : Fundamentos ✅
- [x] Setup inicial Next.js + TypeScript  
- [x] Motor forte×forte genérico
- [x] Interface de simulação funcional
- [x] Testes unitários completos
- [x] PWA básica configurada

### **Fase 2** : Melhorias UX/UI 🔄
- [ ] Design System + componentes reutilizáveis
- [ ] Gerenciamento de estado com Zustand  
- [ ] Histórico de simulações (IndexedDB)
- [ ] Melhorias na responsividade mobile

### **Fase 3** : Química avançada 🔜
- [ ] Ácido fraco × base forte (constantes Ka/Kb)  
- [ ] Detecção automática do ponto de equivalência
- [ ] Cálculo de derivadas (1ª e 2ª) da curva
- [ ] Ácidos/bases polipróticos  

### **Fase 4** : Recursos avançados 🔜
- [ ] Exportação de dados (CSV, PNG)
- [ ] Calculadora de pH standalone
- [ ] Testes E2E com Cypress
- [ ] Pipeline CI/CD automatizado

### **Fase 5** : Deploy & Produção 🔜
- [ ] Deploy em Vercel/Netlify
- [ ] Otimizações de performance
- [ ] Analytics e monitoramento
- [ ] Documentação completa

---

## 🧪 Arquivos principais

### Core (Lógica de negócio)
- `src/core/strongStrongGeneric.ts` - Motor principal de cálculo
- `src/core/generateCurve.ts` - Geração de pontos para gráfico
- `src/data/reagents.ts` - Banco de reagentes químicos

### Interface
- `src/app/simulation/page.tsx` - Interface principal de simulação
- `src/app/page.tsx` - Página inicial
- `src/app/layout.tsx` - Layout global da aplicação

### Configuração
- `next.config.js` - Configuração Next.js + PWA
- `public/manifest.json` - Manifest da PWA
- `tailwind.config.js` - Configuração do Tailwind CSS

---

## 🤝 Contribuindo

1. **Fork** o projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`  
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova feature'`  
4. Push para a branch: `git push origin feature/minha-feature`  
5. **Abra um Pull Request**  

> **Convenções:**
> - Branch principal: **main**  
> - Padrão de commits: [Conventional Commits](https://conventionalcommits.org/)
> - Padrão de branches: `feature/`, `fix/`, `docs/`

---

## 📊 Status dos Testes

```bash
# Última execução
✅ Test Suites: 2 passed, 2 total
✅ Tests: 5 passed, 5 total  
✅ Snapshots: 0 total
⏱️ Time: 2.07s
```

**Cobertura atual:** Lógica de cálculo 100% testada

---

## 📜 Licença

**MIT** – consulte [LICENSE](LICENSE) para detalhes.

---

## 📇 Contato & Links

**Desenvolvedor:** Bruno Zaneli  
**GitHub:** [@zaneli93](https://github.com/zaneli93)  
**Projeto:** [analytical_chemistry](https://github.com/zaneli93/analytical_chemistry)

**Documentação técnica:** [architecture.md](architecture.md)
