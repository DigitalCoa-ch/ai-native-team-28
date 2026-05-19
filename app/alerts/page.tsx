"use client";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";

const ACTIVE_ALERTS = [
  { id: 1, time: "14:00 EDT", name: "CA CPI (YoY)", impact: "high", status: "PENDING", note: "Watch 3.1% consensus. Above 3.5% triggers risk-off.", color: "#FF3B3B" },
  { id: 2, time: "14:30 EDT", name: "API Crude Oil Stock", impact: "low", status: "PENDING", note: "-2.188M prev. Large draw lifts energy equities.", color: "#00E5FF" },
  { id: 3, time: "09:45 EDT", name: "Fed Waller Speech", impact: "high", status: "PENDING", note: "Hawkish pivot = USD spike, equities at risk.", color: "#FF3B3B" },
  { id: 4, time: "10:00 EDT", name: "Pending Home Sales", impact: "medium", status: "PENDING", note: "+1.0% exp. Below 0.5% = housing weak.", color: "#BFFF00" },
  { id: 5, time: "12:00 EDT", name: "EIA Natural Gas", impact: "low", status: "PENDING", note: "Storage at 5-yr high. Bearish for /NG.", color: "#00E5FF" },
];

export default function AlertsPage() {
  const [path, setPath] = useState("/alerts");
  useEffect(() => { setPath(window.location.pathname); }, []);
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: "#000000" }}>
      <div className="sticky top-0 z-50"><NavBar currentPath={path} /></div>
      <main className="flex-1 px-6 py-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">&#x1f515;</span>
          <div>
            <h1 className="text-2xl font-bold text-lime-400">Active Alerts</h1>
            <p className="text-sm text-neutral-500 mt-1">Economic events with market-moving potential today (May 19, 2026)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse inline-block"/>
          <span className="text-xs font-mono text-lime-400">5 ACTIVE ALERTS</span>
        </div>
        <div className="flex flex-col gap-3">
          {ACTIVE_ALERTS.map((alert) => (
            <div key={alert.id} className="rounded-xl border p-5 flex items-start gap-4" style={{ background: "#111112", borderColor: alert.color + "33" }}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-neutral-500 min-w-[60px]">{alert.time}</span>
                  <span className="text-sm font-bold text-white">{alert.name}</span>
                  <span className={"text-[10px] font-bold px-2 py-0.5 rounded uppercase " + (alert.impact === "high" ? "bg-red-400/10 text-red-400" : alert.impact === "medium" ? "bg-amber-400/10 text-amber-400" : "bg-neutral-600/10 text-neutral-500")}>{alert.impact}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{ background: alert.color + "22", color: alert.color }}>{alert.status}</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{alert.note}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
