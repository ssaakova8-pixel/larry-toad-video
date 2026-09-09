import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {DAIS_Y, FLOOR_Y, King, ThroneHall} from '../../components/ThroneHall';
import {FrogFighter, poseFor} from '../../components/FrogFighter';
import {Flat} from '../../components/Flat';
import {MainTitle} from '../../components/Titles';
import {Flash, Grain, Vignette} from '../../components/Effects';
import {palette} from '../../theme';

const LARRY_X = 860;
const LARRY_SCALE = 2.0;
const KING_X = 1250;
// Shoulder joints, in canvas pixels — the ceremony is aimed at these.
const KING_PIVOT: [number, number] = [KING_X - 30, DAIS_Y - 215];
// Top of the torso rather than the shoulder joint — that is where a blade
// visibly rests.
const LARRY_SHOULDER: [number, number] = [LARRY_X + 33, FLOOR_Y - 192];
/** Pivot-to-hilt length of the ceremonial arm. */
const ARM = 118;
const REACH = Math.hypot(
  LARRY_SHOULDER[0] - KING_PIVOT[0],
  LARRY_SHOULDER[1] - KING_PIVOT[1]
);
const BLADE = REACH - ARM;

/** Blade angle that lays the sword on Larry's shoulder, measured from "down". */
function angleToShoulder(): number {
  const dx = LARRY_SHOULDER[0] - KING_PIVOT[0];
  const dy = LARRY_SHOULDER[1] - KING_PIVOT[1];
  const len = Math.hypot(dx, dy);
  return (Math.atan2(-dx / len, dy / len) * 180) / Math.PI;
}

const REST = 168;
const TOUCH = angleToShoulder();
const OVER = 148;

/** The ceremonial arm: one rigid pivot from the king's shoulder to the tip. */
const CeremonySword: React.FC<{angle: number; fill: string}> = ({angle, fill}) => (
  <g transform={`translate(${KING_PIVOT[0]} ${KING_PIVOT[1]}) rotate(${angle})`}>
    <path d="M -17 -6 L 17 -6 L 12 112 L -12 112 Z" fill={fill} />
    <circle cx={0} cy={112} r={13} fill={fill} />
    <g transform="translate(0 118)">
      <rect x={-5} y={-22} width={10} height={24} rx={4} fill={palette.goldDeep} />
      <circle cx={0} cy={-25} r={7} fill={palette.gold} />
      <rect x={-26} y={0} width={52} height={11} rx={5} fill={palette.gold} />
      <path
        d={`M -11 11 L 11 11 L 8 ${BLADE - 24} L 0 ${BLADE} L -8 ${BLADE - 24} Z`}
        fill={palette.steel}
      />
      <path d={`M -3 14 L 2 14 L 2 ${BLADE - 28} L -1 ${BLADE - 14} Z`} fill="#ffffff" opacity={0.75} />
    </g>
  </g>
);

/** Gold sparks thrown off where the blade meets the shoulder. */
const Sparks: React.FC<{age: number; x: number; y: number}> = ({age, x, y}) => {
  if (age < 0 || age > 34) return null;
  const t = age / 34;
  return (
    <g>
      {Array.from({length: 18}).map((_, i) => {
        const a = random(`sa${i}`) * Math.PI * 2;
        const d = (18 + random(`sd${i}`) * 78) * Math.pow(t, 0.55);
        return (
          <circle
            key={i}
            cx={x + Math.cos(a) * d}
            cy={y + Math.sin(a) * d * 0.75 + t * 22}
            r={Math.max(0.4, 3.2 * (1 - t))}
            fill="#ffe9a8"
            opacity={1 - t}
          />
        );
      })}
      <circle cx={x} cy={y} r={70 * t} fill="none" stroke="#ffe9a8" strokeWidth={3 * (1 - t)} opacity={(1 - t) * 0.8} />
    </g>
  );
};

/**
 * Act I, part three: the accolade. The king lays the blade on each shoulder
 * in turn, then Larry rises a knight.
 */
export const Knighting: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();

  // Ceremony timeline.
  const angle = interpolate(
    frame,
    [0, 120, 176, 216, 262, 306, 342, 380],
    [REST, REST, TOUCH, TOUCH, OVER, TOUCH + 4, TOUCH + 4, REST],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)}
  );
  // Second touch passes behind him, so the two beats read differently.
  const behind = frame >= 262 && frame < 348;

  const rise = interpolate(frame, [356, 430], [0.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const pose = {...poseFor('kneel', rise), blade: 0};

  const zoom = interpolate(frame, [0, duration], [1.02, 1.5], {
    easing: Easing.inOut(Easing.quad),
  });
  const fadeUp = interpolate(frame, [0, 26], [0, 1], {extrapolateRight: 'clamp'});

  // Warm swell as the accolade lands and again as he stands.
  const halo = interpolate(
    frame,
    [150, 190, 300, 340, 360, 420],
    [0, 0.5, 0.35, 0.55, 0.4, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const titleFrom = 392;
  const dim = interpolate(frame, [titleFrom, titleFrom + 40], [0, 0.72], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const figure = '#0c1116';
  const glow = {filter: 'drop-shadow(0 0 12px rgba(255, 208, 132, 0.55))'};

  return (
    <AbsoluteFill style={{background: '#05070b'}}>
      <AbsoluteFill
        style={{transform: `scale(${zoom})`, transformOrigin: '55% 74%'}}
      >
        <svg
          viewBox="0 0 1920 1080"
          width="100%"
          height="100%"
          style={{position: 'absolute', inset: 0}}
        >
          <ThroneHall frame={frame} />

          {/* golden swell behind the pair */}
          <ellipse
            cx={1040}
            cy={700}
            rx={760}
            ry={430}
            fill="rgba(255, 205, 130, 0.13)"
            opacity={halo}
            style={{mixBlendMode: 'screen'}}
          />

          {behind ? <CeremonySword angle={angle} fill={figure} /> : null}

          {/* Larry, kneeling */}
          <g transform={`translate(${LARRY_X} ${FLOOR_Y})`} style={glow}>
            <Flat id="larryFlat" color={figure}>
              <FrogFighter pose={pose} scale={LARRY_SCALE} helmet headScale={0.68} />
            </Flat>
          </g>

          {/* the king, mirrored to face him */}
          <g transform={`translate(${KING_X} ${DAIS_Y}) scale(-1 1)`} style={glow}>
            <Flat id="kingFlat" color={figure}>
              <King frame={frame} />
            </Flat>
          </g>

          {!behind ? <CeremonySword angle={angle} fill={figure} /> : null}

          <Sparks age={frame - 176} x={LARRY_SHOULDER[0]} y={LARRY_SHOULDER[1]} />
          <Sparks age={frame - 306} x={LARRY_SHOULDER[0] - 16} y={LARRY_SHOULDER[1] + 6} />
        </svg>
      </AbsoluteFill>

      <Vignette strength={1} />
      <Grain opacity={0.13} />
      <AbsoluteFill style={{background: '#05070b', opacity: dim}} />
      <MainTitle
        local={frame - titleFrom}
        title="Ларри Тоут"
        subtitle="Акт I · Рождение"
        tag="Продолжение следует"
        size={118}
      />
      <Flash progress={interpolate(frame, [346, 392], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} color="#fff0cc" max={0.55} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - fadeUp}} />
      <AbsoluteFill
        style={{
          background: '#000',
          opacity: interpolate(frame, [duration - 20, duration], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </AbsoluteFill>
  );
};
