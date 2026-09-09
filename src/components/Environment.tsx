import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {palette} from '../theme';

/**
 * Builds a horizontally tileable ridge line from a sum of sines whose
 * frequencies are whole multiples of the tile width, so tiles butt together
 * without a visible seam.
 */
export function ridgeLine(
  tileW: number,
  base: number,
  waves: [freq: number, amp: number, phase: number][]
): string {
  // Step by index, not by accumulating a float: accumulating drops the last
  // sample short of tileW, which leaves an unfilled wedge at every tile edge.
  const steps = 48;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * tileW;
    let y = base;
    for (const [f, amp, phase] of waves) {
      y -= Math.sin((x / tileW) * Math.PI * 2 * f + phase) * amp;
    }
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
}

/** The same ridge, closed off at the bottom so it can be filled. */
export function ridgePath(
  tileW: number,
  height: number,
  base: number,
  waves: [freq: number, amp: number, phase: number][]
): string {
  return `M 0 ${height} L ${ridgeLine(tileW, base, waves).slice(2)} L ${tileW} ${height} Z`;
}

export type BandProps = {
  offset: number;
  tileW: number;
  children: React.ReactNode;
  bottom: number;
  height: number;
};

/** Repeats one tile three times and slides it, giving an endless band. */
export const Band: React.FC<BandProps> = ({offset, tileW, children, bottom, height}) => {
  const shift = -(((offset % tileW) + tileW) % tileW);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom, height, overflow: 'visible'}}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: shift + i * tileW,
            bottom: 0,
            // One pixel of overlap: a fractional scroll offset would otherwise
            // let the background show through as a vertical seam.
            width: tileW + 1,
            height,
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
};

export type EnvironmentProps = {
  /** World scroll in pixels; larger = further travelled. */
  scroll: number;
  frame: number;
  /** Overall haze/mist strength, 0..1. */
  mist?: number;
  moonY?: number;
  /** Draw the near bank; off when a scene supplies its own foreground. */
  showBank?: boolean;
};

