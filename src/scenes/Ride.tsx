import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Environment, Reeds} from '../components/Environment';
import {Rider} from '../components/Rider';
import {CaptionLine} from '../components/Titles';
import {Dust, Vignette} from '../components/Effects';

/** The gallop: full parallax, hooves throwing dirt, camera loosely tracking. */
export const Ride: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();

  // Ease from a standstill up to a hard gallop over the first second.
  const speed = interpolate(frame, [0, 30], [0.15, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const scroll = interpolate(frame, [0, duration], [0, 3400], {
    easing: Easing.out(Easing.quad),
  });
  const stride = frame * 0.082 * speed;

  // A handheld-ish tracking wobble that grows with the pace.
  const shakeX = Math.sin(frame / 3.1) * 5 * speed;
  const shakeY = Math.sin(frame / 2.2 + 1) * 7 * speed;
  const riderX = 560 + Math.sin(frame / 26) * 40;

  return (
    <AbsoluteFill style={{background: '#04080b'}}>
      <AbsoluteFill style={{transform: `translate(${shakeX}px, ${shakeY}px) scale(1.04)`}}>
        <Environment scroll={scroll} frame={frame} mist={0.85} moonY={170} />

        <Dust frame={frame} x={riderX + 200} y={186} intensity={speed} />
        <Rider
          x={riderX}
          groundY={176}
          size={760}
          stride={stride}
          gait={speed}
          bodyFill="#16262d"
          silhouette={0.35}
          blink={frame % 74 < 5 ? 1 : 0}
          swordRaise={interpolate(frame, [duration - 46, duration - 10], [0, 0.55], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          })}
        />

        <Reeds scroll={scroll} frame={frame} />
      </AbsoluteFill>

      <CaptionLine
        local={frame - 20}
        duration={duration - 20}
        text="— по берегу мчится легенда."
        bottom={180}
      />
      <Vignette strength={0.9} />
    </AbsoluteFill>
  );
};
