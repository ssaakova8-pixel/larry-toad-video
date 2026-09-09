// Generates the teaser's score as a mono WAV, then encodes it to MP3 with the
// ffmpeg that ships inside @remotion/compositor. Everything here is
// deterministic, and the hoofbeats are derived from the same stride formulas
// the scenes animate with, so picture and sound stay locked.
import {writeFileSync, mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {existsSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const FPS = 30;
const DURATION = 15;
const RATE = 44100;
const N = RATE * DURATION;
const buf = new Float32Array(N);

/** Deterministic PRNG so a rebuild produces a byte-identical track. */
let seed = 0x2f6b3f;
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return (((t ^ (t >>> 14)) >>> 0) / 4294967296) * 2 - 1;
};

const add = (i, v) => {
  if (i >= 0 && i < N) buf[i] += v;
};

/** Sustained low pad — the bed under the whole piece. */
function drone(from, to, freq, gain, fadeIn = 0.6, fadeOut = 1.0) {
  const a = Math.floor(from * RATE);
  const b = Math.floor(to * RATE);
  for (let i = a; i < b; i++) {
    const t = i / RATE;
    const local = t - from;
    const env =
      Math.min(1, local / fadeIn) * Math.min(1, (to - t) / fadeOut);
    const vib = 1 + Math.sin(2 * Math.PI * 0.13 * t) * 0.004;
    const s =
      Math.sin(2 * Math.PI * freq * vib * t) * 0.6 +
      Math.sin(2 * Math.PI * freq * 2 * vib * t) * 0.22 +
      Math.sin(2 * Math.PI * freq * 3 * vib * t) * 0.09 +
      Math.sin(2 * Math.PI * freq * 4.98 * vib * t) * 0.05;
    add(i, s * gain * env);
  }
}

/** Low-passed noise wash: wind over open water. */
function wash(from, to, gain, cutoff = 0.02) {
  const a = Math.floor(from * RATE);
  const b = Math.floor(to * RATE);
  let lp = 0;
  for (let i = a; i < b; i++) {
    lp += (rnd() - lp) * cutoff;
    const t = (i - a) / (b - a);
    const env = Math.sin(Math.PI * t) ** 0.7;
    add(i, lp * gain * env * (0.7 + 0.3 * Math.sin(2 * Math.PI * 0.21 * (i / RATE))));
  }
}

/** One hoof striking wet ground: a short noise burst plus a body thump. */
function hoof(at, gain) {
  const a = Math.floor(at * RATE);
  const len = Math.floor(0.16 * RATE);
  let lp = 0;
  for (let k = 0; k < len; k++) {
    const t = k / RATE;
    const env = Math.exp(-t * 34);
    lp += (rnd() - lp) * 0.16;
    const body = Math.sin(2 * Math.PI * (120 - t * 190) * t) * Math.exp(-t * 26);
    add(a + k, (lp * 0.55 + body * 0.85) * gain * env);
  }
}

/** Deep impact: a sine dropping into the floor. */
function boom(at, gain, f0 = 110, f1 = 32, dur = 1.8) {
  const a = Math.floor(at * RATE);
  const len = Math.floor(dur * RATE);
  for (let k = 0; k < len; k++) {
    const t = k / RATE;
    const p = t / dur;
    const f = f0 * Math.pow(f1 / f0, Math.pow(p, 0.35));
    const env = Math.exp(-t * 2.6);
    add(a + k, Math.sin(2 * Math.PI * f * t) * gain * env);
  }
}

/** Thunder: a bright crack that decays into a rumble. */
function crack(at, gain) {
  const a = Math.floor(at * RATE);
  const len = Math.floor(2.2 * RATE);
  let lp = 0;
  for (let k = 0; k < len; k++) {
    const t = k / RATE;
    const n = rnd();
    lp += (n - lp) * 0.35;
    const bright = n * Math.exp(-t * 22);
    const rumble = lp * Math.exp(-t * 1.7);
    add(a + k, (bright * 0.5 + rumble * 0.8) * gain);
  }
}

/** Noise + tone sweeping upward into a cut. */
function riser(from, to, gain) {
  const a = Math.floor(from * RATE);
  const b = Math.floor(to * RATE);
  let lp = 0;
  for (let i = a; i < b; i++) {
    const p = (i - a) / (b - a);
    const t = i / RATE;
    lp += (rnd() - lp) * (0.02 + p * 0.28);
    const tone = Math.sin(2 * Math.PI * (150 + 700 * p * p) * t) * 0.35;
    add(i, (lp * 0.9 + tone) * gain * Math.pow(p, 1.8));
  }
}

/** Bright shimmer over the logo. */
function shimmer(from, to, gain) {
  const a = Math.floor(from * RATE);
  const b = Math.floor(to * RATE);
  const partials = [880, 1320, 1760, 2640];
  for (let i = a; i < b; i++) {
    const t = i / RATE;
    const p = (i - a) / (b - a);
    const env = Math.min(1, p * 6) * Math.exp(-p * 2.4);
    let s = 0;
    for (let j = 0; j < partials.length; j++) {
      s += Math.sin(2 * Math.PI * partials[j] * t + j) * (1 / (j + 2));
    }
    add(i, s * gain * env);
  }
}

/**
 * Emits a hoof strike every time the visual stride passes one of the four
 * beats of a gallop cycle. `stride` is the same function the scene uses.
 */
function gallop(fromSec, toSec, stride, gain) {
  const beats = [
    [0.0, 0.75],
    [0.13, 0.6],
    [0.31, 1.0],
    [0.44, 0.72],
  ];
  let prev = stride(0);
  const step = 1 / FPS / 4;
  for (let t = fromSec + step; t < toSec; t += step) {
    const local = t - fromSec;
    const cur = stride(local);
    for (const [offset, amp] of beats) {
      const a = prev - offset;
      const b = cur - offset;
      if (Math.floor(a) !== Math.floor(b)) {
        hoof(t, gain * amp * (0.85 + 0.15 * Math.sin(t * 9)));
      }
    }
    prev = cur;
  }
}

// ---- arrangement -----------------------------------------------------------
// Scene boundaries, in seconds, matching src/Teaser.tsx.
const RIDE = 92 / FPS;
const PORTRAIT = 214 / FPS;
const CHARGE = 300 / FPS;
const TITLE = 370 / FPS;

// Cold open: still air, one low note.
drone(0.1, RIDE + 0.6, 55, 0.34, 1.6, 0.5);
wash(0.0, RIDE + 0.4, 0.5);
boom(0.15, 0.22, 70, 30, 2.6);

// The ride.
drone(RIDE, PORTRAIT + 0.3, 73.4, 0.3, 0.5, 0.4);
drone(RIDE + 0.4, PORTRAIT + 0.3, 110, 0.16, 1.2, 0.4);
wash(RIDE, PORTRAIT, 0.42, 0.05);
gallop(
  RIDE,
  PORTRAIT,
  (local) => {
    const frame = local * FPS;
    const speed = Math.min(1, 0.15 + (frame / 30) * 0.85);
    return frame * 0.082 * speed;
  },
  0.5
);

// Portrait: everything drops away but one held note.
drone(PORTRAIT, CHARGE + 0.2, 49, 0.32, 0.35, 0.5);
wash(PORTRAIT + 0.2, CHARGE, 0.22, 0.012);
crack(PORTRAIT + 50 / FPS, 0.34);

// The charge.
drone(CHARGE, TITLE + 0.2, 82.4, 0.3, 0.3, 0.3);
gallop(CHARGE, TITLE, (local) => local * FPS * 0.1, 0.58);
riser(CHARGE + 0.6, TITLE, 0.3);
boom(CHARGE + 52 / FPS, 0.4);

// Title.
boom(TITLE, 0.62, 130, 28, 3.2);
drone(TITLE + 0.1, DURATION - 0.1, 55, 0.34, 0.4, 1.6);
drone(TITLE + 0.5, DURATION - 0.1, 82.4, 0.2, 1.0, 1.6);
shimmer(TITLE + 0.15, DURATION - 0.2, 0.05);

// ---- master + write --------------------------------------------------------
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(buf[i]));
const norm = 0.89 / peak;

