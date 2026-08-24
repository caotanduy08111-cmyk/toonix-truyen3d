let audioCtx = null;

const getCtx = () => {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

export const playClickSound = () => {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  const pop = ctx.createOscillator();
  const popGain = ctx.createGain();
  pop.type = 'triangle';
  pop.frequency.setValueAtTime(680, now);
  pop.frequency.exponentialRampToValueAtTime(210, now + 0.09);
  popGain.gain.setValueAtTime(0.0001, now);
  popGain.gain.exponentialRampToValueAtTime(0.18, now + 0.008);
  popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  pop.connect(popGain).connect(ctx.destination);
  pop.start(now);
  pop.stop(now + 0.13);

  const tick = ctx.createOscillator();
  const tickGain = ctx.createGain();
  tick.type = 'sine';
  tick.frequency.setValueAtTime(1500, now);
  tickGain.gain.setValueAtTime(0.0001, now);
  tickGain.gain.exponentialRampToValueAtTime(0.07, now + 0.004);
  tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  tick.connect(tickGain).connect(ctx.destination);
  tick.start(now);
  tick.stop(now + 0.06);
};
