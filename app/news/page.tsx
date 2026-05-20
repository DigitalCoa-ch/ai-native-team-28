"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { NewsItem, MarketPrediction, NewsApiResponse } from "@/types/news";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }

const SRC_COLORS: Record<string,string> = {
  "Reuters Business":"#FF8000","CNBC":"#005594","Bloomberg Markets":"#4C9F3C",
  "Financial Times":"#FFF0E0","BBC Business":"#BB1919","Wall Street Journal":"#0275A4",
  "MarketWatch":"#64B32C","Investopedia":"#7E3699",
};

function SentimentBar({ score }: { score: number }) {
  const pct = clamp((score + 100) / 2, 0, 100);
  const col = score > 10 ? "#BFFF00" : score < -10 ? "#FF3B3B" : "#6B7280";
  return (
    <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: col }} />
    </div>
  );
}

function PredCard({ p }: { p: MarketPrediction }) {
  const DIR: Record<string,{text:string;arrow:string;badgeBg:string;badgeText:string;confColor:string}> = {
    bullish:  { text:"text-lime-400",   arrow:"↗", badgeBg:"bg-lime-400/10",   badgeText:"text-lime-400",   confColor:"#BFFF00" },
    bearish:  { text:"text-red-400",    arrow:"↘", badgeBg:"bg-red-400/10",    badgeText:"text-red-400",   confColor:"#FF3B3B" },
    volatile: { text:"text-amber-400",  arrow:"↕", badgeBg:"bg-amber-400/10", badgeText:"text-amber-400", confColor:"#FFB800" },
    neutral:  { text:"text-neutral-400",arrow:"→", badgeBg:"bg-neutral-400/10",badgeText:"text-neutral-400",confColor:"#9CA3AF" },
  };
  const c = DIR[p.direction] ?? DIR.neutral;
  return (
    <div className="rounded-xl border-l-4 p-4 bg-[#111112]" style={{ borderLeftColor: c.confColor + "66" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-lg ${c.text}`}>{c.arrow}</span>
          <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${c.badgeBg} ${c.badgeText}`}>{p.direction}</span>
          <span className="text-[10px] font-mono text-neutral-500 ml-1">{p.timeframe}</span>
        </div>
        <span className="text-[10px] font-mono text-neutral-600">{timeAgo(p.timestamp)}</span>
      </div>
      <h3 className={`text-sm font-bold mb-2 ${c.text}`}>{p.headline}</h3>
      <p className="text-xs text-neutral-400 leading-relaxed mb-4">{p.reasoning}</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Confidence</div>
          <div className="text-sm font-mono font-bold" style={{ color: c.confColor }}>{p.confidence.toFixed(0)}%</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Assets</div>
          <div className="text-sm font-mono text-white">{p.affectedAssets.slice(0,2).join(", ")}</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Sources</div>
          <div className="text-sm font-mono text-neutral-400">{p.newsSources.length}</div>
        </div>
      </div>
      {p.sectorImpact.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {p.sectorImpact.map((s,i) => (
            <span key={i} className={`text-[10px] font-mono px-2 py-1 rounded ${
              s.impact === "positive" ? "bg-emerald-400/10 text-emerald-400"
              : s.impact === "negative" ? "bg-red-400/10 text-red-400"
              : "bg-neutral-700/50 text-neutral-400"}`}>{s.sector}</span>
          ))}
        </div>
      )}
      <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-x-3 gap-y-1">
        <span className="text-[10px] text-neutral-600">src:</span>
        {p.newsSources.map(s => <span key={s} className="text-[10px] font-mono text-neutral-500">{s}</span>)}
      </div>
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const sent = item.sentiment === "bullish" ? "text-lime-400" : item.sentiment === "bearish" ? "text-red-400" : "text-neutral-400";
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
      <div className="flex items-start gap-3 mb-2">
        <div className="flex-shrink-0">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill={(SRC_COLORS[item.source] ?? "#888") + "22"} />
            <text x="14" y="18" textAnchor="middle" fontSize="9" fontWeight="800" fill={SRC_COLORS[item.source] ?? "#888"} fontFamily="monospace">
              {item.sourceLogo || item.source.slice(0,3).toUpperCase()}
            </text>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-neutral-500">{item.source}</span>
            <span className="text-[10px] font-mono text-neutral-700">{timeAgo(item.publishedAt)}</span>
          </div>
          <h4 className="text-sm font-semibold text-white group-hover:text-lime-400 transition-colors leading-snug line-clamp-2">{item.title}</h4>
        </div>
        <div className={`text-[11px] font-mono font-bold flex-shrink-0 mt-0.5 ${sent}`}>
          {item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore}
        </div>
      </div>
      {item.summary && <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-2 ml-9">{item.summary}</p>}
      <div className="ml-9"><SentimentBar score={item.sentimentScore} /></div>
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 ml-9">
          {item.tags.slice(0,3).map(tag => (
            <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-neutral-600">{tag}</span>
          ))}
        </div>
      )}
    </a>
  );
}

