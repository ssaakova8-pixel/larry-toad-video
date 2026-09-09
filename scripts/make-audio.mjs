// Score for the 15-second teaser. The hoofbeats are emitted from the same
// stride formulas the scenes animate with, so picture and sound stay locked.
import {boom, crack, createTrack, drone, hoof, render, riser, shimmer, wash} from './synth.mjs';

const FPS = 30;
const tr = createTrack({duration: 15});

/**
 * Emits a hoof strike every time the visual stride crosses one of the four
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
    const cur = stride(t - fromSec);
    for (const [offset, amp] of beats) {
      if (Math.floor(prev - offset) !== Math.floor(cur - offset)) {
        hoof(tr, t, gain * amp * (0.85 + 0.15 * Math.sin(t * 9)));
      }
    }
    prev = cur;
  }
}

// Scene boundaries, in seconds, matching src/Teaser.tsx.
const RIDE = 92 / FPS;
const PORTRAIT = 214 / FPS;
const CHARGE = 300 / FPS;
const TITLE = 370 / FPS;

// Cold open: still air, one low note.
drone(tr, 0.1, RIDE + 0.6, 55, 0.34, 1.6, 0.5);
wash(tr, 0.0, RIDE + 0.4, 0.5);
boom(tr, 0.15, 0.22, 70, 30, 2.6);

// The ride.
drone(tr, RIDE, PORTRAIT + 0.3, 73.4, 0.3, 0.5, 0.4);
drone(tr, RIDE + 0.4, PORTRAIT + 0.3, 110, 0.16, 1.2, 0.4);
wash(tr, RIDE, PORTRAIT, 0.42, 0.05);
gallop(
  RIDE,
  PORTRAIT,
  (local) => {
    const frame = local * FPS;
    return frame * 0.082 * Math.min(1, 0.15 + (frame / 30) * 0.85);
  },
  0.5
);

// Portrait: everything drops away but one held note.
drone(tr, PORTRAIT, CHARGE + 0.2, 49, 0.32, 0.35, 0.5);
wash(tr, PORTRAIT + 0.2, CHARGE, 0.22, 0.012);
crack(tr, PORTRAIT + 50 / FPS, 0.34);

// The charge.
drone(tr, CHARGE, TITLE + 0.2, 82.4, 0.3, 0.3, 0.3);
gallop(CHARGE, TITLE, (local) => local * FPS * 0.1, 0.58);
riser(tr, CHARGE + 0.6, TITLE, 0.3);
boom(tr, CHARGE + 52 / FPS, 0.4);

// Title.
boom(tr, TITLE, 0.62, 130, 28, 3.2);
drone(tr, TITLE + 0.1, 14.9, 55, 0.34, 0.4, 1.6);
drone(tr, TITLE + 0.5, 14.9, 82.4, 0.2, 1.0, 1.6);
shimmer(tr, TITLE + 0.15, 14.8, 0.05);

render(tr, 'public/score.wav', 'public/score.mp3');
