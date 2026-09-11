import { useId, type ReactNode } from "react";
import type { ProductArtVariant, ProductTint } from "@/content";

const ink = "var(--fg)";
const accent = "var(--accent)";
const accent2 = "var(--accent-2)";
const panel = "var(--bg-elev)";
const line = "var(--border)";

type RobotVariant = "mini" | "buddy" | "pro" | "home" | "care";

type Props = {
  variant: ProductArtVariant;
  title: string;
  className?: string;
  tint?: ProductTint;
  shell?: string;
  plain?: boolean;
};

type Shape = {
  head: { w: number; h: number; rx: number };
  body: { w: number; h: number; rx: number };
  eyes: "round" | "happy" | "wide" | "screen" | "soft";
  ears: boolean;
  antenna: boolean;
  wheels: boolean;
};

const shapes: Record<RobotVariant, Shape> = {
  mini: { head: { w: 120, h: 96, rx: 40 }, body: { w: 96, h: 64, rx: 30 }, eyes: "happy", ears: true, antenna: true, wheels: false },
  buddy: { head: { w: 140, h: 104, rx: 30 }, body: { w: 108, h: 78, rx: 22 }, eyes: "round", ears: true, antenna: true, wheels: false },
  pro: { head: { w: 160, h: 112, rx: 22 }, body: { w: 120, h: 84, rx: 18 }, eyes: "screen", ears: false, antenna: true, wheels: true },
  home: { head: { w: 170, h: 116, rx: 20 }, body: { w: 130, h: 90, rx: 20 }, eyes: "wide", ears: false, antenna: false, wheels: false },
  care: { head: { w: 132, h: 100, rx: 44 }, body: { w: 104, h: 70, rx: 34 }, eyes: "soft", ears: true, antenna: false, wheels: false },
};

