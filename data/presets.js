/**
 * CadenceForge Curated Benchmark Presets
 * Highlighting AI slop patterns (2025-2026) and authentic human contrast.
 */

export const PRESETS = [
  {
    id: 'ai-slop-id',
    name: 'Bahasa Indonesia: Slop Korporat & Birokrasi',
    language: 'id',
    tier: 'tier2',
    description: 'Banjir em dash, pembuka klise temporal, trigram AI 2026, dan jebakan ritme 17-23 kata.',
    text: `Di era modern ini, adopsi teknologi kecerdasan buatan telah berkembang dengan sangat pesat di seluruh sektor industri — terutama pada perbankan digital.

Teknologi ini berperan penting dalam membentuk fondasi efisiensi operasional bagi perusahaan rintisan yang ingin mengoptimalkan layanannya. Seiring perkembangan zaman, tidak hanya efisiensi biaya yang meningkat, tetapi juga kepuasan nasabah turut mengalami kenaikan yang signifikan. Para pemangku kepentingan perlu menyadari bahwa ekosistem digital ini menuntut transformasi holistik. Melalui kolaborasi strategis, perusahaan mampu untuk memfasilitasi kebutuhan pasar di mana pengguna memerlukan solusi cepat. 

Dapat disimpulkan bahwa, satu hal yang jelas: sinergi berkelanjutan adalah kunci utama kesuksesan organisasi di masa depan.`
  },
  {
    id: 'ai-slop-en-corporate',
    name: 'English: Corporate AI Press Release',
    language: 'en',
    tier: 'tier2',
    description: 'Monotonous 17-23 word cadence, excessive em dashes, "delve", and "plays a crucial role in shaping".',
    text: `In today's fast-paced digital landscape, modern engineering organizations must continuously adapt their software architecture — particularly within cloud infrastructure.

Our unified developer platform plays a crucial role in shaping the future of autonomous deployment workflows across distributed enterprises. Not only does this transformative solution foster cross-team collaboration, but it also seamlessly accelerates continuous integration cycles. It is worth noting that organizations can now delve into granular telemetry to optimize infrastructure costs. By ensuring that system resilience remains high, teams can navigate complex technical debts with agility.

In conclusion, one thing is clear: embracing a holistic engineering mindset serves as a testament to operational excellence.`
  },
  {
    id: 'ai-slop-en-academic',
    name: 'English: Claude / GPT Bimodal Essay',
    language: 'en',
    tier: 'tier1',
    description: 'Artificial bimodal seesaw (fragment alternating with 40-word run-on), hedge stacking, and paired dashes.',
    text: `Context matters. While this perspective can understandably provoke skepticism, generally speaking, in most cases, researchers observe that the historical evidence remains nuanced. 

Speed kills. By examining the structural tensions inherent within distributed consensus protocols — especially when network latency fluctuates under adversarial conditions — engineers often find themselves grappling with unresolvable state paradoxes. 

Patience wins. One cannot simply ignore the empirical reality.`
  },
  {
    id: 'human-authentic-id',
    name: 'Bahasa Indonesia: Prosa Otentik Manusia',
    language: 'id',
    tier: 'tier2',
    description: 'Burstiness tinggi, tanpa em dash, ritme dinamis, dan verba konkret langsung.',
    text: `Gaji naik 6,5 persen tahun kemarin. Tapi harga beras di pasar naik sampai 12 persen, jadi daya beli tetap saja kebanting.

Banyak tim produk mengira fitur baru bakal otomatis dipakai user. Kenyataannya, tiga startup di Jakarta Selatan yang saya temui justru kehilangan 20 persen pengguna aktif setelah merilis antarmuka baru yang rumit. Tombol yang tadinya gampang ditekan malah disembunyikan di balik menu dropdown. 

Kalau sistem dasarnya sudah lambat, animasi mulus pun nggak bakal menyelamatkan produk.`
  },
  {
    id: 'human-authentic-en',
    name: 'English: Authentic Human Prose',
    language: 'en',
    tier: 'tier2',
    description: 'Organic sentence length distribution, zero dashes, assertive opinions, and zero puffery.',
    text: `The build broke at 3 AM. Nobody had touched the payment gateway in weeks, yet Stripe webhooks were suddenly throwing 500 errors across three staging environments.

A junior developer had bumped a transitive dependency inside the serialization layer. It looked completely harmless in the pull request. But that single patch changed how timestamps were formatted in UTC, breaking downstream verification keys. We spent five hours reverting commits and apologizing to merchants.

Good logging saves reputations.`
  }
];
