/**
 * CadenceForge Active Surgical Engine
 * Performs multi-pass prose refactoring, eliminates em/en dashes, and breaks AI sentence DNA.
 */

import { RULES } from './rules.js';

export class SurgeonEngine {
  /**
   * Run the full multi-pass transformation pipeline on target text.
   */
  static refactor(text, options = {}) {
    const {
      language = 'en',
      registerTier = 'tier2', // tier1: formal, tier2: semi-formal, tier3: informal
      breakCadenceTraps = true,
      enforceZeroDash = true,
      cleanPuffery = true
    } = options;

    if (!text || typeof text !== 'string') {
      return { outputText: '', modifications: [] };
    }

    let currentText = text;
    const modifications = [];

    // PASS 1: Zero-Dash Decoupling
    if (enforceZeroDash) {
      const pass1 = this.decoupleDashes(currentText, language);
      currentText = pass1.text;
      modifications.push(...pass1.changes);
    }

    // PASS 2: AI Sentence DNA & Boilerplate Breaker
    const pass2 = this.breakSentenceDNA(currentText, language);
    currentText = pass2.text;
    modifications.push(...pass2.changes);

    // PASS 3: Slop Trigram & Fluff Stripper
    if (cleanPuffery) {
      const pass3 = this.stripSlopTrigrams(currentText, language);
      currentText = pass3.text;
      modifications.push(...pass3.changes);
    }

    // PASS 4: Cadence & Run-on Sculptor (17-23 Word Trap Decoupling)
    if (breakCadenceTraps) {
      const pass4 = this.sculptCadence(currentText, language);
      currentText = pass4.text;
      modifications.push(...pass4.changes);
    }

    // PASS 5: Indonesian Translationese & Register Normalizer
    if (language === 'id') {
      const pass5 = this.normalizeIndonesianRegister(currentText, registerTier);
      currentText = pass5.text;
      modifications.push(...pass5.changes);
    }

    // Final normalization of whitespace
    const cleanedOutput = currentText
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s+\n/g, '\n\n')
      .trim();

