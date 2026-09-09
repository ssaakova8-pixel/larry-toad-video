import React from 'react';
import {palette} from '../theme';
import {shade} from './Horse';

const TAU = Math.PI * 2;

export type FrogHeadProps = {
  /** 0 = wide open eyes, 1 = fully blinked. */
  blink?: number;
  /** Small idle jaw movement, 0..1. */
  croak?: number;
  helmet?: boolean;
  plumeWave?: number;
};

/**
 * The hero's head in profile, facing right: a broad-mouthed frog with the
 * eyes riding high on the skull, wearing an open-faced barbute.
 */
export const FrogHead: React.FC<FrogHeadProps> = ({
  blink = 0,
  croak = 0,
  helmet = true,
  plumeWave = 0,
}) => {
  const lidY = -20 - 13 + blink * 22;
  const w = plumeWave;

  return (
    <g>
      {helmet ? (
        <>
          {/* plume streaming back off the crest — kept short and full so it
              still reads as a plume when the character is a silhouette */}
          <path
            d={`M -24 -46 C ${-50 + w * 4} ${-66 - w * 3}, ${-76 - w * 3} ${-58 + w * 4}, ${-94 - w * 2} ${-26 + w * 5}
                C ${-82 - w * 2} ${-46 + w * 3}, ${-56 + w * 3} ${-42 - w * 2}, -26 -18 Z`}
            fill={palette.crimson}
          />
          <path
            d={`M -26 -42 C ${-48 + w * 4} ${-58 - w * 3}, ${-70 - w * 3} ${-52 + w * 4}, ${-84 - w * 2} ${-28 + w * 4}
                C ${-74 - w * 2} ${-42 + w * 3}, ${-52 + w * 3} ${-40 - w * 2}, -26 -24 Z`}
            fill={palette.crimsonDark}
            opacity={0.75}
          />
        </>
      ) : null}

      {/* skull + snout */}
      <ellipse cx="-2" cy="-2" rx="25" ry="20" fill={palette.frogDark} />
      <path
        d={`M 4 -10 C 26 -16, 46 -6, 46 ${4 - croak * 2} C 46 ${15 + croak * 5}, 26 ${21 + croak * 4}, 2 16 Z`}
        fill={palette.frog}
      />
      <ellipse cx="-2" cy="-4" rx="24" ry="17" fill={palette.frog} />
      {/* throat tone */}
      <path
        d={`M 12 12 C 24 ${17 + croak * 4}, 34 ${17 + croak * 4}, 44 ${6 + croak * 2}
            C 39 ${14 + croak * 5}, 24 ${18 + croak * 5}, 11 16 Z`}
        fill={palette.frogBelly}
        opacity={0.55}
      />
      {/* mouth line */}
      <path
        d={`M 46 ${4 + croak * 3} C 30 ${11 + croak * 6}, 14 ${12 + croak * 5}, 0 9`}
        stroke="#26521f"
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="41" cy={-3} r="1.9" fill={palette.frogDark} />
      {/* moonlight catching the top of the snout */}
      <path
        d="M 10 -12 C 28 -16, 44 -8, 46 2"
        stroke="#dff3d0"
        strokeWidth={2.4}
        fill="none"
        opacity={0.5}
        strokeLinecap="round"
      />

      {helmet ? (
        <>
          {/* gilded rim, stroked so the band keeps an even width */}
          <path
            d="M -19 11 C -36 -6, -34 -32, -11 -42 C 6 -50, 22 -36, 24 -20"
            fill="none"
            stroke={palette.gold}
            strokeWidth={10}
            strokeLinecap="round"
          />
          {/* barbute shell, seated on the skull and stopping at the brow */}
          <path
            d="M -19 11 C -36 -6, -34 -32, -11 -42 C 6 -50, 22 -36, 24 -20
               L 15 -16 C 13 -30, 0 -42, -9 -36 C -27 -27, -28 -5, -14 10 Z"
            fill={palette.steelDark}
          />
          <path
            d="M -17 9 C -32 -6, -31 -30, -11 -39 C 5 -46, 20 -34, 22 -21
               L 17 -19 C 14 -31, 0 -41, -9 -35 C -25 -26, -26 -5, -13 8 Z"
            fill={palette.steel}
            opacity={0.9}
          />
        </>
      ) : null}

      {/* far eye */}
      <circle cx="-20" cy="-22" r="11" fill={palette.frogDark} />
      <circle cx="-20" cy="-23" r="6" fill={palette.goldDeep} />
      {/* near eye bulge */}
      <circle cx="-2" cy="-20" r="14" fill={palette.frog} />
      <circle cx="-2" cy="-21" r="8.5" fill={palette.gold} />
      <ellipse cx="-1" cy="-21" rx="2.6" ry="8" fill={palette.ink} />
      <circle cx="-5" cy="-25" r="2.4" fill="#ffffff" opacity={0.85} />
      {/* lid closes downward over the bulge */}
      <path d={`M -16 ${lidY} h 28 v -16 h -28 Z`} fill={palette.frogDark} opacity={blink > 0.02 ? 1 : 0} />
      <circle cx="-2" cy="-20" r="14" fill="none" stroke={palette.frogDark} strokeWidth={2} />
    </g>
  );
};

