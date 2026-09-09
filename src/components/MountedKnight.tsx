import React from 'react';
import {palette} from '../theme';
import {HorseShape} from './Horse';
import {KnightShape} from './FrogKnight';

const TAU = Math.PI * 2;

export type MountedKnightProps = {
  /** Stride progress in turns (1 = one gallop cycle). */
  stride: number;
  rear?: number;
  /** 0 = standing still, 1 = full gallop. */
  gait?: number;
  swordRaise?: number;
  blink?: number;
  bodyFill?: string;
  rim?: string;
  /**
   * 0 keeps the full-colour rider; 1 crushes horse and rider to a flat
   * silhouette, for anything sitting far back in the frame.
   */
  silhouette?: number;
};

/**
 * Horse + rider sharing one transform so the bounce and the rear-up read as a
 * single body. Ground line sits at y = 214 inside the viewBox.
 */
export const MountedKnight: React.FC<MountedKnightProps> = ({
  stride,
  rear = 0,
  gait = 1,
  swordRaise = 0,
  blink = 0,
  bodyFill = '#101c22',
  rim = palette.mist,
  silhouette = 0,
}) => {
  const bob = Math.sin(TAU * stride * 2) * (1.5 + 3 * gait) * (1 - rear);
  const filter =
    silhouette > 0
      ? `saturate(${1 - silhouette * 0.95}) brightness(${1 - silhouette * 0.82}) contrast(${1 + silhouette})`
      : undefined;

  return (
    <svg viewBox="-30 -170 400 400" width="100%" height="100%" overflow="visible">
      <g transform={`translate(0 ${bob}) rotate(${-rear * 32} 110 176)`} style={{filter}}>
        <HorseShape stride={stride} rear={rear} gait={gait} bodyFill={bodyFill} rim={rim} />
        <g transform="translate(150 64)">
          <KnightShape stride={stride} swordRaise={swordRaise} blink={blink} />
        </g>
        <path
          d="M 194 42 C 240 44, 270 44, 300 44"
          stroke={palette.goldDeep}
          strokeWidth={2.6}
          fill="none"
          opacity={0.8}
        />
      </g>
    </svg>
  );
};
