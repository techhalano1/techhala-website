import { useId, type ReactElement, type ReactNode } from "react";
import type { PillarSlug } from "@/content";

type Props = { title: string; className?: string; crop?: boolean };

const ink = "var(--fg)";
const accent = "var(--accent)";
const accent2 = "var(--accent-2)";
const panel = "var(--bg-elev)";
const line = "var(--border)";

function Frame({ title, className, crop, children }: Props & { children: (id: string) => ReactNode }) {
  const id = `ill-${useId().replace(/\W/g, "")}`;
  return (
    <svg
      viewBox="0 0 480 320"
      role="img"
      aria-labelledby={id}
      preserveAspectRatio={crop ? "xMidYMid slice" : "xMidYMid meet"}
      className={`block h-full w-full ${className ?? ""}`}
      fontFamily="var(--font-mono), ui-monospace, monospace"
    >
      <title id={id}>{title}</title>
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-red`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent2} />
        </linearGradient>
      </defs>
      <rect width="480" height="320" fill={`url(#${id}-glow)`} />
      {children(id)}
    </svg>
  );
}

function Chip({
  x,
  y,
  w,
  label,
  active,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  active?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height="26"
        rx="13"
        fill={active ? accent : panel}
        stroke={active ? accent : line}
        strokeWidth="1.5"
      />
      <text
        x={x + w / 2}
        y={y + 17}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill={active ? "#ffffff" : ink}
        opacity={active ? 1 : 0.85}
      >
        {label}
      </text>
    </g>
  );
}

export function RobotIllustration(props: Props) {
  return (
    <Frame {...props}>
      {(id) => (
        <>
          {/* floor */}
          <ellipse cx="220" cy="292" rx="150" ry="10" fill={ink} opacity="0.06" />

          {/* listening waves */}
          <g stroke={accent} strokeWidth="4" strokeLinecap="round" opacity="0.9">
            <line x1="86" y1="150" x2="86" y2="166" />
            <line x1="100" y1="140" x2="100" y2="176" />
            <line x1="114" y1="128" x2="114" y2="188" />
            <line x1="128" y1="138" x2="128" y2="178" />
            <line x1="142" y1="148" x2="142" y2="168" />
          </g>

          {/* antenna */}
          <line x1="220" y1="72" x2="220" y2="94" stroke={ink} strokeWidth="3" opacity="0.5" />
          <circle cx="220" cy="66" r="7" fill={`url(#${id}-red)`} />

          {/* head */}
          <rect
            x="150"
            y="94"
            width="140"
            height="104"
            rx="30"
            fill={panel}
            stroke={ink}
            strokeOpacity="0.25"
            strokeWidth="2"
          />
          <rect x="166" y="110" width="108" height="66" rx="20" fill={ink} opacity="0.92" />
          {/* eyes */}
          <ellipse cx="200" cy="140" rx="9" ry="12" fill={accent} />
          <ellipse cx="240" cy="140" rx="9" ry="12" fill={accent} />
          <circle cx="203" cy="136" r="3" fill="#ffffff" opacity="0.9" />
          <circle cx="243" cy="136" r="3" fill="#ffffff" opacity="0.9" />
          {/* smile */}
          <path d="M204 160q16 12 32 0" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* ears */}
          <rect x="138" y="130" width="12" height="32" rx="6" fill={ink} opacity="0.35" />
          <rect x="290" y="130" width="12" height="32" rx="6" fill={ink} opacity="0.35" />

          {/* neck + body */}
          <rect x="208" y="198" width="24" height="12" fill={ink} opacity="0.35" />
          <rect
            x="168"
            y="210"
            width="104"
            height="76"
            rx="22"
            fill={panel}
            stroke={ink}
            strokeOpacity="0.25"
            strokeWidth="2"
          />
          <rect x="196" y="228" width="48" height="10" rx="5" fill={accent} opacity="0.85" />
          <circle cx="220" cy="258" r="9" fill="none" stroke={ink} strokeOpacity="0.35" strokeWidth="2" />
          {/* arms */}
          <path
            d="M168 232q-26 6-28 40"
            stroke={ink}
            strokeOpacity="0.4"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M272 232q28 4 34 -30"
            stroke={ink}
            strokeOpacity="0.4"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="140" cy="274" r="8" fill={ink} opacity="0.45" />
          <circle cx="308" cy="200" r="8" fill={ink} opacity="0.45" />

          {/* speech bubble */}
          <path
            d="M304 62h150a12 12 0 0 1 12 12v56a12 12 0 0 1-12 12H326l-20 18v-18h-2a12 12 0 0 1-12-12V74a12 12 0 0 1 12-12z"
            fill={panel}
            stroke={ink}
            strokeOpacity="0.25"
            strokeWidth="2"
          />
          <text x="318" y="88" fontSize="11.5" fontWeight="600" fill={ink}>
            Hello! Let&apos;s practice
          </text>
          <text x="318" y="108" fontSize="11.5" fontWeight="600" fill={accent}>
            English together.
          </text>
          <g fill={ink} opacity="0.35">
            <circle cx="322" cy="126" r="2.5" />
            <circle cx="332" cy="126" r="2.5" />
            <circle cx="342" cy="126" r="2.5" />
          </g>

          {/* letter tiles */}
          <g fontSize="16" fontWeight="700" textAnchor="middle">
            <rect x="40" y="220" width="36" height="36" rx="9" fill={panel} stroke={line} strokeWidth="1.5" />
            <text x="58" y="244" fill={accent}>
              A
            </text>
            <rect x="70" y="252" width="36" height="36" rx="9" fill={panel} stroke={line} strokeWidth="1.5" />
            <text x="88" y="276" fill={ink}>
              B
            </text>
            <rect
              x="100"
              y="216"
              width="36"
              height="36"
              rx="9"
              fill={panel}
              stroke={line}
              strokeWidth="1.5"
            />
            <text x="118" y="240" fill={ink}>
              C
            </text>
          </g>

          {/* book */}
          <g transform="translate(360 220)">
            <path
              d="M0 10q30-14 50 0v54q-20-14-50 0z"
              fill={panel}
              stroke={ink}
              strokeOpacity="0.3"
              strokeWidth="2"
            />
            <path
              d="M50 10q20-14 50 0v54q-30-14-50 0z"
              fill={panel}
              stroke={ink}
              strokeOpacity="0.3"
              strokeWidth="2"
            />
            <g stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.7">
              <line x1="10" y1="26" x2="40" y2="20" />
              <line x1="10" y1="38" x2="40" y2="32" />
              <line x1="60" y1="20" x2="90" y2="26" />
              <line x1="60" y1="32" x2="90" y2="38" />
            </g>
          </g>
        </>
      )}
    </Frame>
  );
}

