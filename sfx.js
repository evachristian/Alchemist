// ═══════════════════════════════════════════════════════════════
//  간단한 WebAudio 효과음 (에셋 없이 즉시 재생)
// ═══════════════════════════════════════════════════════════════
(function () {
  let ctx = null;
  function ac() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    return ctx;
  }
  function tone(freq, dur, type = 'sine', gain = 0.08, when = 0) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + when;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type; osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(c.destination);
    osc.start(t); osc.stop(t + dur);
  }
  const SFX = {
    play(name) {
      if (name === 'success') {
        tone(523, 0.12, 'triangle', 0.09, 0);
        tone(659, 0.12, 'triangle', 0.09, 0.1);
        tone(784, 0.22, 'triangle', 0.09, 0.2);
      } else if (name === 'fail') {
        tone(196, 0.25, 'sawtooth', 0.06, 0);
        tone(147, 0.3, 'sawtooth', 0.06, 0.12);
      } else if (name === 'pick') {
        tone(660, 0.08, 'sine', 0.06);
      }
    },
  };
  window.Sfx = SFX;
})();
