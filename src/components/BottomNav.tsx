/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Home, CalendarDays, Calculator, User } from "lucide-react";

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home", label: "홈", icon: Home },
    { id: "weekly", label: "식단표", icon: CalendarDays },
    { id: "nutrition", label: "영양계산", icon: Calculator },
    { id: "profile", label: "프로필", icon: User },
  ];

  return (
    <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[#EEF0EA] bg-[#FAF7EF]/95 pb-safe backdrop-blur-lg md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-0.5 px-4 py-2 transition-all duration-200 active:scale-90 ${
              isActive
                ? "text-[#4F6F00] font-bold"
                : "text-[#747967] hover:text-[#4F6F00]"
            }`}
          >
            <div
              className={`flex items-center justify-center rounded-xl p-1.5 transition-all ${
                isActive ? "bg-[#DDE8B2]/60 text-[#4F6F00]" : "text-[#747967]"
              }`}
            >
              <Icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
            </div>
            <span className="text-[11px] font-sans tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
