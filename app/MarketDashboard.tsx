"use client";

import React, { useState, useEffect } from "react";

interface EconEvent {
  time: string;
  country: string;
  name: string;
  impact: "high" | "medium" | "low";
  forecast?: string;
  previous?: string;
}

interface PriceLevel {
  label: string;
  value: string;
  type: "resistance" | "support" | "high" | "low" | "pivot";
}

interface Scenario {
  label: string;
  reading: string;
  description: string;
  esTarget: string;
  nqTarget: string;
  color: string;
}
const ECONOMIC_EVENTS: EconEvent[] = [
  { time: "08:30 EDT", country: "US", name: "Fed Waller Speaks",           impact: "high",   forecast: "—",       previous: "—"      },
  { time: "10:00 EDT", country: "US", name: "Pending Home Sales (MoM)",    impact: "medium", forecast: "+1.0%",   previous: "+1.5%"  },
  { time: "14:00 EDT", country: "CA", name: "CPI (YoY) (Apr)",            impact: "high",   forecast: "3.1%",    previous: "2.4%"   },
  { time: "14:00 EDT", country: "CA", name: "Core CPI (MoM) (Apr)",       impact: "medium", forecast: "—",       previous: "+0.2%"  },
  { time: "14:30 EDT", country: "US", name: "API Weekly Crude Oil Stock",  impact: "low",    forecast: "—",       previous: "-2.188M" },
];

const NQ_LEVELS: PriceLevel[] = [
  { label: "Pvt Resistance",   value: "29,782.00", type: "resistance" },
  { label: "Current Price",    value: "29,572.00", type: "high"      },
  { label: "5-Day Benchmark",  value: "28,132.00", type: "resistance" },
  { label: "10-Day Benchmark", value: "28,210.50", type: "resistance" },
  { label: "Pvt Support",      value: "27,315.50", type: "support"   },
  { label: "20-Day MA",        value: "25,866.00", type: "support"   },
  { label: "55-Day MA",        value: "24,907.00", type: "support"   },
  { label: "100-Day MA",       value: "23,404.75", type: "support"   },
];

const ES_LEVELS: PriceLevel[] = [
  { label: "Session High",  value: "5,971.50", type: "high"      },
  { label: "R1 Pivot",      value: "5,960.00", type: "resistance" },
  { label: "Current Price", value: "5,948.25", type: "pivot"     },
  { label: "S1 Pivot",      value: "5,935.00", type: "support"   },
  { label: "Session Low",   value: "5,918.75", type: "low"       },
  { label: "200-Day MA",    value: "5,872.50", type: "support"   },
];

const SCENARIOS: Scenario[] = [
  {
    label: "HOT",
    reading: "CPI > 3.5%",
    description: "Inflation re-acceleration fears. Fed forced to reconsider rate path. Risk-off posture.",
    esTarget: "5,885 – 5,910",
    nqTarget: "27,200 – 27,500",
    color: "#FF3B3B",
  },
  {
    label: "IN-LINE",
    reading: "CPI 2.9% – 3.4%",
    description: "Prints in-line. Fed stays on hold. Market melts higher — status quo bullish.",
    esTarget: "5,975 – 6,010",
    nqTarget: "29,800 – 30,200",
    color: "#BFFF00",
  },
  {
    label: "COLD",
    reading: "CPI < 2.9%",
    description: "Inflation genuinely cooling. Rate cuts back on the table. Risk-on euphoria.",
    esTarget: "6,020 – 6,080",
    nqTarget: "30,300 – 31,000",
    color: "#00E5FF",
  },
];
function ImpactDot({ level }: { level: "high" | "medium" | "low" }) {
  const map = { high: "bg-red-500", medium: "bg-amber-400", low: "bg-neutral-600" };
  return <span className={"inline-block w-2 h-2 rounded-full " + map[level]} />;
}

const TYPE_STYLES: Record<string, { text: string; border: string }> = {
  resistance: { text: "text-red-400",     border: "border-l-red-500"    },
  support:    { text: "text-emerald-400", border: "border-l-emerald-500" },
  high:       { text: "text-neutral-100", border: "border-l-neutral-500" },
  low:        { text: "text-neutral-400", border: "border-l-neutral-700" },
  pivot:      { text: "text-lime-400",    border: "border-l-lime-500"   },
};

