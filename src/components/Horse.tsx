import React from 'react';
import {palette} from '../theme';

const TAU = Math.PI * 2;

/** Lighten (amount > 0) or darken (amount < 0) a hex colour. */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const to = amount > 0 ? 255 : 0;
  const a = Math.abs(amount);
  const mix = (c: number) => Math.round(c + (to - c) * a);
  return `rgb(${mix((n >> 16) & 255)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
}

type LegProps = {
  x: number;
  y: number;
  phase: number;
  front: boolean;
  far: boolean;
  t: number;
  fill: string;
  /** 0 = legs planted and straight, 1 = full gallop swing. */
  gait: number;
};

/**
 * A single articulated leg: thigh -> shin -> hoof, all driven off `t`
 * (stride progress in turns) so a frame always renders identically.
 */
const Leg: React.FC<LegProps> = ({x, y, phase, front, far, t, fill, gait}) => {
  const dir = front ? -1 : 1;
  const swing = Math.sin(TAU * t + phase);
  const bend = Math.max(0, Math.sin(TAU * t + phase + 1.15));

  const thigh = dir * swing * 30 * gait;
  const shin = (front ? -bend * 62 : bend * 66) * gait;
  const hoof = (front ? bend * 24 : -bend * 20) * gait;

  return (
    <g transform={`translate(${x} ${y})`} opacity={far ? 0.6 : 1}>
      <g transform={`rotate(${thigh})`}>
        <path d="M -9 -4 L 9 -4 L 6 44 L -6 44 Z" fill={fill} />
        <g transform="translate(0 44)">
          <g transform={`rotate(${shin})`}>
            <path d="M -6 -3 L 6 -3 L 4.5 40 L -3.5 40 Z" fill={fill} />
            <g transform={`translate(0 40) rotate(${hoof})`}>
              <path d="M -6 0 L 6 0 L 7 9 Q 0 12 -7 9 Z" fill={far ? fill : palette.ink} />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
};

export type HorseProps = {
  /** Stride progress in turns (1 = one full gallop cycle). */
  stride: number;
  /** 0 = four hooves down, 1 = fully reared. */
  rear?: number;
  /** 0 = standing still, 1 = full gallop. */
  gait?: number;
  bodyFill?: string;
  rim?: string;
};

/**
 * Side-view warhorse facing right, drawn for a 340x250 box with the ground
 * line at y = 214. Returned as a bare <g> so a rider can share its transform.
 */
export const HorseShape: React.FC<HorseProps> = ({
  stride: t,
  rear = 0,
  gait = 1,
  bodyFill = palette.ink,
  rim = palette.mist,
}) => {
  const tailWave = Math.sin(TAU * t + 0.6) * 10;
  const headNod = Math.sin(TAU * t + 2.4) * 6 * (1 - rear) * gait - rear * 26;
  const farFill = shade(bodyFill, -0.4);
  const gid = 'horseBody';

  return (
    <g>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(bodyFill, 0.3)} />
          <stop offset="55%" stopColor={bodyFill} />
          <stop offset="100%" stopColor={shade(bodyFill, -0.28)} />
        </linearGradient>
      </defs>

      {/* far side legs first, so they read as depth */}
      <Leg x={96} y={118} phase={Math.PI * 0.85} front={false} far t={t} gait={gait} fill={farFill} />
      <Leg x={206} y={112} phase={Math.PI * 1.75} front far t={t} gait={gait} fill={farFill} />

      {/* tail */}
      <path
        d={`M 62 92 C ${34 + tailWave} 104, ${18 - tailWave} 134, ${28 + tailWave * 1.5} 170
            C ${18 + tailWave} 144, ${34 - tailWave} 116, 60 112 Z`}
        fill={farFill}
      />

      {/* barrel, haunch, shoulder, neck */}
      <g fill={`url(#${gid})`}>
        <path
          d="M 58 118 C 50 94, 62 72, 94 66 C 126 60, 176 60, 204 72
             C 220 78, 230 90, 232 104 C 234 122, 224 134, 208 138
             C 176 148, 108 148, 84 140 C 66 134, 58 128, 58 118 Z"
        />
        <circle cx="92" cy="106" r="36" />
        <circle cx="204" cy="102" r="30" />
        <path
          d="M 196 74 C 206 52, 228 34, 254 24 L 286 52
             C 262 62, 244 82, 236 106 C 224 96, 202 88, 196 74 Z"
        />
      </g>

      {/* head, nodding with the gait */}
      <g transform={`rotate(${headNod} 258 40)`}>
        <path
          d="M 250 22 C 268 8, 300 6, 314 18 C 324 27, 322 40, 310 46
             L 286 58 C 268 58, 254 46, 250 34 Z"
          fill={`url(#${gid})`}
        />
        <path d="M 262 18 L 266 -2 L 276 16 Z" fill={bodyFill} />
        <path d="M 278 16 L 286 -1 L 292 18 Z" fill={farFill} />
        <path
          d="M 254 20 C 240 2, 226 6, 230 24 C 216 12, 206 22, 214 40 C 200 34, 192 46, 202 60 C 190 60, 188 70, 196 76 C 210 62, 232 44, 252 30 Z"
          fill={farFill}
        />
        <circle cx="292" cy="28" r="3.6" fill={palette.gold} opacity={0.9} />
        <circle cx="313" cy="34" r="2.4" fill={palette.ink} opacity={0.6} />
        <path
          d="M 300 20 L 306 44 M 262 32 L 306 44"
          stroke={palette.goldDeep}
          strokeWidth={2.4}
          fill="none"
          opacity={0.85}
        />
      </g>

      {/* rim light along the topline */}
      <path
        d="M 58 112 C 52 86, 66 70, 96 64 C 130 57, 178 58, 206 71 C 218 62, 232 44, 254 28"
        stroke={rim}
        strokeWidth={2.6}
        fill="none"
        opacity={0.45}
        strokeLinecap="round"
      />

      {/* near side legs */}
      <Leg x={100} y={116} phase={0} front={false} far={false} t={t} gait={gait} fill={bodyFill} />
      <Leg x={210} y={110} phase={Math.PI} front far={false} t={t} gait={gait} fill={bodyFill} />

      {/* saddle blanket */}
      <path d="M 122 74 L 190 74 L 182 116 L 118 110 Z" fill={palette.crimsonDark} />
      <path d="M 122 74 L 190 74 L 189 83 L 121 83 Z" fill={palette.goldDeep} opacity={0.85} />
    </g>
  );
};
