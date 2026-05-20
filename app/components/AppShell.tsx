"use client";

import { useEffect, useState } from "react";
import NavBar from "./NavBar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [path, setPath] = useState("/");
  useEffect(() => { setPath(window.location.pathname); }, []);
  return (
    <>
      <NavBar />
      <div className="flex-1">{children}</div>
    </>
  );
}
