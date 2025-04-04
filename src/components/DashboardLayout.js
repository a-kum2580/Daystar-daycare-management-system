import React from "react";
import { SideBar } from "./SideBar";

export function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout; 