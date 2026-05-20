"use client";

import Link from "next/link";

const NAV_GROUPS = [
  {
    label: "Pages",
    items: [
      { label: "Home",     href: "/",       emoji: "🏠" },
      { label: "News",     href: "/news",   emoji: "📡" },
      { label: "Bullish",  href: "/bullish" },
      { label: "Bearish",  href: "/bearish" },
      { label: "Alerts",   href: "/alerts", badge: "LIVE" },
      { label: "About",     href: "/about",  emoji: "ℹ️"  },
    ],
  },
];

interface NavBarProps {
  currentPath: string;
}

export default function NavBar({ currentPath }: NavBarProps) {
  return (
    <nav className="flex items-center gap-1 px-4 py-2 border-b border-white/10 z-50" style={{ background: "#0A0A0A" }}>
      <div className="flex items-center gap-2 mr-4 flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="3" stroke="#BFFF00" strokeWidth="1.5"/>
          <path d="M7 13l4-4 4 4 6-6" stroke="#BFFF00" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="text-white font-bold tracking-tight text-sm">MACRO</span>
        <span className="text-lime-400 font-bold tracking-tight text-sm">TRADING</span>
      </div>
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="relative group flex-shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white rounded-md hover:bg-white/5 transition-colors">
            {group.label}
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div className="absolute top-full left-0 mt-1 min-w-[180px] rounded-xl border border-white/10 shadow-2xl pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 z-50" style={{ background: "#111112" }}>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={"flex items-center justify-between px-4 py-2.5 text-xs first:rounded-t-xl last:rounded-b-xl transition-colors " + (currentPath === item.href ? "text-lime-400 bg-lime-400/5" : "text-neutral-300 hover:bg-white/5 hover:text-white")}
              >
                <div className="flex items-center gap-2">
                  {item.emoji && <span className="text-sm">{item.emoji}</span>}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-lime-400/10 text-lime-400">
                    <span className="w-1 h-1 rounded-full bg-lime-400 animate-pulse inline-block"/>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