export function SdlcIllustration(props: Props) {
  return (
    <Frame {...props}>
      {(id) => (
        <>
          {/* window */}
          <rect
            x="36"
            y="34"
            width="408"
            height="252"
            rx="14"
            fill={panel}
            stroke={ink}
            strokeOpacity="0.2"
            strokeWidth="2"
          />
          <g fill={ink} opacity="0.3">
            <circle cx="56" cy="52" r="4" />
            <circle cx="70" cy="52" r="4" />
            <circle cx="84" cy="52" r="4" />
          </g>
          <line x1="36" y1="66" x2="444" y2="66" stroke={line} strokeWidth="1.5" />

          {/* intent */}
          <text x="56" y="92" fontSize="12" fill={accent} fontWeight="600">
            ❯
          </text>
          <text x="70" y="92" fontSize="12" fill={ink} opacity="0.85">
            &quot;Customer portal with SSO and usage dashboard&quot;
          </text>

          {/* pipeline line */}
          <line x1="80" y1="150" x2="400" y2="150" stroke={line} strokeWidth="2" />
          <line x1="80" y1="150" x2="290" y2="150" stroke={`url(#${id}-red)`} strokeWidth="2" />

          {/* nodes */}
          {[
            { x: 80, label: "plan", done: true },
            { x: 185, label: "build", done: true },
            { x: 290, label: "review", done: true, active: true },
            { x: 395, label: "ship", done: false },
          ].map((n) => (
            <g key={n.label}>
              <circle
                cx={n.x}
                cy="150"
                r="17"
                fill={n.active ? accent : panel}
                stroke={n.done ? accent : line}
                strokeWidth="2"
              />
              {n.done && !n.active && (
                <path
                  d={`M${n.x - 6} 150l4 4 8-8`}
                  stroke={accent}
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              )}
              {n.active && <circle cx={n.x} cy="150" r="5" fill="#ffffff" />}
              {!n.done && <circle cx={n.x} cy="150" r="4" fill={ink} opacity="0.25" />}
              <text x={n.x} y="188" textAnchor="middle" fontSize="12" fill={ink} opacity="0.8">
                {n.label}
              </text>
            </g>
          ))}

          {/* agents under build */}
          <g stroke={line} strokeWidth="1.5" strokeDasharray="3 3">
            <line x1="185" y1="194" x2="150" y2="206" />
            <line x1="185" y1="194" x2="185" y2="206" />
            <line x1="185" y1="194" x2="220" y2="206" />
          </g>
          <Chip x={118} y={206} w={64} label="auth" />
          <Chip x={153} y={238} w={64} label="api" />
          <Chip x={188} y={206} w={64} label="ui" />

          {/* review card */}
          <rect
            x="250"
            y="206"
            width="176"
            height="60"
            rx="10"
            fill={panel}
            stroke={accent}
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />
          <text x="264" y="228" fontSize="11" fill={ink} opacity="0.7">
            10 personas · 0 P0
          </text>
          <text x="264" y="250" fontSize="13" fontWeight="700" fill={accent}>
            91/100 · APPROVED
          </text>

          {/* plan doc */}
          <g transform="translate(52 104)">
            <rect width="56" height="30" rx="6" fill={panel} stroke={line} strokeWidth="1.5" />
            <g stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.8">
              <line x1="8" y1="10" x2="40" y2="10" />
              <line x1="8" y1="17" x2="30" y2="17" />
              <line x1="8" y1="24" x2="46" y2="24" />
            </g>
          </g>

          {/* PR icon near ship */}
          <g transform="translate(380 96)" stroke={ink} strokeOpacity="0.6" strokeWidth="2" fill="none">
            <circle cx="8" cy="8" r="4" />
            <circle cx="8" cy="32" r="4" />
            <circle cx="32" cy="32" r="4" />
            <path d="M8 12v16M32 28V20a8 8 0 0 0-8-8h-6" />
          </g>
        </>
      )}
    </Frame>
  );
}

