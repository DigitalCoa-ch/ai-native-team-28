"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface EconHotspot {
  lat: number;
  lng: number;
  name: string;
  country: string;
  eventCount: number;
  events: string[];
}

const ECON_HOTSPOTS: EconHotspot[] = [
  { lat: 40.71,  lng: -74.01,  name: "New York",     country: "US",     eventCount: 87,  events: ["Fed policy","NYSE trading","US CPI","Payrolls","FOMC"] },
  { lat: 51.51,  lng: -0.13,   name: "London",       country: "UK",     eventCount: 72,  events: ["BOE policy","FTSE trading","UK GDP","Brexit updates","PMI"] },
  { lat: 35.68,  lng: 139.69,  name: "Tokyo",         country: "Japan",  eventCount: 61,  events: ["BOJ policy","Nikkei trading","CPI","Trade data","Tankan"] },
  { lat: 22.32,  lng: 114.17,  name: "Hong Kong",    country: "China",  eventCount: 78,  events: ["PMI","Trade data","PBOC","HSI trading","Property data"] },
  { lat: 50.11,  lng: 8.68,    name: "Frankfurt",    country: "Germany",eventCount: 55,  events: ["ECB policy","German CPI","IFO","Manufacturing","ZEW"] },
  { lat: 43.65,  lng: -79.38,  name: "Toronto",       country: "Canada", eventCount: 48,  events: ["BOC policy","CPI","Jobs report","Housing data","GDP"] },
  { lat: -33.87, lng: 151.21,  name: "Sydney",        country: "Australia",eventCount:44, events: ["RBA policy","CPI","Jobs data","Trade balance","Consumer sentiment"] },
  { lat: 1.35,   lng: 103.82,  name: "Singapore",    country: "Singapore",eventCount:52, events: ["MAS policy","Trade data","GDP","Electronics sector","Property"] },
  { lat: 31.23,  lng: 121.47,  name: "Shanghai",     country: "China",  eventCount: 65,  events: ["PBOC","CPI","PMI","Trade","Industrial output"] },
  { lat: 25.20,  lng: 55.27,   name: "Dubai",         country: "UAE",    eventCount: 38,  events: ["OPEC","GDP","PMI","Trade hub data","Real estate"] },
  { lat: -23.55, lng: -46.63,  name: "São Paulo",    country: "Brazil",  eventCount: 42,  events: ["BCB policy","CPI","GDP","Real","Commodities"] },
  { lat: 19.08,  lng: 72.88,   name: "Mumbai",        country: "India",  eventCount: 51,  events: ["RBI policy","CPI","PMI","Trade","IT sector earnings"] },
  { lat: 48.86,  lng: 2.35,    name: "Paris",         country: "France", eventCount: 49,  events: ["ECB","French CPI","PMI","Consumer spending","Unemployment"] },
  { lat: 41.88,  lng: -87.63,  name: "Chicago",      country: "US",     eventCount: 58,  events: ["CME futures","GDP","Chicago Fed","Manufacturing","Payrolls"] },
  { lat: 37.57,  lng: 126.98,  name: "Seoul",         country: "South Korea",eventCount:47, events: ["BOK policy","CPI","Exports","Tech sector","KOSPI"] },
  { lat: 59.33,  lng: 18.07,   name: "Stockholm",     country: "Sweden",  eventCount: 35,  events: ["Riksbank","CPI","GDP","Trade","Manufacturing"] },
  { lat: 52.37,  lng: 4.90,    name: "Amsterdam",     country: "Netherlands",eventCount:40, events: ["ECB","Dutch CPI","Trade","ASML","Shell"] },
  { lat: 55.75,  lng: 37.62,   name: "Moscow",        country: "Russia",  eventCount: 31,  events: ["CBR policy","CPI","Oil","Gas","Sanctions impact"] },
  { lat: 25.77,  lng: -80.19,  name: "Miami",         country: "US",     eventCount: 33,  events: ["Fed',' tourism data","Housing","Retail","Latin America exposure"] },
  { lat: 41.87,  lng: -87.63,  name: "Dallas",        country: "US",     eventCount: 29,  events: ["Dallas Fed","Energy sector","Manufacturing","Housing","Trade"] },
];

