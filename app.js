/**
 * CadenceForge Main Application Controller
 */

import { MetricsEngine } from './engine/metrics.js';
import { SurgeonEngine } from './engine/surgeon.js';
import { SonifierEngine } from './engine/sonifier.js';
import { PRESETS } from './data/presets.js';

class CadenceForgeApp {
  constructor() {
    this.sonifier = new SonifierEngine();
    this.currentAnalysis = null;
    this.currentModifications = [];
    this.activeSentenceHighlight = null;

    this.cacheDom();
    this.initPresets();
    this.bindEvents();
    this.resizeCanvas();

    // Load initial preset
    this.loadPreset('ai-slop-id');
  }

  cacheDom() {
    // Top Controls
    this.presetSelect = document.getElementById('preset-select');
    this.langSelect = document.getElementById('lang-select');
    this.tierSelect = document.getElementById('tier-select');
    this.tierControlGroup = document.getElementById('tier-control-group');
    this.themeToggleBtn = document.getElementById('theme-toggle-btn');

    // Telemetry Elements
    this.metricScore = document.getElementById('metric-score');
    this.metricRiskBadge = document.getElementById('metric-risk-badge');
    this.metricCv = document.getElementById('metric-cv');
    this.metricCvTip = document.getElementById('metric-cv-tip');
    this.metricDashCount = document.getElementById('metric-dash-count');
    this.metricDashBadge = document.getElementById('metric-dash-badge');
    this.metricTrapCount = document.getElementById('metric-trap-count');
    this.metricTrapBadge = document.getElementById('metric-trap-badge');
    this.metricTtr = document.getElementById('metric-ttr');
    this.metricHapax = document.getElementById('metric-hapax');

    // Audio & Waveform
    this.sonifierBtn = document.getElementById('sonifier-btn');
    this.sonifierBtnLabel = document.getElementById('sonifier-btn-label');
    this.waveformCanvas = document.getElementById('waveform-canvas');

    // Editors & Panes
    this.sourceEditor = document.getElementById('source-editor');
    this.outputEditor = document.getElementById('output-editor');
    this.outputDiffView = document.getElementById('output-diff-view');
    this.inputWordStats = document.getElementById('input-word-stats');
    this.outputWordStats = document.getElementById('output-word-stats');

    this.clearInputBtn = document.getElementById('clear-input-btn');
    this.pasteInputBtn = document.getElementById('paste-input-btn');
    this.copyOutputBtn = document.getElementById('copy-output-btn');
    this.viewCleanBtn = document.getElementById('view-clean-btn');
    this.viewDiffBtn = document.getElementById('view-diff-btn');

    // Surgery Toggles & Action
    this.refactorBtn = document.getElementById('refactor-btn');
    this.toggleZeroDash = document.getElementById('toggle-zero-dash');
    this.toggleSentenceDna = document.getElementById('toggle-sentence-dna');
    this.togglePuffery = document.getElementById('toggle-puffery');
    this.toggleCadence = document.getElementById('toggle-cadence');

    // Inspector
    this.modCountBadge = document.getElementById('mod-count-badge');
    this.inspectorList = document.getElementById('inspector-list');
  }

  initPresets() {
    this.presetSelect.innerHTML = '<option value="" disabled selected>Load Benchmark Preset...</option>';
    PRESETS.forEach(preset => {
      const opt = document.createElement('option');
      opt.value = preset.id;
      opt.textContent = `${preset.name}`;
      this.presetSelect.appendChild(opt);
    });
  }

