import React from 'react';
import {MountedKnight, MountedKnightProps} from './MountedKnight';

/**
 * Places a MountedKnight so its hooves land exactly on `groundY` (pixels from
 * the bottom of the canvas). The art board reserves 4% of its height below the
 * ground line for the sword/plume headroom above.
 */
export const Rider: React.FC<
  MountedKnightProps & {
    /** Left edge of the art board, in canvas pixels. */
    x: number;
    groundY: number;
    /** Height (and width) of the square art board. */
    size: number;
    flip?: boolean;
    opacity?: number;
    blur?: number;
  }
> = ({x, groundY, size, flip = false, opacity = 1, blur = 0, ...mount}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      bottom: groundY - size * 0.04,
      width: size,
      height: size,
      opacity,
      filter: blur ? `blur(${blur}px)` : undefined,
      transform: flip ? 'scaleX(-1)' : undefined,
    }}
  >
    <MountedKnight {...mount} />
  </div>
);
