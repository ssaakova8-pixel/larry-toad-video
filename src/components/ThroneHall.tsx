import React from 'react';
import {random} from 'remotion';
import {palette} from '../theme';
import {FrogHead} from './FrogKnight';

/** Floor line of the hall, in canvas pixels from the top. */
export const FLOOR_Y = 872;
export const DAIS_Y = 792;

const GLASS = ['#2f5fa8', '#a5304a', '#c98a24', '#2f7e5c', '#6a3f96', '#1f3f7a'];

/** One lancet window: pointed arch, leaded grid, rose light at the head. */
const Window: React.FC<{x: number; w: number; top: number; bottom: number; seed: string}> = ({
  x,
  w,
  top,
  bottom,
  seed,
}) => {
  const half = w / 2;
  const springLine = top + w * 0.75;
  const arch = `M ${x - half} ${bottom} L ${x - half} ${springLine}
     Q ${x} ${top} ${x + half} ${springLine} L ${x + half} ${bottom} Z`;
  const rows = 7;
  const cols = 3;

  return (
    <g>
      <path d={arch} fill="#050810" />
      <g clipPath={`url(#clip-${seed})`}>
        <defs>
          <clipPath id={`clip-${seed}`}>
            <path d={arch} />
          </clipPath>
        </defs>
        {Array.from({length: rows * cols}).map((_, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          const cw = w / cols;
          const ch = (bottom - springLine + w * 0.75) / rows;
          return (
            <rect
              key={i}
              x={x - half + c * cw}
              y={top + r * ch}
              width={cw}
              height={ch}
              fill={GLASS[Math.floor(random(`${seed}${i}`) * GLASS.length)]}
              opacity={0.4 + random(`o${seed}${i}`) * 0.3}
            />
          );
        })}
        {/* rose light in the head of the arch */}
        <circle cx={x} cy={springLine - w * 0.2} r={w * 0.22} fill="#e8c15c" opacity={0.8} />
        <circle cx={x} cy={springLine - w * 0.2} r={w * 0.1} fill="#fff2c0" opacity={0.9} />
      </g>
      {/* leading and stone tracery */}
      <path d={arch} fill="none" stroke="#0a0d14" strokeWidth={9} />
      <path
        d={`M ${x} ${bottom} L ${x} ${springLine - w * 0.42}`}
        stroke="#0a0d14"
        strokeWidth={7}
      />
    </g>
  );
};

