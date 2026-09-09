import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.85}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 68% 62% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,${
        strength * 0.55
      }) 78%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Film grain from feTurbulence, reseeded per frame so it never freezes. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.16}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id="grainFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={frame % 97}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainFilter)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Letterbox: React.FC<{height?: number}> = ({height = 92}) => (
  <>
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height, background: '#000'}} />
    <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height, background: '#000'}} />
  </>
);

/** A single hard flash of light — lightning, a sword catch, a cut. */
export const Flash: React.FC<{progress: number; color?: string; max?: number}> = ({
  progress,
  color = '#dff0ff',
  max = 0.9,
}) => {
  const o = interpolate(progress, [0, 0.12, 1], [0, max, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return o <= 0.001 ? null : (
    <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: 'screen', pointerEvents: 'none'}} />
  );
};

/** Dirt kicked up by the hooves. */
export const Dust: React.FC<{frame: number; x: number; y: number; count?: number; intensity?: number}> = ({
  frame,
  x,
  y,
  count = 34,
  intensity = 1,
}) => (
  <>
    {Array.from({length: count}).map((_, i) => {
      const life = 34 + random(`dl${i}`) * 26;
      const t = ((frame + i * 7) % life) / life;
      const spread = random(`ds${i}`);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x - t * (180 + spread * 320),
            bottom: y + t * (40 + spread * 150) - 10,
            width: 8 + spread * 26,
            height: 8 + spread * 26,
            borderRadius: '50%',
            background: `rgba(120, 140, 120, ${(1 - t) * 0.22 * intensity})`,
            filter: 'blur(6px)',
          }}
        />
      );
    })}
  </>
);

/** Horizontal speed streaks for the charge. */
export const SpeedLines: React.FC<{frame: number; intensity: number}> = ({frame, intensity}) => (
  <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
    {Array.from({length: 26}).map((_, i) => {
      const y = random(`sly${i}`) * 1080;
      const speed = 60 + random(`sls${i}`) * 120;
      const x = 2200 - ((frame * speed + random(`slo${i}`) * 2600) % 3400);
      const len = 160 + random(`sll${i}`) * 520;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: len,
            height: 2,
            background: `linear-gradient(90deg, rgba(220,240,230,0), rgba(220,240,230,${
              0.35 * intensity
            }), rgba(220,240,230,0))`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);
