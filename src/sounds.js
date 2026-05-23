let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

export function playWelcomeChime() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.3, now + i * 0.15 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.6);
  });
}

export function playGiftOpen() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  // Sparkly ascending arpeggio
  const notes = [392, 523.25, 659.25, 783.99, 987.77, 1174.66];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.25, now + i * 0.08 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.5);
  });
}

export function playCrystalReveal() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  // Magical shimmer
  for (let i = 0; i < 8; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 800 + Math.random() * 1200;
    gain.gain.setValueAtTime(0, now + i * 0.06);
    gain.gain.linearRampToValueAtTime(0.15, now + i * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.06);
    osc.stop(now + i * 0.06 + 0.4);
  }
}

// Background music - a cute looping melody using Web Audio API
let bgMusicNodes = null;

export function startBackgroundMusic() {
  if (bgMusicNodes) return;
  const ctx = getCtx();

  // Simple pentatonic melody that loops
  const melody = [
    { note: 523.25, dur: 0.3 },  // C5
    { note: 587.33, dur: 0.3 },  // D5
    { note: 659.25, dur: 0.3 },  // E5
    { note: 783.99, dur: 0.6 },  // G5
    { note: 659.25, dur: 0.3 },  // E5
    { note: 587.33, dur: 0.3 },  // D5
    { note: 523.25, dur: 0.6 },  // C5
    { note: 0,      dur: 0.3 },  // rest
    { note: 392.00, dur: 0.3 },  // G4
    { note: 440.00, dur: 0.3 },  // A4
    { note: 523.25, dur: 0.3 },  // C5
    { note: 587.33, dur: 0.6 },  // D5
    { note: 523.25, dur: 0.3 },  // C5
    { note: 440.00, dur: 0.3 },  // A4
    { note: 392.00, dur: 0.6 },  // G4
    { note: 0,      dur: 0.6 },  // rest
  ];

  const totalDuration = melody.reduce((sum, n) => sum + n.dur, 0);
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.12;
  masterGain.connect(ctx.destination);

  let stopped = false;

  function playLoop() {
    if (stopped) return;
    const now = ctx.currentTime;
    let offset = 0;

    melody.forEach(({ note, dur }) => {
      if (note === 0) { offset += dur; return; }
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = note;
      noteGain.gain.setValueAtTime(0, now + offset);
      noteGain.gain.linearRampToValueAtTime(0.5, now + offset + 0.04);
      noteGain.gain.setValueAtTime(0.5, now + offset + dur - 0.05);
      noteGain.gain.linearRampToValueAtTime(0, now + offset + dur);
      osc.connect(noteGain);
      noteGain.connect(masterGain);
      osc.start(now + offset);
      osc.stop(now + offset + dur);
      offset += dur;
    });

    setTimeout(() => playLoop(), totalDuration * 1000);
  }

  playLoop();

  // Also add a soft pad/drone for warmth
  const pad = ctx.createOscillator();
  const padGain = ctx.createGain();
  pad.type = "sine";
  pad.frequency.value = 261.63; // C4
  padGain.gain.value = 0.04;
  pad.connect(padGain);
  padGain.connect(ctx.destination);
  pad.start();

  const pad2 = ctx.createOscillator();
  const padGain2 = ctx.createGain();
  pad2.type = "sine";
  pad2.frequency.value = 392; // G4
  padGain2.gain.value = 0.025;
  pad2.connect(padGain2);
  padGain2.connect(ctx.destination);
  pad2.start();

  bgMusicNodes = {
    masterGain, pad, padGain, pad2, padGain2,
    stop: () => {
      stopped = true;
      pad.stop();
      pad2.stop();
      masterGain.disconnect();
      padGain.disconnect();
      padGain2.disconnect();
    }
  };
}

export function stopBackgroundMusic() {
  if (bgMusicNodes) {
    bgMusicNodes.stop();
    bgMusicNodes = null;
  }
}
