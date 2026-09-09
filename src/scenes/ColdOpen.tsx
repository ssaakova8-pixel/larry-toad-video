import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Environment} from '../components/Environment';
import {Rider} from '../components/Rider';
import {CaptionLine} from '../components/Titles';
import {Vignette} from '../components/Effects';

/** A still swamp at moonrise. The camera creeps toward a waiting silhouette. */
export const ColdOpen: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, duration], [1.0, 1.12], {
    easing: Easing.inOut(Easing.quad),
  });
  const drift = interpolate(frame, [0, duration], [0, -50]);
  const wake = interpolate(frame, [0, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{background: '#04080b'}}>
      <AbsoluteFill
        style={{transform: `scale(${push}) translateX(${drift}px)`, transformOrigin: '58% 62%'}}
      >
        <Environment scroll={frame * 0.5} frame={frame} mist={1.15} moonY={190} />
        <Rider
          x={1090}
          groundY={198}
          size={430}
          stride={frame / 120}
          gait={0}
          silhouette={1}
          blink={frame > 58 && frame < 66 ? 1 : 0}
        />
      </AbsoluteFill>

      <CaptionLine
        local={frame}
        duration={duration}
        text="Когда болото засыпает —"
        bottom={188}
      />
      <Vignette strength={0.95} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - wake}} />
    </AbsoluteFill>
  );
};