/** A shaft of coloured light falling from a window onto the floor. */
const Shaft: React.FC<{x: number; w: number; from: number; frame: number; seed: string}> = ({
  x,
  w,
  from,
  frame,
  seed,
}) => {
  const drop = FLOOR_Y - from;
  const slide = drop * 0.55;
  const flicker = 0.82 + 0.18 * Math.sin(frame / 37 + x);

  return (
    <g style={{mixBlendMode: 'screen'}} opacity={flicker}>
      <defs>
        <linearGradient id={`sh-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255, 232, 176, 0.42)" />
          <stop offset="60%" stopColor="rgba(255, 224, 160, 0.16)" />
          <stop offset="100%" stopColor="rgba(255, 220, 150, 0)" />
        </linearGradient>
      </defs>
      <path
        d={`M ${x - w / 2} ${from} L ${x + w / 2} ${from}
            L ${x + w * 1.1 - slide} ${FLOOR_Y + 40} L ${x - w * 1.1 - slide} ${FLOOR_Y + 40} Z`}
        fill={`url(#sh-${seed})`}
      />
      {/* dust drifting through the beam */}
      {Array.from({length: 16}).map((_, i) => {
        const p = (random(`d${seed}${i}`) + frame / (900 + i * 40)) % 1;
        const px = x - w * 0.5 + random(`dx${seed}${i}`) * w - slide * p;
        const py = from + p * drop;
        return (
          <circle
            key={i}
            cx={px + Math.sin(frame / 44 + i) * 9}
            cy={py}
            r={1.8 + random(`dr${seed}${i}`) * 2}
            fill="#fff0c8"
            opacity={0.25 + 0.35 * Math.abs(Math.sin(frame / 30 + i))}
          />
        );
      })}
    </g>
  );
};

/**
 * The throne room: three lancet windows upstage, light falling across a
 * stone floor, a dais and throne stage right. Everything is backlit, so
 * figures in front of it read as silhouettes with a warm rim.
 */
export const ThroneHall: React.FC<{frame: number}> = ({frame}) => (
  <g>
    {/* stone shell */}
    <rect x={0} y={0} width={1920} height={FLOOR_Y} fill="#10131a" />
    <rect x={0} y={FLOOR_Y} width={1920} height={1080 - FLOOR_Y} fill="#171a22" />

    {/* stone courses on the back wall */}
    {Array.from({length: 14}).map((_, i) => (
      <rect key={i} x={0} y={90 + i * 58} width={1920} height={2} fill="#0b0e14" opacity={0.7} />
    ))}

    {/* arcade columns */}
    {[210, 720, 1200, 1710].map((x) => (
      <g key={x}>
        <rect x={x - 40} y={70} width={80} height={FLOOR_Y - 70} fill="#0c0f16" />
        <rect x={x - 52} y={FLOOR_Y - 60} width={104} height={60} fill="#0a0d13" />
        <path d={`M ${x - 54} 96 L ${x + 54} 96 L ${x + 40} 62 L ${x - 40} 62 Z`} fill="#0a0d13" />
      </g>
    ))}

    <Window x={465} w={230} top={126} bottom={612} seed="w1" />
    <Window x={960} w={260} top={92} bottom={628} seed="w2" />
    <Window x={1455} w={230} top={126} bottom={612} seed="w3" />

    {/* banners between the windows */}
    {[720, 1200].map((x, i) => (
      <g key={x}>
        <path
          d={`M ${x - 46} 150 L ${x + 46} 150 L ${x + 46} 470 L ${x} 430 L ${x - 46} 470 Z`}
          fill={i === 0 ? palette.crimsonDark : '#1d3a2c'}
        />
        <circle cx={x} cy={280} r={30} fill="none" stroke={palette.goldDeep} strokeWidth={4} />
        <path d={`M ${x} 258 L ${x + 11} 280 L ${x} 302 L ${x - 11} 280 Z`} fill={palette.goldDeep} />
      </g>
    ))}

    {/* dais and throne, stage right */}
    <g>
      <rect x={1060} y={DAIS_Y} width={860} height={FLOOR_Y - DAIS_Y} fill="#0d1016" />
      <rect x={1100} y={DAIS_Y + 34} width={820} height={10} fill="#141821" />
      <path
        d="M 1500 792 L 1500 470 Q 1500 424 1546 424 L 1626 424 Q 1672 424 1672 470 L 1672 792 Z"
        fill="#0a0d13"
      />
      <path d="M 1546 430 L 1586 386 L 1626 430 Z" fill={palette.goldDeep} opacity={0.85} />
      <rect x={1494} y={560} width={184} height={9} fill={palette.goldDeep} opacity={0.5} />
    </g>

    <Shaft x={465} w={230} from={612} frame={frame} seed="s1" />
    <Shaft x={960} w={260} from={628} frame={frame} seed="s2" />
    <Shaft x={1455} w={230} from={612} frame={frame} seed="s3" />

    {/* pools of light where the shafts land */}
    {[
      [322, 230],
      [820, 260],
      [1312, 230],
    ].map(([x, w]) => (
      <ellipse
        key={x}
        cx={x}
        cy={FLOOR_Y + 26}
        rx={w * 0.95}
        ry={34}
        fill="rgba(255, 226, 160, 0.16)"
      />
    ))}
  </g>
);

/**
 * The old king: broader and heavier than Larry, in a robe and crown.
 * Drawn facing right like every other character; the scene mirrors him.
 */
export const King: React.FC<{frame: number; fill?: string}> = ({frame, fill = '#161d20'}) => {
  const breathe = Math.sin(frame / 44) * 2;

  return (
    <g>
      {/* robe */}
      <path d="M -96 0 L -56 -212 L 56 -212 L 96 0 Z" fill={fill} />
      <path d="M -96 0 L 96 0 L 92 -18 L -92 -18 Z" fill={palette.goldDeep} opacity={0.55} />
      <path d="M -20 -212 L 20 -212 L 14 -30 L -14 -30 Z" fill={palette.goldDeep} opacity={0.28} />

      <g transform={`translate(0 ${breathe})`}>
        {/* neck, shoulders and mantle */}
        <path d="M -20 -212 L 24 -212 L 20 -300 L -12 -300 Z" fill={fill} />
        <path d="M -62 -206 C -50 -252, 50 -252, 62 -206 Z" fill={fill} />
        <path
          d="M -74 -216 C -58 -262, 58 -262, 74 -216 L 62 -196 C 46 -232, -46 -232, -62 -196 Z"
          fill={palette.crimsonDark}
        />

        {/* head */}
        <g transform="translate(18 -300) scale(1.22) translate(-10 -6)">
          <FrogHead helmet={false} />
        </g>

        {/* crown */}
        <g transform="translate(8 -346)">
          <path
            d="M -46 14 L -46 -6 L -32 12 L -18 -18 L -4 12 L 10 -18 L 24 12 L 38 -6 L 38 14 Z"
            fill={palette.gold}
          />
          <rect x={-48} y={12} width={88} height={12} rx={4} fill={palette.goldDeep} />
          <circle cx={-18} cy={-16} r={4.5} fill={palette.crimson} />
          <circle cx={10} cy={-16} r={4.5} fill="#2f5fa8" />
        </g>
      </g>
    </g>
  );
};
