"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "HOME",     href: "/",       emoji: "🏠" },
  { label: "NEWS",     href: "/news",   emoji: "📡" },
  { label: "BULLISH",  href: "/bullish" },
  { label: "BEARISH",  href: "/bearish" },
  { label: "ALERTS",   href: "/alerts" },
  { label: "ABOUT",    href: "/about",  emoji: "ℹ️"  },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center gap-0 px-4 py-0 border-b border-white/10 z-50 flex-shrink-0"
      style={{ background: "#0A0A0A" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-6 flex-shrink-0 py-3 pr-6 border-r border-white/10">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="3" stroke="#BFFF00" strokeWidth="1.5"/>
          <path d="M7 13l4-4 4 4 6-6" stroke="#BFFF00" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="text-white font-bold tracking-tight text-sm">MACRO</span>
        <span className="text-lime-400 font-bold tracking-tight text-sm">TRADING</span>
      </div>

      {/* Nav buttons — always visible, no dropdown */}
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-widest transition-all duration-150
              border-b-2 flex-shrink-0
              ${isActive
                ? "text-lime-400 border-lime-400 bg-lime-400/5"
                : "text-neutral-500 border-transparent hover:text-neutral-200 hover:bg-white/5"
              }
            `}
          >
            {item.emoji && <span className="text-sm">{item.emoji}</span>}
            {item.label}
            {item.label === "ALERTS" && (
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-lime-400/10 text-lime-400 ml-1">
                <span className="w-1 h-1 rounded-full bg-lime-400 animate-pulse inline-block"/>
                LIVE
              </span>
            )}
          </Link>
        );
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Status indicator */}
      <div className="flex items-center gap-2 px-4 py-3 border-l border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse inline-block" />
        <span className="text-[10px] font-mono text-neutral-500 tracking-widest">LIVE</span>
      </div>
    </nav>
  );
}
