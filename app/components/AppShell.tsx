"use client";

import { ThemeProvider } from "./ThemeProvider";
import NavBar from "./NavBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NavBar />
      <div className="flex-1">{children}</div>
    </ThemeProvider>
  );
}