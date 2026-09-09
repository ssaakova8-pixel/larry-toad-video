import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Band, ridgeLine, ridgePath} from './Environment';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

type SeasonTheme = {
  sky: [string, string, string];
  sun: string;
  sunGlow: string;
  far: string;
  mid: string;
  ground: string;
  groundEdge: string;
  tree: string;
  crown: string | null;
  particle: 'petal' | 'firefly' | 'leaf' | 'snow';
  particleColor: string;
  haze: string;
};

export const SEASONS: Record<Season, SeasonTheme> = {
  spring: {
    sky: ['#6f9cb0', '#a9c9c6', '#dfead4'],
    sun: '#f6f3d8',
    sunGlow: 'rgba(240, 246, 210, 0.45)',
    far: '#5b8b78',
    mid: '#33604c',
    ground: '#1b3122',
    groundEdge: 'rgba(150, 200, 160, 0.35)',
    tree: '#16281c',
    crown: '#274b34',
    particle: 'petal',
    particleColor: '#f6d3e2',
    haze: 'rgba(190, 220, 205, 0.30)',
  },
  summer: {
    sky: ['#d99a52', '#f2cd8e', '#fbeec6'],
    sun: '#fff4c8',
    sunGlow: 'rgba(255, 226, 150, 0.55)',
    far: '#8a7c45',
    mid: '#4f5f31',
    ground: '#222f18',
    groundEdge: 'rgba(230, 210, 140, 0.35)',
    tree: '#1b2412',
    crown: '#2f3d1c',
    particle: 'firefly',
    particleColor: '#ffeba2',
    haze: 'rgba(250, 220, 160, 0.28)',
  },
  autumn: {
    sky: ['#9c4a34', '#d9834a', '#f4c483'],
    sun: '#ffd9a0',
    sunGlow: 'rgba(255, 175, 105, 0.5)',
    far: '#8a5232',
    mid: '#5a3520',
    ground: '#2c1a10',
    groundEdge: 'rgba(240, 170, 100, 0.35)',
    tree: '#241309',
    crown: '#7a3f18',
    particle: 'leaf',
    particleColor: '#e08b3c',
    haze: 'rgba(240, 175, 110, 0.30)',
  },
  winter: {
    sky: ['#5b7288', '#93a9bd', '#d6e0ea'],
    sun: '#eef4fb',
    sunGlow: 'rgba(225, 238, 250, 0.5)',
    far: '#93a8bb',
    mid: '#5b7285',
    ground: '#c9d7e4',
    groundEdge: 'rgba(255, 255, 255, 0.7)',
    tree: '#2b3846',
    crown: null,
    particle: 'snow',
    particleColor: '#ffffff',
    haze: 'rgba(220, 234, 246, 0.42)',
  },
};

/** Ground line for the training montage, in pixels from the bottom. */
export const GROUND_Y = 214;

const Tree: React.FC<{theme: SeasonTheme; h: number}> = ({theme, h}) => (
  <g>
    <path
      d={`M -4 0 L -2.5 ${-h * 0.62} L 2.5 ${-h * 0.62} L 4 0 Z`}
      fill={theme.tree}
    />
    {theme.crown ? (
      <>
        <ellipse cx={0} cy={-h * 0.78} rx={h * 0.30} ry={h * 0.26} fill={theme.crown} />
        <ellipse cx={-h * 0.17} cy={-h * 0.64} rx={h * 0.19} ry={h * 0.16} fill={theme.crown} />
        <ellipse cx={h * 0.18} cy={-h * 0.66} rx={h * 0.17} ry={h * 0.15} fill={theme.crown} />
      </>
    ) : (
      <path
        d={`M 0 ${-h * 0.55} L 0 ${-h}
            M 0 ${-h * 0.78} L ${-h * 0.24} ${-h * 0.96}
            M 0 ${-h * 0.7} L ${h * 0.22} ${-h * 0.92}
            M 0 ${-h * 0.9} L ${-h * 0.15} ${-h * 1.08}
            M 0 ${-h * 0.86} L ${h * 0.17} ${-h * 1.05}`}
        stroke={theme.tree}
        strokeWidth={h * 0.045}
        fill="none"
        strokeLinecap="round"
      />
    )}
  </g>
);

