// Procedural lo-fi loop built with the Web Audio API: no audio files, nothing to license.
// Mellow electric-piano chords, a soft bass, lazy drums and vinyl crackle at 72 BPM.

const BPM = 72;
const STEP = 60 / BPM / 4; // one 16th note, in seconds
const LOOKAHEAD = 0.12;

// Fmaj7 → Em7 → Dm7 → Cmaj7, one bar each (MIDI note numbers)
const CHORDS = [
  [53, 57, 60, 64],
  [52, 55, 59, 62],
  [50, 53, 57, 60],
  [48, 52, 55, 59],
];
const BASS = [41, 40, 38, 36];
const MELODY = [65, 67, 69, 72, 74, 77];

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

let ctx: AudioContext | null = null;
let master: GainNode;
let musicBus: BiquadFilterNode;
let reverbSend: GainNode;
let crackle: AudioBufferSourceNode | null = null;
let noise: AudioBuffer;
let timer: number | undefined;
let nextTime = 0;
let step = 0;
let playing = false;

function noiseBuffer(c: AudioContext, seconds: number, fill: (i: number) => number) {
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = fill(i);
  return buffer;
}

function setup() {
  const c = new AudioContext();
  master = c.createGain();
  master.gain.value = 0;
  master.connect(c.destination);

  // warm, slightly muffled tone
  musicBus = c.createBiquadFilter();
  musicBus.type = "lowpass";
  musicBus.frequency.value = 2200;
  musicBus.connect(master);

  // simple generated reverb
  const reverb = c.createConvolver();
  const length = c.sampleRate * 2.4;
  const impulse = c.createBuffer(2, length, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
  }
  reverb.buffer = impulse;
  reverbSend = c.createGain();
  reverbSend.gain.value = 0.28;
  reverbSend.connect(reverb);
  reverb.connect(musicBus);

  noise = noiseBuffer(c, 1, () => Math.random() * 2 - 1);
  ctx = c;
}

function epiano(freq: number, time: number, velocity: number, length = 1.6) {
  if (!ctx) return;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, time);
  env.gain.linearRampToValueAtTime(velocity, time + 0.015);
  env.gain.exponentialRampToValueAtTime(velocity * 0.35, time + 0.4);
  env.gain.exponentialRampToValueAtTime(0.0001, time + length);
  env.connect(musicBus);
  env.connect(reverbSend);
  for (const [mult, level, type] of [
    [1, 1, "sine"],
    [2, 0.12, "sine"],
    [1.003, 0.35, "triangle"],
  ] as const) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq * mult;
    g.gain.value = level;
    osc.connect(g).connect(env);
    osc.start(time);
    osc.stop(time + length + 0.05);
  }
}

function bass(freq: number, time: number) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0, time);
  env.gain.linearRampToValueAtTime(0.32, time + 0.02);
  env.gain.exponentialRampToValueAtTime(0.0001, time + STEP * 7);
  osc.connect(env).connect(musicBus);
  osc.start(time);
  osc.stop(time + STEP * 7 + 0.05);
}

function kick(time: number) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.frequency.setValueAtTime(110, time);
  osc.frequency.exponentialRampToValueAtTime(42, time + 0.18);
  env.gain.setValueAtTime(0.55, time);
  env.gain.exponentialRampToValueAtTime(0.0001, time + 0.42);
  osc.connect(env).connect(master);
  osc.start(time);
  osc.stop(time + 0.45);
}

function noiseHit(time: number, type: BiquadFilterType, freq: number, level: number, length: number) {
  if (!ctx) return;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  const env = ctx.createGain();
  env.gain.setValueAtTime(level, time);
  env.gain.exponentialRampToValueAtTime(0.0001, time + length);
  src.connect(filter).connect(env).connect(musicBus);
  env.connect(reverbSend);
  src.start(time, Math.random() * 0.5, length + 0.02);
}

