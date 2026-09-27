---
colors:
  canvas: "#0d0f12"
  surface-1: "#14171d"
  surface-2: "#1c2028"
  surface-3: "#252b36"
  hairline: "#2a313d"
  hairline-focus: "#3d4859"
  ink: "#edf0f5"
  ink-secondary: "#98a2b3"
  ink-muted: "#5f6b7c"
  primary: "#38bdf8"
  primary-hover: "#0284c7"
  primary-subtle: "rgba(56, 189, 248, 0.12)"
  success: "#34d399"
  success-subtle: "rgba(52, 211, 153, 0.12)"
  warning: "#fbbf24"
  warning-subtle: "rgba(251, 191, 36, 0.12)"
  danger: "#f87171"
  danger-subtle: "rgba(248, 113, 113, 0.14)"
  accent-indigo: "#818cf8"
typography:
  font-sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  font-mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace"
  font-serif: "'Newsreader', 'Georgia', serif"
  display-xl: "32px"
  title-lg: "20px"
  title-md: "15px"
  body-md: "13.5px"
  body-sm: "12px"
  code: "12px"
rounded:
  xs: "3px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  section: "40px"
components:
  editor-pane: "Hairline border, surface-1 background, monospace/serif toggleable typography"
  waveform-canvas: "Subtle grid, anti-aliased bars with semantic threshold colors"
  badge: "Subtle background, tabular numbers, 1px hairline border"
---

# DESIGN.md: CadenceForge System Specification

CadenceForge is an algorithmic prose rhythm workbench and anti-slop refactoring suite. The design follows an editorial workbench aesthetic, prioritizing clarity, dense information architecture, and micro-typographic control.

## 1. Visual Identity
- **Atmosphere**: Professional craft tool, reminiscent of high-end audio mastering consoles and typography studios.
- **Lighting Model**: Deep slate-black canvas (`#0d0f12`) with structured surfaces and sharp 1px borders.
- **Zero AI Slop**: Absolutely no neon purple/cyan glowing shadows, no blurry floating cards, and no excessive marketing fluff.

## 2. Color Discipline
- **Single Chromatic Accent**: Electric Sky (`#38bdf8`) for primary interactions and focus states.
- **Semantic Signals**:
  - `danger` (`#f87171`): Em/en dash infractions, 17-23 word cadence deadband, high-slop puffery.
  - `warning` (`#fbbf24`): Bimodal seesaw fluctuations, repetitive clause beginnings, translationese.
  - `success` (`#34d399`): Authentic high-burstiness variance, clean zero-dash compliance.
  - `accent-indigo` (`#818cf8`): Audio sonification and sentence boundary markers.

## 3. Typography & Numerics
- Body and controls utilize clean geometric sans (`Inter`).
- Metric badges and telemetry readouts strictly enforce `font-variant-numeric: tabular-nums` to eliminate layout jitter during live text processing.
- Editor supports switching between editorial serif (`Newsreader`) and technical monospace (`JetBrains Mono`).

## 4. Interaction Principles
- Instant reactive recalculation on input (sub-16ms layout loop).
- Interactive rhythm sonifier with Web Audio oscillator pulses.
- Granular surgical review cards allowing one-click apply or discard.
