"use client";

import React, { useState, useEffect } from "react";

type Impact = "high" | "medium" | "low";
interface EconEvent { time: string; country: string; name: string; impact: Impact; forecast?: string; previous?: string; actual?: string; description?: string; whyItMatters?: string; }
interface PriceLevel { label: string; value: string; type: "resistance" | "support" | "high" | "low" | "pivot"; }
interface Scenario { label: string; reading: string; description: string; esTarget: string; nqTarget: string; color: string; }

const ECONOMIC_EVENTS: EconEvent[] = [
  { time: "08:30 EDT", country: "US", name: "Fed Waller Speaks", impact: "high", forecast: "—", previous: "—", description: "Federal Reserve Governor Christopher Waller delivers remarks on the economic outlook at a Brookings Institution event.", whyItMatters: "Fed voting member. Hawkish tone could spark risk-off in equities and strengthen USD." },
  { time: "10:00 EDT", country: "US", name: "Pending Home Sales (MoM)", impact: "medium", forecast: "+1.0%", previous: "+1.5%", description: "Month-over-month change in US pending home sales, a leading indicator of existing-home closings.", whyItMatters: "Leading indicator for existing home purchases. Weakness signals housing sector cooling." },
  { time: "14:00 EDT", country: "CA", name: "CPI (YoY) (Apr)", impact: "high", forecast: "3.1%", previous: "2.4%", actual: "—", description: "Canada’s year-over-year Consumer Price Index for April 2026. Critical for CAD and Bank of Canada rate expectations.", whyItMatters: "Bank of Canada’s primary inflation gauge. Prints above 3.5% likely to crush rate cut hopes." },
  { time: "14:00 EDT", country: "CA", name: "Core CPI (MoM) (Apr)", impact: "medium", forecast: "—", previous: "+0.2%", description: "Month-over-month Core CPI for Canada, stripping out volatile food and energy components.", whyItMatters: "Strips out food/energy. Shows underlying inflationary pressure in the Canadian economy." },
  { time: "14:30 EDT", country: "US", name: "API Weekly Crude Oil Stock", impact: "low", forecast: "—", previous: "-2.188M", description: "American Petroleum Institute weekly crude oil inventory change. Trades ahead of official EIA data.", whyItMatters: "Crude inventory draw builds could lift energy sector and push inflation expectations higher." },
];

const NQ_LEVELS: PriceLevel[] = [
  { label: "Pvt Resistance",   value: "29,782.00", type: "resistance" },
  { label: "Current Price",    value: "29,572.00", type: "high" },
  { label: "5-Day Benchmark",  value: "28,132.00", type: "resistance" },
  { label: "10-Day Benchmark", value: "28,210.50", type: "resistance" },
  { label: "Pvt Support",      value: "27,315.50", type: "support" },
  { label: "20-Day MA",        value: "25,866.00", type: "support" },
  { label: "55-Day MA",        value: "24,907.00", type: "support" },
  { label: "100-Day MA",       value: "23,404.75", type: "support" },
];

const ES_LEVELS: PriceLevel[] = [
  { label: "Session High",   value: "5,971.50", type: "high" },
  { label: "R1 Pivot",       value: "5,960.00", type: "resistance" },
  { label: "Current Price", value: "5,948.25", type: "pivot" },
  { label: "S1 Pivot",      value: "5,935.00", type: "support" },
  { label: "Session Low",   value: "5,918.75", type: "low" },
  { label: "200-Day MA",    value: "5,872.50", type: "support" },
];

const SCENARIOS: Scenario[] = [
  { label: "HOT",     reading: "CPI > 3.5%",   description: "Inflation re-acceleration fears. Fed forced to reconsider rate path. Risk-off posture across equities.", esTarget: "5,885 – 5,910",  nqTarget: "27,200 – 27,500", color: "#FF3B3B" },
  { label: "IN-LINE", reading: "CPI 2.9% – 3.4%", description: "Prints in-line. Fed stays on hold. Market melts higher — status quo bullish.", esTarget: "5,975 – 6,010",  nqTarget: "29,800 – 30,200", color: "#BFFF00" },
  { label: "COLD",    reading: "CPI < 2.9%",   description: "Inflation genuinely cooling. Rate cuts back on the table. Risk-on euphoria.", esTarget: "6,020 – 6,080",   nqTarget: "30,300 – 31,000", color: "#00E5FF" },
];

