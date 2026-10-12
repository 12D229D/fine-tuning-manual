# Plan y Bitácora — Manual y Guía de Fine-Tuning en HTML5

## 📌 Resumen

SPA interactiva (HTML5 semántico + CSS3 Vanilla + JS ES6+, 100% sin dependencias, sin 
ode_modules, sin build step) que documenta **Fine-Tuning de LLMs**: conceptos, técnicas de ajuste fino completo (*Full Fine-Tuning*) frente a optimización de parámetros eficientes (*PEFT/LoRA/QLoRA*), preparación de datos sintéticos, hiperparámetros y evaluación de pérdida.

Incluye el playground interactivo "Model Playground" para inspección de arquitecturas y modelos en memoria.

Todo el proyecto vive dentro de la carpeta FINE-TUNING/ en cumplimiento con AGENTS.md.

---

## 🎯 Objetivos

- [x] Proveer una SPA responsiva, accesible y de diseño futurista sobre **Fine-Tuning**.
- [x] Explicar la diferencia entre Pre-entrenamiento, Instruction Tuning, SFT (Supervised Fine-Tuning) y RLHF/DPO.
- [x] Documentar PEFT (Parameter-Efficient Fine-Tuning): LoRA, QLoRA, Prefix Tuning, Adapters.
- [x] Incluir el "Model Playground" interactivo para inspeccionar parámetros y configuraciones de modelos.
- [x] Disponer de tema claro/oscuro persistente, navegación SPA y buscador en tiempo real.

---

## 🏗️ Arquitectura de Archivos

- **Patrón**: SPA modular interactiva sin dependencias con simulador de hiperparámetros.

`	ext
FINE-TUNING/
├── index.html          # SPA por secciones (#hash), sidebar + buscador + demo Model Playground
├── css/
│   └── styles.css      # Sistema de diseño con tokens dark/light y glassmorphism
├── js/
│   └── app.js          # Lógica interactiva JS (Model Playground, buscador, navegación)
├── README.md           # Guía de apertura y navegación del subproyecto
└── plan.md             # Este archivo (plan + bitácora)
`

---

## 🧠 Paradigma de Programación

- **Híbrido: Declarativo + Event-Driven**
- Renderizado declarativo de especificaciones y manejo reactivo de eventos para la simulación de parámetros en el playground.

---

## 🌐 Propósito de Visibilidad y Destino Remoto

- **Visibilidad**: Público (Open Source / Portafolio).
- **Plataforma Remota Asignada**: GitHub.
- **Plataforma de Despliegue CI/CD**: GitHub Pages / Cloudflare Pages.
- **Justificación**: Guía abierta de Fine-Tuning y técnicas PEFT/LoRA con simulador interactivo para LLMs en el cliente; óptimo para GitHub Pages.

---

## 📊 Estado Actual

🟢 **Completado** — Entregable interactivo verificado.