export function EnterpriseIllustration(props: Props) {
  return (
    <Frame {...props}>
      {(id) => (
        <>
          {/* connections */}
          <g stroke={line} strokeWidth="2" strokeDasharray="4 4" fill="none">
            <path d="M118 92q30 0 40 48" />
            <path d="M118 160h40" />
            <path d="M118 228q30 0 40-48" />
            <path d="M322 160h40" />
          </g>
          <g stroke={accent} strokeWidth="2" fill="none" opacity="0.6">
            <path d="M118 160h40" />
          </g>

          {/* systems */}
          {[
            { y: 76, label: "CRM" },
            { y: 144, label: "Docs" },
            { y: 212, label: "ERP" },
          ].map((s) => (
            <g key={s.label}>
              <rect
                x="46"
                y={s.y}
                width="72"
                height="32"
                rx="8"
                fill={panel}
                stroke={line}
                strokeWidth="1.5"
              />
              <rect x="54" y={s.y + 10} width="12" height="12" rx="3" fill={accent} opacity="0.8" />
              <text x="72" y={s.y + 21} fontSize="12" fontWeight="600" fill={ink} opacity="0.85">
                {s.label}
              </text>
            </g>
          ))}

          {/* chat window */}
          <rect
            x="160"
            y="44"
            width="162"
            height="232"
            rx="14"
            fill={panel}
            stroke={ink}
            strokeOpacity="0.22"
            strokeWidth="2"
          />
          <rect x="160" y="44" width="162" height="36" rx="14" fill={ink} opacity="0.9" />
          <rect x="160" y="66" width="162" height="14" fill={ink} opacity="0.9" />
          <circle cx="180" cy="62" r="8" fill={accent} />
          <rect x="194" y="58" width="60" height="8" rx="4" fill="#ffffff" opacity="0.7" />
          {/* bubbles */}
          <rect x="174" y="96" width="98" height="26" rx="10" fill={ink} opacity="0.08" />
          <rect x="182" y="106" width="70" height="6" rx="3" fill={ink} opacity="0.35" />
          <rect x="208" y="132" width="100" height="44" rx="10" fill={`url(#${id}-red)`} />
          <rect x="218" y="143" width="80" height="6" rx="3" fill="#ffffff" opacity="0.85" />
          <rect x="218" y="156" width="56" height="6" rx="3" fill="#ffffff" opacity="0.65" />
          <text x="218" y="170" fontSize="7" fill="#ffffff" opacity="0.8">
            source: hr-policy.pdf
          </text>
          <rect x="174" y="186" width="86" height="26" rx="10" fill={ink} opacity="0.08" />
          <rect x="182" y="196" width="60" height="6" rx="3" fill={ink} opacity="0.35" />
          {/* input */}
          <rect
            x="174"
            y="236"
            width="134"
            height="26"
            rx="13"
            fill={panel}
            stroke={line}
            strokeWidth="1.5"
          />
          <rect x="186" y="247" width="66" height="4" rx="2" fill={ink} opacity="0.25" />
          <circle cx="294" cy="249" r="8" fill={accent} />
          <path
            d="M291 249h6M294 246l3 3-3 3"
            stroke="#ffffff"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* private platform */}
          <rect
            x="362"
            y="86"
            width="90"
            height="148"
            rx="12"
            fill={panel}
            stroke={ink}
            strokeOpacity="0.22"
            strokeWidth="2"
          />
          <text x="407" y="108" textAnchor="middle" fontSize="10" fill={ink} opacity="0.6">
            private cloud
          </text>
          <Chip x={374} y={118} w={66} label="LLM" active />
          <Chip x={374} y={152} w={66} label="vector db" />
          <Chip x={374} y={186} w={66} label="gateway" />
          {/* shield */}
          <g transform="translate(396 236)">
            <path d="M11 0l11 4v8c0 7-5 12-11 14C5 24 0 19 0 12V4z" fill={accent} />
            <path
              d="M6 12l3.5 3.5L16 9"
              stroke="#ffffff"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* ground label */}
          <line x1="46" y1="292" x2="452" y2="292" stroke={line} strokeWidth="1.5" />
          <text x="249" y="310" textAnchor="middle" fontSize="10" fill={ink} opacity="0.55">
            deployed in your environment
          </text>
        </>
      )}
    </Frame>
  );
}

const bySlug: Record<PillarSlug, (p: Props) => ReactElement> = {
  "ai-robot": RobotIllustration,
  "ai-sdlc": SdlcIllustration,
  "ai-enterprise": EnterpriseIllustration,
};

export function PillarIllustration({ slug, ...props }: Props & { slug: PillarSlug }) {
  const Ill = bySlug[slug];
  return <Ill {...props} />;
}

export function PillarArt({
  slug,
  title,
  className = "",
  crop,
}: {
  slug: PillarSlug;
  title: string;
  className?: string;
  crop?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-border bg-bg ${className}`}>
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <PillarIllustration slug={slug} title={title} crop={crop} className="relative" />
    </div>
  );
}
