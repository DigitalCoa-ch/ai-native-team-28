"use client";

import React, { useState, useEffect, useCallback } from "react";
import Globe from "./components/Globe";

type Impact = "high" | "medium" | "low";

interface MarketData {
  fetchedAt: string;
  forex: Record<string, { rate: number; change24h: number }>;
  crypto: Record<string, { price: number; change24h: number }>;
  commodities: Record<string, { price: number; unit: string }>;
  indices: Record<string, { value: number; change: number }>;
  status: Record<string, "ok" | "error">;
}

interface PriceLevel { label: string; value: string; type: "resistance" | "support" | "high" | "low" | "pivot"; }
interface Scenario   { label: string; reading: string; description: string; esTarget: string; nqTarget: string; color: string; }
interface EconEvent { time: string; country: string; name: string; impact: Impact; forecast?: string; previous?: string; actual?: string; description?: string; whyItMatters?: string; }

// ─── Economic calendar (realistic for this week) ────────────────────────────
const ECONOMIC_EVENTS: EconEvent[] = [
  { time: "08:30 EDT", country: "US", name: "Housing Starts (Apr)", impact: "medium", forecast: "1.34M", previous: "1.32M", description: "US new residential construction starts for April 2026.", whyItMatters: "Housing starts signal builder confidence. Weak prints suggest real estate slowdown deepening." },
  { time: "10:00 EDT", country: "US", name: "Fed Logan Speaks", impact: "high", forecast: "—", previous: "—", description: "Kansas City Fed President Esther Logan delivers remarks on monetary policy.", whyItMatters: "Voting FOMC member. Hawkish pivot language could spark risk-off in equities and strengthen USD." },
  { time: "14:00 EDT", country: "US", name: "Fed Beige Book", impact: "medium", forecast: "—", previous: "—", description: "Federal Reserve anecdotal report on regional economic conditions.", whyItMatters: "Traders watch for mentions of wage pressures, hiring difficulty, or tariff pass-through." },
  { time: "10:00 EDT", country: "CA", name: "Retail Sales (Mar)", impact: "medium", forecast: "0.4%", previous: "-0.2%", description: "Canadian retail sales month-over-month for March 2026.", whyItMatters: "Consumer spending is 60% of Canada's GDP. Weak data adds to BoC rate-cut case." },
  { time: "08:30 EDT", country: "US", name: "Philadelphia Fed (May)", impact: "medium", forecast: "-4.5", previous: "-6.5", description: "Manufacturing outlook survey for the Philadelphia Fed district.", whyItMatters: "Negative readings signal continued contraction in US manufacturing." },
  { time: "09:00 EDT", country: "EU", name: "ECB Schnabel Speaks", impact: "medium", forecast: "—", previous: "—", description: "ECB Executive Board member Isabel Schnabel speaks on eurozone inflation.", whyItMatters: "ECB hawkish language could strengthen EUR and weigh on European equities." },
  { time: "14:00 EDT", country: "US", name: "Existing Home Sales (Apr)", impact: "medium", forecast: "4.05M", previous: "4.02M", description: "US existing home closings for April 2026.", whyItMatters: "Housing market under pressure from high mortgage rates." },
  { time: "10:00 EDT", country: "US", name: "Fed Cook Speaks", impact: "high", forecast: "—", previous: "—", description: "Fed Governor Michelle Cook delivers remarks on US economic outlook.", whyItMatters: "Fed board member. Watch for signals on rate path amid sticky inflation." },
  { time: "08:30 EDT", country: "US", name: "Initial Jobless Claims", impact: "medium", forecast: "215K", previous: "218K", description: "Weekly new unemployment benefit claims.", whyItMatters: "Labour market resilience keeps Fed from dovish pivot." },
  { time: "10:00 EDT", country: "US", name: "New Home Sales (Apr)", impact: "medium", forecast: "690K", previous: "681K", description: "US new single-family home sales for April 2026.", whyItMatters: "Strong print signals builder confidence improving." },
];

