import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {GROUND_Y, Season, SeasonScape} from '../../components/Seasons';
import {FrogFighter, poseFor, PoseKind} from '../../components/FrogFighter';
import {Flat} from '../../components/Flat';
import {CaptionLine} from '../../components/Titles';
import {Vignette} from '../../components/Effects';

type Shot = {
  season: Season;
  kind: PoseKind;
  /** How grown he is in this shot, 0..1 — drives scale and gear. */
  age: number;
  /** Horizontal placement of the character, in canvas pixels. */
  x: number;
  /** Camera push over the shot. */
  zoom: [number, number];
  /** Extra props for the backdrop: a training post, a stump, and so on. */
  prop?: 'dummy' | 'stump' | 'none';
};

/**
 * Fourteen beats across four seasons — three or four per season, roughly a
 * second each. He grows shot by shot; the gear arrives with him.
 */
export const SHOTS: Shot[] = [
  {season: 'spring', kind: 'swing', age: 0.0, x: 820, zoom: [1.12, 1.02], prop: 'none'},
  {season: 'spring', kind: 'leap', age: 0.05, x: 700, zoom: [1.0, 1.14], prop: 'none'},
  {season: 'spring', kind: 'run', age: 0.12, x: 900, zoom: [1.2, 1.05], prop: 'none'},

  {season: 'summer', kind: 'strike', age: 0.22, x: 700, zoom: [1.05, 1.18], prop: 'dummy'},
  {season: 'summer', kind: 'balance', age: 0.3, x: 960, zoom: [1.22, 1.06], prop: 'stump'},
  {season: 'summer', kind: 'swing', age: 0.38, x: 860, zoom: [1.02, 1.16], prop: 'none'},
  {season: 'summer', kind: 'leap', age: 0.44, x: 640, zoom: [1.16, 1.02], prop: 'none'},

  {season: 'autumn', kind: 'run', age: 0.52, x: 840, zoom: [1.04, 1.2], prop: 'none'},
  {season: 'autumn', kind: 'swing', age: 0.6, x: 900, zoom: [1.26, 1.08], prop: 'none'},
  {season: 'autumn', kind: 'strike', age: 0.68, x: 720, zoom: [1.02, 1.18], prop: 'dummy'},

  {season: 'winter', kind: 'kneel', age: 0.76, x: 880, zoom: [1.24, 1.06], prop: 'none'},
  {season: 'winter', kind: 'swing', age: 0.84, x: 820, zoom: [1.0, 1.16], prop: 'none'},
  {season: 'winter', kind: 'strike', age: 0.92, x: 760, zoom: [1.18, 1.02], prop: 'none'},
  {season: 'winter', kind: 'raise', age: 1.0, x: 940, zoom: [1.06, 1.26], prop: 'none'},
];

/** Cut points, spread evenly across the montage. */
export function shotBounds(duration: number) {
  const each = duration / SHOTS.length;
  return SHOTS.map((_, i) => ({from: Math.round(i * each), to: Math.round((i + 1) * each)}));
}

const Prop: React.FC<{kind: Shot['prop']; color: string}> = ({kind, color}) => {
  if (kind === 'dummy') {
    return (
      <g transform="translate(250 0)">
        <rect x={-9} y={-190} width={18} height={190} fill={color} />
        <rect x={-64} y={-152} width={128} height={16} rx={7} fill={color} />
        <ellipse cx={0} cy={-186} rx={26} ry={30} fill={color} />
        <path d="M -26 -110 L 26 -110 L 20 -42 L -20 -42 Z" fill={color} />
      </g>
    );
  }
  if (kind === 'stump') {
    return (
      <g transform="translate(0 4)">
        <path d="M -54 0 L -44 -74 L 44 -74 L 54 0 Z" fill={color} />
        <ellipse cx={0} cy={-74} rx={44} ry={13} fill={color} />
      </g>
    );
  }
  return null;
};

/**
 * Act I, part two: the growing-up montage. Every shot is the same rig in a
 * different action against a different season, cut hard on the beat.
 */
export const Training: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const bounds = shotBounds(duration);
  const index = Math.min(
    SHOTS.length - 1,
    bounds.findIndex((b) => frame < b.to) === -1 ? SHOTS.length - 1 : bounds.findIndex((b) => frame < b.to)
  );
  const shot = SHOTS[index];
  const {from, to} = bounds[index];
  const len = to - from;
  const local = frame - from;
  const t = local / len;

  const zoom = interpolate(t, [0, 1], shot.zoom, {easing: Easing.inOut(Easing.quad)});
  // Each cut lands with a tiny impact shake, then settles.
  const punch = interpolate(local, [0, 5], [1, 0], {extrapolateRight: 'clamp'});
  const shakeX = Math.sin(local * 2.3) * 7 * punch;
  const shakeY = Math.cos(local * 3.1) * 6 * punch;
  // Handful of frames of white on the cut, so the montage snaps.
  const cutFlash = interpolate(local, [0, 3], [0.32, 0], {extrapolateRight: 'clamp'});

  // He grows across the montage and picks up his helmet halfway through.
  const scale = 1.05 + shot.age * 1.15;
  const stanceX = shot.x + (shot.kind === 'run' ? interpolate(t, [0, 1], [-160, 200]) : 0);
  const groundOffset = random(`g${index}`) * 8;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${zoom})`,
          transformOrigin: '50% 68%',
        }}
      >
        <SeasonScape season={shot.season} scroll={frame * 1.4 + index * 900} frame={frame} />

        <svg
          viewBox="0 0 1920 1080"
          width="100%"
          height="100%"
          style={{position: 'absolute', inset: 0}}
        >
          <g transform={`translate(${stanceX} ${1080 - GROUND_Y + groundOffset})`}>
            <Flat id={`sil${index}`} color={shot.season === 'winter' ? '#20303c' : '#111c15'}>
              <Prop kind={shot.prop} color="#000" />
              <FrogFighter
                pose={poseFor(shot.kind, t)}
                scale={scale}
                helmet={shot.age > 0.5}
                headScale={0.86 - shot.age * 0.14}
              />
            </Flat>
          </g>
        </svg>
      </AbsoluteFill>

      <CaptionLine local={frame - 26} duration={100} text="Он рос." bottom={250} size={40} tone="dark" />
      <CaptionLine
        local={frame - duration + 130}
        duration={124}
        text="И болото росло вместе с ним."
        bottom={250}
        size={40}
        tone="dark"
      />

      <Vignette strength={0.75} />
      <AbsoluteFill
        style={{background: '#f4f8ff', opacity: cutFlash, mixBlendMode: 'screen'}}
      />
    </AbsoluteFill>
  );
};
