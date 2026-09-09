// A tiny sample-level synthesiser shared by the project's scores. Every
// instrument is a pure function of time and a seeded PRNG, so a rebuild
// always produces the same audio.
import {writeFileSync, mkdirSync, existsSync, readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join, dirname} from 'node:path';

/** Clamp to 0..1; envelope maths must never go negative. */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

export function createTrack({rate = 44100, duration, seed = 0x2f6b3f}) {
  const N = Math.round(rate * duration);
  const buf = new Float32Array(N);
  let s = seed;

  /** Deterministic noise in [-1, 1). */
  const rnd = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (((t ^ (t >>> 14)) >>> 0) / 4294967296) * 2 - 1;
  };

  const add = (i, v) => {
    if (i >= 0 && i < N) buf[i] += v;
  };

  return {rate, duration, N, buf, rnd, add};
}

/** Sustained low pad built from a few harmonics with a slow vibrato. */
export function drone(tr, from, to, freq, gain, fadeIn = 0.6, fadeOut = 1.0) {
  const a = Math.floor(from * tr.rate);
  const b = Math.floor(to * tr.rate);
  for (let i = a; i < b; i++) {
    const t = i / tr.rate;
    const env = Math.min(1, (t - from) / fadeIn) * Math.min(1, (to - t) / fadeOut);
    const vib = 1 + Math.sin(2 * Math.PI * 0.13 * t) * 0.004;
    const v =
      Math.sin(2 * Math.PI * freq * vib * t) * 0.6 +
      Math.sin(2 * Math.PI * freq * 2 * vib * t) * 0.22 +
      Math.sin(2 * Math.PI * freq * 3 * vib * t) * 0.09 +
      Math.sin(2 * Math.PI * freq * 4.98 * vib * t) * 0.05;
    tr.add(i, v * gain * env);
  }
}

/** Low-passed noise wash: wind, water, room tone. */
export function wash(tr, from, to, gain, cutoff = 0.02) {
  const a = Math.floor(from * tr.rate);
  const b = Math.floor(to * tr.rate);
  let lp = 0;
  for (let i = a; i < b; i++) {
    lp += (tr.rnd() - lp) * cutoff;
    const p = (i - a) / (b - a);
    const env = Math.pow(Math.sin(Math.PI * p), 0.7);
    tr.add(i, lp * gain * env * (0.7 + 0.3 * Math.sin(2 * Math.PI * 0.21 * (i / tr.rate))));
  }
}

/** A hoof striking wet ground: noise burst plus a pitched thump. */
export function hoof(tr, at, gain) {
  const a = Math.floor(at * tr.rate);
  const len = Math.floor(0.16 * tr.rate);
  let lp = 0;
  for (let k = 0; k < len; k++) {
    const t = k / tr.rate;
    const env = Math.exp(-t * 34);
    lp += (tr.rnd() - lp) * 0.16;
    const body = Math.sin(2 * Math.PI * (120 - t * 190) * t) * Math.exp(-t * 26);
    tr.add(a + k, (lp * 0.55 + body * 0.85) * gain * env);
  }
}

/** Deep impact: a sine sweeping down into the floor. */
export function boom(tr, at, gain, f0 = 110, f1 = 32, dur = 1.8) {
  const a = Math.floor(at * tr.rate);
  const len = Math.floor(dur * tr.rate);
  for (let k = 0; k < len; k++) {
    const t = k / tr.rate;
    const p = t / dur;
    const f = f0 * Math.pow(f1 / f0, Math.pow(p, 0.35));
    tr.add(a + k, Math.sin(2 * Math.PI * f * t) * gain * Math.exp(-t * 2.6));
  }
}

/** Thunder: a bright crack decaying into a rumble. */
export function crack(tr, at, gain) {
  const a = Math.floor(at * tr.rate);
  const len = Math.floor(2.2 * tr.rate);
  let lp = 0;
  for (let k = 0; k < len; k++) {
    const t = k / tr.rate;
    const n = tr.rnd();
    lp += (n - lp) * 0.35;
    tr.add(a + k, (n * Math.exp(-t * 22) * 0.5 + lp * Math.exp(-t * 1.7) * 0.8) * gain);
  }
}