    return {
      outputText: cleanedOutput,
      modifications
    };
  }

  /**
   * PASS 1: Intelligent Zero-Dash Decoupling.
   * Decouples em-dashes and en-dashes into context-appropriate periods, commas, or parentheses.
   */
  static decoupleDashes(text, language) {
    const changes = [];
    let modified = text;

    // Range patterns (e.g. 2020—2025 or 10–15)
    const rangeRegex = /(\d+)\s*[—–]\s*(\d+)/g;
    modified = modified.replace(rangeRegex, (match, p1, p2) => {
      const replacement = language === 'id' ? `${p1} sampai ${p2}` : `${p1}-${p2}`;
      changes.push({
        pass: 'zero-dash',
        title: 'Number Range Dash Replacement',
        original: match,
        replacement,
        reason: 'Eliminate en/em dash in numeric range; use natural range phrasing'
      });
      return replacement;
    });

    // Paired dashes acting as parenthetical aside: "... — some detail — ..." -> "... (some detail) ..."
    const pairedDashRegex = /\s*[—–]\s*([^—–\n]+?)\s*[—–]\s*/g;
    modified = modified.replace(pairedDashRegex, (match, inner) => {
      const replacement = ` (${inner.trim()}) `;
      changes.push({
        pass: 'zero-dash',
        title: 'Paired Parenthetical Dash Decoupling',
        original: match,
        replacement,
        reason: 'Claude/GPT paired em-dash converted to natural parenthetical notation'
      });
      return replacement;
    });

    // Trailing/Clause dash: "... — especially in urban areas." -> "... (especially in urban areas)." or comma
    const singleDashRegex = /\s*[—–]\s*/g;
    modified = modified.replace(singleDashRegex, (match, offset, str) => {
      // Look at context following the dash
      const subsequent = str.slice(offset + match.length, offset + match.length + 30).trim();
      let replacement = ', ';
      if (/^(especially|particularly|specifically|namely|terutama|khususnya)/i.test(subsequent)) {
        replacement = ', ';
      } else if (/^[A-Z]/.test(subsequent)) {
        replacement = '. ';
      }

      changes.push({
        pass: 'zero-dash',
        title: 'Single Clause Em-Dash Decoupled',
        original: match,
        replacement,
        reason: 'Enforce absolute Zero-Dash policy (number one human detection signal in 2026)'
      });
      return replacement;
    });

    return { text: modified, changes };
  }

  /**
   * PASS 2: Break AI Sentence DNA (Openers, Wrap-ups, Negative Parallelisms).
   */
  static breakSentenceDNA(text, language) {
    const changes = [];
    let modified = text;

    const ruleset = language === 'id' ? RULES.ID.TRIGRAMS_AND_PHRASES : RULES.EN.TRIGRAMS_AND_PHRASES;

    ruleset.forEach(rule => {
      if (rule.category === 'negative-parallelism') {
        if (language === 'id') {
          // "tidak hanya X tetapi juga Y" -> "X sekaligus Y"
          const npRegex = /\btidak\s+hanya\s+([^,]+?)\s*,\s*tetapi\s+juga\s+([^.!?]+)/gi;
          modified = modified.replace(npRegex, (match, p1, p2) => {
            const replacement = `${p1.trim()} sekaligus ${p2.trim()}`;
            changes.push({
              pass: 'sentence-dna',
              title: 'Negative Parallelism Neutralized',
              original: match,
              replacement,
              reason: 'Replaced artificial polarity with direct factual coordination'
            });
            return replacement;
          });
        } else {
          // "not only X but also Y" -> "both X and Y"
          const npRegex = /\bnot\s+only\s+([^,]+?)\s*,?\s*but\s+(also\s+)?([^.!?]+)/gi;
          modified = modified.replace(npRegex, (match, p1, p2, p3) => {
            const replacement = `both ${p1.trim()} and ${p3.trim()}`;
            changes.push({
              pass: 'sentence-dna',
              title: 'Negative Parallelism Neutralized',
              original: match,
              replacement,
              reason: 'Eliminated rhetorical contrast trope; stated facts directly'
            });
            return replacement;
          });
        }
      } else if (rule.pattern) {
        modified = modified.replace(rule.pattern, match => {
          const replacement = rule.fix !== null ? rule.fix : '';
          changes.push({
            pass: 'sentence-dna',
            title: rule.name,
            original: match,
            replacement: replacement || '[deleted]',
            reason: rule.suggestion
          });
          return replacement;
        });
      }
    });

    return { text: modified, changes };
  }

  /**
   * PASS 3: Strip Slop Trigrams and Corporate Puffery.
   */
  static stripSlopTrigrams(text, language) {
    const changes = [];
    let modified = text;
    const puffList = language === 'id' ? RULES.ID.PUFF_WORDS : RULES.EN.PUFF_WORDS;

    puffList.forEach(item => {
      const wordRegex = new RegExp(`\\b${item.word}\\b`, 'gi');
      modified = modified.replace(wordRegex, match => {
        // Preserve title case if source is capitalized
        let rep = item.replacement;
        if (/^[A-Z]/.test(match)) {
          rep = rep.charAt(0).toUpperCase() + rep.slice(1);
        }
        changes.push({
          pass: 'puffery-cleaner',
          title: `Slop Word Neutralized: "${match}"`,
          original: match,
          replacement: rep,
          reason: item.reason
        });
        return rep;
      });
    });

    return { text: modified, changes };
  }

  /**
   * PASS 4: Sculpt Cadence and Break 17-23 Word Trap.
   */
  static sculptCadence(text, language) {
    const changes = [];
    let modified = text;

    // Look for long sentences connected with heavy coordinating conjunctions and split them
    if (language === 'id') {
      const longCoordRegex = /([^.!?\n]{50,120})\s*,\s*(sehingga|namun|karena\s+itu|di\s+mana)\s+([^.!?\n]{30,100}[.!?])/gi;
      modified = modified.replace(longCoordRegex, (match, clause1, conj, clause2) => {
        const conjCap = conj.charAt(0).toUpperCase() + conj.slice(1);
        const replacement = `${clause1.trim()}. ${conjCap} ${clause2.trim()}`;
        changes.push({
          pass: 'cadence-sculptor',
          title: 'Cadence Run-on Decoupled',
          original: match,
          replacement,
          reason: 'Pecah klausa panjang menjadi dua kalimat independen untuk memicu burstiness alami'
        });
        return replacement;
      });
    } else {
      const longCoordRegex = /([^.!?\n]{50,120})\s*,\s*(furthermore|moreover|consequently|whereby)\s+([^.!?\n]{30,100}[.!?])/gi;
      modified = modified.replace(longCoordRegex, (match, clause1, conj, clause2) => {
        const conjCap = conj.charAt(0).toUpperCase() + conj.slice(1);
        const replacement = `${clause1.trim()}. ${conjCap} ${clause2.trim()}`;
        changes.push({
          pass: 'cadence-sculptor',
          title: 'Cadence Run-on Decoupled',
          original: match,
          replacement,
          reason: 'Split uniform middle-length run-on to restore human sentence burstiness'
        });
        return replacement;
      });
    }

    return { text: modified, changes };
  }

  /**
   * PASS 5: Indonesian Translationese & Register Normalizer.
   */
  static normalizeIndonesianRegister(text, registerTier) {
    const changes = [];
    let modified = text;

    // Replace unnatural "di mana" relative clauses
    const whereRegex = /\b([a-zA-Z]+)\s+di\s+mana\s+([a-zA-Z]+)\b/gi;
    modified = modified.replace(whereRegex, (match, prev, next) => {
      const replacement = `${prev} tempat ${next}`;
      changes.push({
        pass: 'indonesian-register',
        title: 'Translationese: "Di mana" sebagai Relatif',
        original: match,
        replacement,
        reason: 'Bahasa Indonesia tidak memakai "di mana" sebagai terjemahan kalke "where"'
      });
      return replacement;
    });

    // Remove redundant copula "adalah" when preceding basic predicates
    const copulaRegex = /\b([a-zA-Z]+)\s+adalah\s+(merupakan|sangat|sebuah|suatu)\b/gi;
    modified = modified.replace(copulaRegex, (match, subject, pred) => {
      const replacement = `${subject} ${pred}`;
      changes.push({
        pass: 'indonesian-register',
        title: 'Penghilangan Kopula Berlebih',
        original: match,
        replacement,
        reason: 'Bahasa Indonesia seringkali tidak memerlukan kopula "adalah" sebelum predikat'
      });
      return replacement;
    });

    // If tier 2 or 3, soften over-formal negation words
    if (registerTier === 'tier2' || registerTier === 'tier3') {
      const formalSubstitutions = [
        { from: /\btidak\b/gi, to: 'nggak', title: 'Kontraksi Percakapan: "nggak"' },
        { from: /\bsudah\b/gi, to: 'udah', title: 'Kontraksi Percakapan: "udah"' },
        { from: /\bmembuat\b/gi, to: 'bikin', title: 'Kata Kerja Aktif Alami: "bikin"' },
        { from: /\bsangat\b/gi, to: 'banget', title: 'Intensifier Percakapan: "banget"' }
      ];

      // Apply sparingly (only every second occurrence) to prevent artificial slang slop
      formalSubstitutions.forEach(item => {
        let count = 0;
        modified = modified.replace(item.from, match => {
          count++;
          if (count % 2 === 1) {
            changes.push({
              pass: 'indonesian-register',
              title: item.title,
              original: match,
              replacement: item.to,
              reason: 'Penyesuaian register semi-formal/santai agar tidak terbaca kaku seperti dokumen birokrasi'
            });
            return item.to;
          }
          return match;
        });
      });
    }

    return { text: modified, changes };
  }
}
