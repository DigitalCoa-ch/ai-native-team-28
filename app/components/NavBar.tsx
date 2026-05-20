"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const NAV_ITEMS = [
  { label: "HOME",   href: "/",      emoji: "🏠" },
  { label: "NEWS",   href: "/news",  emoji: "📡" },
  { label: "BULLISH",href: "/bullish"},
  { label: "BEARISH",href: "/bearish"},
  { label: "ALERTS", href: "/alerts"},
  { label: "ABOUT",  href: "/about", emoji: "ℹ️"  },
];

// Light mode uses blue (#1D4ED8), dark mode uses lime (#BFFF00)
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-4 py-3 border-l transition-all duration-150"
      style={{
        borderColor: "var(--border)",
        background: "transparent",
        color: isLight ? "#1D4ED8" : "#9CA3AF",
      }}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      aria-label="Toggle theme"
    >
      {isLight ? (
        // Moon icon (dark mode)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      ) : (
        // Sun icon (light mode)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      )}
      <span className="text-xs font-bold tracking-widest">
        {isLight ? "DARK" : "LIGHT"}
      </span>
    </button>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Theme-aware colors
  const navBg   = isLight ? "#FFFFFF" : "#0A0A0A";
  const borderColor = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
  const activeColor = isLight ? "#1D4ED8" : "#BFFF00";
  const textMuted   = isLight ? "#94A3B8" : "#6B7280";
  const textDefault = isLight ? "#475569" : "#9CA3AF";
  const hoverBg     = isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)";

  return (
    <nav
      className="flex items-center gap-0 px-4 py-0 border-b z-50 flex-shrink-0"
      style={{ background: navBg, borderColor, borderBottomWidth: 1, borderBottomStyle: "solid" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 mr-6 flex-shrink-0 py-3 pr-6"
        style={{ borderRightColor: borderColor, borderRightWidth: 1, borderRightStyle: "solid" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="3" stroke={activeColor} strokeWidth="1.5"/>
          <path d="M7 13l4-4 4 4 6-6" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="font-bold tracking-tight text-sm" style={{ color: isLight ? "#0F172A" : "#FFFFFF" }}>MACRO</span>
        <span className="font-bold tracking-tight text-sm" style={{ color: activeColor }}>TRADING</span>
      </div>

      {/* Nav buttons */}
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-widest transition-all duration-150 border-b-2 flex-shrink-0"
            style={{
              color: isActive ? activeColor : textDefault,
              borderBottomColor: isActive ? activeColor : "transparent",
              background: isActive ? (isLight ? "rgba(29,78,216,0.05)" : "rgba(191,255,0,0.05)") : "transparent",
            }}
          >
            {item.emoji && <span className="text-sm">{item.emoji}</span>}
            {item.label}
            {item.label === "ALERTS" && (
              <span
                className="flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ml-1"
                style={{ background: `${activeColor}18`, color: activeColor }}
              >
                <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: activeColor }}/>
                LIVE
              </span>
            )}
          </Link>
        );
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Status indicator */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderLeftColor: borderColor, borderLeftWidth: 1, borderLeftStyle: "solid" }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: activeColor }}/>
        <span className="text-[10px] font-mono tracking-widest" style={{ color: textMuted }}>LIVE</span>
      </div>
    </nav>
  );
}