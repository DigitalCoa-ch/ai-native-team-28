"use client";
import { useEffect, useState } from "react";

const BEARISH_ITEMS = [
  {
    symbol: "/NG",
    name: "Natural Gas Futures",
    sentiment: "BEARISH",
    strength: "STRONG",
    entry: "4.120",
    target: "3.850",
    stop: "4.280",
    rationale: "Supply glut persists. Weather demand below seasonal norms. LNG export capacity constrained. Storage at 5-year high. Technical downtrend intact below all MAs. Death cross on daily chart.",
    catalysts: ["Warmer-than-expected spring forecast", "European storage near capacity", "Shale output remains elevated"],
    keyLevel: "4.050 (support flip) → 3.850 (2026 target)",
  },
  {
    symbol: "SWAV",
    name: "Shapeways Holdings",
    sentiment: "BEARISH",
    strength: "HIGH",
    entry: "2.85",
    target: "2.20",
    stop: "3.10",
    rationale: "Revenue declining QoQ. Cash burn unsustainable at current burn rate. Delisting risk from low stock price. No institutional support. Technical death cross on weekly. No clear path to profitability.",
    catalysts: ["Cash runway < 6 months", "Reverse split likely", "No clear path to profitability"],
    keyLevel: "2.95 (50-day MA resistance) → 2.20 (cycle low)",
  },
  {
    symbol: "/BTC",
    name: "Bitcoin Futures",
    sentiment: "BEARISH",
    strength: "MODERATE",
    entry: "104,500",
    target: "98,000",
    stop: "107,200",
    rationale: "Macro headwinds from hot CPI print. Fed pivot delayed. Risk-off in equities drags crypto. On-chain data shows weak hands distributing. RSI overbought weekly. ETF outflows accelerating.",
    catalysts: ["Hot CA CPI print triggers risk-off", "Fed Waller hawkish tone", "ETF outflows accelerating"],
    keyLevel: "103,000 (minor support) → 98,000 (HOT scenario target)",
  },
  {
    symbol: "SMMT",
    name: "Summit Healthcare Inc",
    sentiment: "BEARISH",
    strength: "HIGH",
    entry: "1.22",
    target: "0.85",
    stop: "1.45",
    rationale: "Clinical trial failure on lead asset. FDA rejection risk elevated. Cash runway < 2 quarters. Institutional ownership minimal. Volume confirms sustained selling pressure.",
    catalysts: ["Phase 3 trial miss", "FDA complete response letter risk", "Reverse split expected"],
    keyLevel: "1.30 (200-day MA resistance) → 0.85 (deep value trap)",
  },
];

export default function BearishPage() {
  const [path, setPath] = useState("/bearish");
  useEffect(() => { setPath(window.location.pathname); }, []);
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: "#000000" }}>
      <div className="sticky top-0 z-50"></div>
      <main className="flex-1 px-6 py-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🐻</span>
          <div>
            <h1 className="text-2xl font-bold text-red-400">Bearish Setups</h1>
            <p className="text-sm text-neutral-500 mt-1">Short bias confirmed by technical breakdown and fundamental deterioration</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BEARISH_ITEMS.map((item) => (
            <div key={item.symbol} className="rounded-xl border p-5" style={{ background: "#111112", borderColor: "#EF444433" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-mono text-neutral-500">{item.symbol}</div>
                  <div className="text-white font-bold mt-0.5">{item.name}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-red-400/10 text-red-400">{item.sentiment}</span>
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
                    <div className="text-xs font-mono font-bold text-red-400">{value}</div>
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
                    <span key={c} className="text-[10px] px-2 py-1 rounded-full bg-red-400/10 text-red-400">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-1">Key Level</div>
                <div className="text-xs font-mono text-red-400/80">{item.keyLevel}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
