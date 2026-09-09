import React from 'react';
import {palette} from '../theme';
import {FrogHead} from './FrogKnight';

const TAU = Math.PI * 2;

/** Rotation is measured from "hanging straight down"; positive swings back. */
type Joint = [thigh: number, shin: number, foot: number];
type Arm = [shoulder: number, elbow: number];

export type Pose = {
  /** Vertical offset of the hips: negative lifts the character off the ground. */
  hipY: number;
  /** Rotation of the whole body about the hips. */
  tilt: number;
  /** Extra rotation of the torso on top of `tilt`. */
  lean: number;
  far: Joint;
  near: Joint;
  farArm: Arm;
  nearArm: Arm;
  /** Blade angle relative to the forearm; 0 continues straight out of the hand. */
  sword: number;
  head: number;
  /** Blade length, 0 hides the sword entirely. */
  blade: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
/** Smooth 0..1 ramp between two thresholds. */
const ramp = (t: number, a: number, b: number) => {
  const p = clamp01((t - a) / (b - a));
  return p * p * (3 - 2 * p);
};

function blend(a: Pose, b: Pose, t: number): Pose {
  const j = (x: Joint, y: Joint): Joint => [lerp(x[0], y[0], t), lerp(x[1], y[1], t), lerp(x[2], y[2], t)];
  const m = (x: Arm, y: Arm): Arm => [lerp(x[0], y[0], t), lerp(x[1], y[1], t)];
  return {
    hipY: lerp(a.hipY, b.hipY, t),
    tilt: lerp(a.tilt, b.tilt, t),
    lean: lerp(a.lean, b.lean, t),
    far: j(a.far, b.far),
    near: j(a.near, b.near),
    farArm: m(a.farArm, b.farArm),
    nearArm: m(a.nearArm, b.nearArm),
    sword: lerp(a.sword, b.sword, t),
    head: lerp(a.head, b.head, t),
    blade: lerp(a.blade, b.blade, t),
  };
}

export const STAND: Pose = {
  hipY: 0,
  tilt: 0,
  lean: 0,
  far: [10, -8, -4],
  near: [-12, 6, -2],
  farArm: [14, 22],
  nearArm: [-18, -46],
  sword: 0,
  head: 0,
  blade: 120,
};

export type PoseKind = 'swing' | 'leap' | 'run' | 'strike' | 'raise' | 'balance' | 'kneel';

/**
 * Every training beat is one of a handful of rigged actions, evaluated at
 * `t` (0..1 through the shot). Keeping them as pure functions of `t` means a
 * shot can be re-timed or re-cut without touching the animation.
 */
export function poseFor(kind: PoseKind, t: number): Pose {
  switch (kind) {
    case 'swing': {
      // Wind up over the shoulder, then cut down and through.
      const s = ramp(t, 0.34, 0.52);
      const follow = ramp(t, 0.52, 0.95);
      return {
        ...STAND,
        hipY: -3 * Math.sin(TAU * t),
        tilt: lerp(-7, 15, s) - follow * 4,
        lean: lerp(-6, 10, s),
        far: [lerp(16, 24, s), lerp(-14, -22, s), -4],
        near: [lerp(-24, -32, s), lerp(14, 18, s), -2],
        farArm: [lerp(48, -34, s), lerp(-30, -14, s)],
        nearArm: [lerp(132, -92, s), lerp(-52, 10, s)],
        sword: lerp(-16, 6, s),
        head: lerp(-6, 8, s),
      };
    }
    case 'leap': {
      // A frog's jump: deep crouch, explosive extension, tuck for the landing.
      const p = clamp01((t - 0.18) / 0.74);
      const air = 4 * p * (1 - p);
      const push = ramp(t, 0.18, 0.34);
      const land = ramp(t, 0.74, 1);
      const crouch = 1 - ramp(t, 0.0, 0.2);
      return {
        ...STAND,
        hipY: 34 * crouch - 210 * air,
        tilt: lerp(18, -4, push) + land * 14,
        lean: lerp(14, -6, push),
        far: [lerp(-54, 40, push) + land * -70, lerp(104, -12, push) + land * 60, lerp(24, -18, push)],
        near: [lerp(-62, 30, push) + land * -78, lerp(112, -6, push) + land * 72, lerp(28, -14, push)],
        farArm: [lerp(30, 128, push), lerp(-40, -18, push)],
        nearArm: [lerp(-30, -142, push), lerp(-60, -14, push)],
        sword: lerp(-20, 6, push),
        head: lerp(10, -10, push),
      };
    }
    case 'run': {
      const p = t * 3.4;
      const cyc = (o: number) => TAU * p + o;
      const swing = (o: number) => -36 * Math.sin(cyc(o));
      const fold = (o: number) => 46 * Math.max(0, Math.sin(cyc(o) + 1.15));
      return {
        ...STAND,
        hipY: -7 * Math.abs(Math.sin(TAU * p)),
        tilt: 14,
        lean: 4,
        far: [swing(Math.PI), fold(Math.PI), -10],
        near: [swing(0), fold(0), -10],
        farArm: [40 * Math.sin(cyc(0)) - 10, -58],
        nearArm: [40 * Math.sin(cyc(Math.PI)) - 58, -72],
        sword: -40,
        head: -4,
      };
    }
    case 'strike': {
      // Coil, then a lunging thrust with the blade level.
      const s = ramp(t, 0.38, 0.5);
      const settle = ramp(t, 0.62, 1);
      return {
        ...STAND,
        hipY: lerp(10, 2, s),
        tilt: lerp(-6, 20, s) - settle * 3,
        lean: lerp(-10, 12, s),
        far: [lerp(20, 46, s), lerp(-18, -10, s), -6],
        near: [lerp(-26, -58, s), lerp(30, 26, s), 4],
        farArm: [lerp(24, -30, s), lerp(-40, -70, s)],
        nearArm: [lerp(6, -118, s), lerp(-108, 4, s)],
        sword: lerp(-30, 0, s),
        head: lerp(-4, 6, s),
      };
    }
    case 'raise': {
      // Blade lifted and held: the hero beat.
      const r = ramp(t, 0.05, 0.55);
      const breathe = Math.sin(TAU * t * 0.8) * 2;
      return {
        ...STAND,
        hipY: breathe * 0.6,
        tilt: lerp(6, -3, r),
        lean: lerp(4, -5, r),
        far: [16, -12, -4],
        near: [-18, 10, -2],
        farArm: [lerp(26, 54, r), lerp(-34, -22, r)],
        nearArm: [lerp(-96, -166, r), lerp(-46, -6, r)],
        sword: lerp(-14, 2, r),
        head: lerp(2, -12, r) + breathe,
      };
    }
    case 'balance': {
      // One-legged stance, blade held level; a slow sway keeps it alive.
      const sway = Math.sin(TAU * t * 1.6);
      const settle = ramp(t, 0, 0.3);
      return {
        ...STAND,
        hipY: 4,
        tilt: sway * 3,
        lean: -sway * 2,
        far: [2, -2, -2],
        near: [lerp(-20, -74, settle), lerp(10, 122, settle), 16],
        farArm: [lerp(20, 92, settle), -16],
        nearArm: [lerp(-20, -88, settle), lerp(-40, -6, settle)],
        sword: 0,
        head: sway * 3,
      };
    }
    case 'kneel': {
      // Down on one knee with the blade planted, then back onto both feet.
      const rise = ramp(t, 0.58, 0.94);
      // Back knee and shin flat on the floor, front thigh horizontal: the
      // hips have to drop to exactly where the back knee meets the ground.
      const down: Pose = {
        ...STAND,
        hipY: 57,
        tilt: 0,
        lean: 15,
        far: [40, 50, 90],
        near: [-82, 82, 0],
        farArm: [-14, -22],
        nearArm: [-42, -26],
        sword: -17,
        head: 20,
        blade: 105,
      };
      const up: Pose = {...STAND, tilt: -2, head: -10, nearArm: [-12, -34]};
      return blend(down, up, rise);
    }
  }
}

type BoneProps = {
  angle: number;
  len: number;
  w0: number;
  w1: number;
  fill: string;
  children?: React.ReactNode;
};

/** One limb segment; children are placed at its far end and inherit its rotation. */
const Bone: React.FC<BoneProps> = ({angle, len, w0, w1, fill, children}) => (
  <g transform={`rotate(${angle})`}>
    <circle cx={0} cy={0} r={w0 / 2} fill={fill} />
    <path d={`M ${-w0 / 2} 0 L ${w0 / 2} 0 L ${w1 / 2} ${len} L ${-w1 / 2} ${len} Z`} fill={fill} />
    <g transform={`translate(0 ${len})`}>{children}</g>
  </g>
);

const Leg: React.FC<{joint: Joint; fill: string; scale?: number}> = ({joint, fill, scale = 1}) => (
  <Bone angle={joint[0]} len={46 * scale} w0={19 * scale} w1={14 * scale} fill={fill}>
    <Bone angle={joint[1]} len={42 * scale} w0={14 * scale} w1={10 * scale} fill={fill}>
      <g transform={`rotate(${joint[2]}) scale(${scale})`}>
        {/* the long webbed foot is what reads as "frog" in silhouette */}
        <path d="M -13 -2 L 33 -1 Q 41 4 33 10 L -15 10 Q -20 4 -13 -2 Z" fill={fill} />
        <path d="M 33 -1 L 44 4 L 33 10 Z" fill={fill} />
      </g>
    </Bone>
  </Bone>
);

const Sword: React.FC<{angle: number; length: number; fill?: string; steel?: string}> = ({
  angle,
  length,
  fill = palette.gold,
  steel = palette.steel,
}) => {
  if (length <= 1) return null;
  return (
    <g transform={`rotate(${angle})`}>
      <rect x={-3.5} y={-16} width={7} height={18} rx={3} fill={fill} />
      <circle cx={0} cy={-18} r={4.5} fill={fill} />
      <rect x={-15} y={2} width={30} height={6.5} rx={3} fill={fill} />
      <path
        d={`M -6 8 L 6 8 L 4.5 ${length - 14} L 0 ${length} L -4.5 ${length - 14} Z`}
        fill={steel}
      />
      <path d={`M -1.5 10 L 1 10 L 1 ${length - 18} L -0.5 ${length - 10} Z`} fill="#ffffff" opacity={0.6} />
    </g>
  );
};

export type FrogFighterProps = {
  pose: Pose;
  /** Body colour; the head keeps its own palette unless wrapped in <Flat/>. */
  fill?: string;
  helmet?: boolean;
  /** Uniform scale about the feet, so 0.5 is a half-grown froglet. */
  scale?: number;
  headScale?: number;
};

/**
 * Bipedal frog knight, facing right, drawn as a bare <g> with the origin on
 * the ground between the feet. Same joint-rotation approach as the horse in
 * the teaser, so both characters animate off the same kind of maths.
 */
export const FrogFighter: React.FC<FrogFighterProps> = ({
  pose,
  fill = palette.frogDark,
  helmet = false,
  scale = 1,
  headScale = 0.72,
}) => {
  const dark = fill;
  return (
    <g transform={`scale(${scale})`}>
      <g transform={`translate(0 -92) rotate(${pose.tilt}) translate(0 ${pose.hipY})`}>
        {/* far limbs first for depth */}
        <g opacity={0.62}>
          <Leg joint={pose.far} fill={dark} />
        </g>

        <g transform={`rotate(${pose.lean})`}>
          {/* far arm behind the torso */}
          <g transform="translate(-2 -48)" opacity={0.62}>
            <Bone angle={pose.farArm[0]} len={32} w0={14} w1={11} fill={dark}>
              <Bone angle={pose.farArm[1]} len={30} w0={11} w1={9} fill={dark}>
                <circle cx={0} cy={2} r={6} fill={dark} />
              </Bone>
            </Bone>
          </g>

          {/* torso */}
          <path
            d="M -17 4 C -24 -18, -22 -44, -13 -57 C -3 -66, 13 -63, 19 -52
               C 26 -36, 24 -10, 17 4 C 5 11, -8 11, -17 4 Z"
            fill={dark}
          />
          {/* belt */}
          <path d="M -18 -2 L 18 -2 L 18 6 L -18 6 Z" fill={palette.goldDeep} opacity={0.9} />

          {/* head */}
          <g transform={`translate(6 -62) rotate(${pose.head}) scale(${headScale}) translate(-10 -6)`}>
            <FrogHead helmet={helmet} plumeWave={pose.head * 0.06} />
          </g>

          {/* near arm and blade */}
          <g transform="translate(4 -50)">
            <Bone angle={pose.nearArm[0]} len={32} w0={15} w1={12} fill={dark}>
              <Bone angle={pose.nearArm[1]} len={30} w0={12} w1={10} fill={dark}>
                <circle cx={0} cy={2} r={6.5} fill={dark} />
                <g transform="translate(0 4)">
                  <Sword angle={pose.sword} length={pose.blade} />
                </g>
              </Bone>
            </Bone>
          </g>
        </g>

        {/* near leg on top */}
        <Leg joint={pose.near} fill={dark} />
      </g>
    </g>
  );
};