function LiveBadge() {
  const [pulse, setPulse] = useState(false);
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 1200); return () => clearInterval(t); }, []);
  return <span className="inline-flex items-center gap-1.5 text-xs text-lime-400 font-mono"><span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: pulse ? "#BFFF00" : "#3A5A00" }}/></span>;
}

function ImpactDot({ level }: { level: Impact }) {
  const m: Record<Impact, string> = { high: "bg-red-500", medium: "bg-amber-400", low: "bg-neutral-600" };
  return <span className={"inline-block w-2 h-2 rounded-full " + m[level]} />;
}

const T = {
  resistance: { text: "text-red-400",      border: "border-l-red-500" },
  support:    { text: "text-emerald-400",   border: "border-l-emerald-500" },
  high:       { text: "text-neutral-100",   border: "border-l-neutral-500" },
  low:        { text: "text-neutral-400",   border: "border-l-neutral-700" },
  pivot:      { text: "text-lime-400",      border: "border-l-lime-500" },
};

function LevelTable({ levels }: { levels: PriceLevel[] }) {
  return <table className="w-full text-sm"><tbody>{levels.map((lvl, i) => { const s = T[lvl.type] || T.high; return <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className={"px-4 py-2.5 font-medium border-l-2 " + s.border + " " + s.text}>{lvl.label}</td><td className="px-4 py-2.5 text-right font-mono text-neutral-200">{lvl.value}</td></tr>; })}</tbody></table>;
}

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return <div className="rounded-xl p-5 border transition-all hover:scale-[1.01]" style={{ background: "#1A1A1A", borderColor: scenario.color + "44" }}><div className="flex items-start justify-between mb-3"><span className="text-xs font-bold tracking-widest px-2 py-1 rounded uppercase" style={{ background: scenario.color + "22", color: scenario.color }}>{scenario.label}</span><span className="text-xs font-mono text-neutral-500 mt-0.5">{scenario.reading}</span></div><p className="text-xs text-neutral-400 leading-relaxed mb-4">{scenario.description}</p><div className="grid grid-cols-2 gap-3"><div><div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">/ES Target</div><div className="font-mono text-sm font-semibold" style={{ color: scenario.color }}>{scenario.esTarget}</div></div><div><div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">/NQ Target</div><div className="font-mono text-sm font-semibold" style={{ color: scenario.color }}>{scenario.nqTarget}</div></div></div></div>;
}
function ExpandableEventCard({ event }: { event: EconEvent }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-neutral-500 min-w-[48px]">{event.time}</span>
          <span className="text-xs font-bold text-neutral-400">{event.country}</span>
          <ImpactDot level={event.impact} />
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-white">{event.name}</div>
            {event.forecast && event.forecast !== "—" && (
              <div className="text-[10px] font-mono text-neutral-600">
                Cons:{event.forecast}&nbsp;&nbsp;Prev:{event.previous}
              </div>
            )}
          </div>
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            className={"text-neutral-500 flex-shrink-0 transition-transform duration-200 " + (open ? "rotate-180" : "")}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-white/5" style={{ background: "#0A0A0A" }}>
          {event.description && (
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">{event.description}</p>
          )}
          {event.whyItMatters && (
            <div className="rounded-lg p-3 border" style={{ background: "#111112", borderColor: "#2A2A2A" }}>
              <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-1">Why It Matters</div>
              <p className="text-xs text-neutral-300 leading-relaxed">{event.whyItMatters}</p>
            </div>
          )}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[{ label: "Forecast", value: event.forecast || "—" }, { label: "Previous", value: event.previous || "—" }, { label: "Actual", value: event.actual || "—" }].map(({ label, value }) => (
              <div key={label} className="rounded-lg p-2 text-center" style={{ background: "#111112" }}>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">{label}</div>
                <div className="text-sm font-mono font-bold text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExpandableRiskAlert() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border transition-all" style={{ background: "#111112", borderColor: "#FF3B3B33" }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left rounded-xl"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">&#x26a0;&#xfe0f;</span>
          <div>
            <div className="text-xs font-bold tracking-widest text-red-400 uppercase">Risk Event of the Day</div>
            <div className="text-sm text-white font-semibold mt-0.5">Canada CPI Release</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-mono text-neutral-500">14:00 EDT</div>
            <div className="text-[10px] font-mono text-neutral-600">High Impact</div>
          </div>
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            className={"text-neutral-500 transition-transform duration-200 " + (open ? "rotate-180" : "")}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: "#FF3B3B22", background: "#0A0A0A" }}>
          <p className="text-xs text-neutral-400 leading-relaxed mb-3">
            Canada&apos;s Consumer Price Index is the Bank of Canada&apos;s primary inflation gauge. Markets expect 3.1% YoY
            for April 2026. A print above 3.5% would signal inflation re-acceleration, likely crushing rate cut
            expectations and triggering risk-off across equities and crypto.
          </p>
          <div className="rounded-lg p-3 border" style={{ background: "#1A0A0A", borderColor: "#FF3B3B44" }}>
            <div className="text-[10px] font-bold tracking-widest text-red-400 uppercase mb-1">Trading Implication</div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              CAD expected to spike on hot print. NQ and ES both vulnerable to sell-off if print exceeds 3.4%.
              Watch for immediate reaction in the first 15 minutes post-release at 14:30 EDT.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarketDashboard() {
  const [time, setTime] = useState("");
  const [path, setPath] = useState("/");
  useEffect(() => {
    setPath(window.location.pathname);
    const update = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit", minute: "2-digit", second: "2-digit",
          timeZone: "America/New_York", hour12: false,
        }).format(now) + " EDT"
      );
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: "#000000" }}>
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10" style={{ background: "#0A0A0A" }}>
          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="3" stroke="#BFFF00" strokeWidth="1.5"/>
              <path d="M7 13l4-4 4 4 6-6" stroke="#BFFF00" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-white font-bold tracking-tight text-sm">MACRO</span>
            <span className="text-lime-400 font-bold tracking-tight text-sm">TRADING</span>
            <span className="text-[10px] font-mono text-neutral-600 ml-1">v2.0</span>
          </div>
          <div className="flex items-center gap-5">
            <LiveBadge />
            <span className="text-xs font-mono text-neutral-500">{time}</span>
            <span className="text-xs font-mono text-neutral-500">May 19, 2026</span>
          </div>
        </header>

      <main className="grid grid-cols-3 gap-5 p-6 max-w-[1600px] mx-auto">
        {/* Column 1: Calendar */}
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
              {[{ label: "Forecast", value: "3.1%", accent: false }, { label: "Previous", value: "2.4%", accent: false }, { label: "Impact", value: "HIGH", accent: true }].map(({ label, value, accent }) => (
                <div key={label} className="rounded-lg p-2 text-center" style={{ background: "#000" }}>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">{label}</div>
                  <div className={"text-sm font-mono font-bold " + (accent ? "text-red-400" : "text-white")}>{value}</div>
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
              {ECONOMIC_EVENTS.map((evt, i) => <ExpandableEventCard key={i} event={evt} />)}
            </div>
          </div>

          <div className="rounded-xl p-4 border border-white/10" style={{ background: "#111112" }}>
            <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-3">Market Bias</div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-white font-semibold">NQ Short-Term</span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">BULLISH</span>
            </div>
            <div className="text-[11px] text-neutral-500 leading-relaxed">
              Price pressing fresh highs near 29,782 resistance. All moving averages in bullish stack. Next support at 27,315.50.
            </div>
          </div>
        </section>

        {/* Column 2: Price Levels */}
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

        {/* Column 3: Scenarios */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BFFF00" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h2 className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Scenario Grid</h2>
          </div>
          <ExpandableRiskAlert />
          <div className="flex flex-col gap-3">
            {SCENARIOS.map((s, i) => <ScenarioCard key={i} scenario={s} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
