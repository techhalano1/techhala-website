"use client";

import { useEffect, useState } from "react";

type Step = { cmd: string; out: string[] };

export function Terminal({ steps }: { steps: Step[] }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [shownOut, setShownOut] = useState(0);
  const [history, setHistory] = useState<Step[]>([]);

  useEffect(() => {
    const step = steps[stepIdx];
    if (!step) return;
    if (typed.length < step.cmd.length) {
      const id = setTimeout(() => setTyped(step.cmd.slice(0, typed.length + 1)), 28);
      return () => clearTimeout(id);
    }
    if (shownOut < step.out.length) {
      const id = setTimeout(() => setShownOut((n) => n + 1), 380);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      if (stepIdx + 1 < steps.length) {
        setHistory((h) => [...h, step]);
        setStepIdx((i) => i + 1);
      } else {
        setHistory([]);
        setStepIdx(0);
      }
      setTyped("");
      setShownOut(0);
    }, 1800);
    return () => clearTimeout(id);
  }, [steps, stepIdx, typed, shownOut]);

  const current = steps[stepIdx];

  return (
    <div className="glow overflow-hidden rounded-xl border border-border bg-[#0d0d0d] font-mono text-[13px] leading-relaxed text-zinc-200 shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        <span className="ml-3 text-xs text-zinc-500">hal — zsh</span>
      </div>
      <div className="min-h-[300px] p-5" aria-live="polite">
        {history.map((s, i) => (
          <div key={i} className="mb-3">
            <Line cmd={s.cmd} />
            {s.out.map((o, j) => (
              <Out key={j} text={o} />
            ))}
          </div>
        ))}
        {current && (
          <div>
            <Line cmd={typed} cursor />
            {current.out.slice(0, shownOut).map((o, j) => (
              <Out key={j} text={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Line({ cmd, cursor = false }: { cmd: string; cursor?: boolean }) {
  return (
    <div>
      <span className="text-red-500">➜</span> <span className="text-zinc-400">~/app</span>{" "}
      <span className="text-zinc-100">{cmd}</span>
      {cursor && <span className="cursor-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-zinc-300" />}
    </div>
  );
}

function Out({ text }: { text: string }) {
  const ok = text.startsWith("✓");
  return (
    <div className={`fade-up pl-4 ${ok ? "text-emerald-300" : "text-zinc-400"}`}>{text}</div>
  );
}
