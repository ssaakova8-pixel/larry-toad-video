// Score for Act I. Three movements matching the three parts: a swamp drone
// that thaws into a training pulse, and finally the coronation theme. All of
// the hit points are derived from the same frame numbers the scenes cut on.
import {
  bell,
  boom,
  brass,
  createTrack,
  drip,
  drone,
  pad,
  pluck,
  render,
  riser,
  shimmer,
  timpani,
  wash,
} from './synth.mjs';

const FPS = 30;
const DURATION = 45;
const tr = createTrack({duration: DURATION, seed: 0x10c3a7});

// Part boundaries, in seconds, matching src/Act1.tsx.
const BIRTH = 0;
const TRAINING = 450 / FPS; // 15.0
const KNIGHTING = 900 / FPS; // 30.0
/** The moment the froglet appears, in seconds. */
const HATCH_S = 152 / FPS;

// Fourteen montage cuts, evenly spread over the middle third.
const SHOTS = 14;
const SHOT_LEN = 452 / SHOTS / FPS;
const cutAt = (k) => TRAINING + k * SHOT_LEN;

// Accolade beats, local frames of the Knighting scene.
const TOUCH_1 = KNIGHTING + 176 / FPS;
const TOUCH_2 = KNIGHTING + 306 / FPS;
const RISE = KNIGHTING + 362 / FPS;
const TITLE = KNIGHTING + 392 / FPS;

// ---------------------------------------------------------------- movement I
// Still water. One low note, a wash of night air, and a few drips.
drone(tr, BIRTH + 0.1, TRAINING + 0.5, 55, 0.32, 2.2, 0.8);
drone(tr, BIRTH + 2.4, TRAINING + 0.5, 82.4, 0.13, 3.0, 0.8);
wash(tr, BIRTH, TRAINING + 0.3, 0.44, 0.016);
for (const [at, f, g] of [
  [1.5, 1180, 0.1],
  [3.4, 940, 0.08],
  [6.9, 1320, 0.07],
  [9.6, 1050, 0.08],
  [12.9, 880, 0.06],
]) {
  drip(tr, at, f, g);
}

// The hatch: a soft bell and a swell, then the first hint of his theme.
bell(tr, HATCH_S, 1174.7, 0.14, 4.2);
boom(tr, HATCH_S - 0.1, 0.2, 62, 26, 2.6);
shimmer(tr, HATCH_S + 0.2, HATCH_S + 5.2, 0.035);
pad(tr, HATCH_S + 0.9, TRAINING + 0.4, [146.83, 174.61, 220.0], 0.15, 3.4, 1.0);

// --------------------------------------------------------------- movement II
// The montage: a pulse on every cut, an ostinato underneath, energy climbing.
drone(tr, TRAINING, KNIGHTING + 0.3, 73.42, 0.24, 0.6, 0.5);
wash(tr, TRAINING, KNIGHTING, 0.16, 0.06);

// Ostinato: two notes per shot, walking a D minor tetrachord.
const OSTINATO = [146.83, 174.61, 220.0, 174.61, 220.0, 261.63, 220.0, 174.61];
let step = 0;
for (let t = TRAINING; t < KNIGHTING - 0.2; t += SHOT_LEN / 2, step++) {
  const energy = 0.35 + 0.65 * ((t - TRAINING) / (KNIGHTING - TRAINING));
  pluck(tr, t, OSTINATO[step % OSTINATO.length], 0.15 * energy);
  // Off-beat octave above, from the second season onward.
  if (energy > 0.45) {
    pluck(tr, t + SHOT_LEN / 4, OSTINATO[step % OSTINATO.length] * 2, 0.055 * energy, 0.26);
  }
}

// One hit per cut; the season changes get a heavier accent.
const SEASON_CUTS = new Set([0, 3, 7, 10]);
for (let k = 0; k < SHOTS; k++) {
  const at = cutAt(k);
  const energy = 0.4 + 0.6 * (k / (SHOTS - 1));
  timpani(tr, at, 73.42, 0.3 * energy, 0.9);
  if (SEASON_CUTS.has(k)) {
    boom(tr, at, 0.3 * energy, 96, 38, 1.4);
    bell(tr, at, 587.33, 0.05 * energy, 2.2);
  }
}

// Lift into the throne room.
riser(tr, KNIGHTING - 2.0, KNIGHTING, 0.26);

// -------------------------------------------------------------- movement III
// The coronation. i - VI - III - VII - V, resolving to a major tonic as he
// rises: the swamp's minor theme turned triumphant.
const PROGRESSION = [
  {at: KNIGHTING, to: 33.6, root: 73.42, notes: [146.83, 174.61, 220.0]}, // Dm
  {at: 33.6, to: 35.85, root: 58.27, notes: [116.54, 174.61, 233.08]}, // Bb
  {at: 35.85, to: 38.4, root: 87.31, notes: [130.81, 174.61, 261.63]}, // F
  {at: 38.4, to: 40.15, root: 65.41, notes: [130.81, 164.81, 196.0]}, // C
  {at: 40.15, to: RISE, root: 55.0, notes: [110.0, 138.59, 164.81]}, // A (dominant)
];
for (const c of PROGRESSION) {
  pad(tr, c.at, c.to + 0.35, c.notes, 0.3, 0.7, 0.55);
  drone(tr, c.at, c.to + 0.3, c.root, 0.2, 0.5, 0.5);
  timpani(tr, c.at, c.root, 0.2, 1.1);
}

// The blade on each shoulder.
for (const at of [TOUCH_1, TOUCH_2]) {
  bell(tr, at, 2093.0, 0.09, 3.0);
  bell(tr, at + 0.02, 1046.5, 0.07, 3.4);
  timpani(tr, at, 73.42, 0.3, 1.3);
}

// He stands: D major, brass on top, and the tonic held to the end.
const DMAJ = [146.83, 185.0, 220.0, 293.66];
pad(tr, RISE, DURATION - 0.2, DMAJ, 0.34, 0.5, 2.4);
brass(tr, RISE + 0.05, DURATION - 0.5, [146.83, 185.0, 220.0], 0.3, 1.1, 2.6);
drone(tr, RISE, DURATION - 0.2, 73.42, 0.26, 0.35, 2.2);
boom(tr, RISE, 0.5, 140, 30, 3.4);
timpani(tr, RISE, 73.42, 0.36, 1.8);
timpani(tr, RISE + 0.52, 87.31, 0.24, 1.4);
timpani(tr, RISE + 1.04, 110.0, 0.2, 1.4);
bell(tr, TITLE, 1174.7, 0.1, 4.0);
shimmer(tr, TITLE - 0.4, DURATION - 0.3, 0.045);

render(tr, 'public/act1.wav', 'public/act1.mp3');