function LevelTable({ levels }: { levels: PriceLevel[] }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {levels.map((lvl, i) => {
          const s = TYPE_STYLES[lvl.type] ?? TYPE_STYLES.high;
          return (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className={"px-4 py-2.5 font-medium border-l-2 " + s.border + " " + s.text}>
                {lvl.label}
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-neutral-200">
                {lvl.value}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <div
      className="rounded-xl p-5 border transition-all hover:scale-[1.02]"
      style={{ background: "#1A1A1A", borderColor: scenario.color + "44" }}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-xs font-bold tracking-widest px-2 py-1 rounded uppercase"
          style={{ background: scenario.color + "22", color: scenario.color }}
        >
          {scenario.label}
        </span>
        <span className="text-xs font-mono text-neutral-500 mt-0.5">{scenario.reading}</span>
      </div>
      <p className="text-xs text-neutral-400 leading-relaxed mb-4">{scenario.description}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">/ES Target</div>
          <div className="font-mono text-sm font-semibold" style={{ color: scenario.color }}>
            {scenario.esTarget}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">/NQ Target</div>
          <div className="font-mono text-sm font-semibold" style={{ color: scenario.color }}>
            {scenario.nqTarget}
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveBadge() {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-lime-400 font-mono">
      <span
        className="w-1.5 h-1.5 rounded-full transition-all duration-300"
        style={{ background: pulse ? "#BFFF00" : "#3A5A00" }}
      />
      LIVE
    </span>
  );
}
export default function MarketDashboard() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const edt = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        timeZone: "America/New_York", hour12: false,
      }).format(now);
      setTime(edt + " EDT");
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ background: "#000000" }}>

      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="3" stroke="#BFFF00" strokeWidth="1.5"/>
            <path d="M7 13l4-4 4 4 6-6" stroke="#BFFF00" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-white font-bold tracking-tight text-lg">MACRO</span>
          <span className="text-lime-400 font-bold tracking-tight text-lg">TRADING</span>
          <span className="text-[10px] font-mono text-neutral-600 ml-1">v2.0</span>
        </div>
        <div className="flex items-center gap-5">
          <LiveBadge />
          <span className="text-xs font-mono text-neutral-500">{time}</span>
          <span className="text-xs font-mono text-neutral-500">May 19, 2026</span>
        </div>
      </header>

      <main className="grid grid-cols-3 gap-5 p-6 max-w-[1600px] mx-auto">
        {/* LEFT: Economic Calendar */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BFFF00" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h2 className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Economic Calendar</h2>
          </div>

          <div className="rounded-xl p-4 border border-lime-500/30" style={{ background: "#111112" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-widest text-lime-400 uppercase">Next High-Impact</span>
              <span className="text-[10px] font-mono text-neutral-500">14:00 EDT</span>
            </div>
            <div className="text-white font-semibold mb-3">CA CPI (YoY) — April 2026</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Forecast", value: "3.1%",  accent: false },
                { label: "Previous", value: "2.4%",  accent: false },
                { label: "Impact",   value: "HIGH",  accent: true  },
              ].map(({ label, value, accent }) => (
                <div key={label} className="rounded-lg p-2 text-center" style={{ background: "#000" }}>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">{label}</div>
                  <div className={"text-sm font-mono font-bold " + (accent ? "text-red-400" : "text-white")}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: "#111112" }}>
            <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">All Events — May 19</span>
              <span className="text-[10px] font-mono text-neutral-600">EDT</span>
            </div>
            <div className="divide-y divide-white/5">
              {ECONOMIC_EVENTS.map((evt, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-neutral-500 min-w-[48px]">{evt.time}</span>
                    <span className="text-xs font-bold text-neutral-400">{evt.country}</span>
                    <ImpactDot level={evt.impact} />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white">{evt.name}</div>
                    {evt.forecast && evt.forecast !== "—" && (
                      <div className="text-[10px] font-mono text-neutral-600">
                        Cons: {evt.forecast}&nbsp;&nbsp;Prev: {evt.previous}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4 border border-white/10" style={{ background: "#111112" }}>
            <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-3">Market Bias</div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-white font-semibold">NQ Short-Term</span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">BULLISH</span>
            </div>
            <div className="text-[11px] text-neutral-500 leading-relaxed">
              Price pressing fresh highs near 29,782 resistance. All moving averages in bullish stack.
              Next support at 27,315.50.
            </div>
          </div>
        </section>
        {/* CENTER: Price Boundaries */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BFFF00" strokeWidth="2">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
            <h2 className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Session Price Boundaries</h2>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: "#111112" }}>
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">/NQ</span>
                <span className="text-xs text-neutral-500">Nasdaq 100</span>
              </div>
              <span className="text-xs font-mono text-lime-400">29,572.00</span>
            </div>
            <LevelTable levels={NQ_LEVELS} />
          </div>

          <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: "#111112" }}>
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">/ES</span>
                <span className="text-xs text-neutral-500">S&amp;P 500 E-mini</span>
              </div>
              <span className="text-xs font-mono text-lime-400">5,948.25</span>
            </div>
            <LevelTable levels={ES_LEVELS} />
          </div>
        </section>
        {/* RIGHT: Scenario Grid */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BFFF00" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h2 className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Scenario Grid</h2>
          </div>

          <div className="rounded-xl p-4 border border-red-500/30" style={{ background: "#111112" }}>
            <div className="text-[10px] text-red-400 font-bold tracking-widest uppercase mb-2">⚠️ Risk Event of the Day</div>
            <div className="text-sm text-white font-semibold">Canada CPI Release</div>
            <div className="text-[11px] text-neutral-500 mt-1">14:00 EDT &bull; High Impact &bull; BMO ITM</div>
          </div>

          <div className="flex flex-col gap-3">
            {SCENARIOS.map((s, i) => <ScenarioCard key={i} scenario={s} />)}
          </div>
        </section>

      </main>

    </div>
  );
}