export const Environment: React.FC<EnvironmentProps> = ({
  scroll,
  frame,
  mist = 1,
  moonY = 210,
  showBank = true,
}) => {
  const farHills = ridgePath(1200, 320, 190, [
    [1, 46, 0.4],
    [2, 22, 2.1],
    [3, 11, 4.3],
  ]);
  const midHills = ridgePath(900, 300, 150, [
    [1, 58, 2.2],
    [3, 20, 0.7],
    [5, 9, 3.9],
  ]);
  const bankWaves: [number, number, number][] = [
    [1, 9, 1.1],
    [4, 5, 2.6],
    [9, 2.5, 0.3],
  ];
  const bank = ridgePath(800, 330, 134, bankWaves);
  // Stroked separately: stroking the filled path would draw the tile's own
  // left/right edges and leave visible seams between tiles.
  const bankEdge = ridgeLine(800, 134, bankWaves);

  return (
    <AbsoluteFill>
      {/* sky */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${palette.skyTop} 0%, #0d2029 42%, ${palette.skyMid} 68%, #2a4f4a 88%, #3d6357 100%)`,
        }}
      />

      {/* moon halo */}
      <div
        style={{
          position: 'absolute',
          left: 1435 - 700,
          top: moonY + 105 - 700,
          width: 1400,
          height: 1400,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(214,240,205,${0.22 * mist}) 0%, rgba(180,216,196,${
            0.09 * mist
          }) 18%, rgba(140,186,166,${0.035 * mist}) 38%, rgba(120,170,150,${
            0.012 * mist
          }) 62%, rgba(120,170,150,0) 100%)`,
        }}
      />
      {/* moon */}
      <div
        style={{
          position: 'absolute',
          left: 1330,
          top: moonY,
          width: 210,
          height: 210,
          borderRadius: '50%',
          background: `radial-gradient(circle at 40% 38%, #f6ffe8 0%, ${palette.moon} 46%, #b9cf9e 74%, rgba(160,190,150,0) 76%)`,
        }}
      />

      {/* far ridge */}
      <Band offset={scroll * 0.08} tileW={1200} bottom={330} height={320}>
        <svg viewBox="0 0 1200 320" width="100%" height="100%" preserveAspectRatio="none">
          <path d={farHills} fill="#12303a" opacity={0.85} />
        </svg>
      </Band>

      {/* mid ridge with a dead tree line */}
      <Band offset={scroll * 0.2} tileW={900} bottom={300} height={300}>
        <svg viewBox="0 0 900 300" width="100%" height="100%" preserveAspectRatio="none">
          <path d={midHills} fill="#0c2028" />
          {[80, 300, 520, 760].map((x, i) => (
            <g key={x} transform={`translate(${x} ${168 - i * 4})`} opacity={0.9}>
              <path
                d="M 0 0 L 0 -70 M 0 -40 L -22 -62 M 0 -30 L 20 -56 M 0 -56 L -14 -76 M 0 -50 L 16 -74"
                stroke="#081319"
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
      </Band>

      {/* still water with a moon streak */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 186,
          height: 150,
          background: `linear-gradient(180deg, #0f2b30 0%, ${palette.deepWater} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 1330,
          bottom: 190,
          width: 210,
          height: 140,
          background:
            'radial-gradient(ellipse 46% 100% at 50% 0%, rgba(220,240,200,0.34), rgba(220,240,200,0))',
          filter: 'blur(10px)',
          transform: `scaleY(${1 + Math.sin(frame / 14) * 0.06})`,
          transformOrigin: 'top',
        }}
      />
      {Array.from({length: 26}).map((_, i) => {
        const y = 192 + i * 5.0;
        const w = 90 + random(`ripple${i}`) * 340;
        const x = ((random(`rx${i}`) * 1920 + Math.sin(frame / 22 + i) * 26) + 1920) % 1920;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              bottom: y,
              width: w,
              height: 1.6,
              background: 'rgba(180, 214, 190, 0.16)',
              filter: 'blur(1px)',
            }}
          />
        );
      })}

      {/* the bank the horse runs along */}
      {showBank ? (
      <Band offset={scroll * 0.85} tileW={800} bottom={0} height={330}>
        <svg viewBox="0 0 800 330" width="100%" height="100%" preserveAspectRatio="none">
          <path d={bank} fill="#071016" />
          <path d={bankEdge} fill="none" stroke="rgba(150, 196, 178, 0.30)" strokeWidth={2.5} />
        </svg>
      </Band>
      ) : null}

      {/* ground fog rolling over the water line */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: -400 + (((scroll * (0.05 + i * 0.05) + i * 700) % 2700) - 400),
            bottom: 168 + i * 26,
            width: 1500,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, rgba(150,190,175,${(0.13 - i * 0.03) * mist}) 0%, rgba(150,190,175,0) 70%)`,
            filter: 'blur(14px)',
          }}
        />
      ))}

      {/* fireflies */}
      {Array.from({length: 30}).map((_, i) => {
        const sx = random(`fx${i}`) * 2100 - 90;
        const sy = 240 + random(`fy${i}`) * 560;
        const drift = Math.sin(frame / (24 + random(`fs${i}`) * 30) + i) * 26;
        const flick = 0.25 + 0.75 * Math.pow(Math.abs(Math.sin(frame / (13 + i % 7) + i * 2)), 3);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: sx - scroll * 0.35 * (0.4 + random(`fp${i}`)) + drift,
              bottom: sy + Math.cos(frame / 28 + i) * 14,
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#dff5a6',
              opacity: flick * 0.9,
              boxShadow: '0 0 14px 5px rgba(200,245,140,0.5)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Fast foreground reeds that whip past the camera. */
export const Reeds: React.FC<{scroll: number; frame: number; count?: number}> = ({
  scroll,
  frame,
  count = 16,
}) => {
  const tileW = 1400;
  return (
    <Band offset={scroll * 1.9} tileW={tileW} bottom={-60} height={520}>
      <svg viewBox={`0 0 ${tileW} 520`} width="100%" height="100%" preserveAspectRatio="none" overflow="visible">
        {Array.from({length: count}).map((_, i) => {
          const x = (i / count) * tileW + random(`reedx${i}`) * 60;
          const h = 250 + random(`reedh${i}`) * 250;
          const sway = Math.sin(frame / 9 + i) * 18;
          return (
            <g key={i}>
              <path
                d={`M ${x} 520 C ${x + sway * 0.3} ${520 - h * 0.5}, ${x + sway} ${520 - h * 0.8}, ${x + sway * 1.6} ${520 - h}`}
                stroke="#040a0d"
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
              />
              <ellipse
                cx={x + sway * 1.6}
                cy={520 - h - 12}
                rx={7}
                ry={22}
                fill="#050d10"
                transform={`rotate(${sway * 0.6} ${x + sway * 1.6} ${520 - h - 12})`}
              />
            </g>
          );
        })}
      </svg>
    </Band>
  );
};