/** Petals, fireflies, leaves or snow, depending on the season. */
export const SeasonParticles: React.FC<{season: Season; frame: number; count?: number}> = ({
  season,
  frame,
  count = 46,
}) => {
  const theme = SEASONS[season];
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {Array.from({length: count}).map((_, i) => {
        const speed = 0.5 + random(`ps${season}${i}`) * 2.2;
        const sway = Math.sin(frame / (18 + (i % 9) * 3) + i) * (26 + random(`pa${i}`) * 34);
        const x = random(`px${season}${i}`) * 2020 - 60 + sway;
        const size = 5 + random(`pz${season}${i}`) * 9;

        if (theme.particle === 'firefly') {
          const y = 180 + random(`py${season}${i}`) * 700 + Math.sin(frame / 32 + i) * 40;
          const flick = 0.2 + 0.8 * Math.pow(Math.abs(Math.sin(frame / 12 + i * 2)), 3);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                bottom: y,
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: theme.particleColor,
                opacity: flick,
                boxShadow: `0 0 12px 4px ${theme.particleColor}66`,
              }}
            />
          );
        }

        const fall = (random(`py${season}${i}`) * 1260 - frame * speed * 2.4 + 1260 * 4) % 1260;
        const spin = frame * (1.4 + random(`pr${i}`) * 3) + i * 40;
        const round = theme.particle === 'snow';
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              bottom: fall - 100,
              width: size,
              height: round ? size : size * 0.62,
              borderRadius: round ? '50%' : '60% 20% 60% 20%',
              background: theme.particleColor,
              opacity: round ? 0.85 : 0.75,
              transform: round ? undefined : `rotate(${spin}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * A seasonal backdrop built from the same tiled-ridge parallax as the night
 * swamp, so the montage sits in the same visual language as the teaser.
 */
export const SeasonScape: React.FC<{season: Season; scroll: number; frame: number}> = ({
  season,
  scroll,
  frame,
}) => {
  const t = SEASONS[season];
  const farRidge = ridgePath(1200, 340, 180, [
    [1, 52, 0.7],
    [2, 24, 2.4],
    [3, 12, 4.1],
  ]);
  const midRidge = ridgePath(950, 320, 150, [
    [1, 60, 2.0],
    [3, 22, 0.9],
    [5, 10, 3.6],
  ]);
  const groundWaves: [number, number, number][] = [
    [1, 10, 0.6],
    [4, 5, 2.2],
    [9, 2.5, 1.4],
  ];

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${t.sky[0]} 0%, ${t.sky[1]} 52%, ${t.sky[2]} 100%)`,
        }}
      />

      {/* low sun and its halo */}
      <div
        style={{
          position: 'absolute',
          left: 1290,
          bottom: 330,
          width: 1100,
          height: 1100,
          transform: 'translate(-50%, 50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${t.sunGlow} 0%, rgba(0,0,0,0) 58%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 1290,
          bottom: 330,
          width: 150,
          height: 150,
          transform: 'translate(-50%, 50%)',
          borderRadius: '50%',
          background: t.sun,
        }}
      />

      <Band offset={scroll * 0.1} tileW={1200} bottom={GROUND_Y + 60} height={340}>
        <svg viewBox="0 0 1200 340" width="100%" height="100%" preserveAspectRatio="none">
          <path d={farRidge} fill={t.far} opacity={0.85} />
        </svg>
      </Band>

      <Band offset={scroll * 0.26} tileW={950} bottom={GROUND_Y + 6} height={320}>
        <svg viewBox="0 0 950 320" width="100%" height="100%" preserveAspectRatio="none" overflow="visible">
          <path d={midRidge} fill={t.mid} />
          {[110, 330, 560, 800].map((x, i) => (
            <g key={x} transform={`translate(${x} ${176 - i * 5})`}>
              <Tree theme={t} h={96 + i * 14} />
            </g>
          ))}
        </svg>
      </Band>

      {/* haze band along the horizon */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: GROUND_Y - 20,
          height: 230,
          background: `linear-gradient(180deg, rgba(0,0,0,0), ${t.haze})`,
        }}
      />

      <Band offset={scroll * 0.9} tileW={820} bottom={0} height={330}>
        <svg viewBox="0 0 820 330" width="100%" height="100%" preserveAspectRatio="none">
          <path d={ridgePath(820, 330, 330 - GROUND_Y, groundWaves)} fill={t.ground} />
          <path
            d={ridgeLine(820, 330 - GROUND_Y, groundWaves)}
            fill="none"
            stroke={t.groundEdge}
            strokeWidth={2.5}
          />
        </svg>
      </Band>

      <SeasonParticles season={season} frame={frame} />
    </AbsoluteFill>
  );
};