function SrcDot({ status, count, name }: { status: string; count: number; name: string }) {
  const dot = status === "ok" ? "bg-emerald-400" : status === "partial" ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{name.split(" ")[0]}</span>
      <span className="text-neutral-700">{count > 0 ? count : "—"}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1,2,3,4,5].map(i => <div key={i} className="h-18 bg-neutral-900 rounded-xl" />)}
    </div>
  );
}

export default function NewsPage() {
  const [data, setData]    = useState<NewsApiResponse | null>(null);
  const [loading, setLoad] = useState(true);
  const [err, setErr]      = useState<string|null>(null);
  const [filter, setFilter] = useState<"all"|"bullish"|"bearish"|"neutral">("all");
  const [lastUp, setLastUp] = useState("");

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/news?limit=50");
      if (!r.ok) throw new Error(`${r.status}`);
      const json: NewsApiResponse = await r.json();
      setData(json);
      setLastUp(new Date().toLocaleTimeString());
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "fetch failed");
    } finally {
      setLoad(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    const t = setInterval(refresh, 300000);
    return () => clearInterval(t);
  }, [refresh]);

  const counts = data?.news ? {
    all: data.news.length,
    bullish: data.news.filter(n => n.sentiment === "bullish").length,
    bearish: data.news.filter(n => n.sentiment === "bearish").length,
    neutral: data.news.filter(n => n.sentiment === "neutral").length,
  } : { all:0, bullish:0, bearish:0, neutral:0 };

  const shown = data?.news ? data.news.filter(n => filter === "all" || n.sentiment === filter) : [];

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="3" stroke="#BFFF00" strokeWidth="1.5"/>
            <path d="M7 13l4-4 4 4 6-6" stroke="#BFFF00" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-white font-bold tracking-tight text-lg">MACRO</span>
          <span className="text-lime-400 font-bold tracking-tight text-lg">INTELLIGENCE</span>
          <span className="text-[10px] font-mono text-neutral-600 ml-1">v2.0</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
            LIVE
          </span>
          {lastUp && <span className="text-xs font-mono text-neutral-600">Updated {lastUp}</span>}
          <button onClick={refresh} className="text-xs font-mono text-neutral-400 hover:text-lime-400 transition-colors px-3 py-1 rounded border border-white/10 hover:border-lime-400/40">
            ↻ Refresh
          </button>
        </div>
      </header>

      {err && (
        <div className="mx-6 mt-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono">
          Error: {err} — showing demo data
        </div>
      )}

      <div className="grid grid-cols-12 gap-5 p-6 max-w-[1900px] mx-auto">

        {/* LEFT: Predictions col-span-4 */}
        <section className="col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BFFF00" strokeWidth="2">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
            <h2 className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Market Predictions</h2>
          </div>

          {loading ? <Skeleton /> : data?.predictions?.length ? (
            data.predictions.map(p => <PredCard key={p.id} p={p} />)
          ) : (
            <div className="rounded-xl p-8 border border-white/10 bg-[#111112] text-center">
              <div className="text-3xl mb-3">📡</div>
              <p className="text-sm text-neutral-500">Analyzing news flow…</p>
              <p className="text-xs text-neutral-700 mt-1">Predictions load after first fetch</p>
            </div>
          )}

          <div className="rounded-xl p-4 border border-white/10 bg-[#111112]">
            <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-3">Feed Status</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {data?.sources.map(s => <SrcDot key={s.name} status={s.status} count={s.itemCount} name={s.name} />)}
            </div>
          </div>

          {data?.news && data.news.length > 0 && (
            <div className="rounded-xl p-4 border border-white/10 bg-[#111112]">
              <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-3">Sentiment Mix</div>
              <div className="space-y-2">
                {(["bullish","bearish","neutral"] as const).map(s => {
                  const n = counts[s];
                  const pct = data.news.length ? (n / data.news.length) * 100 : 0;
                  const col = s === "bullish" ? "#BFFF00" : s === "bearish" ? "#FF3B3B" : "#6B7280";
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-neutral-500 w-16 capitalize">{s}</span>
                      <div className="flex-1 h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${pct}%`, background:col }} />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 w-8 text-right">{n}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* RIGHT: News feed col-span-8 */}
        <section className="col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BFFF00" strokeWidth="2">
                <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/>
              </svg>
              <h2 className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                News Feed {data ? `(${shown.length} items)` : ""}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {(["all","bullish","bearish","neutral"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[10px] font-mono px-3 py-1 rounded uppercase tracking-wider transition-colors ${
                    filter === f
                      ? f === "bullish" ? "bg-lime-400/20 text-lime-400"
                      : f === "bearish" ? "bg-red-400/20 text-red-400"
                      : "bg-white/10 text-white"
                      : "bg-neutral-900 text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {f} {data ? (`(${counts[f as keyof typeof counts]})`) : ""}
                </button>
              ))}
            </div>
          </div>

          {loading ? <Skeleton /> : shown.length > 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#111112] overflow-hidden">
              <div className="divide-y divide-white/5">
                {shown.map(item => <NewsCard key={item.id} item={item} />)}
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-12 border border-white/10 bg-[#111112] text-center">
              <div className="text-3xl mb-3">📰</div>
              <p className="text-sm text-neutral-500">No news matching filter</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
