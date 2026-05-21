/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { formatKoreanDate } from "../utils";

interface HeroMealCardProps {
  date: Date;
  title: string;
  totalCalories: number;
  description?: string;
  isWeekend?: boolean;
}

export default function HeroMealCard({
  date,
  title,
  totalCalories,
  description = "씨마스고등학교 영양 조리실에서 정성을 가득 담아 조리한 영양 균형 식단입니다. 친환경 식재료를 사용해 맛과 건강을 모두 챙겼습니다.",
  isWeekend = false,
}: HeroMealCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  // Tonkatsu tray image from users mockups
  const imageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAzcityJvqPnZoPBGH3AZeuX4uzghSnFhkx5Z8TqoEdx0ldi6UY9VGyFwlJKSdqYjQGkL7P5AREwfrJHybtDSxxh3QoOUtnj30c868EAam8JCM-yxJyUgmj6BXKI3XqKJyar54kSrayekKcCVyT36okKxul1cO_fhUG_41cm9IIIvAv2Z_B6mjNzom95O4NSoQCNaPzML4AnprzQJcYqwUhxz_Br4X6s5bcqobWp1qspKkxeM5c13W2u2I8DH3YROf55b2yOJus_yQ";

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="hero-meal-card overflow-hidden rounded-[24px] border border-[#EEF0EA] bg-white shadow-[0_8px_30px_rgb(79,111,0,0.05)] transition-all hover:shadow-[0_12px_40px_rgb(79,111,0,0.08)]">
      <div className="flex flex-col md:grid md:grid-cols-2 md:items-stretch">
        
        {/* Left / Top side: Image Cover */}
        <div className="relative min-h-[170px] sm:min-h-[220px] md:h-full w-full bg-slate-100">
          <img
            src={imageUrl}
            alt="오늘의 추천 급식"
            className="absolute inset-0 h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Tag / Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="rounded-full bg-[#6B7F1A] px-3.5 py-1 text-[11px] font-bold text-white shadow-sm ring-1 ring-white/10">
              오늘의 추천 급식
            </span>
            {isWeekend && (
              <span className="rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold text-white shadow-sm ring-1 ring-white/10">
                다음 급식일
              </span>
            )}
          </div>

          {/* Heart button inside visual on mobile, floating on right */}
          <div className="absolute bottom-4 right-4 md:hidden">
            <button
              onClick={handleLikeToggle}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition-all active:scale-90 ${
                isLiked
                  ? "bg-red-500 text-white"
                  : "bg-white/20 text-white hover:bg-white/40"
              }`}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Title Overlay for mobile only */}
          <div className="absolute bottom-4 left-4 right-16 md:hidden">
            <p className="text-xs text-white/80">{formatKoreanDate(date)}</p>
            <h3 className="font-sans text-lg font-bold text-white drop-shadow-sm sm:text-xl">
              {title}
            </h3>
          </div>
        </div>

        {/* Right / Bottom side: Content Details */}
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div className="space-y-4">
            
            {/* Desktop header metadata */}
            <div className="hidden md:flex items-center justify-between">
              <span className="text-sm font-semibold text-[#6B7F1A]">
                {formatKoreanDate(date)}
              </span>
              <button
                onClick={handleLikeToggle}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-90 ${
                  isLiked
                    ? "bg-red-500 text-white border-red-500"
                    : "border-[#EEF0EA] bg-[#FAF7EF] text-[#6B7F1A] hover:bg-[#EEF0EA]"
                }`}
                title="찜하기"
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Main title for desktop */}
            <div className="hidden md:block">
              <h2 className="font-sans text-2xl font-bold tracking-tight text-[#2A241A] lg:text-3xl">
                {title}
              </h2>
            </div>

            {/* Description Text */}
            <p className="text-[14px] leading-relaxed text-[#747967] md:text-[15px]">
              {description}
            </p>

            {/* Calorie indicators */}
            <div className="flex items-center gap-4 rounded-xl bg-[#FAF7EF] p-4.5 border border-[#EEF0EA]">
              <div>
                <span className="block text-[11px] font-semibold text-[#747967]">총 칼로리</span>
                <span className="text-xl font-bold text-[#4F6F00]">{totalCalories} <span className="text-xs font-normal text-[#747967]">kcal</span></span>
              </div>
              <div className="h-8 w-px bg-[#EEF0EA]"></div>
              <div>
                <span className="block text-[11px] font-semibold text-[#747967]">권장 대비</span>
                <span className="text-sm font-semibold text-[#6B7F1A]">안정적 (적정 비율)</span>
              </div>
            </div>

          </div>

          <div className="mt-5 flex items-center justify-between md:mt-0">
            <span className="text-xs font-medium text-[#747967] hidden md:inline">
              * 조리실 상황에 따라 메뉴가 일부 변경될 수 있습니다.
            </span>
            <button 
              onClick={handleLikeToggle}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all border md:inline hidden ${
                isLiked 
                  ? "bg-red-500 text-white border-red-500 hover:bg-red-600" 
                  : "bg-[#4F6F00] text-white border-[#4F6F00] hover:bg-[#6B7F1A]"
              }`}
            >
              {isLiked ? '♥ 찜하기 완료' : '♡ 식단 찜하기'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
