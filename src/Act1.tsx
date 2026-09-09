import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Birth} from './scenes/act1/Birth';
import {Training} from './scenes/act1/Training';
import {Knighting} from './scenes/act1/Knighting';
import {Grain, Letterbox} from './components/Effects';

/** 45 seconds at 30fps, three parts of fifteen. */
export const ACT1_PARTS = [
  {Component: Birth, from: 0, duration: 452},
  {Component: Training, from: 450, duration: 452},
  {Component: Knighting, from: 900, duration: 450},
] as const;

const Dissolve: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, frames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

export const Act1: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {/* Score from scripts/make-act1-audio.mjs, cut to these same frames. */}
    <Audio src={staticFile('act1.mp3')} />
    {ACT1_PARTS.map(({Component, from, duration}, i) => (
      <Sequence key={i} from={from} durationInFrames={duration}>
        <Dissolve frames={i === 0 ? 1 : 10}>
          <Component duration={duration} />
        </Dissolve>
      </Sequence>
    ))}
    <Grain opacity={0.1} />
    <Letterbox height={86} />
  </AbsoluteFill>
);
