import React from 'react';
import {Composition} from 'remotion';
import {Teaser} from './Teaser';
import {Act1} from './Act1';
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
    <Composition
      id="Act1Birth"
      component={Act1}
      durationInFrames={45 * FPS}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
