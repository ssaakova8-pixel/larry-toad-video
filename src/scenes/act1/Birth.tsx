import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {Environment} from '../../components/Environment';
import {Froglet, LilyPad, Ripples, Spawn} from '../../components/Pond';
import {CaptionLine} from '../../components/Titles';
import {Flash, Vignette} from '../../components/Effects';

// Where the hero pad sits, in canvas pixels.
const PAD_X = 1150;
const PAD_Y = 890;
const HATCH = 152;

/**
 * Act I, part one: a still swamp under the moon. Frogspawn on a lily pad
 * brightens, and the froglet is suddenly there. The camera creeps in the
 * whole time, ending roughly twice as tight as it started.
 */
export const Birth: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, duration], [1, 2.15], {
    easing: Easing.inOut(Easing.quad),
  });
  const fadeUp = interpolate(frame, [0, 55], [0, 1], {extrapolateRight: 'clamp'});

  const glow = interpolate(frame, [30, HATCH - 10], [0.2, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const spawnOut = interpolate(frame, [HATCH - 14, HATCH + 16], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const born = interpolate(frame, [HATCH + 6, HATCH + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const hatchFlash = interpolate(frame, [HATCH - 8, HATCH + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const blink =
    frame > 236 && frame < 244
      ? Math.sin(((frame - 236) / 8) * Math.PI)
      : frame > 302 && frame < 309
        ? Math.sin(((frame - 302) / 7) * Math.PI)
        : 0;
  const lookUp = interpolate(frame, [330, 400], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{background: '#04080b'}}>
      <AbsoluteFill
        style={{
          transform: `scale(${push})`,
          transformOrigin: `${(PAD_X / 1920) * 100}% ${(PAD_Y / 1080) * 100}%`,
        }}
      >
        <Environment scroll={frame * 0.16} frame={frame} mist={1.25} moonY={130} showBank={false} />

        {/* the pond itself, drawn over the Environment's distant water */}
        <svg
          viewBox="0 0 1920 1080"
          width="100%"
          height="100%"
          style={{position: 'absolute', inset: 0}}
        >
          <defs>
            <linearGradient id="pondWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f272c" />
              <stop offset="55%" stopColor="#081619" />
              <stop offset="100%" stopColor="#040c0f" />
            </linearGradient>
            <radialGradient id="moonStreak" cx="0.5" cy="0" r="0.85">
              <stop offset="0%" stopColor="rgba(214,240,205,0.30)" />
              <stop offset="55%" stopColor="rgba(214,240,205,0.09)" />
              <stop offset="100%" stopColor="rgba(214,240,205,0)" />
            </radialGradient>
          </defs>

          <rect x="0" y="744" width="1920" height="336" fill="url(#pondWater)" />
          <ellipse cx="1435" cy="750" rx="190" ry="230" fill="url(#moonStreak)" />

          {/* surface chop */}
          {Array.from({length: 34}).map((_, i) => {
            const y = 752 + i * 9.4;
            const w = 70 + random(`pw${i}`) * 380;
            const x = (random(`px${i}`) * 1920 + Math.sin(frame / 26 + i) * 22 + 1920) % 1920;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={w}
                height={1.5}
                fill="rgba(168, 208, 186, 0.13)"
              />
            );
          })}

          {/* background pads */}
          <g transform="translate(560 960)" opacity={0.75}>
            <LilyPad rx={168} ry={44} notch={26} />
          </g>
          <g transform="translate(1660 830)" opacity={0.6}>
            <LilyPad rx={104} ry={27} notch={16} />
          </g>
          <g transform="translate(320 800)" opacity={0.5}>
            <LilyPad rx={86} ry={22} notch={30} />
          </g>

          {/* hero pad */}
          <g transform={`translate(${PAD_X} ${PAD_Y})`}>
            <Ripples frame={frame} start={HATCH} rx={210} count={4} period={64} />
            <LilyPad rx={196} ry={52} notch={22} fill="#153823" rim="#4b8158" />

            <g opacity={spawnOut} transform="translate(-14 -14) scale(1.35)">
              <Spawn frame={frame} glow={glow} />
            </g>

            <g
              opacity={born}
              transform={`translate(-6 -12) scale(${1.55 * (0.6 + 0.4 * born)})`}
            >
              <Froglet frame={frame} blink={blink} lookUp={lookUp} />
            </g>
          </g>
        </svg>

        {/* soft bloom on the moment of hatching */}
        <div
          style={{
            position: 'absolute',
            left: PAD_X - 320,
            top: PAD_Y - 320,
            width: 640,
            height: 640,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(216,246,178,${
              0.5 * hatchFlash * (1 - hatchFlash) * 4
            }) 0%, rgba(216,246,178,0) 62%)`,
          }}
        />
      </AbsoluteFill>

      <CaptionLine local={frame - 34} duration={128} text="Тысячу лун болото ждало." bottom={200} />
      <CaptionLine
        local={frame - 268}
        duration={168}
        text="И однажды — дождалось."
        bottom={200}
      />

      <Flash progress={hatchFlash} color="#e6ffc4" max={0.32} />
      <Vignette strength={1} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - fadeUp}} />
    </AbsoluteFill>
  );
};
