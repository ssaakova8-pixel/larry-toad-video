import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Environment} from '../components/Environment';
import {Rider} from '../components/Rider';
import {Dust, Flash, SpeedLines, Vignette} from '../components/Effects';

/** The rear-up against the moon, then the charge straight at camera. */
export const Charge: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const rear = spring({frame: frame - 6, fps, config: {damping: 11, mass: 0.9, stiffness: 90}});
  const settle = interpolate(frame, [40, 58], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });
  const rearAmt = rear * settle;

  const scroll = interpolate(frame, [0, duration], [0, 2600], {
    easing: Easing.in(Easing.quad),
  });
  const stride = frame * 0.1;

  // Camera: low and close, snapping upward as the horse comes down.
  const zoom = interpolate(frame, [0, 40, duration], [1.15, 1.22, 1.55], {
    easing: Easing.in(Easing.cubic),
  });
  const shakeX = Math.sin(frame / 2.4) * 9;
  const shakeY = Math.sin(frame / 1.7) * 11 + rearAmt * -20;

  const bolt = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const impact = interpolate(frame, [52, 66], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{background: '#03070a'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${zoom})`,
          transformOrigin: '52% 74%',
        }}
      >
        <Environment scroll={scroll} frame={frame} mist={0.7} moonY={150} />
        <Dust frame={frame} x={980} y={180} count={46} intensity={1.5} />
        <Rider
          x={660}
          groundY={168}
          size={900}
          stride={stride}
          gait={1 - rearAmt * 0.7}
          rear={rearAmt}
          swordRaise={interpolate(frame, [0, 26], [0.55, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.back(1.6)),
          })}
          bodyFill="#152530"
          silhouette={0.55}
        />
      </AbsoluteFill>

      <SpeedLines frame={frame} intensity={interpolate(frame, [20, 60], [0, 1], {extrapolateRight: 'clamp'})} />
      <Flash progress={bolt} max={0.75} />
      <Flash progress={impact} color="#ffffff" max={1} />
      <Vignette strength={1} />
    </AbsoluteFill>
  );
};