/** Noise and tone sweeping upward into a cut. */
export function riser(tr, from, to, gain) {
  const a = Math.floor(from * tr.rate);
  const b = Math.floor(to * tr.rate);
  let lp = 0;
  for (let i = a; i < b; i++) {
    const p = (i - a) / (b - a);
    const t = i / tr.rate;
    lp += (tr.rnd() - lp) * (0.02 + p * 0.28);
    const tone = Math.sin(2 * Math.PI * (150 + 700 * p * p) * t) * 0.35;
    tr.add(i, (lp * 0.9 + tone) * gain * Math.pow(p, 1.8));
  }
}

/** Bright high partials over a title card. */
export function shimmer(tr, from, to, gain) {
  const a = Math.floor(from * tr.rate);
  const b = Math.floor(to * tr.rate);
  const partials = [880, 1320, 1760, 2640];
  for (let i = a; i < b; i++) {
    const t = i / tr.rate;
    const p = (i - a) / (b - a);
    const env = Math.min(1, p * 6) * Math.exp(-p * 2.4);
    let v = 0;
    for (let j = 0; j < partials.length; j++) {
      v += Math.sin(2 * Math.PI * partials[j] * t + j) * (1 / (j + 2));
    }
    tr.add(i, v * gain * env);
  }
}

/** Warm chord pad: each note gets a detuned pair and a few harmonics. */
export function pad(tr, from, to, freqs, gain, fadeIn = 0.8, fadeOut = 0.8) {
  const a = Math.floor(from * tr.rate);
  const b = Math.floor(to * tr.rate);
  for (let i = a; i < b; i++) {
    const t = i / tr.rate;
    const env = clamp01((t - from) / fadeIn) * clamp01((to - t) / fadeOut);
    let v = 0;
    for (let n = 0; n < freqs.length; n++) {
      const f = freqs[n];
      const vib = 1 + Math.sin(2 * Math.PI * (0.17 + n * 0.03) * t) * 0.0035;
      v +=
        Math.sin(2 * Math.PI * f * vib * t) * 0.5 +
        Math.sin(2 * Math.PI * f * 1.003 * t + n) * 0.34 +
        Math.sin(2 * Math.PI * f * 2 * vib * t) * 0.14 +
        Math.sin(2 * Math.PI * f * 3 * vib * t) * 0.06;
    }
    tr.add(i, (v / freqs.length) * gain * env);
  }
}

/** Brighter, reedier stack for the fanfare: harmonics falling off as 1/n. */
export function brass(tr, from, to, freqs, gain, fadeIn = 0.5, fadeOut = 0.9) {
  const a = Math.floor(from * tr.rate);
  const b = Math.floor(to * tr.rate);
  for (let i = a; i < b; i++) {
    const t = i / tr.rate;
    const env =
      Math.pow(clamp01((t - from) / fadeIn), 1.6) * clamp01((to - t) / fadeOut);
    // Brightness opens up as the note swells, the way a horn does.
    const harmonics = 3 + Math.floor(env * 6);
    let v = 0;
    for (const f of freqs) {
      for (let n = 1; n <= harmonics; n++) {
        v += (Math.sin(2 * Math.PI * f * n * t + n * 0.3) / n) * (n > 1 ? 0.7 : 1);
      }
    }
    tr.add(i, (v / (freqs.length * 2.4)) * gain * env);
  }
}

/** Struck bell: inharmonic partials, each decaying at its own rate. */
export function bell(tr, at, freq, gain, dur = 3.4) {
  const a = Math.floor(at * tr.rate);
  const len = Math.floor(dur * tr.rate);
  const partials = [1, 2.0, 2.99, 4.24, 5.43, 6.79];
  for (let k = 0; k < len; k++) {
    const t = k / tr.rate;
    let v = 0;
    for (let n = 0; n < partials.length; n++) {
      v += Math.sin(2 * Math.PI * freq * partials[n] * t) * Math.exp(-t * (1.1 + n * 0.9)) / (n + 1.4);
    }
    tr.add(a + k, v * gain);
  }
}

