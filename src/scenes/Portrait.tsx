import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {FrogHead} from '../components/FrogKnight';
import {Flash, Grain, Vignette} from '../components/Effects';
import {palette} from '../theme';

/** Hero close-up: the frog knight, lit by one cold flash of lightning. */
export const Portrait: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, duration], [1.12, 0.96], {
    easing: Easing.out(Easing.quad),
  });
  const turn = interpolate(frame, [0, duration], [-9, 4], {
    easing: Easing.inOut(Easing.quad),
  });

  // Two quick blinks, then a croak.
  const blink =
    frame >= 26 && frame < 32
      ? Math.sin(((frame - 26) / 6) * Math.PI)
      : frame >= 40 && frame < 45
        ? Math.sin(((frame - 40) / 5) * Math.PI)
        : 0;
  const croak = interpolate(frame, [56, 64, 72], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lightning = interpolate(frame, [50, 62], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const swordY = interpolate(frame, [30, 76], [520, 40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{background: '#050b0e'}}>
      {/* out-of-focus swamp behind the hero */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 70% at 68% 30%, #1c3a3a 0%, #0a1a1e 55%, #04090c 100%)`,
        }}
      />
      {Array.from({length: 18}).map((_, i) => {
        const s = 30 + random(`bk${i}`) * 90;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: random(`bkx${i}`) * 1920,
              top: random(`bky${i}`) * 900,
              width: s,
              height: s,
              borderRadius: '50%',
              background: 'rgba(190, 235, 150, 0.10)',
              filter: 'blur(18px)',
              opacity: 0.4 + 0.6 * Math.abs(Math.sin(frame / 20 + i)),
            }}
          />
        );
      })}

      {/* the blade rising into frame on the right */}
      <div
        style={{
          position: 'absolute',
          right: 250,
          top: swordY,
          transform: 'rotate(9deg)',
          filter: 'drop-shadow(0 0 26px rgba(190,220,255,0.35))',
        }}
      >
        <svg width="150" height="900" viewBox="-75 0 150 900" overflow="visible">
          <path d="M -26 900 L 26 900 L 20 120 L 0 40 L -20 120 Z" fill={palette.steel} />
          <path d="M -6 880 L 4 880 L 3 130 L -1 70 Z" fill="#ffffff" opacity={0.7} />
          <rect x="-70" y="880" width="140" height="26" rx="10" fill={palette.gold} />
        </svg>
      </div>

      {/* hero head */}
      <div
        style={{
          position: 'absolute',
          left: 560,
          top: 440,
          transform: `scale(${push * 8.2}) rotate(${turn * 0.3}deg)`,
          transformOrigin: 'center',
          // Pull the hero down into the film's night palette.
          filter: 'brightness(0.78) saturate(0.88) contrast(1.06)',
        }}
      >
        <svg width="220" height="220" viewBox="-110 -110 220 220" overflow="visible">
          {/* the head's own centre of mass sits up and back of the origin */}
          <g transform={`rotate(${turn * 0.4}) translate(29 18)`}>
            <FrogHead blink={blink} croak={croak} plumeWave={Math.sin(frame / 11) * 1.6} />
          </g>
        </svg>
      </div>

      <Flash progress={lightning} max={0.55} />
      <Vignette strength={1} />
      <Grain opacity={0.2} />
    </AbsoluteFill>
  );
};