function schedule(s: number, time: number) {
  const bar = Math.floor(s / 16) % CHORDS.length;
  const pos = s % 16;
  const swing = pos % 4 === 2 ? STEP * 0.3 : 0;
  const t = time + swing;

  if (pos === 0) CHORDS[bar].forEach((n, i) => epiano(hz(n), t + i * 0.012, 0.09));
  if (pos === 6) CHORDS[bar].forEach((n, i) => epiano(hz(n), t + i * 0.01, 0.05, 1.1));
  if (pos === 0 || pos === 8) bass(hz(BASS[bar]), t);
  if (pos === 0 || pos === 10) kick(t);
  if (pos === 4 || pos === 12) noiseHit(t, "bandpass", 1800, 0.22, 0.16);
  if (pos % 2 === 0) noiseHit(t, "highpass", 7500, pos % 4 === 0 ? 0.05 : 0.03, 0.04);
  if ([2, 6, 10, 14].includes(pos) && Math.random() < 0.3) {
    epiano(hz(MELODY[Math.floor(Math.random() * MELODY.length)]), t, 0.05, 1.2);
  }
}

function tick() {
  if (!ctx) return;
  while (nextTime < ctx.currentTime + LOOKAHEAD) {
    schedule(step, nextTime);
    nextTime += STEP;
    step++;
  }
}

function startCrackle() {
  if (!ctx) return;
  crackle = ctx.createBufferSource();
  crackle.buffer = noiseBuffer(ctx, 3, () => {
    const r = Math.random();
    return r < 0.0009 ? (Math.random() * 2 - 1) * 0.9 : (Math.random() * 2 - 1) * 0.012;
  });
  crackle.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 900;
  const g = ctx.createGain();
  g.gain.value = 0.35;
  crackle.connect(filter).connect(g).connect(master);
  crackle.start();
}

export async function startLofi() {
  if (playing) return;
  if (!ctx) setup();
  if (!ctx) return;
  await ctx.resume();
  playing = true;
  step = 0;
  nextTime = ctx.currentTime + 0.1;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.42, ctx.currentTime + 1.2);
  startCrackle();
  timer = window.setInterval(tick, 25);
}

export function stopLofi() {
  if (!ctx || !playing) return;
  playing = false;
  window.clearInterval(timer);
  const c = ctx;
  master.gain.cancelScheduledValues(c.currentTime);
  master.gain.setValueAtTime(master.gain.value, c.currentTime);
  master.gain.linearRampToValueAtTime(0, c.currentTime + 0.6);
  const old = crackle;
  crackle = null;
  window.setTimeout(() => {
    old?.stop();
    if (!playing) void c.suspend();
  }, 700);
}

const MEOW = 0.5; // seconds

// Drop a real recording at public/sounds/meow.mp3 (any free-licence clip) and
// next.config.ts sets this flag; the recording is then used instead of the synth.
const HAS_MEOW_FILE = process.env.NEXT_PUBLIC_HAS_MEOW_SOUND === "1";
let meowSample: Promise<AudioBuffer | null> | null = null;

function loadMeowSample(c: AudioContext) {
  meowSample ??= fetch("/sounds/meow.mp3")
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
    .then((data) => c.decodeAudioData(data))
    .catch(() => null);
  return meowSample;
}

/**
 * Kitten "mew!": short and high, with a soft rounded tone (triangle + sine
 * rather than a buzzy sawtooth). The pitch pops up then sighs down while a
 * mouth-like filter goes from "m" to "ew".
 */
function meow(c: AudioContext, t: number, out: AudioNode) {
  const end = t + MEOW;
  const pitch = (osc: OscillatorNode, mult: number) => {
    osc.frequency.setValueAtTime(900 * mult, t);
    osc.frequency.exponentialRampToValueAtTime(1380 * mult, t + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1180 * mult, t + 0.28);
    osc.frequency.exponentialRampToValueAtTime(820 * mult, end);
  };

  const body = c.createOscillator();
  body.type = "triangle";
  pitch(body, 1);
  const overtone = c.createOscillator();
  overtone.type = "sine";
  pitch(overtone, 2);
  const overtoneLevel = c.createGain();
  overtoneLevel.gain.value = 0.25;

  // gentle, fast vibrato reads as "small animal"
  const vibrato = c.createOscillator();
  vibrato.frequency.value = 11;
  const vibratoDepth = c.createGain();
  vibratoDepth.gain.value = 22;
  vibrato.connect(vibratoDepth);
  vibratoDepth.connect(body.frequency);
  vibratoDepth.connect(overtone.frequency);

  const mouth = c.createBiquadFilter();
  mouth.type = "lowpass";
  mouth.Q.value = 4;
  mouth.frequency.setValueAtTime(900, t); // closed "m"
  mouth.frequency.exponentialRampToValueAtTime(3200, t + 0.09); // open "e"
  mouth.frequency.exponentialRampToValueAtTime(1400, end); // rounding "w"

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.32, t + 0.04);
  env.gain.setValueAtTime(0.32, t + 0.16);
  env.gain.exponentialRampToValueAtTime(0.0001, end);

  body.connect(mouth);
  overtone.connect(overtoneLevel).connect(mouth);
  mouth.connect(env).connect(out);

  for (const node of [body, overtone, vibrato]) {
    node.start(t);
    node.stop(end + 0.05);
  }
}

