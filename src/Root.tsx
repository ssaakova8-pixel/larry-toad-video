import React from 'react';
import {Composition} from 'remotion';
import {Teaser} from './Teaser';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="FrogKnightTeaser"
      component={Teaser}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