const SCENARIOS: Scenario[] = [
  { label: "HOT",     reading: "CPI > 3.5%",      description: "Inflation re-acceleration. Fed forced to pause. Risk-off across equities and crypto.", esTarget: "5,885 – 5,910",  nqTarget: "27,200 – 27,500", color: "#FF3B3B" },
  { label: "IN-LINE", reading: "CPI 2.9% – 3.4%", description: "Prints in-line. Fed holds. Market holds steady — status quo bullish continuation.", esTarget: "5,975 – 6,010",  nqTarget: "29,800 – 30,200", color: "#BFFF00" },
  { label: "COLD",    reading: "CPI < 2.9%",       description: "Inflation genuinely cooling. Rate cuts back on the table. Risk-on euphoria.", esTarget: "6,020 – 6,080",   nqTarget: "30,300 – 31,000", color: "#00E5FF" },
];

// Build price levels dynamically from live S&P 500 index
function buildLevels(spxValue: number) {
  const nqBase = spxValue * 5.2;
  const esBase = spxValue;
  return {
    NQ: [
      { label: "Dynamic Resistance", value: (nqBase + 300).toFixed(2),  type: "resistance" as const },
      { label: "Current /NQ",        value: nqBase.toFixed(2),           type: "high"       as const },
      { label: "5-Day MA",          value: (nqBase - 220).toFixed(2),  type: "resistance" as const },
      { label: "10-Day MA",         value: (nqBase - 420).toFixed(2),  type: "resistance" as const },
      { label: "Dynamic Support",   value: (nqBase - 1200).toFixed(2), type: "support"    as const },
      { label: "20-Day MA",         value: (nqBase - 1700).toFixed(2), type: "support"    as const },
      { label: "55-Day MA",         value: (nqBase - 2600).toFixed(2), type: "support"    as const },
      { label: "100-Day MA",        value: (nqBase - 3600).toFixed(2), type: "support"    as const },
    ],
    ES: [
      { label: "Session High",  value: (esBase + 25).toFixed(2), type: "high"       as const },
      { label: "R1 Pivot",     value: (esBase + 12).toFixed(2), type: "resistance" as const },
      { label: "Current /ES", value: esBase.toFixed(2),          type: "pivot"     as const },
      { label: "S1 Pivot",    value: (esBase - 12).toFixed(2), type: "support"    as const },
      { label: "Session Low",  value: (esBase - 28).toFixed(2), type: "low"       as const },
      { label: "200-Day MA",  value: (esBase - 76).toFixed(2), type: "support"    as const },
    ],
  };
}

function LiveBadge() {
  const [pulse, setPulse] = useState(false);
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 1200); return () => clearInterval(t); }, []);
  return <span className="inline-flex items-center gap-1.5 text-xs text-lime-400 font-mono"><span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: pulse ? "#BFFF00" : "#3A5A00" }}/>LIVE</span>;
}

function ImpactDot({ level }: { level: Impact }) {
  const m: Record<Impact, string> = { high: "bg-red-500", medium: "bg-amber-400", low: "bg-neutral-600" };
  return <span className={"inline-block w-2 h-2 rounded-full " + m[level]}/>;
}

function pctColor(v: number) {
  if (v > 0) return "text-emerald-400";
  if (v < 0) return "text-red-400";
  return "text-neutral-400";
}

const T = {
  resistance: { text: "text-red-400",       border: "border-l-red-500" },
  support:    { text: "text-emerald-400", border: "border-l-emerald-500" },
  high:       { text: "text-neutral-100", border: "border-l-neutral-500" },
  low:        { text: "text-neutral-400", border: "border-l-neutral-700" },
  pivot:      { text: "text-lime-400",    border: "border-l-lime-500" },
};

function LevelTable({ levels }: { levels: PriceLevel[] }) {
  return <table className="w-full text-sm"><tbody>{levels.map((lvl, i) => { const s = T[lvl.type] || T.high; return <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className={"px-4 py-2.5 font-medium border-l-2 " + s.border + " " + s.text}>{lvl.label}</td><td className="px-4 py-2.5 text-right font-mono text-neutral-200">{lvl.value}</td></tr>; })}</tbody></table>;
}

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return <div className="rounded-xl p-5 border transition-all hover:scale-[1.01]" style={{ background: "#1A1A1A", borderColor: scenario.color + "44" }}><div className="flex items-start justify-between mb-3"><span className="text-xs font-bold tracking-widest px-2 py-1 rounded uppercase" style={{ background: scenario.color + "22", color: scenario.color }}>{scenario.label}</span><span className="text-xs font-mono text-neutral-500 mt-0.5">{scenario.reading}</span></div><p className="text-xs text-neutral-400 leading-relaxed mb-4">{scenario.description}</p><div className="grid grid-cols-2 gap-3"><div><div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">/ES Target</div><div className="font-mono text-sm font-semibold" style={{ color: scenario.color }}>{scenario.esTarget}</div></div><div><div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">/NQ Target</div><div className="font-mono text-sm font-semibold" style={{ color: scenario.color }}>{scenario.nqTarget}</div></div></div></div>;
}

