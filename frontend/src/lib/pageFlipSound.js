let audioCtx = null;

const getCtx = () => {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

export const playPageFlipSound = () => {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const dur = 0.24;

  const bufferSize = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(2000, now);
  bandpass.frequency.exponentialRampToValueAtTime(500, now + dur);
  bandpass.Q.value = 0.7;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.32, now + 0.025);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  noise.connect(bandpass).connect(noiseGain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + dur);

  const sweep = ctx.createOscillator();
  const sweepGain = ctx.createGain();
  sweep.type = 'sine';
  sweep.frequency.setValueAtTime(850, now);
  sweep.frequency.exponentialRampToValueAtTime(1900, now + 0.14);
  sweepGain.gain.setValueAtTime(0.0001, now);
  sweepGain.gain.exponentialRampToValueAtTime(0.045, now + 0.02);
  sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  sweep.connect(sweepGain).connect(ctx.destination);
  sweep.start(now);
  sweep.stop(now + 0.22);
};