const pcm = Buffer.alloc(N * 2);
for (let i = 0; i < N; i++) {
  // Soft clip, then fade the very edges so nothing clicks.
  let v = Math.tanh(buf[i] * norm * 1.15);
  const edge = Math.min(1, i / (RATE * 0.05), (N - i) / (RATE * 0.25));
  v *= edge;
  pcm.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * 32767))), i * 2);
}

const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(RATE, 24);
header.writeUInt32LE(RATE * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(pcm.length, 40);

mkdirSync('public', {recursive: true});
const wav = 'public/score.wav';
writeFileSync(wav, Buffer.concat([header, pcm]));

// Remotion ships a platform-specific compositor package that bundles ffmpeg;
// fall back to whatever ffmpeg is on PATH.
function findFfmpeg() {
  const dir = 'node_modules/@remotion';
  if (existsSync(dir)) {
    for (const name of readdirSync(dir)) {
      if (!name.startsWith('compositor-')) continue;
      const bin = join(dir, name, 'ffmpeg');
      if (existsSync(bin)) return bin;
    }
  }
  return 'ffmpeg';
}

execFileSync(
  findFfmpeg(),
  ['-y', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '128k', 'public/score.mp3'],
  {stdio: 'inherit'}
);
console.log('wrote public/score.mp3');