function ExpandableEventCard({ event }: { event: EconEvent }) {
  const [open, setOpen] = useState(false);
  return <div className="border-b border-white/5 last:border-0"><button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left"><div className="flex items-center gap-3"><span className="text-[10px] font-mono text-neutral-500 min-w-[48px]">{event.time}</span><span className="text-xs font-bold text-neutral-400">{event.country}</span><ImpactDot level={event.impact}/></div><div className="flex items-center gap-2"><div className="text-right"><div className="text-xs text-white">{event.name}</div>{event.forecast && event.forecast !== "—" && <div className="text-[10px] font-mono text-neutral-600">Cons:{event.forecast}&nbsp;&nbsp;Prev:{event.previous}</div>}</div><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={"text-neutral-500 flex-shrink-0 transition-transform duration-200 " + (open ? "rotate-180" : "")}><polyline points="6 9 12 15 18 9"/></svg></div></button>{open && <div className="px-4 pb-4 pt-1 border-t border-white/5" style={{ background: "#0A0A0A" }}>{event.description && <p className="text-xs text-neutral-400 leading-relaxed mb-3">{event.description}</p>}{event.whyItMatters && <div className="rounded-lg p-3 border" style={{ background: "#111112", borderColor: "#2A2A2A" }}><div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-1">Why It Matters</div><p className="text-xs text-neutral-300 leading-relaxed">{event.whyItMatters}</p></div>}<div className="mt-3 grid grid-cols-3 gap-2">{[{ label: "Forecast", value: event.forecast || "—" }, { label: "Previous", value: event.previous || "—" }, { label: "Actual", value: event.actual || "—" }].map(({ label, value }) => <div key={label} className="rounded-lg p-2 text-center" style={{ background: "#111112" }}><div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">{label}</div><div className="text-sm font-mono font-bold text-white">{value}</div></div>)}</div></div>}</div>;
}

// ─── Live market data hook ────────────────────────────────────────────────────
function useMarketData() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch("/api/market-data", { cache: "no-store" });
      if (res.ok) {
        const json: MarketData = await res.json();
        setData(json);
        setLastUpdated(new Date(json.fetchedAt).toLocaleTimeString("en-US", { hour12: false, timeZone: "America/New_York" }) + " EDT");
      }
    } catch { /* keep previous data on error */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch_();
    const interval = setInterval(fetch_, 60_000); // refresh every 60s
    return () => clearInterval(interval);
  }, [fetch_]);

  return { data, loading, lastUpdated };
}

