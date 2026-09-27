# CadenceForge

> Prose Rhythm Sculptor, Sentence DNA Disrupter, and Heuristic Anti-Slop Rewriting Workbench.

CadenceForge adalah *real-time editorial workstation* berbasis browser untuk mendeteksi, mengaudit, dan merekayasa ulang teks agar lolos deteksi AI (Turnitin, GPTZero, Originality.ai) serta membaca otentik seperti tulisan manusia.

Berbeda dari sekadar linter pasif, CadenceForge bertindak sebagai mesin refaktor aktif multi-tahap yang secara khusus menargetkan pergeseran deteksi AI 2026: **keseragaman ritme (cadence uniformity)**, **jebakan kalimat 17-23 kata**, **sidik jari bimodal seesaw**, serta larangan keras **em dash dan en dash**.

---

## Fitur Utama

### 1. Multi-Pass Surgical Engine (5 Tahap Pembedahan)
- **Pass 1: Zero-Dash Decoupler**: Menghapus seluruh em dash dan en dash. Menggantinya secara kontekstual dengan tanda kurung, titik dua, koma, atau memecah klausa menjadi kalimat baru.
- **Pass 2: Sentence DNA Breaker**: Membongkar template argumen AI 4 bagian (Opening, Expansion, Contrast, Resolution). Menghilangkan pembuka klise ("Di era modern ini", "In today's fast-paced digital landscape"), parallelisme negatif ("Not only X, but also Y"), dan penutup formulaik.
- **Pass 3: Slop Weeder & Fluff Stripper**: Menetralkan trigram AI 2026 ("plays a crucial role in shaping", "berperan penting dalam"), puffery korporat ("transformative", "holistic", "komprehensif"), dan nominalisasi birokratis ("optimalisasi").
- **Pass 4: Cadence Sculptor (Pelepas Jebakan 17-23 Kata)**: Memecah run-on seragam di zona mati 17 sampai 23 kata untuk mengembalikan *burstiness* organik manusia.
- **Pass 5: Indonesian Translationese Normalizer**: Memperbaiki terjemahan kaku (seperti "di mana" sebagai kata ganti relatif), merapikan kopula "adalah", dan menyesuaikan partikel wacana (*sih, kan, kok, ya*) sesuai tingkatan register (Tier 1 Formal, Tier 2 Semi-formal, Tier 3 Informal).

### 2. Live Sentence Waveform Visualizer
Kanvas visual interaktif yang menampilkan distribusi panjang setiap kalimat secara real-time:
- **Biru**: Kalimat pendek (&lt;10 kata) untuk penekanan.
- **Hijau**: Kalimat berimbang (10-16 kata dan 24-27 kata).
- **Merah**: Zona mati seragam AI (rentang 17-23 kata).
- **Kuning**: Kalimat panjang mengalir (&ge;28 kata).

### 3. Acoustic Cadence Sonifier (Web Audio API)
Mendengar ritme tulisan layaknya metronom audio. Generator audio mensintesis ketukan per kalimat berdasarkan jumlah kata dan jeda tanda baca. Penulis dapat langsung mendengar apakah tulisan mereka berirama kaku seperti robot atau memiliki ayunan alami manusia.

### 4. Stylometric Telemetry
- **Human Authenticity Score**: Skoring terkalibrasi (0-100) berbasis penalti tanda pisah, burstiness CV, dan densitas slop.
- **Burstiness (CV)**: Koefisien variasi standar deviasi dibagi rata-rata panjang kalimat (rentang optimal manusia: 0.45 sampai 0.85).
- **Zero-Dash Compliance**: Status kepatuhan mutlak tanpa dash.
- **Lexical Diversity**: Type-Token Ratio (TTR) dan pelacak *hapax legomena* (kata unik berfrekuensi satu).

---

## Arsitektur Berkas

```
cadence-forge/
├── .gitignore             # Konfigurasi filter berkas Git
├── DESIGN.md              # Spesifikasi sistem desain VoltAgent/Stitch
├── LICENSE                # Lisensi MIT (IlhamXkyo)
├── README.md              # Dokumentasi teknis projek
├── index.html             # Tampilan antarmuka dual-pane workbench
├── styles.css             # Sistem desain editorial slate-black & hairline
├── app.js                 # Kontroler aplikasi & pengikat event DOM
├── engine/
│   ├── rules.js           # Kamus larangan leksikal, regex, & pola 2026
│   ├── metrics.js         # Kalkulator stylometrik, CV, & pembagian kalimat
│   ├── surgeon.js         # Mesin pembedahan & refaktor prosa 5-pass
│   └── sonifier.js        # Mesin audio pacing preview (Web Audio API)
└── data/
    └── presets.js         # Sampel benchmark AI vs Manusia (EN & ID)
```

---

## Cara Menjalankan

CadenceForge dibangun tanpa dependensi runtime atau proses *bundling*.

1. Klon repositori ini:
   ```bash
   git clone https://github.com/IlhamXkyo/cadence-forge.git
   cd cadence-forge
   ```

2. Buka berkas `index.html` langsung di browser modern (Chrome, Edge, Firefox, Safari):
   ```bash
   # Di Windows PowerShell:
   Start-Process index.html
   ```
   Atau gunakan server statis lokal sederhana jika diinginkan:
   ```bash
   npx serve .
   ```

---

## Lisensi

Didistribusikan di bawah lisensi MIT. Hak Cipta (c) 2026 IlhamXkyo.
