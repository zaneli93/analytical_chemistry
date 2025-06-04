# Analytical Chemistry PWA

Progressive Web Application para simulações potencialométricas de ácido/base com foco mobile-first.

## 🧪 Visão Geral

Este projeto é uma PWA educacional que permite realizar simulações interativas de titulações ácido-base, visualizar curvas potencialométricas e compreender os conceitos fundamentais da química analítica.

## 🚀 Características

- **Mobile-First**: Interface otimizada para dispositivos móveis
- **PWA**: Funciona offline e pode ser instalada como app nativo
- **Simulações Interativas**: Cálculos em tempo real de potenciometria
- **Visualizações**: Gráficos interativos de curvas de titulação
- **Performance**: Carregamento rápido e operações fluidas
- **TypeScript**: Type safety para cálculos químicos críticos

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular baseada em Clean Architecture:

```
src/
├── core/           # Lógica de negócio e cálculos
├── data/           # Gerenciamento de dados e storage
├── ui/             # Componentes e interface
├── infra/          # Configurações e infraestrutura
└── app/            # Páginas e rotas (Next.js App Router)
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 com App Router
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **Estado**: Zustand
- **Gráficos**: Chart.js + React-Chartjs-2
- **Cálculos**: Math.js + Custom Chemistry Engine
- **PWA**: Next-PWA + Workbox
- **Storage**: IndexedDB (Dexie.js)
- **Testing**: Jest + Cypress + Storybook

## 📦 Setup do Projeto

### Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

### Instalação

```bash
# Clone o repositório
git clone https://github.com/username/analytical-chemistry-pwa.git
cd analytical-chemistry-pwa

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute em modo desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build para produção
npm run start            # Inicia servidor de produção

# Qualidade de Código
npm run lint             # Executa linting
npm run lint:fix         # Corrige problemas de linting
npm run type-check       # Verifica tipos TypeScript

# Testes
npm run test             # Executa testes unitários
npm run test:watch       # Executa testes em modo watch
npm run test:coverage    # Executa testes com coverage
npm run test:e2e         # Executa testes E2E (Cypress)

# Storybook
npm run storybook        # Inicia Storybook
npm run build-storybook  # Build do Storybook

# Utilitários
npm run analyze          # Analisa bundle size
npm run clean            # Limpa arquivos de build
```

## 📁 Estrutura de Pastas

```
analytical-chemistry-pwa/
├── public/                 # Assets estáticos
│   ├── icons/             # Ícones PWA
│   ├── images/            # Imagens
│   └── manifest.json      # Manifest PWA
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── globals.css    # Estilos globais
│   │   ├── layout.tsx     # Layout raiz
│   │   ├── page.tsx       # Página inicial
│   │   └── simulation/    # Páginas de simulação
│   ├── core/              # Lógica de negócio
│   │   ├── engines/       # Motores de simulação
│   │   ├── models/        # Modelos de dados
│   │   ├── constants/     # Constantes químicas
│   │   └── utils/         # Utilitários
│   ├── data/              # Camada de dados
│   │   ├── storage/       # Storage local
│   │   ├── api/           # Cliente API
│   │   └── hooks/         # Hooks de dados
│   ├── ui/                # Interface do usuário
│   │   ├── components/    # Componentes React
│   │   ├── layouts/       # Layouts
│   │   ├── hooks/         # Hooks de UI
│   │   └── styles/        # Estilos
│   └── infra/             # Infraestrutura
│       ├── config/        # Configurações
│       ├── scripts/       # Scripts de build
│       └── tests/         # Setup de testes
├── docs/                  # Documentação
├── .storybook/           # Configuração Storybook
├── cypress/              # Testes E2E
├── architecture.md       # Documentação da arquitetura
├── package.json          # Dependências e scripts
└── README.md            # Este arquivo
```

## 🧪 Módulos Principais

### Core Module
Contém a lógica de negócio principal:
- **Simulation Engine**: Motor de simulação potencialométrica
- **Calculation Engine**: Cálculos químicos (pH, pOH, concentrações)
- **Validation Logic**: Validação de parâmetros de entrada
- **Chemistry Models**: Modelos de ácidos, bases e soluções

### Data Module
Gerencia persistência e cache:
- **IndexedDB Storage**: Armazenamento offline de simulações
- **Cache Management**: Sistema de cache inteligente
- **Data Hooks**: Hooks React para acesso aos dados

### UI Module
Interface do usuário:
- **Responsive Components**: Componentes mobile-first
- **Chart Components**: Visualizações interativas
- **Form Components**: Formulários de entrada de dados
- **Layout System**: Sistema de layouts responsivos

## 🎯 Roadmap

### Fase 1: Foundation (Semanas 1-2)
- [x] Setup inicial do projeto
- [x] Configuração da arquitetura
- [ ] Implementação do core de cálculos
- [ ] Testes unitários básicos

### Fase 2: UI & Simulation (Semanas 3-4)
- [ ] Design system e componentes base
- [ ] Interface de simulação
- [ ] Integração com engine de cálculos
- [ ] Gráficos interativos

### Fase 3: PWA & Optimization (Semanas 5-6)
- [ ] Configuração PWA completa
- [ ] Implementação offline-first
- [ ] Otimizações de performance
- [ ] Testes E2E

### Fase 4: Deploy & Polish (Semana 7)
- [ ] Pipeline CI/CD
- [ ] Deploy em produção
- [ ] Documentação final
- [ ] Feedback e ajustes

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

Bruno - [GitHub](https://github.com/zaneli93/zaneli93)

Link do Projeto: [https://github.com/username/analytical-chemistry-pwa](https://github.com/username/analytical-chemistry-pwa) 