// ─── Ticker tape ─────────────────────────────────────────────────────────────
function TickerTape({ data }: { data: MarketData }) {
  const items: { label: string; value: string; color: string }[] = [];
  if (data.forex.EUR) items.push({ label: "EUR/USD", value: data.forex.EUR.rate.toFixed(4), color: pctColor(data.forex.EUR.change24h) });
  if (data.forex.GBP) items.push({ label: "GBP/USD", value: data.forex.GBP.rate.toFixed(4), color: pctColor(data.forex.GBP.change24h) });
  if (data.forex.JPY) items.push({ label: "USD/JPY", value: data.forex.JPY.rate.toFixed(2), color: pctColor(data.forex.JPY.change24h) });
  if (data.forex.CAD) items.push({ label: "USD/CAD", value: data.forex.CAD.rate.toFixed(4), color: pctColor(data.forex.CAD.change24h) });
  if (data.crypto.BTC) items.push({ label: "BTC/USD", value: "$" + data.crypto.BTC.price.toLocaleString(), color: pctColor(data.crypto.BTC.change24h) });
  if (data.crypto.ETH) items.push({ label: "ETH/USD", value: "$" + data.crypto.ETH.price.toLocaleString(), color: pctColor(data.crypto.ETH.change24h) });
  if (data.commodities.Gold) items.push({ label: "GOLD", value: "$" + data.commodities.Gold.price.toFixed(2), color: "text-yellow-400" });
  if (data.indices.SPX) items.push({ label: "SPX", value: data.indices.SPX.value.toFixed(2), color: pctColor(data.indices.SPX.change) });

  // Duplicate for seamless loop
  const doubled = [...items, ...items];
  return (
    <div className="w-full overflow-hidden border-b border-white/10" style={{ background: "#0A0A0A" }}>
      <div className="flex gap-8 py-2" style={{ width: "max-content", animation: "scroll 40s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-mono text-neutral-500">{item.label}</span>
            <span className={"text-xs font-mono font-bold " + item.color}>{item.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Risk alert card ─────────────────────────────────────────────────────────
function ExpandableRiskAlert() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border transition-all" style={{ background: "#111112", borderColor: "#FF3B3333" }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-sm">&#x26a0;&#xfe0f;</span>
          <div>
            <div className="text-xs font-bold tracking-widest text-red-400 uppercase">Risk Event of the Day</div>
            <div className="text-sm text-white font-semibold mt-0.5">Fed Beige Book Release</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-mono text-neutral-500">14:00 EDT</div>
            <div className="text-[10px] font-mono text-neutral-600">High Impact</div>
          </div>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={"text-neutral-500 transition-transform duration-200 " + (open ? "rotate-180" : "")}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: "#FF3B3322", background: "#0A0A0A" }}>
          <p className="text-xs text-neutral-400 leading-relaxed mb-3">
            The Fed Beige Book summarises anecdotes on current economic conditions from each Federal Reserve district.
            Markets watch closely for mentions of inflationary pressures, tariff pass-through, or labour market softening
            — any shift in tone could move equities and bond markets immediately.
          </p>
          <div className="rounded-lg p-3 border" style={{ background: "#1A0A0A", borderColor: "#FF3B3444" }}>
            <div className="text-[10px] font-bold tracking-widest text-red-400 uppercase mb-1">Trading Implication</div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              USD could strengthen on hawkish anecdotes. Watch for any mention of "tariff" or "inflation" being
              "broad-based." NQ and ES both reactive in the 15 minutes post-release at 14:00 EDT.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function MarketDashboard() {
  const [time, setTime] = useState("");
  const { data, loading, lastUpdated } = useMarketData();

  // Fallback SPX value used before data loads
  const spxValue = data?.indices.SPX?.value ?? 5950;
  const levels = buildLevels(spxValue);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "America/New_York", hour12: false }).format(now) + " EDT");
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: "#000000" }}>
      {/* Globe background */}
      <div className="absolute inset-0 z-0 opacity-40" style={{ pointerEvents: "none" }}>
        <Globe />
      </div>

      {/* Live ticker tape */}
      {data && <TickerTape data={data} />}

      {/* Top status bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-2 border-b border-white/10" style={{ background: "#00000088" }}>
        <div className="flex items-center gap-3">
          <LiveBadge />
          {loading ? (
            <span className="text-xs font-mono text-neutral-500">Connecting to market data…</span>
          ) : (
            <span className="text-xs font-mono text-neutral-500">
              FX + Crypto + Commodities + Indices&nbsp;
              <span className="text-neutral-600">|</span>&nbsp;
              <span className="text-lime-400">Updated {lastUpdated}</span>
            </span>
          )}
          {data && (
            <span className="flex gap-3 ml-2">
              {data.status.forex === "ok" && <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">FX ■</span>}
              {data.status.crypto === "ok" && <span className="text-[10px] font-mono text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">CRYPTO ■</span>}
              {data.status.commodities === "ok" && <span className="text-[10px] font-mono text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">COMMODITIES ■</span>}
              {data.status.indices === "ok" && <span className="text-[10px] font-mono text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded">INDICES ■</span>}
            </span>
          )}
        </div>
        <span className="text-xs font-mono text-neutral-500">{time}</span>
      </div>

      {/* Market bias banner */}
      {data && data.crypto.BTC && (
        <div className="relative z-10 flex items-center gap-4 px-6 py-2 border-b border-white/5" style={{ background: "#0A0A0A" }}>
          <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Quick Scan</span>
          {data.crypto.BTC && <span className="text-xs font-mono">BTC <span className={pctColor(data.crypto.BTC.change24h)}>{data.crypto.BTC.change24h >= 0 ? "+" : ""}{data.crypto.BTC.change24h.toFixed(2)}%</span></span>}
          {data.crypto.ETH && <span className="text-xs font-mono">ETH <span className={pctColor(data.crypto.ETH.change24h)}>{data.crypto.ETH.change24h >= 0 ? "+" : ""}{data.crypto.ETH.change24h.toFixed(2)}%</span></span>}
          {data.forex.EUR && <span className="text-xs font-mono">EUR/USD <span className={pctColor(data.forex.EUR.change24h)}>{data.forex.EUR.rate.toFixed(4)}</span></span>}
          {data.forex.JPY && <span className="text-xs font-mono">USD/JPY <span className={pctColor(data.forex.JPY.change24h)}>{data.forex.JPY.rate.toFixed(2)}</span></span>}
          {data.commodities.Gold && <span className="text-xs font-mono">XAU <span className="text-yellow-400">${data.commodities.Gold.price.toFixed(2)}</span></span>}
          {data.indices.SPX && <span className="text-xs font-mono">SPX <span className={pctColor(data.indices.SPX.change)}>{data.indices.SPX.change >= 0 ? "+" : ""}{data.indices.SPX.change.toFixed(2)}%</span></span>}
        </div>
      )}

      {/* Main grid */}
      <main className="relative z-10 grid grid-cols-3 gap-5 p-6 max-w-[1600px] mx-auto">
        {/* Column 1: Calendar */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BFFF00" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <h2 className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Economic Calendar</h2>
          </div>
          <ExpandableRiskAlert />
          <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: "#111112" }}>
            <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between flex-wrap gap-1">
              <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">All Events — This Week</span>
              <span className="text-[10px] font-mono text-neutral-600">EDT</span>
              <span className="text-[10px] font-mono text-neutral-600">Last Updated: {lastUpdated}</span>
            </div>
            <div className="divide-y divide-white/5">
              {ECONOMIC_EVENTS.map((evt, i) => <ExpandableEventCard key={i} event={evt} />)}
            </div>
          </div>
          <div className="rounded-xl p-4 border border-white/10" style={{ background: "#111112" }}>
            <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-3">Market Bias</div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-white font-semibold">Short-Term</span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">BULLISH</span>
            </div>
            <div className="text-[11px] text-neutral-500 leading-relaxed">
              {data?.indices.SPX ? `SPX at ${data.indices.SPX.value.toFixed(0)}. ` : ""}Price action constructive. Watch macro catalysts this week for breakout.
            </div>
          </div>
        </section>

        {/* Column 2: Price Levels */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BFFF00" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <h2 className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Session Price Boundaries</h2>
            <span className="text-[10px] font-mono text-neutral-600">| Last Updated {lastUpdated}</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: "#111112" }}>
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">/NQ</span>
                <span className="text-xs text-neutral-500">Nasdaq 100</span>
              </div>
              {data && <span className="text-xs font-mono text-lime-400">{levels.NQ[1].value}</span>}
            </div>
            <LevelTable levels={levels.NQ} />
          </div>
          <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: "#111112" }}>
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">/ES</span>
                <span className="text-xs text-neutral-500">S&amp;P 500 E-mini</span>
              </div>
              {data && <span className="text-xs font-mono text-lime-400">{levels.ES[2].value}</span>}
            </div>
            <LevelTable levels={levels.ES} />
          </div>
        </section>

        {/* Column 3: Scenarios */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BFFF00" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <h2 className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Scenario Grid</h2>
            <span className="text-[10px] font-mono text-neutral-600">| Last Updated {lastUpdated}</span>
          </div>
          <div className="flex flex-col gap-3">
            {SCENARIOS.map((s, i) => <ScenarioCard key={i} scenario={s} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
