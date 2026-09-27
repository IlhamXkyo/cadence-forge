/**
 * CadenceForge Rhythm Sonifier Engine
 * Uses the Web Audio API to sonify sentence cadences into an acoustic pacing preview.
 * Allows writers to listen to the rhythm of their prose and detect robotic metronomic uniformity.
 */

export class SonifierEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentTimeout = null;
    this.onSentenceHighlight = null;
    this.onPlaybackFinished = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Play an acoustic pulse representing a sentence of a given word length.
   */
  playPulse(wordCount, isCadenceTrap = false) {
    if (!this.audioCtx) this.init();

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    // Map word length to acoustic frequency:
    // Short sentences (<10 words) = high crisp pitch (440Hz - 520Hz)
    // Cadence trap (17-23 words) = monotonous buzz (280Hz)
    // Long sentences (28+ words) = deep resonant bass (180Hz)
    let freq = 340;
    if (wordCount < 10) freq = 480;
    else if (isCadenceTrap) freq = 280;
    else if (wordCount >= 28) freq = 190;
    else freq = 340 - (wordCount - 10) * 8;

    osc.type = isCadenceTrap ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Duration scales slightly with word count (150ms to 450ms)
    const duration = Math.min(0.5, Math.max(0.12, (wordCount / 40) * 0.4));

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);

    return duration * 1000;
  }

  /**
   * Sequentially play the rhythm of all sentences in a text block.
   */
  playCadenceSequence(sentences, onHighlight, onFinish) {
    this.stop();
    this.init();
    this.isPlaying = true;
    this.onSentenceHighlight = onHighlight;
    this.onPlaybackFinished = onFinish;

    let index = 0;

    const playNext = () => {
      if (!this.isPlaying || index >= sentences.length) {
        this.stop();
        if (this.onPlaybackFinished) this.onPlaybackFinished();
        return;
      }

      const s = sentences[index];
      const isTrap = s.wordCount >= 17 && s.wordCount <= 23;

      if (this.onSentenceHighlight) {
        this.onSentenceHighlight(s.id, index);
      }

      const soundDuration = this.playPulse(s.wordCount, isTrap);

      // Acoustic pause between sentences proportional to natural human reading breath (300ms - 550ms)
      const interSentencePause = 350;
      index++;

      this.currentTimeout = setTimeout(playNext, soundDuration + interSentencePause);
    };

    playNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }
}
