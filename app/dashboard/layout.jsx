"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("connect4x:user");
    if (!stored) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="app-container">
      <aside className="left-sidebar">
        <LeftSidebar activePath={pathname} />
      </aside>
      <section>{children}</section>
      <aside className="right-sidebar">
        <RightSidebar />
      </aside>
    </div>
  );
}