/** Timpani: a membrane thump with a short downward pitch bend. */
export function timpani(tr, at, freq, gain, dur = 1.5) {
  const a = Math.floor(at * tr.rate);
  const len = Math.floor(dur * tr.rate);
  let lp = 0;
  for (let k = 0; k < len; k++) {
    const t = k / tr.rate;
    const f = freq * (1 + 0.6 * Math.exp(-t * 26));
    lp += (tr.rnd() - lp) * 0.1;
    const body =
      Math.sin(2 * Math.PI * f * t) * 0.85 + Math.sin(2 * Math.PI * f * 1.59 * t) * 0.2;
    tr.add(a + k, (body + lp * 0.4 * Math.exp(-t * 30)) * gain * Math.exp(-t * 4.2));
  }
}

/** Short plucked note for the montage ostinato. */
export function pluck(tr, at, freq, gain, dur = 0.42) {
  const a = Math.floor(at * tr.rate);
  const len = Math.floor(dur * tr.rate);
  for (let k = 0; k < len; k++) {
    const t = k / tr.rate;
    const env = Math.exp(-t * 9.5);
    const v =
      Math.sin(2 * Math.PI * freq * t) +
      Math.sin(2 * Math.PI * freq * 2 * t) * 0.32 * Math.exp(-t * 16) +
      Math.sin(2 * Math.PI * freq * 3 * t) * 0.14 * Math.exp(-t * 24);
    tr.add(a + k, v * gain * env);
  }
}

/** A water drip: a very short blip that bends upward. */
export function drip(tr, at, freq, gain) {
  const a = Math.floor(at * tr.rate);
  const len = Math.floor(0.28 * tr.rate);
  for (let k = 0; k < len; k++) {
    const t = k / tr.rate;
    const f = freq * (1 + 1.4 * (1 - Math.exp(-t * 42)));
    tr.add(a + k, Math.sin(2 * Math.PI * f * t) * gain * Math.exp(-t * 21));
  }
}

/**
 * Normalises, soft-clips, fades the edges and writes a 16-bit mono WAV,
 * then encodes an MP3 beside it with the ffmpeg bundled in Remotion.
 */
export function render(tr, wavPath, mp3Path, {peak = 0.89, drive = 1.15, tailFade = 0.25} = {}) {
  let max = 0;
  for (let i = 0; i < tr.N; i++) {
    const v = tr.buf[i];
    if (!Number.isFinite(v)) {
      throw new Error(`non-finite sample at ${(i / tr.rate).toFixed(3)}s — check envelope maths`);
    }
    max = Math.max(max, Math.abs(v));
  }
  if (max === 0) throw new Error('track is silent — nothing was scheduled');
  const norm = peak / max;

  const pcm = Buffer.alloc(tr.N * 2);
  for (let i = 0; i < tr.N; i++) {
    let v = Math.tanh(tr.buf[i] * norm * drive);
    v *= Math.min(1, i / (tr.rate * 0.05), (tr.N - i) / (tr.rate * tailFade));
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
  header.writeUInt32LE(tr.rate, 24);
  header.writeUInt32LE(tr.rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);

  mkdirSync(dirname(wavPath), {recursive: true});
  writeFileSync(wavPath, Buffer.concat([header, pcm]));

  execFileSync(
    findFfmpeg(),
    ['-y', '-i', wavPath, '-codec:a', 'libmp3lame', '-b:a', '128k', mp3Path],
    {stdio: 'inherit'}
  );
  console.log(`wrote ${mp3Path}`);
}

/** Remotion ships a platform compositor package that bundles ffmpeg. */
export function findFfmpeg() {
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