function heatColor(count: number): string {
  // Blue (cold/low) → Yellow → Orange → Red (hot/high)
  const max = 90;
  const t = Math.min(count / max, 1);
  if (t < 0.33) {
    // blue to cyan
    const r = Math.round(0 + t * 3 * 0);
    const g = Math.round(100 + t * 3 * 155);
    const b = Math.round(220 + t * 3 * 35);
    return `rgb(${r},${g},${b})`;
  } else if (t < 0.66) {
    // cyan to yellow/orange
    const r = Math.round(0 + (t - 0.33) * 3 * 255);
    const g = Math.round(255 + (t - 0.33) * 3 * 55);
    const b = Math.round(185 + (t - 0.33) * 3 * (-185));
    return `rgb(${r},${g},${b})`;
  } else {
    // orange to red
    const r = 255;
    const g = Math.round(255 - (t - 0.66) * 3 * 180);
    const b = 0;
    return `rgb(${r},${g},${b})`;
  }
}

function pointSize(count: number): number {
  return Math.max(0.3, Math.min(2.5, count / 30));
}

interface GlobeProps {
  onHotspotClick?: (hotspot: EconHotspot) => void;
}

export default function GlobeComponent({ onHotspotClick }: GlobeProps) {
  const globeRef = useRef<unknown>(null);
  const [loaded, setLoaded] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    setLoaded(true);
    if (globeRef.current) {
      const g = globeRef.current as {
        controls: () => { autoRotate: boolean; };
        pointOfView: (p: { lat: number; lng: number; altitude: number }) => void;
      };
      g.controls().autoRotate = true;
    }
  }, []);

  const handleHover = (d: any) => {
    if (d) {
      setTooltipContent(`${d.name}, ${d.country}: ${d.eventCount} events/wk`);
    } else {
      setTooltipContent("");
    }
  };

  const handleClick = (d: any) => {
    if (onHotspotClick) onHotspotClick(d);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {loaded && (
        <Globe
          ref={globeRef as any}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={ECON_HOTSPOTS as any}
          pointLat="lat"
          pointLng="lng"
          pointRadius="eventCount"
          pointColor={(d: any) => heatColor(d.eventCount)}
          pointAltitude={0.05}
          pointLabel={(d: any) =>
            `<div style="font-family:monospace;font-size:12px;background:rgba(0,0,0,0.85);padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
              <div style="color:#BFFF00;font-weight:bold;margin-bottom:4px;">${d.name}, ${d.country}</div>
              <div style="color:white;">Economic Events: <strong style="color:#BFFF00">${d.eventCount}/week</strong></div>
              <div style="color:#9CA3AF;margin-top:4px;">${d.events.slice(0,3).join(", ")}</div>
            </div>`
          }
          onPointHover={handleHover as any}
          onPointClick={handleClick as any}
          atmosphereColor="rgba(100, 200, 255, 0.15)"
          atmosphereAltitude={0.25}
        />
      )}

      {/* Tooltip overlay */}
      {tooltipContent && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(191,255,0,0.3)",
            borderRadius: 8,
            padding: "8px 16px",
            fontFamily: "monospace",
            fontSize: 12,
            color: "#BFFF00",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {tooltipContent}
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          background: "rgba(0,0,0,0.7)",
          borderRadius: 8,
          padding: "10px 14px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ fontFamily: "monospace", fontSize: 9, color: "#6B7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Economic Activity
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "#3B82F6" }}>LOW</span>
          <div style={{ width: 80, height: 8, borderRadius: 4, background: "linear-gradient(to right, #3B82F6, #06B6D4, #F59E0B, #EF4444)" }} />
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "#EF4444" }}>HIGH</span>
        </div>
      </div>
    </div>
  );
}