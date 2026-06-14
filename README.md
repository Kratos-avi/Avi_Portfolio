# 🌌 Avi_Portfolio — Quantum-Aesthetic Developer Workstation

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r184-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-F1F?style=for-the-badge&logo=framer-motion&logoColor=white)](https://www.framer.com/motion/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A hyper-interactive, premium, retro-cyberpunk developer portfolio and interactive workstation. Built with **React 18**, **Three.js**, **Framer Motion**, and **Tailwind CSS**, this workspace features live WebGL physics rendering, spatial sound effects, a telemetry HUD, and interactive widgets simulating developer workstations, terminal interfaces, and 3D sandboxes.

---

## 🌟 Key Features

*   **🌌 3D WebGL Particle Background**: Driven by interactive GLSL-like shaders that morph, swirl, and drift based on user input. Includes particle density control, gravitational lensing, and speed multipliers.
*   **💾 Cyberpunk Telemetry HUD**: Floating margins monitoring system load (CPU load, Ping, coordinates, and real-time WebGL engine telemetry logs).
*   **🛠️ Physics & Visual Sandbox**: Allows live manipulation of gravity, system speed, star density, color theme profiles (Cyan, Matrix, Crimson, Gold), wireframe mesh toggle, and digital glitch overlay.
*   **📂 Developer Workstations**: Interactive dashboard panels containing:
    *   **Experience Deck**: A fully interactive stacked deck of career timeline cards.
    *   **Game Simulator**: Embedded retro gameplay console.
    *   **Interactive Terminal**: A simulated CLI responding to commands with custom output.
    *   **Render Queue / Mobile Preview**: Simulates building rendering pipelines and responsive previews.
*   **💿 Fluid Audio System**: An ambient drone volume control system coupled with high-fidelity UI click/hover feedback and tick indicators.
*   **👾 Cybernetic Bootloader**: Retro-futuristic terminal boot loader checking system files and diagnostic states prior to mounting the main view.

---

## 🛠️ Tech Stack & Ecosystem

| Layer | Technologies | Role / Feature |
| :--- | :--- | :--- |
| **Frontend Core** | React 18, TypeScript 6, Vite | Core structure, strict typing, high-speed HMR |
| **Styling & Theme** | Tailwind CSS v3, PostCSS | Glassmorphism, HSL tailormade colors, responsive layouts |
| **Animation & 3D** | Three.js, Framer Motion | WebGL canvas, particle physics, page transitions |
| **Utilities** | Lucide React, React-PDF | Custom icons, real-time PDF resume rendering |
| **Systems Audio** | Web Audio API / Custom SoundManager | Spatial audio drones, micro-interaction ticks |

---

## 📂 Project Architecture

```filepath
Avi_Portfolio/
├── public/                 # Static assets & graphics
├── src/
│   ├── assets/             # Brand logos & background images
│   ├── components/
│   │   ├── common/         # Custom cursors, scrollbars, startup loaders
│   │   ├── pdf/            # PDF resume generation components
│   │   ├── sections/       # Primary page sections (Hero, About, Sandbox, Projects, Contact)
│   │   ├── webgl/          # Three.js environments (Particles, TechOrbit, TopologyMap)
│   │   └── widgets/        # Complex widgets (Terminal, ExperienceDeck, GameSim)
│   ├── utils/              # SoundManager and system helpers
│   ├── App.tsx             # Application coordinator and global states
│   ├── index.css           # Design tokens and custom animations
│   └── main.tsx            # Main Entry Point
├── package.json            # Scripts & dependencies
└── tsconfig.json           # Compiler rules
```

---

## 🚀 Quick Start

### Prerequisites
*   Node.js (v18+ recommended)
*   npm or yarn

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/Kratos-avi/Avi_Portfolio.git
    cd Avi_Portfolio
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the development server:
    ```bash
    npm run dev
    ```

### Production Build
To build the project for optimal production performance:
```bash
npm run build
npm run preview
```

---

## 🎨 Creative Aesthetics

This portfolio is styled under a theme of **Quantum Minimalist Cyberpunk**:
*   **Vibrant HSL Accent Colors**: Switchable colors representing custom terminal modes (Cyan, Emerald Green, Crimson Red, Gold).
*   **Glassmorphic Interfaces**: Frosted panels blending seamlessly into the WebGL particle nebula.
*   **Fluid Custom Cursor**: Follows user input with custom spring-damping velocity trackers.
*   **Retro Shooting Stars & Nebula**: Drifting particle dust and random shooting star vectors to keep the page feeling alive.