export type KnightProps = {
  /** Stride progress in turns, used for the saddle bounce and cloth waves. */
  stride: number;
  /** 0 = sword low across the saddle, 1 = sword held high. */
  swordRaise?: number;
  blink?: number;
};

/**
 * The rider as a bare <g>, origin at the hips so it can be dropped onto a
 * saddle. Faces right; roughly 150 units from hip to plume tip.
 */
export const KnightShape: React.FC<KnightProps> = ({stride: t, swordRaise = 0, blink = 0}) => {
  const wave = Math.sin(TAU * t);
  const lean = wave * 3;
  const capeA = Math.sin(TAU * t + 0.4) * 8;
  const capeB = Math.sin(TAU * t + 1.5) * 12;
  const armAngle = -14 - swordRaise * 74;
  // Blade angle measured from straight up; positive tilts forward.
  const bladeWorld = 34 - swordRaise * 48;
  const swordAngle = bladeWorld - armAngle;

  return (
    <g transform={`rotate(${lean})`}>
      {/* cape, behind everything */}
      <path
        d={`M -8 -60 C ${-44 + capeA} -52, ${-66 - capeB} -18, ${-84 - capeB * 1.6} ${16 + capeA}
            C ${-64 - capeB} ${16 + capeB}, ${-46 + capeA} ${26 - capeA}, -28 44
            C -18 20, -10 -18, -6 -58 Z`}
        fill={palette.crimson}
      />
      <path
        d={`M -8 -58 C ${-38 + capeA} -48, ${-56 - capeB} -16, ${-70 - capeB * 1.4} ${14 + capeA}
            C ${-54 - capeB} ${18 + capeB}, ${-40 + capeA} ${28 - capeA}, -26 42
            C -18 20, -12 -18, -8 -56 Z`}
        fill={palette.crimsonDark}
        opacity={0.7}
      />

      {/* far arm holding the reins */}
      <path d="M 4 -52 L 30 -30 L 44 -22" stroke={shade('#4a5c6b', -0.25)} strokeWidth={11} fill="none" strokeLinecap="round" />

      {/* legs over the saddle */}
      <path d="M -6 -6 C 14 -2, 30 8, 36 22 L 22 30 C 14 16, 2 8, -12 6 Z" fill={palette.steelDark} />
      <path d="M 34 20 L 46 22 L 44 54 L 28 52 Z" fill={palette.ink} />
      <path d="M 26 52 L 50 54 L 50 62 L 24 60 Z" fill={palette.ink} />
      <circle cx="22" cy="58" r="4" fill={palette.goldDeep} />

      {/* torso: cuirass */}
      <path
        d="M -16 -58 C -4 -66, 12 -62, 18 -52 C 26 -34, 24 -10, 14 4 L -18 6 C -26 -12, -24 -40, -16 -58 Z"
        fill={palette.steel}
      />
      <path
        d="M -16 -58 C -10 -62, -4 -63, 0 -62 C -2 -34, -4 -12, -4 6 L -18 6 C -26 -12, -24 -40, -16 -58 Z"
        fill={palette.steelDark}
        opacity={0.55}
      />
      {/* belt + tassets */}
      <path d="M -20 2 L 16 0 L 16 10 L -20 12 Z" fill={palette.goldDeep} />
      {/* heraldry: a fleur/lily mark */}
      <path d="M 2 -44 L 6 -34 L 2 -24 L -2 -34 Z" fill={palette.gold} opacity={0.9} />
      <circle cx="2" cy="-34" r="9" fill="none" stroke={palette.gold} strokeWidth={1.6} opacity={0.7} />

      {/* pauldron */}
      <ellipse cx="6" cy="-54" rx="17" ry="13" fill={palette.steel} transform="rotate(-12 6 -54)" />
      <ellipse cx="6" cy="-56" rx="12" ry="8" fill={palette.gold} opacity={0.35} transform="rotate(-12 6 -56)" />

      {/* sword arm + blade */}
      <g transform={`translate(8 -50) rotate(${armAngle})`}>
        <path d="M -6 -6 L 30 -8 L 30 8 L -6 8 Z" fill={palette.steelDark} />
        <g transform={`translate(34 0) rotate(${swordAngle})`}>
          {/* grip */}
          <rect x="-4" y="-6" width="8" height="18" rx="3" fill={palette.goldDeep} />
          <circle cx="0" cy="13" r="5" fill={palette.gold} />
          {/* crossguard */}
          <rect x="-16" y="-10" width="32" height="7" rx="3" fill={palette.gold} />
          {/* blade */}
          <path d="M -7 -10 L 7 -10 L 5 -128 L 0 -142 L -5 -128 Z" fill={palette.steel} />
          <path d="M -2 -12 L 1 -12 L 1 -130 L -0.5 -138 Z" fill="#ffffff" opacity={0.65} />
        </g>
      </g>

      {/* head */}
      <g transform="translate(-2 -78) scale(0.92)">
        <FrogHead blink={blink} plumeWave={wave} />
      </g>
    </g>
  );
};