function Eyes({ kind, cx, cy, id }: { kind: Shape["eyes"]; cx: number; cy: number; id: string }) {
  switch (kind) {
    case "happy":
      return (
        <g stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none">
          <path d={`M${cx - 30} ${cy + 2}q10 -14 20 0`} />
          <path d={`M${cx + 10} ${cy + 2}q10 -14 20 0`} />
          <path d={`M${cx - 14} ${cy + 22}q14 10 28 0`} strokeWidth="3" />
        </g>
      );
    case "wide":
      return (
        <g>
          <rect x={cx - 44} y={cy - 16} width="88" height="34" rx="8" fill={`url(#${id}-red)`} opacity="0.95" />
          <rect x={cx - 34} y={cy - 8} width="18" height="14" rx="4" fill="#fff" opacity="0.9" />
          <rect x={cx + 16} y={cy - 8} width="18" height="14" rx="4" fill="#fff" opacity="0.9" />
        </g>
      );
    case "screen":
      return (
        <g>
          <rect x={cx - 52} y={cy - 24} width="104" height="52" rx="8" fill={ink} opacity="0.08" />
          <ellipse cx={cx - 20} cy={cy - 2} rx="8" ry="11" fill={accent} />
          <ellipse cx={cx + 20} cy={cy - 2} rx="8" ry="11" fill={accent} />
          <circle cx={cx - 17} cy={cy - 6} r="2.5" fill="#fff" />
          <circle cx={cx + 23} cy={cy - 6} r="2.5" fill="#fff" />
          <path d={`M${cx - 12} ${cy + 16}q12 8 24 0`} stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case "soft":
      return (
        <g>
          <circle cx={cx - 22} cy={cy} r="11" fill={accent} />
          <circle cx={cx + 22} cy={cy} r="11" fill={accent} />
          <circle cx={cx - 19} cy={cy - 4} r="3.5" fill="#fff" />
          <circle cx={cx + 25} cy={cy - 4} r="3.5" fill="#fff" />
          <path d={`M${cx - 16} ${cy + 20}q16 12 32 0`} stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    default:
      return (
        <g>
          <ellipse cx={cx - 20} cy={cy} rx="9" ry="12" fill={accent} />
          <ellipse cx={cx + 20} cy={cy} rx="9" ry="12" fill={accent} />
          <circle cx={cx - 17} cy={cy - 4} r="3" fill="#fff" opacity="0.9" />
          <circle cx={cx + 23} cy={cy - 4} r="3" fill="#fff" opacity="0.9" />
          <path d={`M${cx - 16} ${cy + 20}q16 12 32 0`} stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
  }
}

function Accessories({ variant, id }: { variant: RobotVariant; id: string }) {
  switch (variant) {
    case "mini":
      return (
        <>
          <g fontSize="18" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono), ui-monospace, monospace">
            <rect x="52" y="200" width="40" height="40" rx="10" fill={panel} stroke={line} strokeWidth="1.5" />
            <text x="72" y="227" fill={accent}>A</text>
            <rect x="84" y="236" width="40" height="40" rx="10" fill={panel} stroke={line} strokeWidth="1.5" />
            <text x="104" y="263" fill={ink}>B</text>
            <rect x="380" y="216" width="40" height="40" rx="10" fill={panel} stroke={line} strokeWidth="1.5" />
            <text x="400" y="243" fill={ink}>C</text>
          </g>
          <g stroke={accent} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8">
            <path d="M372 110q-6 -20 12 -24q8 -16 24 -6" />
            <path d="M356 150q-8 8 -6 20" />
          </g>
          <g fill={accent} opacity="0.7">
            <circle cx="400" cy="128" r="4" />
            <circle cx="416" cy="150" r="3" />
            <circle cx="386" cy="160" r="2.5" />
          </g>
        </>
      );
    case "buddy":
      return (
        <>
          <path
            d="M320 70h130a12 12 0 0 1 12 12v50a12 12 0 0 1-12 12H340l-18 16v-16h-2a12 12 0 0 1-12-12V82a12 12 0 0 1 12-12z"
            fill={panel}
            stroke={ink}
            strokeOpacity="0.25"
            strokeWidth="2"
          />
          <text x="334" y="96" fontSize="12" fontWeight="600" fill={ink} fontFamily="var(--font-mono), ui-monospace, monospace">
            How was school
          </text>
          <text x="334" y="116" fontSize="12" fontWeight="600" fill={accent} fontFamily="var(--font-mono), ui-monospace, monospace">
            today?
          </text>
          <g stroke={accent} strokeWidth="4" strokeLinecap="round" opacity="0.9">
            <line x1="70" y1="164" x2="70" y2="180" />
            <line x1="84" y1="154" x2="84" y2="190" />
            <line x1="98" y1="142" x2="98" y2="202" />
            <line x1="112" y1="152" x2="112" y2="192" />
            <line x1="126" y1="162" x2="126" y2="182" />
          </g>
          <g transform="translate(360 236)">
            <path d="M0 10q30-14 50 0v50q-20-14-50 0z" fill={panel} stroke={ink} strokeOpacity="0.3" strokeWidth="2" />
            <path d="M50 10q20-14 50 0v50q-30-14-50 0z" fill={panel} stroke={ink} strokeOpacity="0.3" strokeWidth="2" />
            <g stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.7">
              <line x1="10" y1="26" x2="40" y2="20" />
              <line x1="10" y1="38" x2="40" y2="32" />
              <line x1="60" y1="20" x2="90" y2="26" />
            </g>
          </g>
        </>
      );
    case "pro":
      return (
        <>
          <g transform="translate(330 60)">
            <rect width="120" height="86" rx="10" fill={panel} stroke={ink} strokeOpacity="0.25" strokeWidth="2" />
            <rect x="12" y="12" width="96" height="10" rx="5" fill={ink} opacity="0.15" />
            <rect x="12" y="30" width="70" height="10" rx="5" fill={ink} opacity="0.15" />
            <rect x="12" y="52" width="60" height="22" rx="6" fill={`url(#${id}-red)`} />
            <text x="42" y="67" fontSize="11" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="var(--font-mono), ui-monospace, monospace">
              8.5 / 9
            </text>
          </g>
          <g transform="translate(40 200)">
            <rect width="96" height="70" rx="8" fill={panel} stroke={ink} strokeOpacity="0.25" strokeWidth="2" />
            <g stroke={ink} strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round">
              <line x1="14" y1="20" x2="82" y2="20" />
              <line x1="14" y1="34" x2="70" y2="34" />
              <line x1="14" y1="48" x2="76" y2="48" />
            </g>
            <path d="M60 44l8 8 16 -18" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
          <circle cx="240" cy="60" r="10" fill="none" stroke={accent} strokeWidth="2" opacity="0.7" />
          <circle cx="240" cy="60" r="4" fill={accent} />
        </>
      );
    case "home":
      return (
        <>
          <g transform="translate(40 80)">
            <path d="M0 50l50 -44 50 44v60H0z" fill={panel} stroke={ink} strokeOpacity="0.3" strokeWidth="2" />
            <rect x="38" y="70" width="24" height="40" rx="3" fill={accent} opacity="0.85" />
            <rect x="14" y="60" width="16" height="16" rx="2" fill={ink} opacity="0.2" />
            <rect x="70" y="60" width="16" height="16" rx="2" fill={ink} opacity="0.2" />
          </g>
          <g transform="translate(350 70)">
            <circle cx="40" cy="40" r="38" fill={panel} stroke={ink} strokeOpacity="0.3" strokeWidth="2" />
            <line x1="40" y1="40" x2="40" y2="16" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            <line x1="40" y1="40" x2="58" y2="50" stroke={accent} strokeWidth="3" strokeLinecap="round" />
            <circle cx="40" cy="40" r="3" fill={accent} />
          </g>
          <g transform="translate(360 200)" stroke={accent} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85">
            <path d="M20 40q0 -24 24 -24t24 24" />
            <path d="M8 40q0 -36 36 -36t36 36" opacity="0.5" />
            <circle cx="44" cy="52" r="5" fill={accent} stroke="none" />
          </g>
          <g transform="translate(60 230)">
            <rect width="34" height="60" rx="8" fill={panel} stroke={ink} strokeOpacity="0.3" strokeWidth="2" />
            <circle cx="17" cy="22" r="8" fill={accent} opacity="0.85" />
            <rect x="9" y="38" width="16" height="4" rx="2" fill={ink} opacity="0.25" />
          </g>
        </>
      );
    case "care":
      return (
        <>
          <path
            d="M400 92c-10 -18 -38 -12 -38 10c0 20 38 40 38 40s38 -20 38 -40c0 -22 -28 -28 -38 -10z"
            fill={`url(#${id}-red)`}
            opacity="0.9"
          />
          <g transform="translate(46 200)">
            <rect width="80" height="56" rx="12" fill={panel} stroke={ink} strokeOpacity="0.3" strokeWidth="2" />
            <rect x="10" y="10" width="28" height="36" rx="8" fill={accent} opacity="0.85" />
            <rect x="42" y="10" width="28" height="36" rx="8" fill={ink} opacity="0.25" />
            <line x1="24" y1="28" x2="56" y2="28" stroke={panel} strokeWidth="3" />
          </g>
          <g transform="translate(350 210)">
            <rect width="100" height="70" rx="10" fill={panel} stroke={ink} strokeOpacity="0.3" strokeWidth="2" />
            <g stroke={ink} strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round">
              <line x1="14" y1="18" x2="86" y2="18" />
              <line x1="14" y1="34" x2="66" y2="34" />
              <line x1="14" y1="50" x2="76" y2="50" />
            </g>
            <text x="50" y="66" fontSize="10" fontWeight="600" fill={accent} textAnchor="middle" fontFamily="var(--font-mono), ui-monospace, monospace">
              08:00 · 20:00
            </text>
          </g>
          <g stroke={accent} strokeWidth="4" strokeLinecap="round" opacity="0.8">
            <line x1="90" y1="120" x2="90" y2="140" />
            <line x1="104" y1="108" x2="104" y2="152" />
            <line x1="118" y1="118" x2="118" y2="142" />
          </g>
        </>
      );
  }
}

function Robot({ variant, id, shell, cx = 240, scale = 1, withAccessories = true }: { variant: RobotVariant; id: string; shell?: string; cx?: number; scale?: number; withAccessories?: boolean }) {
  const s = shapes[variant];
  const headTop = 96;
  const headX = cx - s.head.w / 2;
  const bodyTop = headTop + s.head.h + 12;
  const bodyX = cx - s.body.w / 2;
  const eyeY = headTop + s.head.h / 2 - 4;
  const fill = shell ?? panel;
  const transform = scale === 1 ? undefined : `translate(${cx * (1 - scale)} ${300 * (1 - scale)}) scale(${scale})`;

  return (
    <g transform={transform}>
      <ellipse cx={cx} cy="296" rx="140" ry="10" fill={ink} opacity="0.06" />
      {withAccessories && <Accessories variant={variant} id={id} />}

      {s.antenna && (
        <>
          <line x1={cx} y1={headTop - 22} x2={cx} y2={headTop} stroke={ink} strokeWidth="3" opacity="0.5" />
          <circle cx={cx} cy={headTop - 28} r="7" fill={`url(#${id}-red)`} />
        </>
      )}

      <rect x={headX} y={headTop} width={s.head.w} height={s.head.h} rx={s.head.rx} fill={fill} stroke={ink} strokeOpacity="0.25" strokeWidth="2" />
      <rect x={headX + 16} y={headTop + 16} width={s.head.w - 32} height={s.head.h - 36} rx={Math.max(10, s.head.rx - 12)} fill={ink} opacity="0.92" />
      <Eyes kind={s.eyes} cx={cx} cy={eyeY} id={id} />

      {s.ears && (
        <>
          <rect x={headX - 12} y={headTop + 34} width="12" height="32" rx="6" fill={ink} opacity="0.35" />
          <rect x={headX + s.head.w} y={headTop + 34} width="12" height="32" rx="6" fill={ink} opacity="0.35" />
        </>
      )}

      <rect x={cx - 12} y={headTop + s.head.h} width="24" height="12" fill={ink} opacity="0.35" />
      <rect x={bodyX} y={bodyTop} width={s.body.w} height={s.body.h} rx={s.body.rx} fill={fill} stroke={ink} strokeOpacity="0.25" strokeWidth="2" />
      <rect x={cx - 24} y={bodyTop + 18} width="48" height="10" rx="5" fill={accent} opacity="0.85" />
      <circle cx={cx} cy={bodyTop + 46} r="8" fill="none" stroke={ink} strokeOpacity="0.35" strokeWidth="2" />

      <path d={`M${bodyX} ${bodyTop + 22}q-26 6 -28 40`} stroke={ink} strokeOpacity="0.4" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d={`M${bodyX + s.body.w} ${bodyTop + 22}q26 6 28 40`} stroke={ink} strokeOpacity="0.4" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx={bodyX - 28} cy={bodyTop + 64} r="8" fill={ink} opacity="0.45" />
      <circle cx={bodyX + s.body.w + 28} cy={bodyTop + 64} r="8" fill={ink} opacity="0.45" />

      {s.wheels ? (
        <g fill={ink} opacity="0.5">
          <circle cx={cx - 34} cy={bodyTop + s.body.h + 6} r="10" />
          <circle cx={cx + 34} cy={bodyTop + s.body.h + 6} r="10" />
        </g>
      ) : (
        <g fill={ink} opacity="0.35">
          <rect x={cx - 34} y={bodyTop + s.body.h} width="24" height="10" rx="5" />
          <rect x={cx + 10} y={bodyTop + s.body.h} width="24" height="10" rx="5" />
        </g>
      )}
    </g>
  );
}

function Dock({ cx = 240, y = 250 }: { cx?: number; y?: number }) {
  return (
    <g>
      <rect x={cx - 90} y={y} width="180" height="34" rx="14" fill={panel} stroke={ink} strokeWidth="2" strokeOpacity="0.5" />
      <rect x={cx - 70} y={y + 8} width="140" height="8" rx="4" fill={ink} opacity="0.15" />
      <circle cx={cx + 72} cy={y + 17} r="4" fill={accent} />
      <path d={`M${cx + 90} ${y + 17}h40q16 0 16 16v20`} stroke={ink} strokeOpacity="0.4" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Cards({ cx = 240, cy = 190 }: { cx?: number; cy?: number }) {
  const card = (dx: number, rot: number, fill: string, word: string) => (
    <g transform={`translate(${cx + dx} ${cy}) rotate(${rot})`} key={word}>
      <rect x="-56" y="-76" width="112" height="152" rx="12" fill={fill} stroke={ink} strokeWidth="2.5" />
      <rect x="-40" y="-60" width="80" height="70" rx="8" fill="#fff" stroke={ink} strokeOpacity="0.25" strokeWidth="2" />
      <text x="0" y="40" textAnchor="middle" fontSize="18" fontWeight="800" fill={ink}>
        {word}
      </text>
      <text x="0" y="60" textAnchor="middle" fontSize="11" fill={ink} opacity="0.6">
        /{word.toLowerCase()}/
      </text>
    </g>
  );
  return (
    <g>
      {card(-70, -12, "var(--tint-blue)", "CAT")}
      {card(70, 10, "var(--tint-green)", "SUN")}
      {card(0, 0, "var(--tint-yellow)", "APPLE")}
    </g>
  );
}

function Case({ id }: { id: string }) {
  return (
    <g>
      <ellipse cx="240" cy="296" rx="120" ry="10" fill={ink} opacity="0.06" />
      <rect x="150" y="80" width="180" height="190" rx="56" fill="#ff8fa3" stroke={ink} strokeWidth="3" />
      <rect x="170" y="100" width="140" height="80" rx="32" fill={ink} opacity="0.08" />
      <circle cx="240" cy="230" r="14" fill="none" stroke={ink} strokeOpacity="0.4" strokeWidth="3" />
      <rect x="205" y="205" width="70" height="8" rx="4" fill={ink} opacity="0.25" />
      <circle cx="240" cy="60" r="8" fill={`url(#${id}-red)`} />
      <g fill={ink} opacity="0.12">
        <circle cx="150" cy="120" r="6" />
        <circle cx="330" cy="120" r="6" />
      </g>
    </g>
  );
}

function Bag() {
  return (
    <g>
      <ellipse cx="240" cy="296" rx="130" ry="10" fill={ink} opacity="0.06" />
      <path d="M200 120q40 -70 80 0" stroke={ink} strokeWidth="8" fill="none" strokeLinecap="round" />
      <rect x="130" y="110" width="220" height="170" rx="28" fill="#b39ddb" stroke={ink} strokeWidth="3" />
      <rect x="130" y="150" width="220" height="6" fill={ink} opacity="0.35" />
      <rect x="215" y="140" width="50" height="26" rx="8" fill={ink} />
      <rect x="160" y="190" width="160" height="60" rx="14" fill="#fff" opacity="0.5" stroke={ink} strokeOpacity="0.3" strokeWidth="2" />
      <path d="M180 220h120" stroke={ink} strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
      <circle cx="240" cy="220" r="10" fill={accent} />
    </g>
  );
}

function Premium({ id }: { id: string }) {
  return (
    <g>
      <ellipse cx="240" cy="296" rx="150" ry="10" fill={ink} opacity="0.06" />
      <rect x="120" y="90" width="240" height="160" rx="22" fill={panel} stroke={ink} strokeWidth="3" />
      <rect x="120" y="90" width="240" height="46" rx="22" fill={`url(#${id}-red)`} />
      <rect x="120" y="120" width="240" height="16" fill={`url(#${id}-red)`} />
      <text x="240" y="122" textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff" letterSpacing="2">
        PREMIUM
      </text>
      <g fill={ink} opacity="0.2">
        <rect x="144" y="156" width="192" height="10" rx="5" />
        <rect x="144" y="176" width="150" height="10" rx="5" />
        <rect x="144" y="196" width="170" height="10" rx="5" />
      </g>
      <path d="M300 210l14 14 26 -30" stroke={accent} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M96 70l8 20 20 8 -20 8 -8 20 -8 -20 -20 -8 20 -8z" fill="var(--tint-yellow)" stroke={ink} strokeWidth="2" />
      <path d="M390 200l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z" fill="var(--tint-yellow)" stroke={ink} strokeWidth="2" />
    </g>
  );
}

export function ProductArt({ variant, title, className = "", tint, shell, plain = false }: Props) {
  const id = `pa-${useId().replace(/\W/g, "")}`;

  let scene: ReactNode;
  switch (variant) {
    case "combo-siblings":
      scene = (
        <>
          <Robot variant="mini" id={id} shell="#ff8fa3" cx={160} scale={0.82} withAccessories={false} />
          <Robot variant="mini" id={id} shell="#7fd8c8" cx={320} scale={0.82} withAccessories={false} />
          <path d="M215 150q25 -30 50 0" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="6 8" />
        </>
      );
      break;
    case "combo-study":
      scene = (
        <>
          <Dock cx={250} y={262} />
          <Robot variant="buddy" id={id} shell={shell} cx={250} scale={0.86} withAccessories={false} />
          <g transform="translate(100 190) rotate(-8) scale(0.6)">
            <rect x="-56" y="-76" width="112" height="152" rx="12" fill="var(--tint-yellow)" stroke={ink} strokeWidth="3" />
            <rect x="-40" y="-60" width="80" height="70" rx="8" fill="#fff" stroke={ink} strokeOpacity="0.25" strokeWidth="2" />
            <text x="0" y="44" textAnchor="middle" fontSize="20" fontWeight="800" fill={ink}>
              BOOK
            </text>
          </g>
        </>
      );
      break;
    case "combo-family":
      scene = (
        <>
          <Robot variant="home" id={id} cx={160} scale={0.8} withAccessories={false} />
          <Robot variant="care" id={id} cx={330} scale={0.78} withAccessories={false} />
          <path d="M205 140q40 -40 80 0" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="6 8" />
        </>
      );
      break;
    case "dock":
      scene = (
        <>
          <Dock cx={240} y={236} />
          <g opacity="0.25">
            <Robot variant="buddy" id={id} cx={240} scale={0.7} withAccessories={false} />
          </g>
          <path d="M240 60v40" stroke={accent} strokeWidth="6" strokeLinecap="round" />
          <path d="M226 80l14 20 14 -20" stroke={accent} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
      break;
    case "case":
      scene = <Case id={id} />;
      break;
    case "cards":
      scene = <Cards />;
      break;
    case "bag":
      scene = <Bag />;
      break;
    case "premium":
      scene = <Premium id={id} />;
      break;
    default:
      scene = <Robot variant={variant} id={id} shell={shell} />;
  }

  return (
    <svg
      viewBox="0 0 480 320"
      role="img"
      aria-labelledby={id}
      preserveAspectRatio="xMidYMid meet"
      className={`block h-full w-full ${className}`}
    >
      <title id={id}>{title}</title>
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.26" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-red`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent2} />
        </linearGradient>
      </defs>
      {!plain && (
        <rect width="480" height="320" fill={tint ? `var(--tint-${tint})` : `url(#${id}-glow)`} />
      )}
      {scene}
    </svg>
  );
}