  bindEvents() {
    // Preset change
    this.presetSelect.addEventListener('change', e => {
      this.loadPreset(e.target.value);
    });

    // Language change
    this.langSelect.addEventListener('change', () => {
      const isId = this.langSelect.value === 'id';
      this.tierControlGroup.style.display = isId ? 'flex' : 'none';
      this.runAnalysisAndSurgery();
    });

    // Tier change
    this.tierSelect.addEventListener('change', () => {
      this.runAnalysisAndSurgery();
    });

    // Input editing
    this.sourceEditor.addEventListener('input', () => {
      this.runAnalysisAndSurgery();
    });

    // Surgical Run Button
    this.refactorBtn.addEventListener('click', () => {
      this.runSurgery();
    });

    // Toggles
    [this.toggleZeroDash, this.toggleSentenceDna, this.togglePuffery, this.toggleCadence].forEach(toggle => {
      toggle.addEventListener('change', () => {
        this.runSurgery();
      });
    });

    // Clear & Paste
    this.clearInputBtn.addEventListener('click', () => {
      this.sourceEditor.value = '';
      this.runAnalysisAndSurgery();
    });

    this.pasteInputBtn.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        this.sourceEditor.value = text;
        this.runAnalysisAndSurgery();
      } catch (err) {
        console.warn('Clipboard read failed:', err);
      }
    });

    // Copy Output
    this.copyOutputBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(this.outputEditor.value);
      const originalText = this.copyOutputBtn.innerHTML;
      this.copyOutputBtn.textContent = 'Copied!';
      setTimeout(() => {
        this.copyOutputBtn.innerHTML = originalText;
      }, 1500);
    });

    // Clean vs Diff view
    this.viewCleanBtn.addEventListener('click', () => {
      this.viewCleanBtn.classList.add('active');
      this.viewDiffBtn.classList.remove('active');
      this.outputEditor.style.display = 'block';
      this.outputDiffView.style.display = 'none';
    });

    this.viewDiffBtn.addEventListener('click', () => {
      this.viewDiffBtn.classList.add('active');
      this.viewCleanBtn.classList.remove('active');
      this.outputEditor.style.display = 'none';
      this.outputDiffView.style.display = 'block';
    });

    // Sonifier Button
    this.sonifierBtn.addEventListener('click', () => {
      this.toggleSonifier();
    });

    // Theme Toggle
    this.themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      this.drawWaveform();
    });

    // Window Resize for Canvas
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.drawWaveform();
    });
  }

  loadPreset(presetId) {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    this.sourceEditor.value = preset.text;
    this.langSelect.value = preset.language;
    this.tierSelect.value = preset.tier || 'tier2';
    this.tierControlGroup.style.display = preset.language === 'id' ? 'flex' : 'none';

    this.runAnalysisAndSurgery();
  }

  runAnalysisAndSurgery() {
    const text = this.sourceEditor.value;
    const language = this.langSelect.value;

    // Run stylometric analysis
    this.currentAnalysis = MetricsEngine.analyze(text, language);
    this.updateTelemetry(this.currentAnalysis);
    this.drawWaveform();

    // Auto-run surgery
    this.runSurgery();
  }

  runSurgery() {
    const text = this.sourceEditor.value;
    const language = this.langSelect.value;
    const registerTier = this.tierSelect.value;

    const result = SurgeonEngine.refactor(text, {
      language,
      registerTier,
      enforceZeroDash: this.toggleZeroDash.checked,
      breakCadenceTraps: this.toggleCadence.checked,
      cleanPuffery: this.togglePuffery.checked
    });

    this.outputEditor.value = result.outputText;
    this.currentModifications = result.modifications;

    // Update Output stats
    const outputAnalysis = MetricsEngine.analyze(result.outputText, language);
    this.outputWordStats.textContent = `${outputAnalysis.totalWords} words • ${outputAnalysis.totalSentences} sentences`;

    // Render Diff & Inspector
    this.renderDiffView(text, result.outputText, result.modifications);
    this.renderInspector(result.modifications);
  }

  updateTelemetry(metrics) {
    this.inputWordStats.textContent = `${metrics.totalWords} words • ${metrics.totalSentences} sentences`;

    // Human Score
    this.metricScore.textContent = metrics.authenticityScore;
    this.metricRiskBadge.className = 'badge';
    if (metrics.authenticityScore >= 80) {
      this.metricRiskBadge.classList.add('badge-clean');
      this.metricRiskBadge.textContent = 'Authentic';
    } else if (metrics.authenticityScore >= 55) {
      this.metricRiskBadge.classList.add('badge-warning');
      this.metricRiskBadge.textContent = 'Moderate Slop';
    } else {
      this.metricRiskBadge.classList.add('badge-danger');
      this.metricRiskBadge.textContent = 'Heavy AI Slop';
    }

    // Burstiness CV
    this.metricCv.textContent = metrics.burstinessCV.toFixed(2);
    if (metrics.burstinessCV < 0.35) {
      this.metricCvTip.textContent = 'Low Burstiness (Metronome)';
      this.metricCvTip.style.color = 'var(--danger)';
    } else if (metrics.burstinessCV > 0.90) {
      this.metricCvTip.textContent = 'Extreme Volatility';
      this.metricCvTip.style.color = 'var(--warning)';
    } else {
      this.metricCvTip.textContent = 'Optimal Human Pacing';
      this.metricCvTip.style.color = 'var(--success)';
    }

    // Dash Count
    this.metricDashCount.textContent = metrics.dashCount;
    this.metricDashBadge.className = 'badge';
    if (metrics.dashCount === 0) {
      this.metricDashBadge.classList.add('badge-clean');
      this.metricDashBadge.textContent = 'Zero-Dash Compliant';
    } else {
      this.metricDashBadge.classList.add('badge-danger');
      this.metricDashBadge.textContent = `${metrics.dashCount} Violations`;
    }

    // Cadence Traps
    const trapRuns = metrics.cadenceTraps.length;
    this.metricTrapCount.textContent = trapRuns;
    this.metricTrapBadge.className = 'badge';
    if (trapRuns === 0) {
      this.metricTrapBadge.classList.add('badge-clean');
      this.metricTrapBadge.textContent = 'Natural Cadence';
    } else {
      this.metricTrapBadge.classList.add('badge-danger');
      this.metricTrapBadge.textContent = `${trapRuns} Deadbands (17-23w)`;
    }

    // TTR & Hapax
    this.metricTtr.textContent = `${(metrics.typeTokenRatio * 100).toFixed(1)}%`;
    this.metricHapax.textContent = `${metrics.hapaxCount} hapax legomena`;
  }

  resizeCanvas() {
    const rect = this.waveformCanvas.parentElement.getBoundingClientRect();
    this.waveformCanvas.width = rect.width;
    this.waveformCanvas.height = rect.height;
  }

  drawWaveform() {
    const canvas = this.waveformCanvas;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (!this.currentAnalysis || this.currentAnalysis.sentences.length === 0) {
      ctx.fillStyle = 'rgba(150, 150, 150, 0.2)';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('No sentence cadence data available', width / 2, height / 2);
      return;
    }

    const sentences = this.currentAnalysis.sentences;
    const count = sentences.length;
    const maxWords = Math.max(35, ...sentences.map(s => s.wordCount));

    // Draw horizontal reference line for the 17-23 trap zone
    const trapYTop = height - (23 / maxWords) * (height - 20) - 10;
    const trapYBottom = height - (17 / maxWords) * (height - 20) - 10;
    ctx.fillStyle = 'rgba(248, 113, 113, 0.08)';
    ctx.fillRect(0, trapYTop, width, trapYBottom - trapYTop);

    // Calculate bar width and spacing
    const availableWidth = width - 40;
    const barWidth = Math.min(24, Math.max(6, (availableWidth / count) - 4));
    const gap = (availableWidth - (count * barWidth)) / Math.max(1, count - 1);

    sentences.forEach((s, idx) => {
      const x = 20 + idx * (barWidth + gap);
      const barHeight = (s.wordCount / maxWords) * (height - 24);
      const y = height - barHeight - 10;

      // Color mapping
      let color = '#34d399'; // Green (organic)
      if (s.wordCount < 10) color = '#38bdf8'; // Blue (short)
      else if (s.wordCount >= 17 && s.wordCount <= 23) color = '#f87171'; // Red (17-23 deadband)
      else if (s.wordCount >= 28) color = '#fbbf24'; // Yellow (flowing)

      // Highlight active playing bar from Sonifier
      if (this.activeSentenceHighlight === s.id) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 2, y - 4, barWidth + 4, barHeight + 8);
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
      ctx.fill();

      // Draw word count label above bar if enough space
      if (barWidth >= 14) {
        ctx.fillStyle = this.activeSentenceHighlight === s.id ? '#ffffff' : 'rgba(237, 240, 245, 0.7)';
        ctx.font = '9px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(s.wordCount, x + barWidth / 2, y - 3);
      }
    });
  }

  toggleSonifier() {
    if (this.sonifier.isPlaying) {
      this.sonifier.stop();
      this.sonifierBtn.classList.remove('playing');
      this.sonifierBtnLabel.textContent = 'Listen Cadence';
      this.activeSentenceHighlight = null;
      this.drawWaveform();
    } else {
      if (!this.currentAnalysis || this.currentAnalysis.sentences.length === 0) return;

      this.sonifierBtn.classList.add('playing');
      this.sonifierBtnLabel.textContent = 'Playing Cadence...';

      this.sonifier.playCadenceSequence(
        this.currentAnalysis.sentences,
        (sentenceId) => {
          this.activeSentenceHighlight = sentenceId;
          this.drawWaveform();
        },
        () => {
          this.sonifierBtn.classList.remove('playing');
          this.sonifierBtnLabel.textContent = 'Listen Cadence';
          this.activeSentenceHighlight = null;
          this.drawWaveform();
        }
      );
    }
  }

  renderDiffView(original, modified, modifications) {
    if (!original || !modified) {
      this.outputDiffView.innerHTML = '<span class="diff-empty">No diff available.</span>';
      return;
    }

    let diffHtml = '';
    // Highlight decoupled dashes and replaced phrases
    const paragraphs = modified.split('\n\n');
    paragraphs.forEach(p => {
      diffHtml += `<p style="margin-bottom: 12px;">${p}</p>`;
    });

    this.outputDiffView.innerHTML = diffHtml;
  }

  renderInspector(modifications) {
    this.modCountBadge.textContent = modifications.length;

    if (modifications.length === 0) {
      this.inspectorList.innerHTML = '<div class="inspector-empty">Zero interventions required. The prose is clean of detectable AI slop and passes the zero-dash policy.</div>';
      return;
    }

    this.inspectorList.innerHTML = '';
    modifications.forEach(mod => {
      const card = document.createElement('div');
      card.className = 'mod-card';
      card.innerHTML = `
        <div class="mod-card-header">
          <span>${mod.title}</span>
          <span class="mod-pass-pill">${mod.pass}</span>
        </div>
        <div class="mod-original">DEL: ${mod.original || '[empty]'}</div>
        <div class="mod-replacement">INS: ${mod.replacement || '[none]'}</div>
        <div class="mod-reason">${mod.reason}</div>
      `;
      this.inspectorList.appendChild(card);
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.cadenceForge = new CadenceForgeApp();
});
