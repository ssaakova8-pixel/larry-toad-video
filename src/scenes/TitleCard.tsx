import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {MainTitle} from '../components/Titles';
import {Rider} from '../components/Rider';
import {Grain, Vignette} from '../components/Effects';

/** Logo lockup over drifting fog, with the rider walking off into it. */
export const TitleCard: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();

  const openFlash = interpolate(frame, [0, 14], [1, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const outFade = interpolate(frame, [duration - 22, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const riderX = interpolate(frame, [0, duration], [1180, 1420], {
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill style={{background: '#03070a'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 58%, #0d2028 0%, #060d11 60%, #03070a 100%)',
        }}
      />

      {/* slow fog banks */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: -300 + ((frame * (0.5 + i * 0.35) + i * 620) % 2600) - 300,
            bottom: 40 + i * 90,
            width: 1400,
            height: 320,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, rgba(130,175,160,${0.09 - i * 0.015}) 0%, rgba(130,175,160,0) 70%)`,
            filter: 'blur(20px)',
          }}
        />
      ))}

      {/* embers drifting up behind the type */}
      {Array.from({length: 24}).map((_, i) => {
        const speed = 0.6 + random(`em${i}`) * 1.4;
        const y = (random(`emy${i}`) * 1080 + frame * speed) % 1180;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: random(`emx${i}`) * 1920 + Math.sin(frame / 30 + i) * 20,
              bottom: y,
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: '#e8c15c',
              opacity: 0.35 * Math.abs(Math.sin(frame / 18 + i)),
              boxShadow: '0 0 10px 3px rgba(232,193,92,0.35)',
            }}
          />
        );
      })}

      <Rider
        x={riderX}
        groundY={120}
        size={330}
        stride={frame * 0.02}
        gait={0.25}
        silhouette={1}
        opacity={0.62}
        blur={1.5}
      />

      <MainTitle local={frame} />

      <Vignette strength={1} />
      <Grain opacity={0.14} />
      <AbsoluteFill style={{background: '#fff', opacity: openFlash * 0.85, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: '#000', opacity: outFade}} />
    </AbsoluteFill>
  );
};
