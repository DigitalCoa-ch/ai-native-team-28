"use client";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [path, setPath] = useState("/about");
  useEffect(() => { setPath(window.location.pathname); }, []);
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: "#000000" }}>
      <div className="sticky top-0 z-50"></div>
      <main className="flex-1 px-6 py-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">&#x2139;</span>
          <div>
            <h1 className="text-2xl font-bold text-white">About</h1>
            <p className="text-sm text-neutral-500 mt-1">Macro Trading Dashboard — AI Native Team 28</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border p-6" style={{ background: "#111112", borderColor: "#BFFF0033" }}>
            <h2 className="text-lg font-bold text-lime-400 mb-3">What Is This?</h2>
            <p className="text-sm text-neutral-400 leading-relaxed mb-3">Macro Trading Dashboard is an AI-built real-time trading intelligence tool designed for futures traders. It combines a live economic calendar, session price boundaries, and scenario-based trade planning into a single premium interface.</p>
            <p className="text-sm text-neutral-400 leading-relaxed">Built by CPGC AI Native Team 28 as a demonstration of AI-native development workflows, powered by OpenClaw and deployed on Vercel.</p>
          </div>
          <div className="rounded-xl border p-6" style={{ background: "#111112", borderColor: "#00E5FF33" }}>
            <h2 className="text-lg font-bold text-white mb-3">Data Sources</h2>
            <div className="flex flex-col gap-2">
              {[
                ["Economic Calendar", "Investing.com real-time streaming calendar"],
                ["NQ Levels", "ATS AlphaWebTrader weekly chart analysis (May 18, 2026)"],
                ["ES Levels", "Derived from session context and broad market data"],
                ["Price Data", "15-minute delayed futures data (Barchart / CME)"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start gap-2">
                  <span className="text-[10px] font-mono text-neutral-500 min-w-[120px] mt-0.5">{k}</span>
                  <span className="text-xs text-neutral-300">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border p-6" style={{ background: "#111112", borderColor: "#FF3B3B33" }}>
            <h2 className="text-lg font-bold text-white mb-3">Disclaimer</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">This dashboard is for informational and educational purposes only. All content is AI-generated. Trading futures and financial instruments involves substantial risk of loss. Not financial advice. Past performance does not guarantee future results.</p>
          </div>
          <div className="rounded-xl border p-6" style={{ background: "#111112", borderColor: "#BFFF0033" }}>
            <h2 className="text-lg font-bold text-white mb-3">Stack</h2>
            <div className="flex flex-col gap-2">
              {["Next.js 16 (App Router)", "Tailwind CSS v4", "TypeScript", "React 19 (Client Components)", "Vercel Deployment", "OpenClaw Agent"].map((tech) => (
                <div key={tech} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 inline-block"/>
                  <span className="text-sm text-neutral-300">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
