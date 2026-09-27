/**
 * CadenceForge Rules & Heuristics Engine
 * Exhaustive patterns derived from anti-slop-writing-en and anti-slop-writing-id specifications.
 */

export const RULES = {
  // Punctuation Policy: Strict Zero-Dash
  DASH_REGEX: /[—–]/g,
  EM_DASH: '—',
  EN_DASH: '–',

  // Cadence parameters (2026 Detection Frontier)
  CADENCE: {
    TRAP_MIN: 17,
    TRAP_MAX: 23,
    CONSECUTIVE_TRAP_THRESHOLD: 3,
    BIMODAL_SHORT_MAX: 7,
    BIMODAL_LONG_MIN: 28,
  },

  // English Lexical & Structural Banlist
  EN: {
    // Exact Trigrams and AI-ism Clichés
    TRIGRAMS_AND_PHRASES: [
      {
        pattern: /\bplays?\s+(a\s+)?(crucial|pivotal|key|vital|fundamental|essential|significant)\s+role\s+in\s+shaping\b/gi,
        category: 'cliche-trigram',
        name: 'AI Trigram Archetype',
        suggestion: 'Replace with direct active verb (e.g., "shapes", "governs", "directs")',
        fix: 'shapes'
      },
      {
        pattern: /\bplays?\s+(a\s+)?(crucial|pivotal|key|vital|fundamental|essential|significant)\s+role\s+in\b/gi,
        category: 'cliche-trigram',
        name: 'Empty Role Cliché',
        suggestion: 'State the concrete action directly instead of claiming a role',
        fix: 'drives'
      },
      {
        pattern: /\bserves?\s+as\s+a\s+testament\s+to\b/gi,
        category: 'puffery-phrase',
        name: 'Testament Cliché',
        suggestion: 'State the evidence or concrete metric',
        fix: 'demonstrates'
      },
      {
        pattern: /\b(delve|delves|delving)\s+into\b/gi,
        category: 'dead-giveaway',
        name: 'Delve Trigger',
        suggestion: 'Use "explore", "examine", "inspect", or "study"',
        fix: 'examine'
      },
      {
        pattern: /\bin\s+today's\s+fast-paced\s+(world|digital\s+landscape|society)\b/gi,
        category: 'opener-slop',
        name: 'Temporal Boilerplate Opener',
        suggestion: 'Drop the opening filler or start with specific data/year',
        fix: 'Currently'
      },
      {
        pattern: /\bit\s+is\s+worth\s+noting\s+that\b/gi,
        category: 'padding',
        name: 'Hedge Padding',
        suggestion: 'Remove entirely and state the claim directly',
        fix: ''
      },
      {
        pattern: /\bit\s+is\s+important\s+to\s+remember\s+that\b/gi,
        category: 'padding',
        name: 'Preach Padding',
        suggestion: 'Omit and state the fact directly',
        fix: ''
      },
      {
        pattern: /\bnot\s+only\s+(.+?)\s+but\s+(also\s+)?(.+?)\b/gi,
        category: 'negative-parallelism',
        name: 'Negative Parallelism Cliché',
        suggestion: 'State directly what both elements are without theatrical polarity',
        fix: null
      },
      {
        pattern: /\bfrom\s+([a-zA-Z\s]+)\s+to\s+([a-zA-Z\s]+)\b/gi,
        category: 'fake-spectrum',
        name: 'Fake Figurative Spectrum',
        suggestion: 'Verify if range is strictly quantitative or a vague figurative sweep',
        fix: null
      },
      {
        pattern: /\b(in\s+essence|at\s+its\s+core|fundamentally\s+speaking)\b/gi,
        category: 'philosophical-padding',
        name: 'Abstract Anchor Filler',
        suggestion: 'Remove padding and declare the insight',
        fix: ''
      },
      {
        pattern: /\b(one\s+thing\s+is\s+clear|the\s+key\s+takeaway\s+is)\b/gi,
        category: 'wrapup-slop',
        name: 'Model Wrap-up Artifact',
        suggestion: 'Conclude on an assertive concrete point rather than a recap signal',
        fix: ''
      },
      {
        pattern: /\bensuring\s+(that\s+)?/gi,
        category: 'padding-verb',
        name: 'Ensuring / Padding Participle',
        suggestion: 'Specify the causal mechanism directly',
        fix: 'so that '
      }
    ],

    // Puffery adjectives & buzzwords
    PUFF_WORDS: [
      { word: 'transformative', replacement: 'effective', reason: 'Unbacked puffery adjective' },
      { word: 'pivotal', replacement: 'key', reason: 'High AI frequency indicator' },
      { word: 'crucial', replacement: 'needed', reason: 'Artificial urgency inflation' },
      { word: 'comprehensive', replacement: 'thorough', reason: '24.5x human frequency in Claude' },
      { word: 'tapestry', replacement: 'network', reason: 'Classic legacy AI metaphor' },
      { word: 'landscape', replacement: 'environment', reason: 'AI default spatial metaphor' },
      { word: 'beacon', replacement: 'model', reason: 'Melodramatic trope' },
      { word: 'holistic', replacement: 'unified', reason: 'Overused corporate filler' },
      { word: 'seamlessly', replacement: 'smoothly', reason: 'Unverifiable marketing adverb' },
      { word: 'foster', replacement: 'build', reason: 'Weak abstract verb' },
      { word: 'harness', replacement: 'use', reason: 'Melodramatic utility verb' },
      { word: 'unleash', replacement: 'release', reason: 'Sensationalist filler' },
      { word: 'resonate', replacement: 'connect', reason: 'Corporate emotional puffery' },
      { word: 'synergy', replacement: 'alignment', reason: 'Consultant jargon' }
    ]
  },

  // Indonesian Lexical & Structural Banlist
  ID: {
    TRIGRAMS_AND_PHRASES: [
      {
        pattern: /\bberperan\s+(sangat\s+)?(penting|krusial|kunci)\s+dalam\s+membentuk\b/gi,
        category: 'cliche-trigram',
        name: 'Trigram AI Teratas 2026',
        suggestion: 'Ganti langsung dengan tindakan konkret (misal: "menentukan", "mengarahkan")',
        fix: 'menentukan'
      },
      {
        pattern: /\bberperan\s+(sangat\s+)?(penting|krusial|kunci)\s+dalam\b/gi,
        category: 'cliche-trigram',
        name: 'Klausa Peran Klise',
        suggestion: 'Sebutkan kontribusi nyata tanpa pembungkus "berperan penting"',
        fix: 'mendorong'
      },
      {
        pattern: /\bdi\s+era\s+(modern|digital|globalisasi)\s+ini\b/gi,
        category: 'opener-slop',
        name: 'Pembuka Temporal Klise',
        suggestion: 'Mulai langsung dengan fakta angka atau konteks tahun berjalan',
        fix: 'Sekarang'
      },
      {
        pattern: /\bseiring\s+(dengan\s+)?perkembangan\s+zaman\b/gi,
        category: 'opener-slop',
        name: 'Pembuka Klise Temporal',
        suggestion: 'Hapus dan langsung sebutkan pergeseran yang terjadi',
        fix: ''
      },
      {
        pattern: /\bperlu\s+(kita\s+)?(diingat|disadari|diketahui)\s+bahwa\b/gi,
        category: 'preach-padding',
        name: 'Padding Nasihat AI',
        suggestion: 'Hapus frasa pengantar dan nyatakan langsung faktanya',
        fix: ''
      },
      {
        pattern: /\bdapat\s+disimpulkan\s+bahwa\b/gi,
        category: 'wrapup-slop',
        name: 'Penutup Formulaik',
        suggestion: 'Tutup dengan posisi tegas tanpa aba-aba kesimpulan',
        fix: ''
      },
      {
        pattern: /\bpada\s+akhirnya,\s+/gi,
        category: 'wrapup-slop',
        name: 'Penutup Klise "Pada Akhirnya"',
        suggestion: 'Hapus dan biarkan kalimat konklusif berdiri sendiri',
        fix: ''
      },
      {
        pattern: /\btidak\s+dapat\s+dipungkiri\s+(bahwa\s+)?/gi,
        category: 'padding',
        name: 'Penghalusan Otoritatif',
        suggestion: 'Hapus pengisi ini',
        fix: ''
      },
      {
        pattern: /\btidak\s+hanya\s+(.+?)\s+tetapi\s+juga\s+(.+?)\b/gi,
        category: 'negative-parallelism',
        name: 'Parallelisme Negatif AI',
        suggestion: 'Nyatakan kedua hal secara alami tanpa kontras berlebihan',
        fix: null
      },
      {
        pattern: /\bbukan\s+hanya\s+(.+?)\s+melainkan\s+(juga\s+)?(.+?)\b/gi,
        category: 'negative-parallelism',
        name: 'Parallelisme Negatif AI',
        suggestion: 'Nyatakan fakta secara langsung',
        fix: null
      },
      {
        pattern: /\bdi\s+mana\s+(kita|peserta|pengguna|masyarakat|orang)\b/gi,
        category: 'translationese',
        name: 'Kalke "Where" sebagai Relatif',
        suggestion: 'Ganti "di mana" dengan "tempat" atau restrukturisasi kalimat aktif',
        fix: 'tempat $1'
      },
      {
        pattern: /\b(menyelami|menelisik)\s+lebih\s+dalam\b/gi,
        category: 'dead-giveaway',
        name: 'Kalke "Delve Deeper"',
        suggestion: 'Gunakan "membahas", "menguji", atau "mengecek"',
        fix: 'menguji'
      },
      {
        pattern: /\b(tantangan\s+dan\s+peluang|kelebihan\s+dan\s+kekurangan)\b/gi,
        category: 'formulaic-pair',
        name: 'Pasangan Biner AI',
        suggestion: 'Pilih fokus spesifik, jangan memasangkan secara refleks',
        fix: 'kondisi'
      },
      {
        pattern: /\bsatu\s+hal\s+yang\s+(pasti|jelas)\b/gi,
        category: 'wrapup-slop',
        name: 'Kalke "One Thing is Clear"',
        suggestion: 'Potong frasa dan langsung ke poin utama',
        fix: ''
      }
    ],

    // Puffery kata & kata kerja analitis berlebihan
    PUFF_WORDS: [
      { word: 'menyoroti', replacement: 'mencatat', reason: 'Kata kerja analitis pasif berulang' },
      { word: 'menggarisbawahi', replacement: 'menegaskan', reason: 'Kalke "underscore"' },
      { word: 'memfasilitasi', replacement: 'membantu', reason: 'Jargon birokrasi berlebih' },
      { word: 'mengoptimalkan', replacement: 'memperbaiki', reason: 'Buzzword optimasi kosong' },
      { word: 'optimalisasi', replacement: 'perbaikan', reason: 'Nominalisasi birokratik' },
      { word: 'transformasi digital', replacement: 'digitalisasi sistem', reason: 'Buzzword korporat samar' },
      { word: 'ekosistem', replacement: 'lingkungan kerja', reason: 'Metafora figuratif klise' },
      { word: 'paradigma', replacement: 'sudut pandang', reason: 'Kosakata akademik semu' },
      { word: 'sinergi', replacement: 'kerja sama', reason: 'Buzzword klasik' },
      { word: 'lanskap', replacement: 'kondisi pasar', reason: 'Kalke "landscape"' },
      { word: 'holistik', replacement: 'menyeluruh', reason: 'Pengisi pujian samar' },
      { word: 'komprehensif', replacement: 'lengkap', reason: 'Puffery kata sifat' },
      { word: 'inovatif', replacement: 'baru', reason: 'Pujian tanpa bukti nyata' },
      { word: 'berkelanjutan', replacement: 'jangka panjang', reason: 'Buzzword kosong tanpa metrik' },
      { word: 'fundamental', replacement: 'mendasar', reason: 'Pujian abstrak' },
      { word: 'krusial', replacement: 'perlu', reason: 'Inflasi urgensi' },
      { word: 'signifikan', replacement: 'besar', reason: 'Adverbia tanpa angka pembuktian' }
    ]
  },

  // Discourse particles for Bahasa Indonesia by register tier
  ID_PARTICLES: {
    tier1: { allowedPer500: 1, allowed: ['memang', 'tentu'] },
    tier2: { allowedPer500: 4, allowed: ['sih', 'kan', 'kok', 'ya', 'udah', 'nggak'] },
    tier3: { allowedPer500: 12, allowed: ['sih', 'dong', 'deh', 'lho', 'kan', 'kok', 'nih', 'tuh', 'ya', 'nah', 'lah'] }
  }
};
