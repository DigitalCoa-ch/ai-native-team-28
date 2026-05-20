"use client";
import { useEffect, useState } from "react";

const BULLISH_ITEMS = [
  {
    symbol: "/NQ",
    name: "Nasdaq 100 E-mini",
    sentiment: "BULLISH",
    strength: "STRONG",
    entry: "29,572.00",
    target: "30,300",
    stop: "27,315.50",
    rationale: "Weekly structure firmly bullish. Price pressing fresh highs near 29,782 pivot resistance. All MAs in bullish stack: 5D > 10D > 20D > 55D > 100D. Momentum fast. Higher highs and higher lows confirmed across all timeframes.",
    catalysts: ["AI/tech earnings momentum", "Fed hold keeps risk-on alive", "In-line CPI print fuels melt-up scenario"],
    keyLevel: "29,782.00 (pvt resistance) → 30,300 (COLD scenario target)",
  },
  {
    symbol: "/ES",
    name: "S&P 500 E-mini",
    sentiment: "BULLISH",
    strength: "MODERATE",
    entry: "5,948.25",
    target: "6,010",
    stop: "5,935.00",
    rationale: "Status quo scenario intact. Fed on hold. Equities bid in near-term. Above 200-day MA at 5,872.50 keeps long-term bias bullish. Breadth improving with tech leadership.",
    catalysts: ["In-line CA CPI release", "Corporate earnings beat expectations", "Risk-on macro tailwind"],
    keyLevel: "5,960.00 (R1 pivot) → 6,010 (IN-LINE target)",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp",
    sentiment: "BULLISH",
    strength: "STRONG",
    entry: "135.50",
    target: "148.00",
    stop: "128.00",
    rationale: "AI infrastructure spend supercycle intact. Blackwell GPU demand exceeds supply. Data center revenue accelerating. Institutional accumulation on pullbacks. Technical breakout above 135.",
    catalysts: ["Hyperscaler capex guidance raise", "Insider buying at key levels", "Technical breakout above 135"],
    keyLevel: "135.00 (breakout) → 148.00 (measured move)",
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    sentiment: "BULLISH",
    strength: "STRONG",
    entry: "492.00",
    target: "510.00",
    stop: "483.00",
    rationale: "Nasdaq-heavy ETF. Tech mega-caps leadership. Rate-sensitive growth stocks benefit most from Fed pause. Rising earnings revisions for Q2. All MAs stacked above price.",
    catalysts: ["Fed rate pause extends growth stock runway", "Q2 earnings revision season bullish", "MAs all stacked above price"],
    keyLevel: "495.00 (minor resistance) → 510.00 (all-time high zone)",
  },
];

export default function BullishPage() {
  const [path, setPath] = useState("/bullish");
  useEffect(() => { setPath(window.location.pathname); }, []);
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: "#000000" }}>
      <div className="sticky top-0 z-50"></div>
      <main className="flex-1 px-6 py-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🐂</span>
          <div>
            <h1 className="text-2xl font-bold text-emerald-400">Bullish Setups</h1>
            <p className="text-sm text-neutral-500 mt-1">Long bias confirmed by technical structure and macro catalysts</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BULLISH_ITEMS.map((item) => (
            <div key={item.symbol} className="rounded-xl border p-5" style={{ background: "#111112", borderColor: "#22C55E33" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-mono text-neutral-500">{item.symbol}</div>
                  <div className="text-white font-bold mt-0.5">{item.name}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-400/10 text-emerald-400">{item.sentiment}</span>
                  <span className="text-[10px] font-mono text-neutral-500">{item.strength}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Entry",  value: item.entry  },
                  { label: "Target", value: item.target },
                  { label: "Stop",   value: item.stop   },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg p-2 text-center" style={{ background: "#000" }}>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">{label}</div>
                    <div className="text-xs font-mono font-bold text-emerald-400">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-2">Rationale</div>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.rationale}</p>
              </div>
              <div className="mb-3">
                <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-2">Catalysts</div>
                <div className="flex flex-wrap gap-1.5">
                  {item.catalysts.map((c) => (
                    <span key={c} className="text-[10px] px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-1">Key Level</div>
                <div className="text-xs font-mono text-emerald-400/80">{item.keyLevel}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