/** Plays the real meow recording if one was added, otherwise the synth. Returns its length. */
async function playMeow(c: AudioContext, t: number, out: AudioNode) {
  const sample = HAS_MEOW_FILE ? await loadMeowSample(c) : null;
  if (!sample) {
    meow(c, t, out);
    return MEOW;
  }
  const src = c.createBufferSource();
  src.buffer = sample;
  src.connect(out);
  src.start(Math.max(t, c.currentTime));
  return sample.duration;
}

/**
 * A real purr is a train of tiny pulses (~26 per second) that swells as the
 * cat breathes out and softens, slightly higher, as it breathes in.
 */
function purrPulses(c: AudioContext, start: number, duration: number, out: AudioNode) {
  const burst = noiseBuffer(c, 0.04, () => Math.random() * 2 - 1);
  const body = c.createBiquadFilter();
  body.type = "lowpass";
  body.frequency.value = 420;
  body.connect(out);

  const RATE = 26;
  const EXHALE = 0.62;
  const INHALE = 0.42;
  for (let time = 0; time < duration; time += 1 / RATE) {
    const inCycle = time % (EXHALE + INHALE);
    const exhaling = inCycle < EXHALE;
    const phase = exhaling ? inCycle / EXHALE : (inCycle - EXHALE) / INHALE;
    const breath = Math.sin(phase * Math.PI) * (exhaling ? 1 : 0.55);
    const fade = Math.min(1, time / 0.25, (duration - time) / 0.4);
    const level = 0.5 * breath * fade * (0.85 + Math.random() * 0.3);
    if (level < 0.01) continue;

    const t = start + time + (Math.random() - 0.5) * 0.004;
    const src = c.createBufferSource();
    src.buffer = burst;
    const tone = c.createBiquadFilter();
    tone.type = "bandpass";
    tone.frequency.value = exhaling ? 130 : 165;
    tone.Q.value = 1.4;
    const env = c.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(level, t + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.032);
    src.connect(tone).connect(env).connect(body);
    src.start(t);
    src.stop(t + 0.04);
  }
}

/** Small UI sounds for the room's clickable details. */
export async function sfx(kind: "click" | "drop" | "pop") {
  if (!ctx) setup();
  if (!ctx) return;
  await ctx.resume();
  const c = ctx;
  const t = c.currentTime + 0.01;
  const osc = c.createOscillator();
  const env = c.createGain();
  if (kind === "click") {
    // lamp switch
    osc.type = "square";
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.03);
    env.gain.setValueAtTime(0.06, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  } else if (kind === "drop") {
    // water droplet "bloop"
    osc.type = "sine";
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(1300, t + 0.08);
    env.gain.setValueAtTime(0.14, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  } else {
    // flower pops open
    osc.type = "triangle";
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(1500, t + 0.12);
    env.gain.setValueAtTime(0.12, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
  }
  osc.connect(env).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.3);
}

/** Woken-up cat: a "meow", then a couple of seconds of purring. */
export async function purr() {
  if (!ctx) setup();
  if (!ctx) return;
  await ctx.resume();
  const c = ctx;
  const t = c.currentTime + 0.02;
  const out = c.createGain();
  out.gain.value = 1;
  out.connect(c.destination);
  const length = await playMeow(c, t, out);
  purrPulses(c, Math.max(t, c.currentTime) + length + 0.1, 1.8, out);
}
