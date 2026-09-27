/**
 * CadenceForge Metrics & Stylometrics Engine
 * Calculates burstiness, cadence traps, lexical diversity, and authenticity scores.
 */

import { RULES } from './rules.js';

export class MetricsEngine {
  /**
   * Split raw prose into structured sentences with positional and word metadata.
   */
  static tokenizeSentences(text) {
    if (!text || typeof text !== 'string') return [];

    // Clean normalized text for robust sentence boundary detection
    const normalized = text.trim();
    if (!normalized) return [];

    // Match sentences with punctuation boundary preserving delimiters
    const regex = /[^.!?\n]+([.!?]+|$)/g;
    const matches = normalized.match(regex) || [];

    const sentences = [];
    let runningCharIndex = 0;

    matches.forEach((rawChunk, index) => {
      const trimmed = rawChunk.trim();
      if (!trimmed) return;

      // Extract words
      const words = trimmed
        .replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF-]/gi, ' ')
        .split(/\s+/)
        .filter(w => w.length > 0);

      const wordCount = words.length;
      if (wordCount === 0) return;

      const startIndex = text.indexOf(trimmed, runningCharIndex);
      const endIndex = startIndex + trimmed.length;
      runningCharIndex = endIndex;

      // Classify cadence category
      let cadenceType = 'normal';
      if (wordCount < 10) cadenceType = 'short';
      else if (wordCount >= RULES.CADENCE.TRAP_MIN && wordCount <= RULES.CADENCE.TRAP_MAX) cadenceType = 'trap';
      else if (wordCount >= 28) cadenceType = 'long';

      sentences.push({
        id: index + 1,
        text: trimmed,
        words,
        wordCount,
        cadenceType,
        startIndex,
        endIndex
      });
    });

    return sentences;
  }

  /**
   * Compute comprehensive stylometric metrics for a text block.
   */
  static analyze(text, language = 'en') {
    const sentences = this.tokenizeSentences(text);
    const totalSentences = sentences.length;

    if (totalSentences === 0) {
      return {
        totalWords: 0,
        totalSentences: 0,
        meanLength: 0,
        stdDev: 0,
        burstinessCV: 0,
        dashCount: 0,
        cadenceTraps: [],
        isBimodalSeesaw: false,
        typeTokenRatio: 0,
        hapaxCount: 0,
        authenticityScore: 0,
        riskLevel: 'clean',
        sentences: []
      };
    }

    // Word counts
    const wordCounts = sentences.map(s => s.wordCount);
    const totalWords = wordCounts.reduce((a, b) => a + b, 0);

    // Mean Sentence Length
    const meanLength = totalWords / totalSentences;

    // Standard Deviation & Coefficient of Variation (Burstiness CV)
    const variance = wordCounts.reduce((acc, count) => acc + Math.pow(count - meanLength, 2), 0) / totalSentences;
    const stdDev = Math.sqrt(variance);
    const burstinessCV = meanLength > 0 ? (stdDev / meanLength) : 0;

    // 17-23 Word Cadence Trap Sequences
    const cadenceTraps = [];
    let currentTrapRun = [];

    sentences.forEach((s, idx) => {
      if (s.wordCount >= RULES.CADENCE.TRAP_MIN && s.wordCount <= RULES.CADENCE.TRAP_MAX) {
        currentTrapRun.push(s.id);
      } else {
        if (currentTrapRun.length >= RULES.CADENCE.CONSECUTIVE_TRAP_THRESHOLD) {
          cadenceTraps.push([...currentTrapRun]);
        }
        currentTrapRun = [];
      }
    });
    if (currentTrapRun.length >= RULES.CADENCE.CONSECUTIVE_TRAP_THRESHOLD) {
      cadenceTraps.push([...currentTrapRun]);
    }

    // Detect 2026 Bimodal Seesaw Pattern:
    // Model fakes burstiness by alternating between very short (<8 words) and very long (>28 words)
    let bimodalAlternations = 0;
    for (let i = 0; i < sentences.length - 1; i++) {
      const curr = sentences[i].wordCount;
      const next = sentences[i + 1].wordCount;
      const isCurrShort = curr <= RULES.CADENCE.BIMODAL_SHORT_MAX;
      const isCurrLong = curr >= RULES.CADENCE.BIMODAL_LONG_MIN;
      const isNextShort = next <= RULES.CADENCE.BIMODAL_SHORT_MAX;
      const isNextLong = next >= RULES.CADENCE.BIMODAL_LONG_MIN;

      if ((isCurrShort && isNextLong) || (isCurrLong && isNextShort)) {
        bimodalAlternations++;
      }
    }
    const isBimodalSeesaw = totalSentences >= 4 && (bimodalAlternations / (totalSentences - 1)) > 0.45;

    // Strict Zero-Dash Tracking
    const dashMatches = text.match(RULES.DASH_REGEX) || [];
    const dashCount = dashMatches.length;

    // Lexical Diversity: Type-Token Ratio (TTR) & Hapax Legomena
    const allWords = sentences.flatMap(s => s.words.map(w => w.toLowerCase()));
    const freqMap = new Map();
    allWords.forEach(w => {
      freqMap.set(w, (freqMap.get(w) || 0) + 1);
    });

    const uniqueWords = freqMap.size;
    const typeTokenRatio = totalWords > 0 ? (uniqueWords / totalWords) : 0;

    let hapaxCount = 0;
    freqMap.forEach(count => {
      if (count === 1) hapaxCount++;
    });

    // Score Calculation (Target: 100 for authentic human prose)
    // Penalties applied for:
    // - Any Dash (>0 dashes = severe penalty, -18 pts per dash)
    // - Low Burstiness CV (human CV typically 0.45 - 0.90)
    // - Cadence Trap runs (-15 pts per sequence)
    // - Bimodal Seesaw penalty (-20 pts)
    // - Low TTR (<0.45 on texts >50 words)
    let baseScore = 95;

    // Dash penalty
    baseScore -= Math.min(dashCount * 18, 55);

    // Burstiness penalty or bonus
    if (burstinessCV < 0.25) {
      baseScore -= 28; // Metronome deadzone
    } else if (burstinessCV < 0.38) {
      baseScore -= 14;
    } else if (burstinessCV >= 0.48 && burstinessCV <= 0.85) {
      baseScore += 5; // Healthy organic human range
    }

    // Cadence trap penalty
    baseScore -= Math.min(cadenceTraps.length * 16, 32);

    // Bimodal seesaw penalty
    if (isBimodalSeesaw) {
      baseScore -= 22;
    }

    // TTR calibration
    if (totalWords > 40 && typeTokenRatio < 0.42) {
      baseScore -= 12;
    }

    const authenticityScore = Math.max(0, Math.min(100, Math.round(baseScore)));

    let riskLevel = 'clean';
    if (authenticityScore < 45) riskLevel = 'critical';
    else if (authenticityScore < 70) riskLevel = 'warning';
    else if (authenticityScore < 85) riskLevel = 'moderate';

    return {
      totalWords,
      totalSentences,
      meanLength: parseFloat(meanLength.toFixed(1)),
      stdDev: parseFloat(stdDev.toFixed(1)),
      burstinessCV: parseFloat(burstinessCV.toFixed(2)),
      dashCount,
      cadenceTraps,
      isBimodalSeesaw,
      typeTokenRatio: parseFloat(typeTokenRatio.toFixed(3)),
      hapaxCount,
      authenticityScore,
      riskLevel,
      sentences
    };
  }
}
