/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Utensils, Bell, Settings, User } from "lucide-react";

interface AppHeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
}

export default function AppHeader({
  currentTab,
  onTabChange,
  onNotificationClick,
  onSettingsClick,
}: AppHeaderProps) {
  const tabs = [
    { id: "home", label: "홈" },
    { id: "weekly", label: "식단표" },
    { id: "nutrition", label: "영양계산" },
    { id: "profile", label: "프로필" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EEF0EA] bg-[#FAF7EF]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo & School Name */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange("home")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F6F00] text-white">
            <Utensils size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-[#4F6F00]">
            씨마스고등학교 급식
          </span>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-4 py-2 text-[15px] font-medium transition-all rounded-full ${
                  isActive
                    ? "bg-[#4F6F00] text-white shadow-sm"
                    : "text-[#2A241A] hover:bg-[#EEF0EA] hover:text-[#4F6F00]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Utility Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNotificationClick}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#4F6F00] hover:bg-[#EEF0EA]/60 active:scale-95 transition-all relative"
            title="알림"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </button>
          
          <button
            onClick={onSettingsClick || (() => onTabChange("profile"))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#4F6F00] hover:bg-[#EEF0EA]/60 active:scale-95 transition-all"
            title="설정"
          >
            <Settings size={20} />
          </button>

          <button
            onClick={() => onTabChange("profile")}
            className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-[#white] bg-[#DDE8B2] hover:bg-[#6B7F1A]/20 active:scale-95 transition-all ml-1 overflow-hidden border border-[#6B7F1A]/20"
            title="프로필"
          >
            <User size={18} className="text-[#4F6F00]" />
          </button>
        </div>

      </div>
    </header>
  );
}
