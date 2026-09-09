import React from 'react';
import {interpolate, Easing} from 'remotion';
import {palette, serif, sans} from '../theme';

/** A quiet, wide-tracked caption line that fades up and out. */
export const CaptionLine: React.FC<{
  local: number;
  duration: number;
  text: string;
  bottom?: number;
  size?: number;
  /** Flip to dark type for shots with a bright sky. */
  tone?: 'light' | 'dark';
}> = ({local, duration, text, bottom = 210, size = 44, tone = 'light'}) => {
  const inO = interpolate(local, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const outO = interpolate(local, [duration - 20, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const track = interpolate(local, [0, 60], [16, 7], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        textAlign: 'center',
        opacity: inO * outO,
        fontFamily: serif,
        fontSize: size,
        letterSpacing: track,
        color: tone === 'dark' ? '#1a2620' : '#e6f0e2',
        textShadow:
          tone === 'dark'
            ? '0 1px 18px rgba(255,255,255,0.75)'
            : '0 4px 30px rgba(0,0,0,0.9)',
      }}
    >
      {text}
    </div>
  );
};

/** The logo lockup: gold-swept wordmark, rule, subtitle. */
export const MainTitle: React.FC<{
  local: number;
  title?: string;
  subtitle?: string;
  tag?: string;
  size?: number;
}> = ({
  local,
  title = 'Рыцарь-Лягушка',
  subtitle = 'Легенда болотного королевства',
  tag = 'Скоро',
  size = 132,
}) => {
  const reveal = interpolate(local, [4, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const track = interpolate(local, [4, 70], [40, 14], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const sweep = interpolate(local, [10, 64], [-60, 160], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ruleW = interpolate(local, [26, 58], [0, 620], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const subO = interpolate(local, [40, 62], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tagO = interpolate(local, [58, 78], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
      }}
    >
      {/* Compositing properties live on the wrapper: with opacity, transform
          and filter on the same element, Chromium stops honouring
          background-clip:text and paints the gradient box instead. */}
      <div
        style={{
          opacity: reveal,
          transform: `scale(${interpolate(reveal, [0, 1], [1.08, 1])})`,
          filter: 'drop-shadow(0 6px 40px rgba(0,0,0,0.85))',
        }}
      >
        <div
          style={{
            fontFamily: serif,
            fontSize: size,
            fontWeight: 700,
            letterSpacing: track,
            textTransform: 'uppercase',
            background: `linear-gradient(100deg, ${palette.goldDeep} ${sweep - 34}%, #fff3c9 ${sweep}%, ${palette.gold} ${
              sweep + 22
            }%, ${palette.goldDeep} ${sweep + 60}%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          width: ruleW,
          height: 2,
          background: `linear-gradient(90deg, rgba(232,193,92,0), ${palette.gold}, rgba(232,193,92,0))`,
        }}
      />

      <div
        style={{
          fontFamily: sans,
          fontSize: 30,
          letterSpacing: 14,
          textTransform: 'uppercase',
          color: '#cfe0d2',
          opacity: subO,
        }}
      >
        {subtitle}
      </div>

      <div
        style={{
          marginTop: 34,
          fontFamily: sans,
          fontSize: 22,
          letterSpacing: 20,
          textTransform: 'uppercase',
          color: 'rgba(214,232,220,0.75)',
          opacity: tagO,
        }}
      >
        {tag}
      </div>
    </div>
  );
};
