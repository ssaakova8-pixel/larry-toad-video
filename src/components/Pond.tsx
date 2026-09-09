import React from 'react';
import {random} from 'remotion';
import {palette} from '../theme';
import {FrogHead} from './FrogKnight';

const TAU = Math.PI * 2;

/**
 * A lily pad seen at a shallow angle: an ellipse with the classic wedge
 * notch cut out of the near edge. Drawn as one path so it silhouettes
 * cleanly against the water.
 */
export const LilyPad: React.FC<{
  rx: number;
  ry: number;
  fill?: string;
  rim?: string;
  notch?: number;
}> = ({rx, ry, fill = '#12301f', rim = '#3d6b4a', notch = 20}) => {
  const a = (notch * Math.PI) / 180;
  const x1 = rx * Math.cos(a);
  const y1 = ry * Math.sin(a);
  const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rx} ${ry} 0 1 1 ${x1.toFixed(1)} ${(-y1).toFixed(
    1
  )} L 0 0 Z`;

  return (
    <g>
      <path d={d} fill={fill} />
      <path d={d} fill="none" stroke={rim} strokeWidth={rx * 0.02} opacity={0.55} />
      {/* radial veins */}
      {Array.from({length: 9}).map((_, i) => {
        const ang = a + ((TAU - 2 * a) * (i + 1)) / 10;
        return (
          <line
            key={i}
            x1={0}
            y1={0}
            x2={rx * Math.cos(ang) * 0.94}
            y2={ry * Math.sin(ang) * 0.94}
            stroke={rim}
            strokeWidth={rx * 0.012}
            opacity={0.28}
          />
        );
      })}
    </g>
  );
};

/** Expanding rings on the water surface. */
export const Ripples: React.FC<{
  frame: number;
  start: number;
  rx: number;
  count?: number;
  period?: number;
  color?: string;
}> = ({frame, start, rx, count = 3, period = 46, color = 'rgba(178, 216, 196, 0.5)'}) => (
  <>
    {Array.from({length: count}).map((_, i) => {
      const age = frame - start - i * (period / count);
      if (age < 0) return null;
      const t = (age % period) / period;
      const r = rx * (0.12 + t * 1.5);
      return (
        <ellipse
          key={i}
          cx={0}
          cy={0}
          rx={r}
          ry={r * 0.28}
          fill="none"
          stroke={color}
          strokeWidth={Math.max(0.6, 3 * (1 - t))}
          opacity={(1 - t) * 0.7}
        />
      );
    })}
  </>
);

/** A clutch of frogspawn: dark beads inside a soft glowing jelly. */
export const Spawn: React.FC<{frame: number; glow: number}> = ({frame, glow}) => (
  <g>
    <ellipse cx={0} cy={-6} rx={42} ry={17} fill="rgba(150, 210, 175, 0.20)" />
    {Array.from({length: 11}).map((_, i) => {
      const x = (random(`sx${i}`) - 0.5) * 68;
      const y = -6 + (random(`sy${i}`) - 0.5) * 20;
      const pulse = 0.45 + 0.55 * Math.abs(Math.sin(frame / 21 + i));
      return (
        <g key={i}>
          <circle cx={x} cy={y} r={7} fill="rgba(190, 235, 190, 0.30)" />
          <circle cx={x} cy={y} r={3} fill="#dff5b0" opacity={0.35 + pulse * 0.5 * glow} />
        </g>
      );
    })}
  </g>
);

/**
 * The newborn: a froglet sitting in profile, facing right. Its own drawing
 * rather than the fighter rig, because a sitting frog folds up completely
 * differently from a standing one.
 */
export const Froglet: React.FC<{
  frame: number;
  blink?: number;
  /** 0..1, how much it lifts its head toward the moon. */
  lookUp?: number;
}> = ({frame, blink = 0, lookUp = 0}) => {
  const breathe = Math.sin(TAU * frame * 0.014) * 1.6;

  return (
    <g>
      {/* folded hind leg */}
      <ellipse cx={-13} cy={-19} rx={17} ry={14} fill={palette.frogDark} />
      <path
        d="M -6 -10 C 2 -6, 12 -4, 18 -2 L 20 3 L -2 3 C -8 2, -10 -4, -6 -10 Z"
        fill={palette.frogDark}
      />
      {/* webbed hind foot */}
      <path d="M 2 -1 L 30 -1 Q 36 3, 30 6 L 0 6 Q -4 2, 2 -1 Z" fill={palette.frogDark} />

      {/* body */}
      <g transform={`translate(0 ${breathe * 0.4})`}>
        <ellipse cx={3} cy={-23} rx={20} ry={17 + breathe * 0.5} fill={palette.frog} />
        <ellipse cx={7} cy={-17} rx={13} ry={9} fill={palette.frogBelly} opacity={0.5} />
        {/* front arm propping it up */}
        <path d="M 15 -28 C 20 -20, 21 -10, 20 -2 L 13 -2 C 12 -12, 11 -21, 9 -27 Z" fill={palette.frogDark} />
        <path d="M 12 -3 L 26 -3 Q 30 0, 26 3 L 11 3 Z" fill={palette.frogDark} />

        {/* head */}
        <g transform={`translate(17 -43) rotate(${-lookUp * 22}) scale(0.54) translate(-10 -6)`}>
          <FrogHead helmet={false} blink={blink} />
        </g>
      </g>
    </g>
  );
};
